import { STAGES } from "./data/stages.js";
import { load, save, reset } from "./storage.js";
import { makeQuestion, matches, answerText } from "./questions.js";

export class Game {
  constructor(onChange) {
    this.onChange = onChange;
    this.state = load();
    this.stageComplete = false;
    this.lastResult = null;
    this.completedStage = null;
    this.newQuestion(false);
  }

  get stage() {
    return STAGES[Math.min(this.state.stage - 1, STAGES.length - 1)];
  }

  get isBoss() {
    return Boolean(this.stage.boss);
  }

  get encounterTarget() {
    return this.stage.boss ? this.stage.bossQuestions : 5;
  }

  get masteryTarget() {
    return this.stage.boss ? this.stage.bossTarget : 4;
  }

  get xpTarget() {
    return 100 + (this.state.stage - 1) * 30;
  }

  get accuracy() {
    return this.state.total
      ? Math.round((this.state.correct / this.state.total) * 100)
      : 0;
  }

  get mastery() {
    const values = Object.values(this.state.skills);
    return Math.round(
      (values.reduce((sum, value) => sum + value, 0) / (values.length * 8)) * 100
    );
  }

  newQuestion(emit = true) {
    this.question = makeQuestion(this.stage, this.state.skills, this.state.subskills);
    if (emit) this.emit();
  }

  answer(raw) {
    const normalized = String(raw).trim().replace(",", ".");

    if (!normalized) {
      return { type: "invalid", message: "Enter an answer first." };
    }

    const value = Number(normalized);

    if (!Number.isFinite(value)) {
      return {
        type: "invalid",
        message: "Enter a valid number. Decimal answers are allowed."
      };
    }

    this.state.total += 1;
    this.state.stageTotal += 1;

    const skill = this.question.skill;
    const subskillKey = `${skill}:${this.question.subskill}`;

    if (matches(value, this.question)) {
      return this.correct(skill, subskillKey);
    }

    return this.wrong(skill, subskillKey);
  }

  correct(skill, subskillKey) {
    this.state.correct += 1;
    this.state.stageCorrect += 1;
    this.state.streak += 1;
    this.state.bestStreak = Math.max(this.state.bestStreak, this.state.streak);

    this.state.skills[skill] = Math.min(
      8,
      (this.state.skills[skill] ?? 1) + 0.55
    );

    this.updateSubskill(subskillKey, true);

    const xp = 15 + Math.round(this.state.skills[skill] * 2);
    const coins = 4 + Math.min(6, this.state.streak);

    this.state.xp += xp;
    this.state.coins += coins;

    const result = {
      type: "correct",
      message: `Correct. +${xp} XP · +${coins} coins`,
      answer: answerText(this.question.answer),
      explanation: this.question.explanation,
      subskill: this.question.subskill
    };

    if (this.state.stageCorrect >= this.masteryTarget && this.state.stageTotal >= this.encounterTarget) {
      this.completeStage();
    } else {
      this.advanceEncounter();
    }

    this.lastResult = result;
    save(this.state);
    this.emit();
    return result;
  }

  wrong(skill, subskillKey) {
    this.state.streak = 0;
    this.state.lives -= 1;
    this.state.skills[skill] = Math.max(
      1,
      (this.state.skills[skill] ?? 1) - 0.4
    );

    this.updateSubskill(subskillKey, false);

    const result = {
      type: "wrong",
      message: `Not quite. The answer is ${answerText(this.question.answer)}.`,
      answer: answerText(this.question.answer),
      explanation: this.question.explanation,
      subskill: this.question.subskill
    };

    if (this.state.lives <= 0) {
      this.state.lives = 3;
      this.state.stageTotal = 0;
      this.state.stageCorrect = 0;
      result.message += " Lives restored. The challenge restarts.";
    }

    this.advanceEncounter();
    this.lastResult = result;
    save(this.state);
    this.emit();
    return result;
  }

  updateSubskill(key, wasCorrect) {
    const profile = this.state.subskills[key];
    if (!profile) return;

    profile.attempts += 1;
    if (wasCorrect) {
      profile.correct += 1;
      profile.level = Math.min(8, profile.level + 0.7);
    } else {
      profile.level = Math.max(1, profile.level - 0.65);
    }

    this.state.recentResults.push({ key, correct: wasCorrect });
    this.state.recentResults = this.state.recentResults.slice(-20);
  }

  advanceEncounter() {
    this.state.encounter = (this.state.encounter % this.encounterTarget) + 1;
    this.newQuestion(false);
  }

  completeStage() {
    this.completedStage = structuredClone(this.stage);
    this.state.coins += this.isBoss ? 50 : 25;
    this.state.xp += this.isBoss ? 80 : 40;
    this.state.lives = 3;
    this.state.stageTotal = 0;
    this.state.stageCorrect = 0;
    this.state.encounter = 1;

    if (this.state.stage < STAGES.length) {
      this.state.stage += 1;
    }

    this.stageComplete = true;
  }

  continue() {
    this.stageComplete = false;
    this.completedStage = null;
    this.lastResult = null;
    this.newQuestion(false);
    save(this.state);
    this.emit();
  }

  restart() {
    this.state = reset();
    this.stageComplete = false;
    this.completedStage = null;
    this.lastResult = null;
    this.newQuestion(false);
    this.emit();
  }

  emit() {
    this.onChange?.(this.view());
  }

  view() {
    return {
      state: structuredClone(this.state),
      stage: structuredClone(this.stage),
      stageCount: STAGES.length,
      xpTarget: this.xpTarget,
      accuracy: this.accuracy,
      mastery: this.mastery,
      subskills: structuredClone(this.state.subskills),
      question: structuredClone(this.question),
      stageComplete: this.stageComplete,
      isBoss: this.isBoss,
      encounterTarget: this.encounterTarget,
      masteryTarget: this.masteryTarget,
      lastResult: this.lastResult,
      completedStage: structuredClone(this.completedStage)
    };
  }
}
