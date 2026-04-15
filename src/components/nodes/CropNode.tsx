import { Handle, Position } from "reactflow";
import { useStore } from "@/store/useStore";
import { Crop } from "lucide-react";

export default function CropNode({ id, data }: { id: string; data: any }) {
  const updateNodeData = useStore((state) => state.updateNodeData);

  return (
    <div className="w-[280px] border border-border bg-secondary shadow-lg rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Crop className="h-4 w-4 text-primary" />
        <span className="font-medium text-sm text-foreground">Crop Image</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <input 
          type="number" 
          placeholder="X %" 
          className="bg-background border border-border rounded p-1.5 text-xs text-foreground"
          onChange={(e) => updateNodeData(id, { x: e.target.value })}
        />
        <input 
          type="number" 
          placeholder="Y %" 
          className="bg-background border border-border rounded p-1.5 text-xs text-foreground"
          onChange={(e) => updateNodeData(id, { y: e.target.value })}
        />
        <input 
          type="number" 
          placeholder="Width %" 
          className="bg-background border border-border rounded p-1.5 text-xs text-foreground"
          onChange={(e) => updateNodeData(id, { width: e.target.value })}
        />
        <input 
          type="number" 
          placeholder="Height %" 
          className="bg-background border border-border rounded p-1.5 text-xs text-foreground"
          onChange={(e) => updateNodeData(id, { height: e.target.value })}
        />
      </div>
      <Handle type="target" position={Position.Left} id="input-image" style={{ top: 20 }} />
      <Handle type="target" position={Position.Left} id="input-params" style={{ top: 60 }} />
      <Handle type="source" position={Position.Right} id="output" />
    </div>
  );
}
