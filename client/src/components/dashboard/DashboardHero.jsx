import React, { useEffect, useState } from "react";
import {
  FiPlay,
  FiBarChart2,
  FiZap,
  FiAward,
  FiTrendingUp,
} from "react-icons/fi";

// Rotating motivational lines — cycle every ~5s while the hero is mounted.
// Variety keeps the dashboard feeling alive across sessions.
const MOTIVATIONAL_LINES = [
  "Stay consistent — small daily progress beats occasional sprints.",
  "Every problem you solve compounds your skill — keep going.",
  "Today's confusion is tomorrow's intuition. Push through.",
  "One topic at a time. One streak at a time. You're building.",
];
const LINE_INTERVAL_MS = 5000;

// Initials from the user's display name for the avatar tile.
const initialsOf = (name) =>
  (name || "?")
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

const CircleProgress = ({ value = 0, size = 128, stroke = 10 }) => {
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (value / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="transparent"
        stroke="#ede9fe"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="transparent"
        stroke="url(#heroGradient)"
        strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-700"
      />
      <defs>
        <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// Pill badge for stat callouts (Level / XP / Rank).
const StatBadge = ({ icon: Icon, label, value, tone = "purple" }) => {
  const tones = {
    purple: "from-purple-500 to-indigo-500 shadow-purple-500/20",
    amber: "from-amber-400 to-orange-500 shadow-amber-500/20",
    emerald: "from-emerald-500 to-teal-500 shadow-emerald-500/20",
  };
  return (
    <div className="inline-flex items-center gap-2.5 bg-white/80 backdrop-blur-sm border border-white/70 rounded-full pl-1 pr-3.5 py-1 shadow-sm">
      <span
        className={`inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br ${tones[tone]} text-white shadow-md flex-shrink-0`}
      >
        <Icon className="w-3.5 h-3.5" />
      </span>
      <div className="leading-tight">
        <p className="text-[9px] uppercase tracking-wider text-gray-500 font-bold">
          {label}
        </p>
        <p className="text-sm font-bold text-gray-900 tabular-nums">{value}</p>
      </div>
    </div>
  );
};

const DashboardHero = ({ user, progress = 0, onResume, onAnalytics }) => {
  const circleSize = 128;

  const [lineIdx, setLineIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(
      () => setLineIdx((i) => (i + 1) % MOTIVATIONAL_LINES.length),
      LINE_INTERVAL_MS
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-indigo-50 border border-purple-100 rounded-2xl shadow-sm p-6 lg:p-8">
      {/* Soft accent blobs */}
      <div
        className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-purple-300/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-indigo-300/15 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left: Avatar + Welcome + Badges + CTAs */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-purple-500/25 ring-4 ring-white">
                {initialsOf(user?.name)}
              </div>
              <span
                className="absolute -bottom-1 -right-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 ring-2 ring-white"
                aria-label="Online"
                title="Online"
              />
            </div>

            <div className="min-w-0">
              <h1 className="text-2xl md:text-3xl font-semibold leading-tight tracking-tight">
                <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                  Welcome back, {user?.name || "Student"}
                </span>{" "}
                <span className="inline-block">👋</span>
              </h1>
              <p
                key={lineIdx}
                className="chat-bubble-in text-sm text-gray-500 mt-1 max-w-xl"
              >
                {MOTIVATIONAL_LINES[lineIdx]}
              </p>
            </div>
          </div>

          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2 mt-5">
            <StatBadge
              icon={FiAward}
              label="Level"
              value={`L${user?.level ?? 1}`}
              tone="purple"
            />
            <StatBadge
              icon={FiZap}
              label="Total XP"
              value={(user?.totalXP ?? 0).toLocaleString()}
              tone="amber"
            />
            {user?.rank && (
              <StatBadge
                icon={FiTrendingUp}
                label="Rank"
                value={user.rank}
                tone="emerald"
              />
            )}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 mt-6">
            <button
              type="button"
              onClick={onResume}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 active:scale-[0.98] text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-[0_8px_24px_-6px_rgba(124,58,237,0.45)] transition-all duration-200"
            >
              <FiPlay className="w-4 h-4" />
              Resume Learning
            </button>
            <button
              type="button"
              onClick={onAnalytics}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white hover:border-gray-300 text-gray-700 text-sm font-semibold rounded-lg transition-all duration-200"
            >
              <FiBarChart2 className="w-4 h-4" />
              View Analytics
            </button>
          </div>
        </div>

        {/* Right: Circular progress */}
        <div className="flex items-center flex-shrink-0">
          <div
            className="relative flex items-center justify-center"
            style={{ width: circleSize, height: circleSize }}
          >
            <CircleProgress value={progress} size={circleSize} stroke={10} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-gray-900 leading-none tracking-tight">
                {progress}%
              </span>
              <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mt-1.5">
                Progress
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHero;
