import React, { useMemo } from "react";
import {
  FiStar,
  FiMessageSquare,
  FiSmile,
  FiFrown,
  FiMeh,
} from "react-icons/fi";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  Legend,
} from "recharts";
import GradientCard from "../../components/ui/GradientCard";

const RATING_DISTRIBUTION = [
  { rating: "1★", count: 6,  fill: "#ef4444" },
  { rating: "2★", count: 14, fill: "#f97316" },
  { rating: "3★", count: 38, fill: "#f59e0b" },
  { rating: "4★", count: 92, fill: "#84cc16" },
  { rating: "5★", count: 124, fill: "#10b981" },
];

const SENTIMENT_TREND = [
  { month: "Aug", positive: 68, neutral: 22, negative: 10 },
  { month: "Sep", positive: 72, neutral: 19, negative: 9 },
  { month: "Oct", positive: 70, neutral: 21, negative: 9 },
  { month: "Nov", positive: 76, neutral: 17, negative: 7 },
  { month: "Dec", positive: 78, neutral: 15, negative: 7 },
  { month: "Jan", positive: 82, neutral: 13, negative: 5 },
];

const TRAINER_PERFORMANCE = [
  { trainer: "Praful Bhoyar", rating: 4.7 },
  { trainer: "Sneha Iyer",    rating: 4.5 },
  { trainer: "Vikram Joshi",  rating: 4.3 },
  { trainer: "Anand Rao",     rating: 4.2 },
  { trainer: "Aanya Verma",   rating: 4.6 },
];

const RECENT = [
  { id: "F-1042", student: "Aarav Mehta",    course: "Code Unnati",   rating: 5, sentiment: "positive", text: "Loved the live coding sessions — really hands-on." },
  { id: "F-1041", student: "Diya Patel",     course: "Web Dev",        rating: 4, sentiment: "positive", text: "Trainer explains React hooks really well." },
  { id: "F-1040", student: "Kabir Singh",    course: "DSA Track",      rating: 3, sentiment: "neutral",  text: "Decent course. Would love more leetcode walkthroughs." },
  { id: "F-1039", student: "Reyansh Iyer",   course: "Code Unnati",    rating: 2, sentiment: "negative", text: "Pace too fast for someone starting out." },
  { id: "F-1038", student: "Anvi Reddy",     course: "Web Dev",        rating: 5, sentiment: "positive", text: "Best web dev experience I've had." },
  { id: "F-1037", student: "Saanvi Bose",    course: "DSA Track",      rating: 1, sentiment: "negative", text: "Felt rushed. Need more whiteboard examples." },
];

const sentimentChip = {
  positive: { label: "Positive", className: "text-green-700 bg-green-50 border-green-100", icon: FiSmile },
  neutral:  { label: "Neutral",  className: "text-amber-700 bg-amber-50 border-amber-100", icon: FiMeh },
  negative: { label: "Negative", className: "text-red-700 bg-red-50 border-red-100",       icon: FiFrown },
};

const Stars = ({ value }) => (
  <span className="inline-flex gap-0.5">
    {[1, 2, 3, 4, 5].map((n) => (
      <FiStar key={n} className={`w-3.5 h-3.5 ${n <= value ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
    ))}
  </span>
);

const tooltipStyle = {
  borderRadius: 8,
  border: "1px solid #e5e7eb",
  fontSize: 12,
  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
};

const FeedbackAnalyticsPage = () => {
  const stats = useMemo(() => {
    const totals = RATING_DISTRIBUTION.reduce((acc, r) => {
      const ratingValue = parseInt(r.rating, 10);
      acc.total += r.count;
      acc.weighted += ratingValue * r.count;
      if (ratingValue >= 4) acc.positive += r.count;
      else if (ratingValue === 3) acc.neutral += r.count;
      else acc.negative += r.count;
      return acc;
    }, { total: 0, weighted: 0, positive: 0, neutral: 0, negative: 0 });
    const avg = totals.total ? (totals.weighted / totals.total).toFixed(1) : 0;
    const pct = (n) => totals.total ? Math.round((n / totals.total) * 100) : 0;
    return {
      avg,
      total: totals.total,
      positivePct: pct(totals.positive),
      negativePct: pct(totals.negative),
    };
  }, []);

  return (
    <div className="w-full bg-slate-50 min-h-full">
      <div className="bg-gradient-to-r from-purple-50 via-white to-indigo-50 border-b border-purple-100">
        <div className="px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-semibold text-gray-900">Feedback Analytics</h1>
          <p className="text-sm text-gray-600 mt-1">
            Ratings, sentiment, and trainer performance across all batches
          </p>
        </div>
      </div>

      <div className="w-full px-6 lg:px-8 py-6 space-y-6">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <GradientCard icon={FiStar}          label="Average Rating" value={stats.avg}              sublabel="out of 5" color="orange" />
          <GradientCard icon={FiMessageSquare} label="Total Feedback" value={stats.total}            color="blue" />
          <GradientCard icon={FiSmile}         label="Positive"       value={`${stats.positivePct}%`} progress={stats.positivePct} color="green" />
          <GradientCard icon={FiFrown}         label="Negative"       value={`${stats.negativePct}%`} progress={stats.negativePct} color="red" />
        </section>

        <section className="grid grid-cols-12 gap-6">
          {/* Rating distribution */}
          <div className="col-span-12 lg:col-span-5 bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <div className="mb-5">
              <h3 className="text-lg font-semibold text-gray-900">Rating Distribution</h3>
              <p className="text-xs text-gray-500 mt-0.5">Count of responses per star</p>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={RATING_DISTRIBUTION} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="rating" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#f5f3ff" }} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={40}>
                    {RATING_DISTRIBUTION.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sentiment trend */}
          <div className="col-span-12 lg:col-span-7 bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <div className="mb-5">
              <h3 className="text-lg font-semibold text-gray-900">Sentiment Trend</h3>
              <p className="text-xs text-gray-500 mt-0.5">% positive / neutral / negative across last 6 months</p>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={SENTIMENT_TREND} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, ""]} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="positive" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="neutral"  stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="negative" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Trainer performance bar */}
        <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-gray-900">Trainer Performance</h3>
            <p className="text-xs text-gray-500 mt-0.5">Average student rating per trainer</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TRAINER_PERFORMANCE} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#f3f4f6" horizontal={false} />
                <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <YAxis dataKey="trainer" type="category" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} width={110} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#f5f3ff" }} formatter={(v) => [`${v} / 5`, "Rating"]} />
                <Bar dataKey="rating" fill="#7c3aed" radius={[0, 6, 6, 0]} maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Recent feedback table */}
        <section className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Recent Feedback</h3>
            <p className="text-xs text-gray-500 mt-0.5">Latest student responses with sentiment classification</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Student</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Course</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Rating</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Feedback</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Sentiment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {RECENT.map((f) => {
                  const cfg = sentimentChip[f.sentiment];
                  const SentimentIcon = cfg.icon;
                  return (
                    <tr key={f.id} className="hover:bg-purple-50/40 transition-colors">
                      <td className="px-6 py-3">
                        <p className="text-sm font-semibold text-gray-900">{f.student}</p>
                        <p className="text-xs text-gray-500 font-mono">{f.id}</p>
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-700">{f.course}</td>
                      <td className="px-6 py-3"><Stars value={f.rating} /></td>
                      <td className="px-6 py-3">
                        <p className="text-sm text-gray-700 line-clamp-1 max-w-md">{f.text}</p>
                      </td>
                      <td className="px-6 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${cfg.className}`}>
                          <SentimentIcon className="w-3 h-3" />
                          {cfg.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FeedbackAnalyticsPage;
