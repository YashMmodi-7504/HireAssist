import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import AdminSidebar from "../components/admin/AdminSidebar";
import HeaderWithNotifications from "../components/HeaderWithNotifications";
import { useAuth } from "../auth/AuthContext";

const resolveActiveMenu = (path) => {
  if (path === "/admin" || path === "/admin/") return "dashboard";

  if (path.startsWith("/admin/users/trainers")) return "users-trainers";
  if (path.startsWith("/admin/users/students")) return "users-students";
  if (path.startsWith("/admin/users/directors")) return "users-directors";
  if (path.startsWith("/admin/users/blocked")) return "users-blocked";
  if (path.startsWith("/admin/users")) return "users-all";

  if (path.startsWith("/admin/batch/create")) return "batch-create";
  if (path.startsWith("/admin/batch/view")) return "batch-view";
  if (path.startsWith("/admin/batch")) return "batch-view";

  if (path.startsWith("/admin/courses/create")) return "courses-create";
  if (path.startsWith("/admin/courses/assign")) return "courses-assign";
  if (path.startsWith("/admin/courses")) return "courses-all";

  if (path.startsWith("/admin/modules")) return "modules";

  if (path.startsWith("/admin/assessments/create")) return "assessments-create";
  if (path.startsWith("/admin/assessments/assign")) return "assessments-assign";
  if (path.startsWith("/admin/assessments")) return "assessments-all";

  if (path.startsWith("/admin/attendance")) return "attendance";
  if (path.startsWith("/admin/capstone")) return "capstone";
  if (path.startsWith("/admin/feedback")) return "feedback-analytics";

  if (path.startsWith("/admin/reports/students")) return "reports-students";
  if (path.startsWith("/admin/reports/trainers")) return "reports-trainers";
  if (path.startsWith("/admin/reports/batches")) return "reports-batches";
  if (path.startsWith("/admin/reports")) return "reports-students";

  if (path.startsWith("/admin/placement")) return "placement-analytics";
  if (path.startsWith("/admin/settings")) return "settings";

  return "dashboard";
};

const AdminDashboardLayout = ({ onLogout = () => {} }) => {
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
        <AdminSidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
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
            <HeaderWithNotifications notificationCount={7} onLogout={onLogout} />
          </div>
        </div>

        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <Outlet context={{ user }} />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
