import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt } = body;

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing API Key in .env.local" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(prompt || "Tell me a joke.");
    
    if (!result || !result.response) {
      return NextResponse.json({ error: "Google returned an empty response." }, { status: 500 });
    }

    const text = result.response.text();
    return NextResponse.json({ text: text });

  } catch (error: any) {
    console.error("=== GEMINI API CRASH ===");
    console.error(error);
    console.error("========================");
    
    return NextResponse.json({ 
      error: error.message || "Unknown Gemini API Error. Check VS Code terminal." 
    }, { status: 500 });
  }
}