import { Handle, Position } from "reactflow";
import { useStore } from "@/store/useStore";
import { Crop, Play } from "lucide-react";

export default function CropNode({ id, data }: { id: string; data: any }) {
  const updateNodeData = useStore((state) => state.updateNodeData);
  const { nodeStates, runNode } = useStore();
  const isRunning = nodeStates[id]?.isRunning;

  return (
    <div className={`w-[300px] h-[240px] rounded-krea-lg border-2 border-slate-700/70 bg-gradient-to-b from-slate-900/80 to-slate-950/80 backdrop-blur-sm shadow-krea-glow-lg p-krea-4 transition-all duration-300 hover:shadow-krea-glow ${isRunning ? 'running' : ''}`}>
      <div className="flex items-center gap-krea-2 mb-krea-3">
        <Crop className="h-4 w-4 text-krea-400 drop-shadow-sm" />
        <span className="font-semibold text-sm text-slate-200 tracking-tight">Crop Image</span>
      </div>
      <div className="grid grid-cols-2 gap-krea-2 p-krea-2 bg-slate-900/50 rounded-krea">
        <div>
          <label className="text-xs text-slate-400 block mb-1 font-medium">X %</label>
          <input 
            type="number" 
            min="0" max="100"
            placeholder="0" 
            className="w-full bg-slate-800 border border-slate-600 rounded text-xs text-slate-100 p-krea-1 focus:outline-none focus:ring-krea-500/50 focus:border-krea-400"
            onChange={(e) => updateNodeData(id, { x: parseInt(e.target.value) || 0 })}
            value={data.x || ''}
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1 font-medium">Y %</label>
          <input 
            type="number" 
            min="0" max="100"
            placeholder="0" 
            className="w-full bg-slate-800 border border-slate-600 rounded text-xs text-slate-100 p-krea-1 focus:outline-none focus:ring-krea-500/50 focus:border-krea-400"
            onChange={(e) => updateNodeData(id, { y: parseInt(e.target.value) || 0 })}
            value={data.y || ''}
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1 font-medium">Width %</label>
          <input 
            type="number" 
            min="1" max="100"
            placeholder="100" 
            className="w-full bg-slate-800 border border-slate-600 rounded text-xs text-slate-100 p-krea-1 focus:outline-none focus:ring-krea-500/50 focus:border-krea-400"
            onChange={(e) => updateNodeData(id, { width: parseInt(e.target.value) || 100 })}
            value={data.width || ''}
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1 font-medium">Height %</label>
          <input 
            type="number" 
            min="1" max="100"
            placeholder="100" 
            className="w-full bg-slate-800 border border-slate-600 rounded text-xs text-slate-100 p-krea-1 focus:outline-none focus:ring-krea-500/50 focus:border-krea-400"
            onChange={(e) => updateNodeData(id, { height: parseInt(e.target.value) || 100 })}
            value={data.height || ''}
          />
        </div>
      </div>
      <button
        onClick={() => runNode(id)}
        disabled={isRunning}
        className="mt-krea-3 w-full px-krea-3 py-krea-2 bg-gradient-to-r from-krea-600 to-krea-500 text-white rounded-krea font-semibold text-xs uppercase tracking-wider hover:from-krea-500 hover:to-krea-400 shadow-krea-glow transition-all duration-200 hover:shadow-krea-glow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
      >
        {isRunning ? (
          <>
            <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
              <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Cropping...
          </>
        ) : (
          <>
            <Play className="h-3 w-3" />
            Crop Image
          </>
        )}
      </button>
      <Handle type="target" position={Position.Left} id="input-image" className="opacity-0 group-hover:opacity-100" style={{ top: 40 }} />
      <Handle type="source" position={Position.Right} id="output" className="opacity-0 group-hover:opacity-100" />
    </div>
  );
}
