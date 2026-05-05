import React from "react";
import {
  FiTarget,
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
} from "react-icons/fi";
import GradientCard from "../ui/GradientCard";

const AssessmentSummary = ({ stats }) => {
  const s = stats || {};
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <GradientCard
        icon={FiTarget}
        label="Total"
        value={s.total ?? 0}
        color="purple"
      />
      <GradientCard
        icon={FiCheckCircle}
        label="Completed"
        value={s.completed ?? 0}
        color="green"
      />
      <GradientCard
        icon={FiClock}
        label="Pending"
        value={s.pending ?? 0}
        color="orange"
      />
      <GradientCard
        icon={FiTrendingUp}
        label="Average Score"
        value={`${s.avgScore ?? 0}%`}
        progress={s.avgScore ?? 0}
        color="blue"
      />
    </div>
  );
};

export default AssessmentSummary;
