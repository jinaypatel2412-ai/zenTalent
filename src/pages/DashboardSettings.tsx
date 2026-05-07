import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { User, MapPin, Save, Upload, Globe, Eye, Languages, X, Camera } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const LANGUAGES_OPTIONS = [
  "English", "Hindi", "Spanish", "French", "German", "Chinese", "Japanese",
  "Korean", "Arabic", "Portuguese", "Russian", "Italian", "Dutch", "Turkish",
];

const VISIBILITY_OPTIONS = [
  { value: "everyone", label: "Everyone" },
  { value: "followers", label: "Followers & Following" },
  { value: "private", label: "Private (Only me)" },
];

export default function DashboardSettings() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [resumeUploading, setResumeUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarUploading, setAvatarUploading] = useState(false);

  const [languagesKnown, setLanguagesKnown] = useState<string[]>([]);
  const [contentLanguage, setContentLanguage] = useState("English");
  const [profileVisibility, setProfileVisibility] = useState("everyone");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setEmail(user.email || "");
    supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setFullName(data.full_name || "");
          setLocation(data.location || "");
          setResumeUrl(data.resume_url || "");
          setAvatarUrl(data.avatar_url || "");
          setLanguagesKnown(data.languages_known || []);
          setContentLanguage(data.content_language || "English");
          setProfileVisibility(data.profile_visibility || "everyone");
        }
      });
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Photo must be under 2MB");
      return;
    }
    setAvatarUploading(true);
    const path = `${user.id}/avatar_${Date.now()}.${file.name.split(".").pop()}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (error) {
      toast.error("Upload failed: " + error.message);
    } else {
      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
      setAvatarUrl(urlData.publicUrl);
      // Save immediately
      await supabase.from("profiles").update({ avatar_url: urlData.publicUrl } as any).eq("id", user.id);
      toast.success("Profile photo updated!");
    }
    setAvatarUploading(false);
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File must be under 5MB");
      return;
    }
    setResumeUploading(true);
    const path = `${user.id}/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from("resumes").upload(path, file, { upsert: true });
    if (error) {
      toast.error("Upload failed: " + error.message);
    } else {
      const { data: urlData } = supabase.storage.from("resumes").getPublicUrl(path);
      setResumeUrl(urlData.publicUrl);
      toast.success("Resume uploaded!");
    }
    setResumeUploading(false);
  };

  const toggleLanguage = (lang: string) => {
    setLanguagesKnown((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim(),
        location: location.trim(),
        resume_url: resumeUrl,
        avatar_url: avatarUrl,
        languages_known: languagesKnown,
        content_language: contentLanguage,
        profile_visibility: profileVisibility,
      } as any)
      .eq("id", user.id);
    setLoading(false);
    if (error) toast.error(error.message);
    else toast.success("Settings saved!");
  };

  const inputClass =
    "w-full pl-10 pr-4 py-3 rounded-2xl border border-white/10 bg-white/5 text-foreground text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50";

  return (
    <div className="max-w-3xl mx-auto space-y-8 relative z-10 pb-20">
      <h1 className="text-3xl font-bold text-foreground outfit tracking-tight">Settings</h1>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Profile Photo */}
        <section className="glass-card rounded-3xl p-6 md:p-8 space-y-6 transition-all duration-300 hover:border-primary/30">
          <h2 className="text-xl font-bold text-foreground outfit">Profile Photo</h2>
          <div className="flex items-center gap-5">
            <div className="relative group">
              <Avatar className="h-20 w-20">
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt="Profile" />
                ) : null}
                <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
                  {fullName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                disabled={avatarUploading}
                className="absolute inset-0 rounded-full bg-foreground/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition"
              >
                <Camera size={20} className="text-background" />
              </button>
              <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{avatarUploading ? "Uploading..." : "Click photo to change"}</p>
              <p className="text-xs text-muted-foreground">JPG, PNG under 2MB</p>
            </div>
          </div>
        </section>

        {/* Profile Information */}
        <section className="glass-card rounded-3xl p-6 md:p-8 space-y-6 transition-all duration-300 hover:border-primary/30">
          <h2 className="text-xl font-bold text-foreground outfit">Profile Information</h2>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} placeholder="Your name" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Location</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className={inputClass} placeholder="City, Country" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
            <div className="relative">
              <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="email" disabled value={email} className="w-full pl-10 pr-4 py-3 rounded-2xl border border-white/5 bg-white/5 text-muted-foreground text-sm cursor-not-allowed opacity-50" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Resume</label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={resumeUploading}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-white/10 bg-white/5 text-foreground text-sm hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                <Upload size={16} />
                {resumeUploading ? "Uploading..." : "Upload Resume"}
              </button>
              {resumeUrl && (
                <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline truncate max-w-[200px]">
                  View current resume
                </a>
              )}
              <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleResumeUpload} />
            </div>
          </div>
        </section>

        {/* General Preferences */}
        <section className="glass-card rounded-3xl p-6 md:p-8 space-y-6 transition-all duration-300 hover:border-primary/30">
          <h2 className="text-xl font-bold text-foreground outfit">General Preferences</h2>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Languages Known</label>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES_OPTIONS.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => toggleLanguage(lang)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                    languagesKnown.includes(lang)
                      ? "bg-primary text-primary-foreground border-primary shadow-[0_0_10px_rgba(99,102,241,0.4)]"
                      : "bg-white/5 text-foreground border-white/10 hover:bg-white/10"
                  }`}
                >
                  {lang}
                  {languagesKnown.includes(lang) && <X size={12} className="inline ml-1" />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Content Language</label>
            <div className="relative">
              <Languages size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <select
                value={contentLanguage}
                onChange={(e) => setContentLanguage(e.target.value)}
                className={inputClass}
              >
                {LANGUAGES_OPTIONS.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              <Eye size={14} className="inline mr-1.5 -mt-0.5" />
              Profile Photo Visibility
            </label>
            <div className="space-y-2">
              {VISIBILITY_OPTIONS.map((opt) => (
                <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="visibility"
                    value={opt.value}
                    checked={profileVisibility === opt.value}
                    onChange={() => setProfileVisibility(opt.value)}
                    className="accent-primary w-4 h-4"
                  />
                  <span className="text-sm text-foreground group-hover:text-primary transition">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </section>

        <button
          type="submit"
          disabled={loading}
          className="glow-button w-full py-4 rounded-2xl bg-primary text-primary-foreground text-[15px] font-bold tracking-wide hover:scale-[1.01] transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Save size={16} /> {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}



