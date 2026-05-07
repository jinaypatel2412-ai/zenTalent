import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Home, Briefcase, Settings, Users, ArrowRight, Video } from "lucide-react";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const links = [
    { name: "Dashboard Overview", path: "/dashboard", icon: <Home size={18} /> },
    { name: "Community Feed", path: "/dashboard/feed", icon: <Users size={18} /> },
    { name: "Job Postings", path: "/dashboard/jobs", icon: <Briefcase size={18} /> },
    { name: "Interview Hub", path: "/dashboard/interviews", icon: <Video size={18} /> },
    { name: "Settings", path: "/dashboard/settings", icon: <Settings size={18} /> },
  ];

  const filtered = links.filter((link) => link.name.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const keydownHandler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : prev));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === "Enter" && filtered.length > 0) {
        e.preventDefault();
        handleSelect(filtered[selectedIndex].path);
      }
    };
    document.addEventListener("keydown", keydownHandler);
    return () => document.removeEventListener("keydown", keydownHandler);
  }, [open, filtered, selectedIndex]);

  const handleSelect = (path: string) => {
    setOpen(false);
    navigate(path);
    setQuery("");
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] sm:pt-[20vh] px-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
      
      <div className="relative glass-card w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-white/10 flex flex-col animate-in slide-in-from-top-4 duration-300 pointer-events-auto">
        <div className="flex items-center px-4 py-4 border-b border-white/10 bg-white/5">
          <Search className="text-primary mr-3" size={20} />
          <input 
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-foreground text-lg placeholder:text-muted-foreground/50 outfit tracking-wide"
            placeholder="Search or jump to..."
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white/10 text-[10px] text-muted-foreground font-mono font-bold uppercase tracking-wider">ESC</kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2 layout-scrollbar bg-card/40 backdrop-blur-3xl">
          {filtered.length === 0 ? (
            <p className="p-10 text-center text-sm text-muted-foreground">No matches found for "{query}".</p>
          ) : (
             filtered.map((link, i) => (
                <button 
                  key={link.path}
                  onClick={() => handleSelect(link.path)}
                  onMouseEnter={() => setSelectedIndex(i)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group text-left mb-1 last:mb-0 ${selectedIndex === i ? 'bg-primary/10 border border-primary/20 pl-6' : 'hover:bg-white/10 hover:pl-6'}`}
                >
                  <div className={`flex items-center gap-4 transition-colors ${selectedIndex === i ? 'text-primary' : 'text-foreground/80 group-hover:text-primary'}`}>
                    <div className={`p-2 rounded-xl transition-colors shadow-sm ${selectedIndex === i ? 'bg-primary/30' : 'bg-white/5 group-hover:bg-primary/20'}`}>{link.icon}</div>
                    <span className="font-semibold text-[15px] outfit">{link.name}</span>
                  </div>
                  <ArrowRight size={18} className={`transition-all ${selectedIndex === i ? 'opacity-100 text-primary translate-x-1' : 'text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary group-hover:translate-x-1'}`} />
                </button>
             ))
          )}
        </div>
        <div className="p-3 border-t border-white/5 bg-background/80 backdrop-blur-md flex justify-center text-xs text-muted-foreground gap-6 font-medium">
           <span className="flex items-center gap-2"><div className="flex gap-1"><kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono shadow-sm">↑</kbd><kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono shadow-sm">↓</kbd></div> to navigate</span>
           <span className="flex items-center gap-2"><kbd className="px-2 py-0.5 rounded bg-white/10 font-mono shadow-sm">Enter</kbd> to select</span>
        </div>
      </div>
    </div>
  )
}



