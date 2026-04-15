import { Handle, Position } from "reactflow";
import { useStore } from "@/store/useStore";
import { Type } from "lucide-react";

export default function TextNode({ id, data }: { id: string; data: any }) {
  const updateNodeData = useStore((state) => state.updateNodeData);

  return (
    <div className="w-[280px] border border-border bg-secondary shadow-lg rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Type className="h-4 w-4 text-primary" />
        <span className="font-medium text-sm text-foreground">Text Input</span>
      </div>
      <textarea
        className="w-full bg-background border border-border rounded-md p-2 text-sm text-foreground resize-none h-24 focus:outline-none focus:ring-1 focus:ring-primary"
        placeholder="Enter text or prompt..."
        defaultValue={data.text || ""}
        onChange={(e) => updateNodeData(id, { text: e.target.value })}
      />
      <Handle type="target" position={Position.Left} id="input" />
      <Handle type="source" position={Position.Right} id="output" />
    </div>
  );
}