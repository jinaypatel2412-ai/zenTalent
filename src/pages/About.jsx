import { Award, Brain, Globe2, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { MarketingShell } from "@/components/MarketingShell";

const values = [
  {
    icon: Brain,
    title: "Evidence over intuition",
    desc: "We believe hiring should be grounded in measurable signals, not guesswork.",
  },
  {
    icon: Users,
    title: "Human-first experience",
    desc: "AI should assist recruiters and candidates, not remove empathy from the process.",
  },
  {
    icon: Award,
    title: "Quality at scale",
    desc: "Teams should grow fast without compromising on talent quality and role fit.",
  },
  {
    icon: Globe2,
    title: "Global by design",
    desc: "Our workflows support distributed teams hiring across regions and time zones.",
  },
];

export default function About() {
  return (
    <MarketingShell>
      <section className="px-4 sm:px-6 pb-12">
        <div className="max-w-5xl mx-auto text-center space-y-5">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">About Zentalent</span>
          <h1 className="text-4xl sm:text-5xl font-black outfit tracking-tight">Helping teams hire with clarity and confidence</h1>
          <p className="max-w-3xl mx-auto text-muted-foreground text-base sm:text-lg">
            Zentalent was built to fix one core problem: great candidates are often missed when hiring relies on inconsistent manual screening.
            We bring structured evaluation, coding validation, and interview intelligence into one decision-ready platform.
          </p>
        </div>
      </section>

      <section className="px-4 sm:px-6 py-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-white/10 bg-card/60 p-8">
            <h2 className="text-2xl font-bold outfit text-foreground mb-3">Our mission</h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Empower companies to make faster and fairer hiring decisions by replacing fragmented tools with one trustworthy AI-enabled workflow.
              From sourcing to shortlist, every step should be transparent, measurable, and easy to collaborate on.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-card/60 p-8">
            <h2 className="text-2xl font-bold outfit text-foreground mb-3">Who we serve</h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Fast-growing startups, hiring managers, and talent teams that need strong hiring outcomes without slowing down.
              Whether you recruit 10 or 10,000 candidates a year, Zentalent keeps your evaluation process consistent.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold outfit text-foreground text-center mb-8">What we value</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-card/50 p-6">
                <Icon size={20} className="text-primary mb-3" />
                <h3 className="font-semibold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 pt-8">
        <div className="max-w-4xl mx-auto text-center rounded-3xl border border-white/10 bg-card/60 p-8 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-bold outfit tracking-tight text-foreground">Build your next high-performing team</h2>
          <p className="mt-3 text-muted-foreground">Start with structured hiring workflows that your recruiters and managers trust.</p>
          <div className="mt-6">
            <Link to="/signup" className="inline-flex items-center gap-2.5 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-xl">
              Get Started
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}



