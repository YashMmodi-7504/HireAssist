import React from "react";
import { FiAward, FiDownload } from "react-icons/fi";

const gradientByVariant = {
  blue: "from-blue-500 to-purple-600",
  purple: "from-purple-500 to-indigo-600",
  green: "from-emerald-500 to-teal-600",
  orange: "from-orange-500 to-amber-600",
};

const CertificateCard = ({ certificate, onDownload, variant = "blue" }) => {
  const c = certificate || {};
  const isAvailable = c.status === "available";
  const gradient = gradientByVariant[variant] || gradientByVariant.blue;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-md hover:shadow-xl hover:scale-[1.02] hover:brightness-105 transition-all duration-300 bg-gradient-to-br ${gradient} flex flex-col`}
    >
      <div
        className="pointer-events-none absolute -top-12 -right-12 w-44 h-44 rounded-full bg-white/15 blur-2xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-12 -left-8 w-32 h-32 rounded-full bg-white/10 blur-2xl"
        aria-hidden="true"
      />

      <div className="relative flex items-start justify-between mb-6">
        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
          <FiAward className="w-6 h-6" />
        </div>
        <span
          className={`text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm border border-white/25 ${
            isAvailable ? "bg-white/25 text-white" : "bg-white/10 text-white/75"
          }`}
        >
          {isAvailable ? "Available" : "Coming Soon"}
        </span>
      </div>

      <p className="relative text-[11px] uppercase tracking-wider text-white/80 font-semibold">
        Academic Year
      </p>
      <h3 className="relative text-2xl font-bold mt-1 leading-none">{c.year}</h3>
      <p className="relative text-sm text-white/90 mt-2">
        {c.program || "Course Completion"}
      </p>
      {c.issuedOn && (
        <p className="relative text-xs text-white/70 mt-1">
          Issued · {c.issuedOn}
        </p>
      )}

      <div className="flex-1" />

      <button
        type="button"
        onClick={() => onDownload?.(c)}
        disabled={!isAvailable}
        className="relative mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-purple-700 bg-white rounded-lg shadow-sm hover:bg-gray-50 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-white"
      >
        <FiDownload className="w-3.5 h-3.5" />
        {isAvailable ? "Download Certificate" : "Not Available Yet"}
      </button>
    </div>
  );
};

export default CertificateCard;
