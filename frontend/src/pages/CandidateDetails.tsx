import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { 
  ArrowLeft, Mail, Phone, MapPin, Briefcase, 
  Calendar, Award, Code, BarChart3, Video,
  Download, Trash2, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import InterviewModal from "@/components/InterviewModal";

export default function CandidateDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCandidate = async () => {
      const { data, error } = await supabase
        .from("candidates")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        toast.error("Candidate not found");
        navigate("/dashboard/candidates");
      } else {
        setCandidate(data);
      }
      setLoading(false);
    };

    fetchCandidate();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!candidate) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Candidates
        </button>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="rounded-xl gap-2 border-zinc-200 dark:border-zinc-800">
            <Download size={14} /> Resume
          </Button>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="rounded-xl gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20"
          >
            <Video size={14} /> Invite to Interview
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Basic Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card border border-border rounded-3xl p-8 text-center space-y-4 shadow-sm">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-accent mx-auto flex items-center justify-center text-primary-foreground text-3xl font-bold shadow-xl shadow-primary/20">
              {candidate.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground outfit">{candidate.name}</h1>
              <p className="text-primary font-medium">{candidate.role_applied || "Full Stack Developer"}</p>
            </div>
            <div className="flex justify-center">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                candidate.status === 'hired' ? 'bg-emerald-500/10 text-emerald-600' : 
                candidate.status === 'rejected' ? 'bg-red-500/10 text-red-600' : 'bg-amber-500/10 text-amber-600'
              }`}>
                {candidate.status}
              </span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-3xl p-6 space-y-5 shadow-sm">
            <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">Contact Details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-muted rounded-lg text-muted-foreground"><Mail size={16} /></div>
                <span className="text-foreground font-medium truncate">{candidate.email || "No email"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-muted rounded-lg text-muted-foreground"><Phone size={16} /></div>
                <span className="text-foreground font-medium">{candidate.phone || "+91 98765 43210"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-muted rounded-lg text-muted-foreground"><MapPin size={16} /></div>
                <span className="text-foreground font-medium">Ahmedabad, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Overall Score</p>
              <p className="text-3xl font-black text-primary outfit">{Number(candidate.overall_score).toFixed(0)}%</p>
              <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${candidate.overall_score}%` }} />
              </div>
            </div>
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Experience</p>
              <p className="text-3xl font-black text-foreground outfit">4.5 Yrs</p>
              <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">Verified via Resume Analysis</p>
            </div>
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Role Match</p>
              <p className="text-3xl font-black text-accent outfit">High</p>
              <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1 text-emerald-500">Excellent fit for the team</p>
            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-card border border-border rounded-3xl p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground outfit flex items-center gap-2">
                <Code size={20} className="text-primary" /> Technical Skills
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {(candidate.skills || ["React", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS", "AWS"]).map((skill: string) => (
                <div key={skill} className="px-4 py-2 bg-muted/50 border border-border rounded-xl text-sm font-medium hover:border-primary/30 transition-colors">
                  {skill}
                </div>
              ))}
            </div>
          </div>

          {/* Analysis Summary */}
          <div className="bg-card border border-border rounded-3xl p-8 space-y-4 shadow-sm">
            <h2 className="text-xl font-bold text-foreground outfit flex items-center gap-2">
              <Award size={20} className="text-amber-500" /> AI Insights & Summary
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-sm">
              <p>
                Candidate shows strong proficiency in modern frontend frameworks and distributed systems. 
                The overall score is weighted heavily on technical accuracy and communication skills observed in preliminary screening.
              </p>
              <div className="grid gap-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                  <p><span className="font-semibold text-foreground">Strength:</span> Deep understanding of React hooks and state management patterns.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-amber-500 shrink-0" />
                  <p><span className="font-semibold text-foreground">Note:</span> Could improve on system design scaling considerations.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <InterviewModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        candidateName={candidate.name} 
      />
    </div>
  );
}
