import React from "react";

const colorFor = (value) => {
  if (value >= 85) return "bg-green-500";
  if (value >= 70) return "bg-purple-500";
  if (value >= 50) return "bg-blue-500";
  return "bg-amber-500";
};

const SkillDistribution = ({ skills = [] }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 h-full">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-gray-900">Skill Distribution</h3>
        <p className="text-xs text-gray-500 mt-0.5">Performance by skill area</p>
      </div>

      <div className="space-y-4">
        {skills.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-8">No skill data yet</p>
        )}
        {skills.map((s) => (
          <div key={s.name}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-gray-700">{s.name}</span>
              <span className="text-xs font-semibold text-gray-500">{s.value}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${colorFor(s.value)} rounded-full transition-all duration-500`}
                style={{ width: `${s.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillDistribution;
