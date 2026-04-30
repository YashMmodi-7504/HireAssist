import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import {
  FiGrid,
  FiActivity,
  FiLayers,
  FiUserCheck,
  FiUsers,
  FiBriefcase,
  FiBarChart2,
  FiMessageSquare,
} from "react-icons/fi";

const NAV = [
  { id: "dashboard",   label: "Dashboard",           icon: FiGrid,          route: "/director" },
  { id: "analytics",   label: "Analytics Overview",  icon: FiActivity,      route: "/director/analytics" },
  { id: "batches",     label: "Batch Performance",   icon: FiLayers,        route: "/director/batches" },
  { id: "trainers",    label: "Trainer Performance", icon: FiUserCheck,     route: "/director/trainers" },
  { id: "students",    label: "Student Insights",    icon: FiUsers,         route: "/director/students" },
  { id: "placement",   label: "Placement Analytics", icon: FiBriefcase,     route: "/director/placement" },
  { id: "reports",     label: "Reports",             icon: FiBarChart2,     route: "/director/reports" },
  { id: "feedback",    label: "Feedback Insights",   icon: FiMessageSquare, route: "/director/feedback" },
];

const initialsOf = (name) =>
  (name || "?")
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

const DirectorSidebar = ({ activeMenu, setActiveMenu }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const displayName = user?.name || "Director";

  const handleClick = (item) => {
    setActiveMenu(item.id);
    if (item.route) navigate(item.route);
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-[#6D28D9] to-[#4C1D95] flex flex-col overflow-y-auto backdrop-blur-md">
      {/* Logo + Brand */}
      <div className="px-4 py-3 flex items-center gap-3 border-b border-white/10 flex-shrink-0">
        <img
          src="/logo.png"
          alt="HireAssist"
          className="w-8 h-8 object-contain rounded-lg flex-shrink-0"
          onError={(e) => {
            const fallback = document.createElement("div");
            fallback.className =
              "w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-sm flex-shrink-0";
            fallback.textContent = "H";
            e.target.replaceWith(fallback);
          }}
        />
        <div className="min-w-0">
          <h1 className="text-base font-semibold text-white leading-tight">HireAssist</h1>
          <p className="text-[11px] text-white/70 mt-0.5">Director Console</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="text-white/60 text-[10px] font-bold tracking-widest px-3 mb-2 uppercase">
          Insights
        </p>
        <ul className="space-y-1">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = activeMenu === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => handleClick(item)}
                  className={`group relative w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-white/20 text-white shadow-inner backdrop-blur-sm"
                      : "text-white/85 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span
                    className={`absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] bg-white rounded-r-full transition-opacity duration-200 ${
                      active ? "opacity-100" : "opacity-0"
                    }`}
                    aria-hidden="true"
                  />
                  <Icon className={`w-4 h-4 flex-shrink-0 ${active ? "opacity-100" : "opacity-80"}`} />
                  <span className="flex-1 text-left truncate">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Read-only badge above profile card */}
      <div className="px-3 py-4 border-t border-white/10 space-y-3 flex-shrink-0">
        <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-white/25 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
              {initialsOf(displayName)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm truncate leading-tight">{displayName}</p>
              <p className="text-white/70 text-[11px] mt-0.5">Director</p>
            </div>
          </div>
          <p className="text-[10px] text-white/70 bg-white/10 border border-white/15 rounded px-2 py-1 text-center">
            Read-only · Analytics access
          </p>
        </div>
        <p className="text-center text-white/50 text-[10px] font-medium">© 2026 HireAssist</p>
      </div>
    </div>
  );
};

export default DirectorSidebar;
