import React from 'react';
import PremiumStatsCardV2 from './PremiumStatsCardV2';
import PremiumGamificationV2 from './PremiumGamificationV2';
import PremiumChartsV2 from './PremiumChartsV2';
import PremiumContinueLearningV2 from './PremiumContinueLearningV2';
import PremiumModuleAccordionV2 from './PremiumModuleAccordionV2';
import PremiumActivityTimelineV2 from './PremiumActivityTimelineV2';
import StreakHeatmap from './StreakHeatmap';

/**
 * Memoized component versions to prevent unnecessary re-renders
 * These components only re-render when their specific props change
 */

export const MemoizedStatsCard = React.memo(PremiumStatsCardV2, (prevProps, nextProps) => {
  return (
    prevProps.value === nextProps.value &&
    prevProps.trend === nextProps.trend &&
    prevProps.label === nextProps.label &&
    prevProps.color === nextProps.color
  );
});

MemoizedStatsCard.displayName = 'MemoizedStatsCard';

export const MemoizedGamification = React.memo(PremiumGamificationV2, (prevProps, nextProps) => {
  return (
    prevProps.user.totalXP === nextProps.user.totalXP &&
    prevProps.user.level === nextProps.user.level &&
    prevProps.badges.length === nextProps.badges.length
  );
});

MemoizedGamification.displayName = 'MemoizedGamification';

export const MemoizedCharts = React.memo(PremiumChartsV2, (prevProps, nextProps) => {
  return (
    JSON.stringify(prevProps.learningActivity) === JSON.stringify(nextProps.learningActivity) &&
    prevProps.modules.length === nextProps.modules.length
  );
});

MemoizedCharts.displayName = 'MemoizedCharts';

export const MemoizedContinueLearning = React.memo(PremiumContinueLearningV2, (prevProps, nextProps) => {
  return JSON.stringify(prevProps.courses) === JSON.stringify(nextProps.courses);
});

MemoizedContinueLearning.displayName = 'MemoizedContinueLearning';

export const MemoizedModuleAccordion = React.memo(PremiumModuleAccordionV2, (prevProps, nextProps) => {
  return (
    JSON.stringify(prevProps.modules) === JSON.stringify(nextProps.modules) &&
    prevProps.onTopicToggle === nextProps.onTopicToggle
  );
});

MemoizedModuleAccordion.displayName = 'MemoizedModuleAccordion';

export const MemoizedActivityTimeline = React.memo(PremiumActivityTimelineV2, (prevProps, nextProps) => {
  return prevProps.recentActivity.length === nextProps.recentActivity.length;
});

MemoizedActivityTimeline.displayName = 'MemoizedActivityTimeline';

export const MemoizedStreakHeatmap = React.memo(StreakHeatmap, (prevProps, nextProps) => {
  return (
    prevProps.currentStreak === nextProps.currentStreak &&
    prevProps.longestStreak === nextProps.longestStreak
  );
});

MemoizedStreakHeatmap.displayName = 'MemoizedStreakHeatmap';
