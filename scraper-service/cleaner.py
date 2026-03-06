import re

def clean_company_name(name):
    if not name: return ""
    # Remove common suffixes and junk
    name = re.sub(r' (Inc\.|LLC|Corp\.|Ltd\.?|AI|SaaS)$', '', name, flags=re.IGNORECASE)
    return name.strip()

def validate_email(email):
    if not email: return None
    email = email.lower().strip()
    # abc
    blacklist = ["example", "test", "noreply", "no-reply", "support@", "info@", "admin@"]
    if any(word in email for word in blacklist):
        return None
        
    pattern = r'^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$'
    if re.match(pattern, email):
        return email
    return None

def normalize_lead(lead):
    """Normalize lead data for database ingestion"""
    name = lead.get("company_name") or lead.get("company") or "Unknown Company"
    return {
        "name": lead.get("founder_name") or "Contact",
        "email": validate_email(lead.get("email")),
        "company": clean_company_name(name),
        "website": lead.get("website"),
        "industry": lead.get("industry"),
        "jobRole": lead.get("jobRole"),
        "companySize": lead.get("companySize"),
        "techStack": lead.get("techStack"),
        "funding": lead.get("funding"),
        "location": lead.get("location"),
        "linkedinUrl": lead.get("linkedinUrl"),
        "linkedinFounderUrl": lead.get("linkedinFounderUrl"),
        "source": lead.get("source") or "Scraper",
        "notes": lead.get("notes"),
        "userId": 1 # Default assigned user
    }
