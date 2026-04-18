import { Handle, Position } from "reactflow";
import { useStore } from "@/store/useStore";
import { Type } from "lucide-react";

export default function TextNode({ id, data }: { id: string; data: any }) {
  const updateNodeData = useStore((state) => state.updateNodeData);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    updateNodeData(id, { text: newText, output: newText });
  };

  return (
    <div className="w-[320px] bg-[#111111] border border-[#222222] rounded-2xl p-5 shadow-2xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-[#1a1a1a] p-2 rounded-lg border border-[#333]">
          <Type className="h-5 w-5 text-[#3b82f6]" />
        </div>
        <span className="font-semibold text-[15px] text-[#e5e5e5]">Text Input</span>
      </div>
      
      <textarea
        className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl p-3 text-sm text-[#e5e5e5] resize-none h-24 focus:outline-none focus:border-[#3b82f6] transition-colors"
        placeholder="Type your content here..."
        defaultValue={data.text || ""}
        onChange={handleTextChange}
      />
      
      <Handle type="target" position={Position.Left} id="input" className="w-3 h-3 bg-[#3b82f6] border-2 border-[#111111]" />
      <Handle type="source" position={Position.Right} id="output" className="w-3 h-3 bg-[#3b82f6] border-2 border-[#111111]" />
    </div>
  );
}