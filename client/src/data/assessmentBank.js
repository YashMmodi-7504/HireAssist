// Mock MCQ bank for the assessment engine.
//
// Questions are keyed by `${subjectId}::${level}` and the runner pulls the
// full pool for that key (no subtopic filtering yet — subtopic is captured
// for analytics but doesn't narrow the question set in this build). To
// scale up later: add more questions per slot, or split keys by subtopic.
//
// Question shape:
//   { id: string, question: string, options: string[4], correctAnswer: 0|1|2|3, explanation?: string }

export const SUBJECTS = [
  {
    id: "dsa",
    name: "DSA",
    accent: "from-purple-500 to-indigo-500",
    subtopics: ["Arrays", "Linked Lists", "Trees & Graphs"],
  },
  {
    id: "python",
    name: "Python",
    accent: "from-blue-500 to-cyan-500",
    subtopics: ["Basics", "OOP", "Functions"],
  },
  {
    id: "web-dev",
    name: "Web Development",
    accent: "from-emerald-500 to-teal-500",
    subtopics: ["HTML", "CSS", "JavaScript"],
  },
];

export const LEVELS = [
  { id: "easy", name: "Easy", description: "Warm-up fundamentals" },
  { id: "intermediate", name: "Intermediate", description: "Working knowledge" },
  { id: "hard", name: "Hard", description: "Production-grade depth" },
];

// ─── DSA ─────────────────────────────────────────────────────────────────
const DSA_EASY = [
  {
    id: "dsa-e-1",
    question: "What is the time complexity of accessing an element in an array by index?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctAnswer: 0,
    explanation: "Array indexing is constant-time — the address is computed directly.",
  },
  {
    id: "dsa-e-2",
    question: "Which data structure uses LIFO ordering?",
    options: ["Queue", "Stack", "Heap", "Linked List"],
    correctAnswer: 1,
    explanation: "Stack = Last In, First Out. Last pushed element is the first popped.",
  },
  {
    id: "dsa-e-3",
    question: "What is the worst-case time complexity of linear search?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correctAnswer: 2,
  },
  {
    id: "dsa-e-4",
    question: "A queue follows which order?",
    options: ["LIFO", "FIFO", "Random", "Sorted"],
    correctAnswer: 1,
  },
  {
    id: "dsa-e-5",
    question: "Which of these is NOT a linear data structure?",
    options: ["Array", "Linked List", "Tree", "Queue"],
    correctAnswer: 2,
    explanation: "Trees are hierarchical, not linear.",
  },
  {
    id: "dsa-e-6",
    question: "Inserting at the head of a singly linked list takes:",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctAnswer: 0,
  },
];

const DSA_INTERMEDIATE = [
  {
    id: "dsa-i-1",
    question: "What is the average-case time complexity of QuickSort?",
    options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
    correctAnswer: 1,
  },
  {
    id: "dsa-i-2",
    question: "Which traversal visits the root node last?",
    options: ["Pre-order", "In-order", "Post-order", "Level-order"],
    correctAnswer: 2,
  },
  {
    id: "dsa-i-3",
    question: "A binary heap is typically implemented using:",
    options: ["Linked list", "Array", "Hash map", "Tree of pointers"],
    correctAnswer: 1,
    explanation: "Heaps are commonly stored in an array — children of node i are at 2i+1 and 2i+2.",
  },
  {
    id: "dsa-i-4",
    question: "Hash map lookup is on average:",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctAnswer: 0,
  },
  {
    id: "dsa-i-5",
    question: "Which algorithm finds shortest paths from a single source with non-negative weights?",
    options: ["DFS", "BFS", "Dijkstra", "Bellman-Ford"],
    correctAnswer: 2,
  },
  {
    id: "dsa-i-6",
    question: "Worst-case time complexity of inserting into an unbalanced BST is:",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correctAnswer: 2,
    explanation: "Degenerate (skewed) BST behaves like a linked list.",
  },
];

const DSA_HARD = [
  {
    id: "dsa-h-1",
    question: "Which algorithm has the best average-case time for finding the k-th smallest element?",
    options: ["Bubble Sort then index", "Quickselect", "Merge Sort then index", "Linear Search"],
    correctAnswer: 1,
    explanation: "Quickselect runs in O(n) average time.",
  },
  {
    id: "dsa-h-2",
    question: "Time complexity of building a heap from an unsorted array of n elements:",
    options: ["O(n log n)", "O(n)", "O(n²)", "O(log n)"],
    correctAnswer: 1,
    explanation: "Bottom-up heapify is linear.",
  },
  {
    id: "dsa-h-3",
    question: "Which graph algorithm detects negative cycles?",
    options: ["Dijkstra", "Floyd-Warshall", "Bellman-Ford", "Prim"],
    correctAnswer: 2,
  },
  {
    id: "dsa-h-4",
    question: "Tarjan's algorithm finds:",
    options: ["Shortest paths", "Minimum spanning tree", "Strongly connected components", "Topological sort"],
    correctAnswer: 2,
  },
  {
    id: "dsa-h-5",
    question: "Best-case complexity of Insertion Sort on a nearly-sorted array:",
    options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
    correctAnswer: 0,
  },
  {
    id: "dsa-h-6",
    question: "Which structure supports O(log n) insert AND O(1) find-min?",
    options: ["BST", "Hash map", "Min-heap", "Linked list"],
    correctAnswer: 2,
  },
];

// ─── Python ──────────────────────────────────────────────────────────────
const PY_EASY = [
  {
    id: "py-e-1",
    question: "Which keyword defines a function in Python?",
    options: ["function", "def", "fn", "lambda"],
    correctAnswer: 1,
  },
  {
    id: "py-e-2",
    question: "What is the output of `len([1, 2, 3])`?",
    options: ["2", "3", "4", "Error"],
    correctAnswer: 1,
  },
  {
    id: "py-e-3",
    question: "Which of these is a mutable type?",
    options: ["tuple", "string", "list", "frozenset"],
    correctAnswer: 2,
  },
  {
    id: "py-e-4",
    question: "How do you write a single-line comment in Python?",
    options: ["// comment", "# comment", "/* comment */", "<!-- comment -->"],
    correctAnswer: 1,
  },
  {
    id: "py-e-5",
    question: "What does `range(3)` produce?",
    options: ["[0, 1, 2]", "[1, 2, 3]", "[0, 1, 2, 3]", "[3]"],
    correctAnswer: 0,
    explanation: "range(3) yields 0, 1, 2 — exclusive upper bound.",
  },
  {
    id: "py-e-6",
    question: "Which operator is used for exponentiation?",
    options: ["^", "**", "//", "exp"],
    correctAnswer: 1,
  },
];

const PY_INTERMEDIATE = [
  {
    id: "py-i-1",
    question: "What does `*args` allow a function to accept?",
    options: ["Keyword arguments", "Variable number of positional arguments", "A single tuple", "A typed argument"],
    correctAnswer: 1,
  },
  {
    id: "py-i-2",
    question: "List comprehension `[x*2 for x in range(3)]` produces:",
    options: ["[0, 2, 4]", "[2, 4, 6]", "[0, 1, 2]", "Error"],
    correctAnswer: 0,
  },
  {
    id: "py-i-3",
    question: "Which method is called when an object is created in Python?",
    options: ["__new__", "__init__", "__create__", "__call__"],
    correctAnswer: 1,
  },
  {
    id: "py-i-4",
    question: "What is the output of `'hello'.upper()`?",
    options: ["Hello", "HELLO", "hello", "Error"],
    correctAnswer: 1,
  },
  {
    id: "py-i-5",
    question: "Which decorator converts a method into a class method?",
    options: ["@staticmethod", "@classmethod", "@property", "@method"],
    correctAnswer: 1,
  },
  {
    id: "py-i-6",
    question: "What does `dict.get('key', 'default')` return when 'key' is missing?",
    options: ["None", "An error", "'default'", "An empty string"],
    correctAnswer: 2,
  },
];

const PY_HARD = [
  {
    id: "py-h-1",
    question: "What is the GIL in CPython?",
    options: [
      "A package manager",
      "A garbage collector flag",
      "A mutex that allows only one thread to execute Python bytecode at a time",
      "A type-checker",
    ],
    correctAnswer: 2,
  },
  {
    id: "py-h-2",
    question: "Which statement about Python generators is TRUE?",
    options: [
      "They store all values in memory",
      "They yield values lazily one at a time",
      "They cannot be iterated",
      "They are always faster than list comprehensions",
    ],
    correctAnswer: 1,
  },
  {
    id: "py-h-3",
    question: "What does `__slots__` do in a class?",
    options: [
      "Defines abstract methods",
      "Restricts attributes and reduces memory usage",
      "Marks the class as final",
      "Creates a singleton",
    ],
    correctAnswer: 1,
  },
  {
    id: "py-h-4",
    question: "Which expression creates a shallow copy of a list `lst`?",
    options: ["copy.deepcopy(lst)", "lst[:]", "list.new(lst)", "lst.clone()"],
    correctAnswer: 1,
  },
  {
    id: "py-h-5",
    question: "Diamond inheritance in Python is resolved using:",
    options: ["Random ordering", "Depth-first only", "C3 linearization (MRO)", "Compile-time errors"],
    correctAnswer: 2,
  },
  {
    id: "py-h-6",
    question: "`async def` without `await` inside results in:",
    options: [
      "A SyntaxError",
      "A coroutine that runs synchronously when awaited",
      "A regular function",
      "A generator",
    ],
    correctAnswer: 1,
  },
];

// ─── Web Development ─────────────────────────────────────────────────────
const WEB_EASY = [
  {
    id: "web-e-1",
    question: "Which HTML tag is used for the largest heading?",
    options: ["<h6>", "<head>", "<h1>", "<header>"],
    correctAnswer: 2,
  },
  {
    id: "web-e-2",
    question: "Which CSS property changes text color?",
    options: ["text-color", "font-color", "color", "foreground"],
    correctAnswer: 2,
  },
  {
    id: "web-e-3",
    question: "Which keyword declares a block-scoped variable in JavaScript?",
    options: ["var", "let", "static", "fn"],
    correctAnswer: 1,
  },
  {
    id: "web-e-4",
    question: "What does CSS stand for?",
    options: [
      "Computer Style Sheets",
      "Cascading Style Sheets",
      "Creative Style System",
      "Cascading Script Source",
    ],
    correctAnswer: 1,
  },
  {
    id: "web-e-5",
    question: "Which HTML attribute supplies an image's fallback text?",
    options: ["title", "alt", "src", "caption"],
    correctAnswer: 1,
  },
  {
    id: "web-e-6",
    question: "Which selector targets an element with id=\"main\"?",
    options: [".main", "#main", "*main", "main"],
    correctAnswer: 1,
  },
];

const WEB_INTERMEDIATE = [
  {
    id: "web-i-1",
    question: "Which display value enables a flex container?",
    options: ["block", "inline-block", "flex", "grid"],
    correctAnswer: 2,
  },
  {
    id: "web-i-2",
    question: "What does `===` check in JavaScript?",
    options: [
      "Value only",
      "Value and type without coercion",
      "Reference identity only",
      "Whether two objects are deeply equal",
    ],
    correctAnswer: 1,
  },
  {
    id: "web-i-3",
    question: "What does CSS `position: sticky` do?",
    options: [
      "Removes the element from layout flow",
      "Pins the element relative to the nearest scrolling ancestor when crossing a threshold",
      "Anchors the element to the bottom of the viewport",
      "Same as fixed",
    ],
    correctAnswer: 1,
  },
  {
    id: "web-i-4",
    question: "Which method returns a Promise that resolves with the JSON body?",
    options: ["fetch().text()", "fetch().json()", "fetch().body()", "fetch().parse()"],
    correctAnswer: 1,
  },
  {
    id: "web-i-5",
    question: "Which array method returns a new array of transformed elements?",
    options: ["forEach", "map", "filter", "reduce"],
    correctAnswer: 1,
  },
  {
    id: "web-i-6",
    question: "Which HTTP status code indicates a successful resource creation?",
    options: ["200", "201", "204", "301"],
    correctAnswer: 1,
  },
];

const WEB_HARD = [
  {
    id: "web-h-1",
    question: "What is the event loop responsible for in JavaScript?",
    options: [
      "Compiling the source code",
      "Coordinating the call stack with the task and microtask queues",
      "Garbage collecting unused variables",
      "Running multiple threads in parallel",
    ],
    correctAnswer: 1,
  },
  {
    id: "web-h-2",
    question: "Which is TRUE about React's `useEffect` cleanup function?",
    options: [
      "It runs only on unmount",
      "It runs before the next effect and on unmount",
      "It runs synchronously during render",
      "It runs only on the first render",
    ],
    correctAnswer: 1,
  },
  {
    id: "web-h-3",
    question: "What is the purpose of the `key` prop in React lists?",
    options: [
      "Apply CSS classes",
      "Identify items so React can match them across renders",
      "Set focus order",
      "Pass authentication tokens",
    ],
    correctAnswer: 1,
  },
  {
    id: "web-h-4",
    question: "Which HTTP method is idempotent?",
    options: ["POST", "PUT", "PATCH", "CONNECT"],
    correctAnswer: 1,
    explanation: "PUT replaces the resource — calling it multiple times yields the same final state.",
  },
  {
    id: "web-h-5",
    question: "What does CORS protect against?",
    options: [
      "SQL injection",
      "Cross-origin requests reading sensitive responses without permission",
      "Cross-site scripting",
      "Brute force attacks",
    ],
    correctAnswer: 1,
  },
  {
    id: "web-h-6",
    question: "Which CSS feature prevents layout shift while images load?",
    options: ["aspect-ratio", "object-fit", "image-rendering", "content-visibility"],
    correctAnswer: 0,
  },
];

const QUESTION_BANK = {
  "dsa::easy": DSA_EASY,
  "dsa::intermediate": DSA_INTERMEDIATE,
  "dsa::hard": DSA_HARD,
  "python::easy": PY_EASY,
  "python::intermediate": PY_INTERMEDIATE,
  "python::hard": PY_HARD,
  "web-dev::easy": WEB_EASY,
  "web-dev::intermediate": WEB_INTERMEDIATE,
  "web-dev::hard": WEB_HARD,
};

const shuffle = (arr) => {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

/**
 * Pull a randomized question set for a given subject/level pair.
 * Returns the entire pool shuffled (no synthetic repetition — keeps every
 * test honest). Caller can decide how many to display.
 */
export const sampleQuestions = (subjectId, level) => {
  const key = `${subjectId}::${level}`;
  const pool = QUESTION_BANK[key];
  return pool ? shuffle(pool) : [];
};

export const findSubject = (subjectId) =>
  SUBJECTS.find((s) => s.id === subjectId) || null;

export const findLevel = (levelId) =>
  LEVELS.find((l) => l.id === levelId) || null;
