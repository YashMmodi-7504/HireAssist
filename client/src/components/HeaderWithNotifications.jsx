import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaBell,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaChevronDown,
} from "react-icons/fa";
import { useConfirm } from "./ui/ConfirmDialog";
import { useToast } from "./ui/Toaster";
import { useAuth } from "../auth/AuthContext";

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

const HeaderWithNotifications = ({
  // Optional override; defaults to the signed-in user from AuthContext.
  userName,
  userRole,
  notificationCount = 3,
  onSearch,
  onProfileClick,
  onLogout,
}) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navRef = useRef(null);
  const navigate = useNavigate();
  const { confirm } = useConfirm();
  const { toast } = useToast();
  const { user, logout } = useAuth();

  const displayName = userName || user?.name || "Account";
  const roleKey = (userRole || user?.role || "").toLowerCase();
  const displayRole = ROLE_LABELS[roleKey] || (roleKey ? roleKey : "");

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setNotificationsOpen(false);
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setProfileOpen(false);
    const ok = await confirm({
      title: "Log out?",
      message: "You'll need to sign in again to access your dashboard.",
      confirmLabel: "Log out",
      cancelLabel: "Stay signed in",
      variant: "danger",
    });
    if (!ok) return;
    logout();
    onLogout?.();
    toast({
      title: "Signed out",
      message: "You've been logged out successfully.",
      variant: "info",
    });
    navigate("/", { replace: true });
  };

  const notifications = [
    { id: 1, title: "Module Completed", desc: "Python Basics finished!", time: "2m ago" },
    { id: 2, title: "Quiz Available", desc: "New quiz for Data Structures", time: "1h ago" },
    { id: 3, title: "Streak Milestone", desc: "7-day streak unlocked!", time: "1d ago" },
  ];

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="h-16 px-6 lg:px-8 flex items-center justify-between gap-6">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search…"
              onChange={(e) => onSearch?.(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white focus:border-gray-200 transition-all duration-200 text-sm placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Right cluster — strict flex row, items-center, gap-3 */}
        <div className="flex items-center gap-3" ref={navRef}>
          {/* Notification bell with badge */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setNotificationsOpen((v) => !v);
                setProfileOpen(false);
              }}
              className="relative w-10 h-10 inline-flex items-center justify-center rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
              aria-label="Notifications"
            >
              <FaBell className="w-[18px] h-[18px]" />
              {notificationCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[10px] leading-none rounded-full flex items-center justify-center font-bold ring-2 ring-white">
                  {notificationCount > 9 ? "9+" : notificationCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden animate-[fadeIn_180ms_ease-out]">
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer last:border-0"
                    >
                      <div className="flex gap-3">
                        <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">{notif.title}</p>
                          <p className="text-gray-600 text-xs mt-0.5">{notif.desc}</p>
                          <p className="text-gray-400 text-xs mt-1">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-gray-100 text-center bg-gray-50">
                  <button type="button" className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                    View all
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile pill — Avatar | Name + Role | ▼ */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setProfileOpen((v) => !v);
                setNotificationsOpen(false);
              }}
              className="flex items-center gap-3 pl-1 pr-2 py-1 rounded-xl hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
              aria-label={`Account menu — ${displayName}`}
              aria-haspopup="menu"
              aria-expanded={profileOpen}
            >
              <span
                className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm flex-shrink-0"
                aria-hidden="true"
              >
                {initialsOf(displayName)}
              </span>
              <span className="hidden sm:flex flex-col items-start leading-tight">
                <span className="text-sm font-semibold text-gray-900">{displayName}</span>
                {displayRole && (
                  <span className="text-xs text-gray-500 mt-0.5">{displayRole}</span>
                )}
              </span>
              <FaChevronDown
                className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {profileOpen && (
              <div
                className="absolute right-0 mt-2 w-60 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden animate-[fadeIn_180ms_ease-out]"
                role="menu"
              >
                <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {initialsOf(displayName)}
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{displayName}</p>
                    {displayRole && <p className="text-xs text-gray-500 mt-0.5">{displayRole}</p>}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onProfileClick?.();
                    setProfileOpen(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
                >
                  <FaUser className="w-3.5 h-3.5 text-gray-400" />
                  View Profile
                </button>
                <button
                  type="button"
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100 flex items-center gap-3"
                >
                  <FaCog className="w-3.5 h-3.5 text-gray-400" />
                  Settings
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
                >
                  <FaSignOutAlt className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderWithNotifications;
