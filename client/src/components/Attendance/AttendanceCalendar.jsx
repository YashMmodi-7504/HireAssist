import React, { useEffect, useMemo, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const formatDate = (year, month, day) => {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
};

const dayStyles = {
  present: "bg-green-50 text-green-700 border-green-200",
  absent: "bg-red-50 text-red-600 border-red-200",
  holiday: "bg-gray-100 text-gray-400 border-gray-200",
  none: "bg-white text-gray-700 border-gray-100",
};

const statusBadgeStyle = {
  present: "text-green-700 bg-green-50 border-green-100",
  absent: "text-red-700 bg-red-50 border-red-100",
  holiday: "text-gray-700 bg-gray-50 border-gray-200",
};

const DayDetailModal = ({ open, onClose, entry, day, monthLabel, year }) => {
  useEffect(() => {
    if (!open) return undefined;
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const status = entry?.status;
  const statusLabel = status
    ? status[0].toUpperCase() + status.slice(1)
    : "No record";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Attendance details for ${day} ${monthLabel}`}
    >
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-md w-full p-6">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <FiX className="w-4 h-4 text-gray-500" />
        </button>

        <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
          {day} {monthLabel} {year}
        </p>

        <div className="mt-3">
          <span
            className={`inline-flex px-2.5 py-1 rounded text-xs font-semibold border ${
              statusBadgeStyle[status] || statusBadgeStyle.holiday
            }`}
          >
            {statusLabel}
          </span>
        </div>

        {entry?.subject ? (
          <div className="mt-5 space-y-3">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">
                Subject
              </p>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">
                {entry.subject}
              </p>
            </div>
            {entry.topic && (
              <div>
                <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">
                  Topic
                </p>
                <p className="text-sm text-gray-700 mt-0.5">{entry.topic}</p>
              </div>
            )}
            {entry.faculty && (
              <div>
                <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">
                  Faculty
                </p>
                <p className="text-sm text-gray-700 mt-0.5">{entry.faculty}</p>
              </div>
            )}
          </div>
        ) : status === "holiday" ? (
          <p className="mt-5 text-sm text-gray-500">
            No classes scheduled — public holiday or weekend off.
          </p>
        ) : (
          <p className="mt-5 text-sm text-gray-500">
            No attendance record for this date.
          </p>
        )}
      </div>
    </div>
  );
};

const AttendanceCalendar = ({
  attendanceData = [],
  year,
  month,
  onMonthChange,
}) => {
  const today = new Date();
  const todayStr = formatDate(today.getFullYear(), today.getMonth(), today.getDate());
  const [selected, setSelected] = useState(null);

  const entryMap = useMemo(() => {
    const map = new Map();
    attendanceData.forEach((entry) => {
      if (entry?.date) map.set(entry.date, entry);
    });
    return map;
  }, [attendanceData]);

  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(day);

  const handlePrev = () => {
    if (month === 0) onMonthChange?.(year - 1, 11);
    else onMonthChange?.(year, month - 1);
  };

  const handleNext = () => {
    if (month === 11) onMonthChange?.(year + 1, 0);
    else onMonthChange?.(year, month + 1);
  };

  const tooltipFor = (entry, day) => {
    if (!entry) return `No record · ${day} ${MONTHS[month].slice(0, 3)}`;
    const status = entry.status[0].toUpperCase() + entry.status.slice(1);
    const parts = [status];
    if (entry.subject) parts.push(entry.subject);
    parts.push(`${day} ${MONTHS[month].slice(0, 3)}`);
    return parts.join(" · ");
  };

  const handleDayClick = (day) => {
    const dateStr = formatDate(year, month, day);
    setSelected({ day, entry: entryMap.get(dateStr) });
  };

  return (
    <>
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
        {/* Header: month nav + legend */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrev}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
              aria-label="Previous month"
            >
              <FiChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <h3 className="text-lg font-semibold text-gray-900 min-w-[160px] text-center">
              {MONTHS[month]} {year}
            </h3>
            <button
              type="button"
              onClick={handleNext}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
              aria-label="Next month"
            >
              <FiChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-green-200 border border-green-300" />
              Present
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-red-200 border border-red-300" />
              Absent
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-gray-200 border border-gray-300" />
              Holiday
            </span>
          </div>
        </div>

        {/* Weekday labels */}
        <div className="grid grid-cols-7 gap-3 mb-2">
          {WEEKDAYS.map((d) => (
            <div
              key={d}
              className="text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider py-2"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Day grid — card cells */}
        <div className="grid grid-cols-7 gap-3">
          {cells.map((day, idx) => {
            if (day === null) return <div key={`blank-${idx}`} className="h-[90px]" />;
            const dateStr = formatDate(year, month, day);
            const entry = entryMap.get(dateStr);
            const status = entry?.status;
            const isToday = dateStr === todayStr;
            const styles = dayStyles[status] || dayStyles.none;
            const bottomLabel =
              entry?.subject ||
              (status === "holiday" ? "Holiday" : status === "absent" ? "Absent" : null);

            return (
              <div key={dateStr} className="relative group">
                <button
                  type="button"
                  onClick={() => handleDayClick(day)}
                  className={`relative w-full h-[90px] rounded-xl border p-3 flex flex-col justify-between text-left transition-all duration-200 cursor-pointer hover:shadow-lg hover:scale-[1.02] hover:border-purple-300 hover:z-10 ${styles} ${
                    isToday
                      ? "ring-2 ring-purple-500 ring-offset-1 border-purple-500 shadow-[0_0_0_4px_rgba(124,58,237,0.10)]"
                      : ""
                  }`}
                  aria-label={tooltipFor(entry, day)}
                >
                  <span className="text-[22px] font-bold leading-none tracking-tight">
                    {day}
                  </span>
                  {bottomLabel && (
                    <span className="text-[10px] font-medium opacity-80 truncate w-full">
                      {bottomLabel}
                    </span>
                  )}
                </button>
                <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-20 shadow-lg">
                  {tooltipFor(entry, day)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <DayDetailModal
        open={selected !== null}
        onClose={() => setSelected(null)}
        entry={selected?.entry}
        day={selected?.day}
        monthLabel={MONTHS[month]}
        year={year}
      />
    </>
  );
};

export default AttendanceCalendar;
