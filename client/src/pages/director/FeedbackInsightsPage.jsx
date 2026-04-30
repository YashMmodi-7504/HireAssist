import React, { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  FiStar,
  FiMessageSquare,
  FiTrendingUp,
  FiTrendingDown,
  FiSearch,
  FiSmile,
  FiMeh,
  FiFrown,
} from "react-icons/fi";

const RATING_DISTRIBUTION = [
  { stars: "1★", count: 8,  color: "#ef4444" },
  { stars: "2★", count: 14, color: "#f97316" },
  { stars: "3★", count: 42, color: "#f59e0b" },
  { stars: "4★", count: 118, color: "#10b981" },
  { stars: "5★", count: 142, color: "#059669" },
];

const SENTIMENT = [
  { name: "Positive", value: 68, color: "#10b981" },
  { name: "Neutral",  value: 22, color: "#94a3b8" },
  { name: "Negative", value: 10, color: "#ef4444" },
];

const FEEDBACK_TREND = [
  { month: "Nov", positive: 42, neutral: 18, negative: 8 },
  { month: "Dec", positive: 48, neutral: 16, negative: 7 },
  { month: "Jan", positive: 54, neutral: 19, negative: 9 },
  { month: "Feb", positive: 60, neutral: 17, negative: 6 },
  { month: "Mar", positive: 66, neutral: 20, negative: 8 },
  { month: "Apr", positive: 72, neutral: 21, negative: 5 },
];

const TRAINER_FEEDBACK = [
  { id: "T-1042", name: "Praful Bhoyar",  rating: 4.7, count: 86, positive: 78, neutral: 16, negative: 6  },
  { id: "T-1041", name: "Sneha Iyer",     rating: 4.5, count: 64, positive: 72, neutral: 22, negative: 6  },
  { id: "T-1040", name: "Vikram Joshi",   rating: 4.6, count: 58, positive: 76, neutral: 18, negative: 6  },
  { id: "T-1039", name: "Aanya Verma",    rating: 4.4, count: 42, positive: 68, neutral: 24, negative: 8  },
  { id: "T-1038", name: "Veer Malhotra",  rating: 4.2, count: 38, positive: 60, neutral: 26, negative: 14 },
  { id: "T-1037", name: "Kavya Menon",    rating: 4.0, count: 24, positive: 56, neutral: 30, negative: 14 },
];

const tooltipStyle = {
  borderRadius: 8,
  border: "1px solid #e5e7eb",
  fontSize: 12,
  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
};

const initials = (name) =>
  name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

const KpiCard = ({ icon: Icon, label, value, suffix, accent, delta, deltaTone }) => (
  <div className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-5">
    <div className="flex items-start justify-between gap-3">
      <div className={`inline-flex p-2.5 rounded-xl ${accent.bg}`}>
        <Icon className={`w-5 h-5 ${accent.text}`} />
      </div>
      {delta && (
        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${deltaTone}`}>
          {delta}
        </span>
      )}
    </div>
    <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mt-4">{label}</p>
    <p className="text-3xl font-bold text-gray-900 mt-1">
      {value}
      {suffix && <span className="text-lg font-semibold text-gray-500 ml-0.5">{suffix}</span>}
    </p>
  </div>
);

const SentimentBar = ({ positive, neutral, negative }) => (
  <div className="flex w-full h-2 rounded-full overflow-hidden bg-gray-100">
    <div className="bg-emerald-500" style={{ width: `${positive}%` }} title={`Positive ${positive}%`} />
    <div className="bg-slate-400" style={{ width: `${neutral}%` }} title={`Neutral ${neutral}%`} />
    <div className="bg-red-500" style={{ width: `${negative}%` }} title={`Negative ${negative}%`} />
  </div>
);

const FeedbackInsightsPage = () => {
  const [search, setSearch] = useState("");

  const totals = useMemo(() => {
    const totalFeedback = RATING_DISTRIBUTION.reduce((s, r) => s + r.count, 0);
    const weighted = RATING_DISTRIBUTION.reduce((s, r, i) => s + r.count * (i + 1), 0);
    const avgRating = (weighted / totalFeedback).toFixed(1);
    return {
      totalFeedback,
      avgRating,
      positivePct: SENTIMENT.find((s) => s.name === "Positive").value,
      negativePct: SENTIMENT.find((s) => s.name === "Negative").value,
    };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return TRAINER_FEEDBACK
      .filter((t) => !q || t.name.toLowerCase().includes(q) || t.id.toLowerCase().includes(q))
      .sort((a, b) => b.rating - a.rating);
  }, [search]);

  return (
    <div className="w-full bg-slate-50 min-h-full">
      <div className="bg-gradient-to-r from-purple-50 via-white to-indigo-50 border-b border-purple-100">
        <div className="px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-semibold text-gray-900">Feedback Insights</h1>
          <p className="text-sm text-gray-600 mt-1">
            Ratings, sentiment, and trainer-wise feedback breakdown
          </p>
        </div>
      </div>

      <div className="w-full px-6 lg:px-8 py-6 space-y-6">
        {/* KPI Row */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            icon={FiStar}
            label="Avg Rating"
            value={totals.avgRating}
            suffix="/ 5"
            accent={{ bg: "bg-amber-50", text: "text-amber-600" }}
            delta="+0.2 vs last quarter"
            deltaTone="text-green-700 bg-green-50 border-green-100"
          />
          <KpiCard
            icon={FiMessageSquare}
            label="Total Feedback"
            value={totals.totalFeedback.toLocaleString()}
            accent={{ bg: "bg-purple-50", text: "text-purple-600" }}
            delta="+18% MoM"
            deltaTone="text-green-700 bg-green-50 border-green-100"
          />
          <KpiCard
            icon={FiTrendingUp}
            label="Positive Sentiment"
            value={totals.positivePct}
            suffix="%"
            accent={{ bg: "bg-emerald-50", text: "text-emerald-600" }}
            delta="+4 pp"
            deltaTone="text-green-700 bg-green-50 border-green-100"
          />
          <KpiCard
            icon={FiTrendingDown}
            label="Negative Sentiment"
            value={totals.negativePct}
            suffix="%"
            accent={{ bg: "bg-red-50", text: "text-red-600" }}
            delta="−2 pp"
            deltaTone="text-green-700 bg-green-50 border-green-100"
          />
        </section>

        {/* Charts Row 1: Rating Distribution + Sentiment */}
        <section className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-7 bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Rating Distribution</h3>
                <p className="text-xs text-gray-500 mt-0.5">Star ratings across all feedback received</p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-100 px-2.5 py-1 rounded-full">
                {totals.totalFeedback} responses
              </span>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={RATING_DISTRIBUTION} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="stars" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#f5f3ff" }} formatter={(v) => [v, "Responses"]} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {RATING_DISTRIBUTION.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-5 bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <div className="mb-5">
              <h3 className="text-lg font-semibold text-gray-900">Sentiment Analysis</h3>
              <p className="text-xs text-gray-500 mt-0.5">NLP-classified review tone</p>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={SENTIMENT} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={2} dataKey="value">
                    {SENTIMENT.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, ""]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100">
              {[
                { ...SENTIMENT[0], Icon: FiSmile },
                { ...SENTIMENT[1], Icon: FiMeh },
                { ...SENTIMENT[2], Icon: FiFrown },
              ].map((s) => (
                <div key={s.name} className="text-center">
                  <s.Icon className="w-4 h-4 mx-auto" style={{ color: s.color }} />
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mt-1">{s.name}</p>
                  <p className="text-base font-bold text-gray-900">{s.value}%</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feedback Trend */}
        <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Feedback Trend</h3>
              <p className="text-xs text-gray-500 mt-0.5">Monthly volume by sentiment over the last 6 months</p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
              <FiTrendingUp className="w-3.5 h-3.5" />
              Positive trend climbing
            </span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={FEEDBACK_TREND} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="positive" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="neutral"  stroke="#94a3b8" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="negative" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Trainer Feedback table */}
        <section className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Trainer Feedback</h3>
              <p className="text-xs text-gray-500 mt-0.5">Per-trainer ratings and sentiment composition</p>
            </div>
            <div className="relative w-full sm:w-72">
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
            <table className="w-full min-w-[860px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Trainer</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Avg Rating</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Feedback Count</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider w-[280px]">Sentiment %</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Breakdown</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500">
                      No trainers match your search
                    </td>
                  </tr>
                ) : (
                  filtered.map((t) => (
                    <tr key={t.id} className="hover:bg-purple-50/40 transition-colors">
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
                      <td className="px-6 py-3">
                        <span className="inline-flex items-center gap-1.5">
                          <FiStar className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-bold text-gray-900">{t.rating.toFixed(1)}</span>
                          <span className="text-xs text-gray-500">/ 5</span>
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm font-semibold text-gray-900">{t.count}</td>
                      <td className="px-6 py-3">
                        <SentimentBar positive={t.positive} neutral={t.neutral} negative={t.negative} />
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2 text-[11px] font-semibold">
                          <span className="text-emerald-700">{t.positive}%</span>
                          <span className="text-gray-300">·</span>
                          <span className="text-slate-600">{t.neutral}%</span>
                          <span className="text-gray-300">·</span>
                          <span className="text-red-600">{t.negative}%</span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FeedbackInsightsPage;
