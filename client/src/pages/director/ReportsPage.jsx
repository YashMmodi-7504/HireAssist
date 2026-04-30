import React, { useMemo, useState } from "react";
import {
  FiSearch,
  FiDownload,
  FiInbox,
  FiBookOpen,
  FiUserCheck,
  FiLayers,
} from "react-icons/fi";
import Tabs from "../../components/ui/Tabs";
import { useToast } from "../../components/ui/Toaster";

// ─────────────────────── mock datasets ───────────────────────

const STUDENTS = [
  { id: "S-1042", name: "Aarav Mehta",   batch: "AC-2025",   completion: 96, attendance: 94, score: 92 },
  { id: "S-1041", name: "Diya Patel",    batch: "AC-2025",   completion: 94, attendance: 91, score: 88 },
  { id: "S-1040", name: "Kabir Singh",   batch: "CU4FO-25",  completion: 72, attendance: 80, score: 76 },
  { id: "S-1039", name: "Ishita Rao",    batch: "AC-2026",   completion: 84, attendance: 88, score: 87 },
  { id: "S-1038", name: "Reyansh Iyer",  batch: "CU4FO-26",  completion: 92, attendance: 90, score: 91 },
  { id: "S-1036", name: "Vihaan Joshi",  batch: "AC-2025",   completion: 65, attendance: 72, score: 70 },
  { id: "S-1035", name: "Anvi Reddy",    batch: "CU4FO-25",  completion: 90, attendance: 92, score: 89 },
  { id: "S-1033", name: "Saanvi Bose",   batch: "VAC-25",    completion: 86, attendance: 84, score: 83 },
  { id: "S-1032", name: "Mihir Kapoor",  batch: "AC-2026",   completion: 78, attendance: 82, score: 80 },
  { id: "S-1031", name: "Pari Shah",     batch: "CU4FO-26",  completion: 70, attendance: 75, score: 72 },
  { id: "S-1029", name: "Rudra Das",     batch: "AC-2025",   completion: 88, attendance: 90, score: 90 },
  { id: "S-1028", name: "Tanvi Khan",    batch: "CU4FO-25",  completion: 82, attendance: 85, score: 84 },
];

const TRAINERS = [
  { id: "T-1042", name: "Praful Bhoyar", batches: 4, avgCompletion: 78, rating: 4.7 },
  { id: "T-1041", name: "Sneha Iyer",    batches: 3, avgCompletion: 72, rating: 4.5 },
  { id: "T-1040", name: "Vikram Joshi",  batches: 3, avgCompletion: 80, rating: 4.6 },
  { id: "T-1039", name: "Aanya Verma",   batches: 2, avgCompletion: 74, rating: 4.4 },
  { id: "T-1038", name: "Veer Malhotra", batches: 2, avgCompletion: 68, rating: 4.2 },
  { id: "T-1037", name: "Kavya Menon",   batches: 1, avgCompletion: 65, rating: 4.0 },
];

const BATCHES = [
  { id: "B-1042", name: "Code Unnati - Cohort 7", trainer: "Praful Bhoyar", completion: 72, placement: 88 },
  { id: "B-1041", name: "Web Dev Sprint 25",      trainer: "Sneha Iyer",    completion: 65, placement: 84 },
  { id: "B-1040", name: "DSA Fundamentals 2025",  trainer: "Vikram Joshi",  completion: 88, placement: 91 },
  { id: "B-1039", name: "ML Foundations Batch 3", trainer: "Praful Bhoyar", completion: 45, placement: 70 },
  { id: "B-1038", name: "Deep Learning Pilot",    trainer: "Sneha Iyer",    completion: 22, placement: 65 },
  { id: "B-1037", name: "Aptitude Sprint Spring", trainer: "Vikram Joshi",  completion: 100, placement: 81 },
  { id: "B-1036", name: "Capstone Cohort B",      trainer: "Praful Bhoyar", completion: 100, placement: 96 },
  { id: "B-1035", name: "Python Bootcamp 2026",   trainer: "Sneha Iyer",    completion: 14, placement: 0  },
];

// ─────────────────────── tab + column config ───────────────────────

const TAB_CONFIG = {
  students: {
    label: "Student Reports",
    icon: FiBookOpen,
    rows: STUDENTS,
    searchKeys: ["name", "id", "batch"],
    columns: [
      { key: "name",       label: "Name",          render: (r) => <span className="text-sm font-semibold text-gray-900">{r.name}</span> },
      { key: "batch",      label: "Batch",         render: (r) => <span className="inline-flex px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs font-mono font-semibold">{r.batch}</span> },
      { key: "completion", label: "Completion %",  render: (r) => <ProgressCell value={r.completion} /> },
      { key: "attendance", label: "Attendance",    render: (r) => <span className="text-sm text-gray-700">{r.attendance}%</span> },
      { key: "score",      label: "Score",         render: (r) => <span className="text-sm font-bold text-gray-900">{r.score}</span> },
    ],
  },
  trainers: {
    label: "Trainer Reports",
    icon: FiUserCheck,
    rows: TRAINERS,
    searchKeys: ["name", "id"],
    columns: [
      { key: "name",          label: "Trainer",        render: (r) => <span className="text-sm font-semibold text-gray-900">{r.name}</span> },
      { key: "batches",       label: "Batches",        render: (r) => <span className="text-sm font-semibold text-gray-900">{r.batches}</span> },
      { key: "avgCompletion", label: "Avg Completion", render: (r) => <ProgressCell value={r.avgCompletion} /> },
      { key: "rating",        label: "Feedback Rating", render: (r) => <span className="text-sm font-bold text-amber-600">★ {r.rating}</span> },
    ],
  },
  batches: {
    label: "Batch Reports",
    icon: FiLayers,
    rows: BATCHES,
    searchKeys: ["name", "id", "trainer"],
    columns: [
      { key: "name",       label: "Batch",        render: (r) => <span className="text-sm font-semibold text-gray-900">{r.name}</span> },
      { key: "trainer",    label: "Trainer",      render: (r) => <span className="text-sm text-gray-700">{r.trainer}</span> },
      { key: "completion", label: "Completion %", render: (r) => <ProgressCell value={r.completion} /> },
      { key: "placement",  label: "Placement %",  render: (r) => <span className="text-sm font-bold text-purple-700">{r.placement}%</span> },
    ],
  },
};

const PAGE_SIZE = 6;

const progressColor = (pct) => {
  if (pct >= 80) return "bg-emerald-500";
  if (pct >= 60) return "bg-purple-500";
  if (pct >= 40) return "bg-amber-500";
  return "bg-red-500";
};

const ProgressCell = ({ value }) => (
  <div className="flex items-center gap-3">
    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden min-w-[90px]">
      <div className={`h-full ${progressColor(value)} rounded-full`} style={{ width: `${value}%` }} />
    </div>
    <span className="text-xs font-bold text-gray-700 min-w-[36px] text-right">{value}%</span>
  </div>
);

// ─────────────────────── csv export ───────────────────────

const downloadCSV = (rows, columns, filename) => {
  const escape = (v) => {
    const s = v == null ? "" : String(v);
    return `"${s.replace(/"/g, '""')}"`;
  };
  const header = columns.map((c) => escape(c.label)).join(",");
  const lines = rows.map((r) => columns.map((c) => escape(r[c.key])).join(","));
  const csv = "﻿" + [header, ...lines].join("\n"); // BOM so Excel reads UTF-8 correctly
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// ─────────────────────── page ───────────────────────

const ReportsPage = () => {
  const [tab, setTab] = useState("students");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { toast } = useToast();

  const cfg = TAB_CONFIG[tab];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return cfg.rows;
    return cfg.rows.filter((r) =>
      cfg.searchKeys.some((k) => String(r[k] || "").toLowerCase().includes(q))
    );
  }, [cfg, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleTabChange = (next) => {
    setTab(next);
    setSearch("");
    setPage(1);
  };

  const handleExport = () => {
    if (filtered.length === 0) {
      toast({ title: "Nothing to export", message: "The current filter has no rows.", variant: "info" });
      return;
    }
    const filename = `${tab}-report-${new Date().toISOString().slice(0, 10)}.csv`;
    downloadCSV(filtered, cfg.columns, filename);
    toast({
      title: "Export ready",
      message: `${filtered.length} ${cfg.label.toLowerCase()} downloaded.`,
      variant: "success",
    });
  };

  const tabs = Object.entries(TAB_CONFIG).map(([id, c]) => ({
    id,
    label: c.label,
    icon: c.icon,
    count: c.rows.length,
  }));

  return (
    <div className="w-full bg-slate-50 min-h-full">
      <div className="bg-gradient-to-r from-purple-50 via-white to-indigo-50 border-b border-purple-100">
        <div className="px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-semibold text-gray-900">Reports</h1>
          <p className="text-sm text-gray-600 mt-1">
            Filter, search, and export student / trainer / batch reports as CSV
          </p>
        </div>
      </div>

      <div className="w-full px-6 lg:px-8 py-6 space-y-5">
        <Tabs tabs={tabs} activeId={tab} onChange={handleTabChange} />

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder={`Search ${cfg.label.toLowerCase()}…`}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-transparent rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white focus:border-gray-200 transition-all duration-200"
              />
            </div>
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-[0_8px_24px_-6px_rgba(124,58,237,0.45)] active:scale-[0.99] transition-all duration-200"
            >
              <FiDownload className="w-4 h-4" />
              Export CSV
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            {filtered.length} of {cfg.rows.length} rows
          </p>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  {cfg.columns.map((c) => (
                    <th key={c.key} className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {visible.length === 0 ? (
                  <tr>
                    <td colSpan={cfg.columns.length} className="px-6 py-12">
                      <div className="text-center">
                        <div className="inline-flex p-3 rounded-2xl bg-gray-100 text-gray-400 mb-3">
                          <FiInbox className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-medium text-gray-900">No rows match your search</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  visible.map((r) => (
                    <tr key={r.id} className="hover:bg-purple-50/40 transition-colors">
                      {cfg.columns.map((c) => (
                        <td key={c.key} className="px-6 py-3">{c.render(r)}</td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-500">Page {safePage} of {totalPages}</p>
              <div className="flex gap-2">
                <button type="button" disabled={safePage === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  Previous
                </button>
                <button type="button" disabled={safePage === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
