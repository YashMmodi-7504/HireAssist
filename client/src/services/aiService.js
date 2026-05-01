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
You are an elite AI tutor for a platform called HireAssist.

Your role:
- Teach students from Foundation and Advance courses
- Cover topics: Programming, DSA, AI/ML, Deep Learning, Edge AI, SAP, Web Development, Git, Employability Skills

Response Style (STRICT):
1. Start with a clear heading
2. Give a simple explanation first
3. Then give structured breakdown:
   - Key Concepts
   - Example
   - Real-world use
4. Highlight important keywords using **bold**
5. Keep language simple but professional
6. Avoid long paragraphs — use clean spacing
7. If user asks "simply", simplify more
8. If user asks "in detail", go deeper

Tone:
- Friendly, smart, mentor-like
- Like a top edtech instructor

Context Awareness:
- Always assume the student is from HireAssist courses
- Connect answers to course modules when possible

DO NOT:
- Give random generic answers
- Be robotic
- Dump unstructured text

Make every answer feel premium and engaging.
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
