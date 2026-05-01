import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import BrandMark from "./branding/BrandMark";
import {
  FiGrid,
  FiClipboard,
  FiCalendar,
  FiBookOpen,
  FiBriefcase,
  FiFileText,
  FiAward,
  FiUsers,
  FiMessageSquare,
  FiLifeBuoy,
  FiPlusCircle,
  FiInbox,
  FiChevronDown,
  FiCpu,
} from "react-icons/fi";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: FiGrid, route: "/student" },
  { id: "assessment", label: "Assessment", icon: FiClipboard, route: "/student/assessment" },
  { id: "attendance", label: "View Attendance", icon: FiCalendar, route: "/student/attendance" },
  { id: "materials", label: "Study Material", icon: FiBookOpen, route: "/student/material" },
  { id: "ai-chat", label: "AI Assistant", icon: FiCpu, route: "/student/ai" },
  { id: "placement", label: "Placement Form", icon: FiBriefcase, route: "/student/placement" },
  { id: "jobs", label: "Apply Jobs", icon: FiFileText, route: "/student/jobs" },
  { id: "certificate", label: "Download Certificate", icon: FiAward, route: "/student/certificate" },
  { id: "alumni", label: "Alumni Registration", icon: FiUsers, route: "/student/alumni" },
  { id: "feedback", label: "Feedback", icon: FiMessageSquare, route: "/student/feedback" },
  {
    id: "ticket",
    label: "Raise a Ticket",
    icon: FiLifeBuoy,
    route: "/student/ticket",
    children: [
      { id: "ticket-create", label: "Create Ticket", icon: FiPlusCircle, route: "/student/ticket" },
      { id: "ticket-queries", label: "My Queries", icon: FiInbox, route: "/student/ticket/queries" },
    ],
  },
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

const LightPurpleSidebar = ({ activeMenu, setActiveMenu }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const displayName = user?.name || "Student";
  const displayRole = ROLE_LABELS[user?.role] || "Student";

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
          {/* Left active indicator bar */}
          <span
            className={`absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] bg-white rounded-r-full transition-opacity duration-200 ${
              sectionActive ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden="true"
          />
          <Icon
            className={`w-5 h-5 flex-shrink-0 ${
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
      <div className="px-4 py-4 border-b border-white/10 flex-shrink-0">
        <BrandMark size="md" theme="light" withIcon tagline="Student Console" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 overflow-y-auto">
        <p className="text-white/60 text-[10px] font-bold tracking-widest px-3 mb-3 uppercase">
          Navigation
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

export default LightPurpleSidebar;
