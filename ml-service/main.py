from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from scorer import score_lead

app = FastAPI(title="LeadIQ ML Scoring Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class LeadInput(BaseModel):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    jobRole: Optional[str] = None
    industry: Optional[str] = None
    budget: Optional[float] = None
    source: Optional[str] = None
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
    return {"status": "ok", "service": "LeadIQ ML Scoring"}


@app.post("/score", response_model=ScoreOutput)
def score(lead: LeadInput):
    result = score_lead(
        name=lead.name,
        budget=lead.budget,
        industry=lead.industry,
        job_role=lead.jobRole,
        source=lead.source,
        notes=lead.notes,
        company=lead.company,
    )
    return ScoreOutput(
        score=result.score,
        category=result.category,
        reason=result.reason,
        insight=result.insight,
        emailDraft=result.email_draft,
    )
