import { CheckCircle2, Star, ArrowRight, Sparkles, Brain } from "lucide-react";
import { SkillTag } from "./SkillTag";

export function CandidateCard() {
  return (
    <div className="relative">
      <div className="absolute -inset-6 bg-primary/10 rounded-3xl blur-2xl" />
      <div className="relative bg-card/80 backdrop-blur-xl border border-border rounded-2xl shadow-xl p-6 space-y-5 max-w-sm mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-lg shadow-md">
            AK
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">Arjun Kapoor</p>
            <p className="text-xs text-muted-foreground">Full-Stack Engineer · Mumbai</p>
          </div>
          <span className="ml-auto flex items-center gap-1 text-xs font-semibold text-emerald bg-emerald/10 px-2.5 py-1 rounded-full ring-1 ring-emerald/20">
            <CheckCircle2 size={12} /> Verified
          </span>
        </div>

        <div className="bg-muted rounded-xl p-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground font-medium mb-1">AI Match Score</p>
            <p className="text-3xl font-bold text-primary">94<span className="text-base text-muted-foreground">/100</span></p>
          </div>
          <div className="flex gap-0.5">
            {[1,2,3,4,5].map(i => (
              <Star key={i} size={16} className={i <= 4 ? "fill-amber text-amber" : "fill-muted text-muted"} />
            ))}
          </div>
        </div>

        {[
          { label: "React.js", pct: 92, color: "bg-primary" },
          { label: "Node.js", pct: 85, color: "bg-accent" },
          { label: "System Design", pct: 78, color: "bg-sky" },
        ].map(({ label, pct, color }) => (
          <div key={label}>
            <div className="flex justify-between text-xs text-muted-foreground mb-1 font-medium">
              <span>{label}</span><span>{pct}%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        ))}

        <div className="flex flex-wrap gap-2">
          <SkillTag label="TypeScript" level="Expert" />
          <SkillTag label="Docker" level="Advanced" />
          <SkillTag label="AWS" level="Intermediate" />
        </div>

        <button className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary-dark transition-colors shadow-sm flex items-center justify-center gap-2">
          View Full Report <ArrowRight size={15} />
        </button>
      </div>

      <div className="absolute -top-4 -right-4 bg-card border border-border rounded-xl shadow-lg px-3 py-2 flex items-center gap-2">
        <Sparkles size={14} className="text-amber" />
        <span className="text-xs font-semibold text-foreground">Top 3% Candidate</span>
      </div>
      <div className="absolute -bottom-4 -left-4 bg-card border border-border rounded-xl shadow-lg px-3 py-2 flex items-center gap-2">
        <Brain size={14} className="text-primary" />
        <span className="text-xs font-semibold text-foreground">AI Verified</span>
      </div>
    </div>
  );
}



