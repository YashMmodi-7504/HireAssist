import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import {
  FiGrid,
  FiUsers,
  FiList,
  FiUserPlus,
  FiUserX,
  FiMessageSquare,
  FiLayers,
  FiPlusCircle,
  FiEye,
  FiBookOpen,
  FiCheckSquare,
  FiCode,
  FiCalendar,
  FiVideo,
  FiBook,
  FiClipboard,
  FiFileText,
  FiBriefcase,
  FiChevronDown,
} from "react-icons/fi";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: FiGrid, route: "/trainer" },
  {
    id: "users",
    label: "User",
    icon: FiUsers,
    route: "/trainer/users",
    children: [
      { id: "users-all", label: "All Users", icon: FiList, route: "/trainer/users" },
      { id: "users-registrations", label: "Student Registrations", icon: FiUserPlus, route: "/trainer/users/registrations" },
      { id: "users-dropout", label: "Dropout Students", icon: FiUserX, route: "/trainer/users/dropout" },
    ],
  },
  { id: "feedback", label: "View Feedback", icon: FiMessageSquare, route: "/trainer/feedback" },
  {
    id: "batch",
    label: "Batch Details",
    icon: FiLayers,
    route: "/trainer/batch/view",
    children: [
      { id: "batch-add", label: "Add Batch", icon: FiPlusCircle, route: "/trainer/batch/add" },
      { id: "batch-view", label: "View Batch", icon: FiEye, route: "/trainer/batch/view" },
    ],
  },
  { id: "module-tracker", label: "Module Tracker", icon: FiBookOpen, route: "/trainer/module-tracker" },
  { id: "course-access", label: "Approve Course Access", icon: FiCheckSquare, route: "/trainer/course-access" },
  { id: "capstone", label: "Capstone Project", icon: FiCode, route: "/trainer/capstone" },
  { id: "attendance", label: "Attendance", icon: FiCalendar, route: "/trainer/attendance" },
  { id: "interview", label: "Schedule Interview", icon: FiVideo, route: "/trainer/interview" },
  { id: "course", label: "Course", icon: FiBook, route: "/trainer/course" },
  { id: "assessment", label: "Assessment", icon: FiClipboard, route: "/trainer/assessment" },
  { id: "sdp", label: "SDP Report", icon: FiFileText, route: "/trainer/sdp" },
  { id: "placement", label: "Placement Readiness", icon: FiBriefcase, route: "/trainer/placement" },
];

const ROLE_LABELS = {
  student: "Student",
  trainer: "Trainer",
  admin: "Admin",
  director: "Director",
};

const initialsOf = (name) =>
  (name || "?")
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

const TrainerSidebar = ({ activeMenu, setActiveMenu }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const displayName = user?.name || "Trainer";
  const displayRole = ROLE_LABELS[user?.role] || "Trainer";

  const handleClick = (item) => {
    setActiveMenu(item.id);
    if (item.route) navigate(item.route);
  };

  const renderItem = (item) => {
    const Icon = item.icon;
    const hasChildren = Array.isArray(item.children) && item.children.length > 0;
    const sectionActive =
      activeMenu === item.id ||
      (hasChildren && item.children.some((c) => c.id === activeMenu));

    return (
      <li key={item.id}>
        <button
          type="button"
          onClick={() => handleClick(item)}
          className={`group relative w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            sectionActive
              ? "bg-white/20 text-white shadow-inner backdrop-blur-sm"
              : "text-white/85 hover:bg-white/10 hover:text-white"
          }`}
        >
          <span
            className={`absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] bg-white rounded-r-full transition-opacity duration-200 ${
              sectionActive ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden="true"
          />
          <Icon
            className={`w-4 h-4 flex-shrink-0 ${
              sectionActive ? "opacity-100" : "opacity-80"
            }`}
          />
          <span className="flex-1 text-left truncate">{item.label}</span>
          {hasChildren && (
            <FiChevronDown
              className={`w-3.5 h-3.5 flex-shrink-0 opacity-70 transition-transform duration-200 ${
                sectionActive ? "rotate-180" : ""
              }`}
            />
          )}
        </button>

        {hasChildren && sectionActive && (
          <ul className="mt-1 ml-3 pl-3 border-l border-white/20 space-y-1">
            {item.children.map((child) => {
              const childActive = activeMenu === child.id;
              const ChildIcon = child.icon;
              return (
                <li key={child.id}>
                  <button
                    type="button"
                    onClick={() => handleClick(child)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                      childActive
                        ? "bg-white/20 text-white shadow-inner"
                        : "text-white/75 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {ChildIcon && (
                      <ChildIcon
                        className={`w-3.5 h-3.5 flex-shrink-0 ${
                          childActive ? "opacity-100" : "opacity-75"
                        }`}
                      />
                    )}
                    <span className="truncate">{child.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </li>
    );
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
          <h1 className="text-base font-semibold text-white leading-tight">
            HireAssist
          </h1>
          <p className="text-[11px] text-white/70 mt-0.5">Trainer Console</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="text-white/60 text-[10px] font-bold tracking-widest px-3 mb-2 uppercase">
          Workspace
        </p>
        <ul className="space-y-1">{NAV.map(renderItem)}</ul>
      </nav>

      {/* Footer profile card */}
      <div className="px-3 py-4 border-t border-white/10 space-y-3 flex-shrink-0">
        <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/25 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
              {initialsOf(displayName)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm truncate leading-tight">
                {displayName}
              </p>
              <p className="text-white/70 text-[11px] mt-0.5">{displayRole}</p>
            </div>
          </div>
        </div>
        <p className="text-center text-white/50 text-[10px] font-medium">
          © 2026 HireAssist
        </p>
      </div>
    </div>
  );
};

export default TrainerSidebar;
