export const ARITHMETIC_LEVELS = [
  // ─────────────────────────────
  // CHAPTER 1
  // ─────────────────────────────

  {
    id: 1,
    chapter: 1,
    chapterName: "Number Foundations",
    name: "First Steps",
    description:
      "Build confidence with the numbers you use every day.",
    focus: [
      "addition",
      "subtraction"
    ],
    difficulty: 1,
    boss: false
  },

  {
    id: 2,
    chapter: 1,
    chapterName: "Number Foundations",
    name: "Number Trail",
    description:
      "Move beyond the basics with larger calculations.",
    focus: [
      "addition",
      "subtraction"
    ],
    difficulty: 1,
    boss: false
  },

  {
    id: 3,
    chapter: 1,
    chapterName: "Number Foundations",
    name: "Multiplication Pass",
    description:
      "Strengthen multiplication and division fluency.",
    focus: [
      "multiplication",
      "division"
    ],
    difficulty: 2,
    boss: false
  },

  {
    id: 4,
    chapter: 1,
    chapterName: "Number Foundations",
    name: "Mixed Numbers",
    description:
      "Combine the core number skills you have developed.",
    focus: [
      "addition",
      "subtraction",
      "multiplication",
      "division"
    ],
    difficulty: 2,
    boss: false
  },

  {
    id: 5,
    chapter: 1,
    chapterName: "Number Foundations",
    name: "The Number Keeper",
    description:
      "A major test of your number foundations.",
    focus: [
      "addition",
      "subtraction",
      "multiplication",
      "division"
    ],
    difficulty: 3,
    boss: true,
    bossName: "The Number Keeper",
    bossTarget: 6,
    bossQuestions: 8
  },

  // ─────────────────────────────
  // CHAPTER 2
  // ─────────────────────────────

  {
    id: 6,
    chapter: 2,
    chapterName: "Decimals & Fractions",
    name: "Decimal Crossing",
    description:
      "Move confidently between whole numbers and decimals.",
    focus: [
      "decimals",
      "multiplication"
    ],
    difficulty: 3,
    boss: false
  },

  {
    id: 7,
    chapter: 2,
    chapterName: "Decimals & Fractions",
    name: "Fraction Gate",
    description:
      "Connect fractions, decimals and parts of a whole.",
    focus: [
      "fractions",
      "decimals"
    ],
    difficulty: 3,
    boss: false
  },

  {
    id: 8,
    chapter: 2,
    chapterName: "Decimals & Fractions",
    name: "Equation Pass",
    description:
      "Begin working confidently with unknown values.",
    focus: [
      "algebra",
      "fractions",
      "decimals"
    ],
    difficulty: 4,
    boss: false
  },

  {
    id: 9,
    chapter: 2,
    chapterName: "Decimals & Fractions",
    name: "Summit Approach",
    description:
      "Bring several mathematical skills together.",
    focus: [
      "fractions",
      "algebra",
      "decimals",
      "multiplication",
      "division"
    ],
    difficulty: 4,
    boss: false
  },

  {
    id: 10,
    chapter: 2,
    chapterName: "Decimals & Fractions",
    name: "The Summit Trial",
    description:
      "A major trial combining the skills from this chapter.",
    focus: [
      "fractions",
      "algebra",
      "decimals",
      "multiplication",
      "division"
    ],
    difficulty: 5,
    boss: true,
    bossName: "The Summit Trial",
    bossTarget: 7,
    bossQuestions: 10
  },

  // ─────────────────────────────
  // CHAPTER 3
  // ─────────────────────────────

  {
    id: 11,
    chapter: 3,
    chapterName: "Advanced Arithmetic",
    name: "Number Forge",
    description:
      "Push your calculation skills further.",
    focus: [
      "multiplication",
      "division",
      "decimals"
    ],
    difficulty: 5,
    boss: false
  },

  {
    id: 12,
    chapter: 3,
    chapterName: "Advanced Arithmetic",
    name: "Ratio Road",
    description:
      "Work with relationships between numbers.",
    focus: [
      "fractions",
      "decimals",
      "division"
    ],
    difficulty: 5,
    boss: false
  },

  {
    id: 13,
    chapter: 3,
    chapterName: "Advanced Arithmetic",
    name: "Pattern Ridge",
    description:
      "Recognise patterns and mathematical relationships.",
    focus: [
      "multiplication",
      "division",
      "algebra"
    ],
    difficulty: 6,
    boss: false
  },

  {
    id: 14,
    chapter: 3,
    chapterName: "Advanced Arithmetic",
    name: "The Final Gate",
    description:
      "Prepare for the next major arithmetic challenge.",
    focus: [
      "fractions",
      "decimals",
      "algebra",
      "multiplication",
      "division"
    ],
    difficulty: 6,
    boss: false
  },

  {
    id: 15,
    chapter: 3,
    chapterName: "Advanced Arithmetic",
    name: "The Arithmetic Warden",
    description:
      "Face a demanding test of arithmetic mastery.",
    focus: [
      "fractions",
      "decimals",
      "algebra",
      "multiplication",
      "division"
    ],
    difficulty: 7,
    boss: true,
    bossName: "The Arithmetic Warden",
    bossTarget: 8,
    bossQuestions: 12
  }
];

export function getLevel(id) {
  return (
    ARITHMETIC_LEVELS.find(
      (level) => level.id === id
    ) ?? ARITHMETIC_LEVELS[0]
  );
}