import Header from "@/components/Header";
import LeftSidebar from "@/components/LeftSidebar";
import WorkflowCanvas from "@/components/WorkflowCanvas";
import HistorySidebar from "@/components/HistorySidebar";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  // This protects your home page. If a user isn't logged in, they are sent to the sign-in page.
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  return (
    <div className="flex flex-col h-screen w-full bg-background overflow-hidden text-foreground">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar for dragging nodes */}
        <LeftSidebar />
        
        {/* The main interactive React Flow canvas */}
        <WorkflowCanvas />
        
        {/* Right Sidebar for viewing run history */}
        <HistorySidebar />
      </div>
    </div>
  );
}