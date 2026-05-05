import React, { useMemo, useState } from "react";
import { FiAward, FiStar, FiSearch, FiTrendingUp } from "react-icons/fi";

const SEED = [
  { id: "T-1042", name: "Praful Bhoyar", batches: 4, students: 96, avgCompletion: 78, rating: 4.7, trend: "+0.2" },
  { id: "T-1041", name: "Sneha Iyer",    batches: 3, students: 72, avgCompletion: 72, rating: 4.5, trend: "+0.1" },
  { id: "T-1040", name: "Vikram Joshi",  batches: 3, students: 68, avgCompletion: 80, rating: 4.6, trend: "+0.3" },
  { id: "T-1039", name: "Aanya Verma",   batches: 2, students: 48, avgCompletion: 74, rating: 4.4, trend: "0.0" },
  { id: "T-1038", name: "Veer Malhotra", batches: 2, students: 42, avgCompletion: 68, rating: 4.2, trend: "−0.1" },
  { id: "T-1037", name: "Kavya Menon",   batches: 1, students: 24, avgCompletion: 65, rating: 4.0, trend: "+0.1" },
];

const initials = (name) =>
  name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

const Stars = ({ value }) => (
  <span className="inline-flex items-center gap-1.5">
    <FiStar className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
    <span className="text-sm font-bold text-gray-900">{value}</span>
    <span className="text-xs text-gray-500">/ 5</span>
  </span>
);

const trendTone = (t) => {
  if (t.startsWith("+")) return "text-green-700 bg-green-50 border-green-100";
  if (t.startsWith("−") || t.startsWith("-")) return "text-red-700 bg-red-50 border-red-100";
  return "text-gray-700 bg-gray-100 border-gray-200";
};

const TrainerPerformancePage = () => {
  const [search, setSearch] = useState("");

  // Sort by composite: rating × completion, descending
  const ranked = useMemo(() => {
    return [...SEED]
      .sort((a, b) => b.rating * b.avgCompletion - a.rating * a.avgCompletion)
      .map((t, i) => ({ ...t, rank: i + 1 }));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ranked.filter((t) => !q || t.name.toLowerCase().includes(q) || t.id.toLowerCase().includes(q));
  }, [ranked, search]);

  const top3 = ranked.slice(0, 3);

  return (
    <div className="w-full bg-slate-50 min-h-full">
      <div className="bg-gradient-to-r from-purple-50 via-white to-indigo-50 border-b border-purple-100">
        <div className="px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-semibold text-gray-900">Trainer Performance</h1>
          <p className="text-sm text-gray-600 mt-1">Ranked by composite of completion and student rating</p>
        </div>
      </div>

      <div className="w-full px-6 lg:px-8 py-6 space-y-6">
        {/* Top 3 podium cards */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Top Performers</h2>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full">
              <FiAward className="w-3.5 h-3.5" />
              Quarter to date
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {top3.map((t) => {
              const medal =
                t.rank === 1 ? { bg: "from-amber-400 to-yellow-500",  ring: "ring-amber-200",  label: "🥇 Gold"   } :
                t.rank === 2 ? { bg: "from-gray-300 to-gray-400",     ring: "ring-gray-200",   label: "🥈 Silver" } :
                                { bg: "from-orange-400 to-amber-600", ring: "ring-orange-200", label: "🥉 Bronze" };
              return (
                <div key={t.id} className="relative bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-5">
                  <span className={`absolute -top-2 -right-2 inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-white border border-gray-200 shadow-sm`}>
                    {medal.label}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${medal.bg} ring-4 ${medal.ring} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                      {initials(t.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900 truncate">{t.name}</p>
                      <p className="text-xs text-gray-500 truncate">{t.batches} batches · {t.students} students</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Rating</p>
                      <div className="mt-1"><Stars value={t.rating} /></div>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Completion</p>
                      <p className="text-sm font-bold text-gray-900 mt-1">{t.avgCompletion}%</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Full ranking table */}
        <section className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Full Ranking</h3>
              <p className="text-xs text-gray-500 mt-0.5">Search and review all trainers</p>
            </div>
            <div className="relative w-full sm:w-64">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search trainer…"
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-transparent rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white focus:border-gray-200 transition-all duration-200"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">#</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Trainer</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Batches</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Students</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Avg Completion</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Rating</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-purple-50/40 transition-colors">
                    <td className="px-6 py-3">
                      <span className={`inline-flex w-6 h-6 rounded-full items-center justify-center text-xs font-bold ${
                        t.rank === 1 ? "bg-amber-100 text-amber-700" :
                        t.rank === 2 ? "bg-gray-200 text-gray-700" :
                        t.rank === 3 ? "bg-orange-100 text-orange-700" :
                        "bg-gray-100 text-gray-600"
                      }`}>
                        {t.rank}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                          {initials(t.name)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                          <p className="text-xs text-gray-500 font-mono">{t.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-sm font-semibold text-gray-900">{t.batches}</td>
                    <td className="px-6 py-3 text-sm text-gray-700">{t.students}</td>
                    <td className="px-6 py-3 text-sm font-bold text-gray-900">{t.avgCompletion}%</td>
                    <td className="px-6 py-3"><Stars value={t.rating} /></td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${trendTone(t.trend)}`}>
                        <FiTrendingUp className={`w-3 h-3 ${t.trend.startsWith("−") || t.trend.startsWith("-") ? "rotate-180" : ""}`} />
                        {t.trend}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TrainerPerformancePage;
