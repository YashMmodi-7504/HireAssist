import React, { useMemo, useState } from "react";
import {
  FiCheck,
  FiX,
  FiEye,
  FiInbox,
  FiClock,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import GradientCard from "../../components/ui/GradientCard";
import { useConfirm } from "../../components/ui/ConfirmDialog";
import { useToast } from "../../components/ui/Toaster";

const SEED = [
  { id: "REQ-3042", name: "Aarav Mehta",   email: "aarav.mehta@example.com",  course: "Advanced DSA",     status: "pending" },
  { id: "REQ-3041", name: "Diya Patel",    email: "diya.patel@example.com",   course: "ML Foundations",   status: "pending" },
  { id: "REQ-3040", name: "Kabir Singh",   email: "kabir.s@example.com",      course: "System Design",    status: "approved" },
  { id: "REQ-3039", name: "Ishita Rao",    email: "ishita.rao@example.com",   course: "Advanced DSA",     status: "rejected" },
  { id: "REQ-3038", name: "Reyansh Iyer",  email: "reyansh.iyer@example.com", course: "Web Performance",  status: "pending" },
  { id: "REQ-3036", name: "Vihaan Joshi",  email: "vihaan.j@example.com",     course: "Deep Learning",    status: "pending" },
  { id: "REQ-3035", name: "Anvi Reddy",    email: "anvi.r@example.com",       course: "ML Foundations",   status: "approved" },
  { id: "REQ-3033", name: "Saanvi Bose",   email: "saanvi.b@example.com",     course: "System Design",    status: "pending" },
];

const statusConfig = {
  pending:  { label: "Pending",  className: "text-amber-700 bg-amber-50 border-amber-100", dot: "bg-amber-500" },
  approved: { label: "Approved", className: "text-green-700 bg-green-50 border-green-100", dot: "bg-green-500" },
  rejected: { label: "Rejected", className: "text-red-700 bg-red-50 border-red-100",       dot: "bg-red-500" },
};

const initials = (name) =>
  name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

const STATUS_FILTERS = ["all", "pending", "approved", "rejected"];

const ApproveCourseAccessPage = () => {
  const [rows, setRows] = useState(SEED);
  const [filter, setFilter] = useState("pending");
  const { confirm } = useConfirm();
  const { toast } = useToast();

  const [rejectFor, setRejectFor] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const filtered = useMemo(
    () => rows.filter((r) => filter === "all" || r.status === filter),
    [rows, filter]
  );

  const stats = useMemo(
    () => ({
      pending: rows.filter((r) => r.status === "pending").length,
      approved: rows.filter((r) => r.status === "approved").length,
      rejected: rows.filter((r) => r.status === "rejected").length,
    }),
    [rows]
  );

  const handleApprove = async (r) => {
    const ok = await confirm({
      title: "Approve access?",
      message: `Grant ${r.name} access to ${r.course}.`,
      confirmLabel: "Approve",
    });
    if (!ok) return;
    setRows((prev) => prev.map((x) => (x.id === r.id ? { ...x, status: "approved" } : x)));
    toast({ title: "Access granted", message: `${r.name} can now view ${r.course}.`, variant: "success" });
  };

  const handleReject = (r) => {
    setRejectFor(r);
    setRejectReason("");
  };

  const submitReject = () => {
    if (!rejectReason.trim()) {
      toast({ title: "Reason required", message: "Add a short reason so the student understands.", variant: "error" });
      return;
    }
    const r = rejectFor;
    setRows((prev) => prev.map((x) => (x.id === r.id ? { ...x, status: "rejected" } : x)));
    toast({
      title: "Access rejected",
      message: `${r.name} was notified — "${rejectReason.slice(0, 60)}${rejectReason.length > 60 ? "…" : ""}"`,
      variant: "info",
    });
    setRejectFor(null);
    setRejectReason("");
  };

  const handleView = (r) => {
    toast({ title: r.name, message: `${r.email} · ${r.course}`, variant: "info" });
  };

  return (
    <div className="w-full bg-slate-50 min-h-full">
      <div className="bg-gradient-to-r from-purple-50 via-white to-indigo-50 border-b border-purple-100">
        <div className="px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-semibold text-gray-900">Approve Course Access</h1>
          <p className="text-sm text-gray-600 mt-1">Pending course access requests from students</p>
        </div>
      </div>

      <div className="w-full px-6 lg:px-8 py-6 space-y-5">
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <GradientCard icon={FiClock}        label="Pending Requests" value={stats.pending}  color="orange" />
          <GradientCard icon={FiCheckCircle}  label="Approved"          value={stats.approved} color="green" />
          <GradientCard icon={FiXCircle}      label="Rejected"          value={stats.rejected} color="red" />
        </section>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {STATUS_FILTERS.map((s) => {
                const active = filter === s;
                const label = s === "all" ? "All" : statusConfig[s]?.label || s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFilter(s)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all duration-200 ${
                      active
                        ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                        : "bg-white text-gray-700 border-gray-200 hover:border-purple-300 hover:text-purple-700"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-gray-500">{filtered.length} requests</p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px]">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Student</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Course</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12">
                      <div className="text-center">
                        <div className="inline-flex p-3 rounded-2xl bg-gray-100 text-gray-400 mb-3">
                          <FiInbox className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-medium text-gray-900">No requests in this filter</p>
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
                            <div>
                              <p className="text-sm font-semibold text-gray-900">{r.name}</p>
                              <p className="text-xs text-gray-500">{r.email}</p>
                            </div>
                          </div>
                        </td>
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

      {/* Reject reason modal */}
      {rejectFor && (
        <div className="fixed inset-0 z-[55] flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-[fadeIn_180ms_ease-out]"
            onClick={() => setRejectFor(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-md w-full p-6 animate-[fadeIn_220ms_ease-out]">
            <h3 className="text-base font-semibold text-gray-900">Reject access for {rejectFor.name}?</h3>
            <p className="text-sm text-gray-600 mt-1">
              Tell the student why so they understand the decision.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              placeholder="e.g. Prerequisite course not completed yet"
              className="w-full mt-4 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-400 focus:border-transparent outline-none transition-all duration-200 text-sm placeholder:text-gray-400 resize-none"
              autoFocus
            />
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-5">
              <button
                type="button"
                onClick={() => setRejectFor(null)}
                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitReject}
                className="px-4 py-2 text-white text-sm font-semibold rounded-lg shadow-sm bg-red-600 hover:bg-red-700 active:scale-[0.98] transition-all"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApproveCourseAccessPage;
