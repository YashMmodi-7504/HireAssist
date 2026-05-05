import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheckCircle,
  FiAlertCircle,
  FiBookOpen,
} from "react-icons/fi";
import { findModule } from "../../data/courseCatalog";
import { courseHeaderStyle } from "../../theme/courseTheme";

const ModuleDetail = () => {
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();
  const { course, module } = findModule(courseId, moduleId);

  if (!course || !module) {
    return (
      <div className="w-full bg-slate-50 min-h-full">
        <div className="px-6 lg:px-8 py-12 max-w-2xl mx-auto text-center">
          <div className="inline-flex p-4 rounded-2xl bg-red-50 text-red-500 mb-4">
            <FiAlertCircle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Module not found</h2>
          <p className="text-sm text-gray-600 mt-1">
            We couldn't find that module in the catalog.
          </p>
          <button
            type="button"
            onClick={() => navigate("/trainer/courses")}
            className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to courses
          </button>
        </div>
      </div>
    );
  }

  const idx = course.modules.findIndex((m) => m.id === module.id);
  const prev = idx > 0 ? course.modules[idx - 1] : null;
  const next = idx < course.modules.length - 1 ? course.modules[idx + 1] : null;

  return (
    <div className="w-full bg-slate-50 min-h-full">
      <div className="text-white" style={courseHeaderStyle}>
        <div className="px-6 lg:px-8 py-8">
          <button
            type="button"
            onClick={() => navigate(`/trainer/course/${course.id}`)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/85 hover:text-white transition-colors mb-4"
          >
            <FiArrowLeft className="w-4 h-4" />
            {course.title}
          </button>
          <p className="text-[11px] font-bold uppercase tracking-wider text-white/75">
            Module {module.order} of {course.modules.length}
          </p>
          <h1 className="text-3xl font-semibold mt-1">{module.title}</h1>
        </div>
      </div>

      <div className="w-full px-6 lg:px-8 py-6 grid grid-cols-12 gap-6">
        {/* Main content */}
        <section className="col-span-12 lg:col-span-8 space-y-5">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900">About this module</h2>
            <p className="text-sm text-gray-700 leading-relaxed mt-2">
              {module.description}
            </p>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <FiBookOpen className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900">Learning topics</h2>
            </div>
            <ul className="space-y-2.5">
              {module.topics.map((t, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 items-center justify-center flex-shrink-0">
                    <FiCheckCircle className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-sm text-gray-800 leading-relaxed">{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Prev / Next nav */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={!prev}
              onClick={() =>
                prev && navigate(`/trainer/course/${course.id}/module/${prev.id}`)
              }
              className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-4 text-left hover:border-purple-200 hover:shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-100 disabled:hover:shadow-none"
            >
              <FiArrowLeft className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                  Previous
                </p>
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {prev ? prev.title : "Start of course"}
                </p>
              </div>
            </button>
            <button
              type="button"
              disabled={!next}
              onClick={() =>
                next && navigate(`/trainer/course/${course.id}/module/${next.id}`)
              }
              className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-4 text-right hover:border-purple-200 hover:shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-100 disabled:hover:shadow-none justify-end"
            >
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                  Next
                </p>
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {next ? next.title : "End of course"}
                </p>
              </div>
              <FiArrowRight className="w-4 h-4 text-gray-500 flex-shrink-0" />
            </button>
          </div>
        </section>

        {/* Side context */}
        <aside className="col-span-12 lg:col-span-4 space-y-4">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Course outline</h3>
            <ul className="space-y-1.5">
              {course.modules.map((m) => {
                const active = m.id === module.id;
                return (
                  <li key={m.id}>
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/trainer/course/${course.id}/module/${m.id}`)
                      }
                      className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                        active
                          ? "bg-purple-50 text-purple-700 font-semibold"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <span
                        className={`inline-flex w-6 h-6 rounded-md items-center justify-center text-[11px] font-bold flex-shrink-0 ${
                          active
                            ? "bg-purple-600 text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {m.order}
                      </span>
                      <span className="flex-1 truncate">{m.title}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ModuleDetail;
