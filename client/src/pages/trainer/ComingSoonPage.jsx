import React from "react";
import { Link } from "react-router-dom";
import { FiTool, FiArrowLeft } from "react-icons/fi";

const ComingSoonPage = ({
  title = "Coming Soon",
  subtitle = "This module is being prepared",
  description = "We're polishing this section. Check back shortly — or jump back to the dashboard for now.",
  backTo = "/trainer",
}) => {
  return (
    <div className="w-full bg-slate-50 min-h-full">
      <div className="bg-gradient-to-r from-purple-50 via-white to-indigo-50 border-b border-purple-100">
        <div className="px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-semibold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
        </div>
      </div>

      <div className="w-full px-6 lg:px-8 py-16 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="inline-flex p-4 rounded-2xl bg-purple-50 text-purple-600 mb-4">
            <FiTool className="w-8 h-8" />
          </div>
          <p className="text-lg font-semibold text-gray-900">{title}</p>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">{description}</p>
          <Link
            to={backTo}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 active:scale-[0.99] text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-[0_8px_24px_-6px_rgba(124,58,237,0.45)] transition-all duration-200"
          >
            <FiArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPage;
