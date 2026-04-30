import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiPlus,
  FiLayers,
  FiUsers,
  FiCheckCircle,
  FiTrendingUp,
  FiMoreVertical,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiInbox,
} from "react-icons/fi";
import GradientCard from "../../components/ui/GradientCard";
import { useConfirm } from "../../components/ui/ConfirmDialog";
import { useToast } from "../../components/ui/Toaster";

const SEED = [
  { id: "B-1042", name: "Code Unnati - Cohort 7",  course: "Code Unnati",          trainer: "Praful Bhoyar",  college: "VIT",   students: 28, progress: 72, status: "active",    track: "AC",    startDate: "2025-08-15" },
  { id: "B-1041", name: "Web Dev Sprint 25",       course: "Web Development",      trainer: "Sneha Iyer",     college: "BITS",  students: 24, progress: 65, status: "active",    track: "CU4FO", startDate: "2025-08-01" },
  { id: "B-1040", name: "DSA Fundamentals 2025",   course: "Data Structures",      trainer: "Vikram Joshi",   college: "IIT-D", students: 22, progress: 88, status: "active",    track: "AC",    startDate: "2025-07-10" },
  { id: "B-1039", name: "ML Foundations Batch 3",  course: "Machine Learning",     trainer: "Praful Bhoyar",  college: "NIT-T", students: 18, progress: 45, status: "active",    track: "VAC",   startDate: "2025-09-10" },
  { id: "B-1038", name: "Deep Learning Pilot",     course: "Deep Learning",        trainer: "Sneha Iyer",     college: "VIT",   students: 14, progress: 22, status: "active",    track: "VAC",   startDate: "2026-01-15" },
  { id: "B-1037", name: "Aptitude Sprint Spring",  course: "Aptitude & Reasoning", trainer: "Vikram Joshi",   college: "BITS",  students: 32, progress: 100, status: "completed", track: "AC",   startDate: "2024-08-01" },
  { id: "B-1036", name: "Capstone Cohort B",       course: "Web Development",      trainer: "Praful Bhoyar",  college: "IIT-B", students: 12, progress: 100, status: "completed", track: "CU4FO", startDate: "2024-09-05" },
  { id: "B-1035", name: "Python Bootcamp 2026",    course: "Python Fundamentals",  trainer: "Sneha Iyer",     college: "NIT-T", students: 30, progress: 14, status: "active",    track: "AC",   startDate: "2026-02-01" },
];

const trackChip = {
  AC:    "text-blue-700 bg-blue-50 border-blue-100",
  CU4FO: "text-purple-700 bg-purple-50 border-purple-100",
  VAC:   "text-orange-700 bg-orange-50 border-orange-100",
};

const statusChip = {
  active:    { label: "Active",    className: "text-green-700 bg-green-50 border-green-100", dot: "bg-green-500" },
  completed: { label: "Completed", className: "text-gray-700 bg-gray-100 border-gray-200",   dot: "bg-gray-400" },
};

const progressColor = (pct) => {
  if (pct >= 80) return "bg-green-500";
  if (pct >= 50) return "bg-purple-500";
  if (pct >= 25) return "bg-blue-500";
  return "bg-amber-500";
};

const selectClass =
  "px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200 cursor-pointer";

const PAGE_SIZE = 6;

const RowActions = ({ batch, onView, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="p-1.5 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        aria-label={`Actions for ${batch.name}`}
      >
        <FiMoreVertical className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-100 rounded-lg shadow-xl py-1 z-20">
          <button type="button" onClick={() => { setOpen(false); onView(batch); }}
            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5">
            <FiEye className="w-4 h-4 text-gray-400" />
            View
          </button>
          <button type="button" onClick={() => { setOpen(false); onEdit(batch); }}
            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5">
            <FiEdit2 className="w-4 h-4 text-gray-400" />
            Edit
          </button>
          <div className="my-1 border-t border-gray-100" />
          <button type="button" onClick={() => { setOpen(false); onDelete(batch); }}
            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2.5">
            <FiTrash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

const BatchListPage = () => {
  const [batches, setBatches] = useState(SEED);
  const [search, setSearch] = useState("");
  const [track, setTrack] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const { confirm } = useConfirm();
  const { toast } = useToast();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return batches.filter((b) => {
      const matchesSearch =
        !q ||
        b.name.toLowerCase().includes(q) ||
        b.course.toLowerCase().includes(q) ||
        b.trainer.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q);
      const matchesTrack = track === "all" || b.track === track;
      const matchesStatus = status === "all" || b.status === status;
      return matchesSearch && matchesTrack && matchesStatus;
    });
  }, [batches, search, track, status]);

  const stats = useMemo(() => {
    const total = batches.length;
    const active = batches.filter((b) => b.status === "active").length;
    const completed = batches.filter((b) => b.status === "completed").length;
    const totalStudents = batches.reduce((acc, b) => acc + b.students, 0);
    return { total, active, completed, totalStudents };
  }, [batches]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleView = (b) =>
    toast({ title: b.name, message: `${b.students} students · ${b.progress}% complete`, variant: "info" });
  const handleEdit = (b) =>
    toast({ title: `Editing ${b.name}`, message: "Edit dialog coming soon.", variant: "info" });
  const handleDelete = async (b) => {
    const ok = await confirm({
      title: "Delete this batch?",
      message: `${b.name} (${b.students} students) will be permanently removed. This cannot be undone.`,
      confirmLabel: "Delete",
      variant: "danger",
    });
    if (!ok) return;
    setBatches((prev) => prev.filter((x) => x.id !== b.id));
    toast({ title: "Batch deleted", message: `${b.name} removed.`, variant: "info" });
  };

  const handleReset = () => {
    setSearch("");
    setTrack("all");
    setStatus("all");
    setPage(1);
  };

  return (
    <div className="w-full bg-slate-50 min-h-full">
      <div className="bg-gradient-to-r from-purple-50 via-white to-indigo-50 border-b border-purple-100">
        <div className="px-6 lg:px-8 py-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">View Batches</h1>
            <p className="text-sm text-gray-600 mt-1">All batches across colleges and tracks</p>
          </div>
          <Link
            to="/admin/batch/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-[0_8px_24px_-6px_rgba(124,58,237,0.45)] active:scale-[0.99] transition-all duration-200"
          >
            <FiPlus className="w-4 h-4" />
            Create Batch
          </Link>
        </div>
      </div>

      <div className="w-full px-6 lg:px-8 py-6 space-y-6">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <GradientCard icon={FiLayers}      label="Total Batches"  value={stats.total}         color="purple" />
          <GradientCard icon={FiCheckCircle} label="Active"         value={stats.active}        color="green" />
          <GradientCard icon={FiTrendingUp}  label="Completed"      value={stats.completed}     color="blue" />
          <GradientCard icon={FiUsers}       label="Total Students" value={stats.totalStudents} color="orange" />
        </section>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search by batch, course, trainer, or id…"
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-transparent rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white focus:border-gray-200 transition-all duration-200"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <select value={track} onChange={(e) => { setTrack(e.target.value); setPage(1); }} className={selectClass}>
                <option value="all">All Tracks</option>
                <option value="AC">AC</option>
                <option value="CU4FO">CU4FO</option>
                <option value="VAC">VAC</option>
              </select>
              <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className={selectClass}>
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
              <button type="button" onClick={handleReset}
                className="px-3 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors">
                Reset
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">{filtered.length} of {batches.length} batches</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px]">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Batch</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Course</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Trainer</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Students</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider w-[220px]">Progress</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {visible.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12">
                      <div className="text-center">
                        <div className="inline-flex p-3 rounded-2xl bg-gray-100 text-gray-400 mb-3">
                          <FiInbox className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-medium text-gray-900">No batches match your filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  visible.map((b) => {
                    const status = statusChip[b.status];
                    const track = trackChip[b.track] || trackChip.AC;
                    return (
                      <tr key={b.id} className="hover:bg-purple-50/40 transition-colors">
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2">
                            <div>
                              <p className="text-sm font-semibold text-gray-900">{b.name}</p>
                              <p className="text-xs text-gray-500">{b.id} · {b.college}</p>
                            </div>
                            <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${track}`}>
                              {b.track}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-700">{b.course}</td>
                        <td className="px-6 py-3 text-sm text-gray-700">{b.trainer}</td>
                        <td className="px-6 py-3 text-sm font-semibold text-gray-900">{b.students}</td>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div className={`h-full ${progressColor(b.progress)} rounded-full`} style={{ width: `${b.progress}%` }} />
                            </div>
                            <span className="text-xs font-bold text-gray-700 min-w-[36px] text-right">{b.progress}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${status.className}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-right">
                          <RowActions batch={b} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
                        </td>
                      </tr>
                    );
                  })
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

export default BatchListPage;
