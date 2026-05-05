import React from "react";
import { FaCode, FaGlobe, FaBrain, FaLayerGroup, FaProjectDiagram } from "react-icons/fa";

const gradientMap = {
  Python: "from-blue-500 to-cyan-500",
  "Web Development": "from-purple-500 to-indigo-500",
  "Machine Learning": "from-rose-500 to-pink-500",
  "Deep Learning": "from-amber-500 to-orange-500",
  DSA: "from-emerald-500 to-teal-500",
};

const iconMap = {
  Python: FaCode,
  "Web Development": FaGlobe,
  "Machine Learning": FaBrain,
  "Deep Learning": FaLayerGroup,
  DSA: FaProjectDiagram,
};

const SubjectCard = ({ name, modules = 0, progress = 0, onOpen }) => {
  const gradient = gradientMap[name] || "from-purple-500 to-indigo-500";
  const Icon = iconMap[name] || FaCode;

  return (
    <button
      type="button"
      onClick={() => onOpen?.(name)}
      className={`group relative overflow-hidden rounded-2xl p-5 text-left text-white bg-gradient-to-br ${gradient} shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-[0.99] transition-all duration-200`}
    >
      <div
        className="pointer-events-none absolute -top-10 -right-10 w-36 h-36 rounded-full bg-white/15 blur-2xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-12 -left-8 w-28 h-28 rounded-full bg-white/10 blur-2xl"
        aria-hidden="true"
      />

      <div className="relative flex items-start justify-between mb-5">
        <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm">
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-wider bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded">
          {modules} modules
        </span>
      </div>

      <h3 className="relative text-lg font-semibold mb-4 leading-snug">{name}</h3>

      <div className="relative">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-white/80">Progress</span>
          <span className="text-xs font-semibold">{progress}%</span>
        </div>
        <div className="h-1.5 bg-white/25 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </button>
  );
};

export default SubjectCard;
