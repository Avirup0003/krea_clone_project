"use client";
import { UserButton } from "@clerk/nextjs";
import { Workflow, Save, Sparkles } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useState, useEffect } from "react";
import confetti from "canvas-confetti"; // Assume installed or use CSS

export default function Header() {
  const { nodes, edges } = useStore();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const response = await fetch("/api/workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "My NextFlow Project",
          nodes,
          edges,
        }),
      });
      
      if (response.ok) {
        // Confetti celebration
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#2563eb', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b']
        });
        // CSS alternative if no lib: trigger class toggle
      }
    } catch (error) {
      console.error("Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <header className="h-16 border-b border-border/30 bg-gradient-to-r from-black via-[#0a0a0a]/80 to-[#1a1a1a]/80 backdrop-blur-2xl flex items-center justify-between px-6 z-50 shadow-2xl shadow-black/60 relative overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-4 left-4 w-2 h-2 bg-gradient-to-r from-cyan to-lime rounded-full animate-particle-float delay-100"></div>
        <div className="absolute top-8 right-8 w-1.5 h-1.5 bg-gradient-to-r from-pink to-orange rounded-full animate-particle-float delay-500"></div>
        <div className="absolute bottom-4 left-1/4 w-2 h-2 bg-gradient-to-r from-purple to-pink rounded-full animate-particle-float delay-1000"></div>
      </div>
      
      <div className="flex items-center gap-3 relative z-10">
        <div className="group p-3 bg-gradient-to-br from-primary via-purple to-pink rounded-2xl shadow-neon-blue hover:shadow-glow-rainbow hover:animate-bounce-glow transition-all duration-500 hover:rotate-180 hover:scale-110">
          <Workflow className="h-6 w-6 text-white drop-shadow-lg group-hover:animate-spin-slow" />
        </div>
        <span className="text-2xl font-black rainbow-text animate-float drop-shadow-2xl tracking-tight">Next<span className="text-transparent bg-gradient-to-r from-green to-lime bg-clip-text animate-wave">Flow</span></span>
      </div>
      
      <div className="flex items-center gap-4 relative z-10">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="group relative flex items-center gap-2 bg-gradient-to-r from-secondary via-primary/20 to-purple hover:from-primary/90 hover:to-pink/90 border border-primary/30 hover:border-pink/50 text-foreground px-8 py-3 rounded-3xl text-sm font-black uppercase tracking-widest shadow-lg hover:shadow-neon-purple hover:shadow-glow-rainbow hover:-translate-y-2 hover:animate-bounce-glow transition-all duration-500 overflow-hidden button-shimmer disabled:opacity-50 disabled:cursor-not-allowed hover:tilt-3d"
        >
          <Sparkles className="h-5 w-5 group-hover:animate-spin-slow" />
          <span>{isSaving ? "Saving..." : "Save Magic"}</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000 opacity-0 group-hover:opacity-100" />
        </button>
        <div className="ring-4 ring-primary/30 hover:ring-[6px] hover:ring-gradient-to-r from-primary via-purple to-pink hover:shadow-neon-blue transition-all duration-300 rounded-full p-1">
          <UserButton 
            appearance={{ 
              elements: { 
                userButtonAvatarBox: "h-12 w-12 ring-2 ring-white/20 hover:ring-primary/50 shadow-2xl hover:shadow-neon-pink hover:animate-pulse" 
              } 
            }} 
          />
        </div>
      </div>
    </header>
  );
}
