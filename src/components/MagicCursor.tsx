import { useEffect, useState } from "react";

export function MagicCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setHidden(false);
    };
    const handleMouseLeave = () => setHidden(true);
    const handleMouseEnter = () => setHidden(false);
    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  if (hidden) return null;

  return (
    <>
      {/* Outer Glow */}
      <div 
        className="pointer-events-none fixed inset-0 z-[100] transition-opacity duration-300 hidden sm:block mix-blend-screen"
        style={{ 
          background: `radial-gradient(800px circle at ${position.x}px ${position.y}px, rgba(99,102,241,0.06), transparent 40%)` 
        }}
      />
      {/* Mouse Follower Ring */}
      <div 
        className={`hidden sm:block pointer-events-none fixed z-[110] transform -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/50 mix-blend-screen transition-all duration-150 ease-out ${clicked ? 'w-8 h-8 bg-primary/20 scale-90' : 'w-12 h-12 scale-100'}`}
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      />
      {/* Core Dot */}
      <div 
        className="hidden sm:block pointer-events-none fixed z-[110] transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary mix-blend-screen shadow-[0_0_10px_rgba(99,102,241,0.8)]"
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      />
    </>
  );
}



