// Shared course catalog. Single source of truth consumed by:
//   - trainer Courses / ViewCourse / ModuleDetail pages
//   - student AIChat page (used to build the system prompt)

export const COURSES = [
  {
    id: "advance",
    title: "Advance Course",
    tagline: "Industry-grade AI, Deep Learning, Edge AI & SAP",
    duration: "16 weeks",
    level: "Advanced",
    accent: "from-purple-500 to-indigo-600",
    modules: [
      {
        id: "ai-ml",
        order: 1,
        title: "Artificial Intelligence & Machine Learning",
        description:
          "Foundational and advanced ML — supervised, unsupervised, and reinforcement learning with hands-on model building.",
        topics: [
          "Supervised vs unsupervised learning",
          "Linear & logistic regression",
          "Decision trees, random forests, gradient boosting",
          "Model evaluation: precision, recall, F1, AUC",
          "Feature engineering & cross-validation",
          "Intro to reinforcement learning",
        ],
      },
      {
        id: "deep-learning",
        order: 2,
        title: "Deep Learning",
        description:
          "Neural networks from first principles to modern architectures with PyTorch and TensorFlow.",
        topics: [
          "Perceptron, MLP, backpropagation",
          "Convolutional Neural Networks (CNNs)",
          "Recurrent networks: RNN, LSTM, GRU",
          "Transformers & attention mechanism",
          "Transfer learning & fine-tuning",
          "Regularization, dropout, batch norm",
        ],
      },
      {
        id: "edge-ai",
        order: 3,
        title: "AI on Edge Devices",
        description:
          "Deploy and optimize models on constrained hardware — Raspberry Pi, Jetson Nano, microcontrollers.",
        topics: [
          "Model quantization & pruning",
          "TensorFlow Lite & ONNX Runtime",
          "Edge Impulse and TinyML",
          "On-device inference latency tuning",
          "Privacy & offline-first deployment",
        ],
      },
      {
        id: "sap",
        order: 4,
        title: "SAP Technologies",
        description:
          "SAP S/4HANA, ABAP basics, and integrating AI workloads with enterprise SAP modules.",
        topics: [
          "SAP S/4HANA overview",
          "ABAP programming fundamentals",
          "SAP Fiori UX",
          "BTP (Business Technology Platform)",
          "AI-augmented enterprise workflows",
        ],
      },
      {
        id: "employability",
        order: 5,
        title: "Employability Skills",
        description:
          "Resume polish, mock interviews, communication, and interview-readiness coaching.",
        topics: [
          "Resume & LinkedIn optimization",
          "Aptitude & logical reasoning",
          "HR + technical mock interviews",
          "Group discussion and presentation",
          "Workplace communication & email etiquette",
        ],
      },
    ],
  },
  {
    id: "foundation",
    title: "Foundation Course",
    tagline: "Core programming, DSA, and web fundamentals",
    duration: "12 weeks",
    level: "Beginner",
    accent: "from-emerald-500 to-teal-600",
    modules: [
      {
        id: "programming-basics",
        order: 1,
        title: "Programming Fundamentals",
        description: "Python and JavaScript basics, control flow, functions, and OOP.",
        topics: ["Variables & types", "Functions & scope", "Classes & objects", "Error handling"],
      },
      {
        id: "dsa",
        order: 2,
        title: "Data Structures & Algorithms",
        description: "Arrays, linked lists, trees, graphs, and complexity analysis.",
        topics: ["Big-O notation", "Sorting & searching", "Recursion", "Dynamic programming basics"],
      },
      {
        id: "web-basics",
        order: 3,
        title: "Web Development Basics",
        description: "HTML, CSS, and vanilla JavaScript with responsive design.",
        topics: ["Semantic HTML", "Flexbox & Grid", "DOM manipulation", "Fetch API"],
      },
      {
        id: "git",
        order: 4,
        title: "Version Control with Git",
        description: "Git, GitHub, and collaborative workflows.",
        topics: ["Branches & merges", "Pull requests", "Conflict resolution", "GitHub Actions intro"],
      },
    ],
  },
  {
    id: "value-added",
    title: "Value Added Course",
    tagline: "Specialized add-on tracks for differentiation",
    duration: "8 weeks",
    level: "Intermediate",
    accent: "from-amber-500 to-orange-600",
    modules: [
      {
        id: "cloud",
        order: 1,
        title: "Cloud Fundamentals",
        description: "AWS / Azure essentials with hands-on labs.",
        topics: ["EC2, S3, IAM", "Serverless basics", "Networking 101"],
      },
      {
        id: "devops",
        order: 2,
        title: "DevOps & CI/CD",
        description: "Docker, Kubernetes, and CI/CD pipelines.",
        topics: ["Containers", "Pipelines", "Infrastructure as Code"],
      },
      {
        id: "soft-skills",
        order: 3,
        title: "Communication & Soft Skills",
        description: "Public speaking, business writing, and emotional intelligence.",
        topics: ["Presentation skills", "Active listening", "Conflict management"],
      },
      {
        id: "design-thinking",
        order: 4,
        title: "Design Thinking",
        description: "Empathize, define, ideate, prototype, and test.",
        topics: ["User research", "Journey mapping", "Rapid prototyping"],
      },
    ],
  },
  {
    id: "fdp",
    title: "FDP Course",
    tagline: "Faculty Development Program — train the trainers",
    duration: "6 weeks",
    level: "Trainer",
    accent: "from-rose-500 to-pink-600",
    modules: [
      {
        id: "pedagogy",
        order: 1,
        title: "Modern Pedagogy",
        description: "Active learning techniques and outcome-based education.",
        topics: ["Flipped classroom", "Bloom's taxonomy", "Assessment design"],
      },
      {
        id: "edtech-tools",
        order: 2,
        title: "EdTech Tools",
        description: "LMS platforms, quiz tooling, and AI tutoring assistants.",
        topics: ["Moodle / Canvas", "Auto-grading", "AI grading assistants"],
      },
      {
        id: "research",
        order: 3,
        title: "Research & Publication",
        description: "Writing research papers and getting them published.",
        topics: ["Literature review", "Citations", "Conference & journal submission"],
      },
      {
        id: "industry-link",
        order: 4,
        title: "Industry Connect",
        description: "Building MOUs and live-project pipelines with industry.",
        topics: ["MOU drafting", "Capstone sponsorship", "Internship pipelines"],
      },
    ],
  },
];

export const findCourse = (courseId) => COURSES.find((c) => c.id === courseId) || null;

export const findModule = (courseId, moduleId) => {
  const course = findCourse(courseId);
  if (!course) return { course: null, module: null };
  const module = course.modules.find((m) => m.id === moduleId) || null;
  return { course, module };
};

// Builds a compact context string for the AI tutor system prompt so the
// chat answers feel grounded in the actual catalog rather than generic.
export const buildCourseContext = () => {
  const lines = COURSES.map((c) => {
    const mods = c.modules.map((m) => m.title).join(", ");
    return `- ${c.title} (${c.level}, ${c.duration}): ${mods}`;
  });
  return [
    "You are an AI tutor for the HireAssist learning platform.",
    "Help students understand course material clearly and concisely.",
    "If a question maps to one of the modules below, ground the answer in that module's scope.",
    "If the topic is outside the catalog, answer briefly and note it isn't part of the listed courses.",
    "",
    "Course catalog:",
    ...lines,
  ].join("\n");
};
