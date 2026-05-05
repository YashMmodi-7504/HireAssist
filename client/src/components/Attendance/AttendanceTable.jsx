import React from "react";

const colorFor = (pct) => {
  if (pct >= 90) return { text: "text-green-700", bar: "bg-green-500" };
  if (pct >= 75) return { text: "text-amber-700", bar: "bg-amber-500" };
  return { text: "text-red-700", bar: "bg-red-500" };
};

const AttendanceTable = ({ rows = [] }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-900">Subject-wise Attendance</h3>
        <p className="text-sm text-gray-500 mt-1">Breakdown by batch and subject</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Name
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Batch Code
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider w-[45%]">
                Attendance
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-10 text-center text-sm text-gray-500">
                  No records to display
                </td>
              </tr>
            )}
            {rows.map((row) => {
              const c = colorFor(row.percentage);
              return (
                <tr key={row.batchCode} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-gray-900">{row.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-mono font-semibold">
                      {row.batchCode}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${c.bar} rounded-full transition-all duration-500`}
                          style={{ width: `${row.percentage}%` }}
                        />
                      </div>
                      <span className={`text-sm font-bold ${c.text} min-w-[48px] text-right`}>
                        {row.percentage}%
                      </span>
                    </div>
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

export default AttendanceTable;
