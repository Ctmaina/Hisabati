const KEY = "hisabati-save-v9";

/*
 * These names MUST match the subskills used by questions.js.
 */
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


/*
 * Create the adaptive-learning profile.
 *
 * Every subskill gets:
 * - skill
 * - name
 * - level
 * - attempts
 * - correct
 */
function makeSubskillProfile() {
  return Object.fromEntries(
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
}


/*
 * Use the user's local calendar date.
 */
function today() {
  const now = new Date();

  return `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}-${String(
    now.getDate()
  ).padStart(2, "0")}`;
}


/*
 * Fresh Hisabati state.
 */
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

  profile: {
    name: "",
    createdAt: null,
    updatedAt: null
  },

  daily: {
    date: today(),
    completed: false,
    correct: 0,
    total: 0,
    streak: 0,
    bestStreak: 0,
    lastCompletedDate: null
  },

  stats: {
    totalXpEarned: 0,
    totalCoinsEarned: 0,
    totalDailyChallenges: 0
  },

  skills: {
    addition: 1,
    subtraction: 1,
    multiplication: 1,
    division: 1,
    fractions: 1,
    decimals: 1,
    algebra: 1
  },

  subskills: makeSubskillProfile(),

  achievements: [],

  recentResults: []
};


/*
 * Create a completely independent copy
 * of the default state.
 */
function cloneDefault() {
  return structuredClone(DEFAULT);
}


/*
 * Merge saved data with the newest state structure.
 *
 * This is important because users may already have
 * an older Hisabati save in localStorage.
 */
function merge(saved) {
  const base = cloneDefault();

  if (!saved || typeof saved !== "object") {
    return base;
  }

  const oldProfile =
    saved.profile &&
    typeof saved.profile === "object"
      ? saved.profile
      : {};

  const name = String(
    oldProfile.name ?? ""
  )
    .trim()
    .slice(0, 24);

  /*
   * Start with the current state structure.
   */
  const state = {
    ...base,
    ...saved,

    profile: {
      ...base.profile,
      ...oldProfile,

      name,

      createdAt:
        oldProfile.createdAt ??
        (name
          ? new Date().toISOString()
          : null),

      updatedAt:
        oldProfile.updatedAt ?? null
    },

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

    /*
     * IMPORTANT:
     *
     * Start with the current subskill structure.
     * This guarantees all subskills required by
     * questions.js exist.
     */
    subskills: {
      ...base.subskills,
      ...(saved.subskills ?? {})
    },

    achievements:
      Array.isArray(saved.achievements)
        ? saved.achievements
        : [],

    recentResults:
      Array.isArray(saved.recentResults)
        ? saved.recentResults.slice(-20)
        : []
  };


  /*
   * Validate stage.
   */
  state.stage =
    Number.isInteger(state.stage) &&
    state.stage >= 1
      ? state.stage
      : 1;


  /*
   * Validate encounter.
   */
  state.encounter =
    Number.isInteger(state.encounter) &&
    state.encounter >= 1
      ? state.encounter
      : 1;


  /*
   * Validate lives.
   */
  state.lives = Math.max(
    0,
    Math.min(
      3,
      Number(state.lives) || 3
    )
  );


  /*
   * Validate XP.
   */
  state.xp = Math.max(
    0,
    Number(state.xp) || 0
  );


  /*
   * Validate coins.
   */
  state.coins = Math.max(
    0,
    Number(state.coins) || 0
  );


  /*
   * Validate streak values.
   */
  state.streak = Math.max(
    0,
    Number(state.streak) || 0
  );

  state.bestStreak = Math.max(
    0,
    Number(state.bestStreak) || 0
  );


  /*
   * Validate question totals.
   */
  state.total = Math.max(
    0,
    Number(state.total) || 0
  );

  state.correct = Math.max(
    0,
    Number(state.correct) || 0
  );

  state.stageTotal = Math.max(
    0,
    Number(state.stageTotal) || 0
  );

  state.stageCorrect = Math.max(
    0,
    Number(state.stageCorrect) || 0
  );


  /*
   * Validate progression counters.
   */
  state.levelsCompleted = Math.max(
    0,
    Number(state.levelsCompleted) || 0
  );

  state.bossesDefeated = Math.max(
    0,
    Number(state.bossesDefeated) || 0
  );


  /*
   * Validate recovery timestamp.
   */
  if (
    state.livesRecoveryAt !== null &&
    (
      !Number.isFinite(
        Number(state.livesRecoveryAt)
      ) ||
      Number(state.livesRecoveryAt) <= 0
    )
  ) {
    state.livesRecoveryAt = null;
  }


  /*
   * Validate statistics.
   */
  state.stats.totalXpEarned = Math.max(
    0,
    Number(
      state.stats.totalXpEarned
    ) || 0
  );

  state.stats.totalCoinsEarned = Math.max(
    0,
    Number(
      state.stats.totalCoinsEarned
    ) || 0
  );

  state.stats.totalDailyChallenges = Math.max(
    0,
    Number(
      state.stats.totalDailyChallenges
    ) || 0
  );


  /*
   * Make sure every current subskill exists.
   *
   * This also repairs saves created by the older
   * subskill naming system.
   */
  for (const [skill, names] of Object.entries(
    SUBSKILLS
  )) {
    for (const name of names) {
      const key = `${skill}:${name}`;

      if (
        !state.subskills[key] ||
        typeof state.subskills[key] !== "object"
      ) {
        state.subskills[key] = {
          skill,
          name,
          level: 1,
          attempts: 0,
          correct: 0
        };
      }

      const item = state.subskills[key];

      item.skill = skill;
      item.name = name;

      item.level = Math.max(
        1,
        Math.min(
          8,
          Number(item.level) || 1
        )
      );

      item.attempts = Math.max(
        0,
        Number(item.attempts) || 0
      );

      item.correct = Math.max(
        0,
        Number(item.correct) || 0
      );
    }
  }


  /*
   * Daily challenge date handling.
   */
  const currentDate = today();

  if (state.daily.date !== currentDate) {
    const previousCompleted =
      state.daily.lastCompletedDate ?? null;

    const previousStreak = Math.max(
      0,
      Number(state.daily.streak) || 0
    );

    const previousBestStreak = Math.max(
      0,
      Number(state.daily.bestStreak) || 0
    );

    state.daily = {
      ...cloneDefault().daily,

      date: currentDate,

      streak: previousStreak,

      bestStreak: previousBestStreak,

      lastCompletedDate:
        previousCompleted
    };
  }


  /*
   * Final daily validation.
   */
  state.daily.correct = Math.max(
    0,
    Number(state.daily.correct) || 0
  );

  state.daily.total = Math.max(
    0,
    Number(state.daily.total) || 0
  );

  state.daily.streak = Math.max(
    0,
    Number(state.daily.streak) || 0
  );

  state.daily.bestStreak = Math.max(
    0,
    Number(state.daily.bestStreak) || 0
  );


  return state;
}


/*
 * Load the saved Hisabati state.
 */
export function load() {
  try {
    const raw =
      localStorage.getItem(KEY);

    if (!raw) {
      return cloneDefault();
    }

    const saved = JSON.parse(raw);

    return merge(saved);
  } catch (error) {
    console.error(
      "Hisabati storage load failed:",
      error
    );

    return cloneDefault();
  }
}


/*
 * Save the current state.
 */
export function save(state) {
  try {
    localStorage.setItem(
      KEY,
      JSON.stringify(state)
    );

    return true;
  } catch (error) {
    console.error(
      "Hisabati storage save failed:",
      error
    );

    return false;
  }
}


/*
 * Reset progress while preserving
 * the clean default structure.
 */
export function reset() {
  const fresh = cloneDefault();

  save(fresh);

  return fresh;
}


/*
 * Return today's local date.
 */
export function getToday() {
  return today();
}