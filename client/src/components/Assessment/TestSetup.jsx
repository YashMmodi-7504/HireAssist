import React, { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiBookOpen,
  FiTarget,
  FiLayers,
} from "react-icons/fi";
import { SUBJECTS, LEVELS, sampleQuestions } from "../../data/assessmentBank";

/**
 * Three-step setup before a test launches:
 *   0. Pick a subject (skipped visually-but-not-removed if pre-selected)
 *   1. Pick a subtopic
 *   2. Pick difficulty
 *
 * Props:
 *   subjectId       string?  - pre-selected subject id (one of SUBJECTS[].id)
 *   defaultLevel    string?  - pre-selected difficulty
 *   onStart(config) called with { subjectId, subjectName, subtopic, level, questions, count }
 *   onCancel()      back to dashboard list
 */
const TestSetup = ({
  subjectId = null,
  defaultLevel = null,
  lockedSubject = false,
  onStart,
  onCancel,
}) => {
  const initialSubject =
    SUBJECTS.find((s) => s.id === subjectId) || SUBJECTS[0];
  const [subject, setSubject] = useState(initialSubject);
  const [subtopic, setSubtopic] = useState(initialSubject?.subtopics?.[0] || "");
  const [level, setLevel] = useState(defaultLevel || "easy");

  // Reset subtopic when subject changes (subtopics differ per subject).
  useEffect(() => {
    setSubtopic(subject?.subtopics?.[0] || "");
  }, [subject]);

  if (!subject) {
    return (
      <div className="bg-white border border-red-100 rounded-2xl p-6 text-center">
        <p className="text-sm text-red-700">No subjects available.</p>
        <button
          type="button"
          onClick={onCancel}
          className="mt-3 px-4 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
        >
          Back
        </button>
      </div>
    );
  }

  const handleStart = () => {
    const questions = sampleQuestions(subject.id, level);
    if (questions.length === 0) {
      alert("No questions available for this combination yet.");
      return;
    }
    onStart?.({
      subjectId: subject.id,
      subjectName: subject.name,
      subtopic,
      level,
      questions,
      count: questions.length,
    });
  };

  return (
    <div className="max-w-5xl mx-auto">
      <button
        type="button"
        onClick={onCancel}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-900 mb-4 transition-colors"
      >
        <FiArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Hero — color follows the active subject's accent */}
      <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8 mb-6 text-white shadow-md">
        <div className={`absolute inset-0 bg-gradient-to-br ${subject.accent}`} aria-hidden="true" />
        <div className="relative">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/85">
            Test setup
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold mt-1">{subject.name}</h1>
          <p className="text-sm text-white/90 mt-1.5">
            Pick a subject, focus area, and difficulty — we'll serve a randomized question set.
          </p>
        </div>
      </div>

      {/* Step 0: Subject — hidden when launched from a specific subject card.
          Subject isolation: the student commits to the subject they clicked
          and can't accidentally drift onto another one mid-setup. */}
      {!lockedSubject && (
        <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 mb-5">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="inline-flex p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <FiLayers className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Choose a subject</h3>
              <p className="text-[11px] text-gray-500">Determines the question bank</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {SUBJECTS.map((s) => {
              const active = s.id === subject.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSubject(s)}
                  className={`px-4 py-3 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                    active
                      ? "border-purple-300 bg-purple-50 text-purple-800 shadow-sm"
                      : "border-gray-200 bg-white text-gray-700 hover:border-purple-200 hover:bg-purple-50/50"
                  }`}
                >
                  {s.name}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Step 1: Subtopic */}
      <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 mb-5">
        <div className="flex items-center gap-2.5 mb-4">
          <span className="inline-flex p-2 rounded-lg bg-purple-50 text-purple-600">
            <FiBookOpen className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Choose a focus area</h3>
            <p className="text-[11px] text-gray-500">Subtopic for this attempt</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {subject.subtopics.map((s) => {
            const active = s === subtopic;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setSubtopic(s)}
                className={`px-4 py-3 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                  active
                    ? "border-purple-300 bg-purple-50 text-purple-800 shadow-sm"
                    : "border-gray-200 bg-white text-gray-700 hover:border-purple-200 hover:bg-purple-50/50"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </section>

      {/* Step 2: Difficulty */}
      <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 mb-6">
        <div className="flex items-center gap-2.5 mb-4">
          <span className="inline-flex p-2 rounded-lg bg-amber-50 text-amber-600">
            <FiTarget className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Pick difficulty</h3>
            <p className="text-[11px] text-gray-500">Adjusts question depth</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {LEVELS.map((l) => {
            const active = l.id === level;
            return (
              <button
                key={l.id}
                type="button"
                onClick={() => setLevel(l.id)}
                className={`text-left px-4 py-3 rounded-xl border transition-all duration-200 ${
                  active
                    ? "border-purple-300 bg-purple-50 shadow-sm"
                    : "border-gray-200 bg-white hover:border-purple-200 hover:bg-purple-50/50"
                }`}
              >
                <p className={`text-sm font-bold ${active ? "text-purple-800" : "text-gray-900"}`}>
                  {l.name}
                </p>
                <p className="text-[11px] text-gray-500 mt-0.5">{l.description}</p>
              </button>
            );
          })}
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleStart}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-[0_8px_24px_-6px_rgba(124,58,237,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
        >
          Start test
          <FiArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TestSetup;
