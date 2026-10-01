import {
  ARITHMETIC_LEVELS
} from "./data/levels.js";

import {
  COURSES
} from "./courses.js";

import {
  ACHIEVEMENTS
} from "./achievements.js";

import {
  load,
  save,
  reset,
  getToday
} from "./storage.js";

import {
  makeQuestion,
  matches,
  answerText
} from "./questions.js";

export class Game {
  constructor(onChange) {
    this.onChange = onChange;

    this.state = load();

    this.mode = "adventure";

    this.stageComplete = false;

    this.lastResult = null;

    this.completedStage = null;

    this.dailyQuestion = null;

    this.dailyResult = null;

    this.syncDaily();

    this.syncLevel();

    this.newQuestion(false);
  }

  get course() {
    return (
      COURSES.find(
        (course) =>
          course.id ===
          this.state.course
      ) ?? COURSES[0]
    );
  }

  get level() {
    return (
      ARITHMETIC_LEVELS.find(
        (level) =>
          level.id ===
          this.state.stage
      ) ??
      ARITHMETIC_LEVELS[
        ARITHMETIC_LEVELS.length - 1
      ]
    );
  }

  get stage() {
    return this.stageOverride;
  }

  get isBoss() {
    return Boolean(
      this.level?.boss
    );
  }

  get encounterTarget() {
    return this.isBoss
      ? this.level.bossQuestions
      : 5;
  }

  get masteryTarget() {
    return this.isBoss
      ? this.level.bossTarget
      : 4;
  }

  get xpTarget() {
    return (
      100 +
      (this.state.stage - 1) *
        30
    );
  }

  get accuracy() {
    if (!this.state.total) {
      return 0;
    }

    return Math.round(
      (this.state.correct /
        this.state.total) *
        100
    );
  }

  get dailyAccuracy() {
    if (!this.state.daily.total) {
      return 0;
    }

    return Math.round(
      (this.state.daily.correct /
        this.state.daily.total) *
        100
    );
  }

  get mastery() {
    const values =
      Object.values(
        this.state.skills
      );

    if (!values.length) {
      return 0;
    }

    return Math.round(
      (
        values.reduce(
          (sum, value) =>
            sum + value,
          0
        ) /
        (values.length * 8)
      ) * 100
    );
  }

  syncLevel() {
    const level = this.level;

    this.stageOverride = {
      id: level.id,

      world: this.course.name,

      chapter: level.chapter,

      chapterName:
        level.chapterName,

      name: level.name,

      desc: level.description,

      focus: level.focus,

      difficulty:
        level.difficulty,

      boss: Boolean(
        level.boss
      ),

      bossName:
        level.bossName,

      bossTarget:
        level.bossTarget,

      bossQuestions:
        level.bossQuestions
    };
  }

  newQuestion(emit = true) {
    this.syncLevel();

    this.question =
      makeQuestion(
        this.stageOverride,
        this.state.skills,
        this.state.subskills
      );

    if (emit) {
      this.emit();
    }
  }

  answer(raw) {
    if (this.mode === "daily") {
      return this.answerDaily(raw);
    }

    const normalized =
      String(raw)
        .trim()
        .replace(",", ".");

    if (!normalized) {
      return {
        type: "invalid",
        message:
          "Enter an answer first."
      };
    }

    const value =
      Number(normalized);

    if (!Number.isFinite(value)) {
      return {
        type: "invalid",
        message:
          "Enter a valid number. Decimal answers are allowed."
      };
    }

    this.state.total += 1;

    this.state.stageTotal += 1;

    const skill =
      this.question.skill;

    const subskillKey =
      `${skill}:${this.question.subskill}`;

    if (
      matches(
        value,
        this.question
      )
    ) {
      return this.correct(
        skill,
        subskillKey
      );
    }

    return this.wrong(
      skill,
      subskillKey
    );
  }

  correct(
    skill,
    subskillKey
  ) {
    this.state.correct += 1;

    this.state.stageCorrect += 1;

    this.state.streak += 1;

    this.state.bestStreak =
      Math.max(
        this.state.bestStreak,
        this.state.streak
      );

    this.state.skills[skill] =
      Math.min(
        8,
        (this.state.skills[skill] ??
          1) + 0.55
      );

    this.updateSubskill(
      subskillKey,
      true
    );

    const xp =
      15 +
      Math.round(
        this.state.skills[skill] *
          2
      );

    const coins =
      4 +
      Math.min(
        6,
        this.state.streak
      );

    this.addReward(
      xp,
      coins
    );

    this.checkAchievements();

    const result = {
      type: "correct",

      message:
        `Correct. +${xp} XP · +${coins} coins`,

      answer:
        answerText(
          this.question.answer
        ),

      explanation:
        this.question.explanation,

      subskill:
        this.question.subskill
    };

    if (
      this.state.stageCorrect >=
        this.masteryTarget &&
      this.state.stageTotal >=
        this.encounterTarget
    ) {
      this.completeLevel();
    } else {
      this.advanceEncounter();
    }

    this.lastResult = result;

    save(this.state);

    this.emit();

    return result;
  }

  wrong(
    skill,
    subskillKey
  ) {
    this.state.streak = 0;

    this.state.lives -= 1;

    this.state.skills[skill] =
      Math.max(
        1,
        (this.state.skills[skill] ??
          1) - 0.4
      );

    this.updateSubskill(
      subskillKey,
      false
    );

    const result = {
      type: "wrong",

      message:
        `Not quite. The answer is ${answerText(
          this.question.answer
        )}.`,

      answer:
        answerText(
          this.question.answer
        ),

      explanation:
        this.question.explanation,

      subskill:
        this.question.subskill
    };

    if (this.state.lives <= 0) {
      this.state.lives = 3;

      this.state.stageTotal = 0;

      this.state.stageCorrect = 0;

      this.state.encounter = 1;

      result.message +=
        " Lives restored. The challenge restarts.";
    }

    this.advanceEncounter();

    this.lastResult = result;

    save(this.state);

    this.emit();

    return result;
  }

  addReward(
    xp,
    coins
  ) {
    this.state.xp += xp;

    this.state.coins += coins;

    this.state.stats.totalXpEarned +=
      xp;

    this.state.stats.totalCoinsEarned +=
      coins;
  }

  updateSubskill(
    key,
    wasCorrect
  ) {
    const profile =
      this.state.subskills[key];

    if (!profile) {
      return;
    }

    profile.attempts += 1;

    if (wasCorrect) {
      profile.correct += 1;

      profile.level =
        Math.min(
          8,
          profile.level + 0.55
        );
    } else {
      profile.level =
        Math.max(
          1,
          profile.level - 0.5
        );
    }

    this.state.recentResults.push({
      key,
      correct: wasCorrect
    });

    this.state.recentResults =
      this.state.recentResults.slice(
        -20
      );
  }

  advanceEncounter() {
    this.state.encounter =
      (
        this.state.encounter %
        this.encounterTarget
      ) + 1;

    this.newQuestion(false);
  }

  completeLevel() {
    const completed =
      structuredClone(
        this.stageOverride
      );

    this.completedStage =
      completed;

    const boss =
      Boolean(
        completed.boss
      );

    const levelReward =
      boss ? 80 : 40;

    const coinReward =
      boss ? 50 : 25;

    this.addReward(
      levelReward,
      coinReward
    );

    if (boss) {
      this.state.bossesDefeated +=
        1;
    }

    this.state.levelsCompleted +=
      1;

    this.state.lives = 3;

    this.state.stageTotal = 0;

    this.state.stageCorrect = 0;

    this.state.encounter = 1;

    if (
      this.state.stage <
      ARITHMETIC_LEVELS.length
    ) {
      this.state.stage += 1;
    }

    this.checkAchievements();

    this.stageComplete = true;
  }

  revive() {
    if (this.stageComplete) {
      return false;
    }

    if (this.state.lives >= 3) {
      return false;
    }

    const REVIVE_COST = 20;

    if (this.state.coins < REVIVE_COST) {
      return false;
    }

    this.state.coins -= REVIVE_COST;

    this.state.lives = 3;

    save(this.state);

    this.emit();

    return true;
  }

  continue() {
    this.stageComplete = false;

    this.completedStage = null;

    this.lastResult = null;

    this.syncLevel();

    this.newQuestion(false);

    save(this.state);

    this.emit();
  }

  unlock(id) {
    if (
      this.state.achievements.includes(
        id
      )
    ) {
      return false;
    }

    if (
      !ACHIEVEMENTS.some(
        (achievement) =>
          achievement.id === id
      )
    ) {
      return false;
    }

    this.state.achievements.push(id);

    return true;
  }

  checkAchievements() {
    if (this.state.correct >= 1) {
      this.unlock("first-answer");
    }

    if (this.state.streak >= 5) {
      this.unlock("streak-5");
    }

    if (this.state.streak >= 10) {
      this.unlock("streak-10");
    }

    if (this.state.levelsCompleted >= 1) {
      this.unlock("level-1");
    }

    if (this.state.bossesDefeated >= 1) {
      this.unlock("level-5");
    }

    if (this.state.bossesDefeated >= 2) {
      this.unlock("level-10");
    }

    if (this.state.bossesDefeated >= 3) {
      this.unlock("level-15");
    }

    if (this.accuracy >= 80) {
      this.unlock("accuracy-80");
    }

    if (this.state.total >= 50) {
      this.unlock("questions-50");
    }

    if (this.state.total >= 100) {
      this.unlock("questions-100");
    }
  }

  syncDaily() {
    const today = getToday();

    if (this.state.daily.date === today) {
      return;
    }

    const previousCompleted =
      this.state.daily.lastCompletedDate;

    const yesterday = new Date();

    yesterday.setDate(
      yesterday.getDate() - 1
    );

    const yesterdayKey =
      `${yesterday.getFullYear()}-${String(
        yesterday.getMonth() + 1
      ).padStart(2, "0")}-${String(
        yesterday.getDate()
      ).padStart(2, "0")}`;

    const continuingStreak =
      previousCompleted ===
      yesterdayKey;

    this.state.daily = {
      date: today,

      completed: false,

      correct: 0,

      total: 0,

      streak: continuingStreak
        ? this.state.daily.streak ?? 0
        : 0,

      bestStreak:
        this.state.daily.bestStreak ??
        0,

      lastCompletedDate:
        previousCompleted ?? null
    };
  }

  startDaily() {
    this.syncDaily();

    if (this.state.daily.completed) {
      return false;
    }

    this.mode = "daily";

    this.stageComplete = false;

    this.dailyResult = null;

    this.dailyQuestion =
      makeQuestion(
        {
          ...this.level,

          difficulty: Math.min(
            8,
            this.level.difficulty + 1
          )
        },

        this.state.skills,

        this.state.subskills
      );

    this.emit();

    return true;
  }

  answerDaily(raw) {
    if (!this.dailyQuestion) {
      return {
        type: "invalid",
        message:
          "Start the Daily Challenge first."
      };
    }

    const normalized =
      String(raw)
        .trim()
        .replace(",", ".");

    if (!normalized) {
      return {
        type: "invalid",
        message:
          "Enter an answer first."
      };
    }

    const value =
      Number(normalized);

    if (!Number.isFinite(value)) {
      return {
        type: "invalid",
        message:
          "Enter a valid number. Decimal answers are allowed."
      };
    }

    this.state.daily.total += 1;

    const question =
      this.dailyQuestion;

    const subskillKey =
      `${question.skill}:${question.subskill}`;

    const correct =
      matches(
        value,
        question
      );

    if (correct) {
      this.state.daily.correct += 1;

      this.updateSubskill(
        subskillKey,
        true
      );

      this.state.skills[
        question.skill
      ] = Math.min(
        8,
        (
          this.state.skills[
            question.skill
          ] ?? 1
        ) + 0.25
      );
    } else {
      this.updateSubskill(
        subskillKey,
        false
      );

      this.state.skills[
        question.skill
      ] = Math.max(
        1,
        (
          this.state.skills[
            question.skill
          ] ?? 1
        ) - 0.15
      );
    }

    const result =
      correct
        ? {
            type: "correct",

            message:
              "Correct.",

            answer:
              answerText(
                question.answer
              ),

            explanation:
              question.explanation,

            subskill:
              question.subskill
          }
        : {
            type: "wrong",

            message:
              `Not quite. The answer is ${answerText(
                question.answer
              )}.`,

            answer:
              answerText(
                question.answer
              ),

            explanation:
              question.explanation,

            subskill:
              question.subskill
          };

    this.dailyResult =
      result;

    const DAILY_TOTAL = 5;

    if (
      this.state.daily.total >=
      DAILY_TOTAL
    ) {
      this.finishDaily();
    } else {
      this.dailyQuestion =
        makeQuestion(
          {
            ...this.level,

            difficulty:
              Math.min(
                8,
                this.level.difficulty + 1
              )
          },

          this.state.skills,

          this.state.subskills
        );

      save(this.state);

      this.emit();
    }

    return result;
  }

  finishDaily() {
    const today =
      getToday();

    const yesterday =
      new Date();

    yesterday.setDate(
      yesterday.getDate() - 1
    );

    const yesterdayKey =
      `${yesterday.getFullYear()}-${String(
        yesterday.getMonth() + 1
      ).padStart(2, "0")}-${String(
        yesterday.getDate()
      ).padStart(2, "0")}`;

    const lastCompleted =
      this.state.daily.lastCompletedDate;

    if (
      lastCompleted ===
      yesterdayKey
    ) {
      this.state.daily.streak += 1;
    } else if (
      lastCompleted !==
      today
    ) {
      this.state.daily.streak = 1;
    }

    this.state.daily.bestStreak =
      Math.max(
        this.state.daily.bestStreak,
        this.state.daily.streak
      );

    this.state.daily.lastCompletedDate =
      today;

    this.state.daily.completed =
      true;

    const perfect =
      this.state.daily.correct ===
      5;

    const xp =
      perfect ? 40 : 25;

    const coins =
      perfect ? 20 : 10;

    this.addReward(
      xp,
      coins
    );

    this.state.stats.totalDailyChallenges +=
      1;

    this.unlock(
      "daily-first"
    );

    if (
      this.state.daily.streak >=
      7
    ) {
      this.unlock(
        "daily-7"
      );
    }

    this.dailyResult = {
      ...this.dailyResult,

      message: perfect
        ? `Daily Challenge complete! Perfect score. +${xp} XP · +${coins} coins`
        : `Daily Challenge complete. +${xp} XP · +${coins} coins`,

      dailyComplete:
        true,

      dailyCorrect:
        this.state.daily.correct,

      dailyTotal:
        5,

      dailyStreak:
        this.state.daily.streak
    };

    save(this.state);

    this.emit();
  }

  exitDaily() {
    this.mode = "adventure";

    this.dailyQuestion = null;

    this.dailyResult = null;

    this.newQuestion(false);

    save(this.state);

    this.emit();
  }

  restart() {
    this.state = reset();

    this.mode = "adventure";

    this.stageComplete = false;

    this.completedStage = null;

    this.lastResult = null;

    this.dailyQuestion = null;

    this.dailyResult = null;

    this.syncDaily();

    this.syncLevel();

    this.newQuestion(false);

    save(this.state);

    this.emit();
  }

  view() {
    return {
      course:
        structuredClone(
          this.course
        ),

      level:
        structuredClone(
          this.level
        ),

      state:
        structuredClone(
          this.state
        ),

      stage:
        structuredClone(
          this.stageOverride
        ),

      stageCount:
        ARITHMETIC_LEVELS.length,

      levelCount:
        ARITHMETIC_LEVELS.length,

      xpTarget:
        this.xpTarget,

      accuracy:
        this.accuracy,

      mastery:
        this.mastery,

      dailyAccuracy:
        this.dailyAccuracy,

      subskills:
        structuredClone(
          this.state.subskills
        ),

      question:
        this.mode === "daily"
          ? structuredClone(
              this.dailyQuestion
            )
          : structuredClone(
              this.question
            ),

      mode:
        this.mode,

      dailyQuestion:
        structuredClone(
          this.dailyQuestion
        ),

      stageComplete:
        this.stageComplete,

      isBoss:
        this.isBoss,

      encounterTarget:
        this.encounterTarget,

      masteryTarget:
        this.masteryTarget,

      lastResult:
        this.lastResult,

      dailyResult:
        this.dailyResult,

      achievements:
        structuredClone(
          this.state.achievements
        ),

      achievementList:
        structuredClone(
          ACHIEVEMENTS
        ),

      completedStage:
        structuredClone(
          this.completedStage
        )
    };
  }

  emit() {
    this.onChange?.(
      this.view()
    );
  }
}