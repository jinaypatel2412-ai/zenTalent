import React from "react";
import { EditorialNav } from "@/components/editorial/EditorialNav";
import { HeroSection } from "@/components/editorial/HeroSection";
// FIXED: Ahiya thi {} brackets kadhi nakhya che
import BentoDashboard from "@/components/editorial/BentoDashboard";

export default function EditorialShowcase() {
  return (
    <div className="bg-background min-h-screen">
      <EditorialNav />

      <main className="pt-16">
        <HeroSection />

        <div id="dashboard">
          <BentoDashboard />
        </div>

        <footer
          className="max-w-7xl mx-auto px-8 py-8 flex flex-wrap items-center justify-between gap-4 border-t border-border"
        >
          <span className="font-mono text-xs text-muted-foreground">
            © 2026 Zentalent · British Racing Green Design System
          </span>
          <span className="text-xs text-muted-foreground">
            React · Framer Motion · Tailwind CSS
          </span>
        </footer>
      </main>
    </div>
  );
}


