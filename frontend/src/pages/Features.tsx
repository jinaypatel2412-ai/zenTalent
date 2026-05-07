import { Brain, Code2, Video, Shield, Zap, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { FeatureCard } from "@/components/FeatureCard";
import { MarketingShell } from "@/components/MarketingShell";

const featureList = [
  {
    icon: Brain,
    accentClass: "bg-primary",
    title: "Smart Resume Parsing",
    desc: "Extract skills, years of experience, and role fit instantly from raw resumes.",
  },
  {
    icon: Code2,
    accentClass: "bg-accent",
    title: "Verified Coding Tests",
    desc: "Run real coding tasks in a monitored environment with instant scoring rubrics.",
  },
  {
    icon: Video,
    accentClass: "bg-sky",
    title: "Sentiment AI Interviews",
    desc: "Measure confidence, communication clarity, and intent from video responses.",
  },
];

export default function Features() {
  return (
    <MarketingShell>
      <section className="px-4 sm:px-6 pb-12">
        <div className="max-w-6xl mx-auto text-center space-y-5">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Platform Features</span>
          <h1 className="text-4xl sm:text-5xl font-black outfit tracking-tight">Built for high-confidence hiring</h1>
          <p className="max-w-2xl mx-auto text-muted-foreground text-base sm:text-lg">
            Every hiring decision combines structured data, technical validation, and communication intelligence in one workflow.
          </p>
        </div>
      </section>

      <section className="px-4 sm:px-6 pb-8">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {featureList.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>

      <section className="px-4 sm:px-6 py-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-white/10 bg-card/50 p-6">
            <Zap size={20} className="text-primary mb-3" />
            <h3 className="font-semibold text-foreground mb-2">10x Faster Screening</h3>
            <p className="text-sm text-muted-foreground">Automate first-round filtration with policy-driven, role-specific scoring.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-card/50 p-6">
            <TrendingUp size={20} className="text-primary mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Higher Match Accuracy</h3>
            <p className="text-sm text-muted-foreground">Combine resume relevance, coding quality, and interview signals in one score.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-card/50 p-6">
            <Shield size={20} className="text-primary mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Enterprise-Ready Security</h3>
            <p className="text-sm text-muted-foreground">Role-based access, audit-friendly workflows, and secure candidate data handling.</p>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 pt-8">
        <div className="max-w-4xl mx-auto text-center rounded-3xl border border-white/10 bg-card/60 p-8 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-bold outfit tracking-tight text-foreground">See the full product in action</h2>
          <p className="mt-3 text-muted-foreground">Explore a guided flow from candidate upload to final shortlist in minutes.</p>
          <div className="mt-6">
            <Link to="/signup" className="inline-flex items-center gap-2.5 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-xl">
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}



