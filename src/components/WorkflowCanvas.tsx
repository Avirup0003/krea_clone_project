"use client";
import { useCallback, useRef, useState } from "react";
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

let idCounter = 0;
const getId = () => `node_${idCounter++}`;

export default function WorkflowCanvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode } = useStore();

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

  return (
    <div className="flex-1 h-full w-full relative" ref={reactFlowWrapper}>
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
          className="bg-[#0f0f0f]"
        >
          <Background color="#27272a" gap={24} size={2} />
          <Controls className="bg-secondary border-border fill-foreground" />
          <MiniMap className="bg-secondary" maskColor="#00000050" />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}