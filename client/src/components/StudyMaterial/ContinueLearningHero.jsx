import React from "react";
import { FiPlay, FiClock } from "react-icons/fi";
import GradientButton from "../ui/GradientButton";
import ProgressBar from "../ui/ProgressBar";

const ContinueLearningHero = ({ item, onResume }) => {
  if (!item) return null;

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-indigo-50 border border-purple-100 rounded-2xl shadow-sm p-6 lg:p-8">
      <div
        className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-purple-300/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-indigo-300/15 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] uppercase tracking-wider text-purple-700 font-semibold">
            Continue Learning
          </p>
          <h2 className="text-xl lg:text-2xl font-semibold text-gray-900 mt-1.5 leading-snug">
            {item.title}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {item.subject}
            {item.module ? ` · ${item.module}` : ""}
          </p>

          <div className="mt-5 max-w-md">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-gray-500">Progress</span>
              <span className="text-xs font-semibold text-gray-700">
                {item.progress}%
              </span>
            </div>
            <ProgressBar value={item.progress} color="gradient" />
          </div>
        </div>

        <div className="flex-shrink-0 flex flex-col items-stretch lg:items-end gap-2">
          <GradientButton onClick={() => onResume?.(item)} size="lg" variant="primary">
            <FiPlay className="w-4 h-4" />
            Resume
          </GradientButton>
          {item.timeLeft && (
            <p className="text-xs text-gray-500 inline-flex items-center gap-1.5 self-end">
              <FiClock className="w-3 h-3" />
              {item.timeLeft}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContinueLearningHero;
