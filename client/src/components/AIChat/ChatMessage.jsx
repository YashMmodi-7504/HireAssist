import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FiUser, FiCpu, FiCopy, FiCheck, FiRefreshCw } from "react-icons/fi";

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

// Recursively flattens markdown children into raw text — needed because
// react-markdown's <pre> children is a <code> element whose children may
// be a mix of strings and inline syntax-token spans.
const extractText = (node) => {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (React.isValidElement(node)) return extractText(node.props.children);
  return "";
};

const CodeBlock = ({ children }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(extractText(children));
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard unavailable */
    }
  };
  return (
    <div className="relative group/code my-3">
      <button
        type="button"
        onClick={handleCopy}
        className="absolute top-2 right-2 z-10 inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/15 backdrop-blur-sm opacity-0 group-hover/code:opacity-100 transition-opacity"
      >
        {copied ? (
          <>
            <FiCheck className="w-3 h-3 text-emerald-300" />
            Copied
          </>
        ) : (
          <>
            <FiCopy className="w-3 h-3" />
            Copy code
          </>
        )}
      </button>
      <pre>{children}</pre>
    </div>
  );
};

// ─── react-markdown component overrides ──────────────────────────────────
// CSS in `.markdown-body` (index.css) handles base typography. These
// overrides only do things CSS can't: keyword highlighting, callouts,
// code-block copy chip, safe external-link attrs.
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
  pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
};

// ─── Component ───────────────────────────────────────────────────────────
const formatTime = (date) =>
  date instanceof Date && !Number.isNaN(date.valueOf())
    ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";

const ChatMessage = ({ message, streaming = false, onRegenerate }) => {
  const { role, content, ts, isError } = message;
  const mine = role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard unavailable — silent no-op */
    }
  };

  const showActions = !mine && !isError && !streaming && content;

  return (
    <div
      className={`chat-bubble-in group flex items-start gap-3 ${
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

      {/* Bubble + below-bubble action row (stacked) */}
      <div
        className={`flex flex-col ${
          mine ? "items-end" : "items-start"
        } max-w-[70%] md:max-w-[72ch] min-w-0`}
      >
        <div
          className={`relative w-full rounded-2xl ${
            mine
              ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-br-sm px-5 py-3 shadow-md shadow-purple-500/15"
              : isError
              ? "bg-red-50 text-red-900 rounded-bl-sm px-5 py-3 border-l-[3px] border-red-300"
              : "bg-white text-gray-800 rounded-bl-sm px-6 py-4 shadow-sm shadow-gray-200/70 border-l-[3px] border-purple-300"
          }`}
        >
          {!mine && !isError && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-full mb-2.5">
              <FiCpu className="w-2.5 h-2.5" />
              AI Tutor
            </span>
          )}
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
                {content || ""}
              </ReactMarkdown>
              {streaming && (
                <span
                  aria-hidden="true"
                  className="inline-block w-[7px] h-[15px] -mb-0.5 ml-0.5 bg-purple-500 rounded-sm animate-pulse"
                />
              )}
            </div>
          )}

          {/* Copy button — top-right, fades in on bubble hover */}
          {showActions && (
            <button
              type="button"
              onClick={handleCopy}
              title={copied ? "Copied" : "Copy"}
              aria-label={copied ? "Copied" : "Copy message"}
              className="absolute top-2.5 right-2.5 inline-flex items-center justify-center w-7 h-7 rounded-md bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-white opacity-0 group-hover:opacity-100 transition-all shadow-sm"
            >
              {copied ? (
                <FiCheck className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <FiCopy className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>

        {/* Below-bubble row: timestamp + labeled regenerate */}
        <div
          className={`flex items-center gap-3 mt-1.5 px-1 ${
            mine ? "flex-row-reverse" : ""
          }`}
        >
          {ts && (
            <p
              className={`text-[10px] ${
                isError ? "text-red-500" : "text-gray-400"
              }`}
            >
              {formatTime(ts)}
            </p>
          )}
          {showActions && onRegenerate && (
            <button
              type="button"
              onClick={onRegenerate}
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 hover:text-purple-700 transition-colors"
            >
              <FiRefreshCw className="w-3 h-3" />
              Regenerate response
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Memoized so streaming reveal (which swaps the active bubble's `message`
// reference every ~18ms) doesn't force every prior bubble to re-render.
// Older messages keep stable references and skip the work entirely.
export default React.memo(ChatMessage);
