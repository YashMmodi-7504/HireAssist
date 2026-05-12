import React, { useMemo, useState } from "react";
import { FiPlay } from "react-icons/fi";

import AssessmentCard from "../../components/Assessment/AssessmentCard";
import SubjectSection from "../../components/Assessment/SubjectSection";
import AssessmentFilters from "../../components/Assessment/AssessmentFilters";
import AssessmentSummary from "../../components/Assessment/AssessmentSummary";
import PerformanceAnalytics from "../../components/Assessment/PerformanceAnalytics";
import WeakAreas from "../../components/Assessment/WeakAreas";
import RecommendedTests from "../../components/Assessment/RecommendedTests";
import RecentActivity from "../../components/Assessment/RecentActivity";
import AISuggestions from "../../components/Assessment/AISuggestions";
import PerformanceInsights from "../../components/Assessment/PerformanceInsights";

// Live test-engine components
import TestSetup from "../../components/assessment/TestSetup";
import TestRunner from "../../components/assessment/TestRunner";
import ResultPage from "../../components/assessment/ResultPage";
import { saveResult } from "../../services/assessmentStore";

// Map dashboard card subject names to the bank's subject ids. Cards whose
// subject isn't mapped here can't launch a real test yet (no questions).
const SUBJECT_NAME_TO_ID = {
  Python: "python",
  "Web Development": "web-dev",
  DSA: "dsa",
};
// Map card difficulties to bank levels.
const DIFFICULTY_TO_LEVEL = {
  easy: "easy",
  medium: "intermediate",
  hard: "hard",
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("Assessment Error:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <h1 className="text-2xl font-semibold text-red-700 mb-3">
              Error Loading Assessments
            </h1>
            <p className="text-red-600 mb-6">{this.state.error?.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const ASSESSMENTS = [
  // Python
  { id: 1, title: "Python Fundamentals", subject: "Python", difficulty: "easy", duration: 30, questions: 20, status: "completed", score: 92, attempts: 1, tag: "high-scoring", description: "Variables, loops, and core syntax in Python" },
  { id: 2, title: "Object-Oriented Python", subject: "Python", difficulty: "medium", duration: 45, questions: 25, status: "in-progress", progress: 60, attempts: 1, tag: "trending", description: "Classes, inheritance, and polymorphism" },
  { id: 3, title: "Python for Data Science", subject: "Python", difficulty: "hard", duration: 60, questions: 30, status: "not-started", description: "NumPy, Pandas, and data manipulation" },

  // Web Development
  { id: 4, title: "HTML & CSS Essentials", subject: "Web Development", difficulty: "easy", duration: 30, questions: 20, status: "completed", score: 88, attempts: 1, description: "Modern web markup and styling" },
  { id: 5, title: "React + TypeScript", subject: "Web Development", difficulty: "medium", duration: 45, questions: 20, status: "completed", score: 85, attempts: 1, description: "Build modern web applications" },
  { id: 6, title: "Full-Stack with Node.js", subject: "Web Development", difficulty: "hard", duration: 60, questions: 30, status: "not-started", description: "REST APIs and backend integration" },

  // Machine Learning
  { id: 7, title: "ML Foundations", subject: "Machine Learning", difficulty: "medium", duration: 45, questions: 25, status: "completed", score: 76, attempts: 2, description: "Supervised and unsupervised learning" },
  { id: 8, title: "Feature Engineering", subject: "Machine Learning", difficulty: "hard", duration: 50, questions: 25, status: "not-started", description: "Data preprocessing and feature selection" },

  // Deep Learning
  { id: 9, title: "Neural Networks Basics", subject: "Deep Learning", difficulty: "hard", duration: 60, questions: 30, status: "in-progress", progress: 35, attempts: 1, description: "Backpropagation and activation functions" },
  { id: 10, title: "CNN Architectures", subject: "Deep Learning", difficulty: "hard", duration: 60, questions: 30, status: "not-started", description: "Convolutional networks for vision" },

  // DSA
  { id: 11, title: "DSA Fundamentals", subject: "DSA", difficulty: "easy", duration: 30, questions: 20, status: "completed", score: 88, attempts: 1, description: "Master basic data structures" },
  { id: 12, title: "Advanced Arrays & Hashing", subject: "DSA", difficulty: "medium", duration: 45, questions: 25, status: "in-progress", progress: 60, attempts: 1, description: "Deep dive into array optimization" },
  { id: 13, title: "Graph Algorithms", subject: "DSA", difficulty: "hard", duration: 60, questions: 30, status: "not-started", tag: "recommended", description: "BFS, DFS, and shortest-path algorithms" },

  // Aptitude
  { id: 14, title: "Logical Reasoning", subject: "Aptitude", difficulty: "medium", duration: 40, questions: 25, status: "completed", score: 64, attempts: 2, description: "Build logical thinking skills" },
  { id: 15, title: "Quantitative Aptitude", subject: "Aptitude", difficulty: "hard", duration: 50, questions: 30, status: "not-started", tag: "recommended", description: "Master numerical problem-solving" },
];

// Unified palette — must match GradientCard / SubjectCard color keys.
const SUBJECT_COLOR = {
  Python: "blue",
  "Web Development": "purple",
  "Machine Learning": "pink",
  "Deep Learning": "orange",
  DSA: "green",
  Aptitude: "indigo",
};

const RECENT_TIMES = ["2h ago", "1d ago", "2d ago", "3d ago", "5d ago", "1w ago"];

const CircleProgress = ({ value = 0, size = 88, stroke = 8 }) => {
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (value / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="transparent" stroke="#ede9fe" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="transparent"
        stroke="#7c3aed"
        strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-700"
      />
    </svg>
  );
};

const avgFor = (items) => {
  const scored = items.filter((i) => i.status === "completed" && typeof i.score === "number");
  if (scored.length === 0) return null;
  return Math.round(scored.reduce((s, i) => s + i.score, 0) / scored.length);
};

const AssessmentPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const subjects = useMemo(
    () => Array.from(new Set(ASSESSMENTS.map((a) => a.subject))),
    []
  );

  const stats = useMemo(() => {
    const total = ASSESSMENTS.length;
    const completed = ASSESSMENTS.filter((a) => a.status === "completed").length;
    const pending = total - completed;
    const completedScores = ASSESSMENTS.filter((a) => a.status === "completed").map(
      (a) => a.score || 0
    );
    const avgScore =
      completedScores.length > 0
        ? Math.round(completedScores.reduce((s, x) => s + x, 0) / completedScores.length)
        : 0;
    return { total, completed, pending, avgScore };
  }, []);

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return ASSESSMENTS.filter((a) => {
      const matchesSearch = !q || a.title.toLowerCase().includes(q);
      const matchesSubject = selectedSubject === "all" || a.subject === selectedSubject;
      const matchesDifficulty =
        selectedDifficulty === "all" || a.difficulty === selectedDifficulty;
      const matchesStatus = selectedStatus === "all" || a.status === selectedStatus;
      return matchesSearch && matchesSubject && matchesDifficulty && matchesStatus;
    });
  }, [searchTerm, selectedSubject, selectedDifficulty, selectedStatus]);

  const grouped = useMemo(() => {
    const order = subjects;
    const map = new Map();
    filtered.forEach((a) => {
      if (!map.has(a.subject)) map.set(a.subject, []);
      map.get(a.subject).push(a);
    });
    return order
      .filter((s) => map.has(s))
      .map((subject) => {
        const items = map.get(subject);
        return { subject, items, avg: avgFor(items) };
      });
  }, [filtered, subjects]);

  const scoreHistory = useMemo(
    () =>
      ASSESSMENTS.filter((a) => a.status === "completed").map((a) => ({
        name: a.title.length > 16 ? a.title.slice(0, 14) + "…" : a.title,
        score: a.score || 0,
      })),
    []
  );

  const subjectPerformance = useMemo(
    () =>
      subjects
        .map((subj) => {
          const items = ASSESSMENTS.filter((a) => a.subject === subj);
          const avg = avgFor(items);
          return avg != null ? { name: subj, value: avg } : null;
        })
        .filter(Boolean),
    [subjects]
  );

  const weakAreas = useMemo(
    () =>
      subjectPerformance
        .filter((s) => s.value < 70)
        .map((s) => ({ subject: s.name, avg: s.value })),
    [subjectPerformance]
  );

  const recommended = useMemo(() => {
    const weakSubjects = new Set(weakAreas.map((w) => w.subject));
    const inWeak = ASSESSMENTS.filter(
      (a) => a.status === "not-started" && weakSubjects.has(a.subject)
    );
    const others = ASSESSMENTS.filter(
      (a) => a.status === "not-started" && !weakSubjects.has(a.subject)
    );
    return [...inWeak, ...others].slice(0, 4);
  }, [weakAreas]);

  const recentActivity = useMemo(
    () =>
      ASSESSMENTS.filter((a) => a.status !== "not-started")
        .slice(0, 5)
        .map((a, i) => ({
          id: a.id,
          title: a.title,
          subject: a.subject,
          score: a.status === "completed" ? a.score : null,
          timeAgo: RECENT_TIMES[i] || "recently",
        })),
    []
  );

  const aiSuggestion = useMemo(() => {
    const top = recommended[0];
    if (!top) return null;
    const isWeak = weakAreas.some((w) => w.subject === top.subject);
    const detail = isWeak
      ? `Your ${top.subject} score is below 70% — this test is a good way to bring it back up.`
      : `A ${top.difficulty} ${top.subject} test that pairs well with your recent progress.`;
    return {
      headline: `Based on your performance, try ${top.title} next.`,
      detail,
      cta: "Start now",
      target: top,
    };
  }, [recommended, weakAreas]);

  // ─── Test-engine state machine ─────────────────────────────────────────
  // engineStage: "idle" | "setup" | "running" | "result"
  const [engineStage, setEngineStage] = useState("idle");
  const [engineConfig, setEngineConfig] = useState(null);
  const [engineResult, setEngineResult] = useState(null);

  const launchSetup = (subjectId = null, defaultLevel = null, lockedSubject = false) => {
    setEngineConfig({ subjectId, defaultLevel, lockedSubject });
    setEngineStage("setup");
  };

  const handleStartTest = (cfg) => {
    setEngineConfig(cfg);
    setEngineStage("running");
  };

  const handleSubmitTest = (result) => {
    setEngineResult(result);
    setEngineStage("result");
    // Persist a sanitized copy (omit the question objects to keep storage
    // small; ids + answers are enough to reconstruct a review later).
    saveResult({
      id: `r-${Date.now()}`,
      subjectId: result.subjectId,
      subjectName: result.subjectName,
      subtopic: result.subtopic,
      level: result.level,
      score: result.score,
      total: result.total,
      percentage: result.percentage,
      answers: result.answers,
      questionIds: result.questionIds,
      durationMs: result.durationMs,
      completedAt: result.completedAt,
    });
  };

  const handleEngineHome = () => {
    setEngineStage("idle");
    setEngineConfig(null);
    setEngineResult(null);
  };

  const handleRetake = () => {
    if (!engineResult) return handleEngineHome();
    launchSetup(engineResult.subjectId, engineResult.level);
  };

  const handleAction = (a) => {
    const subjectId = SUBJECT_NAME_TO_ID[a.subject];
    if (!subjectId) {
      // Subject doesn't have a question bank yet — fall back to a free
      // setup so the user can still pick a subject they CAN test.
      launchSetup(null, DIFFICULTY_TO_LEVEL[a.difficulty] || "easy", false);
      return;
    }
    // Subject isolation: clicking a specific card commits the user to that
    // subject — they can still tweak subtopic and difficulty.
    launchSetup(subjectId, DIFFICULTY_TO_LEVEL[a.difficulty] || "easy", true);
  };

  const handleReset = () => {
    setSearchTerm("");
    setSelectedSubject("all");
    setSelectedDifficulty("all");
    setSelectedStatus("all");
  };

  // When the engine is active, take over the page entirely.
  if (engineStage !== "idle") {
    return (
      <ErrorBoundary>
        <div className="w-full bg-slate-50 min-h-full px-6 lg:px-8 py-8">
          {engineStage === "setup" && (
            <TestSetup
              subjectId={engineConfig?.subjectId}
              defaultLevel={engineConfig?.defaultLevel}
              lockedSubject={!!engineConfig?.lockedSubject}
              onStart={handleStartTest}
              onCancel={handleEngineHome}
            />
          )}
          {engineStage === "running" && engineConfig?.questions && (
            <TestRunner
              config={engineConfig}
              onSubmit={handleSubmitTest}
              onCancel={handleEngineHome}
            />
          )}
          {engineStage === "result" && engineResult && (
            <ResultPage
              result={engineResult}
              onRetake={handleRetake}
              onHome={handleEngineHome}
            />
          )}
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="w-full bg-slate-50 min-h-full">
        {/* Header band */}
        <div className="bg-gradient-to-r from-purple-50 via-white to-indigo-50 border-b border-purple-100">
          <div className="px-6 lg:px-8 py-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">Assessments</h1>
              <p className="text-sm text-gray-600 mt-1">
                Track your performance across subjects
              </p>
              <button
                type="button"
                onClick={() => launchSetup()}
                className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-[0_8px_24px_-6px_rgba(124,58,237,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                <FiPlay className="w-4 h-4" />
                Take a new test
              </button>
            </div>

            <div className="flex items-center gap-6">
              <div
                className="relative flex-shrink-0"
                style={{ width: 88, height: 88 }}
              >
                <CircleProgress value={stats.avgScore} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-gray-900 leading-none">
                    {stats.avgScore}%
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-gray-500 mt-1">
                    Avg Score
                  </span>
                </div>
              </div>

              <div className="border-l border-gray-200 pl-6 space-y-3">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                    Completed
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {stats.completed}
                    <span className="text-sm font-medium text-gray-500"> / {stats.total}</span>
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                    Pending
                  </p>
                  <p className="text-lg font-semibold text-gray-900">{stats.pending}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="w-full px-6 lg:px-8 py-8 space-y-8">
          <AssessmentSummary stats={stats} />

          {aiSuggestion && (
            <AISuggestions
              suggestion={aiSuggestion}
              onAct={() => handleAction(aiSuggestion.target)}
            />
          )}

          <AssessmentFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            subjects={subjects}
            selectedSubject={selectedSubject}
            onSubjectChange={setSelectedSubject}
            selectedDifficulty={selectedDifficulty}
            onDifficultyChange={setSelectedDifficulty}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            onReset={handleReset}
          />

          {grouped.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
              <p className="text-sm font-medium text-gray-900">No assessments match your filters</p>
              <p className="text-xs text-gray-500 mt-1">Try adjusting or resetting your filters</p>
              <button
                type="button"
                onClick={handleReset}
                className="mt-4 inline-flex px-4 py-2 text-sm font-semibold text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="space-y-10">
              {grouped.map((g) => (
                <SubjectSection
                  key={g.subject}
                  subject={g.subject}
                  count={g.items.length}
                  avg={g.avg}
                  color={SUBJECT_COLOR[g.subject] || "purple"}
                >
                  {g.items.map((a) => (
                    <AssessmentCard
                      key={a.id}
                      assessment={a}
                      onAction={handleAction}
                      accentColor={SUBJECT_COLOR[a.subject] || "purple"}
                    />
                  ))}
                </SubjectSection>
              ))}
            </div>
          )}

          <PerformanceAnalytics
            scoreHistory={scoreHistory}
            subjectPerformance={subjectPerformance}
          />

          <PerformanceInsights subjectPerformance={subjectPerformance} />

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-4">
              <WeakAreas items={weakAreas} onPractice={() => {}} />
            </div>
            <div className="col-span-12 lg:col-span-4">
              <RecommendedTests items={recommended} onStart={handleAction} />
            </div>
            <div className="col-span-12 lg:col-span-4">
              <RecentActivity items={recentActivity} />
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default AssessmentPage;
