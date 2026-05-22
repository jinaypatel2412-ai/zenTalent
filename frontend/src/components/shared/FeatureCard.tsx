import { ChevronRight, type LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  desc: string;
  accentClass: string;
}

export function FeatureCard({ icon: Icon, title, desc, accentClass }: FeatureCardProps) {
  return (
    <div className="group bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4">
      <div className={`w-12 h-12 rounded-xl ${accentClass} flex items-center justify-center shadow-sm`}>
        <Icon size={22} className="text-primary-foreground" />
      </div>
      <div>
        <h3 className="font-semibold text-foreground mb-2 text-base">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
      </div>
      <span className="mt-auto text-primary text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
        Learn more <ChevronRight size={14} />
      </span>
    </div>
  );
}



