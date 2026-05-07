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
    { label: "Applications", value: applications.length, icon: Briefcase, color: "text-zinc-800" },
    { label: "In Progress", value: applications.filter(a => a.interview_stage === "in_progress").length, icon: Clock, color: "text-zinc-500" },
    { label: "Completed", value: completedInterviews, icon: CheckCircle2, color: "text-zinc-900" },
    { label: "Avg Score", value: avgScore > 0 ? `${Math.round(avgScore)}%` : "—", icon: TrendingUp, color: "text-zinc-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between relative z-10">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 outfit tracking-tight">Welcome, {user?.user_metadata?.full_name?.split(" ")[0] || "there"}!</h1>
          <p className="text-sm text-zinc-500 mt-1">Your interview dashboard overview.</p>
        </div>
        <Link to="/dashboard/jobs" className="inline-flex items-center gap-2 bg-zinc-900 text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-md hover:bg-zinc-800 transition-colors">
          <ArrowUpRight size={16} /> Browse Jobs
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm hover:border-zinc-300 transition-colors group">
            <Icon size={20} className={color} />
            <p className="text-3xl font-bold text-zinc-900 mt-3 outfit tracking-tight">{value}</p>
            <p className="text-xs text-zinc-500 font-medium mt-1 uppercase tracking-wider">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 relative z-10">
        {/* Recent applications with Bento Grid */}
        <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 bg-zinc-50/50">
            <h3 className="font-semibold text-zinc-900 outfit text-lg">My Applications</h3>
            <Link to="/dashboard/jobs" className="text-xs text-zinc-600 font-medium hover:text-zinc-900 hover:underline">View all jobs</Link>
          </div>

          {applications.length === 0 ? (
            <div className="p-12 text-center">
              <Briefcase size={32} className="text-zinc-300 mx-auto mb-3" />
              <p className="text-sm text-zinc-500">No applications yet. Browse jobs to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5">
              {applications.slice(0, 4).map(a => (
                <div key={a.id} className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 hover:bg-zinc-100/50 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div className="min-w-0 pr-3">
                      <h4 className="font-bold text-zinc-900 truncate text-sm">{(a.job_postings as any)?.title || "Job"}</h4>
                      <p className="text-xs text-zinc-500 truncate mt-0.5">{(a.job_postings as any)?.company || "Company"}</p>
                    </div>
                    <span className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold ${a.overall_score > 0 ? 'bg-zinc-200 text-zinc-800' : 'bg-zinc-200/50 text-zinc-500'}`}>
                      {a.overall_score > 0 ? `${Number(a.overall_score).toFixed(0)}% Overall` : 'Pending'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white border border-zinc-100 rounded-xl p-2.5 text-center shadow-sm">
                      <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-0.5">Tech</p>
                      <p className="text-sm font-bold text-zinc-800">{a.technical_score > 0 ? `${a.technical_score}%` : "-"}</p>
                    </div>
                    <div className="bg-white border border-zinc-100 rounded-xl p-2.5 text-center shadow-sm">
                      <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-0.5">Apti</p>
                      <p className="text-sm font-bold text-zinc-800">{a.aptitude_score > 0 ? `${a.aptitude_score}%` : "-"}</p>
                    </div>
                    <div className="bg-white border border-zinc-100 rounded-xl p-2.5 text-center shadow-sm">
                      <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-0.5">Code</p>
                      <p className="text-sm font-bold text-zinc-800">{a.coding_score > 0 ? `${a.coding_score}%` : "-"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 space-y-5 shadow-sm">
          <h3 className="font-semibold text-zinc-900 outfit text-lg">Quick Actions</h3>
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
                className="flex items-center gap-3 p-4 rounded-xl border border-zinc-100 bg-zinc-50 hover:border-zinc-300 hover:bg-zinc-100 transition-all group">
                <a.icon size={18} className="text-zinc-700 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-sm font-medium text-zinc-900">{a.label}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{a.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Featured jobs */}
      {jobs.length > 0 && (
        <div className="bg-white border border-zinc-200 rounded-3xl relative z-10 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-zinc-100 bg-zinc-50/50">
            <h3 className="font-semibold text-zinc-900 outfit text-lg">Featured Openings</h3>
          </div>
          <div className="divide-y divide-zinc-100">
            {jobs.map(j => (
              <div key={j.id} className="flex items-center gap-4 px-6 py-4 hover:bg-zinc-50/50 transition-colors">
                <div className="flex-1">
                  <p className="text-sm font-medium text-zinc-900">{j.title}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{j.company} • {j.location}</p>
                </div>
                <div className="flex flex-wrap gap-1 hidden sm:flex">
                  {j.skills_required?.slice(0, 3).map((s: string) => (
                    <span key={s} className="text-[10px] px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-600 font-medium">{s}</span>
                  ))}
                </div>
                <span className="text-xs font-semibold text-zinc-700 whitespace-nowrap bg-zinc-100 px-3 py-1.5 rounded-lg">{j.salary_range}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


