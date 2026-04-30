import React from "react";
import { FaTrophy, FaFire, FaStar, FaMedal } from "react-icons/fa";

const AchievementsSection = ({ achievements }) => {
  const badgeIcons = {
    streak: FaFire,
    course: FaTrophy,
    lessons: FaStar,
    perfect: FaMedal,
  };

  const badgeColors = {
    streak: "from-orange-500 to-red-500",
    course: "from-blue-500 to-purple-500",
    lessons: "from-yellow-500 to-orange-500",
    perfect: "from-purple-500 to-pink-500",
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <FaTrophy className="text-yellow-500" />
        Achievements & Badges
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {achievements.map((badge, idx) => {
          const Icon = badgeIcons[badge.type] || FaTrophy;
          const colors = badgeColors[badge.type] || "from-gray-500 to-gray-600";

          return (
            <div
              key={idx}
              className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all group cursor-pointer"
            >
              <div
                className={`w-16 h-16 rounded-full bg-gradient-to-br ${colors} flex items-center justify-center text-white text-2xl mb-2 group-hover:scale-110 transition-transform`}
              >
                <Icon />
              </div>
              <h3 className="font-semibold text-gray-800 text-center text-sm">
                {badge.title}
              </h3>
              <p className="text-xs text-gray-500 mt-1">{badge.date}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AchievementsSection;
