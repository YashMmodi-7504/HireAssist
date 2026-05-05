import React from "react";
import {
  FaTh,
  FaBook,
  FaClipboardCheck,
  FaUsers,
  FaComments,
  FaQuestionCircle,
  FaSignOutAlt,
  FaChartLine,
  FaStar,
} from "react-icons/fa";

const PremiumSidebar = ({ activeMenu, setActiveMenu, onLogout }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: FaTh },
    { id: "courses", label: "My Courses", icon: FaBook },
    { id: "assessments", label: "Assessments", icon: FaClipboardCheck },
    { id: "analytics", label: "Analytics", icon: FaChartLine },
    { id: "community", label: "Community", icon: FaUsers },
    { id: "support", label: "Support", icon: FaComments },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900 text-white flex flex-col shadow-2xl z-40">
      {/* Logo */}
      <div className="p-6 border-b border-purple-700/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center font-bold text-lg">
            ✨
          </div>
          <div>
            <h1 className="font-bold text-lg">LearnPro</h1>
            <p className="text-xs text-purple-300">Master Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = activeMenu === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? "bg-white/15 border-l-2 border-blue-400 backdrop-blur-md shadow-lg scale-105"
                  : "text-purple-200 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className={`text-lg ${isActive ? "text-blue-300" : ""}`} />
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-purple-700/50 space-y-4">
        <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-lg backdrop-blur-sm">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500" />
          <div className="flex-1 text-sm">
            <p className="font-semibold">Yash Sharma</p>
            <p className="text-purple-300 text-xs">Premium Member</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-4 py-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-200 transition-all duration-300"
        >
          <FaSignOutAlt className="text-sm" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default PremiumSidebar;
