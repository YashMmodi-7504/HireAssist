import React, { useState } from "react";
import { FiSend, FiUsers } from "react-icons/fi";
import FormSection from "../../components/ui/FormSection";
import StateSelect from "../../components/ui/StateSelect";
import { useConfirm } from "../../components/ui/ConfirmDialog";
import { useToast } from "../../components/ui/Toaster";

const inputClass =
  "w-full px-3 py-2 rounded-lg border border-gray-300 hover:border-gray-400 focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all duration-200 text-sm placeholder:text-gray-400 bg-white";
const errorBorder =
  "border-red-300 focus:ring-red-400 focus:border-transparent";

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

const Toggle = ({ id, label, description, checked, onChange }) => (
  <label
    htmlFor={id}
    className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 hover:border-purple-200 cursor-pointer transition-colors duration-200"
  >
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 mt-0.5 items-center rounded-full transition-colors duration-200 ${
        checked ? "bg-purple-600" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? "translate-x-4" : "translate-x-0.5"
        }`}
      />
    </button>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-gray-900">{label}</p>
      {description && (
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      )}
    </div>
    <input
      id={id}
      type="checkbox"
      className="sr-only"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
  </label>
);

const initialValues = {
  fullName: "",
  email: "",
  phone: "",
  linkedin: "",
  collegeName: "",
  branch: "",
  graduationYear: "",
  rollNumber: "",
  currentCompany: "",
  currentRole: "",
  experience: "",
  city: "",
  state: null,
  willingToMentor: false,
  openToHiring: false,
  joinNewsletter: true,
  shareProfile: true,
};

const validate = (v) => {
  const e = {};
  if (!v.fullName.trim()) e.fullName = "Required";
  if (!v.email.trim()) e.email = "Required";
  else if (!/^\S+@\S+\.\S+$/.test(v.email)) e.email = "Enter a valid email";
  if (!v.phone.trim()) e.phone = "Required";
  else if (!/^\d{10}$/.test(v.phone)) e.phone = "10-digit number";
  if (!v.collegeName.trim()) e.collegeName = "Required";
  if (!v.branch.trim()) e.branch = "Required";
  if (!v.graduationYear.trim()) e.graduationYear = "Required";
  return e;
};

const AlumniPage = () => {
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

  const handleChange = (e) => setField(e.target.name, e.target.value);

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
      title: "Register as alumni?",
      message: "Your details will be added to the alumni directory based on your preferences.",
      confirmLabel: "Register",
    });
    if (!ok) return;

    console.log("[alumni] submit ->", values);
    toast({
      title: "Welcome to the Alumni Network",
      message: "Submitted successfully — confirmation email on the way.",
      variant: "success",
    });
  };

  const handleReset = () => {
    setValues(initialValues);
    setErrors({});
    setSubmitted(false);
  };

  const fieldErr = (name) => (submitted ? errors[name] : undefined);

  return (
    <div className="w-full bg-slate-50 min-h-full">
      <div className="bg-gradient-to-r from-purple-50 via-white to-indigo-50 border-b border-purple-100">
        <div className="px-6 lg:px-8 py-8 flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-sm">
            <FiUsers className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">
              Alumni Registration
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Stay in touch with your batch and help current students grow
            </p>
          </div>
        </div>
      </div>

      <div className="w-full px-6 lg:px-8 py-8 pb-32">
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Section 1: Personal Info */}
          <FormSection
            index="1"
            title="Personal Information"
            description="How we should reach out to you"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field
                label="Full Name"
                htmlFor="fullName"
                required
                error={fieldErr("fullName")}
              >
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={values.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Yash Modi"
                  className={`${inputClass} ${
                    fieldErr("fullName") ? errorBorder : ""
                  }`}
                />
              </Field>
              <Field
                label="Email"
                htmlFor="email"
                required
                error={fieldErr("email")}
              >
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`${inputClass} ${
                    fieldErr("email") ? errorBorder : ""
                  }`}
                />
              </Field>
              <Field
                label="Phone"
                htmlFor="phone"
                required
                error={fieldErr("phone")}
              >
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={values.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile"
                  className={`${inputClass} ${
                    fieldErr("phone") ? errorBorder : ""
                  }`}
                />
              </Field>
              <Field label="LinkedIn URL" htmlFor="linkedin">
                <input
                  id="linkedin"
                  name="linkedin"
                  type="url"
                  value={values.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/your-handle"
                  className={inputClass}
                />
              </Field>
              <Field label="City" htmlFor="city">
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={values.city}
                  onChange={handleChange}
                  placeholder="Where are you currently based?"
                  className={inputClass}
                />
              </Field>
              <Field label="State" htmlFor="state">
                <StateSelect
                  value={values.state}
                  onChange={(s) => setField("state", s)}
                  placeholder="Select your state"
                />
              </Field>
            </div>
          </FormSection>

          {/* Section 2: Academic Info */}
          <FormSection
            index="2"
            title="Academic Information"
            description="Your batch and program details"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field
                label="College Name"
                htmlFor="collegeName"
                required
                error={fieldErr("collegeName")}
                className="md:col-span-2"
              >
                <input
                  id="collegeName"
                  name="collegeName"
                  type="text"
                  value={values.collegeName}
                  onChange={handleChange}
                  placeholder="Your alma mater"
                  className={`${inputClass} ${
                    fieldErr("collegeName") ? errorBorder : ""
                  }`}
                />
              </Field>
              <Field
                label="Branch / Department"
                htmlFor="branch"
                required
                error={fieldErr("branch")}
              >
                <input
                  id="branch"
                  name="branch"
                  type="text"
                  value={values.branch}
                  onChange={handleChange}
                  placeholder="e.g. Computer Science"
                  className={`${inputClass} ${
                    fieldErr("branch") ? errorBorder : ""
                  }`}
                />
              </Field>
              <Field
                label="Graduation Year"
                htmlFor="graduationYear"
                required
                error={fieldErr("graduationYear")}
              >
                <select
                  id="graduationYear"
                  name="graduationYear"
                  value={values.graduationYear}
                  onChange={handleChange}
                  className={`${inputClass} ${
                    fieldErr("graduationYear") ? errorBorder : ""
                  }`}
                >
                  <option value="">Select year</option>
                  {Array.from({ length: 12 }, (_, i) => 2015 + i).map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Roll Number" htmlFor="rollNumber">
                <input
                  id="rollNumber"
                  name="rollNumber"
                  type="text"
                  value={values.rollNumber}
                  onChange={handleChange}
                  placeholder="As per your final mark sheet"
                  className={inputClass}
                />
              </Field>
            </div>
          </FormSection>

          {/* Section 3: Professional Info */}
          <FormSection
            index="3"
            title="Professional Information"
            description="What you're up to today"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Current Company" htmlFor="currentCompany">
                <input
                  id="currentCompany"
                  name="currentCompany"
                  type="text"
                  value={values.currentCompany}
                  onChange={handleChange}
                  placeholder="e.g. Google"
                  className={inputClass}
                />
              </Field>
              <Field label="Current Role" htmlFor="currentRole">
                <input
                  id="currentRole"
                  name="currentRole"
                  type="text"
                  value={values.currentRole}
                  onChange={handleChange}
                  placeholder="e.g. Software Engineer"
                  className={inputClass}
                />
              </Field>
              <Field
                label="Years of Experience"
                htmlFor="experience"
                className="md:col-span-2"
              >
                <select
                  id="experience"
                  name="experience"
                  value={values.experience}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select range</option>
                  <option value="0-1">0 – 1 years</option>
                  <option value="1-3">1 – 3 years</option>
                  <option value="3-5">3 – 5 years</option>
                  <option value="5-10">5 – 10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </Field>
            </div>
          </FormSection>

          {/* Section 4: Preferences */}
          <FormSection
            index="4"
            title="Preferences"
            description="How you'd like to engage with the community"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Toggle
                id="willingToMentor"
                label="Open to mentoring students"
                description="We'll match you with juniors in your stream"
                checked={values.willingToMentor}
                onChange={(v) => setField("willingToMentor", v)}
              />
              <Toggle
                id="openToHiring"
                label="Hiring at my company"
                description="Let us route relevant placement opportunities to you"
                checked={values.openToHiring}
                onChange={(v) => setField("openToHiring", v)}
              />
              <Toggle
                id="joinNewsletter"
                label="Subscribe to alumni newsletter"
                description="Quarterly stories and event invites"
                checked={values.joinNewsletter}
                onChange={(v) => setField("joinNewsletter", v)}
              />
              <Toggle
                id="shareProfile"
                label="Share profile in alumni directory"
                description="Other alumni can see your name, role, and city"
                checked={values.shareProfile}
                onChange={(v) => setField("shareProfile", v)}
              />
            </div>
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
              <span>Required fields are marked with *</span>
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
              className="inline-flex items-center justify-center gap-2 px-6 py-2 text-white text-sm font-semibold rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-md hover:shadow-lg hover:scale-105 active:scale-[0.99] transition-all duration-200"
            >
              <FiSend className="w-4 h-4" />
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniPage;
