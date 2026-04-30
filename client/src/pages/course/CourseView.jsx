import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaLock,
  FaPlay,
  FaClock,
  FaBook,
  FaChevronDown,
  FaChevronUp,
  FaFire
} from "react-icons/fa";

const CourseView = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [expandedModule, setExpandedModule] = useState(null);
  const [courseProgress, setCourseProgress] = useState({});

  // COURSE DATA STRUCTURE
  const coursesData = {
    python: {
      id: "python",
      title: "Python for AI",
      icon: "🐍",
      description: "Master Python fundamentals for AI development",
      duration: "12 hours",
      modules: [
        {
          id: 1,
          title: "Introduction to Python",
          description: "Learn the basics and set up your environment",
          topics: [
            { id: 1, name: "What is Python?", duration: "15 min" },
            { id: 2, name: "Installation & Setup", duration: "20 min" },
            { id: 3, name: "Your First Program", duration: "25 min" }
          ]
        },
        {
          id: 2,
          title: "Variables & Data Types",
          description: "Understand variables, strings, numbers, and lists",
          topics: [
            { id: 1, name: "Variables Basics", duration: "20 min" },
            { id: 2, name: "Strings & Numbers", duration: "25 min" },
            { id: 3, name: "Lists & Tuples", duration: "30 min" }
          ]
        },
        {
          id: 3,
          title: "Control Flow",
          description: "Master if/else, loops, and conditionals",
          topics: [
            { id: 1, name: "If/Else Statements", duration: "20 min" },
            { id: 2, name: "For Loops", duration: "25 min" },
            { id: 3, name: "While Loops", duration: "20 min" }
          ]
        },
        {
          id: 4,
          title: "Functions",
          description: "Write reusable code with functions",
          topics: [
            { id: 1, name: "Function Basics", duration: "20 min" },
            { id: 2, name: "Parameters & Returns", duration: "25 min" },
            { id: 3, name: "Lambda Functions", duration: "15 min" }
          ]
        }
      ]
    },
    datascience: {
      id: "datascience",
      title: "Data Science Basics",
      icon: "📊",
      description: "Learn data analysis and visualization",
      duration: "9 hours",
      modules: [
        {
          id: 1,
          title: "Introduction to Data Science",
          description: "Explore what data science is and its applications",
          topics: [
            { id: 1, name: "What is Data Science?", duration: "20 min" },
            { id: 2, name: "Data Types & Sources", duration: "25 min" },
            { id: 3, name: "The Data Science Process", duration: "30 min" }
          ]
        },
        {
          id: 2,
          title: "Data Cleaning",
          description: "Handle missing data and prepare datasets",
          topics: [
            { id: 1, name: "Missing Data", duration: "20 min" },
            { id: 2, name: "Data Validation", duration: "25 min" },
            { id: 3, name: "Data Transformation", duration: "25 min" }
          ]
        },
        {
          id: 3,
          title: "Exploratory Data Analysis",
          description: "Discover patterns and insights in data",
          topics: [
            { id: 1, name: "Statistics Basics", duration: "25 min" },
            { id: 2, name: "Data Visualization", duration: "30 min" },
            { id: 3, name: "Finding Patterns", duration: "25 min" }
          ]
        }
      ]
    },
    webdev: {
      id: "webdev",
      title: "Web Development",
      icon: "🌐",
      description: "Build modern web applications",
      duration: "16 hours",
      modules: [
        {
          id: 1,
          title: "HTML Basics",
          description: "Learn the structure of web pages",
          topics: [
            { id: 1, name: "HTML Structure", duration: "20 min" },
            { id: 2, name: "Tags & Elements", duration: "25 min" },
            { id: 3, name: "Forms & Input", duration: "30 min" }
          ]
        },
        {
          id: 2,
          title: "CSS & Styling",
          description: "Style and design beautiful web pages",
          topics: [
            { id: 1, name: "CSS Basics", duration: "20 min" },
            { id: 2, name: "Flexbox & Grid", duration: "30 min" },
            { id: 3, name: "Responsive Design", duration: "25 min" }
          ]
        },
        {
          id: 3,
          title: "JavaScript",
          description: "Add interactivity to web pages",
          topics: [
            { id: 1, name: "JS Basics", duration: "25 min" },
            { id: 2, name: "DOM Manipulation", duration: "30 min" },
            { id: 3, name: "Event Handling", duration: "25 min" }
          ]
        },
        {
          id: 4,
          title: "React",
          description: "Build interactive user interfaces",
          topics: [
            { id: 1, name: "Components", duration: "25 min" },
            { id: 2, name: "Props & State", duration: "30 min" },
            { id: 3, name: "Hooks", duration: "25 min" }
          ]
        }
      ]
    },
    ml: {
      id: "ml",
      title: "Machine Learning",
      icon: "🤖",
      description: "Introduction to ML algorithms",
      duration: "10 hours",
      modules: [
        {
          id: 1,
          title: "ML Fundamentals",
          description: "Understand machine learning concepts",
          topics: [
            { id: 1, name: "What is ML?", duration: "20 min" },
            { id: 2, name: "Supervised vs Unsupervised", duration: "25 min" },
            { id: 3, name: "Training & Testing", duration: "20 min" }
          ]
        },
        {
          id: 2,
          title: "Supervised Learning",
          description: "Learn regression and classification",
          topics: [
            { id: 1, name: "Linear Regression", duration: "25 min" },
            { id: 2, name: "Logistic Regression", duration: "30 min" },
            { id: 3, name: "Decision Trees", duration: "25 min" }
          ]
        },
        {
          id: 3,
          title: "Unsupervised Learning",
          description: "Clustering and dimensionality reduction",
          topics: [
            { id: 1, name: "K-Means Clustering", duration: "25 min" },
            { id: 2, name: "Hierarchical Clustering", duration: "25 min" },
            { id: 3, name: "PCA", duration: "20 min" }
          ]
        }
      ]
    }
  };

  const course = coursesData[courseId];

  // Initialize progress state
  const initializeProgress = () => {
    if (!courseProgress[courseId]) {
      const newProgress = {};
      course.modules.forEach((module) => {
        newProgress[module.id] = {};
        module.topics.forEach((topic) => {
          newProgress[module.id][topic.id] = false;
        });
      });
      setCourseProgress((prev) => ({
        ...prev,
        [courseId]: newProgress
      }));
    }
  };

  React.useEffect(() => {
    initializeProgress();
  }, [courseId]);

  // Calculate if module is locked
  const isModuleLocked = (moduleIndex) => {
    if (moduleIndex === 0) return false;
    const previousModule = course.modules[moduleIndex - 1];
    const allTopicsCompleted = previousModule.topics.every(
      (topic) => courseProgress[courseId]?.[previousModule.id]?.[topic.id]
    );
    return !allTopicsCompleted;
  };

  // Calculate module completion
  const getModuleCompletion = (module) => {
    const completed = module.topics.filter(
      (topic) => courseProgress[courseId]?.[module.id]?.[topic.id]
    ).length;
    return Math.round((completed / module.topics.length) * 100);
  };

  // Calculate total progress
  const totalProgress = useMemo(() => {
    if (!course || !courseProgress[courseId]) return 0;
    const allTopics = course.modules.reduce(
      (acc, module) => acc + module.topics.length,
      0
    );
    const completedTopics = course.modules.reduce((acc, module) => {
      return (
        acc +
        module.topics.filter(
          (topic) => courseProgress[courseId]?.[module.id]?.[topic.id]
        ).length
      );
    }, 0);
    return Math.round((completedTopics / allTopics) * 100);
  }, [courseProgress, courseId]);

  // Toggle topic completion
  const toggleTopic = (moduleId, topicId) => {
    setCourseProgress((prev) => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        [moduleId]: {
          ...prev[courseId][moduleId],
          [topicId]: !prev[courseId][moduleId][topicId]
        }
      }
    }));
  };

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-purple-50">
        <p className="text-gray-600">Course not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-50">
      {/* HEADER */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <FaArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
              <p className="text-sm text-gray-600">{course.duration}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-purple-600">{totalProgress}%</p>
            <p className="text-xs text-gray-600">Course Progress</p>
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="bg-gray-100 h-1">
          <div
            className="bg-gradient-to-r from-purple-500 to-purple-600 h-1 transition-all duration-300"
            style={{ width: `${totalProgress}%` }}
          ></div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* COURSE DESCRIPTION */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          <div className="flex items-start gap-4">
            <span className="text-4xl">{course.icon}</span>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {course.description}
              </h2>
              <p className="text-gray-600">
                Complete all modules and topics to master {course.title}. Modules unlock sequentially as you progress.
              </p>
            </div>
          </div>
        </div>

        {/* MODULES GRID */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FaBook className="text-purple-600" />
            Course Modules ({course.modules.length})
          </h3>

          {course.modules.map((module, moduleIndex) => {
            const locked = isModuleLocked(moduleIndex);
            const completion = getModuleCompletion(module);
            const allTopicsCompleted = completion === 100;

            return (
              <div
                key={module.id}
                className={`rounded-xl border transition-all duration-300 ${
                  locked
                    ? "bg-gray-50 border-gray-200 opacity-60"
                    : "bg-white border-gray-100 hover:shadow-lg"
                }`}
              >
                {/* MODULE HEADER */}
                <div
                  onClick={() => !locked && setExpandedModule(expandedModule === module.id ? null : module.id)}
                  className={`p-6 flex items-center justify-between cursor-pointer ${locked ? "cursor-not-allowed" : ""}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg font-bold text-gray-900">
                        Module {moduleIndex + 1}: {module.title}
                      </span>
                      {locked && <FaLock className="w-4 h-4 text-gray-400" />}
                      {allTopicsCompleted && !locked && (
                        <FaCheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{module.description}</p>

                    {/* PROGRESS BAR */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 max-w-xs">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all"
                            style={{ width: `${completion}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-purple-600">{completion}%</span>
                    </div>
                  </div>

                  <div className="ml-4 flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-600">
                      {module.topics.filter((t) => courseProgress[courseId]?.[module.id]?.[t.id]).length}/{module.topics.length}
                    </span>
                    {expandedModule === module.id ? (
                      <FaChevronUp className="w-5 h-5 text-gray-600" />
                    ) : (
                      <FaChevronDown className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                </div>

                {/* TOPICS (EXPANDED) */}
                {expandedModule === module.id && !locked && (
                  <div className="border-t border-gray-200 bg-gray-50 p-6">
                    <div className="space-y-3">
                      {module.topics.map((topic) => {
                        const isCompleted = courseProgress[courseId]?.[module.id]?.[topic.id];
                        return (
                          <div
                            key={topic.id}
                            className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-300 transition group"
                          >
                            <label className="flex items-center gap-3 flex-1 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isCompleted}
                                onChange={() => toggleTopic(module.id, topic.id)}
                                className="w-5 h-5 text-purple-600 rounded cursor-pointer"
                              />
                              <div>
                                <p
                                  className={`font-medium transition ${
                                    isCompleted
                                      ? "line-through text-gray-500"
                                      : "text-gray-900 group-hover:text-purple-600"
                                  }`}
                                >
                                  {topic.name}
                                </p>
                                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                  <FaClock className="w-3 h-3" />
                                  {topic.duration}
                                </div>
                              </div>
                            </label>

                            {isCompleted ? (
                              <FaCheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                              <button className="px-4 py-2 bg-purple-100 text-purple-600 font-semibold rounded-lg hover:bg-purple-200 transition flex items-center gap-2 opacity-0 group-hover:opacity-100">
                                <FaPlay className="w-3 h-3" />
                                Start
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* LOCKED STATE */}
                {locked && (
                  <div className="border-t border-gray-200 bg-gray-50 p-6 flex items-center justify-center gap-2 text-gray-500">
                    <FaLock className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Complete Module {moduleIndex} to unlock this module
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* COMPLETION MESSAGE */}
        {totalProgress === 100 && (
          <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 text-center">
            <FaFire className="w-12 h-12 text-orange-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              🎉 Course Completed!
            </h3>
            <p className="text-gray-600">
              Congratulations! You've successfully completed {course.title}. Download your certificate now!
            </p>
            <button className="mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition">
              Download Certificate
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseView;
