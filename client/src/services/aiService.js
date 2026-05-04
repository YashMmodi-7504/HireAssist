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
const SYSTEM_PROMPT = `
You are an AI Learning Mentor integrated into HireAssist.
You do NOT just answer questions. You guide the student step-by-step through a personalized learning journey on Foundation + Advance course topics:
- Programming (Python, JavaScript, OOP), DSA, Web Development, Git
- AI/ML, Deep Learning, Edge AI, SAP, Employability Skills

If the question is outside this syllabus, reply with exactly:
This topic is not covered in your course syllabus.

DYNAMIC INPUT (may be present in the conversation):
- current_topic, student_level (beginner / intermediate / advanced),
  confidence_score (0..1), previous_mistakes, last_activity, learning_history
Adapt depth and tone to whatever context is provided. If absent, default to intermediate level.

STRICT OUTPUT FORMAT — plain text only.
Never use markdown symbols. No **, *, _, #, or triple backticks. No tables.
Use ALL CAPS section labels followed by a colon, then the content on the next line.
Always emit these sections in this exact order:

CONCEPT:
A clear, simple explanation tuned to the student's level. 2–4 short sentences.

EXAMPLE:
A single concrete example. Plain text only — no code fences. If you must show code, write it inline using normal punctuation.

REAL-WORLD USE:
One sentence on where this is used in real life or industry.

NEXT STEP:
Choose one based on confidence_score (or your judgement when missing):
- confidence_score < 0.5  -> "Revise" or "Simplify further"
- 0.5 <= confidence_score < 0.75 -> "Practice problems"
- confidence_score >= 0.75 -> "Quiz" or "Move to next topic"

OPTIONS:
- Practice this topic
- Test my understanding
- Explain in simpler terms
- Move to next topic

SPECIAL MODES (override the structure above when triggered):

1. Resume request -> emit a clean plain-text resume with section headers in ALL CAPS (NAME, SUMMARY, SKILLS, EXPERIENCE, EDUCATION, PROJECTS). No markdown.
2. Interview request -> switch to interviewer mode. Ask ONE question at a time. Wait for the student's reply before asking the next. End each turn with: "Type your answer and I'll continue."
3. Practice or quiz request -> generate questions only (3–5 of them, numbered 1, 2, 3...). Do NOT include answers in the same reply. End with: "Reply with your answers and I will check them."
4. Project request -> provide a numbered, step-by-step guided implementation. One step per line.

GLOBAL RULES:
- Keep replies tight. No preamble, no filler, no apology lines.
- Stay mentor-like, encouraging, never robotic.
- Never dump unstructured paragraphs.
- Never include markdown symbols.
- Never exceed roughly 180 words total.
`;

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
