import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Mic, Code2, Brain, Play, ArrowLeft, Shield, Loader2 } from "lucide-react";
import { VoiceInterview } from "@/components/VoiceInterview";
import { CodingChallenge } from "@/components/CodingChallenge";
import { Proctoring } from "@/components/Proctoring";
import { toast } from "sonner";
import { getQuestionsForJob } from "@/lib/questionBank";
import { Scoreboard } from "@/components/Scoreboard";

export default function Interviews() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState("");
  const [activeType, setActiveType] = useState(null);
  const [startingType, setStartingType] = useState(null);
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [proctoring, setProctoring] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchApps = async () => {
      try {
        const { data, error } = await supabase.from("job_applications")
          .select("*, job_postings(title, company)")
          .eq("user_id", user.id)
          .order("applied_at", { ascending: false });

        if (error) throw error;

        if (data) {
          setApplications(data);
        }
      } catch (err) {
        console.error("Error fetching applications", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, [user]);

  const startInterview = async (type) => {
    if (!selectedApp) {
      toast.error("Select a job application first");
      return;
    }

    setStartingType(type);

    const app = applications.find(a => a.id === selectedApp);
    const jobTitle = app?.job_postings?.title || "Senior Full Stack Engineer";

    if (type === "technical" || type === "aptitude") {
      const q = getQuestionsForJob(jobTitle, type);
      setInterviewQuestions(q);
    }

    setActiveType(type);
    setProctoring(true);
    setStartingType(null);
  };

  const handleComplete = async (type, results) => {
    const app = applications.find(a => a.id === selectedApp);
    if (!app) return;

    const scoreField = type === "technical" ? "technical_score" : type === "aptitude" ? "aptitude_score" : "coding_score";
    const updateData = { [scoreField]: results.avgScore };

    const currentScores = {
      technical_score: type === "technical" ? results.avgScore : app.technical_score,
      aptitude_score: type === "aptitude" ? results.avgScore : app.aptitude_score,
      coding_score: type === "coding" ? results.avgScore : app.coding_score,
    };

    const nonZero = Object.values(currentScores).filter(s => s > 0);
    if (nonZero.length > 0) {
      updateData.overall_score = Math.round(nonZero.reduce((a, b) => a + b, 0) / nonZero.length);
    }

    if (nonZero.length === 3) {
      updateData.interview_stage = "completed";
      updateData.status = "interviewed";
    } else {
      updateData.interview_stage = "in_progress";
    }

    await supabase.from("job_applications").update(updateData).eq("id", selectedApp);
    toast.success(`${type} interview completed! Score: ${results.avgScore}%`);

    // Tarat j screen hide karo jethi React state clear thai jay
    setActiveType(null);

    // Refresh data
    const { data } = await supabase.from("job_applications")
      .select("*, job_postings(title, company)")
      .eq("user_id", user.id)
      .order("applied_at", { ascending: false });
    setApplications(data || []);

    // Sequential Logic (Ek pachi ek test)
    if (type === "technical") {
      toast.info("Preparing Aptitude Test...");
      setTimeout(() => startInterview("aptitude"), 1000);
    } else if (type === "aptitude") {
      toast.info("Preparing Coding Challenge...");
      setTimeout(() => startInterview("coding"), 1000);
    } else {
      toast.success("All interviews completed successfully!");
      setActiveType("result"); // Coding pati jay etle result screen batavo
      setProctoring(false);
    }
  };

  // Navo logic: Jo activeType 'result' hoy to Scoreboard batavo
  if (activeType === "result") {
    return (
      <div className="max-w-5xl mx-auto relative z-10 pt-10">
        <Scoreboard
          applicationId={selectedApp}
          onClose={() => setActiveType(null)}
        />
      </div>
    );
  }

  if (activeType) {
    return (
      <div className="max-w-5xl mx-auto">
        <button onClick={() => { setActiveType(null); setProctoring(false); }}
          className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-800 mb-4 transition-colors">
          <ArrowLeft size={16} /> Back to Interview Hub
        </button>

        <div className="grid lg:grid-cols-[1fr_280px] gap-6">
          <div>
            {activeType === "technical" && (
              <VoiceInterview key="technical" type="technical" questions={interviewQuestions}
                onComplete={r => handleComplete("technical", r)} />
            )}
            {activeType === "aptitude" && (
              <VoiceInterview key="aptitude" type="aptitude" questions={interviewQuestions}
                onComplete={r => handleComplete("aptitude", r)} />
            )}
            {activeType === "coding" && (() => {
              const app = applications.find(a => a.id === selectedApp);
              const jobTitle = app?.job_postings?.title || "Senior Full Stack Engineer";
              return <CodingChallenge key="coding" jobTitle={jobTitle} onComplete={r => handleComplete("coding", r)} />;
            })()}
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <Proctoring active={proctoring} onViolation={v => console.log("Violation:", v)} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto relative z-10">
      <h1 className="text-3xl font-bold text-zinc-900 outfit tracking-tight">Interview Hub</h1>

      <div className="glass-card rounded-3xl p-6 md:p-8 space-y-5 bg-zinc-50 border border-zinc-200">
        <h3 className="text-lg font-semibold text-zinc-800 outfit">Select Job Application</h3>
        <select value={selectedApp} onChange={e => setSelectedApp(e.target.value)}
          className="w-full px-5 py-3.5 rounded-2xl border border-zinc-300 bg-white text-zinc-800 text-sm focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all cursor-pointer">
          <option value="">Choose a job you applied to...</option>
          {applications.map(a => (
            <option key={a.id} value={a.id}>
              {a.job_postings?.title || "Job"} — {a.job_postings?.company || "Company"}
            </option>
          ))}
        </select>

        {selectedApp && (() => {
          const app = applications.find(a => a.id === selectedApp);
          if (!app) return null;
          return (
            <div className="flex flex-wrap gap-3 text-xs">
              <span className={`px-2.5 py-1 rounded-full font-medium ${app.technical_score > 0 ? "bg-zinc-200 text-zinc-800" : "bg-zinc-100 text-zinc-500"}`}>
                Technical: {app.technical_score > 0 ? `${app.technical_score}%` : "Not taken"}
              </span>
              <span className={`px-2.5 py-1 rounded-full font-medium ${app.aptitude_score > 0 ? "bg-zinc-200 text-zinc-800" : "bg-zinc-100 text-zinc-500"}`}>
                Aptitude: {app.aptitude_score > 0 ? `${app.aptitude_score}%` : "Not taken"}
              </span>
              <span className={`px-2.5 py-1 rounded-full font-medium ${app.coding_score > 0 ? "bg-zinc-200 text-zinc-800" : "bg-zinc-100 text-zinc-500"}`}>
                Coding: {app.coding_score > 0 ? `${app.coding_score}%` : "Not taken"}
              </span>
            </div>
          );
        })()}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <button onClick={() => startInterview("technical")} disabled={!selectedApp || startingType !== null}
          className="group glass-card rounded-3xl p-6 sm:p-8 text-left border border-zinc-200 hover:border-zinc-400 bg-white hover:bg-zinc-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
          <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center mb-4 group-hover:bg-zinc-200 transition-colors">
            {startingType === "technical" ? <Loader2 size={24} className="text-zinc-600 animate-spin" /> : <Mic size={24} className="text-zinc-600" />}
          </div>
          <h3 className="text-lg font-bold text-zinc-900 mb-2 outfit">Technical Interview</h3>
          <p className="text-xs text-zinc-500">Voice-based technical questions generated and evaluated by AI.</p>
          <div className="flex items-center gap-2 mt-4 text-xs text-zinc-600 font-medium">
            <Play size={12} /> 5 Questions • ~15 mins
          </div>
        </button>

        <button onClick={() => startInterview("aptitude")} disabled={!selectedApp || startingType !== null}
          className="group glass-card rounded-3xl p-6 sm:p-8 text-left border border-zinc-200 hover:border-zinc-400 bg-white hover:bg-zinc-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
          <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center mb-4 group-hover:bg-zinc-200 transition-colors">
            {startingType === "aptitude" ? <Loader2 size={24} className="text-zinc-600 animate-spin" /> : <Brain size={24} className="text-zinc-600" />}
          </div>
          <h3 className="text-lg font-bold text-zinc-900 mb-2 outfit">Aptitude Test</h3>
          <p className="text-xs text-zinc-500">Logical reasoning generated randomly. Speak through your thought process.</p>
          <div className="flex items-center gap-2 mt-4 text-xs text-zinc-600 font-medium">
            <Play size={12} /> 5 Questions • ~15 mins
          </div>
        </button>

        <button onClick={() => startInterview("coding")} disabled={!selectedApp}
          className="group glass-card rounded-3xl p-6 sm:p-8 text-left border border-zinc-200 hover:border-zinc-400 bg-white hover:bg-zinc-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
          <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center mb-4 group-hover:bg-zinc-200 transition-colors">
            <Code2 size={24} className="text-zinc-600" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 mb-2 outfit">Coding Challenge</h3>
          <p className="text-xs text-zinc-500">Adaptive coding problems with test cases. AI evaluates correctness & quality.</p>
          <div className="flex items-center gap-2 mt-4 text-xs text-zinc-600 font-medium">
            <Play size={12} /> 2 Problems • ~45 mins
          </div>
        </button>
      </div>

      <div className="glass-card border border-zinc-200 bg-zinc-50 rounded-3xl p-5 sm:p-6 flex items-start gap-4 mx-auto max-w-3xl text-center flex-col items-center sm:flex-row sm:text-left sm:items-start">
        <div className="p-3 bg-zinc-200 rounded-full shrink-0">
          <Shield size={24} className="text-zinc-600" />
        </div>
        <div>
          <p className="text-base font-bold text-zinc-800 outfit">AI Proctoring Enabled</p>
          <p className="text-xs text-zinc-500 mt-1">
            All interviews are monitored via webcam and screen tracking. Tab switches and window focus changes are recorded.
            Ensure your camera is enabled and stay on the interview tab throughout.
          </p>
        </div>
      </div>
    </div>
  );
}


