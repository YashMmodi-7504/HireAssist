// Netlify Function: AI tutor proxy.
//
// Why this exists: keeps GROQ_API_KEY server-side. The frontend POSTs
// { message: "<user text>" } here and gets back { reply: "<ai text>" }.
//
// Server logs (visible in Netlify Functions log stream) are prefixed
// "[chat-fn]" for easy filtering during incident triage.

const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.1-8b-instant";

const SYSTEM_PROMPT = `You are an AI Tutor for the HireAssist learning platform.

Your job is to answer student questions ONLY based on the official course syllabus provided below.

==============================
COURSE SYLLABUS
===============

🔵 ADVANCE COURSE (5 Modules)

Module 1: Artificial Intelligence & Machine Learning
- Supervised Learning
- Unsupervised Learning
- Reinforcement Learning
- Model training & evaluation

Module 2: Deep Learning
- Neural Networks
- CNN, RNN
- PyTorch & TensorFlow basics

Module 3: AI on Edge Devices
- Raspberry Pi
- Jetson Nano
- Model optimization & deployment

Module 4: SAP Technologies
- SAP S/4HANA
- ABAP basics
- AI integration with SAP

Module 5: Employability Skills
- Resume building
- Interview preparation
- Communication skills

==============================

🟢 FOUNDATION COURSE (4 Modules)

Module 1: Programming Fundamentals
- Python basics
- JavaScript basics
- OOP concepts

Module 2: Data Structures & Algorithms
- Arrays, Linked Lists
- Trees, Graphs
- Time complexity

Module 3: Web Development
- HTML, CSS
- JavaScript basics

Module 4: Version Control
- Git, GitHub
- Collaboration workflows

==============================

⚠️ STRICT RULES:

1. Answer ONLY from the above syllabus.
2. Do NOT give unrelated or general AI knowledge.
3. If question is outside syllabus → reply exactly:
   "This topic is not covered in your course syllabus."
4. Always structure answers using this Markdown layout:
   - A short title heading (## Title)
   - A simple explanation paragraph
   - "## Key Concepts" heading followed by a bulleted list
   - "## Example" heading with a concrete example when applicable
5. Highlight important keywords using **bold formatting**.
6. Keep answers simple, clean, student-friendly, and not too long.
7. If the user says "Explain simply" → respond like a beginner; if they say "Explain in detail" → respond like an advanced learner.

==============================

🎯 GOAL:
Behave like a premium edtech AI tutor — clear, structured, engaging, and helpful for learning. Never act like a generic chatbot.`;

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

  if (!process.env.GROQ_API_KEY) {
    logError("GROQ_API_KEY is not set on the server.");
    return json(500, { error: "Server is missing GROQ_API_KEY" });
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return json(400, { error: "Invalid JSON body" });
  }

  const message = body?.message;
  if (typeof message !== "string" || message.trim().length === 0) {
    return json(400, { error: "Missing or invalid 'message'" });
  }

  log(`forwarding ${message.length} chars to Groq (${MODEL})`);

  let upstream;
  try {
    upstream = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.7,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: message },
        ],
      }),
    });
  } catch (err) {
    logError("network error reaching Groq:", err?.message || err);
    return json(502, { error: "Upstream network error" });
  }

  const rawText = await upstream.text();

  if (!upstream.ok) {
    logError(`Groq responded ${upstream.status}:`, rawText.slice(0, 300));
    return json(502, { error: `Upstream Groq error (${upstream.status})` });
  }

  let data;
  try {
    data = JSON.parse(rawText);
  } catch {
    logError("Groq returned non-JSON:", rawText.slice(0, 200));
    return json(502, { error: "Upstream returned non-JSON" });
  }

  const reply = data?.choices?.[0]?.message?.content?.trim();
  if (!reply) {
    logError("Groq returned empty content:", JSON.stringify(data).slice(0, 200));
    return json(502, { error: "Empty response from Groq" });
  }

  log(`reply ${reply.length} chars, returning 200`);
  return json(200, { reply });
}
