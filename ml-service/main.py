from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from scorer import score_lead

app = FastAPI(
    title="LeadIQ ML Scoring Service",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class LeadInput(BaseModel):

    email: Optional[str] = None
    company: Optional[str] = None
    website: Optional[str] = None
    domain: Optional[str] = None

    projectTitle: str
    projectDescription: str

    projectUrl: Optional[str] = None
    techStack: Optional[str] = None

    budgetValue: Optional[float] = 0.0

    location: Optional[str] = None
    source: str

    linkedinUrl: Optional[str] = None
    linkedinFounderUrl: Optional[str] = None

    domainPenalty: Optional[int] = 0

    notes: Optional[str] = None
    status: Optional[str] = None


class ScoreOutput(BaseModel):

    score: int
    category: str
    reason: str
    insight: str
    emailDraft: str


@app.get("/health")
def health():

    return {
        "status": "ok",
        "service": "LeadIQ ML Scoring"
    }


@app.post("/score", response_model=ScoreOutput)
def score(lead: LeadInput):

    result = score_lead(
        name=lead.company or "Founder",
        company=lead.company or "Unknown",

        project_title=lead.projectTitle,
        project_description=lead.projectDescription,

        tech_stack=lead.techStack or "Unknown",

        budget_range="N/A",
        budget_value=lead.budgetValue or 0.0,

        country=lead.location or "Remote",

        source=lead.source,

        email=lead.email,
        linkedin=lead.linkedinUrl or lead.linkedinFounderUrl,
        website=lead.website,

        domain_penalty=lead.domainPenalty or 0
    )

    return ScoreOutput(
        score=result.score,
        category=result.category,
        reason=result.reason,
        insight=result.insight,
        emailDraft=result.email_draft
    )