import { Handle, Position } from "reactflow";
import { useStore } from "@/store/useStore";
import { BrainCircuit, Loader2 } from "lucide-react";
import { useState } from "react";

export default function LlmNode({ id, data }: { id: string; data: any }) {
  const updateNodeData = useStore((state) => state.updateNodeData);
  const getNodeInputs = useStore((state) => state.getNodeInputs);
  const [isLoading, setIsLoading] = useState(false);

  const runLLM = async () => {
    try {
      setIsLoading(true);
      updateNodeData(id, { isRunning: true, result: null });

      const inputs = getNodeInputs(id);
      const combinedInputText = inputs.filter(i => typeof i === 'string' && !i.startsWith('blob:') && !i.startsWith('data:')).join("\n");
      const finalPrompt = `${data.prompt || ""}\n\n${combinedInputText}`.trim();

      const response = await fetch("/api/run-workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: finalPrompt || "Hello" }),
      });

      const result = await response.json();

      if (!response.ok) {
        updateNodeData(id, { result: `⚠️ Error: ${result.error}`, isRunning: false });
        return;
      }

      updateNodeData(id, { result: result.text, output: result.text, isRunning: false });
    } catch (error: any) {
      updateNodeData(id, { result: `⚠️ Network Error: ${error.message}`, isRunning: false });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`w-[320px] bg-[#111111] border border-[#222222] rounded-2xl p-5 shadow-2xl ${data.isRunning ? 'shadow-[0_0_20px_rgba(124,58,237,0.3)] border-[#7c3aed]' : ''}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-[#1a1a1a] p-2 rounded-lg border border-[#333]">
          <BrainCircuit className="h-5 w-5 text-[#7c3aed]" />
        </div>
        <span className="font-semibold text-[15px] text-[#e5e5e5]">Run Any LLM</span>
      </div>
      
      <div className="flex flex-col gap-3">
        <textarea
          className="bg-[#0a0a0a] border border-[#333] rounded-xl p-3 text-sm text-[#e5e5e5] resize-none h-24 focus:outline-none focus:border-[#7c3aed] transition-colors"
          placeholder="Enter system prompt..."
          onChange={(e) => updateNodeData(id, { prompt: e.target.value })}
          value={data.prompt || ""}
        />
        
        <button
          onClick={runLLM}
          disabled={isLoading}
          className="bg-[#e5e5e5] text-black hover:bg-white rounded-xl py-2.5 text-sm font-semibold flex justify-center items-center gap-2 transition-colors disabled:opacity-50"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isLoading ? "Running..." : "Run Node"}
        </button>

        {data.result && (
          <div className="mt-2 p-3 bg-[#0a0a0a] border border-[#333] rounded-xl text-sm text-[#a1a1aa] whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
            {data.result}
          </div>
        )}
      </div>

      <Handle type="target" position={Position.Left} id="input" className="w-3 h-3 bg-[#7c3aed] border-2 border-[#111111]" />
      <Handle type="source" position={Position.Right} id="output" className="w-3 h-3 bg-[#7c3aed] border-2 border-[#111111]" />
    </div>
  );
}