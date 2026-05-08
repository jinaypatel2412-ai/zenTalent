import React, { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Upload, FileText, CheckCircle2, X } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const SKILL_OPTIONS = [
  "HTML", "CSS", "JavaScript", "TypeScript", "React", "Angular", "Vue.js", "Node.js",
  "Python", "Java", "Kotlin", "Swift", "Go", "Rust", "C++", "C#",
  "SQL", "MongoDB", "PostgreSQL", "Redis", "Docker", "Kubernetes",
  "AWS", "Azure", "GCP", "Machine Learning", "Data Science", "DevOps",
];

export default function UploadResume() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [roleApplied, setRoleApplied] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFile = (f: File) => {
    if (f.size > 10 * 1024 * 1024) { toast.error("File too large (max 10MB)"); return; }
    if (!f.name.match(/\.(pdf|doc|docx)$/i)) { toast.error("Only PDF/DOC/DOCX files"); return; }
    setFile(f);
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !user || !candidateName.trim()) { toast.error("Please fill name and upload a resume"); return; }
    setLoading(true);

    try {
      // Upload file
      const filePath = `${user.id}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage.from("resumes").upload(filePath, file);
      if (uploadError) throw uploadError;

      // Create candidate
      const { error: insertError } = await supabase.from("candidates").insert({
        user_id: user.id,
        name: candidateName.trim(),
        email: candidateEmail.trim() || null,
        role_applied: roleApplied.trim() || null,
        resume_url: filePath,
        skills: selectedSkills,
        status: "screening",
        resume_score: Math.floor(Math.random() * 20) + 75, // Simulated AI score
        overall_score: Math.floor(Math.random() * 20) + 70,
      });
      if (insertError) throw insertError;

      toast.success("Resume uploaded and candidate created!");
      navigate("/dashboard/candidates");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Upload Resume</h1>
        <p className="text-sm text-muted-foreground mt-1">Upload a candidate's resume to parse, score, and begin evaluation.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl shadow-sm p-8 space-y-6">
        {/* File upload */}
        <div
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${dragOver ? "border-primary bg-primary/5 scale-[1.01]" : file ? "border-emerald bg-emerald/5" : "border-border hover:border-primary/50 hover:bg-primary/5"}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
        >
          {file ? (
            <div className="flex items-center justify-center gap-3">
              <CheckCircle2 size={24} className="text-emerald" />
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</p>
              </div>
              <button type="button" onClick={e => { e.stopPropagation(); setFile(null); }} className="ml-4 text-muted-foreground hover:text-destructive">
                <X size={16} />
              </button>
            </div>
          ) : (
            <>
              <Upload size={32} className="text-primary mx-auto mb-3" />
              <p className="text-sm font-medium text-foreground">Click to upload or drag & drop</p>
              <p className="text-xs text-muted-foreground mt-1">PDF, DOC, DOCX (Max 10MB)</p>
            </>
          )}
          <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </div>

        {/* Name */}
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Candidate Name *</label>
          <input type="text" required value={candidateName} onChange={e => setCandidateName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            placeholder="Full name" />
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
          <input type="email" value={candidateEmail} onChange={e => setCandidateEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            placeholder="candidate@email.com" />
        </div>

        {/* Role */}
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Role Applied For</label>
          <input type="text" value={roleApplied} onChange={e => setRoleApplied(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            placeholder="e.g. Full-Stack Engineer" />
        </div>

        {/* Skills */}
        <div>
          <label className="text-sm font-medium text-foreground mb-3 block">Skills & Technologies</label>
          <div className="flex flex-wrap gap-2">
            {SKILL_OPTIONS.map(skill => (
              <button key={skill} type="button" onClick={() => toggleSkill(skill)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${selectedSkills.includes(skill) ? "bg-primary text-primary-foreground ring-2 ring-primary/30" : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"}`}>
                {skill}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading || !file}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary-dark transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2">
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <FileText size={16} /> Upload & Analyze
            </>
          )}
        </button>
      </form>
    </div>
  );
}



