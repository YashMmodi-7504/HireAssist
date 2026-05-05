// Single source of truth for the course-page chrome.
// Every course page (Courses list, ViewCourse hero, ModuleDetail hero, etc.)
// reads from here so the brand stays consistent with the purple sidebar.

export const COURSE_THEME = {
  // Premium 3-stop diagonal purple gradient.
  gradient: "linear-gradient(135deg, #5B2EFF 0%, #7A4DFF 50%, #9B6BFF 100%)",
  // Foreground color paired with `gradient` for AA contrast.
  textOnGradient: "#ffffff",
};

// Spread onto any element that should wear the unified course header look.
// Tailwind can't express a 3-stop angled gradient in one stock utility, so
// we keep the gradient as inline style and let utility classes handle layout.
//
//   <div className="px-6 py-8 text-white" style={courseHeaderStyle}>...</div>
export const courseHeaderStyle = {
  backgroundImage: COURSE_THEME.gradient,
  color: COURSE_THEME.textOnGradient,
};
