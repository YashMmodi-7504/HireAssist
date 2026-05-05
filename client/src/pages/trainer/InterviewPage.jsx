import React, { useState } from "react";
import {
  FiCalendar,
  FiClock,
  FiVideo,
  FiPlayCircle,
  FiInfo,
  FiPlus,
  FiInbox,
} from "react-icons/fi";
import { useToast } from "../../components/ui/Toaster";

const SEED_SLOTS = [
  {
    id: "INT-2042",
    date: "2026-05-02",
    time: "10:00 – 10:45",
    batch: "AC-2025",
    type: "Technical Round 1",
    panel: "Praful Bhoyar · Anand Rao",
    candidates: 4,
  },
  {
    id: "INT-2041",
    date: "2026-05-02",
    time: "11:00 – 11:45",
    batch: "AC-2025",
    type: "HR Round",
    panel: "Sneha Iyer",
    candidates: 4,
  },
  {
    id: "INT-2040",
    date: "2026-05-03",
    time: "14:30 – 15:15",
    batch: "CU4FO-25",
    type: "Mock Interview",
    panel: "Vikram Joshi",
    candidates: 6,
  },
  {
    id: "INT-2039",
    date: "2026-05-05",
    time: "09:30 – 10:30",
    batch: "VAC-25",
    type: "Group Discussion",
    panel: "Praful Bhoyar · Sneha Iyer",
    candidates: 8,
  },
];

const typeAccent = {
  "Technical Round 1": "from-purple-500 to-indigo-500",
  "HR Round": "from-emerald-500 to-teal-500",
  "Mock Interview": "from-blue-500 to-cyan-500",
  "Group Discussion": "from-orange-500 to-amber-500",
};

const SlotCard = ({ slot, onStart, onView }) => {
  const accent = typeAccent[slot.type] || "from-purple-500 to-indigo-500";
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col">
      <div className={`h-1 bg-gradient-to-r ${accent}`} />
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <p className="text-xs font-mono font-semibold text-gray-500">
              {slot.id}
            </p>
            <h3 className="text-base font-semibold text-gray-900 mt-1 leading-snug">
              {slot.type}
            </h3>
          </div>
          <span className="inline-flex px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs font-mono font-semibold">
            {slot.batch}
          </span>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <FiCalendar className="w-3.5 h-3.5 text-gray-400" />
            <span>{slot.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiClock className="w-3.5 h-3.5 text-gray-400" />
            <span>{slot.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiVideo className="w-3.5 h-3.5 text-gray-400" />
            <span className="truncate">{slot.panel}</span>
          </div>
        </div>

        <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-purple-700 bg-purple-50 border border-purple-100 px-2 py-1 rounded-full self-start">
          {slot.candidates} candidates assigned
        </div>

        <div className="flex-1" />

        <div className="flex gap-2 mt-5">
          <button
            type="button"
            onClick={() => onStart(slot)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg shadow-sm hover:shadow-[0_8px_24px_-6px_rgba(124,58,237,0.45)] active:scale-[0.98] transition-all duration-200"
          >
            <FiPlayCircle className="w-3.5 h-3.5" />
            Start Interview
          </button>
          <button
            type="button"
            onClick={() => onView(slot)}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            <FiInfo className="w-3.5 h-3.5" />
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({ onRequest, onLoadDemo }) => (
  <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-12 text-center">
    <div className="inline-flex p-4 rounded-2xl bg-purple-50 text-purple-600 mb-4">
      <FiInbox className="w-8 h-8" />
    </div>
    <p className="text-lg font-semibold text-gray-900">
      No slots assigned yet
    </p>
    <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto leading-relaxed">
      The placement office hasn't allocated any interview slots to you yet.
      Request a slot when you're ready to start mock interviews.
    </p>
    <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
      <button
        type="button"
        onClick={onRequest}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-[0_8px_24px_-6px_rgba(124,58,237,0.45)] active:scale-[0.99] transition-all duration-200"
      >
        <FiPlus className="w-4 h-4" />
        Request Slot
      </button>
      <button
        type="button"
        onClick={onLoadDemo}
        className="text-xs font-semibold text-purple-600 hover:text-purple-700 transition-colors"
      >
        Preview with sample data
      </button>
    </div>
  </div>
);

const InterviewPage = () => {
  const [slots, setSlots] = useState(SEED_SLOTS);
  const { toast } = useToast();

  const handleStart = (slot) => {
    toast({
      title: `Starting ${slot.type}`,
      message: `Joining the interview room for ${slot.batch}…`,
      variant: "info",
    });
  };

  const handleView = (slot) => {
    toast({
      title: slot.id,
      message: `${slot.candidates} candidates · ${slot.panel}`,
      variant: "info",
    });
  };

  const handleRequest = () => {
    toast({
      title: "Slot request sent",
      message: "The placement office will get back to you within a working day.",
      variant: "success",
    });
  };

  return (
    <div className="w-full bg-slate-50 min-h-full">
      <div className="bg-gradient-to-r from-purple-50 via-white to-indigo-50 border-b border-purple-100">
        <div className="px-6 lg:px-8 py-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">
              Schedule Interview
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Slots assigned to you for upcoming interview rounds
            </p>
          </div>
          <div className="flex items-center gap-2">
            {slots.length > 0 && (
              <button
                type="button"
                onClick={() => setSlots([])}
                className="text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
              >
                Preview empty state
              </button>
            )}
            <button
              type="button"
              onClick={handleRequest}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-[0_8px_24px_-6px_rgba(124,58,237,0.45)] active:scale-[0.99] transition-all duration-200"
            >
              <FiPlus className="w-4 h-4" />
              Request Slot
            </button>
          </div>
        </div>
      </div>

      <div className="w-full px-6 lg:px-8 py-8">
        {slots.length === 0 ? (
          <EmptyState
            onRequest={handleRequest}
            onLoadDemo={() => setSlots(SEED_SLOTS)}
          />
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Upcoming Slots
              </h2>
              <span className="text-xs text-gray-500">
                {slots.length} assigned
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {slots.map((slot) => (
                <SlotCard
                  key={slot.id}
                  slot={slot}
                  onStart={handleStart}
                  onView={handleView}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InterviewPage;
