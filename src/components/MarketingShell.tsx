import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Brain, Github, Linkedin, Menu, Twitter, X } from "lucide-react";

const marketingNavLinks = [
  { label: "Features", to: "/features" },
  { label: "About", to: "/about" },
  { label: "Pricing", to: "/pricing" },
];

function isActive(pathname: string, to: string) {
  return pathname === to;
}

export function MarketingShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        h1, h2, h3, h4, h5, h6, .outfit { font-family: 'Outfit', sans-serif; }
      `}</style>

      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/20 blur-[120px] animate-blob mix-blend-screen" />
        <div className="absolute top-[10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-accent/20 blur-[120px] animate-blob" style={{ animationDelay: "2s" }} />
      </div>

      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-card/70 backdrop-blur-xl shadow-sm border-b border-white/5" : "bg-transparent"}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
              <Brain size={18} className="text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground tracking-tight">Zentalent</span>
          </Link>

          <div className="hidden md:flex items-center gap-7 text-sm font-medium">
            {marketingNavLinks.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className={`transition-colors ${isActive(location.pathname, to) ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3 relative z-10">
            <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground px-4 py-2 rounded-xl hover:bg-white/5 transition-colors">Login</Link>
            <Link to="/signup" className="glow-button text-sm font-semibold bg-primary text-primary-foreground px-5 py-2 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-colors">Get Started</Link>
          </div>

          <button className="md:hidden p-2 rounded-lg text-muted-foreground hover:bg-muted" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-card border-t border-border px-4 pb-4 space-y-1">
            {marketingNavLinks.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className={`block py-2.5 px-3 rounded-xl text-sm font-medium ${isActive(location.pathname, to) ? "text-foreground bg-muted" : "text-muted-foreground hover:bg-muted"}`}
              >
                {label}
              </Link>
            ))}
            <div className="flex gap-2 pt-2">
              <Link to="/login" className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground text-center">Login</Link>
              <Link to="/signup" className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold text-center">Get Started</Link>
            </div>
          </div>
        )}
      </nav>

      <main className="relative z-10 pt-24">{children}</main>

      <footer className="relative z-10 border-t border-border bg-card py-12 px-4 sm:px-6 mt-20">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-4 gap-10">
          <div className="sm:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <Brain size={15} className="text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground text-sm">Zentalent</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">AI-driven recruitment for teams that care about quality, not just speed.</p>
            <div className="flex gap-3 pt-1">
              {[Twitter, Linkedin, Github].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary flex items-center justify-center text-muted-foreground transition-colors">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">Product</p>
            <ul className="space-y-2.5">
              <li><Link to="/features" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">Company</p>
            <ul className="space-y-2.5">
              <li><Link to="/about" className="text-xs text-muted-foreground hover:text-foreground transition-colors">About</Link></li>
              <li><a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Careers</a></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">Legal</p>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy</a></li>
              <li><a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">© 2026 Zentalent, Inc. All rights reserved.</p>
          <p className="text-xs text-muted-foreground">Built for modern hiring teams</p>
        </div>
      </footer>
    </div>
  );
}



