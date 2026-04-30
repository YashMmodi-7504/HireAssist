import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import TrainerSidebar from "../components/trainer/TrainerSidebar";
import HeaderWithNotifications from "../components/HeaderWithNotifications";
import { useAuth } from "../auth/AuthContext";

const resolveActiveMenu = (path) => {
  if (path === "/trainer" || path === "/trainer/") return "dashboard";
  if (path.startsWith("/trainer/users/registrations")) return "users-registrations";
  if (path.startsWith("/trainer/users/dropout")) return "users-dropout";
  if (path.startsWith("/trainer/users")) return "users-all";
  if (path.startsWith("/trainer/batch/add")) return "batch-add";
  if (path.startsWith("/trainer/batch/view")) return "batch-view";
  if (path.startsWith("/trainer/batch")) return "batch-view";
  if (path.startsWith("/trainer/feedback")) return "feedback";
  if (path.startsWith("/trainer/module-tracker")) return "module-tracker";
  if (path.startsWith("/trainer/course-access")) return "course-access";
  if (path.startsWith("/trainer/capstone")) return "capstone";
  if (path.startsWith("/trainer/attendance")) return "attendance";
  if (path.startsWith("/trainer/interview")) return "interview";
  if (path.startsWith("/trainer/assessment")) return "assessment";
  if (path.startsWith("/trainer/sdp")) return "sdp";
  if (path.startsWith("/trainer/placement")) return "placement";
  if (path.startsWith("/trainer/course")) return "course";
  return "dashboard";
};

const TrainerDashboardLayout = ({ onLogout = () => {} }) => {
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
        <TrainerSidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
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
            <HeaderWithNotifications notificationCount={5} onLogout={onLogout} />
          </div>
        </div>

        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <Outlet context={{ user }} />
        </main>
      </div>
    </div>
  );
};

export default TrainerDashboardLayout;
