import React, { useMemo, useState } from "react";
import {
  FiSearch,
  FiPlus,
  FiClock,
  FiUsers,
  FiBook,
  FiEdit2,
  FiEye,
  FiSend,
  FiInbox,
} from "react-icons/fi";
import { useToast } from "../../components/ui/Toaster";

const COURSES = [
  { id: "C-1042", title: "Python Fundamentals",      category: "Backend",    level: "Beginner",     duration: "32h", students: 124, status: "published", description: "Variables, control flow, functions, and built-in data types." },
  { id: "C-1041", title: "Object-Oriented Python",   category: "Backend",    level: "Intermediate", duration: "24h", students: 86,  status: "published", description: "Classes, inheritance, polymorphism, and dunder methods in depth." },
  { id: "C-1040", title: "React + TypeScript",       category: "Frontend",   level: "Intermediate", duration: "40h", students: 152, status: "published", description: "Modern React with TypeScript, hooks, context, and ecosystem." },
  { id: "C-1039", title: "Data Structures & Algos",  category: "DSA",        level: "Intermediate", duration: "60h", students: 198, status: "published", description: "Arrays, lists, trees, graphs, and core algorithm patterns." },
  { id: "C-1038", title: "Machine Learning Foundations", category: "ML",     level: "Intermediate", duration: "48h", students: 92,  status: "draft",     description: "Supervised, unsupervised learning, evaluation, and feature engineering." },
  { id: "C-1037", title: "Deep Learning with PyTorch", category: "ML",       level: "Advanced",     duration: "55h", students: 64,  status: "published", description: "Neural nets, CNNs, RNNs, and training pipelines in PyTorch." },
  { id: "C-1036", title: "Web Development Basics",   category: "Frontend",   level: "Beginner",     duration: "28h", students: 188, status: "published", description: "HTML, CSS, and modern JavaScript fundamentals for the web." },
  { id: "C-1035", title: "Aptitude & Reasoning",     category: "Aptitude",   level: "Beginner",     duration: "20h", students: 220, status: "published", description: "Quantitative, logical, and verbal reasoning for placement prep." },
  { id: "C-1034", title: "System Design Primer",     category: "Backend",    level: "Advanced",     duration: "36h", students: 48,  status: "draft",     description: "Scalability, caching, queues, and architecture decisions for senior roles." },
];

const categoryAccent = {
  Backend:  "from-blue-500 to-cyan-500",
  Frontend: "from-purple-500 to-indigo-500",
  DSA:      "from-emerald-500 to-teal-500",
  ML:       "from-pink-500 to-rose-500",
  Aptitude: "from-orange-500 to-amber-500",
};

const levelChip = {
  Beginner:     "text-green-700 bg-green-50 border-green-100",
  Intermediate: "text-amber-700 bg-amber-50 border-amber-100",
  Advanced:     "text-red-700 bg-red-50 border-red-100",
};

const statusChip = {
  published: { label: "Published", className: "text-green-700 bg-green-50 border-green-100", dot: "bg-green-500" },
  draft:     { label: "Draft",     className: "text-gray-600 bg-gray-100 border-gray-200",   dot: "bg-gray-400" },
};

const selectClass =
  "px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200 cursor-pointer";

const CourseCard = ({ course, onView, onEdit, onAssign }) => {
  const accent = categoryAccent[course.category] || "from-purple-500 to-indigo-500";
  const lvl = levelChip[course.level] || levelChip.Beginner;
  const status = statusChip[course.status] || statusChip.draft;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col">
      <div className={`h-1 bg-gradient-to-r ${accent}`} />
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-mono font-semibold text-gray-500">{course.id}</p>
            <h3 className="text-base font-semibold text-gray-900 mt-1 leading-snug">
              {course.title}
            </h3>
          </div>
          <span
            className={`flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${status.className}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </span>
        </div>

        <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 mb-4">
          {course.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-100">
            {course.category}
          </span>
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${lvl}`}>
            {course.level}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-600 mb-4">
          <span className="inline-flex items-center gap-1.5">
            <FiClock className="w-3.5 h-3.5 text-gray-400" />
            {course.duration}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <FiUsers className="w-3.5 h-3.5 text-gray-400" />
            {course.students} enrolled
          </span>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onView(course)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            <FiEye className="w-3.5 h-3.5" />
            View
          </button>
          <button
            type="button"
            onClick={() => onEdit(course)}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
            aria-label={`Edit ${course.title}`}
          >
            <FiEdit2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onAssign(course)}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg shadow-sm active:scale-[0.98] transition-all"
          >
            <FiSend className="w-3.5 h-3.5" />
            Assign
          </button>
        </div>
      </div>
    </div>
  );
};

const CoursePage = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [level, setLevel] = useState("all");
  const { toast } = useToast();

  const categories = useMemo(
    () => Array.from(new Set(COURSES.map((c) => c.category))).sort(),
    []
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return COURSES.filter((c) => {
      const matchesSearch =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q);
      const matchesCategory = category === "all" || c.category === category;
      const matchesLevel = level === "all" || c.level === level;
      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [search, category, level]);

  const handleView = (c) =>
    toast({ title: c.title, message: `${c.duration} · ${c.students} students`, variant: "info" });
  const handleEdit = (c) =>
    toast({ title: `Editing ${c.title}`, message: "Edit dialog coming soon.", variant: "info" });
  const handleAssign = (c) =>
    toast({ title: "Assignment started", message: `Pick batches for ${c.title}.`, variant: "success" });

  const handleReset = () => {
    setSearch("");
    setCategory("all");
    setLevel("all");
  };

  return (
    <div className="w-full bg-slate-50 min-h-full">
      <div className="bg-gradient-to-r from-purple-50 via-white to-indigo-50 border-b border-purple-100">
        <div className="px-6 lg:px-8 py-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Course Catalog</h1>
            <p className="text-sm text-gray-600 mt-1">Manage and assign courses to batches</p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-[0_8px_24px_-6px_rgba(124,58,237,0.45)] active:scale-[0.99] transition-all duration-200"
          >
            <FiPlus className="w-4 h-4" />
            Create Course
          </button>
        </div>
      </div>

      <div className="w-full px-6 lg:px-8 py-6 space-y-5">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, description, or course id…"
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-transparent rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white focus:border-gray-200 transition-all duration-200"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectClass}>
                <option value="all">All Categories</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={level} onChange={(e) => setLevel(e.target.value)} className={selectClass}>
                <option value="all">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
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
            {filtered.length} of {COURSES.length} courses
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-12 text-center">
            <div className="inline-flex p-3 rounded-2xl bg-purple-50 text-purple-600 mb-3">
              <FiBook className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-gray-900">No courses match your filters</p>
            <p className="text-xs text-gray-500 mt-1">Try a different category or level</p>
            <button
              type="button"
              onClick={handleReset}
              className="mt-4 inline-flex px-4 py-2 text-sm font-semibold text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((c) => (
              <CourseCard
                key={c.id}
                course={c}
                onView={handleView}
                onEdit={handleEdit}
                onAssign={handleAssign}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursePage;
