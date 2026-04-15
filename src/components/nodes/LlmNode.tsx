import { Handle, Position } from "reactflow";
import { useStore } from "@/store/useStore";
import { BrainCircuit, Play } from "lucide-react";

export default function LlmNode({ id, data }: { id: string; data: any }) {
  const updateNodeData = useStore((state) => state.updateNodeData);
  const { runNode, nodeStates } = useStore();
  const isRunning = nodeStates[id]?.isRunning;

  return (
    <div className={`w-[300px] h-[240px] rounded-krea-lg border-2 border-slate-700/70 bg-gradient-to-b from-slate-900/80 to-slate-950/80 backdrop-blur-sm shadow-krea-glow-lg p-krea-4 transition-all duration-300 hover:shadow-krea-glow ${isRunning ? 'running' : ''}`}>
      <div className="flex items-center gap-krea-2 mb-krea-3">
        <BrainCircuit className="h-4 w-4 text-krea-400 drop-shadow-sm" />
        <span className="font-semibold text-sm text-slate-200 tracking-tight">Gemini Vision</span>
      </div>
      <div className="space-y-krea-2">
        <select
          className="w-full bg-slate-900/50 border border-slate-600 rounded-krea p-krea-2 text-sm text-slate-100 focus:outline-none focus:ring-krea-500/50"
          onChange={(e) => updateNodeData(id, { model: e.target.value })}
          defaultValue={data.model || 'gemini-1.5-flash'}
        >
          <option value="gemini-1.5-flash">Gemini 1.5 Flash (Vision)</option>
          <option value="gemini-pro">Gemini Pro</option>
        </select>
        <textarea
          className="w-full h-20 bg-slate-900/50 border border-slate-600 rounded-krea p-krea-2 text-sm text-slate-100 placeholder-slate-400 resize-none focus:outline-none focus:ring-krea-500/50 font-medium"
          placeholder="Prompt (supports image/video context from inputs)"
          onChange={(e) => updateNodeData(id, { prompt: e.target.value })}
          defaultValue={data.prompt || ''}
        />
        <button
          onClick={() => runNode(id)}
          disabled={isRunning}
          className="w-full px-krea-3 py-krea-2 bg-gradient-to-r from-krea-600 to-krea-500 text-white rounded-krea font-semibold text-xs uppercase tracking-wider hover:from-krea-500 hover:to-krea-400 shadow-krea-glow transition-all duration-200 hover:shadow-krea-glow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
        >
          {isRunning ? (
            <>
              <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Generating...
            </>
          ) : (
            <>
              <Play className="h-3 w-3" />
              Run LLM
            </>
          )}
        </button>
        {data.result && (
          <div className="p-krea-2 bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-600 rounded-krea text-xs text-slate-100 font-medium max-h-20 overflow-y-auto">
            {data.result}
          </div>
        )}
      </div>
      <Handle type="target" position={Position.Top} id="input" className="opacity-0 group-hover:opacity-100" />
      <Handle type="source" position={Position.Bottom} id="output" className="opacity-0 group-hover:opacity-100" />
    </div>
  );
}
