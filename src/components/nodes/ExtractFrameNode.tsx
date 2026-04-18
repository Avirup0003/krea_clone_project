import { Handle, Position } from "reactflow";
import { useStore } from "@/store/useStore";
import { SquareStack, Loader2, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function ExtractFrameNode({ id, data }: { id: string; data: any }) {
  const updateNodeData = useStore((state) => state.updateNodeData);
  const getNodeInputs = useStore((state) => state.getNodeInputs);
  const [isLoading, setIsLoading] = useState(false);

  // Pure frontend frame extraction using HTML5 Canvas
  const extractFrameLocally = (videoUrl: string, timeInSeconds: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.src = videoUrl;
      video.crossOrigin = "anonymous";
      video.muted = true;

      video.onloadedmetadata = () => {
        // Ensure we don't seek past the end of the video
        if (timeInSeconds > video.duration) timeInSeconds = video.duration;
        video.currentTime = timeInSeconds;
      };

      video.onseeked = () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg")); // Convert to image URL
        } else {
          reject(new Error("Failed to process image"));
        }
      };

      video.onerror = () => reject(new Error("Failed to load video file"));
    });
  };

  const handleRun = async () => {
    setIsLoading(true);
    updateNodeData(id, { error: null } as any); // Clear old errors

    try {
      // 1. Grab the video URL from the connected Video Node
      const inputs = getNodeInputs(id);
      const videoUrl = inputs.find(input => typeof input === 'string' && input.startsWith('blob:'));

      if (!videoUrl) {
        throw new Error("No video connected. Connect a Video Node to the input.");
      }

      // 2. Parse the timestamp (e.g., "10s" -> 10)
      const timeString = data.timestamp || "0s";
      const timeInSeconds = parseFloat(timeString.replace(/[^0-9.]/g, '')) || 0;

      // 3. Extract the frame
      const imageUrl = await extractFrameLocally(videoUrl, timeInSeconds);

      // 4. Save result and push to output handle
      updateNodeData(id, { 
        result: imageUrl, 
        output: imageUrl 
      });

    } catch (err: any) {
      updateNodeData(id, { error: err.message } as any);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[320px] bg-[#111111] border border-[#222222] rounded-2xl p-5 shadow-2xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-[#1a1a1a] p-2 rounded-lg border border-[#333]">
          <SquareStack className="h-5 w-5 text-[#10b981]" /> {/* Emerald accent */}
        </div>
        <span className="font-semibold text-[15px] text-[#e5e5e5]">Extract Frame</span>
      </div>

      <div className="flex flex-col gap-3">
        <input 
          type="text" 
          placeholder="Timestamp (e.g. 10s)" 
          className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl p-3 text-sm text-[#e5e5e5] focus:outline-none focus:border-[#10b981] transition-colors"
          value={data.timestamp || ""}
          onChange={(e) => updateNodeData(id, { timestamp: e.target.value })}
        />

        <button
          onClick={handleRun}
          disabled={isLoading}
          className="bg-[#e5e5e5] text-black hover:bg-white rounded-xl py-2.5 text-sm font-semibold flex justify-center items-center gap-2 transition-colors disabled:opacity-50"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isLoading ? "Extracting..." : "Extract Frame"}
        </button>

        {/* Display Error if any */}
        {data.error && (
          <div className="mt-1 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-xs text-red-400">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{data.error}</span>
          </div>
        )}

        {/* Display the extracted image inline! */}
        {data.result && (
          <div className="mt-2 rounded-xl overflow-hidden border border-[#333]">
            <img src={data.result} alt="Extracted Frame" className="w-full h-auto" />
          </div>
        )}
      </div>

      <Handle type="target" position={Position.Left} id="input-video" className="w-3 h-3 bg-[#10b981] border-2 border-[#111111]" />
      <Handle type="source" position={Position.Right} id="output-image" className="w-3 h-3 bg-[#10b981] border-2 border-[#111111]" />
    </div>
  );
}