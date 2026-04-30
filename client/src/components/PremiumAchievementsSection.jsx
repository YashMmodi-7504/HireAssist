import React, { useState } from "react";
import {
  FaTrophy,
  FaStar,
  FaMedal,
  FaFire,
  FaCode,
  FaGraduationCap,
} from "react-icons/fa";

const PremiumAchievementsSection = ({ achievements }) => {
  const [hoveredId, setHoveredId] = useState(null);

  const badgeConfig = {
    streak: {
      icon: FaFire,
      colors: { gradient: "from-orange-500 to-red-600", glow: "glow-orange" },
      tier: "gold",
    },
    course: {
      icon: FaGraduationCap,
      colors: { gradient: "from-blue-500 to-purple-600", glow: "glow-blue" },
      tier: "silver",
    },
    lessons: {
      icon: FaStar,
      colors: { gradient: "from-yellow-500 to-orange-600", glow: "glow-yellow" },
      tier: "gold",
    },
    perfect: {
      icon: FaTrophy,
      colors: { gradient: "from-purple-500 to-pink-600", glow: "glow-purple" },
      tier: "gold",
    },
    code: {
      icon: FaCode,
      colors: { gradient: "from-green-500 to-emerald-600", glow: "glow-green" },
      tier: "silver",
    },
    milestone: {
      icon: FaMedal,
      colors: { gradient: "from-indigo-500 to-blue-600", glow: "glow-indigo" },
      tier: "bronze",
    },
  };

  const getBadgeTierStyle = (tier) => {
    const styles = {
      gold: "border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50",
      silver: "border-gray-300 bg-gradient-to-br from-gray-50 to-blue-50",
      bronze: "border-orange-300 bg-gradient-to-br from-orange-50 to-yellow-50",
    };
    return styles[tier] || styles.silver;
  };

  return (
    <div>
      <style>{`
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
          50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.8); }
        }
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
      `}</style>

      <div className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-2xl border border-purple-200 p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <FaTrophy className="text-yellow-500" />
            Achievements & Badges
          </h2>
          <span className="text-sm font-semibold text-purple-600 bg-purple-100 px-4 py-2 rounded-full">
            {achievements.length} Earned
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {achievements.map((badge, idx) => {
            const config = badgeConfig[badge.type];
            const Icon = config.icon;
            const isHovered = hoveredId === idx;

            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredId(idx)}
                onMouseLeave={() => setHoveredId(null)}
                className="relative group"
              >
                {/* Badge Container */}
                <div
                  className={`p-6 rounded-2xl border-2 ${getBadgeTierStyle(config.tier)} flex flex-col items-center justify-center transition-all duration-300 ${
                    isHovered ? "transform -translate-y-2 shadow-2xl" : ""
                  }`}
                >
                  {/* Glow Effect on Hover */}
                  {isHovered && (
                    <div
                      className={`absolute inset-0 rounded-2xl animate-glow pointer-events-none`}
                      style={{
                        boxShadow: `0 0 30px ${
                          config.tier === "gold"
                            ? "rgba(255, 193, 7, 0.6)"
                            : config.tier === "silver"
                            ? "rgba(156, 163, 175, 0.6)"
                            : "rgba(255, 159, 64, 0.6)"
                        }`,
                      }}
                    />
                  )}

                  {/* Icon */}
                  <div
                    className={`w-20 h-20 rounded-full bg-gradient-to-br ${config.colors.gradient} flex items-center justify-center text-white mb-3 transform transition-all duration-300 ${
                      isHovered ? "scale-110 shadow-xl" : "shadow-lg"
                    } relative z-10`}
                  >
                    <Icon className="text-3xl" />
                  </div>

                  {/* Badge Title */}
                  <h3 className="font-bold text-gray-900 text-center text-sm mb-1">
                    {badge.title}
                  </h3>

                  {/* Badge Date */}
                  <p className="text-xs text-gray-500 text-center">{badge.date}</p>

                  {/* Tier Badge */}
                  <div className="mt-3 px-2 py-1 bg-white/80 rounded-full text-xs font-semibold capitalize text-gray-700">
                    {config.tier}
                  </div>
                </div>

                {/* Tooltip */}
                {isHovered && (
                  <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap z-20 animate-in fade-in duration-300">
                    {badge.description || "Keep learning to earn more badges!"}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress towards next badge */}
        <div className="mt-8 pt-8 border-t border-purple-200">
          <h3 className="font-semibold text-gray-900 mb-4">Next Badge</h3>
          <div className="bg-white rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Complete 10 more lessons
              </span>
              <span className="text-sm font-semibold text-purple-600">7/10</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"
                style={{ width: "70%" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumAchievementsSection;
