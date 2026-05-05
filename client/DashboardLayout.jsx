import React from "react";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex h-screen">

      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-5">
        <h2 className="text-xl font-bold mb-8">HirerAssist</h2>

        <ul className="space-y-4">
          <li className="hover:text-gray-300 cursor-pointer">Dashboard</li>
          <li className="hover:text-gray-300 cursor-pointer">Students</li>
          <li className="hover:text-gray-300 cursor-pointer">Trainers</li>
          <li className="hover:text-gray-300 cursor-pointer">Analytics</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6">
        {children}
      </div>

    </div>
  );
};

export default DashboardLayout;
