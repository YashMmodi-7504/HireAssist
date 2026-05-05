import React, { useMemo, useState } from "react";
import {
  FiSearch,
  FiInbox,
  FiChevronDown,
  FiCalendar,
  FiTag,
} from "react-icons/fi";

const statusConfig = {
  open: { label: "Open", className: "text-amber-700 bg-amber-50 border-amber-100" },
  closed: {
    label: "Closed",
    className: "text-green-700 bg-green-50 border-green-100",
  },
  pending: {
    label: "Pending",
    className: "text-orange-700 bg-orange-50 border-orange-100",
  },
  "in-review": {
    label: "In Review",
    className: "text-blue-700 bg-blue-50 border-blue-100",
  },
};

const STATUS_FILTERS = ["all", "open", "in-review", "pending", "closed"];

const StatusBadge = ({ status }) => {
  const c = statusConfig[status] || statusConfig.pending;
  return (
    <span
      className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold border ${c.className}`}
    >
      {c.label}
    </span>
  );
};

const QueryCard = ({ ticket }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md hover:border-purple-100 transition-all duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[11px] font-mono font-semibold text-gray-500">
              {ticket.id}
            </span>
            <span className="text-gray-300">·</span>
            <span className="inline-flex items-center gap-1 text-[11px] text-gray-500">
              <FiTag className="w-3 h-3" />
              {ticket.category}
            </span>
            <span className="text-gray-300">·</span>
            <span className="inline-flex items-center gap-1 text-[11px] text-gray-500">
              <FiCalendar className="w-3 h-3" />
              {ticket.createdAt}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-gray-900 leading-snug">
            {ticket.title}
          </h3>
        </div>
        <StatusBadge status={ticket.status} />
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
            Description
          </p>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {ticket.description ||
              "No additional details were provided when this ticket was opened."}
          </p>
          {ticket.lastReply && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">
                Last reply · {ticket.lastReply.author}
              </p>
              <p className="text-sm text-gray-700 mt-1">
                {ticket.lastReply.message}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="mt-3 flex items-center justify-end">
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-700 transition-colors"
          aria-expanded={expanded}
        >
          {expanded ? "Hide details" : "View details"}
          <FiChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>
    </div>
  );
};

const QueriesCardList = ({ rows = [] }) => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");

  const categories = useMemo(
    () => Array.from(new Set(rows.map((r) => r.category))).sort(),
    [rows]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      const matchesSearch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        (r.category || "").toLowerCase().includes(q);
      const matchesStatus = status === "all" || r.status === status;
      const matchesCategory = category === "all" || r.category === category;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [rows, search, status, category]);

  return (
    <div className="space-y-5">
      {/* Search + Category filter */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by id, title, or category…"
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white focus:border-purple-300 transition-all duration-200"
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200 cursor-pointer"
            aria-label="Category"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Status pills */}
        <div className="mt-3 flex flex-wrap gap-2">
          {STATUS_FILTERS.map((s) => {
            const active = status === s;
            const label = s === "all" ? "All" : statusConfig[s]?.label;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all duration-200 active:scale-[0.97] ${
                  active
                    ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                    : "bg-white text-gray-700 border-gray-200 hover:border-purple-300 hover:text-purple-700"
                }`}
                aria-pressed={active}
              >
                {label}
              </button>
            );
          })}
        </div>

        <p className="text-xs text-gray-500 mt-3">
          {filtered.length} of {rows.length} ticket{rows.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="inline-flex p-3 rounded-2xl bg-gray-100 text-gray-400 mb-3">
            <FiInbox className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-gray-900">No queries found</p>
          <p className="text-xs text-gray-500 mt-1">
            Try clearing the search or selecting a different status
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((r) => (
            <QueryCard key={r.id} ticket={r} />
          ))}
        </div>
      )}
    </div>
  );
};

export default QueriesCardList;
