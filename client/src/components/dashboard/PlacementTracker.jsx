import React from "react";
import { FiSend, FiCheckCircle, FiXCircle } from "react-icons/fi";

const statusBadge = {
  Applied: "text-blue-700 bg-blue-50",
  Shortlisted: "text-green-700 bg-green-50",
  Rejected: "text-red-700 bg-red-50",
  Interview: "text-purple-700 bg-purple-50",
};

const PlacementTracker = ({ stats = {}, recent = [] }) => {
  const tiles = [
    {
      label: "Applied",
      value: stats.applied ?? 0,
      icon: FiSend,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Shortlisted",
      value: stats.shortlisted ?? 0,
      icon: FiCheckCircle,
      color: "text-green-600 bg-green-50",
    },
    {
      label: "Rejected",
      value: stats.rejected ?? 0,
      icon: FiXCircle,
      color: "text-red-600 bg-red-50",
    },
  ];

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 h-full">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-gray-900">Placement Tracker</h3>
        <p className="text-xs text-gray-500 mt-0.5">Track your applications</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {tiles.map((t) => {
          const Icon = t.icon;
          return (
            <div key={t.label} className="border border-gray-100 rounded-xl p-3">
              <div className={`inline-flex p-1.5 rounded ${t.color} mb-2`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <p className="text-xl font-semibold text-gray-900 leading-none">{t.value}</p>
              <p className="text-[11px] text-gray-500 uppercase tracking-wider mt-1.5">
                {t.label}
              </p>
            </div>
          );
        })}
      </div>

      <div>
        <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-3">
          Recent
        </p>
        <div className="space-y-2.5">
          {recent.length === 0 && (
            <p className="text-sm text-gray-500">No recent applications</p>
          )}
          {recent.map((r) => (
            <div key={r.id} className="flex items-center justify-between gap-3">
              <span className="text-sm text-gray-800 truncate">{r.company}</span>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                  statusBadge[r.status] || "text-gray-700 bg-gray-50"
                }`}
              >
                {r.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlacementTracker;
