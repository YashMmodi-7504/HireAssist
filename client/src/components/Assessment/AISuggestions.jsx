import React from "react";
import { FiCpu, FiArrowRight } from "react-icons/fi";
import GradientButton from "../ui/GradientButton";

const AISuggestions = ({ suggestion, onAct }) => {
  if (!suggestion) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 via-white to-indigo-50 shadow-sm">
      {/* Soft accent glow */}
      <div
        className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full bg-purple-300/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-indigo-300/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-start gap-4 min-w-0">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-sm flex-shrink-0">
            <FiCpu className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-wider text-purple-700 font-semibold">
              AI Suggestion
            </p>
            <p className="text-sm md:text-base font-semibold text-gray-900 mt-1 leading-snug">
              {suggestion.headline}
            </p>
            {suggestion.detail && (
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                {suggestion.detail}
              </p>
            )}
          </div>
        </div>

        {suggestion.cta && (
          <div className="flex-shrink-0">
            <GradientButton onClick={onAct} size="md" variant="primary">
              {suggestion.cta}
              <FiArrowRight className="w-3.5 h-3.5" />
            </GradientButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default AISuggestions;
