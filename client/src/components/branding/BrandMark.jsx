import React from "react";

// Reusable brand wordmark for "HireAssist" — drop into the navbar, sidebars,
// auth pages, marketing surfaces.
//
// Visual hierarchy:
//   Hire   — solid color, weight 500 (calm anchor)
//   Assist — gradient-clipped, weight 800 (action focus)
//
// Props:
//   size      "sm" | "md" | "lg" | "xl"            – default "md"
//   theme     "dark" | "light"                     – default "dark"
//                "dark"  = on white / light bg (purple Hire, purple gradient Assist)
//                "light" = on purple / dark bg (white Hire, white→lavender gradient Assist)
//   withIcon  boolean                              – default false
//   iconSrc   string                               – default "/logo.png"
//   tagline   string | null                        – e.g. "Student Console"
//   className extra classes for outer wrapper
//   onClick   click handler

const SIZES = {
  sm: {
    text: "text-base",
    icon: "w-6 h-6",
    gap: "gap-2",
    tagline: "text-[9px] tracking-[0.14em]",
    taglineGap: "mt-0.5",
  },
  md: {
    text: "text-lg",
    icon: "w-8 h-8",
    gap: "gap-2.5",
    tagline: "text-[10px] tracking-[0.18em]",
    taglineGap: "mt-0.5",
  },
  lg: {
    text: "text-2xl",
    icon: "w-10 h-10",
    gap: "gap-3",
    tagline: "text-[11px] tracking-[0.2em]",
    taglineGap: "mt-1",
  },
  xl: {
    text: "text-3xl sm:text-[2rem]",
    icon: "w-12 h-12",
    gap: "gap-3",
    tagline: "text-xs tracking-[0.22em]",
    taglineGap: "mt-1",
  },
};

const THEMES = {
  dark: {
    hire: "text-purple-700",
    assistGradient: "linear-gradient(135deg, #7C5CFF 0%, #A084FF 100%)",
    tagline: "text-gray-500",
  },
  light: {
    hire: "text-white",
    assistGradient: "linear-gradient(135deg, #FFFFFF 0%, #E9D5FF 100%)",
    tagline: "text-white/65",
  },
};

const FONT_STACK = "'Poppins', system-ui, -apple-system, sans-serif";

const BrandMark = ({
  size = "md",
  theme = "dark",
  withIcon = false,
  iconSrc = "/logo.png",
  tagline = null,
  className = "",
  onClick,
}) => {
  const s = SIZES[size] || SIZES.md;
  const t = THEMES[theme] || THEMES.dark;

  return (
    <div
      onClick={onClick}
      className={`group inline-flex items-center ${s.gap} select-none ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      {withIcon && (
        <img
          src={iconSrc}
          alt="HireAssist"
          className={`${s.icon} object-contain rounded-lg flex-shrink-0 transition-transform duration-300 ease-out group-hover:scale-110 group-hover:-rotate-[6deg]`}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      )}
      <div className="leading-none" style={{ fontFamily: FONT_STACK }}>
        <div className="flex items-baseline gap-[1px]">
          <span
            className={`${s.text} font-medium tracking-tight ${t.hire} transition-colors duration-200`}
          >
            Hire
          </span>
          <span
            className={`${s.text} font-extrabold tracking-tight bg-clip-text text-transparent transition-[letter-spacing] duration-300 group-hover:tracking-normal`}
            style={{ backgroundImage: t.assistGradient }}
          >
            Assist
          </span>
        </div>
        {tagline && (
          <p
            className={`${s.taglineGap} ${s.tagline} font-semibold uppercase ${t.tagline}`}
          >
            {tagline}
          </p>
        )}
      </div>
    </div>
  );
};

export default BrandMark;
