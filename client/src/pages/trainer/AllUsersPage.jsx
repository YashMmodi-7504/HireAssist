import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  FiSearch,
  FiPlus,
  FiDownload,
  FiMoreVertical,
  FiEye,
  FiKey,
  FiUserX,
  FiInbox,
} from "react-icons/fi";
import { useConfirm } from "../../components/ui/ConfirmDialog";
import { useToast } from "../../components/ui/Toaster";

// RBAC: trainers can only see students. Directors and admin users are
// scoped out of this dataset entirely so a trainer cannot view or manage
// staff accounts. Org-wide user management lives in the admin console.
const SEED_USERS = [
  { id: "U-1042", name: "Aarav Mehta",   email: "aarav.mehta@example.com",  role: "Student", batch: "AC-2025",   status: "active" },
  { id: "U-1041", name: "Diya Patel",    email: "diya.patel@example.com",   role: "Student", batch: "CU4FO-25",  status: "active" },
  { id: "U-1040", name: "Kabir Singh",   email: "kabir.s@example.com",      role: "Student", batch: "VAC-25",    status: "inactive" },
  { id: "U-1039", name: "Ishita Rao",    email: "ishita.rao@example.com",   role: "Student", batch: "AC-2026",   status: "active" },
  { id: "U-1038", name: "Reyansh Iyer",  email: "reyansh.iyer@example.com", role: "Student", batch: "CU4FO-26",  status: "active" },
  { id: "U-1036", name: "Vihaan Joshi",  email: "vihaan.j@example.com",     role: "Student", batch: "AC-2025",   status: "inactive" },
  { id: "U-1035", name: "Anvi Reddy",    email: "anvi.r@example.com",       role: "Student", batch: "CU4FO-25",  status: "active" },
  { id: "U-1033", name: "Saanvi Bose",   email: "saanvi.b@example.com",     role: "Student", batch: "VAC-25",    status: "active" },
  { id: "U-1032", name: "Mihir Kapoor",  email: "mihir.k@example.com",      role: "Student", batch: "AC-2026",   status: "active" },
  { id: "U-1031", name: "Pari Shah",     email: "pari.shah@example.com",    role: "Student", batch: "CU4FO-26",  status: "inactive" },
  { id: "U-1029", name: "Rudra Das",     email: "rudra.d@example.com",      role: "Student", batch: "AC-2025",   status: "active" },
  { id: "U-1028", name: "Tanvi Khan",    email: "tanvi.k@example.com",      role: "Student", batch: "CU4FO-25",  status: "active" },
];

const PAGE_SIZE = 8;

const initials = (name) =>
  name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const StatusBadge = ({ status }) => {
  const cfg =
    status === "active"
      ? { label: "Active", className: "text-green-700 bg-green-50 border-green-100" }
      : { label: "Inactive", className: "text-gray-600 bg-gray-100 border-gray-200" };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${cfg.className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === "active" ? "bg-green-500" : "bg-gray-400"
        }`}
      />
      {cfg.label}
    </span>
  );
};

const RowActions = ({ user, onView, onReset, onDisable }) => {
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
        aria-label={`Actions for ${user.name}`}
      >
        <FiMoreVertical className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-100 rounded-lg shadow-xl py-1 z-20">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onView(user);
            }}
            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5"
          >
            <FiEye className="w-4 h-4 text-gray-400" />
            View Profile
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onReset(user);
            }}
            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5"
          >
            <FiKey className="w-4 h-4 text-gray-400" />
            Reset Password
          </button>
          <div className="my-1 border-t border-gray-100" />
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onDisable(user);
            }}
            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2.5"
          >
            <FiUserX className="w-4 h-4" />
            Disable User
          </button>
        </div>
      )}
    </div>
  );
};

const selectClass =
  "px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200 cursor-pointer";

const AllUsersPage = () => {
  const [users, setUsers] = useState(SEED_USERS);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const { confirm } = useConfirm();
  const { toast } = useToast();

  const roles = useMemo(
    () => Array.from(new Set(users.map((u) => u.role))),
    [users]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      const matchesSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q);
      const matchesRole = role === "all" || u.role === role;
      const matchesStatus = status === "all" || u.status === status;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, role, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const handleSearchChange = (v) => {
    setSearch(v);
    setPage(1);
  };

  const handleView = (u) => {
    toast({
      title: u.name,
      message: `Opening profile for ${u.email}`,
      variant: "info",
    });
  };

  const handleReset = async (u) => {
    const ok = await confirm({
      title: "Reset password?",
      message: `Send a password reset email to ${u.email}?`,
      confirmLabel: "Send reset email",
    });
    if (!ok) return;
    toast({
      title: "Reset link sent",
      message: `${u.email} will receive instructions shortly.`,
      variant: "success",
    });
  };

  const handleDisable = async (u) => {
    const ok = await confirm({
      title: "Disable this user?",
      message: `${u.name} will lose access until re-enabled. This can be reversed.`,
      confirmLabel: "Disable",
      variant: "danger",
    });
    if (!ok) return;
    setUsers((prev) =>
      prev.map((x) => (x.id === u.id ? { ...x, status: "inactive" } : x))
    );
    toast({
      title: "User disabled",
      message: `${u.name} has been deactivated.`,
      variant: "info",
    });
  };

  const handleExport = () => {
    toast({
      title: "Export started",
      message: `${filtered.length} users will be exported as CSV.`,
      variant: "info",
    });
  };

  return (
    <div className="w-full bg-slate-50 min-h-full">
      <div className="bg-gradient-to-r from-purple-50 via-white to-indigo-50 border-b border-purple-100">
        <div className="px-6 lg:px-8 py-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">All Users</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage students, trainers, and admins
            </p>
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
        {/* Filters */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search by name, email, or user ID…"
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-transparent rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white focus:border-gray-200 transition-all duration-200"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <select
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                  setPage(1);
                }}
                className={selectClass}
                aria-label="Role"
              >
                <option value="all">All Roles</option>
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className={selectClass}
                aria-label="Status"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setRole("all");
                  setStatus("all");
                  setPage(1);
                }}
                className="px-3 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            {filtered.length} of {users.length} users
          </p>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    User
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    User ID
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Batch
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
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
                        <p className="text-sm font-medium text-gray-900">
                          No users match your filters
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Try clearing the search or selecting a different role
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  visible.map((u) => (
                    <tr
                      key={u.id}
                      className="hover:bg-purple-50/40 transition-colors duration-150"
                    >
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                            {initials(u.name)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {u.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {u.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <span className="text-xs font-mono font-semibold text-gray-600">
                          {u.id}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <span className="text-sm text-gray-700">{u.role}</span>
                      </td>
                      <td className="px-6 py-3">
                        <span className="text-sm text-gray-700">{u.batch}</span>
                      </td>
                      <td className="px-6 py-3">
                        <StatusBadge status={u.status} />
                      </td>
                      <td className="px-6 py-3 text-right">
                        <RowActions
                          user={u}
                          onView={handleView}
                          onReset={handleReset}
                          onDisable={handleDisable}
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

export default AllUsersPage;
