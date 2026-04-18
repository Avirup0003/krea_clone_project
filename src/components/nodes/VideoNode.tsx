import { Handle, Position } from "reactflow";
import { useStore } from "@/store/useStore";
import { Video as VideoIcon, Upload } from "lucide-react";
import { useRef } from "react";

export default function VideoNode({ id, data }: { id: string; data: any }) {
  const updateNodeData = useStore((state) => state.updateNodeData);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Safely handle the video file upload without plugin crashes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      // Added output: videoUrl so the next node can read it!
      updateNodeData(id, { videoUrl, output: videoUrl });
    }
  };

  return (
    <div className="w-[320px] bg-[#111111] border border-[#222222] rounded-2xl p-5 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-[#1a1a1a] p-2 rounded-lg border border-[#333]">
            <VideoIcon className="h-5 w-5 text-[#ec4899]" /> {/* Pink accent for videos */}
          </div>
          <span className="font-semibold text-[15px] text-[#e5e5e5]">Upload Video</span>
        </div>
        
        {/* Replace Button (Only shows if a video is uploaded) */}
        {data.videoUrl && (
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="text-[12px] font-medium text-[#a1a1aa] hover:text-[#ec4899] transition-colors"
          >
            Replace
          </button>
        )}
      </div>

      <div
        className={`bg-[#0a0a0a] border border-[#333] rounded-xl overflow-hidden flex flex-col items-center justify-center cursor-pointer hover:border-[#ec4899] transition-colors relative group ${!data.videoUrl ? 'border-dashed p-8' : ''}`}
        onClick={() => !data.videoUrl && fileInputRef.current?.click()}
      >
        {data.videoUrl ? (
          <video 
            src={data.videoUrl} 
            controls 
            className="w-full h-40 object-cover bg-black"
          />
        ) : (
          <>
            <Upload className="h-6 w-6 text-[#737373] mb-3 group-hover:text-[#ec4899] transition-colors" />
            <span className="text-sm text-[#a1a1aa] font-medium">Click to browse files</span>
            <span className="text-[11px] text-[#555555] mt-1 uppercase tracking-widest">MP4, MOV, WEBM</span>
          </>
        )}
        
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="video/mp4, video/mov, video/webm"
          onChange={handleFileChange}
        />
      </div>

      {/* Connection Handles */}
      <Handle type="target" position={Position.Left} id="input" className="w-3 h-3 bg-[#ec4899] border-2 border-[#111111]" />
      <Handle type="source" position={Position.Right} id="output" className="w-3 h-3 bg-[#ec4899] border-2 border-[#111111]" />
    </div>
  );
}