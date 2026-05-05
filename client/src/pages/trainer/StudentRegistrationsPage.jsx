import React, { useMemo, useState } from "react";
import {
  FiSearch,
  FiCheck,
  FiX,
  FiEye,
  FiInbox,
  FiUserPlus,
} from "react-icons/fi";
import { useConfirm } from "../../components/ui/ConfirmDialog";
import { useToast } from "../../components/ui/Toaster";

const SEED = [
  { id: "REG-2042", name: "Aarav Mehta",  email: "aarav.mehta@example.com",  college: "VIT",   course: "Code Unnati",     status: "pending"  },
  { id: "REG-2041", name: "Diya Patel",   email: "diya.patel@example.com",   college: "BITS",  course: "Code Unnati",     status: "approved" },
  { id: "REG-2040", name: "Kabir Singh",  email: "kabir.s@example.com",      college: "IIT-D", course: "Value Added",     status: "pending"  },
  { id: "REG-2039", name: "Ishita Rao",   email: "ishita.rao@example.com",   college: "NIT-T", course: "Code Unnati",     status: "rejected" },
  { id: "REG-2038", name: "Reyansh Iyer", email: "reyansh.iyer@example.com", college: "VIT",   course: "Academic Course", status: "approved" },
  { id: "REG-2036", name: "Vihaan Joshi", email: "vihaan.j@example.com",     college: "IIT-B", course: "Value Added",     status: "pending"  },
  { id: "REG-2035", name: "Anvi Reddy",   email: "anvi.r@example.com",       college: "BITS",  course: "Code Unnati",     status: "pending"  },
  { id: "REG-2033", name: "Saanvi Bose",  email: "saanvi.b@example.com",     college: "NIT-T", course: "Academic Course", status: "approved" },
  { id: "REG-2032", name: "Mihir Kapoor", email: "mihir.k@example.com",      college: "VIT",   course: "Code Unnati",     status: "pending"  },
  { id: "REG-2031", name: "Pari Shah",    email: "pari.shah@example.com",    college: "IIT-D", course: "Value Added",     status: "rejected" },
];

const statusConfig = {
  pending:  { label: "Pending",  className: "text-amber-700 bg-amber-50 border-amber-100", dot: "bg-amber-500" },
  approved: { label: "Approved", className: "text-green-700 bg-green-50 border-green-100", dot: "bg-green-500" },
  rejected: { label: "Rejected", className: "text-red-700 bg-red-50 border-red-100",       dot: "bg-red-500" },
};

const initials = (name) =>
  name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

const selectClass =
  "px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200 cursor-pointer";

const StudentRegistrationsPage = () => {
  const [rows, setRows] = useState(SEED);
  const [search, setSearch] = useState("");
  const [college, setCollege] = useState("all");
  const [course, setCourse] = useState("all");
  const [status, setStatus] = useState("all");
  const { confirm } = useConfirm();
  const { toast } = useToast();

  const colleges = useMemo(() => Array.from(new Set(rows.map((r) => r.college))).sort(), [rows]);
  const courses = useMemo(() => Array.from(new Set(rows.map((r) => r.course))).sort(), [rows]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      const matchesSearch =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q);
      const matchesCollege = college === "all" || r.college === college;
      const matchesCourse = course === "all" || r.course === course;
      const matchesStatus = status === "all" || r.status === status;
      return matchesSearch && matchesCollege && matchesCourse && matchesStatus;
    });
  }, [rows, search, college, course, status]);

  const handleApprove = async (r) => {
    const ok = await confirm({
      title: "Approve registration?",
      message: `${r.name} will be enrolled in ${r.course}.`,
      confirmLabel: "Approve",
    });
    if (!ok) return;
    setRows((prev) => prev.map((x) => (x.id === r.id ? { ...x, status: "approved" } : x)));
    toast({ title: "Registration approved", message: `${r.name} added to ${r.course}.`, variant: "success" });
  };

  const handleReject = async (r) => {
    const ok = await confirm({
      title: "Reject registration?",
      message: `${r.name} won't be enrolled. They can re-apply later.`,
      confirmLabel: "Reject",
      variant: "danger",
    });
    if (!ok) return;
    setRows((prev) => prev.map((x) => (x.id === r.id ? { ...x, status: "rejected" } : x)));
    toast({ title: "Registration rejected", message: `${r.name} has been notified.`, variant: "info" });
  };

  const handleView = (r) => {
    toast({ title: r.name, message: `${r.email} · ${r.college} · ${r.course}`, variant: "info" });
  };

  const handleReset = () => {
    setSearch("");
    setCollege("all");
    setCourse("all");
    setStatus("all");
  };

  return (
    <div className="w-full bg-slate-50 min-h-full">
      <div className="bg-gradient-to-r from-purple-50 via-white to-indigo-50 border-b border-purple-100">
        <div className="px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-semibold text-gray-900">Student Registrations</h1>
          <p className="text-sm text-gray-600 mt-1">Approve and manage incoming requests</p>
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
                placeholder="Search by name, email, or registration id…"
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-transparent rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white focus:border-gray-200 transition-all duration-200"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <select value={college} onChange={(e) => setCollege(e.target.value)} className={selectClass}>
                <option value="all">All Colleges</option>
                {colleges.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={course} onChange={(e) => setCourse(e.target.value)} className={selectClass}>
                <option value="all">All Courses</option>
                {courses.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass}>
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
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
            {filtered.length} of {rows.length} registrations
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px]">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Student</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">College</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Course</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-16">
                      <div className="text-center">
                        <div className="inline-flex p-3 rounded-2xl bg-purple-50 text-purple-600 mb-3">
                          <FiUserPlus className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-medium text-gray-900">No registrations yet</p>
                        <p className="text-xs text-gray-500 mt-1">
                          New requests will appear here when students sign up
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((r) => {
                    const cfg = statusConfig[r.status] || statusConfig.pending;
                    const isPending = r.status === "pending";
                    return (
                      <tr key={r.id} className="hover:bg-purple-50/40 transition-colors">
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                              {initials(r.name)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">{r.name}</p>
                              <p className="text-xs text-gray-500 truncate">{r.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-700">{r.college}</td>
                        <td className="px-6 py-3 text-sm text-gray-700">{r.course}</td>
                        <td className="px-6 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${cfg.className}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-center justify-end gap-1.5">
                            {isPending && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleApprove(r)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-sm active:scale-[0.98] transition-all"
                                >
                                  <FiCheck className="w-3 h-3" />
                                  Approve
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleReject(r)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm active:scale-[0.98] transition-all"
                                >
                                  <FiX className="w-3 h-3" />
                                  Reject
                                </button>
                              </>
                            )}
                            <button
                              type="button"
                              onClick={() => handleView(r)}
                              className="p-1.5 rounded-md text-gray-500 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                              aria-label={`View ${r.name}`}
                            >
                              <FiEye className="w-4 h-4" />
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

export default StudentRegistrationsPage;
