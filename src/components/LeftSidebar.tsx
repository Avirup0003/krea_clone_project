"use client";
import { Type, Image as ImageIcon, Video, BrainCircuit, Crop, SquareStack } from "lucide-react";

const nodes = [
  { type: "textNode", label: "Text Node", icon: Type },
  { type: "imageNode", label: "Upload Image", icon: ImageIcon },
  { type: "videoNode", label: "Upload Video", icon: Video },
  { type: "llmNode", label: "Run Any LLM", icon: BrainCircuit },
  { type: "cropNode", label: "Crop Image", icon: Crop },
  { type: "extractNode", label: "Extract Frame", icon: SquareStack },
];

export default function LeftSidebar() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="w-64 border-r border-border bg-secondary flex flex-col">
      <div className="p-4 flex-1 overflow-y-auto">
        <h2 className="text-xs font-semibold text-secondary-foreground mb-4 uppercase tracking-wider">Quick Access</h2>
        <div className="flex flex-col gap-2">
          {nodes.map((node) => (
            <div
              key={node.type}
              onDragStart={(e) => onDragStart(e, node.type)}
              draggable
              className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border cursor-grab hover:border-primary transition-colors"
            >
              <node.icon className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{node.label}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}