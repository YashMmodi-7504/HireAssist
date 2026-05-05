import React from "react";
import { FiStar, FiAward } from "react-icons/fi";

const PremiumGamificationV2 = ({ user, badges = [] }) => {
  const getNextLevelXP = (currentXP) => {
    const xpPerLevel = 1000;
    const currentLevel = Math.floor(currentXP / xpPerLevel);
    const nextLevelThreshold = (currentLevel + 1) * xpPerLevel;
    return nextLevelThreshold - currentXP;
  };

  const getTierInfo = (level) => {
    if (level >= 10) return { name: "Platinum", emoji: "💎", color: "from-cyan-400 to-blue-600" };
    if (level >= 7) return { name: "Gold", emoji: "🏅", color: "from-yellow-400 to-orange-500" };
    if (level >= 4) return { name: "Silver", emoji: "🥈", color: "from-gray-400 to-gray-500" };
    return { name: "Bronze", emoji: "🥉", color: "from-orange-400 to-red-500" };
  };

  const tier = getTierInfo(user.level);
  const nextLevelXP = getNextLevelXP(user.totalXP);

  return (
    <div className="space-y-8">
      {/* Tier and Level Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tier Card */}
        <div className={`lg:col-span-1 relative overflow-hidden rounded-3xl bg-gradient-to-br ${tier.color} p-8 text-white shadow-xl`}>
          <div className="absolute -right-20 -top-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <p className="text-sm font-semibold opacity-90 tracking-wide uppercase mb-2">Current Tier</p>
            <p className="text-5xl font-black mb-4">{tier.emoji}</p>
            <p className="text-2xl font-bold mb-1">{tier.name}</p>
            <p className="text-white/80 text-sm">Level {user.level}</p>
          </div>
        </div>

        {/* XP Progress Card */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-3xl p-8 shadow-lg">
          <div className="space-y-6">
            <div>
              <div className="flex items-end justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide mb-1">Experience Points</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    {(user.totalXP || 0).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 font-semibold mb-1">Until Next Level</p>
                  <p className="text-3xl font-bold text-purple-600">{nextLevelXP.toLocaleString()}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 transition-all duration-700 rounded-full"
                    style={{ width: `${((user.totalXP % 1000) / 1000) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 font-medium">
                  {((user.totalXP % 1000) / 1000) * 100}% progress to level {user.level + 1}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <FiAward className="text-yellow-500" />
              Achievements
            </h3>
            <p className="text-gray-600 mt-1">Earn badges by completing milestones</p>
          </div>
        </div>

        {/* Badge Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`group relative overflow-hidden rounded-2xl p-6 text-center transition-all duration-300 ${
                badge.earned
                  ? "bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 shadow-md hover:shadow-lg hover:-translate-y-1"
                  : "bg-gray-50 border border-gray-200 opacity-60"
              }`}
            >
              {/* Glow effect for earned badges */}
              {badge.earned && (
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-yellow-200/30 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              )}

              <div className="relative z-10">
                <p className="text-5xl mb-3 group-hover:scale-125 transition-transform duration-300">
                  {badge.icon}
                </p>

                <h4 className="font-bold text-gray-900 text-sm mb-2 leading-tight">{badge.name}</h4>

                {badge.earned ? (
                  <div>
                    <p className="text-xs text-gray-600 font-semibold">Earned</p>
                    <p className="text-xs text-gray-500 mt-1">{badge.earnedDate}</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs text-gray-600 font-semibold mb-2">Progress</p>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                        style={{ width: `${badge.progress || 0}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{badge.progress || 0}%</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PremiumGamificationV2;
