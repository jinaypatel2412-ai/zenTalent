import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Briefcase, TrendingUp, CheckCircle2, Clock, ArrowUpRight, Mic, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const [{ data: j }, { data: a }] = await Promise.all([
        supabase.from("job_postings").select("*").eq("status", "open").order("created_at", { ascending: false }).limit(4),
        supabase.from("job_applications").select("*, job_postings(title, company)").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);
      setJobs(j || []);
      setApplications(a || []);
      setLoading(false);
    };
    fetch();
  }, [user]);

  const completedInterviews = applications.filter(a => a.interview_stage === "completed").length;
  const avgScore = applications.filter(a => a.overall_score > 0).reduce((sum, a) => sum + Number(a.overall_score), 0) / Math.max(1, applications.filter(a => a.overall_score > 0).length);

  const stats = [
    { label: "Applications", value: applications.length, icon: Briefcase, color: "text-primary" },
    { label: "In Progress", value: applications.filter(a => a.interview_stage === "in_progress").length, icon: Clock, color: "text-amber-500" },
    { label: "Completed", value: completedInterviews, icon: CheckCircle2, color: "text-emerald-500" },
    { label: "Avg Score", value: avgScore > 0 ? `${Math.round(avgScore)}%` : "—", icon: TrendingUp, color: "text-accent" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between relative z-10">
        <div>
          <h1 className="text-3xl font-bold text-foreground outfit tracking-tight">Welcome, {user?.user_metadata?.full_name?.split(" ")[0] || "there"}!</h1>
          <p className="text-sm text-muted-foreground mt-1">Your interview dashboard overview.</p>
        </div>
        <Link to="/dashboard/jobs" className="glow-button inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm font-semibold px-6 py-2.5 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.3)]">
          <ArrowUpRight size={16} /> Browse Jobs
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-card/40 backdrop-blur-xl border border-white/5 rounded-2xl p-5 shadow-lg hover:bg-white/[0.02] transition-colors group">
            <Icon size={20} className={color} />
            <p className="text-3xl font-bold text-foreground mt-3 outfit tracking-tight">{value}</p>
            <p className="text-xs text-muted-foreground font-medium mt-1 uppercase tracking-wider">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 relative z-10">
        {/* Recent applications */}
        <div className="lg:col-span-2 glass-card rounded-3xl">
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
            <h3 className="font-semibold text-foreground outfit text-lg">My Applications</h3>
            <Link to="/dashboard/jobs" className="text-xs text-primary font-medium hover:underline">View all jobs</Link>
          </div>
          {applications.length === 0 ? (
            <div className="p-12 text-center">
              <Briefcase size={32} className="text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No applications yet. Browse jobs to get started!</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {applications.slice(0, 5).map(a => (
                <div key={a.id} className="flex items-center gap-4 px-6 py-3.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-xs font-bold">
                    {((a.job_postings as any)?.title || "J").charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{(a.job_postings as any)?.title || "Job"}</p>
                    <p className="text-xs text-muted-foreground">{(a.job_postings as any)?.company || "Company"}</p>
                  </div>
                  <div className="flex gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${a.technical_score > 0 ? "bg-emerald-500" : "bg-muted"}`} title="Technical" />
                    <div className={`w-2 h-2 rounded-full ${a.aptitude_score > 0 ? "bg-emerald-500" : "bg-muted"}`} title="Aptitude" />
                    <div className={`w-2 h-2 rounded-full ${a.coding_score > 0 ? "bg-emerald-500" : "bg-muted"}`} title="Coding" />
                  </div>
                  {a.overall_score > 0 && <span className="text-sm font-bold text-primary">{Number(a.overall_score).toFixed(0)}%</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="glass-card rounded-3xl p-6 space-y-5">
          <h3 className="font-semibold text-foreground outfit text-lg">Quick Actions</h3>
          <div className="space-y-3">
            {[
              { label: "Browse Job Postings", path: "/dashboard/jobs", desc: "Find your next opportunity", icon: Briefcase },
              { label: "Take Interview", path: "/dashboard/interviews", desc: "Technical, Aptitude, or Coding", icon: Mic },
              { label: "My Profile", path: "/dashboard/settings", desc: "Update your information", icon: CheckCircle2 },
              { label: "Zentalent Old Dashboard", path: "file:///c:/Users/Dell/Downloads/Zentalent-dashboard.html", desc: "View the previous dashboard design", icon: LayoutDashboard },
            ].map(a => (
              <a key={a.path} href={a.path}
                target={a.path.startsWith("file://") ? "_blank" : undefined}
                rel={a.path.startsWith("file://") ? "noopener noreferrer" : undefined}
                className="flex items-center gap-3 p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:border-primary/30 hover:bg-white/[0.04] transition-all group">
                <a.icon size={18} className="text-primary group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-sm font-medium text-foreground">{a.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{a.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Featured jobs */}
      {jobs.length > 0 && (
        <div className="glass-card rounded-3xl relative z-10">
          <div className="px-6 py-5 border-b border-white/5">
            <h3 className="font-semibold text-foreground outfit text-lg">Featured Openings</h3>
          </div>
          <div className="divide-y divide-border">
            {jobs.map(j => (
              <div key={j.id} className="flex items-center gap-4 px-6 py-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{j.title}</p>
                  <p className="text-xs text-muted-foreground">{j.company} • {j.location}</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {j.skills_required?.slice(0, 3).map((s: string) => (
                    <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/5 text-primary font-medium">{s}</span>
                  ))}
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{j.salary_range}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}



