# cleaner.py

import re


EMAIL_REGEX = r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+"


INTENT_KEYWORDS = [
    "build",
    "develop",
    "create",
    "design",
    "looking for",
    "need developer",
    "need designer",
    "build website",
    "build app",
    "build saas",
    "build platform",
    "build ai",
    "mobile app",
    "web app",
    "landing page",
    "shopify",
    "wordpress"
]


REJECT_KEYWORDS = [
    "funding",
    "raised",
    "investment",
    "guide",
    "tutorial",
    "story",
    "case study",
    "launch story"
]


def extract_email(text):

    emails = re.findall(EMAIL_REGEX, text)

    if emails:
        return emails[0]

    return None


def classify_intent(text):

    text = text.lower()

    if "website" in text:
        return "Build Website"

    if "mobile app" in text:
        return "Build App"

    if "saas" in text:
        return "Build SaaS"

    if "designer" in text:
        return "Need Designer"

    if "developer" in text:
        return "Need Developer"

    if "ai" in text:
        return "AI Project"

    return "General Build"


def is_valid_lead(text):

    text = text.lower()

    for reject in REJECT_KEYWORDS:
        if reject in text:
            return False

    for keyword in INTENT_KEYWORDS:
        if keyword in text:
            return True

    return False


def clean_leads(raw_leads):

    cleaned = []

    for lead in raw_leads:

        title = lead.get("title", "")
        description = lead.get("description", "")

        combined = f"{title} {description}"

        if not is_valid_lead(combined):

            print(f"[Cleaner] Intent filter caught (not hiring): {title[:40]}")

            continue

        email = lead.get("email")

        if not email:
            email = extract_email(description)

        intent = classify_intent(combined)

        cleaned_lead = {
            "name": lead.get("name"),
            "email": email,
            "company": lead.get("company"),
            "website": lead.get("website"),
            "projectTitle": title,
            "projectDescription": description,
            "leadIntent": intent,
            "techStack": lead.get("techStack"),
            "budgetRange": lead.get("budget"),
            "country": lead.get("country"),
            "linkedinFounderUrl": lead.get("linkedin"),
            "source": lead.get("source")
        }

        cleaned.append(cleaned_lead)

    print(f"[Cleaner] {len(cleaned)} leads passed filters.")

    return cleaned