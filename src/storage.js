const KEY = "hisabati-save-v9";

export const SUBSKILLS = {
  addition: [
    "basic facts",
    "two-digit addition",
    "regrouping"
  ],

  subtraction: [
    "basic facts",
    "two-digit subtraction",
    "regrouping"
  ],

  multiplication: [
    "basic facts",
    "two-digit × one-digit",
    "larger multiplication"
  ],

  division: [
    "fact families",
    "exact division",
    "larger division"
  ],

  decimals: [
    "decimal addition",
    "decimal subtraction",
    "place value"
  ],

  fractions: [
    "fraction to decimal",
    "equivalent fractions",
    "fraction operations"
  ],

  algebra: [
    "one-step equations",
    "two-step equations",
    "equation fluency"
  ]
};

const makeProfile = () =>
  Object.fromEntries(
    Object.entries(SUBSKILLS).flatMap(
      ([skill, names]) =>
        names.map((name) => [
          `${skill}:${name}`,
          {
            skill,
            name,
            level: 1,
            attempts: 0,
            correct: 0
          }
        ])
    )
  );

function today() {
  return new Date()
    .toISOString()
    .slice(0, 10);
}

export const DEFAULT = {
  course: "arithmetic",

  stage: 1,

  encounter: 1,

  xp: 0,

  coins: 0,

  lives: 3,

  livesRecoveryAt: null,

  streak: 0,

  bestStreak: 0,

  total: 0,

  correct: 0,

  stageTotal: 0,

  stageCorrect: 0,

  levelsCompleted: 0,

  bossesDefeated: 0,

  achievements: [],

  daily: {
    date: today(),
    completed: false,
    correct: 0,
    total: 0,
    streak: 0,
    bestStreak: 0
  },

  stats: {
    totalCoinsEarned: 0,
    totalXpEarned: 0,
    totalDailyChallenges: 0
  },

  skills: {
    addition: 1,
    subtraction: 1,
    multiplication: 1,
    division: 1,
    decimals: 1,
    fractions: 1,
    algebra: 1
  },

  subskills: makeProfile(),

  recentResults: []
};

export function load() {
  try {
    const raw =
      localStorage.getItem(KEY);

    if (!raw) {
      return structuredClone(
        DEFAULT
      );
    }

    const saved =
      JSON.parse(raw);

    return merge(saved);
  } catch {
    return structuredClone(
      DEFAULT
    );
  }
}

function merge(saved) {
  const base =
    structuredClone(DEFAULT);

  const state = {
    ...base,

    ...saved,

    daily: {
      ...base.daily,
      ...(saved.daily ?? {})
    },

    stats: {
      ...base.stats,
      ...(saved.stats ?? {})
    },

    skills: {
      ...base.skills,
      ...(saved.skills ?? {})
    },

    subskills: {
      ...base.subskills,
      ...(saved.subskills ?? {})
    },

    achievements:
      Array.isArray(
        saved.achievements
      )
        ? saved.achievements
        : [],

    recentResults:
      Array.isArray(
        saved.recentResults
      )
        ? saved.recentResults.slice(
            -20
          )
        : []
  };

  if (
    !Number.isInteger(
      state.stage
    ) ||
    state.stage < 1
  ) {
    state.stage = 1;
  }

  if (
    !Number.isInteger(
      state.encounter
    ) ||
    state.encounter < 1
  ) {
    state.encounter = 1;
  }

  state.lives =
    Math.max(
      0,
      Math.min(
        3,
        Number(state.lives) || 3
      )
    );

  state.coins =
    Math.max(
      0,
      Number(state.coins) || 0
    );

  if (
    state.livesRecoveryAt !==
      null &&
    (
      !Number.isFinite(
        Number(
          state.livesRecoveryAt
        )
      ) ||
      Number(
        state.livesRecoveryAt
      ) <= 0
    )
  ) {
    state.livesRecoveryAt =
      null;
  }

  const currentDate =
    today();

  if (
    state.daily.date !==
    currentDate
  ) {
    state.daily = {
      ...structuredClone(
        base.daily
      ),

      date: currentDate,

      streak:
        state.daily.streak ??
        0,

      bestStreak:
        state.daily.bestStreak ??
        0
    };
  }

  return state;
}

export function save(state) {
  localStorage.setItem(
    KEY,
    JSON.stringify(state)
  );
}

export function reset() {
  localStorage.removeItem(KEY);

  return structuredClone(
    DEFAULT
  );
}

export function getToday() {
  return today();
}