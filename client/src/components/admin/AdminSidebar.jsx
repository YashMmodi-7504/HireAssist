import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import BrandMark from "../branding/BrandMark";
import {
  FiGrid,
  FiUsers,
  FiList,
  FiBriefcase,
  FiBookOpen,
  FiAward,
  FiUserX,
  FiLayers,
  FiPlusCircle,
  FiEye,
  FiBook,
  FiSend,
  FiClipboard,
  FiCalendar,
  FiCode,
  FiMessageSquare,
  FiBarChart2,
  FiTrendingUp,
  FiSettings,
  FiChevronDown,
} from "react-icons/fi";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: FiGrid, route: "/admin" },
  {
    id: "users",
    label: "User Management",
    icon: FiUsers,
    route: "/admin/users",
    children: [
      { id: "users-all", label: "All Users", icon: FiList, route: "/admin/users" },
      { id: "users-trainers", label: "Trainers", icon: FiBriefcase, route: "/admin/users/trainers" },
      { id: "users-students", label: "Students", icon: FiBookOpen, route: "/admin/users/students" },
      { id: "users-directors", label: "Directors", icon: FiAward, route: "/admin/users/directors" },
      { id: "users-blocked", label: "Blocked Users", icon: FiUserX, route: "/admin/users/blocked" },
    ],
  },
  {
    id: "batch",
    label: "Batch Management",
    icon: FiLayers,
    route: "/admin/batch/view",
    children: [
      { id: "batch-create", label: "Create Batch", icon: FiPlusCircle, route: "/admin/batch/create" },
      { id: "batch-view", label: "View Batches", icon: FiEye, route: "/admin/batch/view" },
    ],
  },
  {
    id: "courses",
    label: "Course Management",
    icon: FiBook,
    route: "/admin/courses",
    children: [
      { id: "courses-all", label: "All Courses", icon: FiList, route: "/admin/courses" },
      { id: "courses-create", label: "Create Course", icon: FiPlusCircle, route: "/admin/courses/create" },
      { id: "courses-assign", label: "Assign Course", icon: FiSend, route: "/admin/courses/assign" },
    ],
  },
  { id: "modules", label: "Module Management", icon: FiBookOpen, route: "/admin/modules" },
  {
    id: "assessments",
    label: "Assessment Management",
    icon: FiClipboard,
    route: "/admin/assessments",
    children: [
      { id: "assessments-all", label: "All Assessments", icon: FiList, route: "/admin/assessments" },
      { id: "assessments-create", label: "Create Assessment", icon: FiPlusCircle, route: "/admin/assessments/create" },
      { id: "assessments-assign", label: "Assign Assessment", icon: FiSend, route: "/admin/assessments/assign" },
    ],
  },
  { id: "attendance", label: "Attendance Monitoring", icon: FiCalendar, route: "/admin/attendance" },
  { id: "capstone", label: "Capstone Projects", icon: FiCode, route: "/admin/capstone" },
  { id: "feedback-analytics", label: "Feedback Analytics", icon: FiMessageSquare, route: "/admin/feedback" },
  {
    id: "reports",
    label: "Reports",
    icon: FiBarChart2,
    route: "/admin/reports/students",
    children: [
      { id: "reports-students", label: "Student Reports", icon: FiBookOpen, route: "/admin/reports/students" },
      { id: "reports-trainers", label: "Trainer Reports", icon: FiBriefcase, route: "/admin/reports/trainers" },
      { id: "reports-batches", label: "Batch Reports", icon: FiLayers, route: "/admin/reports/batches" },
    ],
  },
  { id: "placement-analytics", label: "Placement Analytics", icon: FiTrendingUp, route: "/admin/placement" },
  { id: "settings", label: "System Settings", icon: FiSettings, route: "/admin/settings" },
];

const ROLE_LABELS = { admin: "Administrator", trainer: "Trainer", student: "Student", director: "Director" };

const initialsOf = (name) =>
  (name || "?")
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

const AdminSidebar = ({ activeMenu, setActiveMenu }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const displayName = user?.name || "Administrator";
  const displayRole = ROLE_LABELS[user?.role] || "Administrator";

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
          <Icon className={`w-4 h-4 flex-shrink-0 ${sectionActive ? "opacity-100" : "opacity-80"}`} />
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
                      <ChildIcon className={`w-3.5 h-3.5 flex-shrink-0 ${childActive ? "opacity-100" : "opacity-75"}`} />
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
    <div className="w-full h-screen bg-gradient-to-b from-[#7C3AED] via-[#5B21B6] to-[#4C1D95] flex flex-col overflow-y-auto backdrop-blur-md">
      {/* Logo + Brand */}
      <div className="px-4 py-4 border-b border-white/10 flex-shrink-0">
        <BrandMark size="md" theme="light" withIcon tagline="Admin Console" />
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="text-white/60 text-[10px] font-bold tracking-widest px-3 mb-2 uppercase">
          Workspace
        </p>
        <ul className="space-y-1">{NAV.map(renderItem)}</ul>
      </nav>

      <div className="px-3 py-4 border-t border-white/10 space-y-3 flex-shrink-0">
        <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/25 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
              {initialsOf(displayName)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm truncate leading-tight">{displayName}</p>
              <p className="text-white/70 text-[11px] mt-0.5">{displayRole}</p>
            </div>
          </div>
        </div>
        <p className="text-center text-white/50 text-[10px] font-medium">© 2026 HireAssist</p>
      </div>
    </div>
  );
};

export default AdminSidebar;
