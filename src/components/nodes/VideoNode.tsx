import { Handle, Position } from "reactflow";
import { useStore } from "@/store/useStore";
import { Video, Upload } from "lucide-react";

export default function VideoNode({ id, data }: { id: string; data: any }) {
  const updateNodeData = useStore((state) => state.updateNodeData);

  return (
    <div className="w-[280px] border border-border bg-secondary shadow-lg rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Video className="h-4 w-4 text-primary" />
        <span className="font-medium text-sm text-foreground">Upload Video</span>
      </div>
      <div className="border-2 border-dashed border-border rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors bg-background">
        <Upload className="h-6 w-6 text-muted-foreground mb-2" />
        <span className="text-xs text-muted-foreground">Select MP4, MOV, WEBM</span>
      </div>
      <Handle type="target" position={Position.Left} id="input" />
      <Handle type="source" position={Position.Right} id="output" />
    </div>
  );
}