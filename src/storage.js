const KEY = "hisabati-save-v8";

export const SUBSKILLS = {
  addition: ["basic facts", "two-digit addition", "regrouping"],
  subtraction: ["basic facts", "two-digit subtraction", "regrouping"],
  multiplication: ["basic facts", "two-digit × one-digit", "larger multiplication"],
  division: ["fact families", "exact division", "larger division"],
  decimals: ["decimal addition", "decimal subtraction", "place value"],
  fractions: ["fraction to decimal", "equivalent fractions", "fraction operations"],
  algebra: ["one-step equations", "two-step equations", "equation fluency"]
};

const makeProfile = () => Object.fromEntries(
  Object.entries(SUBSKILLS).flatMap(([skill, names]) =>
    names.map((name) => [`${skill}:${name}`, { skill, name, level: 1, attempts: 0, correct: 0 }])
  )
);

export const DEFAULT = {
  stage: 1, xp: 0, coins: 0, lives: 3, streak: 0, bestStreak: 0, total: 0, correct: 0,
  stageTotal: 0, stageCorrect: 0, skills: { addition: 1, subtraction: 1, multiplication: 1, division: 1, decimals: 1, fractions: 1, algebra: 1 },
  subskills: makeProfile(),
  recentResults: []
};

export function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (!saved) return structuredClone(DEFAULT);
    return merge(saved);
  } catch { return structuredClone(DEFAULT); }
}

function merge(saved) {
  return { ...structuredClone(DEFAULT), ...saved,
    skills: { ...DEFAULT.skills, ...(saved.skills ?? {}) },
    subskills: { ...DEFAULT.subskills, ...(saved.subskills ?? {}) },
    recentResults: Array.isArray(saved.recentResults) ? saved.recentResults.slice(-20) : []
  };
}

export function save(state) { localStorage.setItem(KEY, JSON.stringify(state)); }
export function reset() { localStorage.removeItem(KEY); return structuredClone(DEFAULT); }
