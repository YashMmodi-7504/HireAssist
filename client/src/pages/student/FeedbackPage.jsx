import React, { useState } from "react";
import { FiSend, FiMessageSquare } from "react-icons/fi";

import RatingStars from "../../components/Feedback/RatingStars";
import CategoryChips from "../../components/Feedback/CategoryChips";
import FileUpload from "../../components/Placement/FileUpload";
import { useConfirm } from "../../components/ui/ConfirmDialog";
import { useToast } from "../../components/ui/Toaster";

const CATEGORIES = [
  "Course Content",
  "Faculty",
  "Platform",
  "Assessments",
  "Placement Support",
  "Suggestions",
];

const inputClass =
  "w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-200 text-sm placeholder:text-gray-400 bg-white";

const FeedbackPage = () => {
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState(null);
  const [tags, setTags] = useState([]);
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const { confirm } = useConfirm();
  const { toast } = useToast();

  const resetForm = () => {
    setRating(0);
    setCategory(null);
    setTags([]);
    setMessage("");
    setAttachment(null);
    setErrors({});
    setSubmitted(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (rating === 0) errs.rating = "Please pick a rating";
    if (!category) errs.category = "Pick a category";
    if (!message.trim()) errs.message = "Add a short message";
    else if (message.trim().length < 10) errs.message = "At least 10 characters";

    setErrors(errs);
    setSubmitted(true);
    if (Object.keys(errs).length > 0) return;

    const ok = await confirm({
      title: "Submit feedback?",
      message: "Make sure your rating and message look right — you can't edit it afterwards.",
      confirmLabel: "Submit",
    });
    if (!ok) return;

    console.log("[feedback] submit ->", {
      rating,
      category,
      tags,
      message,
      attachment: attachment?.name,
    });
    toast({
      title: "Submitted successfully",
      message: "Thanks for the feedback — the team reviews responses every week.",
      variant: "success",
    });
    resetForm();
  };

  const handleReset = () => {
    resetForm();
  };

  return (
    <div className="w-full bg-slate-50 min-h-full">
      <div className="bg-gradient-to-r from-purple-50 via-white to-indigo-50 border-b border-purple-100">
        <div className="px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-semibold text-gray-900">
            Share Your Feedback
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Tell us what's working and what isn't — your voice shapes the platform
          </p>
        </div>
      </div>

      <div className="w-full max-w-2xl mx-auto px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Premium card with gradient header */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Gradient header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
              <div
                className="pointer-events-none absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/15 blur-2xl"
                aria-hidden="true"
              />
              <div className="relative flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm">
                  <FiMessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">We'd love your input</h2>
                  <p className="text-xs text-white/85 mt-0.5">
                    All fields except attachment are required
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 lg:p-8 space-y-7">
              {/* Rating */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Overall rating <span className="text-red-500">*</span>
                </label>
                <RatingStars value={rating} onChange={setRating} size="lg" />
                {submitted && errors.rating && (
                  <p className="text-xs text-red-600 mt-2">{errors.rating}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Pick a category <span className="text-red-500">*</span>
                </label>
                <CategoryChips
                  options={CATEGORIES}
                  selected={category}
                  onChange={setCategory}
                />
                {submitted && errors.category && (
                  <p className="text-xs text-red-600 mt-2">{errors.category}</p>
                )}
              </div>

              {/* Tags (multi) */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Add tags <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <CategoryChips
                  multi
                  options={["UI", "Performance", "Bug", "Idea", "Praise"]}
                  selected={tags}
                  onChange={setTags}
                />
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="text-sm font-semibold text-gray-700 mb-2 block"
                >
                  Your message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share what's on your mind…"
                  className={`${inputClass} resize-y min-h-[120px] ${
                    submitted && errors.message
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : ""
                  }`}
                />
                <div className="flex items-center justify-between mt-1.5">
                  {submitted && errors.message ? (
                    <p className="text-xs text-red-600">{errors.message}</p>
                  ) : (
                    <span />
                  )}
                  <p className="text-xs text-gray-400">{message.length} chars</p>
                </div>
              </div>

              {/* Attachment */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Attach a screenshot <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <FileUpload
                  file={attachment}
                  onFile={setAttachment}
                  onClear={() => setAttachment(null)}
                  accept=".png"
                  helperText="Drop a PNG screenshot here"
                  maxMB={3}
                />
              </div>
            </div>
          </div>

          {/* Submit row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
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
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackPage;
