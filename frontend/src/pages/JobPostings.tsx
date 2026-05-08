import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Briefcase, MapPin, DollarSign, Clock, Search, CheckCircle2, Send } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function JobPostings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      try {
        const [{ data: j, error: ej }, { data: a, error: ea }] = await Promise.all([
          supabase.from("job_postings").select("*").eq("status", "open").order("created_at", { ascending: false }),
          supabase.from("job_applications").select("*").eq("user_id", user.id),
        ]);
        
        if (!ej && j) setJobs(j);
        if (!ea && a) setApplications(a);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    fetch();
  }, [user]);

  const applyToJob = async (jobId: string) => {
    if (!user) return;

    const { error } = await supabase.from("job_applications").insert({
      user_id: user.id,
      job_posting_id: jobId,
      status: "applied",
    });
    
    if (error) {
      if (error.code === "23505") toast.info("Already applied to this job");
      else toast.error("Error applying to job: " + error.message);
      return;
    }
    
    toast.success("Application submitted! You can now take the interview.");
    const { data } = await supabase.from("job_applications").select("*").eq("user_id", user.id);
    setApplications(data || []);
  };

  const getAppStatus = (jobId: string) => applications.find(a => a.job_posting_id === jobId);

  const filtered = jobs.filter(j =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.company.toLowerCase().includes(search.toLowerCase()) ||
    j.skills_required?.some((s: string) => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-8 pb-20 relative z-10 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground outfit tracking-tight">Job Postings</h1>
          <p className="text-sm text-muted-foreground mt-1">Find your next role and apply instantly.</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">{jobs.length} open positions</span>
      </div>

      {/* Search */}
      <div className="relative group">
        <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by role, company, or skill..."
          className="w-full pl-12 pr-4 py-4 rounded-2xl border border-white/10 bg-white/5 text-foreground text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-inner placeholder:text-muted-foreground/50" />
      </div>

      {loading ? (
        <div className="p-12 text-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center">
          <Briefcase size={32} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No job postings found.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map(job => {
            const app = getAppStatus(job.id);
            return (
              <div key={job.id} className="glass-card rounded-3xl p-6 transition-all duration-300 hover:border-primary/40 hover:bg-white/[0.04]">
                <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-bold text-foreground outfit">{job.title}</h3>
                      {app && (
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary flex items-center gap-1">
                          <CheckCircle2 size={10} /> Applied
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-primary mb-3 uppercase tracking-wider">{job.company}</p>
                    <p className="text-[15px] text-foreground/80 leading-relaxed max-w-2xl mb-4">{job.description}</p>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground mb-4 border-b border-white/5 pb-4">
                      <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
                      <span className="flex items-center gap-1"><DollarSign size={12} /> {job.salary_range}</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {job.job_type}</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {job.skills_required?.map((skill: string) => (
                        <span key={skill} className="text-xs px-3 py-1 rounded-full border border-white/10 bg-white/5 text-foreground/90 font-medium hover:border-primary/30 transition-colors cursor-default">{skill}</span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0 md:mt-0 mt-4 md:items-end justify-center">
                    {app ? (
                      <button onClick={() => navigate("/dashboard/interviews")}
                        className="px-6 py-3 rounded-xl border border-accent bg-accent/10 text-accent font-semibold hover:bg-accent hover:text-accent-foreground transition-all duration-300 whitespace-nowrap group">
                        <span className="group-hover:scale-105 block transition-transform">Take Interview</span>
                      </button>
                    ) : (
                      <button onClick={() => applyToJob(job.id)}
                        className="glow-button px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:scale-105 transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.4)] flex items-center gap-2 whitespace-nowrap">
                        <Send size={15} /> Apply Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}



