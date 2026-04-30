import React from "react";
import { calculateLevel, getProgressToNextLevel, getUserTier } from "../utils/helpers";

const GamificationSection = ({ user, badges = [] }) => {
  const level = calculateLevel(user.totalXP || 0);
  const progressToNextLevel = getProgressToNextLevel(user.totalXP || 0);
  const tier = getUserTier(user.totalXP || 0);

  const earnedBadges = badges.filter(b => b.earned);
  const lockedBadges = badges.filter(b => !b.earned);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Your Achievement</h2>

      {/* Level and XP section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Level Card */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-purple-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="text-5xl font-bold text-purple-600">{level}</div>
            <div className="text-4xl">{tier.icon}</div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Current Level</p>
          <p className="text-lg font-bold text-purple-900">{tier.name} Member</p>

          {/* Progress to next level */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-gray-600">Progress to Level {level + 1}</span>
              <span className="text-xs font-bold text-purple-600">{Math.round(progressToNextLevel)}%</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-purple-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressToNextLevel}%` }}
              />
            </div>
          </div>
        </div>

        {/* XP Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
          <p className="text-sm text-gray-600 mb-2">Total XP</p>
          <p className="text-4xl font-bold text-blue-600 mb-4">{user.totalXP || 0}</p>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">XP per level</span>
              <span className="font-bold text-gray-900">1000</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Next milestone</span>
              <span className="font-bold text-blue-600">{(level + 1) * 1000}</span>
            </div>
          </div>
        </div>

        {/* Streak Card */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
          <p className="text-sm text-gray-600 mb-2">Current Streak</p>
          <p className="text-4xl font-bold text-orange-600 mb-1">{user.streak || 0} 🔥</p>
          <p className="text-xs text-gray-600 mb-4">days in a row</p>
          <div className="bg-white rounded-lg p-2">
            <p className="text-xs text-center text-orange-700 font-semibold">Keep it going!</p>
          </div>
        </div>
      </div>

      {/* Badges section */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Badges & Achievements</h3>

        {/* Earned badges */}
        {earnedBadges.length > 0 && (
          <div className="mb-8">
            <p className="text-sm font-semibold text-gray-600 mb-4">Earned</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {earnedBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-4 text-center hover:shadow-md transition-shadow duration-200"
                >
                  <p className="text-3xl mb-2">{badge.icon}</p>
                  <p className="text-sm font-bold text-gray-900">{badge.name}</p>
                  <p className="text-xs text-gray-600 mt-1">{badge.earnedDate}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Locked badges */}
        {lockedBadges.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-4">Locked</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {lockedBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-300 rounded-xl p-4 text-center opacity-60"
                >
                  <p className="text-3xl mb-2 filter grayscale">{badge.icon}</p>
                  <p className="text-sm font-bold text-gray-700">{badge.name}</p>
                  {badge.progress !== undefined && (
                    <>
                      <div className="mt-2 bg-gray-200 h-1 rounded-full overflow-hidden">
                        <div
                          className="bg-gray-400 h-full rounded-full transition-all duration-300"
                          style={{ width: `${badge.progress || 0}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{badge.progress || 0}%</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GamificationSection;
