// AI client.
//
// Routing rules (production-safe):
//   - Production build (`import.meta.env.PROD === true`)
//       → ALWAYS POST /.netlify/functions/chat. Key stays server-side.
//   - Dev (`vite`) WITH VITE_GROQ_API_KEY in client/.env.local
//       → call Groq directly. Convenience for `npm run dev` without netlify dev.
//   - Dev without a key
//       → falls through to the function endpoint and reports a clear error.
//
// `import.meta.env.PROD` is hardcoded into the build, so production literally
// cannot reach the direct path even if a VITE_* var is misconfigured.

const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const FUNCTION_PATH = "/.netlify/functions/chat";
const MODEL = "llama-3.1-8b-instant";

// Mirrors the server-side prompt in netlify/functions/chat.js so the
// dev-direct path and the production function-proxy path behave identically.
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

const FALLBACK_REPLY =
  "AI service temporarily unavailable. Please try again.";

const isProd = import.meta.env.PROD === true;
const devKey = import.meta.env.VITE_GROQ_API_KEY || "";
const useDirect = !isProd && devKey.length > 0;

const callGroqDirect = async (message) => {
  const res = await fetch(GROQ_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${devKey}`,
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

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Groq direct ${res.status}: ${text.slice(0, 200)}`);
  }
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Groq returned non-JSON response");
  }
  const reply = data?.choices?.[0]?.message?.content?.trim();
  if (!reply) throw new Error("Groq returned an empty response");
  return reply;
};

const callNetlifyFunction = async (message) => {
  const res = await fetch(FUNCTION_PATH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  // Vite dev server (without `netlify dev`) responds to unknown paths with
  // index.html → text/html. Detect this so the user gets a clear log
  // instead of a confusing JSON.parse failure.
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    const sample = await res.text().catch(() => "");
    throw new Error(
      `Function endpoint not available (got "${contentType || "no content-type"}" from ${FUNCTION_PATH}). ` +
        `Run from the repo root with \`netlify dev\`, or deploy to Netlify with GROQ_API_KEY set. ` +
        `First bytes: ${sample.slice(0, 80)}`
    );
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || `Function returned ${res.status}`);
  }
  if (!data.reply) throw new Error("Empty reply from function");
  return data.reply;
};

/**
 * Send a single user message, get an AI tutor reply.
 * Returns the reply string on success, or a friendly fallback string on
 * any failure — never throws, so callers don't need their own try/catch.
 *
 * @param {string} message
 * @returns {Promise<string>}
 */
export async function sendMessage(message) {
  const route = useDirect ? "direct-dev" : "netlify-function";
  console.info(`[ai] sendMessage → ${route} (${MODEL})`);

  try {
    const reply = useDirect
      ? await callGroqDirect(message)
      : await callNetlifyFunction(message);
    console.info(`[ai] reply received (${reply.length} chars)`);
    return reply;
  } catch (err) {
    console.error("[ai] failed:", err?.message || err);
    return FALLBACK_REPLY;
  }
}

// UI uses this to detect a fallback reply and style it as an error
// without inspecting magic strings inline.
export const isFallbackReply = (text) => text === FALLBACK_REPLY;
