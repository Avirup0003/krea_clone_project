import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { TriggerClient } from '@trigger.dev/sdk';
import { auth } from '@clerk/nextjs/server';
import { client } from '@/trigger/llmTask';

const typedClient = client as TriggerClient;

const runNodeSchema = z.object({
  nodeType: z.enum(['textNode', 'llmNode', 'imageNode', 'videoNode', 'cropNode', 'extractNode']),
  data: z.object({}).passthrough(),
  inputs: z.array(z.any()).optional(),
});


export async function POST(req: NextRequest, context: { params: Promise<{ nodeType: string }> }) {
  try {
   
    const params = await context.params;
    const { nodeType } = params;

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = runNodeSchema.parse(await req.json());

    // Passthrough for text
    if (body.nodeType === 'textNode') {
      return NextResponse.json({ output: { text: body.data.text } });
    }

    // Dispatch to specific Trigger event
    const eventName = `run.${body.nodeType.replace('Node', '')}`;
    const result = await typedClient.sendEvent({
      name: eventName,
      payload: {
        nodeType: body.nodeType,
        data: body.data,
        inputs: body.inputs || [],
        userId
      }
    });

    return NextResponse.json({ 
      success: true,
      taskId: result.id,
      status: 'queued',
      output: 'Processing...'
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}