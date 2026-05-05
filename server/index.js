import express from "express";
import cors from "cors";
import "dotenv/config";
import { registerAuthRoutes } from "./auth.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

registerAuthRoutes(app);

const SYSTEM_PROMPT = `You are an expert programming tutor for college students. You ONLY answer questions about these topics:

- Python
- Web Development (HTML, CSS, JavaScript, React, Node.js, APIs)
- Machine Learning
- Deep Learning
- Data Structures & Algorithms (DSA)

Rules:
1. If the question is outside these topics, respond with EXACTLY this sentence and nothing else: "I specialize in programming and tech topics only."
2. Keep answers concise — under ~200 words by default. Trim filler words.
3. Prefer practical, example-based explanations. Show short code snippets when helpful.
4. Use markdown formatting: code blocks for code, lists for steps, bold for key terms.
5. If a question is ambiguous, ask one clarifying question first.
6. Never claim to access the student's personal account, courses, or files.

Tone: clear, friendly, direct — like a senior peer explaining to a junior.`;

const MODEL = process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001";
const MAX_TOKENS = Number(process.env.ANTHROPIC_MAX_TOKENS || 600);

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    model: MODEL,
    keyConfigured: !!process.env.ANTHROPIC_API_KEY,
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body || {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages array is required" });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "ANTHROPIC_API_KEY is not configured on the server",
      });
    }

    // Normalize: keep only role + content, drop any client-side metadata
    const safeMessages = messages
      .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .map((m) => ({ role: m.role, content: m.content }));

    if (safeMessages.length === 0) {
      return res.status(400).json({ error: "no valid messages" });
    }

    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        // Cached system prompt cuts cost on repeat turns
        system: [
          {
            type: "text",
            text: SYSTEM_PROMPT,
            cache_control: { type: "ephemeral" },
          },
        ],
        messages: safeMessages,
      }),
    });

    if (!upstream.ok) {
      const errText = await upstream.text();
      console.error("[anthropic]", upstream.status, errText.slice(0, 400));
      return res.status(502).json({ error: "AI request failed" });
    }

    const data = await upstream.json();
    const reply = data?.content?.[0]?.text || "";

    res.json({ reply, model: data?.model, usage: data?.usage });
  } catch (err) {
    console.error("[chat] error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = Number(process.env.PORT || 3001);
app.listen(PORT, () => {
  console.log(`HirerAssist server listening on http://localhost:${PORT}`);
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn(
      "[warn] ANTHROPIC_API_KEY is not set. /api/chat will return 500 until you add it to .env"
    );
  }
});
