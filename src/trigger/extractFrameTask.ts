import { TriggerClient, eventTrigger } from "@trigger.dev/sdk";
import { client } from "./llmTask";

client.defineJob({
  id: "video-frame-task",
  name: "FFmpeg Extract Frame",
  version: "1.0.0",
  trigger: eventTrigger({
    name: "run.extract-frame",
  }),
  run: async (payload: { inputUrl: string; timestamp: string }, io, ctx) => {
    const timeExpr = payload.timestamp.includes('%') ? `select='eq(n\\,${Math.round(parseFloat(payload.timestamp) * 100)})'` : payload.timestamp;
    
    const command = [
      '-i', payload.inputUrl,
      '-ss', timeExpr || '50%',
      '-frames:v', '1',
      '-q:v', '2',
      '/tmp/frame.jpg'
    ];

    const result = await io.runTask('ffmpeg-frame', async () => {
      return {
        frameUrl: payload.inputUrl.replace(/(\.[^.]*)$/, '-frame$1'), // Mock
        timestamp: payload.timestamp
      };
    });

    return result;
  },
});
