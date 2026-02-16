import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, BarChart3, Mail, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Lead Scoring",
    description: "Automatically score and prioritize leads using intelligent analysis of engagement signals and firmographic data.",
  },
  {
    icon: BarChart3,
    title: "Explainable Insights",
    description: "Understand exactly why each lead scores high or low with transparent, human-readable AI explanations.",
  },
  {
    icon: Mail,
    title: "Smart Outreach",
    description: "Generate personalized email drafts tailored to each lead's profile, industry, and engagement history.",
  },
  {
    icon: Sparkles,
    title: "Conversion Analytics",
    description: "Track your funnel from lead to customer with visual analytics and actionable performance metrics.",
  },
];

const benefits = [
  "Prioritize high-value leads instantly",
  "Save hours on manual lead research",
  "Increase conversion rates with data-driven outreach",
  "Transparent AI — no black-box scoring",
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-display font-bold text-foreground">LeadIQ</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 md:py-32 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-accent/50 px-4 py-1.5 text-sm text-accent-foreground">
            <Sparkles className="h-4 w-4" />
            AI-Powered Lead Intelligence
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Turn leads into customers with{" "}
            <span className="text-primary">intelligent scoring</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
            LeadIQ uses AI to score, analyze, and prioritize your sales leads — so your team focuses on what converts.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="text-base px-8" asChild>
              <Link to="/register">
                Start Free <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8" asChild>
              <Link to="/login">View Demo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-card/50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl font-bold text-foreground">Everything you need to close more deals</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              From AI scoring to personalized outreach, LeadIQ gives your sales team a competitive edge.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-14">
          <div className="flex-1">
            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              Why sales teams choose LeadIQ
            </h2>
            <ul className="space-y-4">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-score-high mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">{b}</span>
                </li>
              ))}
            </ul>
            <Button className="mt-8" asChild>
              <Link to="/register">Get Started Free</Link>
            </Button>
          </div>
          <div className="flex-1 rounded-xl border bg-card p-8 shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-accent/30 p-4">
                <span className="font-medium text-foreground">Sarah Chen</span>
                <span className="rounded-full bg-score-high/15 px-3 py-1 text-sm font-semibold text-score-high">Score: 92</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-accent/30 p-4">
                <span className="font-medium text-foreground">Marcus Johnson</span>
                <span className="rounded-full bg-score-high/15 px-3 py-1 text-sm font-semibold text-score-high">Score: 85</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-accent/30 p-4">
                <span className="font-medium text-foreground">Emily Rodriguez</span>
                <span className="rounded-full bg-score-medium/15 px-3 py-1 text-sm font-semibold text-score-medium">Score: 54</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary" />
            <span className="font-display font-semibold text-foreground">LeadIQ</span>
          </div>
          <p>© 2026 LeadIQ. Built for smarter sales.</p>
        </div>
      </footer>
    </div>
  );
}
