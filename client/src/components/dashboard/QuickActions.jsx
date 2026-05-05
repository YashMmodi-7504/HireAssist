import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FiPlayCircle,
  FiClipboard,
  FiCalendar,
  FiBriefcase,
} from "react-icons/fi";

const accentMap = {
  purple: "text-purple-600 bg-purple-50 group-hover:bg-purple-100",
  blue: "text-blue-600 bg-blue-50 group-hover:bg-blue-100",
  green: "text-green-600 bg-green-50 group-hover:bg-green-100",
  amber: "text-amber-600 bg-amber-50 group-hover:bg-amber-100",
};

const ACTIONS = [
  {
    icon: FiPlayCircle,
    label: "Resume Course",
    desc: "Continue where you left off",
    route: "/student",
    accent: "purple",
  },
  {
    icon: FiClipboard,
    label: "Take Assessment",
    desc: "Test your knowledge",
    route: "/student/assessment",
    accent: "blue",
  },
  {
    icon: FiCalendar,
    label: "View Attendance",
    desc: "Check class records",
    route: "/student/attendance",
    accent: "green",
  },
  {
    icon: FiBriefcase,
    label: "Apply for Jobs",
    desc: "Explore openings",
    route: "/student",
    accent: "amber",
  },
];

const QuickActions = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {ACTIONS.map((a) => {
          const Icon = a.icon;
          return (
            <button
              key={a.label}
              type="button"
              onClick={() => navigate(a.route)}
              className="group text-left bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-[0_12px_32px_-12px_rgba(124,58,237,0.22)] hover:-translate-y-0.5 hover:border-purple-200 active:scale-[0.99] transition-all duration-200 p-6"
            >
              <div className={`inline-flex p-3 rounded-xl transition-colors duration-200 ${accentMap[a.accent]}`}>
                <Icon className="w-7 h-7" />
              </div>
              <p className="mt-5 text-base font-semibold text-gray-900 tracking-tight">{a.label}</p>
              <p className="mt-1 text-sm text-gray-500">{a.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
