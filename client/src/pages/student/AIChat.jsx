import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiSend,
  FiCpu,
  FiTrash2,
  FiAlertTriangle,
} from "react-icons/fi";
import { sendMessage, isFallbackReply } from "../../services/aiService";
import { useAuth } from "../../auth/AuthContext";
import ChatMessage from "../../components/AIChat/ChatMessage";
import ChatSidebar from "../../components/AIChat/ChatSidebar";
import SuggestedQuestions from "../../components/AIChat/SuggestedQuestions";
import {
  topicCategories,
  HERO_SUGGESTIONS,
} from "../../components/AIChat/topicSuggestions";

// ─── Constants ───────────────────────────────────────────────────────────
const STORAGE_KEY = "hireassist:chats";
const MAX_CHATS = 20;
const STREAM_CHARS_PER_TICK = 6;
const STREAM_TICK_MS = 18;
const TITLE_MAX = 38;

// Headlines that cycle on the empty-state hero. Keep the cadence varied
// — questions, invitations, prompts — so each reload feels alive.
const ROTATING_HEADLINES = [
  "What do you want to learn today?",
  "Ready to master a new concept?",
  "Pick a topic — I'll guide you step by step.",
  "Curious about something? Ask away.",
];
const HEADLINE_INTERVAL_MS = 3500;

// ─── Pure helpers ────────────────────────────────────────────────────────
const newId = () =>
  (typeof crypto !== "undefined" && crypto.randomUUID?.()) ||
  `chat-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const greeting = (name) => ({
  id: newId(),
  role: "assistant",
  content: `Hi ${name}! I'm your AI tutor for the **Advance** and **Foundation** courses. Ask me anything from the syllabus — AI/ML, Deep Learning, Edge AI, SAP, Employability Skills, programming basics, DSA, web dev, or Git. Add "explain simply" or "explain in detail" to control depth.`,
  ts: Date.now(),
});

const newChat = (name = "there") => ({
  id: newId(),
  title: "New chat",
  messages: [greeting(name)],
  updatedAt: Date.now(),
});

const deriveTitle = (messages) => {
  const firstUser = messages.find((m) => m.role === "user");
  if (!firstUser) return "New chat";
  const t = firstUser.content.trim().replace(/\s+/g, " ");
  return t.length > TITLE_MAX ? `${t.slice(0, TITLE_MAX - 1)}…` : t;
};

const loadChats = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    return parsed;
  } catch {
    return null;
  }
};

const saveChats = (chats) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats.slice(0, MAX_CHATS)));
  } catch {
    /* quota exceeded — silent */
  }
};

// ─── Component ───────────────────────────────────────────────────────────
const AIChat = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const studentName = user?.name?.split(" ")[0] || "there";

  const [chats, setChats] = useState(() => loadChats() || [newChat(studentName)]);
  const [activeId, setActiveId] = useState(() => chats[0].id);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const scrollRef = useRef(null);
  const textareaRef = useRef(null);
  const streamTimerRef = useRef(null);
  // Synchronous re-entry guard — `loading` state is async, so two clicks
  // in the same tick both pass an `if (loading) return` check before the
  // setLoading propagates. A ref flips synchronously and blocks the second.
  const inFlightRef = useRef(false);
  // One-shot guard for the router-state auto-fire. Strict Mode invokes the
  // mount effect twice in dev — without this the same prompt sends twice.
  const autoFiredRef = useRef(false);

  const activeChat = useMemo(
    () => chats.find((c) => c.id === activeId) || chats[0],
    [chats, activeId]
  );
  const messages = activeChat?.messages || [];

  // Persist to localStorage whenever chats change.
  useEffect(() => {
    saveChats(chats);
  }, [chats]);

  // Smooth-scroll to latest message.
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  // Auto-grow textarea up to 160px.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [draft]);

  // Cancel any in-flight stream when switching chat or unmounting.
  useEffect(() => {
    return () => {
      if (streamTimerRef.current) {
        clearInterval(streamTimerRef.current);
        streamTimerRef.current = null;
      }
    };
  }, [activeId]);

  // ─── State mutators ────────────────────────────────────────────────────
  const updateActiveMessages = (updater) => {
    setChats((prev) =>
      prev.map((c) => {
        if (c.id !== activeId) return c;
        const nextMessages =
          typeof updater === "function" ? updater(c.messages) : updater;
        return {
          ...c,
          messages: nextMessages,
          title: deriveTitle(nextMessages) || c.title,
          updatedAt: Date.now(),
        };
      })
    );
  };

  const handleNewChat = () => {
    if (streamTimerRef.current) {
      clearInterval(streamTimerRef.current);
      streamTimerRef.current = null;
    }
    inFlightRef.current = false;
    const fresh = newChat(studentName);
    setChats((prev) => [fresh, ...prev].slice(0, MAX_CHATS));
    setActiveId(fresh.id);
    setError(null);
    setDraft("");
    setLoading(false);
  };

  const handleSelectChat = (id) => {
    if (id === activeId) return;
    if (streamTimerRef.current) {
      clearInterval(streamTimerRef.current);
      streamTimerRef.current = null;
    }
    inFlightRef.current = false;
    setActiveId(id);
    setError(null);
    setLoading(false);
  };

  const handleDeleteChat = (id) => {
    setChats((prev) => {
      const next = prev.filter((c) => c.id !== id);
      if (next.length === 0) {
        const fresh = newChat(studentName);
        setActiveId(fresh.id);
        return [fresh];
      }
      if (id === activeId) setActiveId(next[0].id);
      return next;
    });
  };

  const handleClearActive = () => {
    if (streamTimerRef.current) {
      clearInterval(streamTimerRef.current);
      streamTimerRef.current = null;
    }
    inFlightRef.current = false;
    updateActiveMessages([greeting(studentName)]);
    setError(null);
    setLoading(false);
  };

  // ─── Streaming reveal ──────────────────────────────────────────────────
  // Each call owns its own interval ID via closure. Before starting a new
  // stream we cancel any prior one explicitly, so a fast follow-up request
  // can't leave the previous interval running as a zombie that keeps
  // pushing updates after the user has moved on.
  const streamAssistantReply = (full) => {
    if (streamTimerRef.current) {
      clearInterval(streamTimerRef.current);
      streamTimerRef.current = null;
    }

    const messageId = newId();
    updateActiveMessages((prev) => [
      ...prev,
      {
        id: messageId,
        role: "assistant",
        content: "",
        ts: Date.now(),
        streaming: true,
      },
    ]);

    let cursor = 0;
    const intervalId = setInterval(() => {
      cursor = Math.min(cursor + STREAM_CHARS_PER_TICK, full.length);
      const isDone = cursor >= full.length;
      updateActiveMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? { ...m, content: full.slice(0, cursor), streaming: !isDone }
            : m
        )
      );
      if (isDone) {
        clearInterval(intervalId);
        // Only clear the ref if we still own it — a newer stream may have
        // already replaced it.
        if (streamTimerRef.current === intervalId) {
          streamTimerRef.current = null;
        }
      }
    }, STREAM_TICK_MS);
    streamTimerRef.current = intervalId;
  };

  // ─── Send / regenerate ─────────────────────────────────────────────────
  // Uses inFlightRef (synchronous) instead of `loading` state because
  // setState updates are batched and async — two clicks in the same tick
  // both pass an `if (loading) return` check before setLoading propagates.
  const sendUserMessage = async (text) => {
    if (!text || inFlightRef.current) return;
    inFlightRef.current = true;
    setError(null);
    updateActiveMessages((prev) => [
      ...prev,
      { id: newId(), role: "user", content: text, ts: Date.now() },
    ]);
    setLoading(true);

    try {
      const reply = await sendMessage(text);
      if (isFallbackReply(reply)) {
        setError("AI service is currently unreachable. See browser console for details.");
        updateActiveMessages((prev) => [
          ...prev,
          {
            id: newId(),
            role: "assistant",
            content: reply,
            ts: Date.now(),
            isError: true,
          },
        ]);
        return;
      }
      streamAssistantReply(reply);
    } finally {
      setLoading(false);
      inFlightRef.current = false;
    }
  };

  const handleSubmit = (overrideText) => {
    const text = (overrideText ?? draft).trim();
    if (!text) return;
    setDraft("");
    sendUserMessage(text);
  };

  const handleRegenerate = async () => {
    if (inFlightRef.current) return;
    // Find the last user message — that's what we'll resend.
    const lastUserIdx = [...messages].reverse().findIndex((m) => m.role === "user");
    if (lastUserIdx === -1) return;
    const realIdx = messages.length - 1 - lastUserIdx;
    const lastUser = messages[realIdx];

    inFlightRef.current = true;
    // Drop everything after that user message so the new reply replaces the old.
    updateActiveMessages((prev) => prev.slice(0, realIdx + 1));
    setError(null);
    setLoading(true);

    try {
      const reply = await sendMessage(lastUser.content);
      if (isFallbackReply(reply)) {
        setError("AI service is currently unreachable.");
        updateActiveMessages((prev) => [
          ...prev,
          {
            id: newId(),
            role: "assistant",
            content: reply,
            ts: Date.now(),
            isError: true,
          },
        ]);
        return;
      }
      streamAssistantReply(reply);
    } finally {
      setLoading(false);
      inFlightRef.current = false;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-fire a prompt passed via router state (e.g. dashboard "Ask AI").
  // Three guards needed:
  //   1. autoFiredRef — Strict Mode runs the mount effect twice in dev;
  //      this ref ensures we only fire once per component lifetime.
  //   2. inFlightRef inside sendUserMessage — covers any other re-entry.
  //   3. Clear the router state immediately so back/forward nav can't refire.
  useEffect(() => {
    if (autoFiredRef.current) return;
    const pending = location.state?.prompt;
    if (!pending) return;
    autoFiredRef.current = true;
    navigate(location.pathname, { replace: true, state: null });
    // Defer one tick so the navigate() state-clear settles first.
    setTimeout(() => sendUserMessage(pending), 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  const lastAssistantIdx = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const m = messages[i];
      if (m.role === "assistant" && !m.isError && !m.streaming) return i;
    }
    return -1;
  }, [messages]);

  // Fresh chat with only the seeded greeting → show hero instead of a bubble.
  const isEmptyState =
    !loading &&
    messages.length === 1 &&
    messages[0]?.role === "assistant";

  // Rotate the empty-state headline on a timer. Reset when leaving the
  // empty state so the user always lands on the first phrasing first.
  const [headlineIdx, setHeadlineIdx] = useState(0);
  useEffect(() => {
    if (!isEmptyState) {
      setHeadlineIdx(0);
      return undefined;
    }
    const id = setInterval(
      () => setHeadlineIdx((i) => (i + 1) % ROTATING_HEADLINES.length),
      HEADLINE_INTERVAL_MS
    );
    return () => clearInterval(id);
  }, [isEmptyState]);

  // ─── Render ────────────────────────────────────────────────────────────
  return (
    <div
      className="w-full min-h-full"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 90% 50% at 50% 0%, rgba(124,92,255,0.08), transparent 70%), linear-gradient(180deg, #FAFAFB 0%, #F4F3F8 100%)",
      }}
    >
      <div className="grid grid-cols-12 gap-0 lg:gap-6 lg:px-6 lg:pt-6">
        {/* Chat column — no panel chrome, full-height immersive */}
        <section className="col-span-12 lg:col-span-8 flex flex-col h-[calc(100vh-64px)] min-h-[560px] relative">
          {/* AI Persona header — floats inline, no card wrapper */}
          <div className="px-6 lg:px-10 pt-6 pb-4 flex items-start justify-between gap-4 max-w-[800px] w-full mx-auto">
            <div className="flex items-center gap-3">
              <span className="brand-glow inline-flex w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 items-center justify-center text-white">
                <FiCpu className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <span aria-hidden="true">🤖</span>
                  AI Assistant
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  Your personal AI tutor for HireAssist courses
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 bg-white border border-gray-200 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                llama-3.1-8b-instant
              </span>
              <button
                type="button"
                onClick={handleClearActive}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 hover:bg-white rounded-lg transition-colors"
              >
                <FiTrash2 className="w-3.5 h-3.5" />
                Clear
              </button>
            </div>
          </div>

          {/* Messages — centered column, no border, soft bg behind from page */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto scroll-smooth"
          >
            {isEmptyState ? (
              /* Empty-state hero — replaces the greeting bubble for fresh chats */
              <div className="max-w-[800px] mx-auto px-6 lg:px-10 py-10 flex flex-col items-center justify-center text-center min-h-full">
                <span className="brand-glow inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 items-center justify-center text-white mb-6">
                  <FiCpu className="w-7 h-7" />
                </span>
                <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight min-h-[2.5em] flex items-center justify-center gap-2 flex-wrap">
                  <span key={headlineIdx} className="chat-bubble-in inline-block">
                    {ROTATING_HEADLINES[headlineIdx]}
                  </span>
                  <span aria-hidden="true">👇</span>
                </h2>
                <p className="text-sm text-gray-500 mt-2 max-w-md">
                  I'm grounded in the HireAssist syllabus — Foundation &amp; Advance modules. Pick a starter or type your own.
                </p>
                <div className="mt-7">
                  <SuggestedQuestions
                    variant="hero"
                    suggestions={HERO_SUGGESTIONS}
                    onPick={handleSubmit}
                    disabled={loading}
                  />
                </div>
              </div>
            ) : (
              <div className="max-w-[800px] mx-auto px-6 lg:px-10 py-4 space-y-6">
                {messages.map((m, i) => (
                  <ChatMessage
                    key={m.id || i}
                    message={m}
                    streaming={!!m.streaming}
                    onRegenerate={i === lastAssistantIdx ? handleRegenerate : undefined}
                  />
                ))}

                {/* Progressive learning flow — 3 tonal categories under the latest AI reply */}
                {!loading &&
                  lastAssistantIdx >= 0 &&
                  !messages.some((m) => m.streaming) &&
                  (() => {
                    const cats = topicCategories(
                      messages[lastAssistantIdx]?.content
                    );
                    return (
                      <div className="pl-11 pr-1 mt-2">
                        <p className="text-xs italic text-gray-500 mb-3">
                          💡 Choose your next step to continue learning
                        </p>
                        <div className="bg-white/70 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-sm p-5 divide-y divide-gray-100">
                          <div className="pb-4">
                            <SuggestedQuestions
                              label="📘 Continue Learning"
                              tone="blue"
                              suggestions={cats.continueLearning}
                              onPick={handleSubmit}
                              disabled={loading}
                            />
                          </div>
                          <div className="py-4">
                            <SuggestedQuestions
                              label="🧠 Practice Questions"
                              tone="yellow"
                              suggestions={cats.practice}
                              onPick={handleSubmit}
                              disabled={loading}
                            />
                          </div>
                          <div className="pt-4">
                            <SuggestedQuestions
                              label="🎯 Interview Questions"
                              tone="pink"
                              suggestions={cats.interview}
                              onPick={handleSubmit}
                              disabled={loading}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                {loading && (
                  <div className="chat-bubble-in flex items-end gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-sm ring-2 ring-white">
                      <FiCpu className="w-3.5 h-3.5" />
                    </div>
                    <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm shadow-gray-200/70 flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "120ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "240ms" }} />
                      </div>
                      <span className="text-xs text-gray-500 font-medium">AI is thinking…</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Error banner — floats, not a panel border */}
          {error && (
            <div className="max-w-[800px] mx-auto w-full px-6 lg:px-10">
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 flex items-center justify-between gap-2 text-xs text-red-800">
                <span className="inline-flex items-center gap-2">
                  <FiAlertTriangle className="w-4 h-4 flex-shrink-0" />
                  Something went wrong. {error}
                </span>
                <button
                  type="button"
                  onClick={handleRegenerate}
                  className="font-semibold text-red-700 hover:text-red-900 underline underline-offset-2"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Composer area: floating pill input, no panel chrome */}
          <div className="pb-5 pt-3 px-6 lg:px-10">
            <div className="max-w-[800px] mx-auto">
              {/* Floating pill input — glassmorphism */}
              <div className="flex items-end gap-2 bg-white/70 backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_-12px_rgba(76,29,149,0.18)] border border-white/60 ring-1 ring-gray-200/60 focus-within:ring-purple-300 focus-within:bg-white/85 focus-within:shadow-[0_12px_40px_-12px_rgba(124,92,255,0.35)] transition-all duration-300 p-2 pl-5">
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything about your course…"
                  disabled={loading}
                  className="flex-1 resize-none bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none disabled:opacity-60 py-2.5"
                />
                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  disabled={loading || !draft.trim()}
                  className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-300 text-white rounded-2xl shadow-sm transition-all duration-200 disabled:cursor-not-allowed hover:-translate-y-0.5 hover:shadow-md hover:shadow-purple-500/30 active:translate-y-0 active:scale-95 flex-shrink-0"
                  aria-label="Send"
                >
                  <FiSend className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[11px] text-gray-400 mt-2 text-center">
                <kbd className="px-1.5 py-0.5 rounded bg-white border border-gray-200 text-[10px] font-mono">Enter</kbd> to send ·{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-white border border-gray-200 text-[10px] font-mono">Shift + Enter</kbd> for newline
              </p>
            </div>
          </div>
        </section>

        {/* Side: chat history */}
        <aside className="col-span-12 lg:col-span-4 lg:h-[calc(100vh-112px)] min-h-[560px] px-6 lg:px-0 pb-6 lg:pb-0">
          <ChatSidebar
            chats={chats}
            activeId={activeId}
            onSelect={handleSelectChat}
            onNewChat={handleNewChat}
            onDeleteChat={handleDeleteChat}
            onQuickTopic={handleSubmit}
          />
        </aside>
      </div>
    </div>
  );
};

export default AIChat;
