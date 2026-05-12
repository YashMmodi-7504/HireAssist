// Persistence layer for assessment attempts. Stores everything in
// localStorage under a single key — swap implementation later if/when a
// real backend lands without changing call sites.

const STORAGE_KEY = "hireassist:assessment:results";
const MAX_RESULTS = 50;

/**
 * Result shape:
 *   {
 *     id: string,
 *     subjectId: string,
 *     subjectName: string,
 *     subtopic: string,
 *     level: string,           // "easy" | "intermediate" | "hard"
 *     score: number,           // correct answers
 *     total: number,           // questions in the test
 *     percentage: number,      // 0..100
 *     answers: { [questionId]: number }, // selected option index per question
 *     questionIds: string[],   // ordered ids the test served
 *     durationMs: number,
 *     completedAt: number,     // epoch ms
 *   }
 */

const safeParse = (raw) => {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const loadResults = () => {
  try {
    return safeParse(localStorage.getItem(STORAGE_KEY));
  } catch {
    return [];
  }
};

export const saveResult = (result) => {
  try {
    const list = loadResults();
    const next = [result, ...list].slice(0, MAX_RESULTS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  } catch {
    /* quota / disabled storage — silent no-op */
    return loadResults();
  }
};

export const clearResults = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
};

/**
 * Aggregate insights from the results history — used by the dashboard
 * "weak areas" / "recommended" sections later.
 */
export const summarize = (results = loadResults()) => {
  if (!results.length) {
    return { totalAttempts: 0, averageScore: 0, weakSubjects: [], strongest: null };
  }
  const totalAttempts = results.length;
  const averageScore = Math.round(
    results.reduce((s, r) => s + (r.percentage || 0), 0) / totalAttempts
  );

  // Group by subject and compute average per subject.
  const bySubject = new Map();
  for (const r of results) {
    const key = r.subjectId;
    if (!bySubject.has(key)) {
      bySubject.set(key, { subjectId: key, subjectName: r.subjectName, attempts: 0, sum: 0 });
    }
    const agg = bySubject.get(key);
    agg.attempts += 1;
    agg.sum += r.percentage || 0;
  }
  const subjectAverages = [...bySubject.values()].map((s) => ({
    ...s,
    average: Math.round(s.sum / s.attempts),
  }));

  const weakSubjects = subjectAverages
    .filter((s) => s.average < 70)
    .sort((a, b) => a.average - b.average);
  const strongest = [...subjectAverages].sort((a, b) => b.average - a.average)[0] || null;

  return { totalAttempts, averageScore, weakSubjects, strongest };
};

/**
 * Aggregate by difficulty level — returns an ordered array of
 * { level, attempts, average }. Always returns all three levels
 * (easy / intermediate / hard) so the UI can show empty rows too.
 */
export const summarizeByLevel = (results = loadResults()) => {
  const order = ["easy", "intermediate", "hard"];
  const labels = { easy: "Easy", intermediate: "Intermediate", hard: "Hard" };
  const buckets = new Map(order.map((l) => [l, { sum: 0, attempts: 0 }]));

  for (const r of results) {
    const b = buckets.get(r.level);
    if (b) {
      b.attempts += 1;
      b.sum += r.percentage || 0;
    }
  }

  return order.map((level) => {
    const b = buckets.get(level);
    return {
      level,
      label: labels[level],
      attempts: b.attempts,
      average: b.attempts > 0 ? Math.round(b.sum / b.attempts) : null,
    };
  });
};
