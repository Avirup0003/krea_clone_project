import { Clock, CheckCircle2, XCircle, PlayCircle } from "lucide-react";

const mockHistory = [
  { id: "run-123", time: "Jan 14, 3:45 PM", scope: "Full Workflow", status: "success", duration: "12.4s" },
  { id: "run-124", time: "Jan 14, 4:12 PM", scope: "Single Node", status: "failed", duration: "1.2s" },
  { id: "run-125", time: "Jan 14, 4:30 PM", scope: "Partial Run", status: "running", duration: "..." },
];

export default function HistorySidebar() {
  return (
    <aside className="w-80 border-l border-border bg-secondary flex flex-col hidden lg:flex">
      <div className="p-4 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Workflow History
        </h2>
      </div>
      <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-3">
        {mockHistory.map((run) => (
          <div key={run.id} className="bg-background border border-border rounded-lg p-3 hover:border-primary cursor-pointer transition-colors">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-medium text-foreground">{run.scope}</span>
              {run.status === "success" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
              {run.status === "failed" && <XCircle className="h-4 w-4 text-red-500" />}
              {run.status === "running" && <PlayCircle className="h-4 w-4 text-yellow-500 animate-pulse" />}
            </div>
            <div className="text-[10px] text-muted-foreground flex justify-between">
              <span>{run.time}</span>
              <span>{run.duration}</span>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}