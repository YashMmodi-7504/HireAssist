import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiLock, FiArrowLeft, FiLogOut } from "react-icons/fi";
import { useAuth, dashboardPathForRole } from "../auth/AuthContext";

const Unauthorized = () => {
  const { isAuthed, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate("/", { replace: true });
  };

  const homePath = isAuthed ? dashboardPathForRole(role) : "/";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="max-w-md w-full bg-white border border-gray-100 rounded-2xl shadow-sm p-8 text-center">
        <div className="inline-flex p-4 rounded-2xl bg-red-50 text-red-600 mb-4">
          <FiLock className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">Access Denied</h1>
        <p className="text-sm text-gray-500 mt-2 leading-relaxed">
          {isAuthed ? (
            <>
              Your <span className="font-semibold text-gray-700">{role}</span>{" "}
              account doesn't have permission to view this page.
            </>
          ) : (
            <>You need to sign in to view this page.</>
          )}
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2">
          <Link
            to={homePath}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-[0_8px_24px_-6px_rgba(124,58,237,0.45)] active:scale-[0.99] transition-all duration-200"
          >
            <FiArrowLeft className="w-3.5 h-3.5" />
            {isAuthed ? "Back to Your Dashboard" : "Go to Login"}
          </Link>
          {isAuthed && (
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              <FiLogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
