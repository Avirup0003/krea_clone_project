import { Handle, Position } from "reactflow";
import { useStore } from "@/store/useStore";
import { SquareStack } from "lucide-react";

export default function ExtractFrameNode({ id, data }: { id: string; data: any }) {
  const updateNodeData = useStore((state) => state.updateNodeData);

  return (
    <div className="w-[280px] border border-border bg-secondary shadow-lg rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <SquareStack className="h-4 w-4 text-primary" />
        <span className="font-medium text-sm text-foreground">Extract Frame</span>
      </div>
      <input 
        type="text" 
        placeholder="Timestamp (e.g. 50% or 10s)" 
        className="w-full bg-background border border-border rounded p-2 text-xs text-foreground"
        onChange={(e) => updateNodeData(id, { timestamp: e.target.value })}
      />
      <Handle type="target" position={Position.Left} id="input-video" />
      <Handle type="source" position={Position.Right} id="output-image" />
    </div>
  );
}