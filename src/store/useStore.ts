import { create } from "zustand";
import type { 
  Node, Edge, OnNodesChange, OnEdgesChange, OnConnect, 
  NodeChange, EdgeChange, Connection 
} from "reactflow";
import { 
  applyNodeChanges, applyEdgeChanges, addEdge 
} from "reactflow";
import { useAuth } from "@clerk/nextjs"; // Client-side auth

type NodeData = {
  label?: string;
  text?: string;
  imageUrl?: string;
  videoUrl?: string;
  prompt?: string;
  model?: string;
  result?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  timestamp?: string;
  output?: any;
};

type NodeState = {
  isRunning: boolean;
  output?: any;
};

type Workflow = {
  id: string;
  name: string;
  nodes: Node<NodeData>[];
  edges: Edge[];
};

type AppState = {
  nodes: Node<NodeData>[];
  edges: Edge[];
  workflows: Workflow[];
  currentWorkflowId?: string;
  nodeStates: Record<string, NodeState>;
  
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  
  addNode: (node: Node<NodeData>) => void;
  updateNodeData: (id: string, data: Partial<NodeData>) => void;
  setNodeRunning: (id: string, running: boolean) => void;
  setNodeOutput: (id: string, output: any) => void;
  
  loadWorkflows: () => Promise<void>;
  saveWorkflow: (name: string) => Promise<void>;
  loadWorkflow: (id: string) => void;
  exportWorkflow: () => string;
  
  runNode: (nodeId: string) => Promise<void>;
  
  // Helpers (not in UI state)
  getNodeInputs: (nodeId: string) => any[];
  getConnectedNodes: (nodeId: string) => string[];
};

export const useStore = create<AppState>((set, get) => ({
  nodes: [],
  edges: [],
  workflows: [],
  currentWorkflowId: undefined,
  nodeStates: {},
  
  onNodesChange: (changes: NodeChange[]) => set({
    nodes: applyNodeChanges(changes, get().nodes),
  }),
  
  onEdgesChange: (changes: EdgeChange[]) => set({
    edges: applyEdgeChanges(changes, get().edges),
  }),
  
  onConnect: (connection: Connection) => set({
    edges: addEdge({ 
      ...connection, 
      animated: true, 
      type: "smoothstep",
      style: { stroke: "#A855F7", strokeWidth: 2 }
    }, get().edges),
  }),
  
  addNode: (node) => {
    set({ 
      nodes: [...get().nodes, node],
      nodeStates: { ...get().nodeStates, [node.id]: { isRunning: false } }
    });
  },
  
  updateNodeData: (id, data) => set({
    nodes: get().nodes.map((node: Node<NodeData>) => {
      if (node.id === id) {
        node.data = { ...node.data, ...data } as NodeData;
      }
      return node;
    }),
  }),
  
  setNodeRunning: (id, running) => set({ 
    nodeStates: { 
      ...get().nodeStates, 
      [id]: { ...get().nodeStates[id] || { isRunning: false }, isRunning: running } 
    } 
  }),
  
  setNodeOutput: (id, output) => set({ 
    nodeStates: { 
      ...get().nodeStates, 
      [id]: { isRunning: false, output } 
    },
    nodes: get().nodes.map((node: Node<NodeData>) => {
      if (node.id === id) {
        node.data!.output = output;
      }
      return node;
    })
  }),
  
  loadWorkflows: async () => {
    try {
      const res = await fetch('/api/workflows');
      if (res.ok) {
        const workflows: Workflow[] = await res.json();
        set({ workflows });
      }
    } catch (error) {
      console.error('Failed to load workflows:', error);
    }
  },
  
  saveWorkflow: async (name: string) => {
    const { nodes, edges, loadWorkflows } = get();
    try {
      const res = await fetch('/api/workflows', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, nodes, edges }),
      });
      if (res.ok) {
        await loadWorkflows();
        console.log('Workflow saved!');
      } else {
        console.error('Save failed');
      }
    } catch (error) {
      console.error('Save error:', error);
    }
  },
  
  loadWorkflow: (id: string) => {
    const workflow = get().workflows.find(w => w.id === id);
    if (workflow) {
      set({ 
        nodes: workflow.nodes, 
        edges: workflow.edges, 
        currentWorkflowId: id 
      });
      console.log(`Loaded workflow: ${workflow.name}`);
    }
  },
  
  exportWorkflow: () => {
    const { nodes, edges, currentWorkflowId, workflows } = get();
    const name = workflows.find(w => w.id === currentWorkflowId)?.name || 'Untitled';
    return JSON.stringify({ name, nodes, edges }, null, 2);
  },
  
  runNode: async (nodeId: string) => {
    const node = get().nodes.find(n => n.id === nodeId);
    if (!node) return;
    
    get().setNodeRunning(nodeId, true);
    
    try {
      const res = await fetch(`/api/run-node/${nodeId}`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          nodeType: node!.type,
          data: node.data,
          inputs: get().getNodeInputs(nodeId)
        }),
      });
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const result = await res.json();
      get().setNodeOutput(nodeId, result.output);
      console.log(`Node ${node.data.label || node.type} completed`);
      
      // Propagate
      const connected = get().getConnectedNodes(nodeId);
      connected.forEach((nextId, index) => {
        setTimeout(() => get().runNode(nextId), (index + 1) * 800);
      });
    } catch (error) {
      get().setNodeRunning(nodeId, false);
      console.error('Run failed:', error);
    }
  },
  
  getNodeInputs: (nodeId: string) => {
    const { nodes, edges } = get();
    const incoming = edges.filter((e: Edge) => e.target === nodeId);
    return incoming.map((e: Edge) => {
      const srcNode = nodes.find((n: Node<NodeData>) => n.id === e.source);
      return srcNode?.data.output;
    }).filter(Boolean);
  },
  
  getConnectedNodes: (nodeId: string) => {
    const { edges } = get();
    return [...new Set(edges.filter((e: Edge) => e.source === nodeId).map((e: Edge) => e.target))];
  },
}));
