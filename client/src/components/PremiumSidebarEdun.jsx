import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaGraduationCap,
  FaClipboardList,
  FaCalendarAlt,
  FaBook,
  FaBriefcase,
  FaFileAlt,
  FaCertificate,
  FaUsers,
  FaComments,
  FaTicketAlt,
  FaChevronRight,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa";

const PremiumSidebarEdun = ({ activeMenu, setActiveMenu }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);

  // Menu items configuration
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: FaGraduationCap },
    { id: "assessment", label: "Assessment", icon: FaClipboardList },
    { id: "attendance", label: "View Attendance", icon: FaCalendarAlt },
    { id: "materials", label: "Study Material", icon: FaBook },
    { id: "placement", label: "Placement Form", icon: FaBriefcase },
    { id: "jobs", label: "Apply Jobs", icon: FaFileAlt },
    { id: "certificate", label: "Download Certificate", icon: FaCertificate },
    { id: "alumni", label: "Alumni Registration", icon: FaUsers },
    { id: "feedback", label: "Feedback", icon: FaComments },
    { id: "ticket", label: "Raise a Ticket", icon: FaTicketAlt, arrow: true },
  ];

  // Social links for footer
  const socialLinks = [
    { icon: FaFacebook, href: "#", label: "Facebook" },
    { icon: FaTwitter, href: "#", label: "Twitter" },
    { icon: FaLinkedin, href: "#", label: "LinkedIn" },
    { icon: FaInstagram, href: "#", label: "Instagram" },
  ];

  const handleMenuClick = (itemId) => {
    setActiveMenu(itemId);
    // Navigate based on menu item
    // navigate(`/${itemId}`);
  };

  return (
    <>
      {/* Elite SaaS Sidebar - Fixed 280px */}
      <div className="fixed left-0 top-0 h-screen w-[280px] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 text-white flex flex-col shadow-2xl z-50 border-r border-slate-700/50">

        {/* Premium Logo Section */}
        <div className="px-8 py-8 border-b border-slate-700/30 flex items-center gap-4 group hover:border-blue-500/30 transition-colors duration-300">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center font-bold text-3xl shadow-2xl group-hover:shadow-blue-500/50 group-hover:scale-110 transition-all duration-300">
            ✨
          </div>
          <div className="flex-1">
            <h1 className="font-bold text-2xl text-white leading-tight">HireAssist</h1>
            <p className="text-slate-400 text-xs font-semibold tracking-wider mt-1">PREMIUM</p>
          </div>
        </div>

        {/* Elite Navigation Menu */}
        <nav className="flex-1 px-6 py-8 overflow-y-auto space-y-2 scrollbar-hide">
          <p className="text-slate-500 text-xs font-bold tracking-widest px-3 mb-6 uppercase">Navigation</p>

          <ul className="space-y-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              const isHovered = hoveredItem === item.id;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleMenuClick(item.id)}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 group relative overflow-hidden font-medium ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/50 scale-105 border border-blue-400/50"
                        : isHovered
                        ? "bg-slate-700/60 text-white scale-102 border border-slate-600/50"
                        : "text-slate-300 hover:text-white hover:bg-slate-700/30 border border-transparent"
                    }`}
                  >
                    {/* Glow Effect */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/40 to-transparent blur-xl -z-10" />
                    )}

                    {/* Icon with Premium Styling */}
                    <div className={`flex-shrink-0 text-2xl transition-all duration-300 ${
                      isActive ? "text-blue-200 scale-125" : isHovered ? "text-blue-300 scale-120" : "text-slate-400 group-hover:text-slate-300"
                    }`}>
                      <Icon />
                    </div>

                    {/* Label */}
                    <span className={`flex-1 text-left text-sm font-semibold transition-all duration-300 ${
                      isActive ? "text-white font-bold" : "text-slate-300"
                    }`}>
                      {item.label}
                    </span>

                    {/* Arrow Indicator */}
                    {item.arrow && (
                      <div className={`flex-shrink-0 text-sm transition-all duration-300 ${
                        isActive ? "text-blue-200 translate-x-2" : isHovered ? "text-slate-300 translate-x-1" : "text-slate-500 -translate-x-1"
                      }`}>
                        <FaChevronRight />
                      </div>
                    )}

                    {/* Active Pulse */}
                    {isActive && (
                      <div className="absolute right-4 w-3 h-3 rounded-full bg-blue-300 animate-pulse" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Divider */}
        <div className="px-6 py-6">
          <div className="h-px bg-gradient-to-r from-slate-700/0 via-slate-600/50 to-slate-700/0" />
        </div>

        {/* Elite Footer Section */}
        <div className="px-6 py-8 border-t border-slate-700/30 space-y-6">
          {/* User Profile Card - Premium */}
          <div className="p-5 bg-gradient-to-br from-slate-700/60 to-slate-800/60 backdrop-blur-xl rounded-2xl border border-slate-600/50 hover:border-blue-500/50 transition-all duration-300 group/profile hover:shadow-lg hover:shadow-blue-500/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg group-hover/profile:scale-110 transition-transform shadow-lg">
                Y
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm truncate">Yash Sharma</p>
                <p className="text-slate-400 text-xs mt-1">Elite Member</p>
              </div>
            </div>
            <button className="w-full px-4 py-3 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/50">
              Dashboard Settings
            </button>
          </div>

          {/* Social Links - Premium */}
          <div className="flex items-center justify-center gap-3">
            {socialLinks.map((social, idx) => {
              const SocialIcon = social.icon;
              return (
                <a
                  key={idx}
                  href={social.href}
                  title={social.label}
                  className="w-11 h-11 rounded-lg bg-slate-700/50 hover:bg-blue-600/70 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-120 border border-slate-600/30 hover:border-blue-500/50 shadow-lg hover:shadow-blue-500/30 group/social"
                >
                  <SocialIcon className="text-base" />
                  <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-3 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover/social:opacity-100 transition-opacity pointer-events-none border border-slate-700">
                    {social.label}
                  </span>
                </a>
              );
            })}
          </div>

          {/* Footer Text */}
          <p className="text-center text-slate-500 text-xs font-medium">
            © 2026 HireAssist Elite
          </p>
        </div>
      </div>

      {/* Content Offset Spacer */}
      <div className="w-[280px]" />
    </>
  );
};

export default PremiumSidebarEdun;
