import Header from "@/components/Header";
import LeftSidebar from "@/components/LeftSidebar";
import WorkflowCanvas from "@/components/WorkflowCanvas";
import RightSidebar from "@/components/RightSidebar";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  return (
    <div className="flex flex-col h-screen w-full bg-[#000000] overflow-hidden text-foreground">
      <Header />
      <div className="flex flex-1 overflow-hidden relative">
        <LeftSidebar />
        <WorkflowCanvas />
        <RightSidebar />
      </div>
    </div>
  );
}