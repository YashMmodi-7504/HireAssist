import React from "react";
import PlacementForm from "../../components/Placement/PlacementForm";

const PlacementFormPage = () => {
  return (
    <div className="w-full bg-slate-50 min-h-full">
      {/* Header band */}
      <div className="bg-gradient-to-r from-purple-50 via-white to-indigo-50 border-b border-purple-100">
        <div className="px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-semibold text-gray-900">Placement Form</h1>
          <p className="text-sm text-gray-600 mt-1">
            Complete your profile to be considered for upcoming placements
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="w-full px-6 lg:px-8 py-8">
        <PlacementForm />
      </div>
    </div>
  );
};

export default PlacementFormPage;
