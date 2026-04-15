import { Clock, CheckCircle2, XCircle, PlayCircle, TrendingUp, CircleDot } from "lucide-react";

const mockHistory = [
  { id: "run-123", time: "Jan 14, 3:45 PM", scope: "Full Workflow", status: "success" as const, duration: "12.4s", progress: 100 },
  { id: "run-124", time: "Jan 14, 4:12 PM", scope: "Single Node", status: "failed" as const, duration: "1.2s", progress: 80 },
  { id: "run-125", time: "Jan 14, 4:30 PM", scope: "Partial Run", status: "running" as const, duration: "4.2s", progress: 65 },
];

type StatusType = "success" | "failed" | "running";

const statusConfig: Record<StatusType, { icon: React.ComponentType<any>; base: string; pulse: string }> = {
  success: { icon: CheckCircle2, base: "bg-gradient-to-r from-green to-emerald-400 ring-green/30", pulse: "animate-pulsate" },
  failed: { icon: XCircle, base: "bg-gradient-to-r from-pink to-rose-400 ring-pink/30", pulse: "animate-[bounce_1s_infinite]" },
  running: { icon: PlayCircle, base: "bg-gradient-to-r from-orange to-amber-400 ring-orange/30", pulse: "animate-spin-slow animate-pulse" },
};

export default function HistorySidebar() {
  return (
    <aside className="w-80 border-l border-gradient-to-b from-primary/30 via-purple/20 to-pink/30 bg-gradient-to-t from-black/90 via-[#0a0a0a]/80 to-[#1a1a1a]/70 backdrop-blur-3xl flex flex-col hidden 2xl:flex shadow-glow-rainbow shadow-black/50 relative z-40 overflow-hidden">
      <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,#2563eb20_0deg,#8b5cf620_90deg,#ec489920_180deg,#10b98120_270deg,#f59e0b20_360deg)] animate-[spin-slow_20s_linear_infinite] opacity-40 blur-xl rounded-3xl"></div>
      
      <div className="p-6 border-b border-primary/20 h-20 flex items-center gap-3 relative z-10">
        <div className="p-3 bg-gradient-to-br from-cyan to-lime rounded-3xl border border-cyan/40 shadow-neon-cyan animate-float">
          <Clock className="h-6 w-6 text-cyan-300 drop-shadow-lg" />
        </div>
        <h2 className="text-lg font-black uppercase tracking-widest rainbow-text bg-clip-text animate-wave drop-shadow-xl">Run History</h2>
      </div>
      
      <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6 scrollbar-thin scrollbar-thumb-gradient-to-b from-purple to-pink scrollbar-track-transparent relative z-10">
        {mockHistory.map((run, index) => {
          const config = statusConfig[run.status];
          const StatusIcon = config.icon;
          return (
            <div 
              key={run.id}
              className="group/timeline history-card opacity-0 translate-y-8 animate-[slide-up-fade_0.8s_ease-out_forwards] delay-[var(--delay)] hover:animate-[tilt-3d_0.4s_ease-out] relative"
              style={{ "--delay": `${index * 0.1}s` } as React.CSSProperties}
            >
              <div className={`absolute -left-4 top-6 w-4 h-4 ${config.base} rounded-full ring-4 ring-current/50 shadow-neon-current animate-particle-float ${config.pulse}`} />
              
              <div className="relative z-10 bg-white/5 hover:bg-white/15 backdrop-blur-xl border border-white/15 hover:border-primary/50 rounded-3xl p-8 hover:shadow-glow-rainbow hover:shadow-2xl hover:shadow-neon-purple transition-all duration-700 hover:scale-[1.02] hover:-translate-y-3 cursor-pointer hover:rotate-1 shadow-2xl">
                <div className="flex items-start gap-6 mb-6 relative">
                  <div className={`flex-shrink-0 p-4 rounded-3xl shadow-2xl ring-4 ${config.base} group-hover/timeline:scale-125 transition-all duration-500 ${config.pulse}`}>
                    <StatusIcon className="h-8 w-8 drop-shadow-2xl animate-bounce-gentle" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-black bg-gradient-to-r from-white via-foreground to-primary bg-clip-text mb-3 drop-shadow-2xl group-hover:rainbow-text">{run.scope}</h3>
                    <div className="w-full bg-gradient-to-r from-white/10 to-border rounded-2xl h-3 overflow-hidden shadow-inner">
                      <div 
                        className="h-3 rounded-xl shadow-lg bg-gradient-to-r from-green via-emerald-400 to-lime animate-[pulse_1.5s_ease-in-out_infinite] transition-all duration-1000 relative overflow-hidden"
                        style={{ width: `${run.progress}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4 text-xs font-mono text-muted-foreground tracking-wider uppercase animate-fade-in">
                      <span className="flex items-center gap-1 animate-pulse">
                        <TrendingUp className="h-4 w-4 animate-spin-slow" />
                        {run.time}
                      </span>
                      <span className="px-4 py-2 bg-gradient-to-r from-transparent via-current/20 to-transparent rounded-full border border-current/30 shadow-neon-current animate-pulse">
                        {run.duration}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

