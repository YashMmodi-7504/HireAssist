import React from "react";
import { FiMessageSquare, FiPlus, FiTrash2 } from "react-icons/fi";

const QUICK_TOPICS = [
  { label: "DSA", prompt: "Explain Data Structures & Algorithms simply." },
  { label: "ML", prompt: "Give me an overview of Machine Learning." },
  { label: "Deep Learning", prompt: "Explain Deep Learning with an example." },
  { label: "SAP", prompt: "What is SAP S/4HANA?" },
  { label: "Resume", prompt: "Help me build a strong resume." },
  { label: "Interview", prompt: "How do I prepare for technical interviews?" },
];

const relativeTime = (ts) => {
  if (!ts) return "";
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.floor(hr / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(ts).toLocaleDateString();
};

const ChatSidebar = ({
  chats = [],
  activeId,
  onSelect,
  onNewChat,
  onDeleteChat,
  onQuickTopic,
}) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col h-full overflow-hidden">
      {/* New chat */}
      <div className="p-3 border-b border-gray-100">
        <button
          type="button"
          onClick={onNewChat}
          className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-semibold py-2.5 rounded-xl shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <FiPlus className="w-4 h-4" />
          New chat
        </button>
      </div>

      {/* Quick topics — one-tap jump-starts for common questions */}
      {onQuickTopic && (
        <div className="px-3 py-3 border-b border-gray-100">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-1 mb-2">
            Quick topics
          </p>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_TOPICS.map((t) => (
              <button
                key={t.label}
                type="button"
                onClick={() => onQuickTopic(t.prompt)}
                className="text-[11px] font-semibold text-gray-700 bg-gray-50 hover:bg-purple-50 hover:text-purple-700 border border-gray-200 hover:border-purple-200 rounded-full px-2.5 py-1 transition-all hover:-translate-y-0.5"
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-2 py-1.5">
          History
        </p>
        {chats.length === 0 && (
          <p className="text-xs text-gray-500 px-2 py-3">No conversations yet.</p>
        )}
        <ul className="space-y-1">
          {chats.map((chat) => {
            const active = chat.id === activeId;
            return (
              <li key={chat.id}>
                <div
                  className={`group/row relative flex items-start gap-2 rounded-lg px-2.5 py-2 transition-colors ${
                    active
                      ? "bg-purple-50 text-purple-900"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onSelect?.(chat.id)}
                    className="flex-1 min-w-0 text-left flex items-start gap-2"
                  >
                    <FiMessageSquare
                      className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${
                        active ? "text-purple-600" : "text-gray-400"
                      }`}
                    />
                    <div className="min-w-0">
                      <p
                        className={`text-sm font-medium truncate ${
                          active ? "text-purple-900" : "text-gray-800"
                        }`}
                      >
                        {chat.title || "New chat"}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {relativeTime(chat.updatedAt)}
                      </p>
                    </div>
                  </button>
                  {onDeleteChat && chats.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(chat.id);
                      }}
                      aria-label="Delete chat"
                      className="opacity-0 group-hover/row:opacity-100 inline-flex items-center justify-center w-6 h-6 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all flex-shrink-0"
                    >
                      <FiTrash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="px-3 py-2.5 border-t border-gray-100">
        <p className="text-[10px] text-gray-400 text-center">
          History stays on this device
        </p>
      </div>
    </div>
  );
};

export default ChatSidebar;
