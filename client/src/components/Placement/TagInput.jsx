import React, { useState } from "react";
import { FiX } from "react-icons/fi";

const TagInput = ({
  tags = [],
  onChange,
  placeholder = "Type and press Enter",
  error,
}) => {
  const [draft, setDraft] = useState("");

  const addTag = (value) => {
    const t = value.trim();
    if (!t) return;
    if (tags.includes(t)) return;
    onChange?.([...tags, t]);
    setDraft("");
  };

  const removeTag = (t) => {
    onChange?.(tags.filter((x) => x !== t));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(draft);
    } else if (e.key === "Backspace" && !draft && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div
      className={`px-3 py-2 rounded-lg border bg-white focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500 transition ${
        error ? "border-red-300" : "border-gray-300"
      }`}
    >
      <div className="flex flex-wrap gap-2 items-center">
        {tags.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1.5 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium"
          >
            {t}
            <button
              type="button"
              onClick={() => removeTag(t)}
              className="hover:text-purple-900 transition-colors"
              aria-label={`Remove ${t}`}
            >
              <FiX className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => addTag(draft)}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[140px] outline-none text-sm placeholder:text-gray-400 bg-transparent py-1"
        />
      </div>
    </div>
  );
};

export default TagInput;
