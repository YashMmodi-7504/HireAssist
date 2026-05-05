const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.1-8b-instant";

const SYSTEM_PROMPT = `
You are HireAssist AI – a professional AI Learning Mentor.

You guide students based on:
- currentCourse
- progress
- weakTopics
- learning behavior

STRICT RULES:
- Do NOT use markdown symbols
- Do NOT return long paragraphs
- Always return JSON only

RESPONSE FORMAT:
{
  "title": "Short topic title",
  "explanation": "Clear structured explanation",
  "example": "Simple example",
  "realWorld": "Real world use case",
  "practiceQuestions": ["Q1", "Q2", "Q3"]
}

TONE:
- Professional
- Clear
- Encouraging
`;

function json(statusCode, body) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

const log = (...args) => console.log("[chat-fn]", ...args);
const logError = (...args) => console.error("[chat-fn]", ...args);

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method Not Allowed" });
  }

  const apiKey = process.env.HIREASSIST_GROQ_KEY;

  if (!apiKey) {
    logError("Missing API key");
    return json(500, { error: "Missing API key" });
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return json(400, { error: "Invalid JSON body" });
  }

  const { message, context } = body;

  if (!message || typeof message !== "string") {
    return json(400, { error: "Invalid message" });
  }

  // Inject context into prompt
  const contextualPrompt = `
USER MESSAGE:
${message}

STUDENT CONTEXT:
${JSON.stringify(context || {}, null, 2)}

Generate a structured mentor response.
`;

  log("Sending request to Groq...");

  let upstream;
  try {
    upstream = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.4,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: contextualPrompt },
        ],
      }),
    });
  } catch (err) {
    logError("Network error:", err);
    return json(502, { error: "Failed to reach AI service" });
  }

  const rawText = await upstream.text();

  if (!upstream.ok) {
    logError("Groq Error:", rawText);
    return json(502, { error: "AI service error" });
  }

  let data;
  try {
    data = JSON.parse(rawText);
  } catch {
    logError("Invalid JSON from Groq:", rawText);
    return json(502, { error: "Invalid AI response" });
  }

  let aiContent = data?.choices?.[0]?.message?.content?.trim();

  if (!aiContent) {
    return json(502, { error: "Empty AI response" });
  }

  // Try parsing structured JSON from AI
  let parsed;
  try {
    parsed = JSON.parse(aiContent);
  } catch (e) {
    logError("AI returned non-JSON:", aiContent);

    // fallback (prevents crash)
    parsed = {
      title: "Response",
      explanation: aiContent,
      example: "",
      realWorld: "",
      practiceQuestions: [],
    };
  }

  log("Response ready");

  return json(200, parsed);
}