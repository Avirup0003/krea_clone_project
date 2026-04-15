// Path: src/components/Header.tsx
"use client";
import { UserButton } from "@clerk/nextjs";
import { Workflow, Save } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useState } from "react";

export default function Header() {
  const { nodes, edges } = useStore();
  const [isSaving, setIsSaving] = useState(false);

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
      console.error("Failed to save", error);
      alert("Failed to save workflow.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <header className="h-14 border-b border-border bg-background flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <Workflow className="h-5 w-5 text-primary" />
        <span className="font-semibold text-lg">NextFlow Editor</span>
      </div>
      <div className="flex items-center gap-4">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 border border-border text-foreground px-3 py-1.5 rounded-md text-sm transition-colors disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save Workflow"}
        </button>
        <UserButton />
      </div>
    </header>
  );
}