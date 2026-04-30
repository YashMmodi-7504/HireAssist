import React, { useState } from "react";
import { FiSearch, FiFilter } from "react-icons/fi";
import AssessmentOverview from "./AssessmentOverview";
import AssessmentCard from "./AssessmentCard";
import TestInterface from "./TestInterface";
import ResultView from "./ResultView";
import AttemptHistory from "./AttemptHistory";
import AnalyticsSection from "./AnalyticsSection";
import AssessmentRecommendations from "./AssessmentRecommendations";

const AssessmentPage = () => {
  const [activeView, setActiveView] = useState("overview"); // overview, test, results
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock assessment data
  const assessments = [
    {
      id: 1,
      title: "Python Basics Test",
      difficulty: "Beginner",
      duration: 30,
      questions: 20,
      skills: ["Python", "Variables", "Loops"],
      status: "completed",
      score: 85,
      attempts: 2,
      description: "Test your knowledge of Python fundamentals",
    },
    {
      id: 2,
      title: "Data Structures Mastery",
      difficulty: "Intermediate",
      duration: 45,
      questions: 25,
      skills: ["Arrays", "Linked Lists", "Trees"],
      status: "not-attempted",
      description: "Master core data structures concepts",
    },
    {
      id: 3,
      title: "Advanced Algorithms",
      difficulty: "Advanced",
      duration: 60,
      questions: 30,
      skills: ["Sorting", "Dynamic Programming", "Graphs"],
      status: "in-progress",
      attempts: 1,
      description: "Challenge yourself with complex algorithms",
    },
    {
      id: 4,
      title: "JavaScript ES6+",
      difficulty: "Intermediate",
      duration: 40,
      questions: 22,
      skills: ["ES6", "Promises", "Async/Await"],
      status: "completed",
      score: 92,
      attempts: 1,
      description: "Master modern JavaScript features",
    },
    {
      id: 5,
      title: "React Fundamentals",
      difficulty: "Beginner",
      duration: 35,
      questions: 18,
      skills: ["React", "Hooks", "Components"],
      status: "not-attempted",
      description: "Learn React basics and best practices",
    },
    {
      id: 6,
      title: "Database Design",
      difficulty: "Advanced",
      duration: 55,
      questions: 28,
      skills: ["SQL", "Normalization", "Indexing"],
      status: "completed",
      score: 78,
      attempts: 3,
      description: "Design efficient database schemas",
    },
  ];

  // Filter assessments
  const filteredAssessments = assessments.filter((assessment) => {
    const matchesSearch = assessment.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficultyFilter === "all" || assessment.difficulty === difficultyFilter;
    const matchesStatus = statusFilter === "all" || assessment.status === statusFilter;
    return matchesSearch && matchesDifficulty && matchesStatus;
  });

  const handleStartTest = (assessment) => {
    setSelectedAssessment(assessment);
    setActiveView("test");
  };

  const handleTestComplete = (result) => {
    setSelectedAssessment({ ...selectedAssessment, result });
    setActiveView("results");
  };

  const handleRetakeTest = () => {
    setActiveView("test");
  };

  const handleBackToList = () => {
    setSelectedAssessment(null);
    setActiveView("overview");
  };

  if (activeView === "test" && selectedAssessment) {
    return <TestInterface assessment={selectedAssessment} onComplete={handleTestComplete} onBack={handleBackToList} />;
  }

  if (activeView === "results" && selectedAssessment) {
    return <ResultView assessment={selectedAssessment} onRetake={handleRetakeTest} onBack={handleBackToList} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-6">
        {/* Assessment Overview */}
        <AssessmentOverview assessments={assessments} />

        {/* Main Content */}
        <div className="mt-8 space-y-8">
          {/* Search & Filter */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="space-y-4">
              <div className="flex gap-4 flex-col md:flex-row">
                {/* Search */}
                <div className="flex-1 relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search assessments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  />
                </div>

                {/* Filters */}
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Difficulty</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="in-progress">In Progress</option>
                  <option value="not-attempted">Not Attempted</option>
                </select>
              </div>
            </div>
          </div>

          {/* Available Assessments */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Assessments</h2>
            {filteredAssessments.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredAssessments.map((assessment) => (
                  <AssessmentCard
                    key={assessment.id}
                    assessment={assessment}
                    onStart={handleStartTest}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                <p className="text-gray-500">No assessments found. Try adjusting your filters.</p>
              </div>
            )}
          </div>

          {/* Performance Analytics */}
          <AnalyticsSection assessments={assessments} />

          {/* Attempt History */}
          <AttemptHistory assessments={assessments} />

          {/* Recommendations */}
          <AssessmentRecommendations assessments={assessments} />
        </div>
      </div>
    </div>
  );
};

export default AssessmentPage;
