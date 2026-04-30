import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import LightPurpleSidebar from "../components/LightPurpleSidebar";
import HeaderWithNotifications from "../components/HeaderWithNotifications";
import Chatbot from "../components/Chatbot/Chatbot";
import { useAuth } from "../auth/AuthContext";

const DashboardLayout = ({ onLogout = () => {} }) => {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/assessment")) {
      setActiveMenu("assessment");
    } else if (path.includes("/attendance")) {
      setActiveMenu("attendance");
    } else if (path.includes("/material")) {
      setActiveMenu("materials");
    } else if (path.includes("/placement")) {
      setActiveMenu("placement");
    } else if (path.includes("/jobs")) {
      setActiveMenu("jobs");
    } else if (path.includes("/certificate")) {
      setActiveMenu("certificate");
    } else if (path.includes("/alumni")) {
      setActiveMenu("alumni");
    } else if (path.includes("/feedback")) {
      setActiveMenu("feedback");
    } else if (path.includes("/ticket/queries")) {
      setActiveMenu("ticket-queries");
    } else if (path.includes("/ticket")) {
      setActiveMenu("ticket-create");
    } else {
      setActiveMenu("dashboard");
    }
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      {/* Sidebar — desktop: in flow, fixed-width column. Mobile: slide-in drawer. */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-[240px] flex-shrink-0 transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <LightPurpleSidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      </aside>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main column — fills remaining width, no max-width, no centering */}
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        {/* Header bar — Header component provides its own bg/border/shadow */}
        <div className="flex-shrink-0 flex items-stretch bg-white">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="lg:hidden px-4 border-b border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Open navigation menu"
          >
            <FaBars className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <HeaderWithNotifications notificationCount={3} onLogout={onLogout} />
          </div>
        </div>

        {/* Scrollable content — full available width */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <Outlet context={{ user }} />
        </main>
      </div>

      {/* Floating AI tutor (mounts once for the whole dashboard) */}
      <Chatbot />
    </div>
  );
};

export default DashboardLayout;
