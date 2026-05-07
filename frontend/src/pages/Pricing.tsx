import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { MarketingShell } from "@/components/MarketingShell";

const plans = [
  {
    name: "Starter",
    price: "$49",
    cadence: "/month",
    description: "For small teams hiring occasionally.",
    features: [
      "Up to 200 candidate screenings / month",
      "Resume parsing + role matching",
      "Basic coding assessments",
      "Email support",
    ],
  },
  {
    name: "Growth",
    price: "$149",
    cadence: "/month",
    description: "For teams scaling hiring operations.",
    features: [
      "Up to 1,500 candidate screenings / month",
      "Advanced coding evaluations",
      "Video interview sentiment analysis",
      "Team collaboration workflows",
      "Priority support",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "",
    description: "For large organizations with custom needs.",
    features: [
      "Unlimited candidate workflows",
      "Custom scoring and role frameworks",
      "Enterprise SSO and audit controls",
      "Dedicated onboarding manager",
      "SLA-backed support",
    ],
  },
];

export default function Pricing() {
  return (
    <MarketingShell>
      <section className="px-4 sm:px-6 pb-12">
        <div className="max-w-5xl mx-auto text-center space-y-5">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Pricing</span>
          <h1 className="text-4xl sm:text-5xl font-black outfit tracking-tight">Simple plans for every hiring stage</h1>
          <p className="max-w-2xl mx-auto text-muted-foreground text-base sm:text-lg">
            Start lean, scale confidently, and only pay for the capacity your recruiting team actually needs.
          </p>
        </div>
      </section>

      <section className="px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-3xl border p-7 sm:p-8 ${
                plan.highlighted ? "border-primary/50 bg-primary/5 shadow-[0_0_35px_rgba(99,102,241,0.2)]" : "border-white/10 bg-card/60"
              }`}
            >
              <div className="mb-5">
                <h3 className="text-xl font-bold text-foreground outfit">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
              </div>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-4xl font-black text-foreground">{plan.price}</span>
                <span className="text-sm text-muted-foreground mb-1">{plan.cadence}</span>
              </div>
              <ul className="space-y-3 mb-7">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 size={16} className="text-emerald mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/signup"
                className={`block w-full text-center rounded-xl py-2.5 font-semibold text-sm ${
                  plan.highlighted ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground hover:bg-muted"
                }`}
              >
                {plan.name === "Enterprise" ? "Contact Sales" : "Start Free Trial"}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 sm:px-6 pt-10">
        <div className="max-w-4xl mx-auto text-center rounded-3xl border border-white/10 bg-card/60 p-8 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-bold outfit tracking-tight text-foreground">Need a custom hiring workflow?</h2>
          <p className="mt-3 text-muted-foreground">We can tailor scoring, automation, and integrations for your hiring process.</p>
          <div className="mt-6">
            <Link to="/signup" className="inline-flex items-center gap-2.5 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-xl">
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}



