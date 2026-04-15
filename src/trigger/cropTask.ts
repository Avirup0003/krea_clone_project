import { TriggerClient, eventTrigger } from "@trigger.dev/sdk";
import { client } from "./llmTask"; // Reuse client

client.defineJob({
  id: "image-crop-task",
  name: "FFmpeg Image Crop",
  version: "1.0.0",
  trigger: eventTrigger({
    name: "run.crop",
  }),
  run: async (payload: { inputUrl: string; x: number; y: number; width: number; height: number }, io, ctx) => {
    // FFmpeg via Trigger cloud or Docker
    const command = [
      '-i', payload.inputUrl,
      '-vf', `crop=${payload.width}:${payload.height}:${payload.x}:${payload.y}`,
      '-q:v', '2',
      '/tmp/cropped.jpg'
    ];

    const result = await io.runTask('ffmpeg-crop', async () => {
      // Simulate FFmpeg - in production use @trigger.dev/docker or external service
      return {
        croppedUrl: payload.inputUrl.replace(/(\.[^.]*)$/, '-cropped$1'), // Mock URL
        params: payload
      };
    });

    return result;
  },
});
