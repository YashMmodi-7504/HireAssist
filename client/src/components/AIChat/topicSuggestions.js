// Topic-aware follow-up generator. Given the AI's last reply text, returns
// three categories of follow-up suggestions:
//   - continueLearning : tailored conceptual next steps for the topic
//   - practice         : quiz/practice prompts (templated from the topic label)
//   - interview        : interview-ready prompts (templated from the topic label)
//
// Detection is keyword-based and matched in priority order — the first
// regex that hits wins, so put more specific topics earlier.

const TOPIC_RULES = [
  {
    label: "Deep Learning",
    match: /\b(neural network|deep learning|cnn|rnn|backprop|gradient descent|tensorflow|pytorch)\b/i,
    continueLearning: [
      "What is a Neural Network?",
      "Difference between ML and DL?",
      "Real-world uses of Deep Learning",
    ],
  },
  {
    label: "Machine Learning",
    match: /\b(supervised|unsupervised|reinforcement|machine learning|model training|overfitting|classification|regression)\b/i,
    continueLearning: [
      "Explain Reinforcement Learning",
      "What is overfitting?",
      "How is a model evaluated?",
    ],
  },
  {
    label: "Edge AI",
    match: /\b(edge ai|raspberry pi|jetson|tinyml|on-device|model optimi[sz]ation|quantization)\b/i,
    continueLearning: [
      "Why deploy AI on edge devices?",
      "How does model quantization work?",
      "Compare Raspberry Pi vs Jetson Nano",
    ],
  },
  {
    label: "SAP",
    match: /\b(sap|s\/4hana|abap|fiori|hana)\b/i,
    continueLearning: [
      "Explain SAP S/4HANA",
      "What is ABAP used for?",
      "How does AI integrate with SAP?",
    ],
  },
  {
    label: "DSA",
    match: /\b(data structure|algorithm|big[- ]?o|complexity|array|linked list|tree|graph|sorting|hash map|recursion)\b/i,
    continueLearning: [
      "Explain Time Complexity simply",
      "Arrays vs Linked Lists?",
      "When should I use a hash map?",
    ],
  },
  {
    label: "Resume",
    match: /\b(resume|cv|cover letter)\b/i,
    continueLearning: [
      "Show a strong resume template",
      "Common mistakes in resumes",
      "How do I pass an ATS scan?",
    ],
  },
  {
    label: "Interview Prep",
    match: /\b(interview|hr round|behavioral|technical round|mock interview)\b/i,
    continueLearning: [
      "Top behavioral interview questions",
      "How to answer 'Tell me about yourself'",
      "Tips for technical interviews",
    ],
  },
  {
    label: "Communication Skills",
    match: /\b(communication|soft skill|presentation|public speaking)\b/i,
    continueLearning: [
      "How to improve communication skills?",
      "Tips for technical presentations",
      "Email etiquette for the workplace",
    ],
  },
  {
    label: "Programming",
    match: /\b(python|javascript|js|oop|object-oriented|class|inherit|polymorphism)\b/i,
    continueLearning: [
      "Python vs JavaScript — which first?",
      "Explain OOP with an example",
      "What is inheritance?",
    ],
  },
  {
    label: "Web Development",
    match: /\b(html|css|web development|react|dom|flexbox|grid|responsive)\b/i,
    continueLearning: [
      "Flexbox vs Grid — when to use each?",
      "Explain the DOM simply",
      "How do I make a site responsive?",
    ],
  },
  {
    label: "Git",
    match: /\b(git|github|version control|branch|merge|pull request|commit)\b/i,
    continueLearning: [
      "Explain Git branches simply",
      "How do I resolve a merge conflict?",
      "What is a pull request workflow?",
    ],
  },
];

const FALLBACK = {
  label: "this topic",
  continueLearning: [
    "Explain that more simply",
    "Give a real-world example",
    "What should I learn next?",
  ],
};

const detect = (text) => {
  if (!text) return FALLBACK;
  for (const rule of TOPIC_RULES) {
    if (rule.match.test(text)) return rule;
  }
  return FALLBACK;
};

// Continue-learning only — kept for backward compat with single-section usage.
export const topicSuggestions = (text = "") => detect(text).continueLearning;

// Three progressive categories. The Practice and Interview sets are
// templated from the detected topic's human-friendly label so any topic
// can produce sensible quiz/interview follow-ups without authoring 33 sets.
export const topicCategories = (text = "") => {
  const t = detect(text);
  return {
    label: t.label,
    continueLearning: t.continueLearning,
    practice: [
      `Quiz me on ${t.label}`,
      `Show practice problems for ${t.label}`,
      `Test my understanding of ${t.label}`,
    ],
    interview: [
      `Top interview questions on ${t.label}`,
      `Common ${t.label} interview mistakes`,
      `Mock interview on ${t.label}`,
    ],
  };
};

export const HERO_SUGGESTIONS = [
  "Explain Deep Learning simply",
  "What is DSA?",
  "Help me build a resume",
  "How to prepare for interviews",
];
