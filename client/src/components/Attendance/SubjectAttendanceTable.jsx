import React from "react";
import { FiDownload } from "react-icons/fi";

const styleFor = (pct) => {
  if (pct >= 85) {
    return {
      text: "text-green-700",
      bar: "bg-green-500",
      badge: "text-green-700 bg-green-50 border-green-100",
      label: "Good",
    };
  }
  if (pct >= 75) {
    return {
      text: "text-amber-700",
      bar: "bg-amber-500",
      badge: "text-amber-700 bg-amber-50 border-amber-100",
      label: "Warning",
    };
  }
  return {
    text: "text-red-700",
    bar: "bg-red-500",
    badge: "text-red-700 bg-red-50 border-red-100",
    label: "Critical",
  };
};

const SubjectAttendanceTable = ({ rows = [], onDownload }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Subject-wise Attendance
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Breakdown by batch and subject
          </p>
        </div>
        <button
          type="button"
          onClick={onDownload}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors duration-200"
        >
          <FiDownload className="w-3.5 h-3.5" />
          Download Report
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Subject
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Batch
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                Classes
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider w-[35%]">
                Attendance
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500">
                  No records to display
                </td>
              </tr>
            )}
            {rows.map((row) => {
              const s = styleFor(row.percentage);
              return (
                <tr
                  key={row.batchCode}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-gray-900">
                      {row.name}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-mono font-semibold">
                      {row.batchCode}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-700 whitespace-nowrap">
                      {row.present} / {row.total}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${s.bar} rounded-full transition-all duration-500`}
                          style={{ width: `${row.percentage}%` }}
                        />
                      </div>
                      <span
                        className={`text-sm font-bold ${s.text} min-w-[44px] text-right`}
                      >
                        {row.percentage}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded text-xs font-semibold border ${s.badge}`}
                    >
                      {s.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubjectAttendanceTable;
