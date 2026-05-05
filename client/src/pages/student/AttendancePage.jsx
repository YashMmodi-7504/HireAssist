import React, { useMemo, useState } from "react";

import AttendanceSummary from "../../components/Attendance/AttendanceSummary";
import AttendanceCalendar from "../../components/Attendance/AttendanceCalendar";
import AttendanceInsights from "../../components/Attendance/AttendanceInsights";
import SubjectAttendanceTable from "../../components/Attendance/SubjectAttendanceTable";
import AttendanceCharts from "../../components/Attendance/AttendanceCharts";
import LowAttendanceAlerts from "../../components/Attendance/LowAttendanceAlerts";

const ATTENDANCE_DATA = [
  { date: "2026-01-01", status: "holiday" },
  { date: "2026-01-02", status: "present", subject: "Data Structures & Algorithms", topic: "Arrays and Strings", faculty: "Prof. R. Sharma" },
  { date: "2026-01-03", status: "holiday" },
  { date: "2026-01-04", status: "holiday" },
  { date: "2026-01-05", status: "present", subject: "Web Development", topic: "React Hooks Deep Dive", faculty: "Prof. K. Patel" },
  { date: "2026-01-06", status: "present", subject: "Aptitude & Reasoning", topic: "Time and Distance", faculty: "Prof. S. Iyer" },
  { date: "2026-01-07", status: "absent", subject: "Database Systems", topic: "SQL Joins", faculty: "Prof. M. Verma" },
  { date: "2026-01-08", status: "present", subject: "Data Structures & Algorithms", topic: "Linked Lists", faculty: "Prof. R. Sharma" },
  { date: "2026-01-09", status: "present", subject: "Soft Skills & Communication", topic: "Group Discussion", faculty: "Ms. P. Nair" },
  { date: "2026-01-10", status: "holiday" },
  { date: "2026-01-11", status: "holiday" },
  { date: "2026-01-12", status: "present", subject: "Web Development", topic: "API Integration", faculty: "Prof. K. Patel" },
  { date: "2026-01-13", status: "present", subject: "Database Systems", topic: "Indexing Strategies", faculty: "Prof. M. Verma" },
  { date: "2026-01-14", status: "present", subject: "Data Structures & Algorithms", topic: "Stacks and Queues", faculty: "Prof. R. Sharma" },
  { date: "2026-01-15", status: "absent", subject: "Aptitude & Reasoning", topic: "Probability", faculty: "Prof. S. Iyer" },
  { date: "2026-01-16", status: "present", subject: "Soft Skills & Communication", topic: "Interview Skills", faculty: "Ms. P. Nair" },
  { date: "2026-01-17", status: "holiday" },
  { date: "2026-01-18", status: "holiday" },
  { date: "2026-01-19", status: "present", subject: "Data Structures & Algorithms", topic: "Trees and Graphs", faculty: "Prof. R. Sharma" },
  { date: "2026-01-20", status: "present", subject: "Web Development", topic: "Performance Optimization", faculty: "Prof. K. Patel" },
  { date: "2026-01-21", status: "present", subject: "Database Systems", topic: "Transactions and ACID", faculty: "Prof. M. Verma" },
  { date: "2026-01-22", status: "present", subject: "Aptitude & Reasoning", topic: "Logical Puzzles", faculty: "Prof. S. Iyer" },
  { date: "2026-01-23", status: "present", subject: "Data Structures & Algorithms", topic: "Recursion", faculty: "Prof. R. Sharma" },
  { date: "2026-01-24", status: "holiday" },
  { date: "2026-01-25", status: "holiday" },
  { date: "2026-01-26", status: "holiday" },
  { date: "2026-01-27", status: "present", subject: "Web Development", topic: "Deployment", faculty: "Prof. K. Patel" },
  { date: "2026-01-28", status: "absent", subject: "Soft Skills & Communication", topic: "Resume Building", faculty: "Ms. P. Nair" },
  { date: "2026-01-29", status: "present", subject: "Data Structures & Algorithms", topic: "Sorting Algorithms", faculty: "Prof. R. Sharma" },
  { date: "2026-01-30", status: "present", subject: "Database Systems", topic: "NoSQL Overview", faculty: "Prof. M. Verma" },
  { date: "2026-01-31", status: "holiday" },
];

const SUBJECTS_META = [
  { name: "Data Structures & Algorithms", batchCode: "CS-DSA-2025" },
  { name: "Web Development", batchCode: "CS-WEB-2025" },
  { name: "Aptitude & Reasoning", batchCode: "GEN-APT-2025" },
  { name: "Database Systems", batchCode: "CS-DBS-2025" },
  { name: "Soft Skills & Communication", batchCode: "SS-COM-2025" },
];

const MONTHLY_TREND = [
  { month: "Aug", percentage: 88 },
  { month: "Sep", percentage: 91 },
  { month: "Oct", percentage: 85 },
  { month: "Nov", percentage: 82 },
  { month: "Dec", percentage: 79 },
  { month: "Jan", percentage: 84 },
];

const PHASES = ["2024-2025", "2025-2026", "2026-2027"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const TARGET_PCT = 80;

const truncate = (str, n) => (str.length > n ? `${str.slice(0, n - 1)}…` : str);

const classesNeededFor = (present, total, targetPct) => {
  const target = targetPct / 100;
  if (target >= 1) return Infinity;
  const denom = 1 - target;
  if (denom <= 0) return Infinity;
  const need = (target * total - present) / denom;
  return Math.max(0, Math.ceil(need));
};

const getStatusLevel = (pct) => {
  if (pct >= 85) {
    return {
      label: "Good",
      pillClass: "text-green-700 bg-green-50 border-green-100",
      dot: "bg-green-500",
    };
  }
  if (pct >= 75) {
    return {
      label: "Warning",
      pillClass: "text-amber-700 bg-amber-50 border-amber-100",
      dot: "bg-amber-500",
    };
  }
  return {
    label: "Critical",
    pillClass: "text-red-700 bg-red-50 border-red-100",
    dot: "bg-red-500",
  };
};

const selectClass =
  "px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-300 transition-all duration-200 cursor-pointer";

const AttendancePage = () => {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(0);
  const [phase, setPhase] = useState("2025-2026");
  const [subject, setSubject] = useState("All Subjects");

  const subjectOptions = useMemo(
    () => ["All Subjects", ...SUBJECTS_META.map((s) => s.name)],
    []
  );

  // Stats for current month (independent of subject filter)
  const stats = useMemo(() => {
    const m = String(month + 1).padStart(2, "0");
    const prefix = `${year}-${m}-`;
    const monthEntries = ATTENDANCE_DATA.filter((e) => e.date.startsWith(prefix));
    const nonHoliday = monthEntries.filter((e) => e.status !== "holiday");
    const total = nonHoliday.length;
    const present = nonHoliday.filter((e) => e.status === "present").length;
    const absent = nonHoliday.filter((e) => e.status === "absent").length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
    return { total, present, absent, percentage };
  }, [year, month]);

  const overallStatus = getStatusLevel(stats.percentage);

  // Trend (this month vs prev month from MONTHLY_TREND)
  const { trendDelta, prevPercentage } = useMemo(() => {
    if (MONTHLY_TREND.length < 2) {
      return { trendDelta: 0, prevPercentage: stats.percentage };
    }
    const last = MONTHLY_TREND[MONTHLY_TREND.length - 1].percentage;
    const prev = MONTHLY_TREND[MONTHLY_TREND.length - 2].percentage;
    return { trendDelta: last - prev, prevPercentage: prev };
  }, [stats.percentage]);

  // Trends to surface on summary tiles
  const trends = useMemo(
    () => ({
      present: "+5",
      presentDir: "up",
      absent: "−2",
      absentDir: "up",
      percentage: `${trendDelta >= 0 ? "+" : ""}${trendDelta}%`,
      percentageDir: trendDelta >= 0 ? "up" : "down",
    }),
    [trendDelta]
  );

  // Streak (current consecutive present days from latest entry backwards)
  const streak = useMemo(() => {
    const sorted = [...ATTENDANCE_DATA].sort((a, b) =>
      b.date.localeCompare(a.date)
    );
    let count = 0;
    for (const e of sorted) {
      if (e.status === "holiday") continue;
      if (e.status === "present") count++;
      else break;
    }
    return count;
  }, []);

  // Last 7 day-status array
  const last7 = useMemo(() => {
    const sorted = [...ATTENDANCE_DATA].sort((a, b) =>
      a.date.localeCompare(b.date)
    );
    return sorted.slice(-7).map((e) => e.status);
  }, []);

  // Subject rows
  const subjectRows = useMemo(() => {
    return SUBJECTS_META.map((meta) => {
      const subjectEntries = ATTENDANCE_DATA.filter(
        (e) => e.subject === meta.name
      );
      const total = subjectEntries.length;
      const present = subjectEntries.filter(
        (e) => e.status === "present"
      ).length;
      const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
      return {
        ...meta,
        present,
        total,
        percentage,
        classesNeeded: classesNeededFor(present, total, TARGET_PCT),
      };
    });
  }, []);

  const filteredSubjectRows = useMemo(
    () =>
      subject === "All Subjects"
        ? subjectRows
        : subjectRows.filter((s) => s.name === subject),
    [subject, subjectRows]
  );

  const lowSubjects = useMemo(
    () => subjectRows.filter((s) => s.percentage < 75),
    [subjectRows]
  );

  const overallClassesNeeded = classesNeededFor(
    stats.present,
    stats.total,
    TARGET_PCT
  );

  const subjectChartData = useMemo(
    () =>
      subjectRows.map((s) => ({
        name: truncate(s.name, 14),
        percentage: s.percentage,
      })),
    [subjectRows]
  );

  const handleMonthChange = (newYear, newMonth) => {
    setYear(newYear);
    setMonth(newMonth);
  };

  const handleDownload = () => {
    // UI only — wire to a real export endpoint when available.
    console.log("[attendance] download report");
  };

  return (
    <div className="w-full bg-slate-50 min-h-full">
      {/* Header band */}
      <div className="bg-gradient-to-r from-purple-50 via-white to-indigo-50 border-b border-purple-100">
        <div className="px-6 lg:px-8 py-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-semibold text-gray-900">
                My Attendance
              </h1>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${overallStatus.pillClass}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${overallStatus.dot}`}
                  aria-hidden="true"
                />
                {overallStatus.label}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1.5">
              Track your class attendance across subjects and phases
            </p>
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">
                Phase
              </label>
              <select
                value={phase}
                onChange={(e) => setPhase(e.target.value)}
                className={selectClass}
                aria-label="Phase"
              >
                {PHASES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">
                Month
              </label>
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className={selectClass}
                aria-label="Month"
              >
                {MONTHS.map((m, i) => (
                  <option key={m} value={i}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={selectClass}
                aria-label="Subject"
              >
                {subjectOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="w-full px-6 lg:px-8 py-8 space-y-8">
        <AttendanceSummary stats={stats} trends={trends} />

        <AttendanceCalendar
          attendanceData={ATTENDANCE_DATA}
          year={year}
          month={month}
          onMonthChange={handleMonthChange}
        />

        <AttendanceInsights
          streak={streak}
          last7={last7}
          percentage={stats.percentage}
          classesNeeded={overallClassesNeeded}
          trendDelta={trendDelta}
          prevPercentage={prevPercentage}
        />

        <AttendanceCharts
          monthlyData={MONTHLY_TREND}
          subjectData={subjectChartData}
        />

        <SubjectAttendanceTable
          rows={filteredSubjectRows}
          onDownload={handleDownload}
        />

        <LowAttendanceAlerts subjects={lowSubjects} target={TARGET_PCT} />
      </div>
    </div>
  );
};

export default AttendancePage;
