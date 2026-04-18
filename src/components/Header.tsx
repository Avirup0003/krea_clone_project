"use client";
import { UserButton } from "@clerk/nextjs";
import { Workflow, Save, Download, Trash2, Upload } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useState, useRef } from "react";

export default function Header() {
  const { nodes, edges, exportWorkflow, clearCanvas, importWorkflow } = useStore();
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const response = await fetch("/api/workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "My NextFlow Project",
          nodes,
          edges,
        }),
      });
      
      if (response.ok) {
        alert("Workflow saved successfully!");
      }
    } catch (error) {
      alert("Failed to save workflow.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    const jsonString = exportWorkflow();
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nextflow-export.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        importWorkflow(content);
      };
      reader.readAsText(file);
    }
    // Reset input so the same file can be uploaded again if needed
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <header className="h-14 border-b border-border bg-[#000000] flex items-center justify-between px-6 z-50 relative">
      <div className="flex items-center gap-3">
        <div className="bg-[#2563eb] p-1.5 rounded-lg">
            <Workflow className="h-4 w-4 text-white" />
        </div>
        <span className="font-semibold text-[15px] text-white">Node Editor</span>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Hidden file input for importing JSON */}
        <input 
          type="file" 
          accept=".json" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
        />

        <div className="flex items-center bg-[#1a1a1a] rounded-lg p-1 border border-[#27272a]">
          <button 
            onClick={handleImportClick}
            title="Import JSON"
            className="p-1.5 text-[#a1a1aa] hover:text-white hover:bg-[#2a2a2a] rounded-md transition-colors"
          >
            <Upload className="h-4 w-4" />
          </button>
          <button 
            onClick={handleExport}
            title="Export JSON"
            className="p-1.5 text-[#a1a1aa] hover:text-white hover:bg-[#2a2a2a] rounded-md transition-colors"
          >
            <Download className="h-4 w-4" />
          </button>
          <div className="w-[1px] h-4 bg-[#27272a] mx-1"></div>
          <button 
            onClick={clearCanvas}
            title="Clear Canvas"
            className="p-1.5 text-[#a1a1aa] hover:text-[#ef4444] hover:bg-[#2a2a2a] rounded-md transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#27272a] text-[#e5e5e5] px-4 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ml-2"
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save"}
        </button>
        
        <div className="ml-2">
          <UserButton appearance={{ elements: { userButtonAvatarBox: "h-8 w-8" } }} />
        </div>
      </div>
    </header>
  );
}