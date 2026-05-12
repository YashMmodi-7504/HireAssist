import React from "react";
import { FiSearch } from "react-icons/fi";

const selectClass =
  "px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-300 transition-all duration-200 cursor-pointer";

const AssessmentFilters = ({
  searchTerm = "",
  onSearchChange = () => {},
  subjects = [],
  selectedSubject = "all",
  onSubjectChange = () => {},
  selectedDifficulty = "all",
  onDifficultyChange = () => {},
  selectedStatus = "all",
  onStatusChange = () => {},
  onReset,
}) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search assessments..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white focus:border-purple-300 transition-all duration-200"
          />
        </div>

        {/* Dropdowns + Reset */}
        <div className="flex flex-wrap gap-3">
          <select
            value={selectedSubject}
            onChange={(e) => onSubjectChange(e.target.value)}
            className={selectClass}
            aria-label="Subject"
          >
            <option value="all">All Subjects</option>
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => onDifficultyChange(e.target.value)}
            className={selectClass}
            aria-label="Difficulty"
          >
            <option value="all">All Levels</option>
            <option value="easy">Easy</option>
            <option value="medium">Intermediate</option>
            <option value="hard">Hard</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className={selectClass}
            aria-label="Status"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
            <option value="not-started">Not Started</option>
          </select>

          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="px-4 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors duration-200"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentFilters;
