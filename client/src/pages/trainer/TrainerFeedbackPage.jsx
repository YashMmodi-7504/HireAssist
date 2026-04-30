import React, { useMemo, useState } from "react";
import {
  FiStar,
  FiMessageSquare,
  FiSmile,
  FiFrown,
  FiChevronDown,
  FiInbox,
} from "react-icons/fi";
import GradientCard from "../../components/ui/GradientCard";

const SEED = [
  { id: "F-1042", name: "Aarav Mehta",   course: "Code Unnati",   rating: 5, date: "2026-04-22", text: "Loved the live coding sessions — really hands-on. Want more practice problems though." },
  { id: "F-1041", name: "Diya Patel",    course: "Web Dev",       rating: 4, date: "2026-04-20", text: "Trainer explains React hooks really well. Maybe slow down on context API next time." },
  { id: "F-1040", name: "Kabir Singh",   course: "DSA Track",     rating: 3, date: "2026-04-18", text: "Decent course. Would love more leetcode-style live walkthroughs and recorded solutions." },
  { id: "F-1039", name: "Ishita Rao",    course: "Aptitude",      rating: 5, date: "2026-04-15", text: "Excellent breakdowns. The shortcuts and tricks are gold." },
  { id: "F-1038", name: "Reyansh Iyer",  course: "Code Unnati",   rating: 2, date: "2026-04-12", text: "Pace too fast for someone starting out. Could use a buddy system." },
  { id: "F-1036", name: "Vihaan Joshi",  course: "ML Foundations",rating: 4, date: "2026-04-10", text: "Strong fundamentals. Maybe more notebooks and less slides." },
  { id: "F-1035", name: "Anvi Reddy",    course: "Web Dev",       rating: 5, date: "2026-04-08", text: "Best web dev experience I've had. The mini-projects make all the difference." },
  { id: "F-1033", name: "Saanvi Bose",   course: "DSA Track",     rating: 1, date: "2026-04-05", text: "Felt rushed. Need more whiteboard examples before jumping to code." },
  { id: "F-1032", name: "Mihir Kapoor",  course: "Aptitude",      rating: 4, date: "2026-04-02", text: "Mock tests were a great idea. Add more difficulty tiers please." },
];

const initials = (name) =>
  name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

const Stars = ({ value, size = "sm" }) => {
  const cls = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <FiStar
          key={n}
          className={`${cls} ${n <= value ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
        />
      ))}
    </span>
  );
};

const FeedbackRow = ({ row }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <tr onClick={() => setOpen((o) => !o)} className="cursor-pointer hover:bg-purple-50/40 transition-colors">
        <td className="px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
              {initials(row.name)}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{row.name}</p>
              <p className="text-xs text-gray-500">{row.id}</p>
            </div>
          </div>
        </td>
        <td className="px-6 py-3 text-sm text-gray-700">{row.course}</td>
        <td className="px-6 py-3"><Stars value={row.rating} /></td>
        <td className="px-6 py-3">
          <p className="text-sm text-gray-700 line-clamp-1 max-w-md">{row.text}</p>
        </td>
        <td className="px-6 py-3 text-xs text-gray-500 whitespace-nowrap">{row.date}</td>
        <td className="px-6 py-3 text-right">
          <FiChevronDown className={`w-4 h-4 text-gray-400 inline-block transition-transform ${open ? "rotate-180" : ""}`} />
        </td>
      </tr>
      {open && (
        <tr className="bg-gray-50/60">
          <td colSpan={6} className="px-6 py-4">
            <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">Full feedback</p>
            <p className="text-sm text-gray-700 mt-1 leading-relaxed">{row.text}</p>
          </td>
        </tr>
      )}
    </>
  );
};

const selectClass =
  "px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200 cursor-pointer";

const TrainerFeedbackPage = () => {
  const [rating, setRating] = useState("all");

  const filtered = useMemo(
    () => SEED.filter((r) => rating === "all" || r.rating === Number(rating)),
    [rating]
  );

  const stats = useMemo(() => {
    const n = SEED.length;
    const sum = SEED.reduce((acc, r) => acc + r.rating, 0);
    const avg = n > 0 ? Math.round((sum / n) * 10) / 10 : 0;
    const positive = SEED.filter((r) => r.rating >= 4).length;
    const negative = SEED.filter((r) => r.rating <= 2).length;
    return {
      avg,
      total: n,
      positivePct: Math.round((positive / n) * 100),
      negativePct: Math.round((negative / n) * 100),
    };
  }, []);

  return (
    <div className="w-full bg-slate-50 min-h-full">
      <div className="bg-gradient-to-r from-purple-50 via-white to-indigo-50 border-b border-purple-100">
        <div className="px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-semibold text-gray-900">View Feedback</h1>
          <p className="text-sm text-gray-600 mt-1">Student feedback summary and individual responses</p>
        </div>
      </div>

      <div className="w-full px-6 lg:px-8 py-6 space-y-6">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <GradientCard icon={FiStar}           label="Avg Rating"     value={stats.avg}              sublabel="out of 5" color="orange" />
          <GradientCard icon={FiMessageSquare}  label="Total Feedback" value={stats.total}            color="blue" />
          <GradientCard icon={FiSmile}          label="Positive"       value={`${stats.positivePct}%`} progress={stats.positivePct} color="green" />
          <GradientCard icon={FiFrown}          label="Negative"       value={`${stats.negativePct}%`} progress={stats.negativePct} color="red" />
        </section>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">Rating</label>
              <select value={rating} onChange={(e) => setRating(e.target.value)} className={selectClass}>
                <option value="all">All Ratings</option>
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>{n} {n === 1 ? "star" : "stars"}</option>
                ))}
              </select>
            </div>
            <div className="flex-1" />
            <p className="text-xs text-gray-500">{filtered.length} of {SEED.length} responses</p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Student</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Course</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Rating</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Feedback</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12">
                      <div className="text-center">
                        <div className="inline-flex p-3 rounded-2xl bg-gray-100 text-gray-400 mb-3">
                          <FiInbox className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-medium text-gray-900">No feedback in this filter</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((r) => <FeedbackRow key={r.id} row={r} />)
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerFeedbackPage;
