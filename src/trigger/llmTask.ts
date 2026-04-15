import { TriggerClient, eventTrigger } from "@trigger.dev/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const client = new TriggerClient({ id: "nextflow-backend" });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

client.defineJob({
  id: "gemini-llm-task",
  name: "Execute Gemini Prompt",
  version: "1.0.0",
  trigger: eventTrigger({
    name: "run.llm",
  }),
  run: async (payload: any, io, ctx) => {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(payload.prompt);
    const response = await result.response;
    return { text: response.text() };
  },
});