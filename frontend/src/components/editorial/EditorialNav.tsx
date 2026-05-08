import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const SPRING_NAV = { type: "spring" as const, stiffness: 300, damping: 28 };
const SPRING_BTN = { type: "spring" as const, stiffness: 400, damping: 26 };

const navLinks = [
  { label: "Platform",  href: "#"          },
  { label: "Dashboard", href: "#dashboard" },
  { label: "Pricing",   href: "#"          },
  { label: "Docs",      href: "#"          },
];

export function EditorialNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 h-16 bg-background/85 backdrop-blur-md border-b border-border"
      >
        <div className="max-w-7xl mx-auto px-8 h-full flex items-center justify-between">

          {/* Wordmark */}
          <a
            href="/"
            className="font-serif text-lg text-foreground no-underline tracking-tight"
          >
            Zentalent
          </a>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground no-underline transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="/login"
              className="text-sm font-medium text-foreground no-underline"
            >
              Sign in
            </a>
            <motion.a
              href="/signup"
              whileTap={{ scale: 0.97, transition: SPRING_BTN }}
              className="racing-button px-4 py-2 text-sm no-underline inline-block"
            >
              Get started
            </motion.a>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 bg-transparent border-none cursor-pointer text-foreground"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0, transition: SPRING_NAV }}
            exit={{ opacity: 0, y: -6, transition: { duration: 0.14 } }}
            className="fixed top-16 left-0 right-0 z-40 flex flex-col py-5 px-8 gap-1 md:hidden bg-card border-b border-border shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="py-3 text-sm text-muted-foreground border-b border-border no-underline"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="/signup"
              className="mt-4 px-4 py-3 text-sm font-medium text-center racing-button no-underline block"
            >
              Get started
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}



