import React, { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { FaBullseye, FaPlus, FaCheckCircle, FaCircle } from 'react-icons/fa';

const LearningGoalsV2 = memo(({ goals = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newGoal, setNewGoal] = useState('');

  const handleAddGoal = () => {
    if (newGoal.trim()) {
      // In a real app, this would be handled by parent component or API
      setNewGoal('');
    }
  };

  const defaultGoals = [
    { id: 1, title: 'Complete Python Basics', dueDate: '2024-05-15', progress: 80, completed: false },
    { id: 2, title: 'Finish 10 LeetCode problems', dueDate: '2024-05-30', progress: 60, completed: false },
    { id: 3, title: 'Earn 5000 XP', dueDate: '2024-06-01', progress: 50, completed: false },
  ];

  const goalsToDisplay = goals.length > 0 ? goals : defaultGoals;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FaBullseye className="text-purple-600" size={24} />
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Learning Goals</h3>
            <p className="text-sm text-gray-600">Track your learning objectives</p>
          </div>
        </div>
      </div>

      {/* Goals List */}
      <div className="space-y-4 mb-6">
        {goalsToDisplay.map((goal) => (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
          >
            {/* Icon */}
            <div className="pt-1">
              {goal.completed ? (
                <FaCheckCircle className="text-green-500" size={20} />
              ) : (
                <FaCircle className="text-gray-400" size={20} />
              )}
            </div>

            {/* Goal Content */}
            <div className="flex-1 min-w-0">
              <p className={`font-semibold ${goal.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                {goal.title}
              </p>
              <p className="text-sm text-gray-500">Due: {goal.dueDate}</p>

              {/* Progress Bar */}
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${goal.progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{goal.progress}% Complete</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Goal Section */}
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-purple-300 rounded-lg hover:bg-purple-50 transition text-purple-600 font-semibold"
          aria-label="Add new learning goal"
        >
          <FaPlus size={16} />
          Add New Goal
        </button>
      ) : (
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter your learning goal..."
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddGoal()}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            autoFocus
          />
          <button
            onClick={handleAddGoal}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition"
          >
            Add
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition"
          >
            Cancel
          </button>
        </div>
      )}
    </motion.div>
  );
});

LearningGoalsV2.displayName = 'LearningGoalsV2';

export default LearningGoalsV2;
