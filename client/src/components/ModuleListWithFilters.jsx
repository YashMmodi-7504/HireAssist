import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import ExpandableModuleCard from "./ExpandableModuleCard";
import { filterModulesByStatus, sortModules } from "../utils/helpers";

const ModuleListWithFilters = ({ modules = [], onTopicToggle }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("progress");

  // Filter modules
  let filteredModules = filterModulesByStatus(modules, filterStatus);

  // Search filter
  filteredModules = filteredModules.filter(m =>
    m.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort modules
  filteredModules = sortModules(filteredModules, sortBy);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Learning Modules</h2>

      {/* Filters and Search */}
      <div className="space-y-4 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        {/* Search Bar */}
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search modules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap">
          {["all", "in-progress", "completed", "locked"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filterStatus === status
                  ? "bg-purple-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div>
          <label className="text-sm font-semibold text-gray-600 block mb-2">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
          >
            <option value="progress">Progress (High to Low)</option>
            <option value="date">Date (Newest)</option>
            <option value="difficulty">Difficulty (Easy to Hard)</option>
          </select>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="space-y-4">
        {filteredModules.length > 0 ? (
          filteredModules.map((module) => (
            <ExpandableModuleCard
              key={module.id}
              module={module}
              onTopicToggle={onTopicToggle}
            />
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-200">
            <p className="text-gray-600 text-lg">No modules found</p>
            <p className="text-gray-500 text-sm mt-1">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleListWithFilters;
