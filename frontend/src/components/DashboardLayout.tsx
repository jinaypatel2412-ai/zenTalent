import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Brain, LayoutDashboard, Briefcase, FileText,
  Settings, LogOut, Menu, X, ChevronRight,
  Home, PlusSquare, User,
} from "lucide-react";

const navItems = [
  { label: "Home Feed", icon: Home, path: "/dashboard/feed" },
  { label: "Create Post", icon: PlusSquare, path: "/dashboard/create" },
  { label: "Profile", icon: User, path: "/dashboard/profile" },
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Job Postings", icon: Briefcase, path: "/dashboard/jobs" },
  { label: "Interviews", icon: FileText, path: "/dashboard/interviews" },
  { label: "Settings", icon: Settings, path: "/dashboard/settings" },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { signOut, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<{ full_name?: string; avatar_url?: string } | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      const { data } = await supabase.from("profiles").select("full_name, avatar_url").eq("id", user.id).single();
      if (data) setProfile(data);
    };
    fetchProfile();

    const channel = supabase
      .channel("profile-changes")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "profiles", filter: `id=eq.${user.id}` }, (payload) => {
        setProfile({ full_name: payload.new.full_name, avatar_url: payload.new.avatar_url });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const displayName = profile?.full_name || user?.user_metadata?.full_name || "User";
  const avatarUrl = profile?.avatar_url;

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        h1, h2, h3, h4, h5, h6, .outfit { font-family: 'Outfit', sans-serif; }
      `}</style>

      {/* Decorative ambient dashboard glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" style={{ mixBlendMode: 'screen' }}>
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/5 blur-[120px] animate-blob" />
        <div className="absolute bottom-[10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-accent/5 blur-[120px] animate-blob" style={{ animationDelay: '3s' }} />
      </div>

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card/60 backdrop-blur-2xl border-r border-white/5 shadow-2xl transform transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center gap-2 px-6 h-16 border-b border-white/5 relative z-50">
          <Link
            to="/dashboard/feed"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-2 rounded-md pointer-events-auto"
            aria-label="Go to home feed"
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Brain size={18} className="text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground tracking-tight outfit">Zentalent</span>
          </Link>
          <button className="md:hidden ml-auto text-muted-foreground" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-1 flex-1">
          {/* Social section */}
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-3 pt-2 pb-1">Community</p>
          {navItems.slice(0, 3).map(({ label, icon: Icon, path }) => {
            const active = location.pathname === path;
            return (
              <Link key={path} to={path} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                <Icon size={18} />
                {label}
                {active && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}

          {/* Hiring section */}
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-3 pt-4 pb-1">Hiring</p>
          {navItems.slice(3).map(({ label, icon: Icon, path }) => {
            const active = location.pathname === path;
            return (
              <Link key={path} to={path} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                <Icon size={18} />
                {label}
                {active && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5 bg-card/40">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <Avatar className="h-8 w-8">
              {avatarUrl ? <AvatarImage src={avatarUrl} alt={displayName} /> : null}
              <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors w-full">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-foreground/20 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 md:ml-64 relative z-10">
        <header className="h-16 border-b border-white/5 bg-background/60 backdrop-blur-2xl flex items-center px-6 sticky top-0 z-30 shadow-sm">
          <button className="md:hidden mr-4 text-muted-foreground" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <h2 className="text-lg font-semibold text-foreground outfit">
            {navItems.find(n => n.path === location.pathname)?.label || "Dashboard"}
          </h2>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}



