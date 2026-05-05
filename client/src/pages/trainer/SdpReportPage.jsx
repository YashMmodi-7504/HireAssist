import React, { useMemo, useState } from "react";
import {
  FiCalendar,
  FiCheckCircle,
  FiHeart,
  FiBriefcase,
  FiDownload,
  FiInbox,
} from "react-icons/fi";
import GradientCard from "../../components/ui/GradientCard";
import { useToast } from "../../components/ui/Toaster";

const SEED = [
  { id: "S-1042", name: "Aarav Mehta", phase: "Phase 3", college: "VIT",   batch: "AC-2025",   attendance: 94, eligible: true,  interested: true,  status: "placed" },
  { id: "S-1041", name: "Diya Patel",  phase: "Phase 3", college: "BITS",  batch: "AC-2025",   attendance: 91, eligible: true,  interested: true,  status: "in-process" },
  { id: "S-1040", name: "Kabir Singh", phase: "Phase 2", college: "IIT-D", batch: "CU4FO-25",  attendance: 72, eligible: false, interested: true,  status: "not-started" },
  { id: "S-1039", name: "Ishita Rao",  phase: "Phase 3", college: "NIT-T", batch: "AC-2025",   attendance: 88, eligible: true,  interested: false, status: "not-started" },
  { id: "S-1038", name: "Reyansh Iyer",phase: "Phase 3", college: "VIT",   batch: "CU4FO-26",  attendance: 96, eligible: true,  interested: true,  status: "placed" },
  { id: "S-1036", name: "Vihaan Joshi",phase: "Phase 2", college: "IIT-B", batch: "AC-2026",   attendance: 68, eligible: false, interested: false, status: "not-started" },
  { id: "S-1035", name: "Anvi Reddy",  phase: "Phase 3", college: "BITS",  batch: "CU4FO-25",  attendance: 90, eligible: true,  interested: true,  status: "in-process" },
  { id: "S-1033", name: "Saanvi Bose", phase: "Phase 3", college: "NIT-T", batch: "VAC-25",    attendance: 84, eligible: true,  interested: true,  status: "in-process" },
  { id: "S-1032", name: "Mihir Kapoor",phase: "Phase 3", college: "VIT",   batch: "AC-2026",   attendance: 79, eligible: true,  interested: true,  status: "not-started" },
  { id: "S-1031", name: "Pari Shah",   phase: "Phase 2", college: "IIT-D", batch: "CU4FO-26",  attendance: 73, eligible: false, interested: false, status: "not-started" },
  { id: "S-1029", name: "Rudra Das",   phase: "Phase 3", college: "BITS",  batch: "AC-2025",   attendance: 92, eligible: true,  interested: true,  status: "placed" },
  { id: "S-1028", name: "Tanvi Khan",  phase: "Phase 3", college: "VIT",   batch: "CU4FO-25",  attendance: 86, eligible: true,  interested: true,  status: "in-process" },
];

const statusConfig = {
  placed: { label: "Placed", className: "text-green-700 bg-green-50 border-green-100" },
  "in-process": { label: "In Process", className: "text-blue-700 bg-blue-50 border-blue-100" },
  "not-started": { label: "Not Started", className: "text-gray-600 bg-gray-100 border-gray-200" },
};

const initials = (name) =>
  name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

const attendanceTone = (pct) => {
  if (pct >= 85) return "text-green-700";
  if (pct >= 75) return "text-amber-700";
  return "text-red-700";
};

const selectClass =
  "px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200 cursor-pointer";

const SdpReportPage = () => {
  const [phase, setPhase] = useState("all");
  const [college, setCollege] = useState("all");
  const [batch, setBatch] = useState("all");
  const { toast } = useToast();

  const phases = useMemo(() => Array.from(new Set(SEED.map((s) => s.phase))).sort(), []);
  const colleges = useMemo(() => Array.from(new Set(SEED.map((s) => s.college))).sort(), []);
  const batches = useMemo(() => Array.from(new Set(SEED.map((s) => s.batch))).sort(), []);

  const filtered = useMemo(
    () =>
      SEED.filter(
        (s) =>
          (phase === "all" || s.phase === phase) &&
          (college === "all" || s.college === college) &&
          (batch === "all" || s.batch === batch)
      ),
    [phase, college, batch]
  );

  const stats = useMemo(() => {
    if (filtered.length === 0)
      return { avgAttendance: 0, eligible: 0, interested: 0, placed: 0 };
    const sum = filtered.reduce((acc, s) => acc + s.attendance, 0);
    const eligible = filtered.filter((s) => s.eligible).length;
    const interested = filtered.filter((s) => s.interested).length;
    const placed = filtered.filter((s) => s.status === "placed").length;
    const pct = (n) => Math.round((n / filtered.length) * 100);
    return {
      avgAttendance: Math.round(sum / filtered.length),
      eligible: pct(eligible),
      interested: pct(interested),
      placed: pct(placed),
    };
  }, [filtered]);

  const handleReset = () => {
    setPhase("all");
    setCollege("all");
    setBatch("all");
  };

  const handleExport = () => {
    toast({
      title: "Export started",
      message: `${filtered.length} student records will be downloaded as CSV.`,
      variant: "info",
    });
  };

  return (
    <div className="w-full bg-slate-50 min-h-full">
      <div className="bg-gradient-to-r from-purple-50 via-white to-indigo-50 border-b border-purple-100">
        <div className="px-6 lg:px-8 py-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">SDP Report</h1>
            <p className="text-sm text-gray-600 mt-1">
              Skill Development Programme metrics across phases and batches
            </p>
          </div>
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            <FiDownload className="w-3.5 h-3.5" />
            Download Report
          </button>
        </div>
      </div>

      <div className="w-full px-6 lg:px-8 py-6 space-y-6">
        {/* KPIs */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <GradientCard
            icon={FiCalendar}
            label="Avg Attendance"
            value={`${stats.avgAttendance}%`}
            progress={stats.avgAttendance}
            color="blue"
          />
          <GradientCard
            icon={FiCheckCircle}
            label="Placement Eligible"
            value={`${stats.eligible}%`}
            progress={stats.eligible}
            color="green"
          />
          <GradientCard
            icon={FiHeart}
            label="Interested"
            value={`${stats.interested}%`}
            progress={stats.interested}
            color="orange"
          />
          <GradientCard
            icon={FiBriefcase}
            label="Placed"
            value={`${stats.placed}%`}
            progress={stats.placed}
            color="purple"
          />
        </section>

        {/* Filters */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
          <div className="flex flex-col sm:flex-row sm:items-end gap-3">
            <div className="flex flex-wrap gap-3 flex-1">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">Phase</label>
                <select value={phase} onChange={(e) => setPhase(e.target.value)} className={selectClass}>
                  <option value="all">All Phases</option>
                  {phases.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">College</label>
                <select value={college} onChange={(e) => setCollege(e.target.value)} className={selectClass}>
                  <option value="all">All Colleges</option>
                  {colleges.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">Batch</label>
                <select value={batch} onChange={(e) => setBatch(e.target.value)} className={selectClass}>
                  <option value="all">All Batches</option>
                  {batches.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors self-start sm:self-auto"
            >
              Reset
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Showing {filtered.length} of {SEED.length} students
          </p>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Student</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Phase</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Batch</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Attendance</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Eligibility</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Interest</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Placement Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12">
                      <div className="text-center">
                        <div className="inline-flex p-3 rounded-2xl bg-gray-100 text-gray-400 mb-3">
                          <FiInbox className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-medium text-gray-900">No students match these filters</p>
                        <p className="text-xs text-gray-500 mt-1">Try a different phase or batch</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((s) => {
                    const cfg = statusConfig[s.status] || statusConfig["not-started"];
                    return (
                      <tr key={s.id} className="hover:bg-purple-50/40 transition-colors">
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                              {initials(s.name)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">{s.name}</p>
                              <p className="text-xs text-gray-500 truncate">{s.id} · {s.college}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <span className="text-xs text-gray-700">{s.phase}</span>
                        </td>
                        <td className="px-6 py-3">
                          <span className="inline-flex px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs font-mono font-semibold">
                            {s.batch}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <span className={`text-sm font-bold ${attendanceTone(s.attendance)}`}>
                            {s.attendance}%
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                              s.eligible
                                ? "text-green-700 bg-green-50 border-green-100"
                                : "text-red-700 bg-red-50 border-red-100"
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${s.eligible ? "bg-green-500" : "bg-red-500"}`} />
                            {s.eligible ? "Eligible" : "Not Eligible"}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <span className="inline-flex items-center gap-1.5 text-xs text-gray-700">
                            <FiHeart className={`w-3.5 h-3.5 ${s.interested ? "text-rose-500 fill-current" : "text-gray-300"}`} />
                            {s.interested ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <span className={`inline-flex px-2.5 py-1 rounded text-xs font-semibold border ${cfg.className}`}>
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

export default SdpReportPage;
