import React from "react";
import {
  FiCalendar,
  FiBookOpen,
  FiBriefcase,
  FiClipboard,
} from "react-icons/fi";
import GradientCard from "../ui/GradientCard";

const KeyMetricsGrid = ({ metrics }) => {
  const m = metrics || {};
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <GradientCard
        icon={FiCalendar}
        label="Attendance"
        value={`${m.attendance ?? 0}%`}
        progress={m.attendance ?? 0}
        trend="+5%"
        color="green"
      />
      <GradientCard
        icon={FiBookOpen}
        label="Course Progress"
        value={`${m.courseProgress ?? 0}%`}
        progress={m.courseProgress ?? 0}
        trend="+8%"
        color="blue"
      />
      <GradientCard
        icon={FiBriefcase}
        label="Placement Ready"
        value={`${m.placementReady ?? 0}%`}
        progress={m.placementReady ?? 0}
        trend="+3%"
        color="purple"
      />
      <GradientCard
        icon={FiClipboard}
        label="Assessments"
        value={`${m.assessments ?? 0}%`}
        progress={m.assessments ?? 0}
        trend="+12%"
        color="orange"
      />
    </div>
  );
};

export default KeyMetricsGrid;
