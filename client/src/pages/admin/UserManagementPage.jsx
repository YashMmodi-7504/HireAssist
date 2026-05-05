import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  FiSearch,
  FiPlus,
  FiDownload,
  FiMoreVertical,
  FiEye,
  FiEdit2,
  FiSlash,
  FiUnlock,
  FiTrash2,
  FiInbox,
} from "react-icons/fi";
import { useConfirm } from "../../components/ui/ConfirmDialog";
import { useToast } from "../../components/ui/Toaster";

const SEED_USERS = [
  { id: "U-1042", name: "Aarav Mehta",   email: "aarav.mehta@example.com",  role: "student",  batch: "AC-2025",   status: "active" },
  { id: "U-1041", name: "Diya Patel",    email: "diya.patel@example.com",   role: "student",  batch: "CU4FO-25",  status: "active" },
  { id: "U-1040", name: "Kabir Singh",   email: "kabir.s@example.com",      role: "student",  batch: "VAC-25",    status: "blocked" },
  { id: "U-1039", name: "Ishita Rao",    email: "ishita.rao@example.com",   role: "student",  batch: "AC-2026",   status: "active" },
  { id: "U-1038", name: "Reyansh Iyer",  email: "reyansh.iyer@example.com", role: "student",  batch: "CU4FO-26",  status: "active" },
  { id: "U-1037", name: "Praful Bhoyar", email: "trainer@gmail.com",        role: "trainer",  batch: "—",          status: "active" },
  { id: "U-1036", name: "Vihaan Joshi",  email: "vihaan.j@example.com",     role: "student",  batch: "AC-2025",   status: "blocked" },
  { id: "U-1035", name: "Anvi Reddy",    email: "anvi.r@example.com",       role: "student",  batch: "CU4FO-25",  status: "active" },
  { id: "U-1034", name: "Anand Rao",     email: "admin@gmail.com",          role: "admin",    batch: "—",          status: "active" },
  { id: "U-1033", name: "Saanvi Bose",   email: "saanvi.b@example.com",     role: "student",  batch: "VAC-25",    status: "active" },
  { id: "U-1032", name: "Mihir Kapoor",  email: "mihir.k@example.com",      role: "student",  batch: "AC-2026",   status: "active" },
  { id: "U-1031", name: "Pari Shah",     email: "pari.shah@example.com",    role: "student",  batch: "CU4FO-26",  status: "active" },
  { id: "U-1030", name: "Sneha Iyer",    email: "sneha.i@example.com",      role: "trainer",  batch: "—",          status: "active" },
  { id: "U-1029", name: "Meera Krishnan",email: "director@gmail.com",       role: "director", batch: "—",          status: "active" },
  { id: "U-1028", name: "Vikram Joshi",  email: "vikram.j@example.com",     role: "trainer",  batch: "—",          status: "active" },
  { id: "U-1027", name: "Tanvi Khan",    email: "tanvi.k@example.com",      role: "student",  batch: "AC-2025",   status: "blocked" },
];

const ROLE_FROM_PATH = {
  "/admin/users":           "all",
  "/admin/users/trainers":  "trainer",
  "/admin/users/students":  "student",
  "/admin/users/directors": "director",
  "/admin/users/blocked":   "blocked", // special — filters by status, not role
};

const ROLE_LABELS = { admin: "Admin", trainer: "Trainer", student: "Student", director: "Director" };
const ROLE_ACCENT = {
  admin:    "text-red-700 bg-red-50 border-red-100",
  trainer:  "text-purple-700 bg-purple-50 border-purple-100",
  student:  "text-blue-700 bg-blue-50 border-blue-100",
  director: "text-amber-700 bg-amber-50 border-amber-100",
};

const PAGE_SIZE = 8;

const initials = (name) =>
  name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

const StatusBadge = ({ status }) => {
  const cfg =
    status === "active"
      ? { label: "Active", className: "text-green-700 bg-green-50 border-green-100", dot: "bg-green-500" }
      : { label: "Blocked", className: "text-red-700 bg-red-50 border-red-100", dot: "bg-red-500" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${cfg.className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

const RowActions = ({ user, onView, onEdit, onToggleBlock, onDelete }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isBlocked = user.status === "blocked";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="p-1.5 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        aria-label={`Actions for ${user.name}`}
      >
        <FiMoreVertical className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-100 rounded-lg shadow-xl py-1 z-20">
          <button type="button" onClick={() => { setOpen(false); onView(user); }}
            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5">
            <FiEye className="w-4 h-4 text-gray-400" />
            View Profile
          </button>
          <button type="button" onClick={() => { setOpen(false); onEdit(user); }}
            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5">
            <FiEdit2 className="w-4 h-4 text-gray-400" />
            Edit
          </button>
          <button type="button" onClick={() => { setOpen(false); onToggleBlock(user); }}
            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5">
            {isBlocked ? <FiUnlock className="w-4 h-4 text-gray-400" /> : <FiSlash className="w-4 h-4 text-gray-400" />}
            {isBlocked ? "Unblock" : "Block"}
          </button>
          <div className="my-1 border-t border-gray-100" />
          <button type="button" onClick={() => { setOpen(false); onDelete(user); }}
            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2.5">
            <FiTrash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

const TABS = [
  { id: "all",      label: "All Users",  match: (u) => true },
  { id: "trainer",  label: "Trainers",   match: (u) => u.role === "trainer" },
  { id: "student",  label: "Students",   match: (u) => u.role === "student" },
  { id: "director", label: "Directors",  match: (u) => u.role === "director" },
  { id: "blocked",  label: "Blocked",    match: (u) => u.status === "blocked" },
];

const TITLE_BY_TAB = {
  all:      { title: "All Users",       subtitle: "Manage everyone across the platform" },
  trainer:  { title: "Trainers",        subtitle: "Faculty members and their assignments" },
  student:  { title: "Students",        subtitle: "Enrolled and prospective students" },
  director: { title: "Directors",       subtitle: "Read-only oversight accounts" },
  blocked:  { title: "Blocked Users",   subtitle: "Accounts with revoked access" },
};

const UserManagementPage = () => {
  const { pathname } = useLocation();
  const initialTab = ROLE_FROM_PATH[pathname] || "all";
  const [tab, setTab] = useState(initialTab);
  const [users, setUsers] = useState(SEED_USERS);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { confirm } = useConfirm();
  const { toast } = useToast();

  // Re-sync tab when sidebar navigates between sub-routes
  useEffect(() => {
    const next = ROLE_FROM_PATH[pathname] || "all";
    setTab(next);
    setPage(1);
  }, [pathname]);

  const counts = useMemo(
    () =>
      TABS.reduce((acc, t) => {
        acc[t.id] = users.filter(t.match).length;
        return acc;
      }, {}),
    [users]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const matcher = TABS.find((t) => t.id === tab)?.match || (() => true);
    return users.filter((u) => {
      if (!matcher(u)) return false;
      if (!q) return true;
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q)
      );
    });
  }, [users, tab, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleView = (u) =>
    toast({ title: u.name, message: `${u.email} · ${ROLE_LABELS[u.role] || u.role}`, variant: "info" });

  const handleEdit = (u) =>
    toast({ title: `Editing ${u.name}`, message: "Edit dialog coming soon.", variant: "info" });

  const handleToggleBlock = async (u) => {
    const block = u.status !== "blocked";
    const ok = await confirm({
      title: block ? "Block user?" : "Unblock user?",
      message: block
        ? `${u.name} will lose access immediately. Reversible.`
        : `${u.name} will regain access right away.`,
      confirmLabel: block ? "Block" : "Unblock",
      variant: block ? "danger" : "default",
    });
    if (!ok) return;
    setUsers((prev) =>
      prev.map((x) => (x.id === u.id ? { ...x, status: block ? "blocked" : "active" } : x))
    );
    toast({
      title: block ? "User blocked" : "User unblocked",
      message: `${u.name} is now ${block ? "blocked" : "active"}.`,
      variant: block ? "info" : "success",
    });
  };

  const handleDelete = async (u) => {
    const ok = await confirm({
      title: "Delete user?",
      message: `${u.name} (${u.email}) will be permanently removed. This cannot be undone.`,
      confirmLabel: "Delete",
      variant: "danger",
    });
    if (!ok) return;
    setUsers((prev) => prev.filter((x) => x.id !== u.id));
    toast({ title: "User deleted", message: `${u.name} has been removed.`, variant: "info" });
  };

  const handleExport = () => {
    toast({ title: "Export started", message: `${filtered.length} users will be exported as CSV.`, variant: "info" });
  };

  const meta = TITLE_BY_TAB[tab] || TITLE_BY_TAB.all;

  return (
    <div className="w-full bg-slate-50 min-h-full">
      <div className="bg-gradient-to-r from-purple-50 via-white to-indigo-50 border-b border-purple-100">
        <div className="px-6 lg:px-8 py-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">{meta.title}</h1>
            <p className="text-sm text-gray-600 mt-1">{meta.subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              <FiDownload className="w-3.5 h-3.5" />
              Export CSV
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-[0_8px_24px_-6px_rgba(124,58,237,0.45)] active:scale-[0.99] transition-all duration-200"
            >
              <FiPlus className="w-4 h-4" />
              Add User
            </button>
          </div>
        </div>
      </div>

      <div className="w-full px-6 lg:px-8 py-6 space-y-5">
        {/* Tabs */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-2">
          <div className="flex flex-wrap items-center gap-1">
            {TABS.map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setTab(t.id);
                    setPage(1);
                  }}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors duration-200 ${
                    active
                      ? "bg-purple-50 text-purple-700 border border-purple-100"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-transparent"
                  }`}
                  aria-pressed={active}
                >
                  {t.label}
                  <span
                    className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold rounded-full ${
                      active ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {counts[t.id] ?? 0}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by name, email, or user ID…"
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-transparent rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white focus:border-gray-200 transition-all duration-200"
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            {filtered.length} of {users.length} users
          </p>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px]">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">User ID</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Batch</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {visible.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12">
                      <div className="text-center">
                        <div className="inline-flex p-3 rounded-2xl bg-gray-100 text-gray-400 mb-3">
                          <FiInbox className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-medium text-gray-900">No users match your filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  visible.map((u) => (
                    <tr key={u.id} className="hover:bg-purple-50/40 transition-colors duration-150">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                            {initials(u.name)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{u.name}</p>
                            <p className="text-xs text-gray-500 truncate">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <span className="text-xs font-mono font-semibold text-gray-600">{u.id}</span>
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded text-[11px] font-semibold border ${
                            ROLE_ACCENT[u.role] || "text-gray-700 bg-gray-50 border-gray-200"
                          }`}
                        >
                          {ROLE_LABELS[u.role] || u.role}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-700">{u.batch}</td>
                      <td className="px-6 py-3"><StatusBadge status={u.status} /></td>
                      <td className="px-6 py-3 text-right">
                        <RowActions
                          user={u}
                          onView={handleView}
                          onEdit={handleEdit}
                          onToggleBlock={handleToggleBlock}
                          onDelete={handleDelete}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-500">
                Page {safePage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={safePage === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={safePage === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
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

export default UserManagementPage;
