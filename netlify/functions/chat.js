const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.1-8b-instant";

const SYSTEM_PROMPT = `
You are HireAssist AI – a premium AI Learning Mentor for students.

ROLE:
You help students with:
- learning explanations
- interview preparation
- resume guidance
- practice questions
- placement mentoring
- concept clarification

STUDENT CONTEXT:
Use:
- currentCourse
- progress
- weakTopics
- behavior
- learningHistory

STRICT RESPONSE RULES:
1. NEVER use markdown
2. NEVER use ** or bullet markdown formatting
3. Keep responses structured
4. Keep explanations concise but useful
5. ALWAYS return valid JSON only

RESPONSE FORMAT:
{
  "title": "Topic title",
  "explanation": "Structured explanation",
  "example": "Simple example",
  "realWorld": "Real-world application",
  "practiceQuestions": ["Question 1", "Question 2", "Question 3"],
  "nextActions": ["Action 1", "Action 2"]
}

TONE:
- Professional
- Clear
- Encouraging
- EdTech mentor style
`;

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(body),
  };
}

const log = (...args) => console.log("[HireAssist AI]", ...args);
const logError = (...args) => console.error("[HireAssist AI ERROR]", ...args);

function safeFallbackResponse(message = "Unable to generate structured response.") {
  return {
    title: "AI Learning Mentor",
    explanation: message,
    example: "",
    realWorld: "",
    practiceQuestions: [],
    nextActions: [],
  };
}

async function fetchWithTimeout(url, options, timeout = 25000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

export async function handler(event) {
  try {
    // Handle preflight
    if (event.httpMethod === "OPTIONS") {
      return {
        statusCode: 200,
        headers: DEFAULT_HEADERS,
        body: "",
      };
    }

    if (event.httpMethod !== "POST") {
      return json(405, {
        error: "Method Not Allowed",
      });
    }

    // Environment key support
    const apiKey =
      process.env.HIREASSIST_GROQ_KEY ||
      process.env.GROQ_API_KEY;

    if (!apiKey) {
      logError("Missing Groq API key");

      return json(500, {
        error: "AI service configuration missing",
      });
    }

    let body = {};

    try {
      body = JSON.parse(event.body || "{}");
    } catch {
      return json(400, {
        error: "Invalid JSON body",
      });
    }

    const { message, context = {} } = body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return json(400, {
        error: "Message is required",
      });
    }

    const contextualPrompt = `
USER MESSAGE:
${message}

STUDENT CONTEXT:
${JSON.stringify(context, null, 2)}

Generate a structured mentor response in strict JSON format only.
`;

    log("Sending request to Groq");

    const upstream = await fetchWithTimeout(
      GROQ_ENDPOINT,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: MODEL,
          temperature: 0.3,
          max_tokens: 1200,
          messages: [
            {
              role: "system",
              content: SYSTEM_PROMPT,
            },
            {
              role: "user",
              content: contextualPrompt,
            },
          ],
        }),
      },
      25000
    );

    const rawText = await upstream.text();

    if (!upstream.ok) {
      logError("Groq upstream error:", rawText);

      return json(502, {
        error: "AI upstream service error",
      });
    }

    let parsedGroq;

    try {
      parsedGroq = JSON.parse(rawText);
    } catch {
      logError("Groq returned invalid JSON:", rawText);

      return json(502, {
        error: "Invalid AI provider response",
      });
    }

    const aiContent =
      parsedGroq?.choices?.[0]?.message?.content?.trim();

    if (!aiContent) {
      logError("Empty AI content");

      return json(200, safeFallbackResponse("AI returned empty response."));
    }

    let finalResponse;

    try {
      finalResponse = JSON.parse(aiContent);
    } catch {
      log("AI returned plain text, wrapping safely");

      finalResponse = safeFallbackResponse(aiContent);
    }

    return json(200, finalResponse);
  } catch (err) {
    if (err.name === "AbortError") {
      logError("AI request timeout");

      return json(504, {
        error: "AI response timeout",
      });
    }

    logError("Unhandled error:", err);

    return json(500, {
      error: "Internal AI service error",
    });
  }
}