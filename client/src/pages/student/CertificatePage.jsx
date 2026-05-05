import React from "react";
import { FiInfo } from "react-icons/fi";
import CertificateCard from "../../components/Certificate/CertificateCard";

const CERTIFICATES = [
  {
    id: 1,
    year: "2023 – 2024",
    program: "Foundation Year — Code Unnati",
    status: "available",
    issuedOn: "30 May 2024",
    variant: "blue",
  },
  {
    id: 2,
    year: "2024 – 2025",
    program: "Intermediate Year — Specialisation Track",
    status: "available",
    issuedOn: "12 Jun 2025",
    variant: "purple",
  },
  {
    id: 3,
    year: "2025 – 2026",
    program: "Advanced Year — Capstone & Placement",
    status: "pending",
    variant: "green",
  },
  {
    id: 4,
    year: "Final Project",
    program: "Capstone Submission Certificate",
    status: "pending",
    variant: "orange",
  },
];

const CertificatePage = () => {
  const handleDownload = (c) => {
    console.log("[certificate] download ->", c.year);
  };

  return (
    <div className="w-full bg-slate-50 min-h-full">
      <div className="bg-gradient-to-r from-purple-50 via-white to-indigo-50 border-b border-purple-100">
        <div className="px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-semibold text-gray-900">
            Download Certificate
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Access certificates issued for each completed academic phase
          </p>
        </div>
      </div>

      <div className="w-full px-6 lg:px-8 py-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {CERTIFICATES.map((c) => (
            <CertificateCard
              key={c.id}
              certificate={c}
              variant={c.variant}
              onDownload={handleDownload}
            />
          ))}
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600 flex-shrink-0">
            <FiInfo className="w-4 h-4" />
          </div>
          <div className="text-sm text-gray-700 leading-relaxed">
            <p className="font-semibold text-gray-900">
              Certificates are released at the end of each academic year.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              If you believe a certificate should be available but isn't,
              raise a ticket from the sidebar and the registrar's office will follow up.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatePage;
