import React, { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Brain, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fix: Redirect already-authenticated users away from the login page
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      // Fix: Friendlier message when email hasn't been verified yet
      if (error.message.toLowerCase().includes("email not confirmed")) {
        toast.error("Please verify your email before logging in. Check your inbox for a confirmation link.");
      } else {
        toast.error(error.message);
      }
    } else {
      navigate("/dashboard");
    }
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
          <h1 className="text-3xl font-bold text-foreground outfit tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground text-[15px] mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="glass-card rounded-3xl p-8 sm:p-10 space-y-6">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-white/10 bg-white/5 text-foreground text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50 shadow-inner"
                placeholder="Email"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-2xl border border-white/10 bg-white/5 text-foreground text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50 shadow-inner"
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-xs text-primary hover:underline font-medium">Forgot password?</Link>
          </div>

          <button type="submit" disabled={loading}
            className="glow-button w-full py-3 rounded-2xl bg-primary text-primary-foreground text-[15px] font-bold hover:scale-[1.02] shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all disabled:opacity-50 tracking-wide">
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {/* Fix: Hint about email verification for newly signed-up users */}
          <p className="text-center text-xs text-muted-foreground">
            Just signed up? Make sure to verify your email before logging in.
          </p>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account? <Link to="/signup" className="text-primary font-medium hover:underline">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}



