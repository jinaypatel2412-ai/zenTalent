import { motion } from "framer-motion";
import {
  TrendingUp, Users, FileText, Activity,
  ArrowUpRight, Cpu, Clock, AlertCircle, CheckCircle2,
} from "lucide-react";
import React from "react";

// ── Tween configs ────────────────────────────────────────────
const TWEEN_CARD = { type: "tween" as const, ease: "easeOut" as const, duration: 0.4 };
const TWEEN_BUTTON = { type: "tween" as const, ease: "easeOut" as const, duration: 0.15 };
const TWEEN_ITEM = { type: "tween" as const, ease: "easeOut" as const, duration: 0.35 };

const gridContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: TWEEN_CARD },
};

// ── Shared Bento card ─────────────────────────────────────────
function BentoCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={cardVariant}
      whileHover={{ y: -2, transition: { type: "tween" as const, ease: "easeOut" as const, duration: 0.2 } }}
      className={`bg-card border border-border shadow-sm transition-all duration-300 rounded-xl relative overflow-hidden p-7 ${className}`}
    >
      {children}
    </motion.div>
  );
}

// ── Section label ─────────────────────────────────────────────
function Label({ children }: { children: React.ReactNode }) {
  return <span className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">{children}</span>;
}

// ── Sparkline ─────────────────────────────────────────────────
function Sparkline() {
  const points = "0,28 14,20 28,24 42,12 56,16 70,6 84,12 100,2";
  return (
    <svg width="104" height="32" viewBox="0 0 104 32" fill="none" className="stroke-primary">
      <polyline points={points} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <polyline
        points={`${points} 100,32 0,32`}
        className="fill-primary/5 stroke-none"
      />
    </svg>
  );
}

// ── Mini bar chart ────────────────────────────────────────────
function MiniBarChart() {
  const bars = [38, 60, 52, 75, 65, 88, 70, 95];
  return (
    <div className="flex items-end gap-1.5 h-14 w-full">
      {bars.map((h, i) => (
        <motion.div
          key={i}
          className={`flex-1 rounded-sm origin-bottom ${i === bars.length - 1 ? 'bg-primary' : 'bg-border'}`}
          style={{ height: `${h}%` }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ ...TWEEN_ITEM, delay: 0.3 + i * 0.1 }}
        />
      ))}
    </div>
  );
}

// ── Circular progress (SVG, GPU-safe) ────────────────────────
function ProgressRing({
  value,
  size = 76,
}: {
  value: number;
  size?: number;
}) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" className="stroke-border" strokeWidth="1.5" />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        className="stroke-primary"
        strokeWidth="2"
        strokeDasharray={circ}
        strokeDashoffset={circ}
        strokeLinecap="butt"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        animate={{ strokeDashoffset: offset }}
        transition={{ ...TWEEN_ITEM, delay: 0.8 }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="13"
        fontWeight="600"
        className="fill-foreground font-mono"
      >
        {value}%
      </text>
    </svg>
  );
}

// ── Activity item ─────────────────────────────────────────────
function ActivityItem({
  icon,
  text,
  time,
  type,
}: {
  icon: React.ReactNode;
  text: string;
  time: string;
  type: "success" | "warning" | "info";
}) {
  const colorClass = {
    success: "text-green-400",
    warning: "text-yellow-400",
    info: "text-primary"
  }[type];

  return (
    <div className="flex items-start gap-3 py-3 border-b border-border">
      <span className={`flex-shrink-0 mt-0.5 ${colorClass}`}>{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm leading-snug text-foreground">{text}</p>
        <p className="text-xs mt-0.5 font-mono text-muted-foreground">{time}</p>
      </div>
    </div>
  );
}

// ── CARD 1: Revenue metric (col-span-2) ───────────────────────
function MetricCard() {
  return (
    <BentoCard className="col-span-2 flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1.5">
          <Label>Total Revenue</Label>
          <p className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 text-4xl sm:text-[2.5rem] tracking-tight leading-none font-serif">
            $2,847,391
          </p>
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium uppercase font-mono text-green-400 bg-green-400/10 border border-green-400/20">
          <TrendingUp size={10} />
          +18.4%
        </span>
      </div>

      <div className="flex items-end justify-between gap-8">
        {/* Sub-metrics */}
        <div className="flex gap-8">
          {[
            { label: "MRR", value: "$238K" },
            { label: "ARR", value: "$2.85M" },
            { label: "Churn", value: "1.2%" },
          ].map((m) => (
            <div key={m.label} className="flex flex-col gap-1">
              <span className="font-mono text-xl font-semibold tracking-tight text-foreground">
                {m.value}
              </span>
              <Label>{m.label}</Label>
            </div>
          ))}
        </div>

        <Sparkline />
      </div>

      {/* Bar chart */}
      <div>
        <Label>Monthly breakdown</Label>
        <div className="mt-3">
          <MiniBarChart />
        </div>
      </div>
    </BentoCard>
  );
}

// ── CARD 2: System health ─────────────────────────────────────
function SystemHealthCard() {
  return (
    <BentoCard className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <Label>System Health</Label>
          <p className="text-xl font-semibold text-foreground">Nominal</p>
        </div>
        <Cpu size={16} className="text-primary" />
      </div>

      <div className="flex items-center justify-between">
        <ProgressRing value={97} size={80} />
        <div className="flex flex-col gap-3 text-right">
          {[
            { label: "Uptime", value: "99.97%", good: true },
            { label: "P99", value: "62ms", good: true },
            { label: "Errors", value: "0.03%", good: false },
          ].map((s) => (
            <div key={s.label}>
              <p className={`font-mono text-sm font-medium ${s.good ? "text-foreground" : "text-red-400"}`}>
                {s.value}
              </p>
              <Label>{s.label}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Status row */}
      <div className="flex items-center gap-2 pt-4 border-t border-border">
        <CheckCircle2 size={13} className="text-green-400" />
        <span className="text-xs text-muted-foreground">All systems operational</span>
      </div>
    </BentoCard>
  );
}

// ── CARD 3: Activity feed ─────────────────────────────────────
function ActivityCard() {
  const items: Array<{
    icon: React.ReactNode;
    text: string;
    time: string;
    type: "success" | "warning" | "info";
  }> = [
    { icon: <Users size={12} />, text: "48 new signups in last hour", time: "2 min ago", type: "success" },
    { icon: <AlertCircle size={12} />, text: "Rate limit warning — API gateway", time: "11 min ago", type: "warning" },
    { icon: <FileText size={12} />, text: "Quarterly report exported by admin", time: "34 min ago", type: "info" },
    { icon: <Activity size={12} />, text: "Anomaly detected: traffic spike +340%", time: "1h ago", type: "warning" },
  ];

  return (
    <BentoCard className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Label>Live Activity</Label>
        <span className="flex items-center gap-1.5 text-xs font-mono text-green-400">
          <motion.span
            className="h-1.5 w-1.5 rounded-full bg-green-400"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "linear" as const }}
          />
          LIVE
        </span>
      </div>

      <div className="flex flex-col">
        {items.map((item, i) => (
          <motion.div
            key={item.text}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...TWEEN_ITEM, delay: 0.2 + i * 0.08 }}
          >
            <ActivityItem {...item} />
          </motion.div>
        ))}
      </div>
    </BentoCard>
  );
}

// ── CARD 4: Quick actions (col-span-2) ────────────────────────
function QuickActionsCard() {
  const actions = [
    { label: "Publish Report", icon: <FileText size={14} />, highlight: true },
    { label: "Manage Team", icon: <Users size={14} />, highlight: false },
    { label: "View Analytics", icon: <TrendingUp size={14} />, highlight: true },
    { label: "System Logs", icon: <Clock size={14} />, highlight: false },
  ];

  return (
    <BentoCard className="col-span-2 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <Label>Quick Actions</Label>
          <p className="text-sm mt-1 text-muted-foreground">Common operations at a glance</p>
        </div>
        <ArrowUpRight size={15} className="text-muted-foreground" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {actions.map((a) => (
          <motion.button
            key={a.label}
            whileTap={{ scale: 0.97, transition: TWEEN_BUTTON }}
            whileHover={{ y: -1, transition: { type: "spring" as const, stiffness: 260, damping: 22 } }}
            className={`flex flex-col items-start gap-2 p-4 text-left border rounded-lg bg-card cursor-pointer transition-colors duration-200 ${a.highlight ? 'border-primary/20 hover:border-primary/40' : 'border-border hover:border-muted-foreground/30'}`}
          >
            <span
              className={`flex items-center justify-center h-8 w-8 rounded ${a.highlight ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-muted text-muted-foreground border border-transparent'}`}
            >
              {a.icon}
            </span>
            <span className="text-xs font-medium text-foreground">
              {a.label}
            </span>
          </motion.button>
        ))}
      </div>
    </BentoCard>
  );
}

// ── Main BentoDashboard ───────────────────────────────────────
export default function BentoDashboard() {
  return (
    <section className="bg-background py-20 px-8">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <div className="flex items-end justify-between mb-8 pb-6 border-b border-border">
          <div>
            <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground mb-1">Dashboard · 05 May 2026</p>
            <h2 className="text-3xl sm:text-[2rem] font-serif text-foreground tracking-tight">
              Overview
            </h2>
          </div>

          <motion.button
            whileTap={{ scale: 0.97, transition: TWEEN_BUTTON }}
            className="bg-primary text-primary-foreground hover:opacity-90 active:scale-95 transition-all duration-200 shadow-sm hover:shadow inline-flex items-center gap-2 px-4 py-2 text-xs rounded-lg"
          >
            <Activity size={12} />
            Export Report
          </motion.button>
        </div>

        {/* ── Bento Grid ── */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={gridContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Row 1 */}
          <div className="md:col-span-2"><MetricCard /></div>
          <div><SystemHealthCard /></div>

          {/* Row 2 */}
          <div><ActivityCard /></div>
          <div className="md:col-span-2"><QuickActionsCard /></div>
        </motion.div>
      </div>
    </section>
  );
}


