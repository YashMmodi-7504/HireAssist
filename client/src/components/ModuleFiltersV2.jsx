import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { FaFilter, FaSearch, FaTimes } from 'react-icons/fa';

const ModuleFiltersV2 = memo(({ filters, onFilterChange, onResetFilters }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-blue-500"
    >
      <div className="flex items-center gap-2 mb-4">
        <FaFilter className="text-blue-600" size={20} />
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Input */}
        <div className="relative">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search modules..."
            value={filters.searchTerm}
            onChange={(e) => onFilterChange('searchTerm', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            aria-label="Search modules by name"
          />
        </div>

        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          aria-label="Filter by module status"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="in-progress">In Progress</option>
          <option value="not-started">Not Started</option>
        </select>

        {/* Difficulty Filter */}
        <select
          value={filters.difficultyLevel}
          onChange={(e) => onFilterChange('difficultyLevel', e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          aria-label="Filter by difficulty level"
        >
          <option value="all">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      {/* Reset Button */}
      {(filters.searchTerm || filters.status !== 'all' || filters.difficultyLevel !== 'all') && (
        <button
          onClick={onResetFilters}
          className="mt-4 flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition font-medium"
          aria-label="Clear all filters"
        >
          <FaTimes size={16} />
          Clear Filters
        </button>
      )}
    </motion.div>
  );
});

ModuleFiltersV2.displayName = 'ModuleFiltersV2';

export default ModuleFiltersV2;
