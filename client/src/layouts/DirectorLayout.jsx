import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import DirectorSidebar from "../components/director/DirectorSidebar";
import HeaderWithNotifications from "../components/HeaderWithNotifications";
import { useAuth } from "../auth/AuthContext";

const resolveActiveMenu = (path) => {
  if (path === "/director" || path === "/director/") return "dashboard";
  if (path.startsWith("/director/analytics")) return "analytics";
  if (path.startsWith("/director/batches"))   return "batches";
  if (path.startsWith("/director/trainers"))  return "trainers";
  if (path.startsWith("/director/students"))  return "students";
  if (path.startsWith("/director/placement")) return "placement";
  if (path.startsWith("/director/reports"))   return "reports";
  if (path.startsWith("/director/feedback"))  return "feedback";
  return "dashboard";
};

const DirectorLayout = ({ onLogout = () => {} }) => {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    setActiveMenu(resolveActiveMenu(location.pathname));
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-[240px] flex-shrink-0 transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <DirectorSidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="flex-1 flex flex-col min-w-0 h-screen">
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
            <HeaderWithNotifications notificationCount={2} onLogout={onLogout} />
          </div>
        </div>

        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <Outlet context={{ user }} />
        </main>
      </div>
    </div>
  );
};

export default DirectorLayout;
