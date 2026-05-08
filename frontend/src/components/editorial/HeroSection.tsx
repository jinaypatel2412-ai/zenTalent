import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Users, Zap, BarChart3 } from "lucide-react";

// ── Spring configs ────────────────────────────────────────────
const SPRING_GENTLE  = { type: "spring" as const, stiffness: 120, damping: 20, mass: 0.8 };
const SPRING_SNAPPY  = { type: "spring" as const, stiffness: 280, damping: 24 };
const SPRING_BUTTON  = { type: "spring" as const, stiffness: 420, damping: 26 };

const containerVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.11, delayChildren: 0.08 } },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: SPRING_GENTLE },
};

// ── Eyebrow ───────────────────────────────────────────────────
function Eyebrow() {
  return (
    <motion.div variants={itemVariants} className="inline-flex items-center gap-2">
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-medium uppercase tracking-wider font-mono text-primary bg-primary/10 border border-primary/20">
        <Zap size={9} className="fill-current" />
        Editorial Tech · British Racing Green
      </span>
    </motion.div>
  );
}

// ── Primary CTA ───────────────────────────────────────────────
function PrimaryButton({ children }: { children: React.ReactNode }) {
  return (
    <motion.button
      variants={itemVariants}
      whileTap={{ scale: 0.98, transition: SPRING_BUTTON }}
      whileHover={{ y: -1, transition: SPRING_SNAPPY }}
      className="racing-button inline-flex items-center gap-2"
    >
      {children}
      <motion.span whileHover={{ x: 3 }} transition={SPRING_SNAPPY}>
        <ArrowRight size={14} />
      </motion.span>
    </motion.button>
  );
}

// ── Ghost CTA ─────────────────────────────────────────────────
function GhostButton({ children }: { children: React.ReactNode }) {
  return (
    <motion.button
      variants={itemVariants}
      whileTap={{ scale: 0.98, transition: SPRING_BUTTON }}
      className="inline-flex items-center gap-2 px-6 py-2.5 bg-transparent text-muted-foreground border border-border rounded-lg text-sm font-medium cursor-pointer transition-colors duration-200 hover:border-muted-foreground/40 hover:text-foreground"
    >
      {children}
    </motion.button>
  );
}

// ── Trust pills ───────────────────────────────────────────────
const trusted = [
  "Trusted by 12,000+ teams",
  "SOC 2 Type II certified",
  "99.97% uptime SLA",
];

function TrustRow() {
  return (
    <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-5">
      {trusted.map((t) => (
        <span key={t} className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <CheckCircle2 size={13} className="text-primary" />
          {t}
        </span>
      ))}
    </motion.div>
  );
}

// ── Stat strip ────────────────────────────────────────────────
const stats = [
  { label: "Active users",   value: "48,200" },
  { label: "Avg. response",  value: "< 80ms" },
  { label: "Jobs matched",   value: "1.2M+"  },
];

function StatsStrip() {
  return (
    <motion.div
      variants={itemVariants}
      className="flex flex-wrap items-center gap-10 pt-6 border-t border-border"
    >
      {stats.map((s) => (
        <div key={s.label} className="flex flex-col gap-0.5">
          <span className="text-2xl font-semibold font-mono text-foreground tracking-tight">
            {s.value}
          </span>
          <span className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">{s.label}</span>
        </div>
      ))}
    </motion.div>
  );
}

// ── Feature card (right panel) ────────────────────────────────
const features = [
  { icon: <Users size={15} />,     title: "Team collaboration",  desc: "Live multiplayer editing with conflict resolution." },
  { icon: <BarChart3 size={15} />, title: "Precision analytics", desc: "Sub-second dashboards with 12-month data retention." },
  { icon: <Zap size={15} />,       title: "Instant matching",    desc: "AI-powered candidate ranking in under 200ms."       },
];

function FeaturePanel() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 28 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ ...SPRING_GENTLE, delay: 0.45 }}
      className="racing-card flex flex-col divide-y divide-border"
    >
      {/* Card header */}
      <div className="px-6 py-4 flex items-center justify-between">
        <span className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">Platform Features</span>
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-medium uppercase tracking-wider font-mono text-primary bg-primary/10 border border-primary/20">Live</span>
      </div>

      {/* Feature rows */}
      {features.map((f, i) => (
        <motion.div
          key={f.title}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...SPRING_GENTLE, delay: 0.55 + i * 0.1 }}
          className="flex items-start gap-4 px-6 py-5"
        >
          <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded bg-primary/10 text-primary border border-primary/20">
            {f.icon}
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-medium text-foreground">{f.title}</p>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </div>
        </motion.div>
      ))}

      {/* Footer note */}
      <div className="px-6 py-4 flex items-center gap-2">
        <CheckCircle2 size={13} className="text-primary" />
        <span className="text-xs text-muted-foreground">All features included in every plan</span>
      </div>
    </motion.div>
  );
}

// ── Decorative grid lines ─────────────────────────────────────
function GridLines() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden opacity-5">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--border)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />
    </div>
  );
}

// ── Main HeroSection ──────────────────────────────────────────
export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background py-24">
      <GridLines />

      <div className="relative z-10 max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

          {/* ── Left: Content ── */}
          <motion.div
            className="lg:col-span-6 flex flex-col gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Eyebrow />

            <motion.h1
              variants={itemVariants}
              className="font-serif text-[clamp(2.5rem,5vw,4rem)] text-foreground tracking-tight leading-[1.08]"
            >
              Hire smarter,{" "}
              <span className="text-gradient-racing">
                move faster.
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg max-w-lg text-muted-foreground leading-relaxed"
            >
              Zentalent brings editorial clarity and terminal-grade precision to your
              hiring workflow. Find the right people without the noise.
            </motion.p>

            <TrustRow />

            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
              <PrimaryButton>Start for free</PrimaryButton>
              <GhostButton>View demo →</GhostButton>
            </motion.div>

            <StatsStrip />
          </motion.div>

          {/* ── Right: Feature panel ── */}
          <div className="lg:col-span-6 hidden lg:block">
            <FeaturePanel />
          </div>
        </div>
      </div>

      {/* Bottom divider */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 right-0 h-px bg-border"
      />
    </section>
  );
}



