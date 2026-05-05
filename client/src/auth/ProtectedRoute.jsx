import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth, dashboardPathForRole } from "./AuthContext";

/**
 * Gate a route by authentication and role.
 *
 *   <ProtectedRoute allowedRole="admin"><AdminLayout /></ProtectedRoute>
 *   <ProtectedRoute allowedRole={["trainer", "admin"]}>...</ProtectedRoute>
 *
 * Behaviour:
 * - Not signed in           -> bounce to /
 * - Signed in, role OK      -> render children
 * - Signed in, wrong role   -> bounce to THAT user's OWN dashboard.
 *
 * Sending mismatched users to their canonical home (instead of /unauthorized)
 * makes it physically impossible for, say, an admin to land on a trainer
 * page even if they type the URL — they'll be redirected back to /admin.
 */
const ProtectedRoute = ({ allowedRole, children }) => {
  const { isAuthed, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span className="w-4 h-4 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin" />
          Restoring session…
        </div>
      </div>
    );
  }

  if (!isAuthed) {
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }

  if (allowedRole) {
    const allowed = Array.isArray(allowedRole) ? allowedRole : [allowedRole];
    if (!allowed.includes(role)) {
      const target = dashboardPathForRole(role);
      // Guard against a redirect loop if the user's "home" path also fails
      // the gate (shouldn't happen with the current map, but defensive).
      if (target && target !== location.pathname) {
        return <Navigate to={target} replace />;
      }
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
