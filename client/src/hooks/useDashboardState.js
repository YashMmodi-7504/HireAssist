import { useState, useCallback, useMemo } from 'react';

/**
 * Custom hook for managing student dashboard state
 * Centralizes all state logic to reduce prop drilling and improve maintainability
 */
export const useDashboardState = () => {
  const [user, setUser] = useState({
    name: 'Yash Sharma',
    level: 3,
    totalXP: 2500,
    streak: 7,
    longestStreak: 14,
  });

  const [modules, setModules] = useState([
    {
      id: 1,
      title: 'Python Basics',
      progress: 80,
      streak: 7,
      estimatedTime: 12,
      topics: [
        { id: 1, name: 'Variables', completed: true, xpReward: 50, locked: false },
        { id: 2, name: 'Loops', completed: true, xpReward: 75, locked: false },
        { id: 3, name: 'Functions', completed: false, xpReward: 100, locked: false },
        { id: 4, name: 'Classes & Objects', completed: false, xpReward: 150, locked: true, prerequisite: 3 },
      ],
    },
    {
      id: 2,
      title: 'Data Structures',
      progress: 45,
      streak: 3,
      estimatedTime: 8,
      topics: [
        { id: 1, name: 'Arrays', completed: true, xpReward: 50, locked: false },
        { id: 2, name: 'Linked Lists', completed: false, xpReward: 100, locked: false },
        { id: 3, name: 'Trees', completed: false, xpReward: 150, locked: true, prerequisite: 2 },
      ],
    },
    {
      id: 3,
      title: 'Web Development',
      progress: 20,
      streak: 0,
      estimatedTime: 20,
      topics: [
        { id: 1, name: 'HTML Basics', completed: false, xpReward: 75, locked: false },
        { id: 2, name: 'CSS Styling', completed: false, xpReward: 100, locked: true, prerequisite: 1 },
        { id: 3, name: 'JavaScript', completed: false, xpReward: 150, locked: true, prerequisite: 2 },
      ],
    },
  ]);

  const [badges, setBadges] = useState([
    { id: 1, name: '7 Day Streak', earned: true, icon: '🔥', earnedDate: '2024-04-20' },
    { id: 2, name: 'First Course', earned: true, icon: '🎓', earnedDate: '2024-04-15' },
    { id: 3, name: '100 Lessons', earned: false, icon: '📚', progress: 75 },
    { id: 4, name: 'Perfect Score', earned: false, icon: '💯', progress: 0 },
  ]);

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'lesson_completed', module: 'Python Basics', topic: 'Variables', timestamp: '2h ago' },
    { id: 2, type: 'quiz_attempted', module: 'Python Basics', score: 85, timestamp: '4h ago' },
    { id: 3, type: 'badge_earned', badge: '7 Day Streak', timestamp: '1d ago' },
    { id: 4, type: 'course_started', module: 'Data Structures', timestamp: '2d ago' },
  ]);

  const [filters, setFilters] = useState({
    searchTerm: '',
    difficultyLevel: 'all', // 'all', 'beginner', 'intermediate', 'advanced'
    status: 'all', // 'all', 'completed', 'in-progress', 'not-started'
  });

  // Memoized computed values
  const totalProgress = useMemo(
    () => Math.round(modules.reduce((acc, m) => acc + m.progress, 0) / modules.length),
    [modules]
  );

  const filteredModules = useMemo(() => {
    return modules.filter((module) => {
      const matchesSearch = module.title.toLowerCase().includes(filters.searchTerm.toLowerCase());
      const matchesStatus =
        filters.status === 'all' ||
        (filters.status === 'completed' && module.progress === 100) ||
        (filters.status === 'in-progress' && module.progress > 0 && module.progress < 100) ||
        (filters.status === 'not-started' && module.progress === 0);
      return matchesSearch && matchesStatus;
    });
  }, [modules, filters]);

  const continueCourses = useMemo(() => {
    return modules
      .filter((m) => m.progress > 0 && m.progress < 100)
      .map((m) => {
        const incompleteTopic = m.topics.find((t) => !t.completed && !t.locked);
        return {
          title: m.title,
          progress: m.progress,
          nextTopic: incompleteTopic?.name || 'Review',
        };
      });
  }, [modules]);

  // Memoized handlers to prevent unnecessary recreations
  const handleTopicToggle = useCallback((moduleId, topicId) => {
    setModules((prevModules) => {
      const module = prevModules.find((m) => m.id === moduleId);
      const topic = module?.topics.find((t) => t.id === topicId);

      if (!topic || topic.locked) return prevModules;

      const xpReward = topic.xpReward || 0;
      setUser((prev) => ({
        ...prev,
        totalXP: prev.totalXP + (topic.completed ? -xpReward : xpReward),
      }));

      const updatedModules = prevModules.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              progress: Math.min(
                100,
                Math.round(
                  (m.topics.filter((t) => t.completed || (t.id === topicId && !t.completed)).length /
                    m.topics.length) *
                    100
                )
              ),
              topics: m.topics.map((t) => (t.id === topicId ? { ...t, completed: !t.completed } : t)),
            }
          : m
      );

      if (!topic.completed) {
        setRecentActivity((prev) => [
          {
            id: prev.length + 1,
            type: 'lesson_completed',
            module: module.title,
            topic: topic.name,
            timestamp: 'now',
          },
          ...prev.slice(0, 9),
        ]);
      }

      return updatedModules;
    });
  }, []);

  const updateFilter = useCallback((filterKey, value) => {
    setFilters((prev) => ({ ...prev, [filterKey]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ searchTerm: '', difficultyLevel: 'all', status: 'all' });
  }, []);

  return {
    // User state
    user,
    setUser,

    // Module state
    modules,
    setModules,
    filteredModules,
    totalProgress,

    // Badge & activity state
    badges,
    setBadges,
    recentActivity,
    setRecentActivity,

    // Continue learning
    continueCourses,

    // Filter state
    filters,
    updateFilter,
    resetFilters,

    // Handlers
    handleTopicToggle,
  };
};
