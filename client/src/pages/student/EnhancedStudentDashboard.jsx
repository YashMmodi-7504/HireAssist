import React, { useMemo, Suspense, memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendar, FaBook, FaBriefcase, FaClipboardCheck } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import LightPurpleSidebar from '../../components/LightPurpleSidebar';
import HeaderWithNotifications from '../../components/HeaderWithNotifications';
import PremiumStatsCardV2 from '../../components/PremiumStatsCardV2';
import DashboardErrorBoundary from '../../components/DashboardErrorBoundary';
import ModuleFiltersV2 from '../../components/ModuleFiltersV2';
import LearningGoalsV2 from '../../components/LearningGoalsV2';
import PeerComparisonV2 from '../../components/PeerComparisonV2';

// Lazy-loaded components for better performance
import {
  PremiumHeroSectionV2Lazy,
  PremiumGamificationV2Lazy,
  PremiumChartsV2Lazy,
  PremiumContinueLearningV2Lazy,
  PremiumModuleAccordionV2Lazy,
  StreakHeatmapLazy,
  PremiumActivityTimelineV2Lazy,
  LazyComponentFallback,
} from '../../utils/lazyComponents';

// Hooks
import { useDashboardState } from '../../hooks/useDashboardState';

// Memoized Quick Stats Section with better animations
const QuickStatsSection = memo(({ totalProgress }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: 0.1 }}
  >
    <h2 className="text-3xl font-bold text-gray-900 mb-2">Quick Stats</h2>
    <p className="text-gray-600 mb-6">Your learning at a glance</p>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
        <PremiumStatsCardV2 icon={FaCalendar} label="Attendance" value="95%" trend={5} color="purple" />
      </motion.div>
      <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
        <PremiumStatsCardV2 icon={FaBook} label="Progress" value={`${totalProgress}%`} trend={8} color="blue" />
      </motion.div>
      <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
        <PremiumStatsCardV2
          icon={FaBriefcase}
          label="Placement Ready"
          value="68%"
          trend={3}
          color="green"
        />
      </motion.div>
      <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
        <PremiumStatsCardV2
          icon={FaClipboardCheck}
          label="Assessments"
          value="86%"
          trend={12}
          color="orange"
        />
      </motion.div>
    </div>
  </motion.div>
));

QuickStatsSection.displayName = 'QuickStatsSection';

// Layout transitions for smooth animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 10 },
  },
};

// Main Dashboard Component
const EnhancedStudentDashboard = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Use custom hook for centralized state management
  const dashboardState = useDashboardState();
  const { user, totalProgress, modules, badges, recentActivity, continueCourses, handleTopicToggle, filters, updateFilter, resetFilters } =
    dashboardState;

  // Weekly Learning Activity
  const learningActivity = useMemo(
    () => [
      { day: 'Mon', hours: 2 },
      { day: 'Tue', hours: 3 },
      { day: 'Wed', hours: 2.5 },
      { day: 'Thu', hours: 4 },
      { day: 'Fri', hours: 3.5 },
      { day: 'Sat', hours: 2 },
      { day: 'Sun', hours: 1.5 },
    ],
    []
  );

  const handleLogout = () => navigate('/');

  return (
    <DashboardErrorBoundary>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Sidebar */}
        <aside className="w-[280px] fixed left-0 top-0 h-screen z-50 overflow-hidden">
          <LightPurpleSidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
        </aside>

        {/* Main Content */}
        <main className="ml-[280px] w-[calc(100%-280px)] flex flex-col overflow-hidden">
          {/* Header */}
          <HeaderWithNotifications userName={user.name} notificationCount={3} onLogout={handleLogout} />

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <motion.div className="w-full p-8 space-y-8" variants={containerVariants} initial="hidden" animate="visible">
              {/* 1. Premium Hero Section (Lazy Loaded) */}
              <motion.div variants={itemVariants}>
                <Suspense fallback={<LazyComponentFallback sectionName="hero section" />}>
                  <PremiumHeroSectionV2Lazy user={user} progress={totalProgress} streak={user.streak} />
                </Suspense>
              </motion.div>

              {/* 2. Quick Stats Cards */}
              <motion.div variants={itemVariants}>
                <QuickStatsSection totalProgress={totalProgress} />
              </motion.div>

              {/* 3. Gamification Section (Lazy Loaded) */}
              <motion.div variants={itemVariants}>
                <Suspense fallback={<LazyComponentFallback sectionName="gamification" />}>
                  <PremiumGamificationV2Lazy user={user} badges={badges} />
                </Suspense>
              </motion.div>

              {/* 4. Learning Goals Section (NEW FEATURE) */}
              <motion.div variants={itemVariants}>
                <LearningGoalsV2 />
              </motion.div>

              {/* 5. Peer Comparison Leaderboard (NEW FEATURE) */}
              <motion.div variants={itemVariants}>
                <PeerComparisonV2 />
              </motion.div>

              {/* 6. Analytics Charts (Lazy Loaded) */}
              <motion.div variants={itemVariants}>
                <Suspense fallback={<LazyComponentFallback sectionName="charts" />}>
                  <PremiumChartsV2Lazy learningActivity={learningActivity} modules={modules} />
                </Suspense>
              </motion.div>

              {/* 7. Continue Learning (Lazy Loaded) */}
              <motion.div variants={itemVariants}>
                <Suspense fallback={<LazyComponentFallback sectionName="continue learning" />}>
                  <PremiumContinueLearningV2Lazy courses={continueCourses} />
                </Suspense>
              </motion.div>

              {/* 8. Module Filters (NEW FEATURE) */}
              <motion.div variants={itemVariants}>
                <ModuleFiltersV2 filters={filters} onFilterChange={updateFilter} onResetFilters={resetFilters} />
              </motion.div>

              {/* 9. Learning Modules Accordion (Lazy Loaded) */}
              <motion.div variants={itemVariants}>
                <Suspense fallback={<LazyComponentFallback sectionName="modules" />}>
                  <PremiumModuleAccordionV2Lazy modules={modules} onTopicToggle={handleTopicToggle} />
                </Suspense>
              </motion.div>

              {/* 10. Streak Heatmap (Lazy Loaded) */}
              <motion.div variants={itemVariants}>
                <Suspense fallback={<LazyComponentFallback sectionName="streak heatmap" />}>
                  <StreakHeatmapLazy currentStreak={user.streak} longestStreak={user.longestStreak} />
                </Suspense>
              </motion.div>

              {/* 11. Recent Activity Timeline (Lazy Loaded) */}
              <motion.div variants={itemVariants}>
                <Suspense fallback={<LazyComponentFallback sectionName="activity timeline" />}>
                  <PremiumActivityTimelineV2Lazy recentActivity={recentActivity} />
                </Suspense>
              </motion.div>

              {/* Bottom padding */}
              <div className="h-8" />
            </motion.div>
          </div>
        </main>
      </div>
    </DashboardErrorBoundary>
  );
};

export default EnhancedStudentDashboard;
