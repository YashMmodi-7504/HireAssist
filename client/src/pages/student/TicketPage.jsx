import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiPlusCircle, FiInbox } from "react-icons/fi";

import Tabs from "../../components/ui/Tabs";
import CreateTicketForm from "../../components/Ticket/CreateTicketForm";
import QueriesCardList from "../../components/Ticket/QueriesCardList";

const SEED_QUERIES = [
  {
    id: "TKT-1042",
    title: "Unable to download Year 1 certificate",
    category: "Certificate",
    createdAt: "2026-04-12",
    status: "open",
    description:
      "The download button on the Certificate page does nothing on Chrome 124. No console error. Tried Safari and Firefox, same result.",
  },
  {
    id: "TKT-1038",
    title: "DSA assessment freezes on question 12",
    category: "Assessment",
    createdAt: "2026-04-08",
    status: "in-review",
    description:
      "Browser tab becomes unresponsive when answering question 12 in the DSA assessment. Refreshing loses my progress.",
    lastReply: {
      author: "Support",
      message: "Reproduced on our side. Engineering is fixing the recursion in the question component.",
    },
  },
  {
    id: "TKT-1031",
    title: "Marked absent though I attended",
    category: "Attendance",
    createdAt: "2026-04-02",
    status: "pending",
    description:
      "Marked absent for the DBMS class on 2026-03-30 even though I was present and signed the register.",
  },
  {
    id: "TKT-1024",
    title: "Profile email update request",
    category: "Account",
    createdAt: "2026-03-28",
    status: "closed",
    description: "Wanted my profile email changed to my college email.",
    lastReply: {
      author: "Registrar",
      message: "Updated. Please verify the change in your profile settings.",
    },
  },
  {
    id: "TKT-1019",
    title: "Placement form rejected by validator",
    category: "Placement",
    createdAt: "2026-03-22",
    status: "closed",
    description:
      "Placement form kept showing 'CGPA invalid' even with valid input. Was a stale cache issue, fixed by hard refresh.",
  },
  {
    id: "TKT-1013",
    title: "Module video buffering on mobile",
    category: "Course Access",
    createdAt: "2026-03-18",
    status: "closed",
    description:
      "Videos buffer constantly on the mobile network. Worked fine on Wi-Fi.",
  },
];

const TicketPage = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [queries, setQueries] = useState(SEED_QUERIES);

  // Tab state derived from URL so the sidebar sub-items can deep-link
  const activeTab = pathname.endsWith("/queries") ? "queries" : "create";

  const setTab = (id) => {
    navigate(id === "queries" ? "/student/ticket/queries" : "/student/ticket");
  };

  const tabs = useMemo(
    () => [
      { id: "create", label: "Create Ticket", icon: FiPlusCircle },
      {
        id: "queries",
        label: "My Queries",
        icon: FiInbox,
        count: queries.length,
      },
    ],
    [queries.length]
  );

  const handleCreated = (ticket) => {
    setQueries((prev) => [ticket, ...prev]);
  };

  return (
    <div className="w-full bg-slate-50 min-h-full">
      {/* Header band */}
      <div className="bg-gradient-to-r from-purple-50 via-white to-indigo-50 border-b border-purple-100">
        <div className="px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-semibold text-gray-900">Support Center</h1>
          <p className="text-sm text-gray-600 mt-1">
            Raise a new ticket or follow up on existing ones
          </p>
        </div>
      </div>

      <div className="w-full px-6 lg:px-8 py-8 space-y-6">
        <Tabs tabs={tabs} activeId={activeTab} onChange={setTab} />

        <div key={activeTab} className="animate-[fadeIn_0.2s_ease-out]">
          {activeTab === "create" ? (
            <CreateTicketForm onCreated={handleCreated} />
          ) : (
            <QueriesCardList rows={queries} />
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketPage;
