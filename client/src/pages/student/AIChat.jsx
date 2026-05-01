import React, { useEffect, useRef, useState } from "react";
import {
  FiSend,
  FiCpu,
  FiTrash2,
  FiAlertTriangle,
  FiZap,
} from "react-icons/fi";
import { sendMessage, isFallbackReply } from "../../services/aiService";
import { COURSES } from "../../data/courseCatalog";
import { useAuth } from "../../auth/AuthContext";
import ChatMessage from "../../components/AIChat/ChatMessage";

const SUGGESTIONS = [
  "Explain Deep Learning simply.",
  "What is Reinforcement Learning?",
  "Walk me through SAP S/4HANA in detail.",
  "How do I build a strong resume?",
  "Explain Time Complexity with an example.",
];

const AIChat = () => {
  const { user } = useAuth();
  const studentName = user?.name?.split(" ")[0] || "there";

  const [messages, setMessages] = useState(() => [
    {
      role: "assistant",
      content: `Hi ${studentName}! I'm your AI tutor for the **Advance** and **Foundation** courses. Ask me anything from the syllabus — AI/ML, Deep Learning, Edge AI, SAP, Employability Skills, programming basics, DSA, web dev, or Git. Add "explain simply" or "explain in detail" to control depth.`,
      ts: new Date(),
    },
  ]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [draft]);

  const send = async (overrideText) => {
    const text = (overrideText ?? draft).trim();
    if (!text || loading) return;

    setError(null);
    setMessages((prev) => [
      ...prev,
      { role: "user", content: text, ts: new Date() },
    ]);
    setDraft("");
    setLoading(true);

    const reply = await sendMessage(text);
    const failed = isFallbackReply(reply);
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: reply, ts: new Date(), isError: failed },
    ]);
    if (failed) {
      setError("AI service is currently unreachable. See browser console for details.");
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const reset = () => {
    setMessages([
      {
        role: "assistant",
        content: `Fresh chat. Ask me anything about the courses in your catalog, ${studentName}.`,
        ts: new Date(),
      },
    ]);
    setError(null);
  };

  return (
    <div className="w-full bg-slate-50 min-h-full">
      {/* Hero band */}
      <div className="bg-gradient-to-r from-purple-50 via-white to-indigo-50 border-b border-purple-100">
        <div className="px-6 lg:px-8 py-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 flex items-center gap-2.5">
              <span className="inline-flex w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 items-center justify-center text-white shadow-sm">
                <FiCpu className="w-5 h-5" />
              </span>
              AI Assistant
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Course-aware AI tutor — grounded in your enrolled catalog
            </p>
          </div>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors"
          >
            <FiTrash2 className="w-4 h-4" />
            New chat
          </button>
        </div>
      </div>

      <div className="w-full px-6 lg:px-8 py-6 grid grid-cols-12 gap-6">
        {/* Chat column */}
        <section className="col-span-12 lg:col-span-8 bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col h-[calc(100vh-220px)] min-h-[520px] overflow-hidden">
          {/* Status pill */}
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex w-2 h-2 rounded-full bg-emerald-500" />
              <p className="text-xs font-semibold text-gray-700">
                Connected · llama-3.1-8b-instant
              </p>
            </div>
            <span className="text-[11px] text-gray-400">Powered by Groq</span>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-5 space-y-5 scroll-smooth">
            {messages.map((m, i) => (
              <ChatMessage key={i} message={m} />
            ))}

            {loading && (
              <div className="chat-bubble-in flex items-end gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-sm">
                  <FiCpu className="w-3.5 h-3.5" />
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "120ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "240ms" }} />
                  </div>
                  <span className="text-xs text-gray-500 font-medium">AI is thinking…</span>
                </div>
              </div>
            )}
          </div>

          {/* Error banner */}
          {error && (
            <div className="px-5 py-2.5 border-t border-red-100 bg-red-50 flex items-center gap-2 text-xs text-red-800">
              <FiAlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-gray-100 p-4">
            <div className="flex items-end gap-2">
              <textarea
                ref={textareaRef}
                rows={1}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about Deep Learning, Edge AI, SAP, interviews…"
                disabled={loading}
                className="flex-1 resize-none bg-gray-100 border border-transparent rounded-xl px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white focus:border-gray-200 transition-all duration-200 disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => send()}
                disabled={loading || !draft.trim()}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-br from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-300 text-white font-semibold px-4 py-3 rounded-xl shadow-sm transition-all duration-200 disabled:cursor-not-allowed"
              >
                <FiSend className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
            <p className="text-[11px] text-gray-400 mt-2 px-1">
              Press <kbd className="px-1.5 py-0.5 rounded bg-gray-100 border border-gray-200 text-[10px] font-mono">Enter</kbd> to send · <kbd className="px-1.5 py-0.5 rounded bg-gray-100 border border-gray-200 text-[10px] font-mono">Shift + Enter</kbd> for newline
            </p>
          </div>
        </section>

        {/* Side column: suggestions + course context */}
        <aside className="col-span-12 lg:col-span-4 space-y-4">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <FiZap className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-semibold text-gray-900">Try asking</h3>
            </div>
            <div className="space-y-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  disabled={loading}
                  className="w-full text-left text-sm text-gray-700 bg-gray-50 hover:bg-purple-50 hover:text-purple-700 border border-gray-100 hover:border-purple-200 rounded-lg px-3 py-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Course context</h3>
            <p className="text-xs text-gray-500 mb-3">
              The AI is grounded in your catalog and module list:
            </p>
            <ul className="space-y-2.5">
              {COURSES.map((c) => (
                <li key={c.id} className="flex items-start gap-2.5">
                  <span
                    className={`mt-0.5 w-2 h-2 rounded-full bg-gradient-to-br ${c.accent} flex-shrink-0`}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 leading-tight">{c.title}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {c.modules.length} modules · {c.duration}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AIChat;
