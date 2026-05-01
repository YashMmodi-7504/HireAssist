import React from "react";
import { useNavigate } from "react-router-dom";
import { FiBookOpen, FiClock, FiLayers, FiArrowRight } from "react-icons/fi";
import { COURSES } from "../../data/courseCatalog";
import { courseHeaderStyle } from "../../theme/courseTheme";

const Courses = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-slate-50 min-h-full">
      <div className="bg-gradient-to-r from-purple-50 via-white to-indigo-50 border-b border-purple-100">
        <div className="px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-semibold text-gray-900">Courses</h1>
          <p className="text-sm text-gray-600 mt-1">
            Browse the catalog and review module structure for each program
          </p>
        </div>
      </div>

      <div className="w-full px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-5">
          {COURSES.map((course) => (
            <article
              key={course.id}
              className="group relative bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              {/* Accent strip */}
              <div className="h-1.5" style={courseHeaderStyle} />
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-flex w-9 h-9 rounded-xl items-center justify-center text-white shadow-sm flex-shrink-0"
                        style={courseHeaderStyle}
                      >
                        <FiBookOpen className="w-4.5 h-4.5" />
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                        {course.level}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mt-3">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{course.tagline}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex p-1.5 rounded-lg bg-purple-50 text-purple-600">
                      <FiLayers className="w-3.5 h-3.5" />
                    </span>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                        Modules
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {course.modules.length}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                      <FiClock className="w-3.5 h-3.5" />
                    </span>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                        Duration
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {course.duration}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/trainer/course/${course.id}`)}
                  className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-gradient-to-br from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-sm transition-all duration-200 group-hover:scale-[1.01]"
                >
                  View Course
                  <FiArrowRight className="w-4 h-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;
