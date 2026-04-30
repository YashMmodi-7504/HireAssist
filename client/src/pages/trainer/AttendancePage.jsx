import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiCheckSquare,
  FiClock,
  FiSave,
  FiCheckCircle,
  FiXCircle,
  FiChevronDown,
} from "react-icons/fi";

import Tabs from "../../components/ui/Tabs";
import FormSection from "../../components/ui/FormSection";
import CategoryChips from "../../components/Feedback/CategoryChips";
import FileUpload from "../../components/Placement/FileUpload";
import { useConfirm } from "../../components/ui/ConfirmDialog";
import { useToast } from "../../components/ui/Toaster";

const inputClass =
  "w-full px-3 py-2 rounded-lg border border-gray-300 hover:border-gray-400 focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all duration-200 text-sm placeholder:text-gray-400 bg-white";

const Field = ({ label, htmlFor, required, error, children, className = "" }) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    <label htmlFor={htmlFor} className="text-sm font-semibold text-gray-700">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
    {error && <p className="text-xs text-red-600 mt-0.5">{error}</p>}
  </div>
);

const SESSION_TYPES = ["Theory", "Practical", "Quiz", "Project"];

const initials = (name) =>
  name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const calcDuration = (start, end) => {
  if (!start || !end) return null;
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const mins = eh * 60 + em - (sh * 60 + sm);
  if (mins <= 0) return null;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
};

const STUDENTS_SEED = [
  { id: "S-1042", name: "Aarav Mehta", roll: "BMC-101" },
  { id: "S-1041", name: "Diya Patel", roll: "BMC-102" },
  { id: "S-1040", name: "Kabir Singh", roll: "BMC-103" },
  { id: "S-1039", name: "Ishita Rao", roll: "BMC-104" },
  { id: "S-1038", name: "Reyansh Iyer", roll: "BMC-105" },
  { id: "S-1036", name: "Vihaan Joshi", roll: "BMC-106" },
  { id: "S-1035", name: "Anvi Reddy", roll: "BMC-107" },
  { id: "S-1033", name: "Saanvi Bose", roll: "BMC-108" },
  { id: "S-1032", name: "Mihir Kapoor", roll: "BMC-109" },
  { id: "S-1031", name: "Pari Shah", roll: "BMC-110" },
  { id: "S-1029", name: "Rudra Das", roll: "BMC-111" },
  { id: "S-1028", name: "Tanvi Khan", roll: "BMC-112" },
];

const HISTORY_SEED = [
  {
    id: "H-1024",
    date: "2026-04-22",
    batch: "AC-2025",
    module: "Data Structures",
    submodule: "Trees",
    type: "Theory",
    duration: "1h 30m",
    present: 21,
    total: 23,
    description:
      "Covered tree traversal algorithms (in-order, pre-order, post-order). Worked through 3 example problems.",
  },
  {
    id: "H-1023",
    date: "2026-04-20",
    batch: "AC-2025",
    module: "Data Structures",
    submodule: "Trees",
    type: "Practical",
    duration: "2h",
    present: 22,
    total: 23,
    description:
      "Lab session — implemented binary search tree from scratch in Python. Pair programming.",
  },
  {
    id: "H-1022",
    date: "2026-04-18",
    batch: "CU4FO-25",
    module: "Web Development",
    submodule: "React Hooks",
    type: "Quiz",
    duration: "45m",
    present: 19,
    total: 20,
    description: "30-question MCQ quiz on hooks lifecycle and dependency arrays.",
  },
  {
    id: "H-1021",
    date: "2026-04-15",
    batch: "VAC-25",
    module: "Soft Skills",
    submodule: "Group Discussion",
    type: "Project",
    duration: "1h",
    present: 16,
    total: 18,
    description:
      "Mock GD session on emerging technologies. Recorded and shared feedback individually.",
  },
];

const typeChipStyle = {
  Theory: "text-blue-700 bg-blue-50 border-blue-100",
  Practical: "text-purple-700 bg-purple-50 border-purple-100",
  Quiz: "text-amber-700 bg-amber-50 border-amber-100",
  Project: "text-green-700 bg-green-50 border-green-100",
};

const Toggle = ({ checked, onChange, ariaLabel }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={ariaLabel}
    onClick={onChange}
    className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-1 ${
      checked ? "bg-green-500" : "bg-gray-300"
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
        checked ? "translate-x-4" : "translate-x-0.5"
      }`}
    />
  </button>
);

// ---------- Mark Attendance tab ----------

const MarkAttendance = () => {
  const { confirm } = useConfirm();
  const { toast } = useToast();
  const today = new Date().toISOString().slice(0, 10);

  const [values, setValues] = useState({
    date: today,
    batch: "AC-2025",
    module: "",
    submodule: "",
    topics: "",
    startTime: "10:00",
    endTime: "11:30",
    sessionType: "Theory",
    description: "",
    newLearning: "",
    challenges: "",
  });
  const [image, setImage] = useState(null);
  const [presentMap, setPresentMap] = useState(
    () => new Map(STUDENTS_SEED.map((s) => [s.id, true]))
  );

  const setField = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };
  const handleChange = (e) => setField(e.target.name, e.target.value);

  const duration = calcDuration(values.startTime, values.endTime);

  const presentCount = useMemo(
    () => Array.from(presentMap.values()).filter(Boolean).length,
    [presentMap]
  );

  const setAll = (val) => {
    setPresentMap(new Map(STUDENTS_SEED.map((s) => [s.id, val])));
  };

  const togglePresent = (id) => {
    setPresentMap((prev) => {
      const next = new Map(prev);
      next.set(id, !next.get(id));
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!values.module.trim()) {
      toast({
        title: "Module is required",
        message: "Please name the module before saving attendance.",
        variant: "error",
      });
      return;
    }
    const ok = await confirm({
      title: "Save attendance?",
      message: `Marking ${presentCount}/${STUDENTS_SEED.length} present for ${values.batch} on ${values.date}.`,
      confirmLabel: "Save",
    });
    if (!ok) return;
    console.log("[attendance] save ->", { ...values, presentMap: Object.fromEntries(presentMap), image: image?.name });
    toast({
      title: "Attendance saved",
      message: `${presentCount}/${STUDENTS_SEED.length} present recorded for ${values.batch}.`,
      variant: "success",
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Section 1: Session Details */}
      <FormSection
        index="1"
        title="Session Details"
        description="When and what was taught"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Date" htmlFor="date" required>
            <input
              id="date"
              name="date"
              type="date"
              value={values.date}
              onChange={handleChange}
              className={inputClass}
            />
          </Field>
          <Field label="Batch" htmlFor="batch" required>
            <select
              id="batch"
              name="batch"
              value={values.batch}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="AC-2025">AC-2025</option>
              <option value="CU4FO-25">CU4FO-25</option>
              <option value="VAC-25">VAC-25</option>
              <option value="AC-2026">AC-2026</option>
            </select>
          </Field>
          <Field label="Module" htmlFor="module" required>
            <input
              id="module"
              name="module"
              type="text"
              value={values.module}
              onChange={handleChange}
              placeholder="e.g. Data Structures"
              className={inputClass}
            />
          </Field>
          <Field label="Submodule" htmlFor="submodule">
            <input
              id="submodule"
              name="submodule"
              type="text"
              value={values.submodule}
              onChange={handleChange}
              placeholder="e.g. Trees"
              className={inputClass}
            />
          </Field>
          <Field label="Topics covered" htmlFor="topics" className="md:col-span-2">
            <input
              id="topics"
              name="topics"
              type="text"
              value={values.topics}
              onChange={handleChange}
              placeholder="Comma-separated topics, e.g. Inorder traversal, BST insertion"
              className={inputClass}
            />
          </Field>
        </div>
      </FormSection>

      {/* Section 2: Time Info */}
      <FormSection
        index="2"
        title="Time Info"
        description="Session duration is calculated automatically"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Field label="Start Time" htmlFor="startTime" required>
            <input
              id="startTime"
              name="startTime"
              type="time"
              value={values.startTime}
              onChange={handleChange}
              className={inputClass}
            />
          </Field>
          <Field label="End Time" htmlFor="endTime" required>
            <input
              id="endTime"
              name="endTime"
              type="time"
              value={values.endTime}
              onChange={handleChange}
              className={inputClass}
            />
          </Field>
          <Field label="Duration" htmlFor="duration">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200">
              <FiClock className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-semibold text-gray-900">
                {duration || "—"}
              </span>
              {!duration && (
                <span className="text-xs text-gray-500 ml-auto">
                  Pick valid start and end
                </span>
              )}
            </div>
          </Field>
        </div>
      </FormSection>

      {/* Section 3: Session Info */}
      <FormSection
        index="3"
        title="Session Info"
        description="Type, narrative, and notes"
      >
        <div className="space-y-5">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Session Type <span className="text-red-500">*</span>
            </label>
            <CategoryChips
              options={SESSION_TYPES}
              selected={values.sessionType}
              onChange={(v) => setField("sessionType", v)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Description" htmlFor="description" className="md:col-span-2">
              <textarea
                id="description"
                name="description"
                rows={3}
                value={values.description}
                onChange={handleChange}
                placeholder="What was covered in this session?"
                className={`${inputClass} resize-y`}
              />
            </Field>
            <Field label="New Learning Added" htmlFor="newLearning">
              <textarea
                id="newLearning"
                name="newLearning"
                rows={3}
                value={values.newLearning}
                onChange={handleChange}
                placeholder="Anything new students discovered or asked about?"
                className={`${inputClass} resize-y`}
              />
            </Field>
            <Field label="Challenges Faced" htmlFor="challenges">
              <textarea
                id="challenges"
                name="challenges"
                rows={3}
                value={values.challenges}
                onChange={handleChange}
                placeholder="Roadblocks, missed topics, follow-ups for next class"
                className={`${inputClass} resize-y`}
              />
            </Field>
          </div>
        </div>
      </FormSection>

      {/* Section 4: Upload */}
      <FormSection
        index="4"
        title="Session Image"
        description="Optional — board snap or activity photo"
      >
        <FileUpload
          file={image}
          onFile={setImage}
          onClear={() => setImage(null)}
          accept=".png"
          helperText="Drag & drop a PNG, or click to browse"
          maxMB={5}
        />
      </FormSection>

      {/* Student attendance table */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Student Attendance
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Tap the toggle to mark present / absent
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-100 px-3 py-1.5 rounded-full">
              Present:&nbsp;
              <span className="font-bold">{presentCount}</span>
              &nbsp;/ {STUDENTS_SEED.length}
            </span>
            <button
              type="button"
              onClick={() => setAll(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-100 border border-green-100 rounded-lg transition-colors"
            >
              <FiCheckCircle className="w-3.5 h-3.5" />
              Check All
            </button>
            <button
              type="button"
              onClick={() => setAll(false)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-100 rounded-lg transition-colors"
            >
              <FiXCircle className="w-3.5 h-3.5" />
              Uncheck All
            </button>
          </div>
        </div>
        <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Student
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Roll
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Mark
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {STUDENTS_SEED.map((s) => {
                const present = presentMap.get(s.id);
                return (
                  <tr
                    key={s.id}
                    onClick={() => togglePresent(s.id)}
                    className={`cursor-pointer transition-colors ${
                      present ? "hover:bg-green-50/40" : "hover:bg-red-50/40"
                    }`}
                  >
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-[10px]">
                          {initials(s.name)}
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                          {s.name}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <span className="text-xs font-mono font-semibold text-gray-600">
                        {s.roll}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                          present
                            ? "text-green-700 bg-green-50 border-green-100"
                            : "text-red-700 bg-red-50 border-red-100"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            present ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                        {present ? "Present" : "Absent"}
                      </span>
                    </td>
                    <td
                      className="px-6 py-3 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Toggle
                        checked={present}
                        onChange={() => togglePresent(s.id)}
                        ariaLabel={`Toggle attendance for ${s.name}`}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submit row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-[0_8px_24px_-6px_rgba(124,58,237,0.45)] active:scale-[0.99] transition-all duration-200"
        >
          <FiSave className="w-4 h-4" />
          Save Attendance
        </button>
      </div>
    </form>
  );
};

// ---------- History tab ----------

const HistoryRow = ({ entry }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <tr
        onClick={() => setOpen((o) => !o)}
        className="cursor-pointer hover:bg-purple-50/40 transition-colors"
      >
        <td className="px-6 py-3 text-sm text-gray-700 whitespace-nowrap">
          {entry.date}
        </td>
        <td className="px-6 py-3">
          <span className="inline-flex px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs font-mono font-semibold">
            {entry.batch}
          </span>
        </td>
        <td className="px-6 py-3 text-sm text-gray-700">
          <p className="font-semibold text-gray-900">{entry.module}</p>
          <p className="text-xs text-gray-500">{entry.submodule}</p>
        </td>
        <td className="px-6 py-3">
          <span
            className={`inline-flex px-2 py-0.5 rounded text-[11px] font-semibold border ${
              typeChipStyle[entry.type] || "text-gray-700 bg-gray-50 border-gray-200"
            }`}
          >
            {entry.type}
          </span>
        </td>
        <td className="px-6 py-3">
          <span className="inline-flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
            <FiClock className="w-3 h-3" />
            {entry.duration}
          </span>
        </td>
        <td className="px-6 py-3 text-sm text-gray-700">
          <span className="font-semibold text-gray-900">{entry.present}</span>
          <span className="text-gray-500"> / {entry.total}</span>
        </td>
        <td className="px-6 py-3 text-right">
          <FiChevronDown
            className={`w-4 h-4 text-gray-400 inline-block transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </td>
      </tr>
      {open && (
        <tr className="bg-gray-50/60">
          <td colSpan={7} className="px-6 py-4">
            <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">
              Description
            </p>
            <p className="text-sm text-gray-700 mt-1 leading-relaxed">
              {entry.description}
            </p>
          </td>
        </tr>
      )}
    </>
  );
};

const HistoryView = () => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Attendance History</h3>
        <p className="text-xs text-gray-500 mt-0.5">
          Click any row to expand the description
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Batch
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Module
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Type
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Duration
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Present
              </th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {""}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {HISTORY_SEED.map((e) => (
              <HistoryRow key={e.id} entry={e} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ---------- Page shell ----------

const AttendancePage = () => {
  const navigate = useNavigate();
  const { hash } = useLocation();
  const activeTab = hash === "#history" ? "history" : "mark";

  const setTab = (id) => {
    navigate(id === "history" ? "#history" : "#mark", { replace: true });
  };

  const tabs = [
    { id: "mark", label: "Mark Attendance", icon: FiCheckSquare },
    { id: "history", label: "History", icon: FiClock, count: HISTORY_SEED.length },
  ];

  return (
    <div className="w-full bg-slate-50 min-h-full">
      <div className="bg-gradient-to-r from-purple-50 via-white to-indigo-50 border-b border-purple-100">
        <div className="px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-semibold text-gray-900">Attendance</h1>
          <p className="text-sm text-gray-600 mt-1">
            Mark today's class and review past sessions
          </p>
        </div>
      </div>

      <div className="w-full px-6 lg:px-8 py-8 space-y-6">
        <Tabs tabs={tabs} activeId={activeTab} onChange={setTab} />
        <div key={activeTab} className="animate-[fadeIn_0.2s_ease-out]">
          {activeTab === "mark" ? <MarkAttendance /> : <HistoryView />}
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
