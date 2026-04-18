"use client";
import { useState } from "react";
import { Type, Image as ImageIcon, Video, BrainCircuit, Crop, SquareStack, PanelLeftClose, PanelRightClose } from "lucide-react";
import { useStore } from "@/store/useStore";

// We define specific hover colors and glows for each node type to make the UI pop
const nodesList = [
  { type: "textNode", label: "Text Node", icon: Type, color: "group-hover:text-[#3b82f6]", bg: "hover:bg-[#3b82f6]/10", border: "hover:border-[#3b82f6]/50", glow: "hover:shadow-[0_0_15px_rgba(59,130,246,0.15)]" },
  { type: "imageNode", label: "Upload Image", icon: ImageIcon, color: "group-hover:text-[#f59e0b]", bg: "hover:bg-[#f59e0b]/10", border: "hover:border-[#f59e0b]/50", glow: "hover:shadow-[0_0_15px_rgba(245,158,11,0.15)]" },
  { type: "videoNode", label: "Upload Video", icon: Video, color: "group-hover:text-[#ec4899]", bg: "hover:bg-[#ec4899]/10", border: "hover:border-[#ec4899]/50", glow: "hover:shadow-[0_0_15px_rgba(236,72,153,0.15)]" },
  { type: "llmNode", label: "Run Any LLM", icon: BrainCircuit, color: "group-hover:text-[#7c3aed]", bg: "hover:bg-[#7c3aed]/10", border: "hover:border-[#7c3aed]/50", glow: "hover:shadow-[0_0_15px_rgba(124,58,237,0.15)]" },
  { type: "cropNode", label: "Crop Image", icon: Crop, color: "group-hover:text-[#0ea5e9]", bg: "hover:bg-[#0ea5e9]/10", border: "hover:border-[#0ea5e9]/50", glow: "hover:shadow-[0_0_15px_rgba(14,165,233,0.15)]" },
  { type: "extractNode", label: "Extract Frame", icon: SquareStack, color: "group-hover:text-[#10b981]", bg: "hover:bg-[#10b981]/10", border: "hover:border-[#10b981]/50", glow: "hover:shadow-[0_0_15px_rgba(16,185,129,0.15)]" },
];

export default function LeftSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const addNode = useStore((state) => state.addNode);
  const nodesCount = useStore((state) => state.nodes.length);

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleNodeClick = (type: string, label: string) => {
    const offset = nodesCount * 25;
    const newNode = {
      id: `node_${Date.now()}`,
      type,
      position: { x: 250 + offset, y: 100 + offset },
      data: { label }
    };
    addNode(newNode);
  };

  return (
    <aside className={`${isCollapsed ? "w-[72px]" : "w-64"} flex-shrink-0 border-r border-[#1f1f1f] bg-[#000000] flex flex-col transition-all duration-300 ease-in-out relative z-40`}>
      {/* Header Area */}
      <div className={`p-4 flex items-center border-b border-[#1f1f1f] h-14 transition-all duration-300 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed && (
          <span className="text-xs font-bold text-[#e5e5e5] tracking-widest uppercase truncate">
            Node Palette
          </span>
        )}
        
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-[#a1a1aa] hover:text-white transition-all duration-200 p-1.5 rounded-lg hover:bg-[#1a1a1a] active:scale-95 flex-shrink-0"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <PanelRightClose className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>
      </div>

      {/* Node List Area */}
      <div className="p-3 flex-1 overflow-y-auto overflow-x-hidden flex flex-col gap-2 sidebar-scroll">
        {nodesList.map((node) => (
          <div
            key={node.type}
            onClick={() => handleNodeClick(node.type, node.label)}
            onDragStart={(e) => onDragStart(e, node.type)}
            draggable
            className={`group flex items-center ${isCollapsed ? "justify-center" : "gap-3"} p-3 rounded-xl border border-transparent cursor-grab active:cursor-grabbing text-[#a1a1aa] hover:text-white transition-all duration-300 ease-out bg-transparent ${node.bg} ${node.border} ${node.glow}`}
          >
            <node.icon className={`h-[18px] w-[18px] flex-shrink-0 transition-colors duration-300 ${node.color}`} />
            
            {!isCollapsed && (
              <span className="text-[13px] font-medium whitespace-nowrap transition-opacity duration-300">
                {node.label}
              </span>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}