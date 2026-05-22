interface SkillTagProps {
  label: string;
  level: "Expert" | "Advanced" | "Intermediate";
}

const levelStyles: Record<string, string> = {
  Expert: "bg-primary/10 text-primary ring-1 ring-primary/20",
  Advanced: "bg-accent/10 text-accent ring-1 ring-accent/20",
  Intermediate: "bg-sky/10 text-sky ring-1 ring-sky/20",
};

export function SkillTag({ label, level }: SkillTagProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${levelStyles[level]}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {label}
    </span>
  );
}



