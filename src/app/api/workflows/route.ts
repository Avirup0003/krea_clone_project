// Path: src/app/api/workflows/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });


    const body = await req.json();
    const { name, nodes, edges } = body;

    const workflow = await prisma.workflow.create({
      data: {
        name: name || "Untitled Workflow",
        nodes: nodes,
        edges: edges,
        userId: userId,
      },
    });

    return NextResponse.json(workflow);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });


    const workflows = await prisma.workflow.findMany({
      where: { userId: userId },
      orderBy: { id: 'desc' }
    });


    return NextResponse.json(workflows);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}