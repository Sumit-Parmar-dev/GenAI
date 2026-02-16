export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  jobRole: string;
  industry: string;
  score: number;
  status: "New" | "Contacted" | "Qualified" | "Converted" | "Lost";
  notes: string;
  phone: string;
  lastActivity: string;
  createdAt: string;
}

export const leads: Lead[] = [
  { id: "1", name: "Sarah Chen", email: "sarah.chen@techcorp.com", company: "TechCorp", jobRole: "VP of Engineering", industry: "Technology", score: 92, status: "Qualified", notes: "Showed interest in enterprise plan", phone: "+1 415-555-0101", lastActivity: "2026-02-08", createdAt: "2026-01-15" },
  { id: "2", name: "Marcus Williams", email: "m.williams@innovatex.io", company: "InnovateX", jobRole: "CTO", industry: "SaaS", score: 87, status: "Contacted", notes: "Requested demo", phone: "+1 212-555-0202", lastActivity: "2026-02-09", createdAt: "2026-01-18" },
  { id: "3", name: "Priya Patel", email: "priya@greenleaf.co", company: "GreenLeaf Co", jobRole: "Head of Operations", industry: "Sustainability", score: 74, status: "New", notes: "Downloaded whitepaper", phone: "+1 650-555-0303", lastActivity: "2026-02-07", createdAt: "2026-01-20" },
  { id: "4", name: "James O'Brien", email: "jobrien@finserv.com", company: "FinServ Global", jobRole: "Director of Sales", industry: "Finance", score: 68, status: "Contacted", notes: "Attended webinar", phone: "+1 312-555-0404", lastActivity: "2026-02-06", createdAt: "2026-01-22" },
  { id: "5", name: "Aisha Mohammed", email: "aisha.m@healthplus.org", company: "HealthPlus", jobRole: "CEO", industry: "Healthcare", score: 95, status: "Qualified", notes: "Ready for proposal", phone: "+1 617-555-0505", lastActivity: "2026-02-10", createdAt: "2026-01-10" },
  { id: "6", name: "David Kim", email: "dkim@retailnow.com", company: "RetailNow", jobRole: "Marketing Manager", industry: "Retail", score: 45, status: "New", notes: "Signed up for newsletter", phone: "+1 213-555-0606", lastActivity: "2026-02-04", createdAt: "2026-01-25" },
  { id: "7", name: "Elena Rossi", email: "erossi@edutech.eu", company: "EduTech EU", jobRole: "Product Lead", industry: "Education", score: 81, status: "Contacted", notes: "Interested in API integration", phone: "+44 20-555-0707", lastActivity: "2026-02-09", createdAt: "2026-01-12" },
  { id: "8", name: "Tom Richards", email: "tom.r@buildfast.io", company: "BuildFast", jobRole: "Founder", industry: "Construction", score: 33, status: "Lost", notes: "Budget constraints", phone: "+1 503-555-0808", lastActivity: "2026-01-28", createdAt: "2026-01-05" },
  { id: "9", name: "Yuki Tanaka", email: "ytanaka@nexgen.jp", company: "NexGen Solutions", jobRole: "VP Sales", industry: "Technology", score: 78, status: "New", notes: "Referral from existing client", phone: "+81 3-555-0909", lastActivity: "2026-02-08", createdAt: "2026-01-28" },
  { id: "10", name: "Carlos Mendez", email: "cmendez@logistiq.com", company: "LogistiQ", jobRole: "COO", industry: "Logistics", score: 56, status: "Contacted", notes: "Exploring automation options", phone: "+1 305-555-1010", lastActivity: "2026-02-05", createdAt: "2026-01-30" },
];

export const aiInsights: Record<string, { factors: { label: string; impact: "positive" | "negative" | "neutral"; detail: string }[]; summary: string }> = {
  "1": {
    summary: "Sarah Chen is a high-priority lead with strong engagement signals and a profile that closely matches our ideal customer profile.",
    factors: [
      { label: "Job Title Match", impact: "positive", detail: "VP of Engineering at a mid-to-large tech company — strong decision-making authority." },
      { label: "Engagement Level", impact: "positive", detail: "Visited pricing page 4 times in the last 7 days." },
      { label: "Company Size", impact: "positive", detail: "TechCorp has 500+ employees — fits enterprise tier." },
      { label: "Response Time", impact: "neutral", detail: "Average email response time of 18 hours." },
    ],
  },
  "2": {
    summary: "Marcus Williams shows strong buying intent with executive-level authority. Demo request indicates late-stage interest.",
    factors: [
      { label: "Demo Requested", impact: "positive", detail: "Actively requested a product demo — high buying intent." },
      { label: "C-Suite Title", impact: "positive", detail: "CTO role gives direct purchasing power." },
      { label: "Industry Fit", impact: "positive", detail: "SaaS companies are our best-converting vertical." },
      { label: "Company Stage", impact: "neutral", detail: "Series B startup — moderate budget availability." },
    ],
  },
  "5": {
    summary: "Aisha Mohammed represents our strongest lead with CEO-level authority and readiness for a formal proposal.",
    factors: [
      { label: "Proposal Ready", impact: "positive", detail: "Explicitly expressed readiness to receive a pricing proposal." },
      { label: "CEO Authority", impact: "positive", detail: "Direct decision-maker with budget control." },
      { label: "Healthcare Vertical", impact: "positive", detail: "Healthcare sector has 40% higher LTV in our data." },
      { label: "Quick Mover", impact: "positive", detail: "Moved from New to Qualified in under 3 weeks." },
    ],
  },
};

// Fill in generic insights for leads without specific ones
leads.forEach((lead) => {
  if (!aiInsights[lead.id]) {
    aiInsights[lead.id] = {
      summary: `${lead.name} from ${lead.company} is a ${lead.score >= 70 ? "promising" : lead.score >= 40 ? "moderate" : "lower-priority"} lead in the ${lead.industry} sector.`,
      factors: [
        { label: "Industry Relevance", impact: lead.score >= 60 ? "positive" : "neutral", detail: `${lead.industry} sector alignment with target market.` },
        { label: "Job Authority", impact: lead.score >= 50 ? "positive" : "neutral", detail: `${lead.jobRole} role at ${lead.company}.` },
        { label: "Engagement", impact: lead.score >= 70 ? "positive" : lead.score >= 40 ? "neutral" : "negative", detail: `${lead.notes}` },
      ],
    };
  }
});

export const outreachTemplates: Record<string, Record<string, { subject: string; body: string }>> = {
  formal: {
    "1": {
      subject: "Enterprise Solutions for TechCorp — Partnership Opportunity",
      body: `Dear Sarah,\n\nI hope this message finds you well. I'm reaching out regarding our enterprise-grade lead intelligence platform, which I believe could significantly enhance TechCorp's sales operations.\n\nGiven your role as VP of Engineering, I thought you'd appreciate how our AI-driven scoring system helps engineering leaders make data-backed decisions about prospect prioritization.\n\nWould you be available for a brief 15-minute call this week to discuss how we've helped similar technology companies increase their conversion rates by an average of 34%?\n\nBest regards,\nLeadIQ Team`,
    },
  },
  friendly: {
    "1": {
      subject: "Hey Sarah — Quick idea for TechCorp's sales pipeline 💡",
      body: `Hi Sarah!\n\nI came across TechCorp's recent growth and wanted to share something I think you'll find really interesting.\n\nWe've built an AI-powered lead scoring tool that takes the guesswork out of prioritizing prospects. A lot of engineering leaders like yourself love it because it gives clear, explainable reasons behind every score.\n\nWould love to show you a quick demo — no pressure, just a casual walkthrough. Got 10 minutes this week?\n\nCheers,\nLeadIQ Team`,
    },
  },
  persuasive: {
    "1": {
      subject: "TechCorp is leaving 34% more conversions on the table",
      body: `Sarah,\n\nCompanies like TechCorp are sitting on a goldmine of untapped leads — but without AI-driven prioritization, the highest-value prospects often get buried.\n\nOur clients in the technology sector have seen:\n• 34% increase in lead-to-customer conversion\n• 50% reduction in time spent on low-quality leads\n• 3x faster response to high-intent signals\n\nI'd love to show you exactly how this would work for TechCorp. Can we set up a quick call?\n\nBest,\nLeadIQ Team`,
    },
  },
};

// Generate generic templates for all leads and tones
const tones = ["formal", "friendly", "persuasive"] as const;
leads.forEach((lead) => {
  tones.forEach((tone) => {
    if (!outreachTemplates[tone]) outreachTemplates[tone] = {};
    if (!outreachTemplates[tone][lead.id]) {
      const firstName = lead.name.split(" ")[0];
      if (tone === "formal") {
        outreachTemplates[tone][lead.id] = {
          subject: `Partnership Opportunity for ${lead.company}`,
          body: `Dear ${firstName},\n\nI hope this message finds you well. As ${lead.jobRole} at ${lead.company}, I believe you would find significant value in our AI-powered lead intelligence platform.\n\nOur solution helps ${lead.industry} companies streamline their sales pipeline with explainable AI scoring, enabling faster and more confident decision-making.\n\nWould you be available for a brief discussion this week?\n\nBest regards,\nLeadIQ Team`,
        };
      } else if (tone === "friendly") {
        outreachTemplates[tone][lead.id] = {
          subject: `Hey ${firstName} — thought you'd like this 💡`,
          body: `Hi ${firstName}!\n\nI noticed ${lead.company} is doing great things in the ${lead.industry} space. We've been helping similar companies supercharge their sales pipeline with AI-powered lead scoring.\n\nThe cool part? Our AI explains exactly why each lead scores the way it does — no black boxes.\n\nWould love to show you a quick demo. Got 10 minutes?\n\nCheers,\nLeadIQ Team`,
        };
      } else {
        outreachTemplates[tone][lead.id] = {
          subject: `${lead.company} could be converting 34% more leads`,
          body: `${firstName},\n\n${lead.industry} companies like ${lead.company} are leaving money on the table without AI-driven lead prioritization.\n\nOur clients see:\n• 34% higher conversion rates\n• 50% less time on unqualified leads\n• Real-time scoring with full explainability\n\nAs ${lead.jobRole}, you're in the perfect position to drive this change. Can we chat for 10 minutes?\n\nBest,\nLeadIQ Team`,
        };
      }
    }
  });
});

export const funnelData = [
  { stage: "Leads", value: 248, fill: "hsl(var(--chart-1))" },
  { stage: "Contacted", value: 156, fill: "hsl(var(--chart-2))" },
  { stage: "Qualified", value: 87, fill: "hsl(var(--chart-3))" },
  { stage: "Converted", value: 42, fill: "hsl(var(--chart-4))" },
];

export const scoreDistribution = [
  { range: "0-19", count: 3 },
  { range: "20-39", count: 8 },
  { range: "40-59", count: 15 },
  { range: "60-79", count: 22 },
  { range: "80-100", count: 12 },
];

export const conversionByScore = [
  { score: "0-19", converted: 2, total: 15 },
  { score: "20-39", converted: 5, total: 28 },
  { score: "40-59", converted: 12, total: 35 },
  { score: "60-79", converted: 28, total: 42 },
  { score: "80-100", converted: 38, total: 45 },
];
