import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FiUser, FiCpu } from "react-icons/fi";

// ─── Keyword highlighting ────────────────────────────────────────────────
// Multi-word entries come BEFORE single-word components so the regex
// captures the longer match first ("Deep Learning" before "Learning").
const KEYWORDS = [
  "Reinforcement Learning",
  "Supervised Learning",
  "Unsupervised Learning",
  "Artificial Intelligence",
  "Machine Learning",
  "Deep Learning",
  "Neural Network",
];

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const KEYWORD_RE = new RegExp(`(${KEYWORDS.map(escapeRegex).join("|")})`, "gi");
const KEYWORD_LC = new Set(KEYWORDS.map((k) => k.toLowerCase()));

// Walks ReactMarkdown's children and wraps matching keywords in a styled
// span. Non-string children pass through untouched, so highlighting nests
// correctly inside <strong>, <em>, links, list items.
const highlight = (children) =>
  React.Children.map(children, (child) => {
    if (typeof child !== "string") return child;
    const parts = child.split(KEYWORD_RE);
    return parts.map((part, i) =>
      part && KEYWORD_LC.has(part.toLowerCase()) ? (
        <span
          key={i}
          className="bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded-md font-medium"
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  });

// ─── Callout banners ─────────────────────────────────────────────────────
// When a heading text matches one of these, it's swapped for a colored
// banner with an icon — gives a Notion-callout feel without preprocessing.
const CALLOUT_TYPES = {
  definition: {
    emoji: "📘",
    label: "Definition",
    bg: "bg-gradient-to-r from-blue-50 to-indigo-50",
    border: "border-indigo-200",
    text: "text-indigo-900",
  },
  "key concepts": {
    emoji: "⚡",
    label: "Key Concepts",
    bg: "bg-gradient-to-r from-amber-50 to-yellow-50",
    border: "border-amber-200",
    text: "text-amber-900",
  },
  example: {
    emoji: "🧠",
    label: "Example",
    bg: "bg-gradient-to-r from-emerald-50 to-teal-50",
    border: "border-emerald-200",
    text: "text-emerald-900",
  },
  "real-world use": {
    emoji: "🌍",
    label: "Real-world use",
    bg: "bg-gradient-to-r from-rose-50 to-pink-50",
    border: "border-rose-200",
    text: "text-rose-900",
  },
  "real world use": {
    emoji: "🌍",
    label: "Real-world use",
    bg: "bg-gradient-to-r from-rose-50 to-pink-50",
    border: "border-rose-200",
    text: "text-rose-900",
  },
};

const childrenToText = (children) =>
  React.Children.toArray(children)
    .map((c) => (typeof c === "string" ? c : c?.props?.children ?? ""))
    .join("")
    .toLowerCase()
    .trim()
    .replace(/[:.\-—]+$/, "")
    .trim();

const matchCallout = (children) => {
  const text = childrenToText(children);
  return CALLOUT_TYPES[text] || null;
};

const Callout = ({ cfg }) => (
  <div
    className={`my-4 px-4 py-2.5 rounded-lg border ${cfg.bg} ${cfg.border} ${cfg.text} flex items-center gap-2 shadow-sm`}
  >
    <span className="text-lg leading-none">{cfg.emoji}</span>
    <span className="font-semibold text-[0.95rem]">{cfg.label}</span>
  </div>
);

// Heading factory: callout banner if the heading text matches a callout
// keyword, otherwise a regular highlighted heading.
const heading = (Tag) =>
  function H({ children }) {
    const cfg = matchCallout(children);
    if (cfg) return <Callout cfg={cfg} />;
    return <Tag>{highlight(children)}</Tag>;
  };

// ─── react-markdown component overrides ──────────────────────────────────
// CSS in `.markdown-body` (index.css) handles base typography. These
// overrides only do things CSS can't: keyword highlighting, callouts,
// safe external-link attrs.
const markdownComponents = {
  h1: heading("h1"),
  h2: heading("h2"),
  h3: heading("h3"),
  h4: heading("h4"),
  p: ({ children }) => <p>{highlight(children)}</p>,
  li: ({ children }) => <li>{highlight(children)}</li>,
  strong: ({ children }) => <strong>{highlight(children)}</strong>,
  em: ({ children }) => <em>{highlight(children)}</em>,
  a: ({ children, href }) => (
    <a href={href} target="_blank" rel="noreferrer noopener">
      {highlight(children)}
    </a>
  ),
};

// ─── Component ───────────────────────────────────────────────────────────
const formatTime = (date) =>
  date instanceof Date && !Number.isNaN(date.valueOf())
    ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";

const ChatMessage = ({ message }) => {
  const { role, content, ts, isError } = message;
  const mine = role === "user";

  return (
    <div
      className={`chat-bubble-in flex items-end gap-3 ${
        mine ? "flex-row-reverse" : ""
      }`}
    >
      {/* Avatar */}
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm ring-2 ring-white ${
          mine
            ? "bg-gradient-to-br from-purple-500 to-indigo-500"
            : isError
            ? "bg-gradient-to-br from-red-500 to-rose-600"
            : "bg-gradient-to-br from-emerald-500 to-teal-600"
        }`}
      >
        {mine ? <FiUser className="w-4 h-4" /> : <FiCpu className="w-4 h-4" />}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[70%] md:max-w-[72ch] rounded-2xl shadow-sm ${
          mine
            ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-br-sm px-5 py-3"
            : isError
            ? "bg-red-50 border border-red-200 text-red-900 rounded-bl-sm px-5 py-3"
            : "bg-white border border-gray-200/80 text-gray-800 rounded-bl-sm px-6 py-4"
        }`}
      >
        {mine || isError ? (
          <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {content}
          </div>
        ) : (
          <div className="markdown-body break-words">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}

        {ts && (
          <p
            className={`text-[10px] mt-2 ${
              mine ? "text-white/70" : isError ? "text-red-500" : "text-gray-400"
            }`}
          >
            {formatTime(ts)}
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
