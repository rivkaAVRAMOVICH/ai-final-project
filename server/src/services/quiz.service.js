import fs from "fs";
import path from "path";
import { callGeminiAnalyzeText } from "./gemini.service.js";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const promptPath = path.join(__dirname, "..", "prompts", "analyzeTextAndGenerateQuiz.txt");

const basePrompt = fs.readFileSync(promptPath, "utf8");

export async function generateQuiz(text) {

  const aiResponse = await callGeminiAnalyzeText(basePrompt, text);

  try {
    return aiResponse;
  } catch (err) {
    throw new Error("Gemini returned invalid JSON");
  }
}


// פונקציה ל־Multiple Choice
export async function generateMultipleChoiceQuiz(text) {
  const promptPath = path.join(__dirname, "..", "prompts", "multipleChoicePrompt.txt");
  const prompt = fs.readFileSync(promptPath, "utf8");
  const aiResponse = await callGeminiAnalyzeText(prompt, text);
  return aiResponse;
}

// פונקציה ל־True/False
export async function generateTrueFalseQuiz(text) {
  const promptPath = path.join(__dirname, "..", "prompts", "trueFalsePrompt.txt");
  const prompt = fs.readFileSync(promptPath, "utf8");
  const aiResponse = await callGeminiAnalyzeText(prompt, text);
  return aiResponse;
}
