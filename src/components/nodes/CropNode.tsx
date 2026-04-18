import { Handle, Position } from "reactflow";
import { useStore } from "@/store/useStore";
import { Crop, Loader2, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function CropNode({ id, data }: { id: string; data: any }) {
  const updateNodeData = useStore((state) => state.updateNodeData);
  const getNodeInputs = useStore((state) => state.getNodeInputs);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cropImageLocally = (imageUrl: string, x: number, y: number, w: number, h: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const sx = (x / 100) * img.width;
        const sy = (y / 100) * img.height;
        const sWidth = (w / 100) * img.width;
        const sHeight = (h / 100) * img.height;

        canvas.width = sWidth;
        canvas.height = sHeight;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight);
          resolve(canvas.toDataURL("image/jpeg"));
        } else {
          reject(new Error("Failed to process crop"));
        }
      };
      
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = imageUrl;
    });
  };

  const handleRun = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const inputs = getNodeInputs(id);
      const imageUrl = inputs.find(input => typeof input === 'string' && (input.startsWith('blob:') || input.startsWith('data:')));

      if (!imageUrl) {
        throw new Error("No image connected.");
      }

      const x = typeof data.x === "number" ? data.x : 0;
      const y = typeof data.y === "number" ? data.y : 0;
      const w = typeof data.width === "number" ? data.width : 100;
      const h = typeof data.height === "number" ? data.height : 100;

      const croppedUrl = await cropImageLocally(imageUrl, x, y, w, h);

      updateNodeData(id, { 
        result: croppedUrl, 
        output: croppedUrl 
      });

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[320px] bg-[#111111] border border-[#222222] rounded-2xl p-5 shadow-2xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-[#1a1a1a] p-2 rounded-lg border border-[#333]">
          <Crop className="h-5 w-5 text-[#0ea5e9]" />
        </div>
        <span className="font-semibold text-[15px] text-[#e5e5e5]">Crop Image</span>
      </div>

      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-2">
          <input 
            type="number" 
            placeholder="X %" 
            className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl p-2.5 text-sm text-[#e5e5e5] focus:outline-none focus:border-[#0ea5e9] transition-colors"
            value={data.x ?? ""}
            onChange={(e) => updateNodeData(id, { x: e.target.value === "" ? undefined : Number(e.target.value) })}
          />
          <input 
            type="number" 
            placeholder="Y %" 
            className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl p-2.5 text-sm text-[#e5e5e5] focus:outline-none focus:border-[#0ea5e9] transition-colors"
            value={data.y ?? ""}
            onChange={(e) => updateNodeData(id, { y: e.target.value === "" ? undefined : Number(e.target.value) })}
          />
          <input 
            type="number" 
            placeholder="Width %" 
            className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl p-2.5 text-sm text-[#e5e5e5] focus:outline-none focus:border-[#0ea5e9] transition-colors"
            value={data.width ?? ""}
            onChange={(e) => updateNodeData(id, { width: e.target.value === "" ? undefined : Number(e.target.value) })}
          />
          <input 
            type="number" 
            placeholder="Height %" 
            className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl p-2.5 text-sm text-[#e5e5e5] focus:outline-none focus:border-[#0ea5e9] transition-colors"
            value={data.height ?? ""}
            onChange={(e) => updateNodeData(id, { height: e.target.value === "" ? undefined : Number(e.target.value) })}
          />
        </div>

        <button
          onClick={handleRun}
          disabled={isLoading}
          className="bg-[#e5e5e5] text-black hover:bg-white rounded-xl py-2.5 text-sm font-semibold flex justify-center items-center gap-2 transition-colors disabled:opacity-50 mt-1"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isLoading ? "Cropping..." : "Run Crop"}
        </button>

        {error && (
          <div className="mt-1 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-xs text-red-400">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {data.result && (
          <div className="mt-2 rounded-xl overflow-hidden border border-[#333]">
            <img src={data.result} alt="Cropped" className="w-full h-auto" />
          </div>
        )}
      </div>

      <Handle type="target" position={Position.Left} id="input-image" className="w-3 h-3 bg-[#0ea5e9] border-2 border-[#111111]" />
      <Handle type="source" position={Position.Right} id="output" className="w-3 h-3 bg-[#0ea5e9] border-2 border-[#111111]" />
    </div>
  );
}