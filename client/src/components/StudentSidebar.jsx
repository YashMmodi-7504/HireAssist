import React from "react";
import {
  FaTh,
  FaBook,
  FaClipboardCheck,
  FaUsers,
  FaComments,
  FaQuestionCircle,
  FaSignOutAlt,
} from "react-icons/fa";

const StudentSidebar = ({ activeMenu, setActiveMenu, onLogout }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: FaTh },
    { id: "courses", label: "Courses", icon: FaBook },
    { id: "assessments", label: "Assessments", icon: FaClipboardCheck },
    { id: "community", label: "Community", icon: FaUsers },
    { id: "support", label: "Support", icon: FaComments },
    { id: "faq", label: "FAQ", icon: FaQuestionCircle },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-purple-700 to-purple-900 text-white flex flex-col fixed h-screen shadow-lg">
      <div className="p-6 font-bold text-2xl bg-purple-800/50 border-b border-purple-600">
        🎓 HireAssist
      </div>

      <nav className="flex-1 px-4 space-y-2 py-6">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveMenu(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeMenu === item.id
                ? "bg-white/25 border-l-4 border-white font-semibold"
                : "hover:bg-white/10 text-gray-100"
            }`}
          >
            <item.icon className="text-lg" />
            {item.label}
          </button>
        ))}
      </nav>

      <button
        onClick={onLogout}
        className="m-4 p-3 bg-red-500/80 hover:bg-red-600 rounded-lg flex items-center gap-2 transition-all"
      >
        <FaSignOutAlt />
        Logout
      </button>
    </div>
  );
};

export default StudentSidebar;
