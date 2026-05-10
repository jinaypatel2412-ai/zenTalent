import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Mic, Code2, Brain, Play, ArrowLeft, Shield } from "lucide-react";
import { VoiceInterview } from "@/components/VoiceInterview";
import { CodingChallenge } from "@/components/CodingChallenge";
import { Proctoring } from "@/components/Proctoring";
import { toast } from "sonner";
import { getQuestionsForJob, InterviewQuestion } from "@/lib/questionBank";
import { Loader2 } from "lucide-react";



type InterviewType = "technical" | "aptitude" | "coding" | null;

const MOCK_APPLICATIONS = [
  {
    id: "mock-app-1",
    user_id: "mock-user-1",
    job_posting_id: "mock-job-1",
    status: "applied",
    technical_score: 0,
    aptitude_score: 0,
    coding_score: 0,
    job_postings: {
      title: "Senior Full Stack Engineer",
      company: "Stellar Tech",
    }
  }
];

export default function Interviews() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedApp, setSelectedApp] = useState<string>("");
  const [activeType, setActiveType] = useState<InterviewType>(null);
  const [startingType, setStartingType] = useState<InterviewType>(null);
  const [interviewQuestions, setInterviewQuestions] = useState<InterviewQuestion[]>([]);
  const [proctoring, setProctoring] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      console.log("Interviews: No user found in context");
      setLoading(false);
      return;
    }

    const fetch = async () => {
      setLoading(true);
      console.log("Interviews: Fetching applications for user:", user.id);
      try {
        const { data, error } = await supabase.from("job_applications")
          .select("*, job_postings(title, company)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        
        if (error) {
          console.error("Interviews: Supabase error:", error);
          toast.error("Error loading applications: " + error.message);
        } else if (data) {
          console.log("Interviews: Applications found:", data.length);
          setApplications(data);
          if (data.length > 0 && !selectedApp) {
            // Auto-select first application
            // setSelectedApp(data[0].id);
          }
        }
      } catch (err) {
        console.error("Interviews: Unexpected error fetching applications:", err);
        toast.error("An unexpected error occurred while loading your applications.");
      }
      setLoading(false);
    };
    fetch();
  }, [user]);

  const startInterview = async (type: InterviewType) => {
    if (!selectedApp) { toast.error("Select a job application first"); return; }
    
    setStartingType(type);
    
    const app = applications.find(a => a.id === selectedApp);
    const jobTitle = (app?.job_postings as any)?.title || "Senior Full Stack Engineer";

    if (type === "technical" || type === "aptitude") {
      const q = getQuestionsForJob(jobTitle, type);
      setInterviewQuestions(q);
    }
    
    setActiveType(type);
    setProctoring(true);
    setStartingType(null);
  };
  const handleComplete = async (type: string, results: { avgScore: number }) => {
    const app = applications.find(a => a.id === selectedApp);
    if (!app) return;

    const scoreField = type === "technical" ? "technical_score" : type === "aptitude" ? "aptitude_score" : "coding_score";
    const updateData: any = { [scoreField]: results.avgScore };

    // Calculate overall if all done
    const currentScores = {
      technical_score: type === "technical" ? results.avgScore : app.technical_score,
      aptitude_score: type === "aptitude" ? results.avgScore : app.aptitude_score,
      coding_score: type === "coding" ? results.avgScore : app.coding_score,
    };

    const nonZero = Object.values(currentScores).filter(s => (s as number) > 0);
    if (nonZero.length > 0) {
      updateData.overall_score = Math.round((nonZero as number[]).reduce((a, b) => a + b, 0) / nonZero.length);
    }

    if (nonZero.length === 3) {
      updateData.interview_stage = "completed";
      updateData.status = "interviewed";
    } else {
      updateData.interview_stage = "in_progress";
    }

    await supabase.from("job_applications").update(updateData).eq("id", selectedApp);
    toast.success(`${type} interview completed! Score: ${results.avgScore}%`);
    setActiveType(null);
    setProctoring(false);

    // Refresh
    const { data } = await supabase.from("job_applications")
      .select("*, job_postings(title, company)")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });
    setApplications(data || []);
  };

  if (activeType) {
    return (
      <div className="max-w-5xl mx-auto">
        <button onClick={() => { setActiveType(null); setProctoring(false); }}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft size={16} /> Back to Interview Hub
        </button>

        <div className="grid lg:grid-cols-[1fr_280px] gap-6">
          <div>
            {activeType === "technical" && (
              <VoiceInterview type="technical" questions={interviewQuestions}
                onComplete={r => handleComplete("technical", r)} />
            )}
            {activeType === "aptitude" && (
              <VoiceInterview type="aptitude" questions={interviewQuestions}
                onComplete={r => handleComplete("aptitude", r)} />
            )}
            {activeType === "coding" && (() => {
              const app = applications.find(a => a.id === selectedApp);
              const jobTitle = (app?.job_postings as any)?.title || "Senior Full Stack Engineer";
              return <CodingChallenge jobTitle={jobTitle} onComplete={r => handleComplete("coding", r)} />;
            })()}
          </div>

          {/* Proctoring sidebar */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Proctoring active={proctoring} onViolation={v => console.log("Violation:", v)} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto relative z-10">
      <h1 className="text-3xl font-bold text-foreground outfit tracking-tight">Interview Hub</h1>

      {/* Select application */}
      <div className="glass-card rounded-3xl p-6 md:p-8 space-y-5">
        <h3 className="text-lg font-semibold text-foreground outfit">Select Job Application</h3>
        <select value={selectedApp} onChange={e => setSelectedApp(e.target.value)}
          className="w-full px-5 py-3.5 rounded-2xl border border-white/10 bg-white/5 text-foreground text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all cursor-pointer">
          <option value="">Choose a job you applied to...</option>
          {applications.map(a => (
            <option key={a.id} value={a.id}>
              {(a.job_postings as any)?.title || "Job"} — {(a.job_postings as any)?.company || "Company"}
            </option>
          ))}
        </select>

        {selectedApp && (() => {
          const app = applications.find(a => a.id === selectedApp);
          if (!app) return null;
          return (
            <div className="flex flex-wrap gap-3 text-xs">
              <span className={`px-2.5 py-1 rounded-full font-medium ${app.technical_score > 0 ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"}`}>
                Technical: {app.technical_score > 0 ? `${app.technical_score}%` : "Not taken"}
              </span>
              <span className={`px-2.5 py-1 rounded-full font-medium ${app.aptitude_score > 0 ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"}`}>
                Aptitude: {app.aptitude_score > 0 ? `${app.aptitude_score}%` : "Not taken"}
              </span>
              <span className={`px-2.5 py-1 rounded-full font-medium ${app.coding_score > 0 ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"}`}>
                Coding: {app.coding_score > 0 ? `${app.coding_score}%` : "Not taken"}
              </span>
            </div>
          );
        })()}
      </div>

      {/* Interview types */}
      <div className="grid md:grid-cols-3 gap-6">
        <button onClick={() => startInterview("technical")} disabled={!selectedApp || startingType !== null}
          className="group glass-card rounded-3xl p-6 sm:p-8 text-left hover:border-primary/40 hover:bg-white/[0.04] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
            {startingType === "technical" ? <Loader2 size={24} className="text-primary animate-spin" /> : <Mic size={24} className="text-primary" />}
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2 outfit group-hover:text-primary transition-colors">Technical Interview</h3>
          <p className="text-xs text-muted-foreground">Voice-based technical questions generated and evaluated by AI.</p>
          <div className="flex items-center gap-2 mt-4 text-xs text-primary font-medium">
            <Play size={12} /> 5 Questions • ~15 mins
          </div>
        </button>

        <button onClick={() => startInterview("aptitude")} disabled={!selectedApp || startingType !== null}
          className="group glass-card rounded-3xl p-6 sm:p-8 text-left hover:border-accent/40 hover:bg-white/[0.04] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
            {startingType === "aptitude" ? <Loader2 size={24} className="text-accent animate-spin" /> : <Brain size={24} className="text-accent" />}
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2 outfit group-hover:text-accent transition-colors">Aptitude Test</h3>
          <p className="text-xs text-muted-foreground">Logical reasoning generated randomly. Speak through your thought process.</p>
          <div className="flex items-center gap-2 mt-4 text-xs text-accent font-medium">
            <Play size={12} /> 5 Questions • ~15 mins
          </div>
        </button>

        <button onClick={() => startInterview("coding")} disabled={!selectedApp}
          className="group glass-card rounded-3xl p-6 sm:p-8 text-left hover:border-violet-500/40 hover:bg-white/[0.04] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
          <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-4 group-hover:bg-violet-500/20 transition-colors">
            <Code2 size={24} className="text-violet-600" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2 outfit group-hover:text-violet-500 transition-colors">Coding Challenge</h3>
          <p className="text-xs text-muted-foreground">Adaptive coding problems with test cases. AI evaluates correctness & quality.</p>
          <div className="flex items-center gap-2 mt-4 text-xs text-violet-600 font-medium">
            <Play size={12} /> 2 Problems • ~45 mins
          </div>
        </button>
      </div>

      {/* Proctoring notice */}
      <div className="glass-card !border-amber-500/20 bg-amber-500/5 rounded-3xl p-5 sm:p-6 flex items-start gap-4 mx-auto max-w-3xl text-center flex-col items-center sm:flex-row sm:text-left sm:items-start">
        <div className="p-3 bg-amber-500/10 rounded-full shrink-0">
          <Shield size={24} className="text-amber-500" />
        </div>
        <div>
          <p className="text-base font-bold text-foreground outfit">AI Proctoring Enabled</p>
          <p className="text-xs text-muted-foreground mt-1">
            All interviews are monitored via webcam and screen tracking. Tab switches and window focus changes are recorded. 
            Ensure your camera is enabled and stay on the interview tab throughout.
          </p>
        </div>
      </div>
    </div>
  );
}



