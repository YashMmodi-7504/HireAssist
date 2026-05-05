import React, { useMemo, useState } from "react";
import { FiBookOpen } from "react-icons/fi";

import SubjectCard from "../../components/StudyMaterial/SubjectCard";
import ContinueLearningHero from "../../components/StudyMaterial/ContinueLearningHero";
import MaterialCard from "../../components/StudyMaterial/MaterialCard";
import MaterialFilters from "../../components/StudyMaterial/MaterialFilters";

const SUBJECTS = [
  { name: "Python", modules: 8, progress: 60 },
  { name: "Web Development", modules: 12, progress: 40 },
  { name: "Machine Learning", modules: 6, progress: 25 },
  { name: "Deep Learning", modules: 4, progress: 10 },
  { name: "DSA", modules: 10, progress: 75 },
];

const CONTINUE_ITEM = {
  id: "py-m4-l2",
  title: "List Comprehensions Deep Dive",
  subject: "Python",
  module: "Module 4 · Lesson 2",
  progress: 65,
  timeLeft: "15 min left",
};

const MATERIALS = [
  {
    id: 1,
    title: "Python Basics",
    type: "video",
    duration: "45 min",
    progress: 100,
    subject: "Python",
  },
  {
    id: 2,
    title: "Object-Oriented Programming",
    type: "video",
    duration: "38 min",
    progress: 60,
    subject: "Python",
    bookmarked: true,
  },
  {
    id: 3,
    title: "Python Cheatsheet",
    type: "pdf",
    pages: 24,
    progress: 0,
    subject: "Python",
  },
  {
    id: 4,
    title: "React Fundamentals",
    type: "video",
    duration: "1h 12min",
    progress: 30,
    subject: "Web Development",
  },
  {
    id: 5,
    title: "CSS Layout Notes",
    type: "notes",
    pages: 12,
    progress: 100,
    subject: "Web Development",
  },
  {
    id: 6,
    title: "Build a REST API",
    type: "assignment",
    duration: "Due in 5 days",
    progress: 25,
    subject: "Web Development",
    bookmarked: true,
  },
  {
    id: 7,
    title: "Linear Regression Walkthrough",
    type: "video",
    duration: "52 min",
    progress: 0,
    subject: "Machine Learning",
  },
  {
    id: 8,
    title: "ML Algorithms Reference",
    type: "pdf",
    pages: 48,
    progress: 40,
    subject: "Machine Learning",
  },
  {
    id: 9,
    title: "Backpropagation Notes",
    type: "notes",
    pages: 18,
    progress: 0,
    subject: "Deep Learning",
  },
  {
    id: 10,
    title: "Build a CNN Classifier",
    type: "assignment",
    duration: "Due in 9 days",
    progress: 0,
    subject: "Deep Learning",
  },
  {
    id: 11,
    title: "Graph Traversal Patterns",
    type: "video",
    duration: "42 min",
    progress: 80,
    subject: "DSA",
  },
  {
    id: 12,
    title: "DSA Pattern Cheatsheet",
    type: "pdf",
    pages: 36,
    progress: 100,
    subject: "DSA",
  },
];

const statusOf = (m) => {
  const p = m.progress ?? 0;
  if (p >= 100) return "completed";
  if (p > 0) return "in-progress";
  return "not-started";
};

const StudyMaterialPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const subjectNames = useMemo(() => SUBJECTS.map((s) => s.name), []);

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return MATERIALS.filter((m) => {
      const matchesSearch =
        !q ||
        m.title.toLowerCase().includes(q) ||
        (m.subject || "").toLowerCase().includes(q);
      const matchesSubject =
        selectedSubject === "all" || m.subject === selectedSubject;
      const matchesType = selectedType === "all" || m.type === selectedType;
      const matchesStatus =
        selectedStatus === "all" || statusOf(m) === selectedStatus;
      return matchesSearch && matchesSubject && matchesType && matchesStatus;
    });
  }, [searchTerm, selectedSubject, selectedType, selectedStatus]);

  const handleReset = () => {
    setSearchTerm("");
    setSelectedSubject("all");
    setSelectedType("all");
    setSelectedStatus("all");
  };

  const handleOpen = (m) => {
    console.log("[material] open ->", m.title);
  };

  const handleDownload = (m) => {
    console.log("[material] download ->", m.title);
  };

  const handleBookmark = (m, next) => {
    console.log("[material] bookmark ->", m.title, next);
  };

  const handleResume = (item) => {
    console.log("[material] resume ->", item.title);
  };

  const handleSubjectOpen = (name) => {
    setSelectedSubject(name);
  };

  return (
    <div className="w-full bg-slate-50 min-h-full">
      {/* Header band */}
      <div className="bg-gradient-to-r from-purple-50 via-white to-indigo-50 border-b border-purple-100">
        <div className="px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-semibold text-gray-900">Study Material</h1>
          <p className="text-sm text-gray-600 mt-1">
            Access your learning resources across subjects
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="w-full px-6 lg:px-8 py-8 space-y-8">
        {/* Subject hero cards */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Subjects</h2>
            <span className="text-xs text-gray-500">
              {SUBJECTS.length} active
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {SUBJECTS.map((s) => (
              <SubjectCard
                key={s.name}
                name={s.name}
                modules={s.modules}
                progress={s.progress}
                onOpen={handleSubjectOpen}
              />
            ))}
          </div>
        </section>

        {/* Continue learning hero */}
        <ContinueLearningHero item={CONTINUE_ITEM} onResume={handleResume} />

        {/* Filters */}
        <MaterialFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          subjects={subjectNames}
          selectedSubject={selectedSubject}
          onSubjectChange={setSelectedSubject}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          onReset={handleReset}
        />

        {/* Materials grid / empty state */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">All Materials</h2>
            <span className="text-xs text-gray-500">
              {filtered.length} {filtered.length === 1 ? "item" : "items"}
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
              <div className="inline-flex p-3 rounded-2xl bg-purple-50 text-purple-600 mb-3">
                <FiBookOpen className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-gray-900">
                No materials available yet
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Try adjusting your filters or check back later
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="mt-4 inline-flex px-4 py-2 text-sm font-semibold text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((m) => (
                <MaterialCard
                  key={m.id}
                  material={m}
                  onOpen={handleOpen}
                  onDownload={handleDownload}
                  onBookmark={handleBookmark}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default StudyMaterialPage;
