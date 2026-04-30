import React from "react";
import { Link } from "react-router-dom";
import { FiUsers, FiCalendar, FiCheckCircle, FiBookOpen, FiPlus, FiArrowRight } from "react-icons/fi";
import GradientCard from "../../components/ui/GradientCard";
import { useToast } from "../../components/ui/Toaster";

const BATCHES = [
  { code: "AC-2025",   college: "VIT",   students: 24, attendance: 94, startDate: "2025-08-01", status: "active",    completion: 78 },
  { code: "CU4FO-25",  college: "BITS",  students: 28, attendance: 88, startDate: "2025-08-15", status: "active",    completion: 65 },
  { code: "VAC-25",    college: "IIT-D", students: 18, attendance: 76, startDate: "2025-09-10", status: "active",    completion: 52 },
  { code: "AC-2026",   college: "NIT-T", students: 30, attendance: 92, startDate: "2026-01-15", status: "active",    completion: 22 },
  { code: "CU4FO-26",  college: "VIT",   students: 26, attendance: 90, startDate: "2026-02-01", status: "active",    completion: 14 },
  { code: "AC-2024",   college: "BITS",  students: 22, attendance: 85, startDate: "2024-08-01", status: "completed", completion: 100 },
];

const trackOf = (code) => {
  if (code.startsWith("CU4FO")) return { label: "CU4FO", className: "text-purple-700 bg-purple-50 border-purple-100" };
  if (code.startsWith("VAC")) return { label: "VAC", className: "text-orange-700 bg-orange-50 border-orange-100" };
  if (code.startsWith("AC")) return { label: "AC", className: "text-blue-700 bg-blue-50 border-blue-100" };
  return { label: "—", className: "text-gray-700 bg-gray-50 border-gray-100" };
};

const statusConfig = {
  active:    { label: "Active",    className: "text-green-700 bg-green-50 border-green-100", dot: "bg-green-500" },
  completed: { label: "Completed", className: "text-gray-700 bg-gray-100 border-gray-200",   dot: "bg-gray-400" },
};

const attBar = (pct) => {
  if (pct >= 85) return "bg-green-500";
  if (pct >= 75) return "bg-amber-500";
  return "bg-red-500";
};

const ViewBatchPage = () => {
  const { toast } = useToast();

  const totalStudents = BATCHES.reduce((acc, b) => acc + b.students, 0);
  const avgAttendance = Math.round(
    BATCHES.reduce((acc, b) => acc + b.attendance, 0) / BATCHES.length
  );
  const avgCompletion = Math.round(
    BATCHES.reduce((acc, b) => acc + b.completion, 0) / BATCHES.length
  );
  const activeModules = BATCHES.filter((b) => b.status === "active").length * 3;

  return (
    <div className="w-full bg-slate-50 min-h-full">
      <div className="bg-gradient-to-r from-purple-50 via-white to-indigo-50 border-b border-purple-100">
        <div className="px-6 lg:px-8 py-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">View Batches</h1>
            <p className="text-sm text-gray-600 mt-1">Active and completed batches across all tracks</p>
          </div>
          <Link
            to="/trainer/batch/add"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-[0_8px_24px_-6px_rgba(124,58,237,0.45)] active:scale-[0.99] transition-all duration-200"
          >
            <FiPlus className="w-4 h-4" />
            Add Batch
          </Link>
        </div>
      </div>

      <div className="w-full px-6 lg:px-8 py-6 space-y-6">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <GradientCard icon={FiUsers}      label="Total Students"   value={totalStudents}  color="blue" />
          <GradientCard icon={FiCalendar}   label="Avg Attendance"   value={`${avgAttendance}%`} progress={avgAttendance} color="green" />
          <GradientCard icon={FiCheckCircle}label="Avg Completion"   value={`${avgCompletion}%`} progress={avgCompletion} color="purple" />
          <GradientCard icon={FiBookOpen}   label="Active Modules"   value={activeModules} color="orange" />
        </section>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">All Batches</h3>
            <p className="text-xs text-gray-500 mt-0.5">Click "View" to drill into a batch</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px]">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Batch</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">College</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Students</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider w-[220px]">Avg Attendance</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Start Date</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {BATCHES.map((b) => {
                  const track = trackOf(b.code);
                  const status = statusConfig[b.status];
                  return (
                    <tr key={b.code} className="hover:bg-purple-50/40 transition-colors">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs font-mono font-semibold">{b.code}</span>
                          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${track.className}`}>
                            {track.label}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-700">{b.college}</td>
                      <td className="px-6 py-3 text-sm font-semibold text-gray-900">{b.students}</td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full ${attBar(b.attendance)} rounded-full`} style={{ width: `${b.attendance}%` }} />
                          </div>
                          <span className="text-xs font-bold text-gray-700 min-w-[36px] text-right">{b.attendance}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-xs text-gray-600">{b.startDate}</td>
                      <td className="px-6 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${status.className}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => toast({ title: b.code, message: `${b.students} students · ${b.completion}% complete`, variant: "info" })}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-100 rounded-lg transition-colors"
                        >
                          View
                          <FiArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBatchPage;
