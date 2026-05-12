import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiClock, FiAlertTriangle, FiBriefcase, FiCheckCircle, FiSend, FiXCircle } from "react-icons/fi";

import DashboardHero from "../../components/dashboard/DashboardHero";
import KeyMetricsGrid from "../../components/dashboard/KeyMetricsGrid";
import QuickActions from "../../components/dashboard/QuickActions";
import ContinueLearning from "../../components/dashboard/ContinueLearning";
import WeeklyActivityChart from "../../components/dashboard/WeeklyActivityChart";
import SkillDistribution from "../../components/dashboard/SkillDistribution";
import UpcomingDeadlines from "../../components/dashboard/UpcomingDeadlines";
import PlacementTracker from "../../components/dashboard/PlacementTracker";
import StreakIndicator from "../../components/dashboard/StreakIndicator";
import NextBestAction from "../../components/dashboard/NextBestAction";
import AiInsightPanel from "../../components/dashboard/AiInsightPanel";
import Modal from "../../components/ui/Modal";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("StudentDashboard Error:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <h1 className="text-2xl font-semibold text-red-700 mb-3">
              Error Loading Dashboard
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

const StudentDashboard = () => {
  const navigate = useNavigate();

  const user = useMemo(
    () => ({
      name: "Yash Modi",
      level: 3,
      totalXP: 2500,
      streak: 7,
      longestStreak: 14,
      rank: "Top 12%",
    }),
    []
  );

  const continueCourses = useMemo(
    () => [
      { title: "Python Basics", progress: 80, nextTopic: "Functions" },
      { title: "Data Structures", progress: 45, nextTopic: "Linked Lists" },
      { title: "Web Development", progress: 20, nextTopic: "HTML Basics" },
    ],
    []
  );

  const weeklyActivity = useMemo(
    () => [
      { day: "Mon", hours: 2 },
      { day: "Tue", hours: 3 },
      { day: "Wed", hours: 2.5 },
      { day: "Thu", hours: 4 },
      { day: "Fri", hours: 3.5 },
      { day: "Sat", hours: 2 },
      { day: "Sun", hours: 1.5 },
    ],
    []
  );

  const skills = useMemo(
    () => [
      { name: "Data Structures", value: 78, delta: 4 },
      { name: "Algorithms", value: 65, delta: 2 },
      { name: "Web Development", value: 52, delta: -3 },
      { name: "Aptitude", value: 84, delta: 6 },
      { name: "Communication", value: 90, delta: 1 },
    ],
    []
  );

  const deadlines = useMemo(
    () => [
      { id: 1, title: "DSA Assignment 4", course: "Data Structures", due: "Today", status: "urgent" },
      { id: 2, title: "React Project Submission", course: "Web Development", due: "Tomorrow", status: "urgent" },
      { id: 3, title: "Aptitude Mock Test", course: "Placement Prep", due: "3 days", status: "soon" },
      { id: 4, title: "DBMS Quiz", course: "Database Systems", due: "1 week", status: "later" },
    ],
    []
  );

  const placement = useMemo(
    () => ({
      stats: { applied: 12, shortlisted: 4, interview: 2, selected: 1, rejected: 3 },
      recent: [
        { id: 1, company: "Infosys", status: "Shortlisted" },
        { id: 2, company: "TCS", status: "Applied" },
        { id: 3, company: "Wipro", status: "Rejected" },
        { id: 4, company: "Accenture", status: "Interview" },
      ],
    }),
    []
  );

  const last14 = useMemo(
    () => [
      { active: true,  hours: 1.5 },
      { active: true,  hours: 3.2 },
      { active: false, hours: 0   },
      { active: true,  hours: 2.0 },
      { active: true,  hours: 4.1 },
      { active: true,  hours: 2.8 },
      { active: true,  hours: 1.0 },
      { active: false, hours: 0   },
      { active: true,  hours: 3.6 },
      { active: true,  hours: 4.7 },
      { active: true,  hours: 2.4 },
      { active: true,  hours: 1.8 },
      { active: true,  hours: 5.1 },
      { active: false, hours: 0   },
    ],
    []
  );

  const totalProgress = useMemo(() => {
    const sum = continueCourses.reduce((acc, c) => acc + (c.progress || 0), 0);
    return continueCourses.length > 0
      ? Math.round(sum / continueCourses.length)
      : 0;
  }, [continueCourses]);

  const metrics = {
    attendance: 95,
    courseProgress: totalProgress,
    placementReady: 68,
    assessments: 86,
  };

  const [activeDeadline, setActiveDeadline] = useState(null);
  const [activeApplication, setActiveApplication] = useState(null);

  // Each metric card maps to the route that owns its detail surface.
  const METRIC_ROUTES = {
    attendance: "/student/attendance",
    courseProgress: "/student/material",
    placementReady: "/student/placement",
    assessments: "/student/assessment",
  };

  const handleMetricClick = (id) => {
    const route = METRIC_ROUTES[id];
    if (route) navigate(route);
  };

  // Anywhere on the dashboard that wants to consult the AI tutor calls this
  // — single helper keeps every cross-page link consistent.
  const askAI = (prompt) => {
    navigate("/student/ai", { state: { prompt } });
  };

  const handleSkillClick = (skill) => {
    askAI(`Help me improve at ${skill.name}. Explain the core concepts and quiz me to find weak spots.`);
  };

  const handleContinueCourse = () => {
    // Per-course detail route doesn't exist for students yet, so the card
    // sends them to study material as the closest existing surface.
    navigate("/student/material");
  };

  const handleResume = () => {
    const next = continueCourses.find((c) => c.progress < 100) || continueCourses[0];
    if (next) navigate("/student/material");
  };

  const STATUS_TONE = {
    Applied: { icon: FiSend, color: "text-blue-600 bg-blue-50 border-blue-100" },
    Shortlisted: { icon: FiCheckCircle, color: "text-green-600 bg-green-50 border-green-100" },
    Interview: { icon: FiBriefcase, color: "text-purple-600 bg-purple-50 border-purple-100" },
    Rejected: { icon: FiXCircle, color: "text-red-600 bg-red-50 border-red-100" },
  };

  return (
    <ErrorBoundary>
      <div className="w-full px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Hero */}
          <section className="col-span-12">
            <DashboardHero
              user={user}
              progress={totalProgress}
              onResume={handleResume}
              onAnalytics={() => {}}
            />
          </section>

          {/* Next Best Action — AI-derived top recommendation */}
          <section className="col-span-12">
            <NextBestAction
              deadlines={deadlines}
              skills={skills}
              streak={user.streak}
              onAskAI={askAI}
            />
          </section>

          {/* Key Metrics */}
          <section className="col-span-12">
            <KeyMetricsGrid metrics={metrics} onCardClick={handleMetricClick} />
          </section>

          {/* Quick Actions */}
          <section className="col-span-12">
            <QuickActions />
          </section>

          {/* Continue Learning */}
          <section className="col-span-12">
            <ContinueLearning
              courses={continueCourses}
              onContinue={handleContinueCourse}
              onViewAll={() => navigate("/student/material")}
            />
          </section>

          {/* Analytics row */}
          <section className="col-span-12 lg:col-span-8">
            <WeeklyActivityChart data={weeklyActivity} />
          </section>
          <section className="col-span-12 lg:col-span-4">
            <SkillDistribution skills={skills} onSkillClick={handleSkillClick} />
          </section>

          {/* AI Insights strip */}
          <section className="col-span-12">
            <AiInsightPanel
              skills={skills}
              streak={user.streak}
              longestStreak={user.longestStreak}
              onAskAI={askAI}
            />
          </section>

          {/* Insights row */}
          <section className="col-span-12 lg:col-span-6">
            <UpcomingDeadlines
              items={deadlines}
              onItemClick={(item) => setActiveDeadline(item)}
            />
          </section>
          <section className="col-span-12 lg:col-span-6">
            <PlacementTracker
              stats={placement.stats}
              recent={placement.recent}
              onCompanyClick={(app) => setActiveApplication(app)}
            />
          </section>

          {/* Streak strip */}
          <section className="col-span-12">
            <StreakIndicator
              currentStreak={user.streak}
              longestStreak={user.longestStreak}
              last14={last14}
            />
          </section>
        </div>

        {/* Deadline detail modal */}
        <Modal
          open={!!activeDeadline}
          onClose={() => setActiveDeadline(null)}
          title={activeDeadline?.title}
          subtitle={activeDeadline?.course}
          footer={
            <>
              <button
                type="button"
                onClick={() => setActiveDeadline(null)}
                className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Dismiss
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveDeadline(null);
                  navigate("/student/assessment");
                }}
                className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg shadow-sm transition-all"
              >
                Start now
              </button>
            </>
          }
        >
          {activeDeadline && (
            <div className="space-y-4">
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${
                  activeDeadline.status === "urgent"
                    ? "bg-red-50 border-red-100 text-red-800"
                    : activeDeadline.status === "soon"
                    ? "bg-amber-50 border-amber-100 text-amber-800"
                    : "bg-gray-50 border-gray-200 text-gray-700"
                }`}
              >
                {activeDeadline.status === "urgent" ? (
                  <FiAlertTriangle className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <FiClock className="w-5 h-5 flex-shrink-0" />
                )}
                <div>
                  <p className="text-xs uppercase tracking-wider font-semibold opacity-70">
                    Due
                  </p>
                  <p className="text-sm font-semibold">{activeDeadline.due}</p>
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-1.5">
                  Instructions
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Complete the {activeDeadline.title.toLowerCase()} for {activeDeadline.course}. Submissions after the deadline incur a late penalty.
                </p>
              </div>
            </div>
          )}
        </Modal>

        {/* Placement application detail modal */}
        <Modal
          open={!!activeApplication}
          onClose={() => setActiveApplication(null)}
          title={activeApplication?.company}
          subtitle="Application status"
          footer={
            <>
              <button
                type="button"
                onClick={() => {
                  const company = activeApplication?.company;
                  setActiveApplication(null);
                  if (company) {
                    askAI(`Help me prepare for an interview at ${company}. Walk me through likely rounds and ask me one mock question to start.`);
                  }
                }}
                className="px-4 py-2 text-sm font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-100 rounded-lg transition-colors"
              >
                Ask AI for prep
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveApplication(null);
                  navigate("/student/jobs");
                }}
                className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg shadow-sm transition-all"
              >
                View all jobs
              </button>
            </>
          }
        >
          {activeApplication && (() => {
            const tone = STATUS_TONE[activeApplication.status] || STATUS_TONE.Applied;
            const Icon = tone.icon;
            return (
              <div className="space-y-4">
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${tone.color}`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="text-xs uppercase tracking-wider font-semibold opacity-70">
                      Status
                    </p>
                    <p className="text-sm font-semibold">{activeApplication.status}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2">
                    Timeline
                  </p>
                  <ol className="relative border-l-2 border-purple-100 pl-4 space-y-3">
                    <li>
                      <span className="absolute -left-[5px] mt-1 inline-flex w-2 h-2 rounded-full bg-purple-500" />
                      <p className="text-sm font-semibold text-gray-900">Application submitted</p>
                      <p className="text-xs text-gray-500">via student portal</p>
                    </li>
                    {activeApplication.status !== "Applied" && (
                      <li>
                        <span className="absolute -left-[5px] mt-1 inline-flex w-2 h-2 rounded-full bg-purple-500" />
                        <p className="text-sm font-semibold text-gray-900">
                          Moved to {activeApplication.status}
                        </p>
                        <p className="text-xs text-gray-500">
                          Recruiter updated the status
                        </p>
                      </li>
                    )}
                  </ol>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-1.5">
                    Notes
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Keep your resume and skills profile up to date — recruiters at {activeApplication.company} pull the latest version each round.
                  </p>
                </div>
              </div>
            );
          })()}
        </Modal>
      </div>
    </ErrorBoundary>
  );
};

export default StudentDashboard;
