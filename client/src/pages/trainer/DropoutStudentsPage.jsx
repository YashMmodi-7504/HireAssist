import React, { useMemo, useState } from "react";
import { FiUserX, FiAlertTriangle, FiTrendingDown, FiInbox } from "react-icons/fi";
import GradientCard from "../../components/ui/GradientCard";

const SEED = [
  { id: "S-1042", name: "Aarav Mehta",   batch: "AC-2025",   attendance: 58, lastActive: "5 days ago",  reason: "Personal — family relocation",   status: "dropped" },
  { id: "S-1041", name: "Diya Patel",    batch: "AC-2025",   attendance: 62, lastActive: "2 days ago",  reason: "Health-related break",            status: "at-risk" },
  { id: "S-1040", name: "Kabir Singh",   batch: "CU4FO-25",  attendance: 71, lastActive: "yesterday",   reason: "Internship overlap",              status: "at-risk" },
  { id: "S-1039", name: "Ishita Rao",    batch: "AC-2025",   attendance: 49, lastActive: "12 days ago", reason: "No reason provided",              status: "dropped" },
  { id: "S-1038", name: "Reyansh Iyer",  batch: "VAC-25",    attendance: 67, lastActive: "3 days ago",  reason: "Course not aligning with goals",  status: "at-risk" },
  { id: "S-1036", name: "Vihaan Joshi",  batch: "CU4FO-26",  attendance: 54, lastActive: "8 days ago",  reason: "Switched to other programme",     status: "dropped" },
  { id: "S-1035", name: "Anvi Reddy",    batch: "AC-2026",   attendance: 73, lastActive: "today",       reason: "Heavy academic load",             status: "at-risk" },
  { id: "S-1033", name: "Saanvi Bose",   batch: "VAC-25",    attendance: 70, lastActive: "yesterday",   reason: "Travel — placement interviews",   status: "at-risk" },
];

const ALL_BATCHES = Array.from(new Set(SEED.map((s) => s.batch))).sort();

const statusConfig = {
  "at-risk": { label: "At Risk", className: "text-amber-700 bg-amber-50 border-amber-100", dot: "bg-amber-500" },
  dropped:   { label: "Dropped", className: "text-red-700 bg-red-50 border-red-100",       dot: "bg-red-500" },
};

const initials = (name) =>
  name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

const attendanceTone = (pct) => {
  if (pct >= 75) return "text-amber-700";
  if (pct >= 60) return "text-orange-700";
  return "text-red-700";
};

const selectClass =
  "px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200 cursor-pointer";

const DropoutStudentsPage = () => {
  const [batch, setBatch] = useState("all");
  const [risk, setRisk] = useState("all");

  const filtered = useMemo(
    () =>
      SEED.filter(
        (s) =>
          (batch === "all" || s.batch === batch) &&
          (risk === "all" || s.status === risk)
      ),
    [batch, risk]
  );

  // KPIs reflect the full dataset (not the filtered view) so trainers see system-wide health
  const totalDropouts = SEED.filter((s) => s.status === "dropped").length;
  const atRisk = SEED.filter((s) => s.status === "at-risk").length;
  // Mock: pretend overall enrolment is 240 to compute a rate
  const dropoutRate = Math.round((totalDropouts / 240) * 100);

  return (
    <div className="w-full bg-slate-50 min-h-full">
      <div className="bg-gradient-to-r from-purple-50 via-white to-indigo-50 border-b border-purple-100">
        <div className="px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-semibold text-gray-900">Dropout Students</h1>
          <p className="text-sm text-gray-600 mt-1">Track at-risk and dropped students with reasons</p>
        </div>
      </div>

      <div className="w-full px-6 lg:px-8 py-6 space-y-6">
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <GradientCard icon={FiUserX}        label="Total Dropouts"   value={totalDropouts} color="red"    sublabel="this phase" />
          <GradientCard icon={FiAlertTriangle} label="At Risk Students" value={atRisk}        color="orange" sublabel="needs follow-up" />
          <GradientCard icon={FiTrendingDown} label="Dropout Rate"     value={`${dropoutRate}%`} progress={dropoutRate} color="purple" />
        </section>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">Batch</label>
              <select value={batch} onChange={(e) => setBatch(e.target.value)} className={selectClass}>
                <option value="all">All Batches</option>
                {ALL_BATCHES.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">Risk Level</label>
              <select value={risk} onChange={(e) => setRisk(e.target.value)} className={selectClass}>
                <option value="all">All</option>
                <option value="at-risk">At Risk</option>
                <option value="dropped">Dropped</option>
              </select>
            </div>
            <div className="flex-1" />
            <p className="text-xs text-gray-500">{filtered.length} of {SEED.length} students</p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px]">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Student</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Batch</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Attendance</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Last Active</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Reason</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12">
                      <div className="text-center">
                        <div className="inline-flex p-3 rounded-2xl bg-gray-100 text-gray-400 mb-3">
                          <FiInbox className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-medium text-gray-900">No matching students</p>
                        <p className="text-xs text-gray-500 mt-1">Try a different batch or risk level</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((s) => {
                    const cfg = statusConfig[s.status] || statusConfig["at-risk"];
                    return (
                      <tr key={s.id} className="hover:bg-purple-50/40 transition-colors">
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                              {initials(s.name)}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">{s.name}</p>
                              <p className="text-xs text-gray-500">{s.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <span className="inline-flex px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs font-mono font-semibold">{s.batch}</span>
                        </td>
                        <td className="px-6 py-3">
                          <span className={`text-sm font-bold ${attendanceTone(s.attendance)}`}>{s.attendance}%</span>
                        </td>
                        <td className="px-6 py-3 text-xs text-gray-600">{s.lastActive}</td>
                        <td className="px-6 py-3 text-sm text-gray-700">{s.reason}</td>
                        <td className="px-6 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${cfg.className}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                            {cfg.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropoutStudentsPage;
