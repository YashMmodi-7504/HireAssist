import React, { useMemo, useState } from "react";
import { FiSearch, FiSend, FiPlusCircle, FiUsers } from "react-icons/fi";
import FormSection from "../../components/ui/FormSection";
import { useConfirm } from "../../components/ui/ConfirmDialog";
import { useToast } from "../../components/ui/Toaster";

const AVAILABLE_STUDENTS = [
  { id: "S-1042", name: "Aarav Mehta", email: "aarav.mehta@example.com", college: "VIT" },
  { id: "S-1041", name: "Diya Patel", email: "diya.patel@example.com", college: "BITS" },
  { id: "S-1040", name: "Kabir Singh", email: "kabir.s@example.com", college: "IIT-D" },
  { id: "S-1039", name: "Ishita Rao", email: "ishita.rao@example.com", college: "NIT-T" },
  { id: "S-1038", name: "Reyansh Iyer", email: "reyansh.iyer@example.com", college: "VIT" },
  { id: "S-1036", name: "Vihaan Joshi", email: "vihaan.j@example.com", college: "IIT-B" },
  { id: "S-1035", name: "Anvi Reddy", email: "anvi.r@example.com", college: "BITS" },
  { id: "S-1033", name: "Saanvi Bose", email: "saanvi.b@example.com", college: "NIT-T" },
  { id: "S-1032", name: "Mihir Kapoor", email: "mihir.k@example.com", college: "VIT" },
  { id: "S-1031", name: "Pari Shah", email: "pari.shah@example.com", college: "IIT-D" },
  { id: "S-1029", name: "Rudra Das", email: "rudra.d@example.com", college: "BITS" },
  { id: "S-1028", name: "Tanvi Khan", email: "tanvi.k@example.com", college: "VIT" },
];

const inputClass =
  "w-full px-3 py-2 rounded-lg border border-gray-300 hover:border-gray-400 focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all duration-200 text-sm placeholder:text-gray-400 bg-white";
const errorBorder = "border-red-300 focus:ring-red-400 focus:border-transparent";

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

const initials = (name) =>
  name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const initialValues = {
  name: "",
  track: "",
  startDate: "",
  endDate: "",
  trainer: "",
  capacity: "",
  description: "",
};

const validate = (v, selectedCount) => {
  const e = {};
  if (!v.name.trim()) e.name = "Batch name is required";
  if (!v.track) e.track = "Pick a track";
  if (!v.startDate) e.startDate = "Required";
  if (!v.endDate) e.endDate = "Required";
  else if (v.startDate && v.endDate < v.startDate)
    e.endDate = "End must be after start";
  if (!v.trainer.trim()) e.trainer = "Assign a lead trainer";
  if (v.capacity && Number(v.capacity) < selectedCount)
    e.capacity = `Capacity must cover ${selectedCount} selected students`;
  if (selectedCount === 0) e.students = "Add at least one student";
  return e;
};

const AddBatchPage = () => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [selected, setSelected] = useState(new Set());
  const [search, setSearch] = useState("");
  const { confirm } = useConfirm();
  const { toast } = useToast();

  const setField = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };
  const handleChange = (e) => setField(e.target.name, e.target.value);

  const filteredStudents = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return AVAILABLE_STUDENTS;
    return AVAILABLE_STUDENTS.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.college.toLowerCase().includes(q)
    );
  }, [search]);

  const allFilteredSelected =
    filteredStudents.length > 0 &&
    filteredStudents.every((s) => selected.has(s.id));

  const toggleStudent = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    if (errors.students) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.students;
        return next;
      });
    }
  };

  const toggleAllFiltered = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allFilteredSelected) {
        filteredStudents.forEach((s) => next.delete(s.id));
      } else {
        filteredStudents.forEach((s) => next.add(s.id));
      }
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(values, selected.size);
    setErrors(errs);
    setSubmitted(true);
    if (Object.keys(errs).length > 0) {
      const first = Object.keys(errs)[0];
      const el = document.querySelector(`[name="${first}"]`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const ok = await confirm({
      title: "Create this batch?",
      message: `${selected.size} student${selected.size > 1 ? "s" : ""} will be enrolled in ${values.name}.`,
      confirmLabel: "Create batch",
    });
    if (!ok) return;

    const payload = { ...values, students: Array.from(selected) };
    console.log("[batch] create ->", payload);
    toast({
      title: "Batch created",
      message: `${values.name} is live with ${selected.size} student${selected.size > 1 ? "s" : ""}.`,
      variant: "success",
    });
    setValues(initialValues);
    setSelected(new Set());
    setErrors({});
    setSubmitted(false);
    setSearch("");
  };

  const handleReset = () => {
    setValues(initialValues);
    setSelected(new Set());
    setErrors({});
    setSubmitted(false);
    setSearch("");
  };

  const fieldErr = (k) => (submitted ? errors[k] : undefined);

  return (
    <div className="w-full bg-slate-50 min-h-full">
      <div className="bg-gradient-to-r from-purple-50 via-white to-indigo-50 border-b border-purple-100">
        <div className="px-6 lg:px-8 py-8 flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-sm">
            <FiPlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Add Batch</h1>
            <p className="text-sm text-gray-600 mt-1">
              Configure a new batch and enroll students in one step
            </p>
          </div>
        </div>
      </div>

      <div className="w-full px-6 lg:px-8 py-8 pb-32">
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Section 1: Batch Details */}
          <FormSection
            index="1"
            title="Batch Details"
            description="Track, schedule, and lead trainer"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field
                label="Batch Name"
                htmlFor="name"
                required
                error={fieldErr("name")}
              >
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={values.name}
                  onChange={handleChange}
                  placeholder="e.g. Code Unnati - Cohort 7"
                  className={`${inputClass} ${fieldErr("name") ? errorBorder : ""}`}
                />
              </Field>

              <Field label="Track" htmlFor="track" required error={fieldErr("track")}>
                <select
                  id="track"
                  name="track"
                  value={values.track}
                  onChange={handleChange}
                  className={`${inputClass} ${fieldErr("track") ? errorBorder : ""}`}
                >
                  <option value="">Select track</option>
                  <option value="AC">AC — Academic Course</option>
                  <option value="CU4FO">CU4FO — Code Unnati for FO</option>
                  <option value="VAC">VAC — Value Added Course</option>
                </select>
              </Field>

              <Field
                label="Start Date"
                htmlFor="startDate"
                required
                error={fieldErr("startDate")}
              >
                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={values.startDate}
                  onChange={handleChange}
                  className={`${inputClass} ${fieldErr("startDate") ? errorBorder : ""}`}
                />
              </Field>

              <Field
                label="End Date"
                htmlFor="endDate"
                required
                error={fieldErr("endDate")}
              >
                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={values.endDate}
                  onChange={handleChange}
                  className={`${inputClass} ${fieldErr("endDate") ? errorBorder : ""}`}
                />
              </Field>

              <Field
                label="Lead Trainer"
                htmlFor="trainer"
                required
                error={fieldErr("trainer")}
              >
                <input
                  id="trainer"
                  name="trainer"
                  type="text"
                  value={values.trainer}
                  onChange={handleChange}
                  placeholder="e.g. Praful Bhoyar"
                  className={`${inputClass} ${fieldErr("trainer") ? errorBorder : ""}`}
                />
              </Field>

              <Field label="Capacity" htmlFor="capacity" error={fieldErr("capacity")}>
                <input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min="0"
                  value={values.capacity}
                  onChange={handleChange}
                  placeholder="Optional cap"
                  className={`${inputClass} ${fieldErr("capacity") ? errorBorder : ""}`}
                />
              </Field>

              <Field label="Description" htmlFor="description" className="md:col-span-2">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={values.description}
                  onChange={handleChange}
                  placeholder="Anything trainers and students should know about this batch"
                  className={`${inputClass} resize-y`}
                />
              </Field>
            </div>
          </FormSection>

          {/* Section 2: Student Selection */}
          <FormSection
            index="2"
            title="Enroll Students"
            description="Pick students to add to this batch"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div className="relative flex-1 max-w-md">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, email, or college…"
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-transparent rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white focus:border-gray-200 transition-all duration-200"
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-100 px-2.5 py-1 rounded-full">
                  <FiUsers className="w-3 h-3" />
                  {selected.size} selected
                </span>
                <button
                  type="button"
                  onClick={toggleAllFiltered}
                  className="text-xs font-semibold text-purple-600 hover:text-purple-700 transition-colors"
                >
                  {allFilteredSelected ? "Deselect all" : "Select all"}
                </button>
              </div>
            </div>

            <div className="border border-gray-100 rounded-xl overflow-hidden">
              <div className="max-h-[360px] overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="w-12 text-left px-4 py-2.5"></th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        College
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-500">
                          No students match your search
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((s) => {
                        const checked = selected.has(s.id);
                        return (
                          <tr
                            key={s.id}
                            onClick={() => toggleStudent(s.id)}
                            className={`cursor-pointer transition-colors ${
                              checked ? "bg-purple-50/40 hover:bg-purple-50" : "hover:bg-gray-50"
                            }`}
                          >
                            <td className="px-4 py-2.5">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleStudent(s.id)}
                                onClick={(e) => e.stopPropagation()}
                                className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-400 cursor-pointer"
                                aria-label={`Select ${s.name}`}
                              />
                            </td>
                            <td className="px-4 py-2.5">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-[10px] flex-shrink-0">
                                  {initials(s.name)}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold text-gray-900 truncate">
                                    {s.name}
                                  </p>
                                  <p className="text-xs text-gray-500 truncate">
                                    {s.email}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-2.5">
                              <span className="text-xs font-mono font-semibold text-gray-600">
                                {s.id}
                              </span>
                            </td>
                            <td className="px-4 py-2.5">
                              <span className="text-xs text-gray-600">{s.college}</span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            {fieldErr("students") && (
              <p className="text-xs text-red-600 mt-2">{fieldErr("students")}</p>
            )}
          </FormSection>
        </form>
      </div>

      {/* Sticky bottom submit bar */}
      <div className="sticky bottom-0 z-10 backdrop-blur-md bg-white/85 border-t border-gray-200">
        <div className="px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-xs text-gray-600">
            {submitted && Object.keys(errors).length > 0 ? (
              <span className="text-red-600 font-semibold">
                {Object.keys(errors).length} field
                {Object.keys(errors).length > 1 ? "s" : ""} need attention
              </span>
            ) : (
              <span>
                <span className="font-semibold text-gray-900">{selected.size}</span> student
                {selected.size === 1 ? "" : "s"} ready to enroll
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
            >
              Reset
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-[0_8px_24px_-6px_rgba(124,58,237,0.45)] active:scale-[0.99] transition-all duration-200"
            >
              <FiSend className="w-4 h-4" />
              Create Batch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBatchPage;
