"use client";
import { useState, useEffect } from "react";
import { 
  History, 
  PanelRightClose, 
  PanelRightOpen, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ChevronDown, 
  ChevronRight,
  Box,
  Activity
} from "lucide-react";

// Define the type for our history items
type RunDetail = { name: string; duration: string; status: 'success' | 'failed'; output: string };
type RunHistory = { id: string; date: string; scope: string; status: 'success' | 'failed'; duration: string; details: RunDetail[] };

export default function RightSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedRun, setExpandedRun] = useState<string | null>("125");
  const [history, setHistory] = useState<RunHistory[]>([]);

  // Generate dynamic, realistic timestamps based on your actual current time
  useEffect(() => {
    const now = new Date();
    const formatTime = (minutesAgo: number) => {
      const d = new Date(now.getTime() - minutesAgo * 60000);
      return d.toLocaleString('en-US', { 
        month: 'short', day: 'numeric', year: 'numeric', 
        hour: 'numeric', minute: '2-digit', hour12: true 
      });
    };

    setHistory([
      {
        id: "125",
        date: formatTime(2), // 2 minutes ago
        scope: "Full Workflow",
        status: "success",
        duration: "8.1s",
        details: [
          { name: "Text Node (node-1)", duration: "0.1s", status: "success", output: '"Generate a product description"' },
          { name: "Image Node (node-2)", duration: "2.3s", status: "success", output: "https://cdn.transloadit.com/img..." },
          { name: "Crop Image (node-3)", duration: "1.5s", status: "success", output: "https://cdn.transloadit.com/crop..." },
          { name: "LLM Node (node-4)", duration: "4.2s", status: "success", output: '"Introducing our premium..."' }
        ]
      },
      {
        id: "124",
        date: formatTime(18), // 18 minutes ago
        scope: "2 nodes selected",
        status: "success",
        duration: "4.6s",
        details: [
          { name: "Crop Image (node-3)", duration: "1.5s", status: "success", output: "https://cdn.transloadit.com/crop..." },
          { name: "LLM Node (node-4)", duration: "3.1s", status: "success", output: '"Updated product copy"' }
        ]
      },
      {
        id: "123",
        date: formatTime(45), // 45 minutes ago
        scope: "Single Node",
        status: "failed",
        duration: "0.8s",
        details: [
          { name: "Extract Frame (node-5)", duration: "0.8s", status: "failed", output: "Error: Invalid timestamp parameter. Expected value between 0-100%." }
        ]
      }
    ]);
  }, []);

  const toggleRun = (id: string) => {
    setExpandedRun(expandedRun === id ? null : id);
  };

  return (
    <aside 
      className={`${isCollapsed ? "w-[60px]" : "w-[340px]"} flex-shrink-0 border-l border-[#1f1f1f] bg-[#000000] flex flex-col transition-all duration-300 ease-in-out relative z-40 shadow-[-10px_0_30px_rgba(0,0,0,0.5)]`}
    >
      {/* Header */}
      <div className={`p-4 flex items-center border-b border-[#1f1f1f] h-14 transition-all duration-300 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed && (
          <div className="flex items-center gap-2.5">
            <div className="bg-[#1a1a1a] p-1.5 rounded-md border border-[#333]">
              <History className="h-3.5 w-3.5 text-[#e5e5e5]" />
            </div>
            <span className="text-[13px] font-bold text-[#e5e5e5] tracking-widest uppercase">
              Run History
            </span>
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-[#a1a1aa] hover:text-white transition-all duration-200 p-1.5 rounded-lg hover:bg-[#1a1a1a] active:scale-95 flex-shrink-0"
        >
          {isCollapsed ? <PanelRightOpen className="h-4 w-4" /> : <PanelRightClose className="h-4 w-4" />}
        </button>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden sidebar-scroll bg-[#050505]">
        {isCollapsed ? (
          <div className="flex flex-col items-center py-6 gap-5">
            {history.map((run) => (
              <div 
                key={run.id}
                onClick={() => setIsCollapsed(false)}
                className={`w-3 h-3 rounded-full cursor-pointer transition-all hover:scale-125 hover:ring-4 ${
                  run.status === 'success' 
                    ? 'bg-[#10b981] ring-[#10b981]/20 shadow-[0_0_10px_rgba(16,185,129,0.5)]' 
                    : 'bg-[#ef4444] ring-[#ef4444]/20 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                }`}
                title={`Run #${run.id}`}
              />
            ))}
          </div>
        ) : (
          <div className="p-4 flex flex-col gap-4">
            {history.map((run) => (
              <div 
                key={run.id} 
                className={`bg-[#0a0a0a] border rounded-xl overflow-hidden transition-all duration-300 ${
                  expandedRun === run.id 
                    ? 'border-[#333333] shadow-[0_4px_20px_rgba(0,0,0,0.5)]' 
                    : 'border-[#1a1a1a] hover:border-[#2a2a2a]'
                }`}
              >
                {/* Run Card Header */}
                <div 
                  onClick={() => toggleRun(run.id)}
                  className="p-3.5 cursor-pointer flex flex-col gap-3 hover:bg-[#0c0c0c] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {run.status === 'success' ? (
                        <CheckCircle2 className="h-4 w-4 text-[#10b981]" />
                      ) : (
                        <XCircle className="h-4 w-4 text-[#ef4444]" />
                      )}
                      <span className="text-[14px] font-semibold text-[#e5e5e5]">Run #{run.id}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#a1a1aa] bg-[#111] px-2 py-1 rounded-md border border-[#222]">
                      <Clock className="h-3 w-3 text-[#777]" />
                      {run.duration}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-[#888]">{run.date}</span>
                    <span className="text-[#a1a1aa] flex items-center gap-1.5 bg-[#1a1a1a] px-2 py-0.5 rounded-full border border-[#2a2a2a]">
                      <Box className="h-3 w-3 text-[#666]" />
                      {run.scope}
                    </span>
                  </div>
                </div>

                {/* Expanded Timeline View */}
                {expandedRun === run.id && (
                  <div className="bg-[#000000] border-t border-[#1f1f1f] p-4">
                    <div className="flex items-center gap-2 mb-4 text-[11px] font-semibold text-[#777] uppercase tracking-wider">
                      <Activity className="h-3 w-3" /> Execution Timeline
                    </div>
                    
                    <div className="relative pl-3 space-y-4 border-l border-[#222] ml-1.5">
                      {run.details.map((detail, idx) => (
                        <div key={idx} className="relative pl-4">
                          {/* Timeline Dot */}
                          <div className={`absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-[#000] ${
                            detail.status === 'success' ? 'bg-[#10b981]' : 'bg-[#ef4444]'
                          }`} />
                          
                          <div className="flex items-center justify-between text-[12.5px] mb-1.5">
                            <span className={detail.status === 'failed' ? "text-[#ef4444] font-medium" : "text-[#d4d4d8] font-medium"}>
                              {detail.name}
                            </span>
                            <span className="text-[#555] font-mono text-[11px]">{detail.duration}</span>
                          </div>
                          
                          <div className={`text-[11px] font-mono p-2 rounded-md border truncate ${
                            detail.status === 'failed' 
                              ? 'bg-[#ef4444]/10 border-[#ef4444]/20 text-[#ef4444]' 
                              : 'bg-[#111] border-[#222] text-[#a1a1aa]'
                          }`}>
                            {detail.output}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}