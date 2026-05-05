import React, { useMemo, useState } from "react";
import { FiSearch, FiInbox } from "react-icons/fi";

const statusStyle = {
  open: "text-amber-700 bg-amber-50 border-amber-100",
  closed: "text-green-700 bg-green-50 border-green-100",
  pending: "text-orange-700 bg-orange-50 border-orange-100",
  "in-review": "text-blue-700 bg-blue-50 border-blue-100",
};

const statusLabel = {
  all: "All",
  open: "Open",
  "in-review": "In Review",
  pending: "Pending",
  closed: "Closed",
};

const PAGE_SIZE = 5;

const QueriesTable = ({ rows = [] }) => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      const matchesSearch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        (r.category || "").toLowerCase().includes(q);
      const matchesStatus = status === "all" || r.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [rows, search, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const handleStatus = (s) => {
    setStatus(s);
    setPage(1);
  };

  const handleSearch = (v) => {
    setSearch(v);
    setPage(1);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">My Queries</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {filtered.length} ticket{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by id, title, or category…"
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white focus:border-purple-300 transition-all duration-200"
            />
          </div>
        </div>

        {/* Status pills */}
        <div className="mt-4 flex flex-wrap gap-2">
          {["all", "open", "in-review", "pending", "closed"].map((s) => {
            const active = status === s;
            return (
              <button
                key={s}
                type="button"
                onClick={() => handleStatus(s)}
                className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all duration-200 active:scale-[0.97] ${
                  active
                    ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                    : "bg-white text-gray-700 border-gray-200 hover:border-purple-300 hover:text-purple-700"
                }`}
                aria-pressed={active}
              >
                {statusLabel[s]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ID
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Title
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Category
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                Created
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {visible.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12">
                  <div className="text-center">
                    <div className="inline-flex p-3 rounded-2xl bg-gray-100 text-gray-400 mb-3">
                      <FiInbox className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      No tickets match your filters
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Try clearing the search or selecting a different status
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              visible.map((r) => (
                <tr
                  key={r.id}
                  className="hover:bg-purple-50/40 transition-colors duration-150"
                >
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono font-semibold text-gray-600">
                      {r.id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-gray-900">{r.title}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-gray-600">{r.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {r.createdAt}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded text-xs font-semibold border ${
                        statusStyle[r.status] || statusStyle.pending
                      }`}
                    >
                      {statusLabel[r.status] || "Pending"}
                    </span>
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
  );
};

export default QueriesTable;
