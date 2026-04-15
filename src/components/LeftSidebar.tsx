"use client";
import { useState } from "react";
import { 
  Type, 
  Image as ImageIcon, 
  Video, 
  BrainCircuit, 
  Crop, 
  SquareStack, 
  PanelLeftClose, 
  PanelLeftOpen
} from "lucide-react";
import { useStore } from "@/store/useStore";

const nodesList = [
  { type: "textNode", label: "Text Node", icon: Type },
  { type: "imageNode", label: "Upload Image", icon: ImageIcon },
  { type: "videoNode", label: "Upload Video", icon: Video },
  { type: "llmNode", label: "Run Any LLM", icon: BrainCircuit },
  { type: "cropNode", label: "Crop Image", icon: Crop },
  { type: "extractNode", label: "Extract Frame", icon: SquareStack },
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
    <aside className="w-80 flex-shrink-0 border-r bg-black border-gray-800 shadow-xl flex flex-col h-screen">
      <div className="p-4 flex items-center justify-between border-b border-gray-800">
        <span className="text-sm font-bold text-white uppercase tracking-wider">Node Palette</span>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)} 
          className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors duration-200"
        >
          <PanelLeftClose className="h-5 w-5" />
        </button>
      </div>
      
      <div className="p-4 flex-1 overflow-y-auto space-y-3">
        {nodesList.map((node, index) => (
          <div
            key={node.type}
            onClick={() => handleNodeClick(node.type, node.label)}
            onDragStart={(e) => onDragStart(e, node.type)}
            draggable
            className="flex items-center gap-3 p-4 bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-gray-500 cursor-pointer transition-all duration-200 hover:shadow-lg rounded-lg"
          >
            <node.icon className="h-8 w-8 text-gray-400" />
            <span className="text-sm font-medium text-white flex-1">{node.label}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}

