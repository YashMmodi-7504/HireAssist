import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiClock,
  FiLayers,
  FiArrowRight,
  FiBookOpen,
  FiAlertCircle,
} from "react-icons/fi";
import { findCourse } from "../../data/courseCatalog";
import { courseHeaderStyle } from "../../theme/courseTheme";

const ViewCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const course = findCourse(courseId);

  if (!course) {
    return (
      <div className="w-full bg-slate-50 min-h-full">
        <div className="px-6 lg:px-8 py-12 max-w-2xl mx-auto text-center">
          <div className="inline-flex p-4 rounded-2xl bg-red-50 text-red-500 mb-4">
            <FiAlertCircle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Course not found</h2>
          <p className="text-sm text-gray-600 mt-1">
            The course "{courseId}" doesn't exist in the catalog.
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

  return (
    <div className="w-full bg-slate-50 min-h-full">
      {/* Hero */}
      <div className="text-white" style={courseHeaderStyle}>
        <div className="px-6 lg:px-8 py-8">
          <button
            type="button"
            onClick={() => navigate("/trainer/courses")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/85 hover:text-white transition-colors mb-4"
          >
            <FiArrowLeft className="w-4 h-4" />
            All Courses
          </button>
          <p className="text-[11px] font-bold uppercase tracking-wider text-white/75">
            {course.level}
          </p>
          <h1 className="text-3xl font-semibold mt-1">{course.title}</h1>
          <p className="text-sm text-white/90 mt-1.5 max-w-2xl">{course.tagline}</p>

          <div className="flex flex-wrap gap-3 mt-5">
            <span className="inline-flex items-center gap-2 text-xs font-semibold bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <FiLayers className="w-3.5 h-3.5" />
              {course.modules.length} modules
            </span>
            <span className="inline-flex items-center gap-2 text-xs font-semibold bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <FiClock className="w-3.5 h-3.5" />
              {course.duration}
            </span>
          </div>
        </div>
      </div>

      <div className="w-full px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Modules</h2>
          <p className="text-xs text-gray-500">
            Click a module to view topics and details
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {course.modules.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() =>
                navigate(`/trainer/course/${course.id}/module/${m.id}`)
              }
              className="group text-left bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-purple-200 transition-all duration-200 p-5"
            >
              <div className="flex items-start gap-3">
                <span
                  className="inline-flex w-10 h-10 rounded-xl items-center justify-center text-white font-bold shadow-sm flex-shrink-0"
                  style={courseHeaderStyle}
                >
                  {m.order}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                    Module {m.order}
                  </p>
                  <h3 className="text-base font-semibold text-gray-900 mt-0.5 leading-snug">
                    {m.title}
                  </h3>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-3 line-clamp-2">{m.description}</p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-gray-500">
                  <FiBookOpen className="w-3.5 h-3.5" />
                  {m.topics.length} topics
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 group-hover:gap-2 transition-all">
                  View module
                  <FiArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewCourse;
