import React from "react";
import {
  FiCalendar,
  FiBookOpen,
  FiBriefcase,
  FiClipboard,
} from "react-icons/fi";
import GradientCard from "../ui/GradientCard";

const CARDS = [
  {
    id: "attendance",
    icon: FiCalendar,
    label: "Attendance",
    color: "green",
    trend: "+5%",
  },
  {
    id: "courseProgress",
    icon: FiBookOpen,
    label: "Course Progress",
    color: "blue",
    trend: "+8%",
  },
  {
    id: "placementReady",
    icon: FiBriefcase,
    label: "Placement Ready",
    color: "purple",
    trend: "+3%",
  },
  {
    id: "assessments",
    icon: FiClipboard,
    label: "Assessments",
    color: "orange",
    trend: "+12%",
  },
];

const KeyMetricsGrid = ({ metrics, onCardClick }) => {
  const m = metrics || {};
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {CARDS.map((card) => {
        const value = m[card.id] ?? 0;
        return (
          <GradientCard
            key={card.id}
            icon={card.icon}
            label={card.label}
            value={`${value}%`}
            progress={value}
            trend={card.trend}
            color={card.color}
            onClick={onCardClick ? () => onCardClick(card.id) : undefined}
          />
        );
      })}
    </div>
  );
};

export default KeyMetricsGrid;
