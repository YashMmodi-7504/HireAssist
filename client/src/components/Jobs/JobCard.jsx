import React from "react";
import { FiMapPin, FiDownload, FiArrowRight, FiBriefcase } from "react-icons/fi";

const JobCard = ({ job, onApply, onDownload }) => {
  const j = job || {};
  const isOpen = j.status === "open";

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-[0_12px_32px_-12px_rgba(124,58,237,0.18)] hover:border-purple-100 hover:scale-[1.005] transition-all duration-200 cursor-default">
      {/* Top row: title + company  ·  status pill */}
      <div className="flex justify-between items-start gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-gray-900 leading-snug">
            {j.title || "Untitled Role"}
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {j.company || "—"}
            {j.postedAgo ? ` · ${j.postedAgo}` : ""}
          </p>
        </div>
        <span
          className={`flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border ${
            isOpen
              ? "bg-green-50 text-green-700 border-green-100"
              : "bg-gray-100 text-gray-600 border-gray-200"
          }`}
        >
          {isOpen ? "Open" : "Closed"}
        </span>
      </div>

      {/* Meta badges */}
      <div className="flex flex-wrap gap-2 mt-3 text-xs">
        {j.eligibility && (
          <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md font-medium">
            {j.eligibility}
          </span>
        )}
        {j.type && (
          <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2.5 py-1 rounded-md font-medium">
            <FiBriefcase className="w-3 h-3" />
            {j.type}
          </span>
        )}
        {j.location && (
          <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md font-medium">
            <FiMapPin className="w-3 h-3" />
            {j.location}
          </span>
        )}
      </div>

      {/* Compensation */}
      {j.stipend && (
        <p className="text-sm font-semibold text-green-600 mt-3">{j.stipend}</p>
      )}

      {/* Description */}
      {j.description && (
        <p className="text-sm text-gray-600 mt-3 leading-relaxed">
          {j.description}
        </p>
      )}

      {/* Skills */}
      {Array.isArray(j.skills) && j.skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {j.skills.map((skill) => (
            <span
              key={skill}
              className="bg-purple-50 text-purple-700 px-2 py-1 rounded-md text-xs font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-2 mt-5">
        <button
          type="button"
          onClick={() => onDownload?.(j)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors duration-200"
        >
          <FiDownload className="w-3.5 h-3.5" />
          Download JD
        </button>
        <button
          type="button"
          onClick={() => onApply?.(j)}
          disabled={!isOpen}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg shadow-sm hover:shadow-[0_8px_24px_-6px_rgba(124,58,237,0.45)] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-sm"
        >
          {isOpen ? "Apply" : "Closed"}
          {isOpen && <FiArrowRight className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};

export default JobCard;
