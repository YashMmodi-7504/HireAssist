import React, { useState } from "react";
import {
  FaBullseye,
  FaCheckCircle,
  FaClock,
  FaTrash,
  FaPlus,
} from "react-icons/fa";

const GoalsSection = ({ goals, onAddGoal, onCompleteGoal, onDeleteGoal }) => {
  const [showNewGoal, setShowNewGoal] = useState(false);
  const [newGoalText, setNewGoalText] = useState("");

  const handleAddGoal = () => {
    if (newGoalText.trim()) {
      onAddGoal(newGoalText);
      setNewGoalText("");
      setShowNewGoal(false);
    }
  };

  const priorityColor = {
    high: "border-red-500 bg-red-50",
    medium: "border-yellow-500 bg-yellow-50",
    low: "border-green-500 bg-green-50",
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <FaBullseye className="text-purple-600" />
          Your Goals
        </h2>
        <button
          onClick={() => setShowNewGoal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
        >
          <FaPlus className="text-xs" />
          Add Goal
        </button>
      </div>

      {/* Add Goal Form */}
      {showNewGoal && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border-l-4 border-purple-500">
          <input
            type="text"
            value={newGoalText}
            onChange={(e) => setNewGoalText(e.target.value)}
            placeholder="Enter your learning goal..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            onKeyPress={(e) => e.key === "Enter" && handleAddGoal()}
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddGoal}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium hover:bg-purple-600 transition-all"
            >
              Add
            </button>
            <button
              onClick={() => setShowNewGoal(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-400 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Goals List */}
      <div className="space-y-3">
        {goals.length === 0 ? (
          <p className="text-gray-500 text-center py-6">
            No goals yet. Create one to get started!
          </p>
        ) : (
          goals.map((goal) => (
            <div
              key={goal.id}
              className={`p-4 rounded-lg border-l-4 flex items-center justify-between ${priorityColor[goal.priority]}`}
            >
              <div className="flex items-center gap-3 flex-1">
                <button
                  onClick={() => onCompleteGoal(goal.id)}
                  className={`flex-shrink-0 text-lg transition-all ${
                    goal.completed
                      ? "text-green-500"
                      : "text-gray-400 hover:text-green-500"
                  }`}
                >
                  <FaCheckCircle />
                </button>
                <div className="flex-1">
                  <p
                    className={`font-medium ${
                      goal.completed
                        ? "line-through text-gray-500"
                        : "text-gray-800"
                    }`}
                  >
                    {goal.text}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <FaClock className="text-xs" />
                    <span>{goal.daysLeft} days left</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onDeleteGoal(goal.id)}
                className="text-red-500 hover:text-red-700 transition-all ml-2"
              >
                <FaTrash className="text-sm" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GoalsSection;
