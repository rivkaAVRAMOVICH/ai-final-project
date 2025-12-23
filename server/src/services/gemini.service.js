import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

/**
 * Analyze text + generate questions in SAME language
 */
export async function callGeminiAnalyzeText(prompt, text) {
  try {
    const response = await ai.models.generateContent({
      model: "models/gemini-2.5-flash",
      contents: [
        { text: prompt },
        { text: "Study text:\n" + text }
      ]
    });

    const raw = response.text;

    const cleaned = raw
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    return JSON.parse(cleaned); // ← מחזיר אובייקט
  } catch (err) {
    console.error("Gemini error:", err);
    throw new Error("Failed to analyze text with Gemini");
  }
}

export async function callGeminiRolePlay(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: "models/gemini-2.5-flash",
      contents: [{ text: prompt }]
    });

    return response.text;
  } catch (err) {
    console.error("Gemini role play error:", err);
    throw new Error("Failed to generate role play response");
  }
}

