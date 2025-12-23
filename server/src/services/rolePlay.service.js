import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { callGeminiRolePlay, callGeminiAnalyzeText } from './gemini.service.js';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storagePath = path.join(__dirname, "..", "rolePlaySessions.json");

// --- Save & Load Sessions ---
function saveSession(session) {
  let sessions = [];
  if (fs.existsSync(storagePath)) {
    sessions = JSON.parse(fs.readFileSync(storagePath, "utf8"));
  }
  const index = sessions.findIndex(s => s.id === session.id);
  if (index > -1) sessions[index] = session;
  else sessions.push(session);
  fs.writeFileSync(storagePath, JSON.stringify(sessions, null, 2));
}

function loadSession(sessionId) {
  if (!fs.existsSync(storagePath)) return null;
  const sessions = JSON.parse(fs.readFileSync(storagePath, "utf8"));
  return sessions.find(s => s.id === sessionId) || null;
}

// --- Start Role Play ---
export async function startRolePlaySession(text) {
  const promptPath = path.join(__dirname, "..", "prompts", "rolePlayPrompt.txt");
  const promptTemplate = fs.readFileSync(promptPath, "utf8");

  const aiResponse = await callGeminiAnalyzeText(promptTemplate, text);

  const openingPrompt = `
You are role A in an educational story-based role play game.
Create a single opening message to start the conversation with role B.
Rules:
1. Address role B directly using their name: ${aiResponse.roles.B}.
2. Introduce the story naturally and set the tone for role play.
3. Write in the same language as the story.
4. Do not include "Role A" or "Role B" in the message.
5. Keep it concise, engaging, and relevant to the story.

Story:
<<<
${text}
>>>
`;

  const openingText = await callGeminiRolePlay(openingPrompt);

  const openingMessage = {
    role: "A",
    text: openingText
  };

  const session = {
    id: uuidv4(),
    roles: aiResponse.roles, // { A: "Alice", B: "Bob" }
    messages: [openingMessage], // מתחילים כבר עם הודעה דינמית
    storyText: text
  };

  saveSession(session);
  return session;
}

export async function sendRolePlayReply(sessionId, userMessage) {
  const session = loadSession(sessionId);
  if (!session) throw new Error("Session not found");

  // ודא שיש סיפור שמור בסשן
  if (!session.storyText) throw new Error("Story text not found in session");

  // כל השיחה הקודמת
  const conversationSoFar = session.messages.map(m => `${m.role}: ${m.text}`).join("\n");

  // Prompt חזק לכל סבב
  const prompt = `
You are role A in an educational story-based role play game.
Rules you MUST follow:
1. Always respond strictly as role A.
2. You are speaking directly to role B (the user).
3. Speak only about the story provided.
4. Always respond in the original language of the story (do not switch languages).
5. Never discuss unrelated topics.
6. Always address the last message from role B naturally.
7. If the user writes in a language other than the story's, respond: "I'm sorry, I do not understand this language."
8. If the user says something unrelated, ignore it and respond based on the story.

The story:
<<<
${session.storyText}
>>>

Conversation so far:
${conversationSoFar}
User (role B) says: ${userMessage}

Respond as role A only, relevant to the story, and addressing the role B's message naturally.
`;

  const aiReplyText = await callGeminiRolePlay(prompt);

  // שמירה של ההודעות בסשן
  session.messages.push({ role: "B", text: userMessage });
  session.messages.push({ role: "A", text: aiReplyText });
  saveSession(session);

  return { role: "A", text: aiReplyText };
}


// --- Give Feedback on User Understanding ---
export async function giveUserFeedback(sessionId) {
  const session = loadSession(sessionId);
  if (!session) throw new Error("Session not found");

  const conversationText = session.messages.map(m => `${m.role}: ${m.text}`).join("\n");

  const feedbackPrompt = `
You are an educational AI. Analyze the conversation between two roles, A and B. 
Role A is the AI; Role B is the user. 

Generate feedback for the user (Role B) **in the same language as the conversation**. 
In the feedback:
- Never include "Role A" or "Role B".
- Replace all mentions of Role A with "I".
- Replace all mentions of Role B with "You".
- Return a JSON object with the following structure:
{
  "understanding": "<language-appropriate value In one word: 'Good', 'Average', 'Poor', 'High', 'Low' or their equivalents>",
  "comments": "A few sentences giving clear feedback about how well the user understood the story. Use 'I' for Role A and 'You' for Role B throughout."
}

Conversation:
${conversationText}
`;


  const feedbackRaw = await callGeminiRolePlay(feedbackPrompt);
  const feedbackCleaned = feedbackRaw.replace(/```json/gi, '').replace(/```/g, '').trim();

  return JSON.parse(feedbackCleaned);
}
