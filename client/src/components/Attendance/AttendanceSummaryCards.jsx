import React from "react";
import { FiCalendar, FiCheckCircle, FiXCircle, FiPercent } from "react-icons/fi";

const AttendanceSummaryCards = ({ stats }) => {
  const { total = 0, present = 0, absent = 0, percentage = 0 } = stats || {};

  const percentColor =
    percentage >= 90 ? "text-green-600" : percentage >= 75 ? "text-amber-600" : "text-red-600";

  const cards = [
    {
      icon: FiCalendar,
      label: "Total Classes",
      value: total,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-100",
      iconBg: "bg-purple-100",
    },
    {
      icon: FiCheckCircle,
      label: "Present",
      value: present,
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-100",
      iconBg: "bg-green-100",
    },
    {
      icon: FiXCircle,
      label: "Absent",
      value: absent,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-100",
      iconBg: "bg-red-100",
    },
    {
      icon: FiPercent,
      label: "Attendance",
      value: `${percentage}%`,
      color: percentColor,
      bg: "bg-blue-50",
      border: "border-blue-100",
      iconBg: "bg-blue-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`${card.bg} border ${card.border} rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2.5 rounded-lg ${card.iconBg}`}>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
            </div>
            <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-2">
              {card.label}
            </p>
            <p className="text-3xl font-bold text-gray-900">{card.value}</p>
          </div>
        );
      })}
    </div>
  );
};

export default AttendanceSummaryCards;
