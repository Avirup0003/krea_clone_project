import { Handle, Position } from "reactflow";
import { useStore } from "@/store/useStore";
import { Image as ImageIcon, Upload, ImagePlus } from "lucide-react";
import { useRef } from "react";

export default function ImageNode({ id, data }: { id: string; data: any }) {
  const updateNodeData = useStore((state) => state.updateNodeData);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      updateNodeData(id, { imageUrl, output: imageUrl });
    }
  };

  return (
    <div className="w-[320px] bg-[#111111] border border-[#222222] rounded-2xl p-5 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-[#1a1a1a] p-2 rounded-lg border border-[#333]">
            <ImageIcon className="h-5 w-5 text-[#f59e0b]" />
          </div>
          <span className="font-semibold text-[15px] text-[#e5e5e5]">Upload Image</span>
        </div>
        
        {data.imageUrl && (
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="text-[12px] font-medium text-[#a1a1aa] hover:text-[#f59e0b] transition-colors"
          >
            Replace
          </button>
        )}
      </div>

      <div
        className={`bg-[#0a0a0a] border border-[#333] rounded-xl overflow-hidden flex flex-col items-center justify-center cursor-pointer hover:border-[#f59e0b] transition-colors relative group ${!data.imageUrl ? 'border-dashed p-8' : ''}`}
        onClick={() => !data.imageUrl && fileInputRef.current?.click()}
      >
        {data.imageUrl ? (
          <>
            <img src={data.imageUrl} alt="Uploaded" className="w-full h-40 object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <ImagePlus className="h-8 w-8 text-white" />
            </div>
          </>
        ) : (
          <>
            <Upload className="h-6 w-6 text-[#737373] mb-3 group-hover:text-[#f59e0b] transition-colors" />
            <span className="text-sm text-[#a1a1aa] font-medium">Click to browse files</span>
            <span className="text-[11px] text-[#555555] mt-1 uppercase tracking-widest">JPG, PNG, WEBP</span>
          </>
        )}
        
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/jpeg, image/png, image/webp, image/gif"
          onChange={handleFileChange}
        />
      </div>

      <Handle type="target" position={Position.Left} id="input" className="w-3 h-3 bg-[#f59e0b] border-2 border-[#111111]" />
      <Handle type="source" position={Position.Right} id="output" className="w-3 h-3 bg-[#f59e0b] border-2 border-[#111111]" />
    </div>
  );
}