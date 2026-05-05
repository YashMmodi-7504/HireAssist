import React from "react";

const Bar = ({ className = "" }) => (
  <div className={`bg-gray-200 rounded ${className}`} />
);

const JobCardSkeleton = () => (
  <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm animate-pulse">
    <div className="flex justify-between items-start gap-4">
      <div className="flex-1 min-w-0">
        <Bar className="h-5 w-2/3 mb-2" />
        <Bar className="h-3 w-1/3 bg-gray-100" />
      </div>
      <Bar className="h-6 w-16 rounded-full bg-gray-100" />
    </div>

    <div className="flex gap-2 mt-4">
      <Bar className="h-6 w-20 bg-gray-100" />
      <Bar className="h-6 w-16 bg-gray-100" />
      <Bar className="h-6 w-24 bg-gray-100" />
    </div>

    <Bar className="h-4 w-1/4 mt-3 bg-gray-100" />

    <div className="flex gap-2 mt-3">
      <Bar className="h-6 w-14 bg-gray-100" />
      <Bar className="h-6 w-14 bg-gray-100" />
      <Bar className="h-6 w-16 bg-gray-100" />
      <Bar className="h-6 w-14 bg-gray-100" />
    </div>

    <div className="flex justify-end gap-2 mt-5">
      <Bar className="h-9 w-28 bg-gray-100" />
      <Bar className="h-9 w-20" />
    </div>
  </div>
);

export default JobCardSkeleton;
