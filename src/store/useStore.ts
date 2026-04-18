import { create } from "zustand";
import type { 
  Node, Edge, OnNodesChange, OnEdgesChange, OnConnect, 
  NodeChange, EdgeChange, Connection 
} from "reactflow";
import { 
  applyNodeChanges, applyEdgeChanges, addEdge 
} from "reactflow";

type NodeData = {
  label?: string;
  text?: string;
  imageUrl?: string;
  videoUrl?: string;
  prompt?: string;
  model?: string;
  
  result?: string | null;
  error?: string | null; 
  
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  timestamp?: string;
  output?: any;
  isRunning?: boolean;
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
  clearCanvas: () => void;
  importWorkflow: (jsonString: string) => void;
  
  runNode: (nodeId: string) => Promise<void>;
  
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
      style: { stroke: "#7c3aed", strokeWidth: 2 }
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
    },
    nodes: get().nodes.map((node: Node<NodeData>) => {
      if (node.id === id) {
        node.data = { ...node.data, isRunning: running } as NodeData;
      }
      return node;
    })
  }),
  
  setNodeOutput: (id, output) => set({ 
    nodeStates: { 
      ...get().nodeStates, 
      [id]: { isRunning: false, output } 
    },
    nodes: get().nodes.map((node: Node<NodeData>) => {
      if (node.id === id) {
        node.data = { ...node.data, output, result: output, isRunning: false } as NodeData;
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
      console.error(error);
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
      }
    } catch (error) {
      console.error(error);
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
    }
  },
  
  exportWorkflow: () => {
    const { nodes, edges, currentWorkflowId, workflows } = get();
    const name = workflows.find(w => w.id === currentWorkflowId)?.name || 'Untitled';
    return JSON.stringify({ name, nodes, edges }, null, 2);
  },

  clearCanvas: () => {
    set({ nodes: [], edges: [], currentWorkflowId: undefined });
  },
  
  importWorkflow: (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.nodes && data.edges) {
        set({ nodes: data.nodes, edges: data.edges, currentWorkflowId: undefined });
      }
    } catch (error) {
      console.error("Failed to parse workflow JSON", error);
    }
  },
  
  runNode: async (nodeId: string) => {
    const node = get().nodes.find(n => n.id === nodeId);
    if (!node) return;
    
    get().setNodeRunning(nodeId, true);
    
    try {
      const res = await fetch(`/api/run-workflow`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: node.data.prompt || node.data.text || "Hello",
          nodeType: node.type,
          data: node.data,
          inputs: get().getNodeInputs(nodeId)
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        get().setNodeOutput(nodeId, `Error: ${errorData.error || res.statusText}`);
        return;
      }
      
      const result = await res.json();
      const outputText = result.text || result.output || "Execution completed";
      
      get().setNodeOutput(nodeId, outputText);
      
      const connected = get().getConnectedNodes(nodeId);
      connected.forEach((nextId, index) => {
        setTimeout(() => get().runNode(nextId), (index + 1) * 800);
      });
    } catch (error: any) {
      get().setNodeOutput(nodeId, `Error: ${error.message}`);
    }
  },
  
  getNodeInputs: (nodeId: string) => {
    const { nodes, edges } = get();
    const incoming = edges.filter((e: Edge) => e.target === nodeId);
    
    return incoming.map((e: Edge) => {
      const srcNode = nodes.find((n: Node<NodeData>) => n.id === e.source);
      
      if (!srcNode) return null;

      return srcNode.data.output || 
             srcNode.data.imageUrl || 
             srcNode.data.videoUrl || 
             srcNode.data.result || 
             srcNode.data.text;
             
    }).filter(Boolean);
  },
  
  getConnectedNodes: (nodeId: string) => {
    const { edges } = get();
    return [...new Set(edges.filter((e: Edge) => e.source === nodeId).map((e: Edge) => e.target))];
  },
}));