"""
Lead Scoring Engine — 5 signal dimensions, each contributing 0–20 pts (total 0–100)
"""

from dataclasses import dataclass
from typing import Optional
import re

# ── Signal weights (each max 20) ────────────────────────────────────────────

HOT_INDUSTRIES = {"technology", "tech", "finance", "financial", "banking", "healthcare",
                  "health", "pharma", "pharmaceutical", "software", "saas", "ai",
                  "artificial intelligence", "cybersecurity"}
WARM_INDUSTRIES = {"retail", "education", "media", "marketing", "consulting",
                   "insurance", "real estate", "manufacturing", "logistics"}

SENIOR_TITLES = {"ceo", "cto", "coo", "cfo", "founder", "co-founder", "president",
                 "vp", "vice president", "svp", "evp", "head of", "chief"}
MID_TITLES = {"director", "manager", "lead", "principal", "senior"}

HOT_SOURCES = {"referral"}
WARM_SOURCES = {"linkedin", "partner", "event", "conference"}
MED_SOURCES = {"website", "organic", "seo"}

URGENCY_KEYWORDS = ["urgent", "asap", "immediately", "right away", "need now",
                    "demo", "trial", "pilot", "poc", "proof of concept",
                    "budget approved", "budget available", "ready to buy",
                    "ready to implement", "looking to", "interested in purchasing",
                    "evaluate", "shortlist", "decision", "deadline"]


def score_budget(budget: Optional[float]) -> tuple[int, str]:
    if budget is None:
        return 5, "No budget specified"
    if budget >= 100_000:
        return 20, f"Very high budget (${budget:,.0f})"
    if budget >= 50_000:
        return 17, f"High budget (${budget:,.0f})"
    if budget >= 10_000:
        return 13, f"Moderate budget (${budget:,.0f})"
    if budget >= 1_000:
        return 8, f"Small budget (${budget:,.0f})"
    return 3, f"Very low budget (${budget:,.0f})"


def score_industry(industry: Optional[str]) -> tuple[int, str]:
    if not industry:
        return 7, "Industry not specified"
    norm = industry.lower().strip()
    if any(h in norm for h in HOT_INDUSTRIES):
        return 20, f"{industry} is a high-value industry"
    if any(w in norm for w in WARM_INDUSTRIES):
        return 12, f"{industry} is a moderate-value industry"
    return 7, f"{industry} is a standard industry"


def score_job_role(job_role: Optional[str]) -> tuple[int, str]:
    if not job_role:
        return 7, "Job role not specified"
    norm = job_role.lower().strip()
    if any(s in norm for s in SENIOR_TITLES):
        return 20, f"{job_role} is a senior decision-maker"
    if any(m in norm for m in MID_TITLES):
        return 13, f"{job_role} has purchasing influence"
    return 7, f"{job_role} has limited direct buying authority"


def score_source(source: Optional[str]) -> tuple[int, str]:
    if not source:
        return 6, "Unknown source"
    norm = source.lower().strip()
    if any(h in norm for h in HOT_SOURCES):
        return 20, f"Referral leads have highest conversion rates"
    if any(w in norm for w in WARM_SOURCES):
        return 16, f"{source} is a high-quality inbound channel"
    if any(m in norm for m in MED_SOURCES):
        return 12, f"{source} is an organic inbound channel"
    return 6, f"{source} is a standard acquisition channel"


def score_engagement(notes: Optional[str]) -> tuple[int, str]:
    if not notes:
        return 0, "No engagement notes provided"
    norm = notes.lower()
    hits = [kw for kw in URGENCY_KEYWORDS if kw in norm]
    if len(hits) >= 3:
        return 20, f"Strong buying signals: {', '.join(hits[:3])}"
    if len(hits) == 2:
        return 15, f"Clear buying intent: {', '.join(hits)}"
    if len(hits) == 1:
        return 8, f"Some engagement signal: {hits[0]}"
    return 2, "Notes provided but no strong buying signals detected"


@dataclass
class ScoreResult:
    score: int
    category: str
    reason: str
    insight: str
    email_draft: str


def categorize(score: int) -> str:
    if score >= 70:
        return "Hot"
    if score >= 40:
        return "Warm"
    return "Cold"


def build_reason(budget_note, industry_note, role_note, source_note, eng_note,
                 budget_pts, industry_pts, role_pts, source_pts, eng_pts) -> str:
    parts = []
    if budget_pts >= 17:
        parts.append(budget_note)
    if industry_pts >= 17:
        parts.append(industry_note)
    if role_pts >= 17:
        parts.append(role_note)
    if source_pts >= 16:
        parts.append(source_note)
    if eng_pts >= 8:
        parts.append(eng_note)
    if not parts:
        parts = [budget_note, industry_note]
    return ". ".join(parts) + "."


def build_insight(score: int, category: str, name: str, company: Optional[str]) -> str:
    target = company or "their organization"
    if category == "Hot":
        return (f"{name} at {target} shows strong purchase intent and senior authority. "
                "Prioritize immediate outreach — schedule a demo or discovery call within 24 hours.")
    if category == "Warm":
        return (f"{name} at {target} is a promising lead with moderate engagement. "
                "Nurture with value-driven content and follow up within 3–5 business days.")
    return (f"{name} at {target} is an early-stage lead. "
            "Add to a long-term nurture sequence and re-evaluate after further engagement.")


def build_email_draft(name: str, job_role: Optional[str], company: Optional[str],
                      category: str, industry: Optional[str]) -> str:
    first_name = name.split()[0] if name else "there"
    role = job_role or "professional"
    org = company or "your organization"
    ind = industry or "your industry"

    if category == "Hot":
        return (
            f"Subject: Quick question about {org}'s goals\n\n"
            f"Hi {first_name},\n\n"
            f"I noticed you're a {role} at {org} — exciting work in {ind}.\n\n"
            f"We've helped similar companies achieve measurable results quickly, "
            f"and based on your profile, I think we could do the same for you.\n\n"
            f"Would you be open to a 20-minute call this week to explore if there's a fit?\n\n"
            f"Best,\n[Your Name]"
        )
    if category == "Warm":
        return (
            f"Subject: Helping {org} with {ind} challenges\n\n"
            f"Hi {first_name},\n\n"
            f"As a {role}, you're likely navigating some complex decisions in {ind} right now.\n\n"
            f"I'd love to share a few resources that have helped similar teams — "
            f"no strings attached.\n\n"
            f"Would that be useful? Happy to send them over.\n\n"
            f"Best,\n[Your Name]"
        )
    return (
        f"Subject: A resource for {role}s in {ind}\n\n"
        f"Hi {first_name},\n\n"
        f"I came across your profile and thought you might find this relevant to "
        f"what teams like yours are working on in {ind}.\n\n"
        f"Feel free to reach out if you'd like to chat — no pressure at all.\n\n"
        f"Best,\n[Your Name]"
    )


def score_lead(
    name: str,
    budget: Optional[float] = None,
    industry: Optional[str] = None,
    job_role: Optional[str] = None,
    source: Optional[str] = None,
    notes: Optional[str] = None,
    company: Optional[str] = None,
    **kwargs,
) -> ScoreResult:
    b_pts, b_note = score_budget(budget)
    i_pts, i_note = score_industry(industry)
    r_pts, r_note = score_job_role(job_role)
    s_pts, s_note = score_source(source)
    e_pts, e_note = score_engagement(notes)

    total = b_pts + i_pts + r_pts + s_pts + e_pts
    category = categorize(total)
    reason = build_reason(b_note, i_note, r_note, s_note, e_note,
                          b_pts, i_pts, r_pts, s_pts, e_pts)
    insight = build_insight(total, category, name, company)
    email_draft = build_email_draft(name, job_role, company, category, industry)

    return ScoreResult(
        score=total,
        category=category,
        reason=reason,
        insight=insight,
        email_draft=email_draft,
    )
