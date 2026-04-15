"use client";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, { ReactFlowProvider, Background, Controls, MiniMap } from "reactflow";
import "reactflow/dist/style.css";
import { useStore } from "@/store/useStore";
import LlmNode from "./nodes/LlmNode";
import TextNode from "./nodes/TextNode";
import ImageNode from "./nodes/ImageNode";
import VideoNode from "./nodes/VideoNode";
import CropNode from "./nodes/CropNode";
import ExtractFrameNode from "./nodes/ExtractFrameNode";

const nodeTypes = {
  llmNode: LlmNode,
  textNode: TextNode,
  imageNode: ImageNode,
  videoNode: VideoNode,
  cropNode: CropNode,
  extractNode: ExtractFrameNode,
};

let idCounter = 1000;
const getId = () => `node_${idCounter++}`;

const SAMPLE_WORKFLOW = {
  nodes: [
    {
      id: 'demo-text',
      type: 'textNode',
      position: { x: 100, y: 100 },
      data: { label: 'Demo Text', text: 'Generate a beautiful landscape image' }
    },
    {
      id: 'demo-llm',
      type: 'llmNode',
      position: { x: 400, y: 100 },
      data: { label: 'Gemini Pro Vision', prompt: 'Create image prompt from text' }
    },
    {
      id: 'demo-image',
      type: 'imageNode',
      position: { x: 700, y: 100 },
      data: { label: 'Upload Image' }
    },
    {
      id: 'demo-crop',
      type: 'cropNode',
      position: { x: 1000, y: 100 },
      data: { label: 'Crop Image', x: 10, y: 10, width: 80, height: 80 }
    }
  ],
  edges: [
    { id: 'e1-2', source: 'demo-text', target: 'demo-llm' },
    { id: 'e2-3', source: 'demo-llm', target: 'demo-image' },
    { id: 'e3-4', source: 'demo-image', target: 'demo-crop' }
  ]
};

export default function WorkflowCanvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const { 
    nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode,
    loadWorkflows, nodeStates 
  } = useStore();

  // Load workflows and sample on mount
  useEffect(() => {
    loadWorkflows();
  }, [loadWorkflows]);

  useEffect(() => {
    if (nodes.length === 0) {
      // Load sample workflow
      setTimeout(() => {
        nodes.forEach(n => addNode(n));
        edges.forEach((edge, index) => {
          setTimeout(() => onConnect(edge as any), index * 100);
        });
      }, 500);
    }
  }, []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");
      if (typeof type === "undefined" || !type || !reactFlowInstance) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
      };

      addNode(newNode);
    },
    [reactFlowInstance, addNode]
  );

  const getNodeClassName = useCallback((nodeId: string) => {
    const state = nodeStates[nodeId];
    if (state?.isRunning) {
      return "animate-[pulse_1s_cubic-bezier(0.4,0,0.6,1)_infinite] shadow-[0_0_20px_#A855F7_0.8] shadow-purple-500/50 scale-[1.05] border-2 border-purple-500/50 !z-[1000]";
    }
    return "hover:scale-[1.02] transition-all duration-200";
  }, [nodeStates]);

  return (
    <div className="flex-1 min-h-0 h-full w-full relative bg-gradient-to-br from-slate-950 via-[#0a0a0a] to-black overflow-hidden" ref={reactFlowWrapper}>
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-3 h-3 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full animate-particle-float opacity-40 z-0 blur-sm"></div>
        <div className="absolute top-40 right-32 w-2 h-2 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full animate-[particle-float_8s_ease-in-out_infinite_reverse] opacity-30 z-0 blur-sm delay-1000"></div>
        <div className="absolute bottom-32 left-1/3 w-4 h-4 bg-gradient-to-r from-emerald-500 to-lime-500 rounded-full animate-particle-float opacity-50 z-0 blur-sm delay-2000"></div>
        <div className="absolute bottom-20 right-20 w-2.5 h-2.5 bg-gradient-to-r from-cyan-500 to-sky-500 rounded-full animate-[particle-float_7s_ease-in-out_infinite] opacity-35 z-0 blur-sm delay-3000"></div>
      </div>
      
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
          maxZoom={2}
          minZoom={0.1}
          nodesConnectable={true}
          nodesDraggable={true}
          className="krea-clone-canvas [&_.react-flow__nodes]:drop-shadow-2xl"
        >
          <Background 
            color="#1e293b" 
            gap={16} 
            size={1}
            className="[&_.react-flow__bg-pattern]:!stroke-purple-900/30 opacity-60"
          />
          <Controls 
            className="bg-slate-950/98 backdrop-blur-xl rounded-2xl border border-violet-500/30 shadow-2xl hover:shadow-violet-500/50 p-3 transition-all duration-300 hover:scale-105 hover:rotate-1"
            showInteractive={false}
          />
          <MiniMap 
            className="bg-slate-950/95 backdrop-blur-2xl rounded-2xl border border-violet-500/50 shadow-2xl p-3 hover:shadow-violet-500/40 hover:scale-110 transition-all"
            maskColor="rgba(30,41,59,0.85)"
            nodeStrokeColor="#A855F7"
            nodeClassName="drop-shadow-lg"
            nodeBorderRadius={12}
            nodeColor="#1e293b"
          />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
