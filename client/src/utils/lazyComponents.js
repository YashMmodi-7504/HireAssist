import React, { Suspense, lazy } from 'react';

// Lazy load heavy components
export const PremiumHeroSectionV2Lazy = lazy(() =>
  import('../../components/PremiumHeroSectionV2').then((m) => ({ default: m.default }))
);
export const PremiumGamificationV2Lazy = lazy(() =>
  import('../../components/PremiumGamificationV2').then((m) => ({ default: m.default }))
);
export const PremiumChartsV2Lazy = lazy(() =>
  import('../../components/PremiumChartsV2').then((m) => ({ default: m.default }))
);
export const PremiumContinueLearningV2Lazy = lazy(() =>
  import('../../components/PremiumContinueLearningV2').then((m) => ({ default: m.default }))
);
export const PremiumModuleAccordionV2Lazy = lazy(() =>
  import('../../components/PremiumModuleAccordionV2').then((m) => ({ default: m.default }))
);
export const StreakHeatmapLazy = lazy(() =>
  import('../../components/StreakHeatmap').then((m) => ({ default: m.default }))
);
export const PremiumActivityTimelineV2Lazy = lazy(() =>
  import('../../components/PremiumActivityTimelineV2').then((m) => ({ default: m.default }))
);
export const ModuleFiltersV2Lazy = lazy(() =>
  import('../../components/ModuleFiltersV2').then((m) => ({ default: m.default }))
);
export const LearningGoalsV2Lazy = lazy(() =>
  import('../../components/LearningGoalsV2').then((m) => ({ default: m.default }))
);
export const PeerComparisonV2Lazy = lazy(() =>
  import('../../components/PeerComparisonV2').then((m) => ({ default: m.default }))
);

// Loading skeleton component
export const SectionLoadingSkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-12 bg-gray-200 rounded-lg"></div>
    <div className="h-64 bg-gray-200 rounded-lg"></div>
  </div>
);

// Fallback component for lazy sections
export const LazyComponentFallback = ({ sectionName }) => (
  <div className="bg-white rounded-lg shadow-md p-8 border-l-4 border-blue-500">
    <div className="flex items-center gap-3">
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
      <p className="text-gray-600">Loading {sectionName}...</p>
    </div>
  </div>
);
