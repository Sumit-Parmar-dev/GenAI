# scraper.py

from playwright.sync_api import sync_playwright
import time
import random

HEADERS = {
    "User-Agent": "Mozilla/5.0"
}


class LeadScraper:

    def __init__(self):
        self.leads = []

    def start_browser(self):
        self.playwright = sync_playwright().start()
        self.browser = self.playwright.chromium.launch(headless=True)
        self.page = self.browser.new_page()

    def close_browser(self):
        self.browser.close()
        self.playwright.stop()

    # -----------------------------
    # REDDIT
    # -----------------------------

    def scrape_reddit(self):

        print("[Scraper] Searching Reddit for hiring threads...")

        try:

            url = "https://www.reddit.com/search/?q=looking%20for%20developer"

            self.page.goto(url, timeout=0)

            posts = self.page.query_selector_all("h3")

            for post in posts[:10]:

                title = post.inner_text()

                self.leads.append({
                    "title": title,
                    "description": title,
                    "source": "reddit"
                })

        except Exception as e:

            print("[Reddit] failed:", e)

    # -----------------------------
    # FREELANCER
    # -----------------------------

    def scrape_freelancer(self):

        print("[Scraper] Searching Freelancer.com for tech projects...")

        try:

            url = "https://www.freelancer.com/jobs/website-design/"

            self.page.goto(url, timeout=0)

            jobs = self.page.query_selector_all("h2")

            for job in jobs[:10]:

                title = job.inner_text()

                self.leads.append({
                    "title": title,
                    "description": title,
                    "source": "freelancer"
                })

        except Exception as e:

            print("[Freelancer] failed:", e)

    # -----------------------------
    # UPWORK
    # -----------------------------

    def scrape_upwork(self):

        print("[Scraper] Searching Upwork for tech projects...")

        try:

            url = "https://www.upwork.com/nx/search/jobs/?q=website%20development"

            self.page.goto(url, timeout=0)

            jobs = self.page.query_selector_all("h4")

            for job in jobs[:10]:

                title = job.inner_text()

                self.leads.append({
                    "title": title,
                    "description": title,
                    "source": "upwork"
                })

        except Exception as e:

            print("[Upwork] failed:", e)

    # -----------------------------
    # INDIEHACKERS
    # -----------------------------

    def scrape_indiehackers(self):

        print("[Scraper] Searching IndieHackers...")

        try:

            url = "https://www.indiehackers.com"

            self.page.goto(url, timeout=0)

            posts = self.page.query_selector_all("h2")

            for post in posts[:10]:

                title = post.inner_text()

                self.leads.append({
                    "title": title,
                    "description": title,
                    "source": "indiehackers"
                })

        except Exception as e:

            print("[IndieHackers] failed:", e)

    # -----------------------------
    # PRODUCT HUNT
    # -----------------------------

    def scrape_producthunt(self):

        print("[Scraper] Searching Product Hunt launches...")

        try:

            url = "https://www.producthunt.com"

            self.page.goto(url, timeout=0)

            products = self.page.query_selector_all("h3")

            for product in products[:10]:

                title = product.inner_text()

                self.leads.append({
                    "title": title,
                    "description": title,
                    "source": "producthunt"
                })

        except Exception as e:

            print("[ProductHunt] failed:", e)

    # -----------------------------
    # Y COMBINATOR REQUESTS
    # -----------------------------

    def scrape_yc(self):

        print("[Scraper] Searching YC founder requests...")

        try:

            url = "https://www.ycombinator.com/companies"

            self.page.goto(url, timeout=0)

            companies = self.page.query_selector_all("h3")

            for company in companies[:10]:

                name = company.inner_text()

                self.leads.append({
                    "title": f"{name} startup building product",
                    "description": name,
                    "company": name,
                    "source": "yc"
                })

        except Exception as e:

            print("[YC] failed:", e)

    # -----------------------------
    # ANGELLIST
    # -----------------------------

    def scrape_angellist(self):

        print("[Scraper] Searching AngelList jobs...")

        try:

            url = "https://wellfound.com/jobs"

            self.page.goto(url, timeout=0)

            jobs = self.page.query_selector_all("h2")

            for job in jobs[:10]:

                title = job.inner_text()

                self.leads.append({
                    "title": title,
                    "description": title,
                    "source": "angellist"
                })

        except Exception as e:

            print("[AngelList] failed:", e)

    # -----------------------------
    # RUN ALL SCRAPERS
    # -----------------------------

    def run(self):

        print("[SCRAPER] cycle started")

        self.start_browser()

        self.scrape_reddit()
        self.scrape_indiehackers()
        self.scrape_producthunt()
        self.scrape_freelancer()
        self.scrape_upwork()
        self.scrape_yc()
        self.scrape_angellist()

        self.close_browser()

        print(f"[SCRAPER] leads collected: {len(self.leads)}")

        return self.leads


if __name__ == "__main__":

    scraper = LeadScraper()

    leads = scraper.run()

    print(leads)