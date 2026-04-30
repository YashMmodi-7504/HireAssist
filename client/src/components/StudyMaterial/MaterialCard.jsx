import React, { useState } from "react";
import {
  FiPlay,
  FiFile,
  FiBookOpen,
  FiClipboard,
  FiBookmark,
  FiDownload,
  FiArrowRight,
} from "react-icons/fi";
import ProgressBar from "../ui/ProgressBar";

const typeConfig = {
  video: {
    icon: FiPlay,
    label: "Video",
    className: "text-purple-700 bg-purple-50 border-purple-100",
  },
  pdf: {
    icon: FiFile,
    label: "PDF",
    className: "text-red-700 bg-red-50 border-red-100",
  },
  notes: {
    icon: FiBookOpen,
    label: "Notes",
    className: "text-blue-700 bg-blue-50 border-blue-100",
  },
  assignment: {
    icon: FiClipboard,
    label: "Assignment",
    className: "text-orange-700 bg-orange-50 border-orange-100",
  },
};

const MaterialCard = ({ material, onOpen, onDownload, onBookmark }) => {
  const m = material || {};
  const cfg = typeConfig[m.type] || typeConfig.notes;
  const TypeIcon = cfg.icon;
  const [bookmarked, setBookmarked] = useState(!!m.bookmarked);

  const progress = m.progress ?? 0;
  const isCompleted = progress >= 100;
  const isInProgress = progress > 0 && !isCompleted;

  const ctaLabel = isCompleted ? "Review" : isInProgress ? "Continue" : "Open";

  const handleBookmark = (e) => {
    e.stopPropagation();
    const next = !bookmarked;
    setBookmarked(next);
    onBookmark?.(m, next);
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    onDownload?.(m);
  };

  return (
    <div className="group bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-[0_12px_32px_-12px_rgba(124,58,237,0.18)] hover:border-purple-200 hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
      {/* Top: type badge + bookmark/download */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded uppercase tracking-wide border ${cfg.className}`}
        >
          <TypeIcon className="w-3 h-3" />
          {cfg.label}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleBookmark}
            className={`p-1.5 rounded-md transition-colors duration-200 ${
              bookmarked
                ? "text-amber-500 hover:bg-amber-50"
                : "text-gray-400 hover:text-amber-500 hover:bg-gray-50"
            }`}
            aria-label={bookmarked ? "Remove bookmark" : "Bookmark"}
            aria-pressed={bookmarked}
          >
            <FiBookmark
              className={`w-4 h-4 ${bookmarked ? "fill-current" : ""}`}
            />
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="p-1.5 rounded-md text-gray-400 hover:text-purple-600 hover:bg-gray-50 transition-colors duration-200"
            aria-label="Download"
          >
            <FiDownload className="w-4 h-4" />
          </button>
        </div>
      </div>

      <h3 className="text-base font-semibold text-gray-900 leading-snug">
        {m.title || "Untitled"}
      </h3>
      {m.subject && (
        <p className="text-xs text-gray-500 mt-0.5">{m.subject}</p>
      )}

      {/* Meta row */}
      {(m.duration || m.pages) && (
        <div className="flex items-center gap-3 mt-3 text-xs text-gray-600">
          {m.duration && <span>{m.duration}</span>}
          {m.pages && <span>{m.pages} pages</span>}
        </div>
      )}

      {/* Progress (only when started) */}
      {(isInProgress || isCompleted) && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-gray-500">
              {isCompleted ? "Completed" : "Progress"}
            </span>
            <span className="text-xs font-semibold text-gray-700">
              {progress}%
            </span>
          </div>
          <ProgressBar value={progress} color={isCompleted ? "green" : "purple"} />
        </div>
      )}

      <div className="flex-1" />

      <button
        type="button"
        onClick={() => onOpen?.(m)}
        className="mt-5 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg shadow-sm hover:shadow-[0_8px_24px_-6px_rgba(124,58,237,0.45)] transition-all duration-200 active:scale-[0.98]"
      >
        {ctaLabel}
        <FiArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default MaterialCard;
