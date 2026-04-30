import React, { useState, useRef, useEffect } from "react";
import {
  FaUser,
  FaChevronDown,
  FaLock,
  FaBell,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

const StudentNavbar = ({ userName = "Yash", onLogout, notifications = 3 }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white shadow-md border-b border-gray-200">
      <div className="flex justify-between items-center px-8 py-4 ml-64">
        <h1 className="text-2xl font-bold text-gray-800">Learning Dashboard</h1>

        <div className="flex items-center gap-6">
          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative text-gray-600 hover:text-purple-600 transition-colors text-xl"
            >
              <FaBell />
              {notifications > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {[
                    { id: 1, msg: "New assignment: Python Loops", time: "2 hours ago" },
                    { id: 2, msg: "Quiz deadline tomorrow", time: "5 hours ago" },
                    { id: 3, msg: "Course completion milestone reached!", time: "1 day ago" },
                  ].map((notif) => (
                    <div key={notif.id} className="px-4 py-3 border-b hover:bg-gray-50">
                      <p className="text-sm text-gray-800">{notif.msg}</p>
                      <p className="text-xs text-gray-500">{notif.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                Y
              </div>
              <span className="font-medium text-gray-700">{userName}</span>
              <FaChevronDown className="text-xs text-gray-500" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <button className="w-full px-4 py-2 flex items-center gap-2 hover:bg-gray-100 text-gray-700">
                  <FaUser className="text-sm" />
                  <span>View Profile</span>
                </button>
                <button className="w-full px-4 py-2 flex items-center gap-2 hover:bg-gray-100 text-gray-700">
                  <FaCog className="text-sm" />
                  <span>Settings</span>
                </button>
                <button className="w-full px-4 py-2 flex items-center gap-2 hover:bg-gray-100 text-gray-700">
                  <FaLock className="text-sm" />
                  <span>Change Password</span>
                </button>
                <hr className="my-2" />
                <button
                  onClick={onLogout}
                  className="w-full px-4 py-2 flex items-center gap-2 hover:bg-red-50 text-red-600 font-medium"
                >
                  <FaSignOutAlt className="text-sm" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentNavbar;
