/**
 * Utility Helper Functions for Learning Platform Dashboard
 */

/**
 * Format hours to readable time string
 * @param {number} hours - Number of hours
 * @returns {string} Formatted time (e.g., "2h 30m")
 */
export const formatTime = (hours) => {
  if (!hours) return "0m";
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);

  if (wholeHours === 0) return `${minutes}m`;
  if (minutes === 0) return `${wholeHours}h`;
  return `${wholeHours}h ${minutes}m`;
};

/**
 * Format relative timestamp
 * @param {string|Date} timestamp - Timestamp to format
 * @returns {string} Relative time (e.g., "2h ago")
 */
export const formatTimestamp = (timestamp) => {
  if (!timestamp) return "just now";

  const now = new Date();
  const time = new Date(timestamp);
  const seconds = Math.floor((now - time) / 1000);

  if (seconds < 60) return "just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  const weeks = Math.floor(days / 7);
  return `${weeks}w ago`;
};

/**
 * Get icon and color for activity type
 * @param {string} type - Activity type (lesson_completed, quiz_attempted, badge_earned, streak_milestone)
 * @returns {object} Icon emoji and color class
 */
export const getActivityIcon = (type) => {
  const icons = {
    lesson_completed: { emoji: "📚", color: "text-blue-500", bgColor: "bg-blue-50" },
    quiz_attempted: { emoji: "🧪", color: "text-purple-500", bgColor: "bg-purple-50" },
    badge_earned: { emoji: "🏆", color: "text-yellow-500", bgColor: "bg-yellow-50" },
    streak_milestone: { emoji: "⚡", color: "text-orange-500", bgColor: "bg-orange-50" },
    course_started: { emoji: "🚀", color: "text-indigo-500", bgColor: "bg-indigo-50" },
  };

  return icons[type] || icons.lesson_completed;
};

/**
 * Calculate user level from XP
 * @param {number} totalXP - Total XP points
 * @returns {number} User level
 */
export const calculateLevel = (totalXP) => {
  const xpPerLevel = 1000;
  return Math.floor(totalXP / xpPerLevel) + 1;
};

/**
 * Calculate XP needed for next level
 * @param {number} currentXP - Current XP points
 * @returns {number} XP needed for next level
 */
export const getNextLevelXP = (currentXP) => {
  const xpPerLevel = 1000;
  const currentLevel = Math.floor(currentXP / xpPerLevel);
  const nextLevelThreshold = (currentLevel + 1) * xpPerLevel;
  return nextLevelThreshold - currentXP;
};

/**
 * Calculate progress to next level as percentage
 * @param {number} currentXP - Current XP points
 * @returns {number} Progress percentage (0-100)
 */
export const getProgressToNextLevel = (currentXP) => {
  const xpPerLevel = 1000;
  const currentLevel = Math.floor(currentXP / xpPerLevel);
  const levelStartXP = currentLevel * xpPerLevel;
  const levelEndXP = (currentLevel + 1) * xpPerLevel;

  const progress = ((currentXP - levelStartXP) / (levelEndXP - levelStartXP)) * 100;
  return Math.min(100, Math.max(0, progress));
};

/**
 * Get user tier/badge based on XP
 * @param {number} totalXP - Total XP points
 * @returns {object} Tier info with name, color, and icon
 */
export const getUserTier = (totalXP) => {
  const level = calculateLevel(totalXP);

  if (level >= 10) return { name: "Platinum", color: "text-blue-600", bgColor: "bg-blue-50", icon: "💎" };
  if (level >= 7) return { name: "Gold", color: "text-yellow-600", bgColor: "bg-yellow-50", icon: "🏅" };
  if (level >= 4) return { name: "Silver", color: "text-gray-600", bgColor: "bg-gray-50", icon: "🥈" };
  return { name: "Bronze", color: "text-orange-600", bgColor: "bg-orange-50", icon: "🥉" };
};

/**
 * Get dynamic greeting based on time of day
 * @returns {string} Greeting message
 */
export const getDynamicGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

/**
 * Check if topic is locked
 * @param {object} topic - Topic object
 * @param {object} module - Module object containing topics
 * @returns {boolean} Whether topic is locked
 */
export const isTopicLocked = (topic, module) => {
  if (!topic.locked) return false;
  if (!topic.prerequisite) return false;

  const prereqTopic = module.topics.find(t => t.id === topic.prerequisite);
  return !prereqTopic?.completed;
};

/**
 * Get motivational quote
 * @returns {string} Random motivational quote
 */
export const getMotivationalQuote = () => {
  const quotes = [
    "Every expert was once a beginner.",
    "Consistency is the key to mastery.",
    "Progress, not perfection.",
    "Your future self will thank you.",
    "Learning is the most powerful tool.",
    "Small steps lead to big achievements.",
    "You're closer than you think.",
    "Keep pushing, you've got this!",
  ];

  return quotes[Math.floor(Math.random() * quotes.length)];
};

/**
 * Format module progress with completion count
 * @param {array} topics - Topics array
 * @returns {object} Object with completed and total counts
 */
export const getModuleProgress = (topics) => {
  const completed = topics.filter(t => t.completed).length;
  const total = topics.length;
  return { completed, total };
};

/**
 * Filter modules by status
 * @param {array} modules - Modules array
 * @param {string} status - Filter status (all, in-progress, completed, locked)
 * @returns {array} Filtered modules
 */
export const filterModulesByStatus = (modules, status) => {
  if (status === "all") return modules;

  return modules.filter(module => {
    const progress = module.progress || 0;

    if (status === "in-progress") return progress > 0 && progress < 100;
    if (status === "completed") return progress === 100;
    if (status === "locked") return progress === 0;

    return true;
  });
};

/**
 * Sort modules by criteria
 * @param {array} modules - Modules array
 * @param {string} sortBy - Sort criteria (progress, date, difficulty)
 * @returns {array} Sorted modules
 */
export const sortModules = (modules, sortBy) => {
  const sorted = [...modules];

  if (sortBy === "progress") {
    return sorted.sort((a, b) => (b.progress || 0) - (a.progress || 0));
  }

  if (sortBy === "date") {
    return sorted.sort((a, b) => (b.id || 0) - (a.id || 0));
  }

  if (sortBy === "difficulty") {
    return sorted.sort((a, b) => (a.difficulty || 0) - (b.difficulty || 0));
  }

  return sorted;
};

/**
 * Get color for progress bar
 * @param {number} progress - Progress percentage (0-100)
 * @returns {string} Tailwind color class
 */
export const getProgressColor = (progress) => {
  if (progress === 0) return "bg-gray-300";
  if (progress < 25) return "bg-red-500";
  if (progress < 50) return "bg-orange-500";
  if (progress < 75) return "bg-yellow-500";
  if (progress < 100) return "bg-blue-500";
  return "bg-green-500";
};

/**
 * Generate week activity data for heatmap
 * @param {number} weeks - Number of weeks to generate
 * @param {number} maxHours - Maximum hours per day
 * @returns {array} Activity data
 */
export const generateWeeklyActivityData = (weeks = 52, maxHours = 5) => {
  const data = [];
  const today = new Date();

  for (let i = weeks * 7 - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Random activity between 0 and maxHours
    const hours = Math.random() > 0.3 ? Math.random() * maxHours : 0;

    data.push({
      date: date.toISOString().split("T")[0],
      hours: parseFloat(hours.toFixed(1)),
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
    });
  }

  return data;
};
