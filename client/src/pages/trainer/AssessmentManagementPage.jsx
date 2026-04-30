import React, { useMemo, useState } from "react";
import {
  FiSearch,
  FiPlus,
  FiClipboard,
  FiPlayCircle,
  FiCheckCircle,
  FiTrendingUp,
  FiList,
  FiSend,
  FiInbox,
} from "react-icons/fi";
import GradientCard from "../../components/ui/GradientCard";
import { useToast } from "../../components/ui/Toaster";

const ASSESSMENTS = [
  { id: "A-2042", name: "Python Basics Quiz",         course: "Python Fundamentals",  duration: "30m", students: 124, avgScore: 86, status: "active" },
  { id: "A-2041", name: "OOP Patterns Test",          course: "Object-Oriented Python", duration: "45m", students: 86,  avgScore: 78, status: "active" },
  { id: "A-2040", name: "DSA Mock - Arrays & Hash",   course: "Data Structures & Algos", duration: "1h",  students: 198, avgScore: 72, status: "active" },
  { id: "A-2039", name: "React Hooks Deep Dive",      course: "React + TypeScript",   duration: "40m", students: 152, avgScore: 84, status: "completed" },
  { id: "A-2038", name: "ML Foundations Mid-term",    course: "Machine Learning Foundations", duration: "1h 30m", students: 92,  avgScore: 0,  status: "draft" },
  { id: "A-2037", name: "Aptitude Sprint",            course: "Aptitude & Reasoning", duration: "20m", students: 220, avgScore: 81, status: "completed" },
  { id: "A-2036", name: "Web Dev Capstone Quiz",      course: "Web Development Basics", duration: "35m", students: 188, avgScore: 79, status: "active" },
  { id: "A-2035", name: "PyTorch Build Test",         course: "Deep Learning with PyTorch", duration: "1h 15m", students: 64,  avgScore: 76, status: "completed" },
];

const statusConfig = {
  draft:     { label: "Draft",     className: "text-gray-600 bg-gray-100 border-gray-200",   dot: "bg-gray-400" },
  active:    { label: "Active",    className: "text-blue-700 bg-blue-50 border-blue-100",     dot: "bg-blue-500" },
  completed: { label: "Completed", className: "text-green-700 bg-green-50 border-green-100", dot: "bg-green-500" },
};

const scoreTone = (n) => {
  if (n === 0) return "text-gray-400";
  if (n >= 80) return "text-green-700";
  if (n >= 65) return "text-amber-700";
  return "text-red-700";
};

const selectClass =
  "px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200 cursor-pointer";

const AssessmentManagementPage = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const { toast } = useToast();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ASSESSMENTS.filter((a) => {
      const matchesSearch =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.course.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q);
      const matchesStatus = status === "all" || a.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  const stats = useMemo(() => {
    const total = ASSESSMENTS.length;
    const active = ASSESSMENTS.filter((a) => a.status === "active").length;
    const completed = ASSESSMENTS.filter((a) => a.status === "completed").length;
    const scored = ASSESSMENTS.filter((a) => a.avgScore > 0);
    const avg = scored.length
      ? Math.round(scored.reduce((acc, a) => acc + a.avgScore, 0) / scored.length)
      : 0;
    return { total, active, completed, avg };
  }, []);

  const handleViewQuestions = (a) =>
    toast({ title: a.name, message: "Question bank preview coming soon.", variant: "info" });
  const handleAssign = (a) =>
    toast({ title: "Assignment started", message: `Pick batches for ${a.name}.`, variant: "success" });

  const handleReset = () => {
    setSearch("");
    setStatus("all");
  };

  return (
    <div className="w-full bg-slate-50 min-h-full">
      <div className="bg-gradient-to-r from-purple-50 via-white to-indigo-50 border-b border-purple-100">
        <div className="px-6 lg:px-8 py-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Assessments</h1>
            <p className="text-sm text-gray-600 mt-1">Manage tests and review scores</p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-[0_8px_24px_-6px_rgba(124,58,237,0.45)] active:scale-[0.99] transition-all duration-200"
          >
            <FiPlus className="w-4 h-4" />
            Create Assessment
          </button>
        </div>
      </div>

      <div className="w-full px-6 lg:px-8 py-6 space-y-6">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <GradientCard icon={FiClipboard}   label="Total Assessments" value={stats.total}     color="blue" />
          <GradientCard icon={FiPlayCircle}  label="Active Tests"      value={stats.active}    color="purple" />
          <GradientCard icon={FiCheckCircle} label="Completed"         value={stats.completed} color="green" />
          <GradientCard icon={FiTrendingUp}  label="Avg Score"         value={`${stats.avg}%`} progress={stats.avg} color="orange" />
        </section>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by assessment, course, or id…"
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-transparent rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white focus:border-gray-200 transition-all duration-200"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass}>
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            {filtered.length} of {ASSESSMENTS.length} assessments
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px]">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Assessment</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Course</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Duration</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Students</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Avg Score</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
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
                        <p className="text-sm font-medium text-gray-900">No assessments match your filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((a) => {
                    const cfg = statusConfig[a.status] || statusConfig.draft;
                    return (
                      <tr key={a.id} className="hover:bg-purple-50/40 transition-colors">
                        <td className="px-6 py-3">
                          <p className="text-sm font-semibold text-gray-900">{a.name}</p>
                          <p className="text-xs text-gray-500 font-mono">{a.id}</p>
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-700">{a.course}</td>
                        <td className="px-6 py-3 text-sm text-gray-700 whitespace-nowrap">{a.duration}</td>
                        <td className="px-6 py-3 text-sm font-semibold text-gray-900">{a.students}</td>
                        <td className="px-6 py-3">
                          <span className={`text-sm font-bold ${scoreTone(a.avgScore)}`}>
                            {a.avgScore > 0 ? `${a.avgScore}%` : "—"}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${cfg.className}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleViewQuestions(a)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
                            >
                              <FiList className="w-3 h-3" />
                              Questions
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAssign(a)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg shadow-sm active:scale-[0.98] transition-all"
                            >
                              <FiSend className="w-3 h-3" />
                              Assign
                            </button>
                          </div>
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

export default AssessmentManagementPage;
