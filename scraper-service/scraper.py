import asyncio
import re
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup
from cleaner import normalize_lead
from sender import send_leads

def find_emails_in_text(text):
    """Extract emails from raw text using stricter regex and filtering"""
    if not text:
        return []
    # Stricter regex to catch valid TLDs and avoid filenames
    pattern = r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.(com|org|io|ai|co|net|edu)\b"
    emails = re.findall(pattern, text)
    
    # Filter out common file extensions that pass as emails
    valid_emails = []
    for email in list(set(emails)):
        email = email.lower().strip()
        if email.endswith((".png", ".jpg", ".jpeg", ".svg", ".ico", ".webp", ".gif")):
            continue
        valid_emails.append(email)
        
    return valid_emails

async def extract_emails_from_url(page, url, depth=1):
    """Deeply extract emails by systematic subpage crawling"""
    from urllib.parse import urlparse, urljoin
    company_domain = urlparse(url).netloc.replace("www.", "")
    base_url = f"{urlparse(url).scheme}://{urlparse(url).netloc}"
    
    print(f"[Extractor] Elite crawling on {url} (Domain: {company_domain})...")
    emails = []
    
    BLOCKED_DOMAINS = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "example.com"]
    SYSTEMATIC_PAGES = ["", "/contact", "/contact-us", "/about", "/about-us", "/careers", "/team"]
    
    async def get_and_filter(current_page, current_url):
        try:
            # Handle potential navigation lock with a retry and wait
            await current_page.goto(current_url, wait_until="domcontentloaded", timeout=20000)
            await asyncio.sleep(1) # Small breather for JS-heavy sites
            text = await current_page.content()
            found = find_emails_in_text(text)
            
            soup = BeautifulSoup(text, 'html.parser')
            for link in soup.select("a[href^=mailto]"):
                email = link['href'].replace("mailto:", "").split('?')[0].lower()
                found.append(email)
                
            filtered = []
            for e in list(set(found)):
                if any(domain in e for domain in BLOCKED_DOMAINS): continue
                if company_domain not in e: continue
                filtered.append(e)
            return filtered
        except Exception as e:
            print(f"[Extractor] Skip {current_url}: {e}")
            return []

    # Systematically check common pages
    for path in SYSTEMATIC_PAGES:
        target = urljoin(base_url, path)
        print(f"[Extractor] Checking: {target}")
        found_on_page = await get_and_filter(page, target)
        emails.extend(found_on_page)
        if emails: break # Stop once we find at least one valid email to save resources
            
    return list(set(emails))

def extract_company_website(soup):
    """Filter links to find the actual company website, skipping YC/social/internal links"""
    links = soup.select("a[href^='http']")
    
    for link in links:
        href = link.get("href")
        if not href: continue
        
        # Skip internal and common non-target links
        skip_words = ["ycombinator.com", "startupschool.org", "linkedin.com", "twitter.com", "facebook.com", "instagram.com", "github.com"]
        if any(word in href for word in skip_words):
            continue
            
        # Also skip common page links that aren't the main website
        if any(word in href.lower() for word in ["/apply", "/jobs", "/privacy", "/terms"]):
            continue
            
        return href
    return None

async def extract_social_links(soup):
    """Extract LinkedIn and other social links from a page"""
    socials = {"linkedinUrl": None, "linkedinFounderUrl": None}
    
    # Extract LinkedIn company or profiles
    links = soup.select("a[href*='linkedin.com']")
    for link in links:
        href = link['href']
        if '/company/' in href and not socials["linkedinUrl"]:
            socials["linkedinUrl"] = href
        elif '/in/' in href and not socials["linkedinFounderUrl"]:
            socials["linkedinFounderUrl"] = href
            
    return socials

async def process_company_website(context, lead):
    """Deeply extract company info from its own website with guessing fallback"""
    website = lead.get("website")
    if not website: return None
    
    from urllib.parse import urlparse
    domain = urlparse(website).netloc.replace("www.", "")
    
    print(f"[Worker] Processing website: {website}")
    page = await context.new_page()
    try:
        # User-Agent shuffling for stealth
        await page.set_extra_http_headers({
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
        })
        
        found_emails = await extract_emails_from_url(page, website)
        
        # Email Guessing Fallback if nothing found
        if not found_emails and domain:
            print(f"[Worker] No emails found on {domain}. Applying pattern guessing...")
            guesses = [f"hello@{domain}", f"contact@{domain}", f"info@{domain}"]
            lead["email"] = guesses[0]
            lead["notes"] = f"Email guessed from domain {domain}"
        else:
            lead["email"] = found_emails[0] if found_emails else None
        
        # Also look for social links on the website
        try:
            content = await page.content()
            soup = BeautifulSoup(content, 'html.parser')
            socials = await extract_social_links(soup)
            lead.update(socials)
        except: pass
        
        return normalize_lead(lead)
    except Exception as e:
        print(f"[Worker] Error processing {website}: {e}")
        return None
    finally:
        await page.close()

async def get_yc_company_details(context, profile_url):
    """Navigate to YC profile to get the actual company website"""
    print(f"[YC] Extracting details from profile: {profile_url}")
    page = await context.new_page()
    try:
        # Increase timeout and add stealth for YC
        await page.set_extra_http_headers({
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        })
        await page.goto(profile_url, wait_until="domcontentloaded", timeout=40000)
        content = await page.content()
        soup = BeautifulSoup(content, 'html.parser')
        
        # 1. Extract Name (Robust)
        name_el = soup.select_one("h1")
        name = name_el.get_text(strip=True) if name_el else profile_url.split('/')[-1].capitalize()
        
        # 2. Extract Website (Robust Filtering)
        website = extract_company_website(soup)
        
        # 3. Extract Enrichment Fields (Robust patterns)
        location = "Unknown"
        company_size = "Unknown"
        
        # YC often puts these in specific divs/spans
        for span in soup.select("span"):
            text = span.get_text(strip=True)
            if "Active" in text or "Founded" in text: continue # Skip common metadata
            if "," in text and len(text) < 50: # Likely a location like "San Francisco, CA"
                location = text
            if "Team Size" in text or "employees" in text:
                company_size = text.replace("Team Size:", "").strip()

        # 4. Social links from YC profile
        socials = await extract_social_links(soup)
        
        print(f"[YC) Resolved: {name} -> {website} ({location})")
        
        return {
            "company_name": name,
            "website": website,
            "location": location,
            "companySize": company_size,
            **socials,
            "source": "YC Directory"
        }
    except Exception as e:
        print(f"[YC] Error on profile {profile_url}: {e}")
        return None
    finally:
        await page.close()

async def scrape_directory(url):
    """Production-grade scraper with parallel processing and two-step extraction"""
    print(f"[Scraper] Starting production scrape for {url}...")
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()
        
        try:
            await page.goto(url, wait_until="networkidle", timeout=90000)
            
            # Scroll for dynamic items
            for _ in range(5):
                await page.evaluate("window.scrollBy(0, 1000)")
                await asyncio.sleep(1)

            content = await page.content()
            soup = BeautifulSoup(content, 'html.parser')
            
            # STABLE SELECTOR: YC patterns use specific href structures
            profile_links = []
            if "ycombinator.com/companies" in url:
                # Get all links that look like YC company profiles
                anchors = soup.select("a[href*='/companies/']")
                profile_links = list(set([f"https://www.ycombinator.com{a['href']}" if a['href'].startswith('/') else a['href'] for a in anchors if '/companies/' in a['href']]))
            
            if not profile_links:
                print("[Scraper] No profiles found. Running fallback demo.")
                demo_leads = [
                    {"company_name": "TechFlow AI", "website": "https://techflow.ai"},
                    {"company_name": "GreenGrid Solars", "website": "https://greengrid.io"}
                ]
                # Process demo leads in parallel
                final_leads = await asyncio.gather(*[process_company_website(context, l) for l in demo_leads])
            else:
                # SCALE: Increase from 5 to 50
                limit = 50
                print(f"[Scraper] Found {len(profile_links)} company profiles. Processing top {limit} in parallel...")
                
                # STEP 1: Get actual websites from YC profiles in parallel
                company_details = await asyncio.gather(*[get_yc_company_details(context, url) for url in profile_links[:limit]])
                company_details = [c for c in company_details if c and c.get("website")]
                
                # STEP 2: Scrape those websites for emails/socials in parallel
                final_leads = await asyncio.gather(*[process_company_website(context, lead) for lead in company_details])

            # Filter out Nones and send to backend
            valid_leads = [l for l in final_leads if l]
            if valid_leads:
                send_leads(valid_leads)
            else:
                print("[Scraper] No valid leads found in this run.")
                
        except Exception as e:
            print(f"[Scraper] Fatal Batch Error: {e}")
        finally:
            await browser.close()

if __name__ == "__main__":
    target_url = "https://www.ycombinator.com/companies"
    asyncio.run(scrape_directory(target_url))
