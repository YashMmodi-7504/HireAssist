import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import DashboardHero from "../../components/dashboard/DashboardHero";
import KeyMetricsGrid from "../../components/dashboard/KeyMetricsGrid";
import QuickActions from "../../components/dashboard/QuickActions";
import ContinueLearning from "../../components/dashboard/ContinueLearning";
import WeeklyActivityChart from "../../components/dashboard/WeeklyActivityChart";
import SkillDistribution from "../../components/dashboard/SkillDistribution";
import UpcomingDeadlines from "../../components/dashboard/UpcomingDeadlines";
import PlacementTracker from "../../components/dashboard/PlacementTracker";
import StreakIndicator from "../../components/dashboard/StreakIndicator";

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
      { name: "Data Structures", value: 78 },
      { name: "Algorithms", value: 65 },
      { name: "Web Development", value: 52 },
      { name: "Aptitude", value: 84 },
      { name: "Communication", value: 90 },
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
      stats: { applied: 12, shortlisted: 4, rejected: 3 },
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
    () => [true, true, false, true, true, true, true, false, true, true, true, true, true, false],
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

  const handleResume = () => {
    const next = continueCourses.find((c) => c.progress < 100) || continueCourses[0];
    if (next) {
      // Hook this up to your real module route when available
      navigate("/student");
    }
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

          {/* Key Metrics */}
          <section className="col-span-12">
            <KeyMetricsGrid metrics={metrics} />
          </section>

          {/* Quick Actions */}
          <section className="col-span-12">
            <QuickActions />
          </section>

          {/* Continue Learning */}
          <section className="col-span-12">
            <ContinueLearning
              courses={continueCourses}
              onContinue={() => navigate("/student")}
              onViewAll={() => navigate("/student")}
            />
          </section>

          {/* Analytics row */}
          <section className="col-span-12 lg:col-span-8">
            <WeeklyActivityChart data={weeklyActivity} />
          </section>
          <section className="col-span-12 lg:col-span-4">
            <SkillDistribution skills={skills} />
          </section>

          {/* Insights row */}
          <section className="col-span-12 lg:col-span-6">
            <UpcomingDeadlines items={deadlines} />
          </section>
          <section className="col-span-12 lg:col-span-6">
            <PlacementTracker stats={placement.stats} recent={placement.recent} />
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
      </div>
    </ErrorBoundary>
  );
};

export default StudentDashboard;
