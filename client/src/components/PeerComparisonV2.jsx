import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaMedal } from 'react-icons/fa';

const PeerComparisonV2 = memo(() => {
  const peers = [
    { id: 1, name: 'You', xp: 2500, level: 3, badge: '👑' },
    { id: 2, name: 'Alex Kumar', xp: 2350, level: 3, badge: '⭐' },
    { id: 3, name: 'Sarah Chen', xp: 2100, level: 2, badge: '🔥' },
    { id: 4, name: 'Mike Johnson', xp: 1950, level: 2, badge: '💪' },
    { id: 5, name: 'Emma Davis', xp: 1800, level: 2, badge: '🎯' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500"
    >
      <div className="flex items-center gap-3 mb-6">
        <FaUsers className="text-blue-600" size={24} />
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Leaderboard</h3>
          <p className="text-sm text-gray-600">Top performers this week</p>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-3">
        {peers.map((peer, index) => (
          <motion.div
            key={peer.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex items-center justify-between p-4 rounded-lg ${
              peer.name === 'You'
                ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300'
                : 'bg-gray-50 hover:bg-gray-100'
            } transition`}
          >
            <div className="flex items-center gap-3 flex-1">
              {/* Rank */}
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 font-bold text-sm text-gray-700">
                {index + 1}
              </div>

              {/* User Info */}
              <div className="flex-1">
                <p className={`font-semibold ${peer.name === 'You' ? 'text-blue-600' : 'text-gray-900'}`}>
                  {peer.name}
                </p>
                <p className="text-xs text-gray-500">Level {peer.level}</p>
              </div>
            </div>

            {/* Badge & XP */}
            <div className="flex items-center gap-3">
              <span className="text-2xl">{peer.badge}</span>
              <div className="text-right">
                <p className="font-bold text-gray-900">{peer.xp.toLocaleString()}</p>
                <p className="text-xs text-gray-500">XP</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">150 XP</p>
          <p className="text-sm text-gray-600">Ahead of 3rd place</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">1st</p>
          <p className="text-sm text-gray-600">Your rank this week</p>
        </div>
      </div>
    </motion.div>
  );
});

PeerComparisonV2.displayName = 'PeerComparisonV2';

export default PeerComparisonV2;
