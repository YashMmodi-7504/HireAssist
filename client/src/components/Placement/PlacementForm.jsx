import React, { useState } from "react";
import { FiSend } from "react-icons/fi";
import StateMultiSelect from "./StateMultiSelect";
import FileUpload from "./FileUpload";
import { useConfirm } from "../ui/ConfirmDialog";
import { useToast } from "../ui/Toaster";

const inputClass =
  "w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-200 text-sm placeholder:text-gray-400 bg-white";
const errorBorder = "border-red-300 focus:ring-red-500 focus:border-red-500";

const Field = ({ label, htmlFor, required, error, children, className = "" }) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    <label
      htmlFor={htmlFor}
      className="text-sm font-semibold text-gray-700"
    >
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
    {error && <p className="text-xs text-red-600 mt-0.5">{error}</p>}
  </div>
);

const SectionHeader = ({ index, title, description }) => (
  <div className="flex items-center gap-3 mb-5">
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-purple-50 text-purple-700 text-xs font-bold">
      {index}
    </span>
    <div>
      <h3 className="text-md font-semibold text-gray-900 leading-tight">
        {title}
      </h3>
      {description && (
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      )}
    </div>
  </div>
);

const initialValues = {
  fullName: "",
  email: "",
  phone: "",
  dob: "",
  gender: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  collegeName: "",
  branch: "",
  yop: "",
  cgpa: "",
  backlogs: "",
  tenth: "",
  twelfth: "",
  skills: "",
  jobRole: "",
  jobLocations: [],
  expectedSalary: "",
  willingToRelocate: "yes",
  resume: null,
};

const validate = (v) => {
  const e = {};
  if (!v.fullName.trim()) e.fullName = "Full name is required";
  if (!v.email.trim()) e.email = "Email is required";
  else if (!/^\S+@\S+\.\S+$/.test(v.email)) e.email = "Enter a valid email";
  if (!v.phone.trim()) e.phone = "Phone is required";
  else if (!/^\d{10}$/.test(v.phone)) e.phone = "10-digit number expected";
  if (!v.collegeName.trim()) e.collegeName = "College name is required";
  if (!v.branch.trim()) e.branch = "Branch is required";
  if (!v.yop.trim()) e.yop = "Year of passing is required";
  if (!v.cgpa.trim()) e.cgpa = "CGPA is required";
  else if (Number(v.cgpa) < 0 || Number(v.cgpa) > 10) e.cgpa = "Between 0 and 10";
  if (!v.skills.trim()) e.skills = "List at least one skill";
  if (!v.resume) e.resume = "Please upload your CV";
  return e;
};

const PlacementForm = () => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
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

  const handleChange = (e) => {
    setField(e.target.name, e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    setSubmitted(true);
    if (Object.keys(errs).length > 0) {
      const first = Object.keys(errs)[0];
      const el = document.querySelector(`[name="${first}"]`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const ok = await confirm({
      title: "Submit your placement application?",
      message: "Once submitted, the placement office will review your details.",
      confirmLabel: "Submit",
    });
    if (!ok) return;

    console.log("[placement] submit ->", values);
    toast({
      title: "Submitted successfully",
      message: "Your placement application has been received.",
      variant: "success",
    });
  };

  const handleReset = () => {
    setValues(initialValues);
    setErrors({});
    setSubmitted(false);
  };

  const fieldError = (name) => (submitted ? errors[name] : undefined);

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8 space-y-10">
        {/* Section 1: Academic Details */}
        <section>
          <SectionHeader
            index="1"
            title="Academic Details"
            description="College, branch, and academic record"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field
              label="College Name"
              htmlFor="collegeName"
              required
              error={fieldError("collegeName")}
              className="md:col-span-2"
            >
              <input
                id="collegeName"
                name="collegeName"
                type="text"
                value={values.collegeName}
                onChange={handleChange}
                placeholder="e.g. Indian Institute of Technology"
                className={`${inputClass} ${
                  fieldError("collegeName") ? errorBorder : ""
                }`}
              />
            </Field>

            <Field
              label="Branch / Department"
              htmlFor="branch"
              required
              error={fieldError("branch")}
            >
              <input
                id="branch"
                name="branch"
                type="text"
                value={values.branch}
                onChange={handleChange}
                placeholder="e.g. Computer Science"
                className={`${inputClass} ${fieldError("branch") ? errorBorder : ""}`}
              />
            </Field>

            <Field
              label="Year of Passing"
              htmlFor="yop"
              required
              error={fieldError("yop")}
            >
              <select
                id="yop"
                name="yop"
                value={values.yop}
                onChange={handleChange}
                className={`${inputClass} ${fieldError("yop") ? errorBorder : ""}`}
              >
                <option value="">Select year</option>
                {[2024, 2025, 2026, 2027, 2028].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              label="CGPA (out of 10)"
              htmlFor="cgpa"
              required
              error={fieldError("cgpa")}
            >
              <input
                id="cgpa"
                name="cgpa"
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={values.cgpa}
                onChange={handleChange}
                placeholder="e.g. 8.5"
                className={`${inputClass} ${fieldError("cgpa") ? errorBorder : ""}`}
              />
            </Field>

            <Field label="Active Backlogs" htmlFor="backlogs">
              <input
                id="backlogs"
                name="backlogs"
                type="number"
                min="0"
                value={values.backlogs}
                onChange={handleChange}
                placeholder="0"
                className={inputClass}
              />
            </Field>

            <Field label="10th %" htmlFor="tenth">
              <input
                id="tenth"
                name="tenth"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={values.tenth}
                onChange={handleChange}
                placeholder="e.g. 92.5"
                className={inputClass}
              />
            </Field>

            <Field label="12th %" htmlFor="twelfth">
              <input
                id="twelfth"
                name="twelfth"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={values.twelfth}
                onChange={handleChange}
                placeholder="e.g. 89.4"
                className={inputClass}
              />
            </Field>
          </div>
        </section>

        <div className="border-t border-gray-100" />

        {/* Section 2: Personal Details */}
        <section>
          <SectionHeader
            index="2"
            title="Personal Details"
            description="Contact and identification information"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field
              label="Full Name"
              htmlFor="fullName"
              required
              error={fieldError("fullName")}
            >
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={values.fullName}
                onChange={handleChange}
                placeholder="e.g. Yash Modi"
                className={`${inputClass} ${fieldError("fullName") ? errorBorder : ""}`}
              />
            </Field>

            <Field
              label="Email"
              htmlFor="email"
              required
              error={fieldError("email")}
            >
              <input
                id="email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`${inputClass} ${fieldError("email") ? errorBorder : ""}`}
              />
            </Field>

            <Field
              label="Phone"
              htmlFor="phone"
              required
              error={fieldError("phone")}
            >
              <input
                id="phone"
                name="phone"
                type="tel"
                value={values.phone}
                onChange={handleChange}
                placeholder="10-digit mobile"
                className={`${inputClass} ${fieldError("phone") ? errorBorder : ""}`}
              />
            </Field>

            <Field label="Date of Birth" htmlFor="dob">
              <input
                id="dob"
                name="dob"
                type="date"
                value={values.dob}
                onChange={handleChange}
                className={inputClass}
              />
            </Field>

            <Field label="Gender" htmlFor="gender">
              <select
                id="gender"
                name="gender"
                value={values.gender}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </Field>

            <Field label="City" htmlFor="city">
              <input
                id="city"
                name="city"
                type="text"
                value={values.city}
                onChange={handleChange}
                placeholder="e.g. Pune"
                className={inputClass}
              />
            </Field>

            <Field label="State" htmlFor="state">
              <input
                id="state"
                name="state"
                type="text"
                value={values.state}
                onChange={handleChange}
                placeholder="e.g. Maharashtra"
                className={inputClass}
              />
            </Field>

            <Field label="Pincode" htmlFor="pincode">
              <input
                id="pincode"
                name="pincode"
                type="text"
                inputMode="numeric"
                value={values.pincode}
                onChange={handleChange}
                placeholder="6 digits"
                className={inputClass}
              />
            </Field>

            <Field
              label="Address"
              htmlFor="address"
              className="md:col-span-2"
            >
              <textarea
                id="address"
                name="address"
                rows={2}
                value={values.address}
                onChange={handleChange}
                placeholder="Permanent address"
                className={`${inputClass} resize-none`}
              />
            </Field>
          </div>
        </section>

        <div className="border-t border-gray-100" />

        {/* Section 3: Skills & Preferences */}
        <section>
          <SectionHeader
            index="3"
            title="Skills & Preferences"
            description="Roles, locations, and your CV"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field
              label="Key Skills"
              htmlFor="skills"
              required
              error={fieldError("skills")}
              className="md:col-span-2"
            >
              <input
                id="skills"
                name="skills"
                type="text"
                value={values.skills}
                onChange={handleChange}
                placeholder="e.g. React, Node.js, Python, SQL"
                className={`${inputClass} ${fieldError("skills") ? errorBorder : ""}`}
              />
            </Field>

            <Field label="Preferred Job Role" htmlFor="jobRole">
              <input
                id="jobRole"
                name="jobRole"
                type="text"
                value={values.jobRole}
                onChange={handleChange}
                placeholder="e.g. Frontend Engineer"
                className={inputClass}
              />
            </Field>

            <Field label="Expected Salary (LPA)" htmlFor="expectedSalary">
              <input
                id="expectedSalary"
                name="expectedSalary"
                type="number"
                step="0.5"
                min="0"
                value={values.expectedSalary}
                onChange={handleChange}
                placeholder="e.g. 8"
                className={inputClass}
              />
            </Field>

            <Field
              label="Preferred Job Locations"
              htmlFor="jobLocations"
              className="md:col-span-2"
            >
              <StateMultiSelect
                value={values.jobLocations}
                onChange={(states) => setField("jobLocations", states)}
                max={3}
              />
              <p className="text-xs text-gray-500 mt-1">
                Pick up to 3 Indian states you'd like to be considered for.
              </p>
            </Field>

            <Field
              label="Willing to Relocate"
              htmlFor="willingToRelocate"
            >
              <select
                id="willingToRelocate"
                name="willingToRelocate"
                value={values.willingToRelocate}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="depends">Depends on role</option>
              </select>
            </Field>

            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                Resume / CV<span className="text-red-500 ml-0.5">*</span>
              </label>
              <FileUpload
                file={values.resume}
                onFile={(f) => setField("resume", f)}
                onClear={() => setField("resume", null)}
                error={fieldError("resume")}
              />
            </div>
          </div>
        </section>
      </div>

      {/* Submit row */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
        <button
          type="button"
          onClick={handleReset}
          className="px-5 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
        >
          Reset
        </button>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-[0_8px_24px_-6px_rgba(124,58,237,0.45)] active:scale-[0.99] transition-all duration-200"
        >
          <FiSend className="w-4 h-4" />
          Submit Application
        </button>
      </div>

      {submitted && Object.keys(errors).length > 0 && (
        <p className="mt-3 text-xs text-red-600 text-right">
          Please fix {Object.keys(errors).length} field
          {Object.keys(errors).length > 1 ? "s" : ""} above
        </p>
      )}
    </form>
  );
};

export default PlacementForm;
