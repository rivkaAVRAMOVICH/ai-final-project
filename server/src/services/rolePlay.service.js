import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { callGeminiRolePlay, callGeminiAnalyzeText } from './gemini.service.js';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storagePath = path.join(__dirname, "..", "rolePlaySessions.json");

function saveSession(session) {
  let sessions = [];
  if (fs.existsSync(storagePath)) {
    sessions = JSON.parse(fs.readFileSync(storagePath, "utf8"));
  }
  const index = sessions.findIndex(s => s.id === session.id);
  if (index > -1) {
    sessions[index] = session;
  } else {
    sessions.push(session);
  }
  fs.writeFileSync(storagePath, JSON.stringify(sessions, null, 2));
}

function loadSession(sessionId) {
  if (!fs.existsSync(storagePath)) return null;
  const sessions = JSON.parse(fs.readFileSync(storagePath, "utf8"));
  return sessions.find(s => s.id === sessionId) || null;
}

// התחלת משחק תפקידים חדש
export async function startRolePlaySession(text) {
  const promptPath = path.join(__dirname, "..", "prompts", "rolePlayPrompt.txt");
  const promptTemplate = fs.readFileSync(promptPath, "utf8");

  // קבלת שני התפקידים מ-Gemini
  const aiResponse = await callGeminiAnalyzeText(promptTemplate, text);

  const session = {
    id: uuidv4(),
    roles: aiResponse.roles, // { A: "אליס", B: "בוב" }
    messages: []
  };

  saveSession(session);
  return session;
}

// שליחת הודעה במשחק תפקידים
export async function sendRolePlayReply(sessionId, userMessage) {
  const session = loadSession(sessionId);
  if (!session) throw new Error("Session not found");

  const lastMessage = session.messages.map(m => `${m.role}: ${m.text}`).join("\n");

  const prompt = `Role play conversation so far:
${lastMessage}
User (role B) says: ${userMessage}
Respond as role A only.`;

  const aiReplyText = await callGeminiRolePlay(prompt);

  // שמירה של ההודעה
  session.messages.push({ role: "B", text: userMessage });
  session.messages.push({ role: "A", text: aiReplyText });
  saveSession(session);

  return { role: "A", text: aiReplyText };
}
