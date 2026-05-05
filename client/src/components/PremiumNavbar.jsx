import React, { useState, useRef, useEffect } from "react";
import {
  FaBell,
  FaCog,
  FaSearch,
  FaChevronDown,
  FaClock,
  FaTrophy,
} from "react-icons/fa";

const PremiumNavbar = ({ userName = "Yash", notifications = 3 }) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setNotificationsOpen(false);
        setSettingsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const notificationsList = [
    { id: 1, title: "Module Complete", desc: "Python Basics finished!", time: "2m ago", icon: "🎉" },
    { id: 2, title: "Assignment Due", desc: "Data Structures assignment", time: "2h ago", icon: "⏰" },
    { id: 3, title: "Badge Earned", desc: "7-Day Streak unlocked!", time: "1d ago", icon: "🏆" },
  ];

  return (
    <div className="fixed top-0 left-[280px] right-0 h-20 bg-gradient-to-r from-white/50 via-blue-50/50 to-white/50 backdrop-blur-xl border-b border-slate-200/50 z-30 shadow-sm">
      <div className="h-full px-8 flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 text-sm" />
            <input
              type="text"
              placeholder="Search courses, topics..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white/80 transition-all backdrop-blur-sm text-sm"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6 ml-8" ref={navRef}>
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2.5 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-300 backdrop-blur-sm group"
            >
              <FaBell className="text-purple-700 group-hover:text-purple-600" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
                  {notifications}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 overflow-hidden animate-in fade-in duration-300">
                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
                  <h3 className="font-semibold text-gray-800">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notificationsList.map((notif) => (
                    <div
                      key={notif.id}
                      className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-all cursor-pointer"
                    >
                      <div className="flex gap-3">
                        <span className="text-lg">{notif.icon}</span>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 text-sm">{notif.title}</p>
                          <p className="text-gray-600 text-xs">{notif.desc}</p>
                          <p className="text-gray-400 text-xs mt-1">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-gray-200 text-center">
                  <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="relative">
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className="p-2.5 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-300 backdrop-blur-sm group"
            >
              <FaCog className="text-purple-700 group-hover:text-purple-600" />
            </button>

            {settingsOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 overflow-hidden animate-in fade-in duration-300">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-800">Settings</h3>
                </div>
                <button className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-all">
                  Preferences
                </button>
                <button className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-all border-b border-gray-100">
                  Privacy & Security
                </button>
                <button className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition-all">
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-4 border-l border-white/20">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800">{userName}</p>
              <p className="text-xs text-purple-600">Pro Member</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 shadow-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumNavbar;
