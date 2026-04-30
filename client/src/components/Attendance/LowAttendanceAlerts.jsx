import React from "react";
import { FiAlertTriangle } from "react-icons/fi";

const LowAttendanceAlerts = ({ subjects = [], target = 80 }) => {
  if (subjects.length === 0) return null;

  return (
    <div className="bg-white border border-red-100 rounded-2xl shadow-sm p-6">
      <div className="flex items-start gap-3 mb-5">
        <div className="p-2 rounded-lg bg-red-50 text-red-600 flex-shrink-0">
          <FiAlertTriangle className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900">
            Low Attendance Alerts
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {subjects.length} subject{subjects.length > 1 ? "s" : ""} below 75%
            — take action to recover
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map((s) => (
          <div
            key={s.batchCode}
            className="border border-red-100 bg-red-50/40 rounded-xl p-4"
          >
            <p className="text-sm font-semibold text-gray-900 truncate">
              {s.name}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{s.batchCode}</p>

            <div className="flex items-center justify-between mt-3">
              <span className="text-xl font-semibold text-red-600 leading-none">
                {s.percentage}%
              </span>
              <span className="text-xs text-gray-500">
                {s.present}/{s.total} classes
              </span>
            </div>

            {s.classesNeeded > 0 && (
              <p className="mt-3 text-xs text-gray-700 leading-relaxed">
                Attend next{" "}
                <span className="font-semibold text-gray-900">
                  {s.classesNeeded}
                </span>{" "}
                classes to reach{" "}
                <span className="font-semibold">{target}%</span>
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LowAttendanceAlerts;
