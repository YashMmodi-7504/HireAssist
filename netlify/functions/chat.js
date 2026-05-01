const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.1-8b-instant";

const SYSTEM_PROMPT = `
You are an elite AI tutor for HireAssist.

You teach Foundation + Advance courses:
- Programming, DSA, Web Dev, Git
- AI/ML, Deep Learning, Edge AI, SAP, Employability Skills

Response format:
1. Title
2. Simple explanation
3. Key Concepts (bullets)
4. Example
5. Real-world use

Highlight important terms using **bold**.
Keep answers clean, structured, and engaging.
`;

const json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

const log = (...args) => console.log("[chat-fn]", ...args);
const logError = (...args) => console.error("[chat-fn]", ...args);

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method Not Allowed" });
  }

  const apiKey = process.env.HIREASSIST_GROQ_KEY;

  log("ENV CHECK:", apiKey ? "FOUND" : "MISSING");

  if (!apiKey) {
    return json(500, { error: "Missing HIREASSIST_GROQ_KEY" });
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return json(400, { error: "Invalid JSON body" });
  }

  const message = body?.message;
  if (!message || typeof message !== "string") {
    return json(400, { error: "Invalid message" });
  }

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
        temperature: 0.5,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: message }
        ],
      }),
    });
  } catch (err) {
    logError("Network error:", err.message);
    return json(502, { error: "Network error to Groq" });
  }

  const text = await upstream.text();

  if (!upstream.ok) {
    logError("Groq error:", text);
    return json(502, { error: "Groq API error" });
  }

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return json(502, { error: "Invalid JSON from Groq" });
  }

  const reply = data?.choices?.[0]?.message?.content;

  if (!reply) {
    return json(502, { error: "Empty response" });
  }

  return json(200, { reply });
}
