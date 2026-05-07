import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Brain, Mail, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) { toast.error(error.message); }
    else { setSent(true); }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/20 blur-[120px] animate-blob mix-blend-screen" />
        <div className="absolute top-[10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-accent/20 blur-[120px] animate-blob" style={{ animationDelay: '2s' }} mix-blend-screen />
        <div className="absolute bottom-[-10%] left-[10%] w-[60vw] h-[60vw] rounded-full bg-sky-500/10 blur-[120px] animate-blob" style={{ animationDelay: '4s' }} mix-blend-screen />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-sm">
              <Brain size={22} className="text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">Zentalent</span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground outfit tracking-tight">Reset password</h1>
          <p className="text-muted-foreground text-[15px] mt-2">We'll send you a reset link</p>
        </div>

        <div className="glass-card rounded-3xl p-8 sm:p-10 space-y-6">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald/10 flex items-center justify-center mx-auto">
                <Mail size={28} className="text-emerald" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Check your email</h2>
              <p className="text-sm text-muted-foreground">We've sent a password reset link to <strong>{email}</strong></p>
              <Link to="/login" className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:underline">
                <ArrowLeft size={14} /> Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Email address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-white/10 bg-white/5 text-foreground text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50 shadow-inner"
                    placeholder="Email" />
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="glow-button w-full py-3 rounded-2xl bg-primary text-primary-foreground text-[15px] font-bold hover:scale-[1.02] shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all disabled:opacity-50 tracking-wide mt-2">
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
              <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft size={14} /> Back to login
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}



