import React, { useState } from "react";
import { FiSend, FiLifeBuoy } from "react-icons/fi";

import CategoryChips from "../Feedback/CategoryChips";
import FileUpload from "../Placement/FileUpload";
import { useConfirm } from "../ui/ConfirmDialog";
import { useToast } from "../ui/Toaster";

const CATEGORIES = [
  "Account",
  "Course Access",
  "Assessment",
  "Attendance",
  "Placement",
  "Certificate",
  "Other",
];

const inputClass =
  "w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition-all duration-200 text-sm placeholder:text-gray-400 bg-white";
const errorBorder = "border-red-300 focus:ring-red-500 focus:border-red-500";

const CreateTicketForm = ({ onCreated }) => {
  const [category, setCategory] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const { confirm } = useConfirm();
  const { toast } = useToast();

  const reset = () => {
    setCategory(null);
    setTitle("");
    setDescription("");
    setAttachment(null);
    setErrors({});
    setSubmitted(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!category) errs.category = "Pick a category";
    if (!title.trim()) errs.title = "A short title helps the team triage";
    else if (title.trim().length < 6) errs.title = "Use at least 6 characters";
    if (!description.trim()) errs.description = "Describe what you ran into";
    else if (description.trim().length < 20)
      errs.description = "Add a bit more detail (20+ characters)";

    setErrors(errs);
    setSubmitted(true);
    if (Object.keys(errs).length > 0) return;

    const ok = await confirm({
      title: "Create ticket?",
      message: "We'll route it to the right team and you'll see it in My Queries.",
      confirmLabel: "Create ticket",
    });
    if (!ok) return;

    const ticket = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      title: title.trim(),
      category,
      description: description.trim(),
      createdAt: new Date().toISOString().slice(0, 10),
      status: "open",
    };
    console.log("[ticket] created ->", ticket);
    onCreated?.(ticket);
    toast({
      title: "Submitted successfully",
      message: `Ticket ${ticket.id} created. Switch to My Queries to track it.`,
      variant: "success",
    });
    reset();
  };

  const fieldErr = (k) => (submitted ? errors[k] : undefined);

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
          <div
            className="pointer-events-none absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/15 blur-2xl"
            aria-hidden="true"
          />
          <div className="relative flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm">
              <FiLifeBuoy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">New ticket</h2>
              <p className="text-xs text-white/85 mt-0.5">
                Be specific — screenshots help a lot
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 lg:p-8 space-y-6">
          {/* Category */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Category <span className="text-red-500">*</span>
            </label>
            <CategoryChips
              options={CATEGORIES}
              selected={category}
              onChange={setCategory}
            />
            {fieldErr("category") && (
              <p className="text-xs text-red-600 mt-2">{fieldErr("category")}</p>
            )}
          </div>

          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="text-sm font-semibold text-gray-700 mb-1.5 block"
            >
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="One-line summary of the issue"
              className={`${inputClass} text-base ${
                fieldErr("title") ? errorBorder : ""
              }`}
            />
            {fieldErr("title") && (
              <p className="text-xs text-red-600 mt-1.5">{fieldErr("title")}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="text-sm font-semibold text-gray-700 mb-1.5 block"
            >
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What were you trying to do? What happened? What did you expect?"
              className={`${inputClass} resize-y min-h-[140px] ${
                fieldErr("description") ? errorBorder : ""
              }`}
            />
            <div className="flex items-center justify-between mt-1.5">
              {fieldErr("description") ? (
                <p className="text-xs text-red-600">{fieldErr("description")}</p>
              ) : (
                <span />
              )}
              <p className="text-xs text-gray-400">{description.length} chars</p>
            </div>
          </div>

          {/* Attachment */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Attachment{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <FileUpload
              file={attachment}
              onFile={setAttachment}
              onClear={() => setAttachment(null)}
              accept=".png"
              helperText="Drag & drop a screenshot or click to browse (PNG, max 5MB)"
              maxMB={5}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
        <button
          type="button"
          onClick={reset}
          className="px-5 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
        >
          Reset
        </button>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-[0_8px_24px_-6px_rgba(124,58,237,0.45)] active:scale-[0.99] transition-all duration-200"
        >
          <FiSend className="w-4 h-4" />
          Submit Ticket
        </button>
      </div>
    </form>
  );
};

export default CreateTicketForm;
