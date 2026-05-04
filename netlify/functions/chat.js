const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.1-8b-instant";

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
    logError("HIREASSIST_GROQ_KEY is not configured");
    return json(500, { error: "Missing HIREASSIST_GROQ_KEY" });
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return json(400, { error: "Invalid JSON body" });
  }

  const message = body?.message;
  if (typeof message !== "string" || message.trim().length === 0) {
    return json(400, { error: "Invalid or missing 'message'" });
  }

  log(`forwarding ${message.length} chars to Groq (${MODEL})`);

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
          { role: "user", content: message },
        ],
      }),
    });
  } catch (err) {
    logError("Network error reaching Groq:", err?.message || err);
    return json(502, { error: "Network error reaching Groq" });
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
    return json(502, { error: "Invalid JSON from Groq" });
  }

  const reply = data?.choices?.[0]?.message?.content?.trim();
  if (!reply) {
    logError("Empty content from Groq");
    return json(502, { error: "Empty response from Groq" });
  }

  log(`reply ${reply.length} chars, returning 200`);
  return json(200, { reply });
}
