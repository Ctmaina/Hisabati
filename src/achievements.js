export const ACHIEVEMENTS = [
  {
    id: "first-answer",
    name: "First Step",
    description: "Answer your first question correctly.",
    icon: "◆"
  },

  {
    id: "streak-5",
    name: "On Fire",
    description: "Reach a 5-answer streak.",
    icon: "🔥"
  },

  {
    id: "streak-10",
    name: "Unstoppable",
    description: "Reach a 10-answer streak.",
    icon: "⚡"
  },

  {
    id: "level-1",
    name: "The Journey Begins",
    description: "Complete Level 1.",
    icon: "Ⅰ"
  },

  {
    id: "level-5",
    name: "Boss Hunter",
    description: "Defeat your first boss.",
    icon: "B"
  },

  {
    id: "level-10",
    name: "Summit Climber",
    description: "Defeat The Summit Trial.",
    icon: "▲"
  },

  {
    id: "level-15",
    name: "Arithmetic Warden",
    description: "Defeat The Arithmetic Warden.",
    icon: "★"
  },

  {
    id: "accuracy-80",
    name: "Sharp Mind",
    description: "Reach 80% overall accuracy.",
    icon: "%"
  },

  {
    id: "questions-50",
    name: "Practitioner",
    description: "Answer 50 questions.",
    icon: "50"
  },

  {
    id: "questions-100",
    name: "Dedicated Learner",
    description: "Answer 100 questions.",
    icon: "100"
  },

  {
    id: "daily-first",
    name: "Daily Regular",
    description: "Complete your first Daily Challenge.",
    icon: "☀"
  },

  {
    id: "daily-7",
    name: "Seven Days",
    description: "Complete Daily Challenges for 7 days.",
    icon: "7"
  }
];

export function getAchievement(id) {
  return ACHIEVEMENTS.find(
    (achievement) =>
      achievement.id === id
  );
}