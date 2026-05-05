import React from "react";
import { FiSearch } from "react-icons/fi";

const selectClass =
  "px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-300 transition-all duration-200 cursor-pointer";

const JobFilters = ({
  search = "",
  onSearch = () => {},
  locations = [],
  selectedLocation = "all",
  onLocationChange = () => {},
  selectedType = "all",
  onTypeChange = () => {},
  onReset,
}) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search jobs by title, company, or skill..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white focus:border-purple-300 transition-all duration-200"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <select
            value={selectedLocation}
            onChange={(e) => onLocationChange(e.target.value)}
            className={selectClass}
            aria-label="Location"
          >
            <option value="all">All Locations</option>
            {locations.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className={selectClass}
            aria-label="Type"
          >
            <option value="all">All Types</option>
            <option value="Internship">Internship</option>
            <option value="Full-time">Full-time</option>
            <option value="Contract">Contract</option>
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

export default JobFilters;
