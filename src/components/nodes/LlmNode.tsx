import { Handle, Position } from "reactflow";
import { useStore } from "@/store/useStore";
import { BrainCircuit } from "lucide-react";

export default function LlmNode({ id, data }: { id: string; data: any }) {
  const updateNodeData = useStore((state) => state.updateNodeData);

  const runLLM = async () => {
    try {
      updateNodeData(id, { isRunning: true });
      const response = await fetch("/api/run-workflow", {
        method: "POST",
        body: JSON.stringify({ prompt: data.prompt || "Hello" }),
      });
      const result = await response.json();
      updateNodeData(id, { result: result.text, isRunning: false });
    } catch (error) {
      updateNodeData(id, { isRunning: false });
    }
  };

  return (
    <div className={`w-[300px] border border-border bg-secondary shadow-lg rounded-lg p-4 ${data.isRunning ? "animate-pulsate shadow-primary" : ""}`}>
      <div className="flex items-center gap-2 mb-4">
        <BrainCircuit className="h-5 w-5 text-primary" />
        <span className="font-semibold text-sm">Gemini LLM</span>
      </div>
      <div className="flex flex-col gap-2">
        <input
          type="text"
          className="bg-background border border-border rounded p-2 text-sm"
          placeholder="System Prompt"
          onChange={(e) => updateNodeData(id, { prompt: e.target.value })}
        />
        <button onClick={runLLM} className="bg-primary text-white rounded py-2 text-sm font-medium mt-2">
          {data.isRunning ? "Running..." : "Run Node"}
        </button>
        {data.result && (
          <div className="mt-2 p-2 bg-background border border-border rounded text-xs text-foreground">
            {data.result}
          </div>
        )}
      </div>
      <Handle type="target" position={Position.Left} id="input" />
      <Handle type="source" position={Position.Right} id="output" />
    </div>
  );
}