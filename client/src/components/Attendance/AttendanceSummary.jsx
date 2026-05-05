import React from "react";
import {
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
  FiPercent,
} from "react-icons/fi";
import GradientCard from "../ui/GradientCard";

const AttendanceSummary = ({ stats = {}, trends = {} }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <GradientCard
        icon={FiCalendar}
        label="Total Classes"
        value={stats.total ?? 0}
        color="blue"
      />
      <GradientCard
        icon={FiCheckCircle}
        label="Present"
        value={stats.present ?? 0}
        color="green"
        trend={trends.present}
      />
      <GradientCard
        icon={FiXCircle}
        label="Absent"
        value={stats.absent ?? 0}
        color="red"
        trend={trends.absent}
      />
      <GradientCard
        icon={FiPercent}
        label="Attendance"
        value={`${stats.percentage ?? 0}%`}
        progress={stats.percentage ?? 0}
        color="purple"
        trend={trends.percentage}
      />
    </div>
  );
};

export default AttendanceSummary;
