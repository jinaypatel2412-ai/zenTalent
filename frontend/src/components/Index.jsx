import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Brain, Code2, Video, Upload, CheckCircle2,
  ChevronRight, Twitter, Linkedin, Github, Menu, X,
  Zap, TrendingUp, Users, Shield, ArrowRight, Sparkles,
} from "lucide-react";
import { CandidateCard } from "@/components/CandidateCard";
import { FeatureCard } from "@/components/FeatureCard";
import { CircularProgress } from "@/components/CircularProgress";
import { SkillTag } from "@/components/SkillTag";

const marketingNavLinks = [
  { label: "Features", to: "/features" },
  { label: "About", to: "/about" },
  { label: "Pricing", to: "/pricing" },
];

function Stat({ value, label, icon: Icon }) {
  return (
    <div className="flex flex-col items-center text-center gap-1">
      <Icon size={18} className="text-primary mb-1" />
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground font-medium">{label}</p>
    </div>
  );
}

export default function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        h1, h2, h3, h4, h5, h6, .outfit { font-family: 'Outfit', sans-serif; }
      `}</style>

      {/* Dynamic Mesh Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/20 blur-[120px] animate-blob mix-blend-screen" style={{ mixBlendMode: 'screen' }} />
        <div className="absolute top-[10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-accent/20 blur-[120px] animate-blob" style={{ animationDelay: '2s', mixBlendMode: 'screen' }} />
        <div className="absolute bottom-[-10%] left-[10%] w-[60vw] h-[60vw] rounded-full bg-sky-500/10 blur-[120px] animate-blob" style={{ animationDelay: '4s', mixBlendMode: 'screen' }} />
      </div>

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-card/70 backdrop-blur-xl shadow-sm border-b border-white/5" : "bg-transparent"}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
              <Brain size={18} className="text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground tracking-tight">Zentalent</span>
          </div>

          <div className="hidden md:flex items-center gap-7 text-sm font-medium text-muted-foreground">
            {marketingNavLinks.map(({ label, to }) => (
              <Link key={to} to={to} className="hover:text-foreground transition-colors">{label}</Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3 relative z-10">
            <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground px-4 py-2 rounded-xl hover:bg-white/5 transition-colors">Login</Link>
            <Link to="/signup" className="glow-button text-sm font-semibold bg-primary text-primary-foreground px-5 py-2 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-colors">Get Started</Link>
          </div>

          <button className="md:hidden p-2 rounded-lg text-muted-foreground hover:bg-muted" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-card border-t border-border px-4 pb-4 space-y-1">
            {marketingNavLinks.map(({ label, to }) => (
              <Link key={to} to={to} onClick={() => setMenuOpen(false)} className="block py-2.5 px-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted">
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

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 z-10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <div className="space-y-7 relative z-10">
            <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 text-primary-foreground text-xs font-semibold px-4 py-1.5 rounded-full backdrop-blur-md">
              <Sparkles size={13} className="text-primary" /> Powered by Advanced AI · Now in Beta
            </div>
            <h1 className="text-5xl sm:text-6xl font-black text-foreground leading-[1.1] tracking-tight outfit drop-shadow-sm">
              Next-Gen Hiring<br />
              <span className="text-gradient">with AI Verification</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
              Zentalent automates resume parsing, conducts live coding assessments, and analyzes video interviews — so you hire the <em>right</em> person, every time.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link to="/signup" className="glow-button inline-flex items-center gap-2.5 bg-primary text-primary-foreground text-sm font-semibold px-7 py-3.5 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all hover:scale-[1.02]">
                <Upload size={16} /> Upload Resume
              </Link>
              <button className="inline-flex items-center gap-2 border border-white/10 bg-card/50 backdrop-blur hover:bg-white/5 text-foreground text-sm font-semibold px-7 py-3.5 rounded-xl transition-all hover:scale-[1.02]">
                Watch Demo <ChevronRight size={15} />
              </button>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <div className="flex -space-x-2">
                {["bg-primary", "bg-accent", "bg-sky", "bg-rose"].map((c, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full ${c} border-2 border-card flex items-center justify-center text-primary-foreground text-xs font-bold`}>
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">2,400+ teams</span> already hiring smarter</p>
            </div>
          </div>

          <div className="flex justify-center relative z-10 animate-float">
            <CandidateCard />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative border-y border-white/10 bg-card/40 backdrop-blur-md py-12 px-4 z-10">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8">
          <Stat value="10x" label="Faster screening" icon={Zap} />
          <Stat value="94%" label="Match accuracy" icon={TrendingUp} />
          <Stat value="50K+" label="Candidates scored" icon={Users} />
          <Stat value="SOC2" label="Compliant & secure" icon={Shield} />
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6" id="features">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Core Features</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">Everything you need to hire confidently</h2>
            <p className="text-muted-foreground max-w-md mx-auto text-base">Three AI-powered pillars that transform every stage of your recruitment funnel.</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            <FeatureCard icon={Brain} accentClass="bg-primary" title="Smart Resume Parsing" desc="Instantly extract skills, experience, and education from any PDF or DOCX. Our NLP engine structures raw resumes into ranked, searchable candidate profiles in seconds." />
            <FeatureCard icon={Code2} accentClass="bg-accent" title="Verified Coding Tests" desc="Embed live Monaco Editor sessions directly in the hiring flow. Candidates write real code — no copy-paste — with AI proctoring and automated evaluation rubrics." />
            <FeatureCard icon={Video} accentClass="bg-sky" title="Sentiment AI Interviews" desc="Analyse tone, confidence, and communication clarity from async video responses. Get objective sentiment scores alongside structured role-fit insights." />
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="relative py-24 px-4 sm:px-6 z-10" id="about">
        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-12 space-y-3 relative z-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Live Preview</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight outfit">Candidate Score Card</h2>
            <p className="text-muted-foreground text-base">A unified view of every signal — parsed, tested, and interviewed.</p>
          </div>

          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent blur opacity-30 animate-pulse rounded-3xl" />
          <div className="relative bg-card/40 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden glass-card">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold shadow">P</div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Priya Sharma</p>
                  <p className="text-xs text-muted-foreground">Senior Data Engineer · Bangalore</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald bg-emerald/10 px-2.5 py-1 rounded-full ring-1 ring-emerald/20">
                  <CheckCircle2 size={11} /> Fully Verified
                </span>
                <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full ring-1 ring-primary/20">
                  Top Match
                </span>
              </div>
            </div>

            <div className="p-6 grid md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-5">AI Score Breakdown</p>
                <div className="grid grid-cols-2 gap-5">
                  <CircularProgress value={92} label="Overall" color="hsl(var(--primary))" size={90} />
                  <CircularProgress value={88} label="Coding" color="hsl(var(--accent))" size={90} />
                  <CircularProgress value={95} label="Resume" color="hsl(var(--sky))" size={90} />
                  <CircularProgress value={81} label="Sentiment" color="hsl(var(--emerald))" size={90} />
                </div>
              </div>

              <div className="md:col-span-2 space-y-6">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Verified Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      ["Python", "Expert"], ["Apache Spark", "Expert"], ["dbt", "Advanced"],
                      ["Airflow", "Advanced"], ["Snowflake", "Advanced"], ["Kubernetes", "Intermediate"],
                      ["Kafka", "Intermediate"], ["Terraform", "Intermediate"],
                    ].map(([label, level]) => (
                      <SkillTag key={label} label={label} level={level} />
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Assessment Timeline</p>
                  <div className="space-y-3">
                    {[
                      { label: "Resume Parsed", time: "2 min ago", done: true },
                      { label: "Coding Test Completed", time: "1 hr ago", done: true },
                      { label: "Video Interview Analysed", time: "4 hrs ago", done: true },
                      { label: "Awaiting HR Review", time: "Pending", done: false },
                    ].map(({ label, time, done }) => (
                      <div key={label} className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${done ? "bg-emerald/10" : "bg-muted"}`}>
                          <CheckCircle2 size={13} className={done ? "text-emerald" : "text-muted-foreground/40"} />
                        </div>
                        <div className="flex-1 flex justify-between text-sm">
                          <span className={`font-medium ${done ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
                          <span className="text-muted-foreground text-xs">{time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-border flex flex-wrap gap-3 items-center justify-between bg-muted/60">
              <p className="text-xs text-muted-foreground">Last updated · just now · by Zentalent AI</p>
              <div className="flex gap-2">
                <button className="text-xs font-semibold border border-border px-4 py-2 rounded-xl text-muted-foreground hover:bg-card transition-colors">Export PDF</button>
                <button className="text-xs font-semibold bg-primary text-primary-foreground px-4 py-2 rounded-xl hover:bg-primary-dark transition-colors shadow-sm flex items-center gap-1.5">
                  Invite to Interview <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Ready to hire <span className="text-primary">10x smarter?</span>
          </h2>
          <p className="text-muted-foreground text-base">Join thousands of forward-thinking teams replacing guesswork with verified intelligence.</p>
          <Link to="/signup" className="inline-flex items-center gap-2.5 bg-primary hover:bg-primary-dark text-primary-foreground font-semibold px-8 py-3.5 rounded-xl shadow-sm transition-colors text-sm">
            Start Free Trial <ArrowRight size={16} />
          </Link>
          <p className="text-xs text-muted-foreground">No credit card required · Free 14-day trial · Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12 px-4 sm:px-6">
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

          {[
            { title: "Product", links: ["Features", "Pricing", "Changelog", "Roadmap"] },
            { title: "Company", links: ["About", "Blog", "Careers", "Press"] },
            { title: "Legal", links: ["Privacy", "Terms", "Security", "Cookies"] },
          ].map(({ title, links }) => (
            <div key={title}>
              <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">{title}</p>
              <ul className="space-y-2.5">
                {links.map(l => (
                  <li key={l}>
                    {l === "Features" && <Link to="/features" className="text-xs text-muted-foreground hover:text-foreground transition-colors">{l}</Link>}
                    {l === "Pricing" && <Link to="/pricing" className="text-xs text-muted-foreground hover:text-foreground transition-colors">{l}</Link>}
                    {l === "About" && <Link to="/about" className="text-xs text-muted-foreground hover:text-foreground transition-colors">{l}</Link>}
                    {l !== "Features" && l !== "Pricing" && l !== "About" && <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">{l}</a>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">© 2026 Zentalent, Inc. All rights reserved.</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">Made with <span className="text-rose">♥</span> for modern hiring teams</p>
        </div>
      </footer>
    </div>
  );
}


