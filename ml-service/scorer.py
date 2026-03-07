"""
LeadIQ Scoring Engine
Startup Project Lead Intelligence
"""

from dataclasses import dataclass


@dataclass
class ScoreResult:
    score: int
    category: str
    reason: str
    insight: str
    email_draft: str


# --------------------------------

def score_source(source):

    weights = {
        "yc": 15,
        "angellist": 12,
        "producthunt": 10,
        "indiehackers": 8,
        "reddit": 5,
        "freelancer": 5,
        "upwork": 3
    }

    return weights.get(source.lower(), 3)


# --------------------------------

def score_budget(budget_value):

    if budget_value > 5000:
        return 15

    if budget_value > 1000:
        return 10

    if budget_value > 200:
        return 5

    if budget_value > 0 and budget_value < 50:
        return -15

    return 0


# --------------------------------

def score_contact(email, linkedin, website):

    score = 0

    if email:
        score += 8

    if linkedin:
        score += 7

    if website:
        score += 5

    return score


# --------------------------------

def score_requirement(title, desc):

    text = (title + " " + desc).lower()

    score = 0

    # startup signals
    startup_words = ["startup", "mvp", "launch", "build product", "saas"]

    if any(w in text for w in startup_words):
        score += 10

    # ai projects
    if "ai" in text or "machine learning" in text:
        score += 15

    # tech complexity
    complexity = [
        "api",
        "dashboard",
        "automation",
        "integration",
        "crm",
        "portal"
    ]

    if any(w in text for w in complexity):
        score += 10

    # description detail
    if len(desc) > 300:
        score += 10

    elif len(desc) > 120:
        score += 5

    return score


# --------------------------------

def categorize(score):

    if score >= 75:
        return "HOT"

    if score >= 55:
        return "WARM"

    return "COLD"


# --------------------------------

def build_insight(score, category, company, project):

    if category == "HOT":

        return (
            f"🔥 HOT LEAD: {company} is actively building "
            f"{project}. Score {score}. Immediate outreach recommended."
        )

    if category == "WARM":

        return (
            f"✨ WARM LEAD: {company} has a solid project "
            f"({project}). Score {score}. Worth contacting."
        )

    return (
        f"❄️ COLD LEAD: {company} is a low priority lead."
    )


# --------------------------------

def build_email_draft(company, project, tech):

    name = company if company and company != "Unknown" else "there"

    return f"""
Subject: Help building your {project}

Hi {name},

I saw you're working on {project} and thought I'd reach out.

I help startups build products quickly using modern stacks like {tech}.
If you're still looking for help launching or improving the project,
I'd love to chat.

Best,
[Your Name]
"""


# --------------------------------

def score_lead(
    name,
    company,
    project_title,
    project_description,
    tech_stack,
    budget_range,
    budget_value,
    country,
    source,
    email=None,
    linkedin=None,
    website=None,
    domain_penalty=0
):

    score = 40  # baseline

    score += score_source(source)

    score += score_budget(budget_value)

    score += score_contact(email, linkedin, website)

    score += score_requirement(project_title, project_description)

    score -= domain_penalty

    score = max(0, min(100, score))

    category = categorize(score)

    reason = (
        f"Source:{source}, Budget:{budget_value}, "
        f"Tech:{tech_stack}"
    )

    insight = build_insight(score, category, company, project_title)

    email_draft = build_email_draft(company, project_title, tech_stack)

    return ScoreResult(
        score=score,
        category=category,
        reason=reason,
        insight=insight,
        email_draft=email_draft
    )