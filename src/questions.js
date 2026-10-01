import { SUBSKILLS } from "./storage.js";

const r = (min, max) =>
  Math.floor(
    Math.random() *
      (max - min + 1)
  ) + min;

const pick = (array) =>
  array[
    r(0, array.length - 1)
  ];

const round = (n, p = 2) =>
  Math.round(
    (n + Number.EPSILON) *
      10 ** p
  ) /
  10 ** p;

// ─────────────────────────────
// ADAPTIVE SUBSKILL SELECTION
// ─────────────────────────────

function chooseSubskill(skill, profile) {
  const options = SUBSKILLS[skill] ?? [
    "general practice"
  ];

  const entries = options.map((name) => {
    const item =
      profile?.[
        `${skill}:${name}`
      ];

    const attempts =
      Number(item?.attempts ?? 0);

    const correct =
      Number(item?.correct ?? 0);

    const level =
      Number(item?.level ?? 1);

    const accuracy =
      attempts > 0
        ? correct / attempts
        : 0.5;

    return {
      name,
      level,
      attempts,
      accuracy
    };
  });

  const weightedPool =
    entries.flatMap((item) => {
      const weakness =
        Math.max(
          0,
          1 - item.accuracy
        ) * 5;

      const masteryNeed =
        Math.max(
          0,
          6 - item.level
        ) * 0.9;

      const newSkillBonus =
        item.attempts === 0
          ? 2
          : 0;

      const strugglingBonus =
        item.attempts >= 3 &&
        item.accuracy < 0.6
          ? 3
          : 0;

      const weight =
        Math.max(
          1,
          Math.round(
            1 +
              weakness +
              masteryNeed +
              newSkillBonus +
              strugglingBonus
          )
        );

      return Array(weight).fill(
        item.name
      );
    });

  return pick(weightedPool);
}

// ─────────────────────────────
// ADAPTIVE DIFFICULTY
// ─────────────────────────────

function difficultyValue(
  stage,
  skills,
  skill,
  profile
) {
  const levelDifficulty =
    Number(
      stage?.difficulty ?? 1
    );

  const skillLevel =
    Number(
      skills?.[skill] ?? 1
    );

  const skillItems =
    (SUBSKILLS[skill] ?? [])
      .map(
        (name) =>
          profile?.[
            `${skill}:${name}`
          ]
      )
      .filter(Boolean);

  let accuracy = 0.5;

  if (skillItems.length) {
    const attempts =
      skillItems.reduce(
        (sum, item) =>
          sum +
          Number(
            item.attempts ?? 0
          ),
        0
      );

    const correct =
      skillItems.reduce(
        (sum, item) =>
          sum +
          Number(
            item.correct ?? 0
          ),
        0
      );

    if (attempts > 0) {
      accuracy =
        correct / attempts;
    }
  }

  let adaptiveShift = 0;

  if (
    accuracy >= 0.85 &&
    skillLevel >= levelDifficulty
  ) {
    adaptiveShift = 1;
  } else if (
    accuracy < 0.55
  ) {
    adaptiveShift = -1;
  }

  return Math.max(
    1,
    Math.min(
      8,
      Math.round(
        (levelDifficulty +
          skillLevel) /
          2 +
          adaptiveShift
      )
    )
  );
}

// ─────────────────────────────
// QUESTION GENERATOR
// ─────────────────────────────

export function makeQuestion(
  stage,
  skills,
  profile = {}
) {
  const focus =
    Array.isArray(stage.focus)
      ? stage.focus
      : ["addition"];

  const pool =
    focus.flatMap(
      (skill) =>
        Array(
          Math.max(
            1,
            9 -
              Math.round(
                skills?.[skill] ??
                  1
              )
          )
        ).fill(skill)
    );

  const skill =
    pick(pool);

  const subskill =
    chooseSubskill(
      skill,
      profile
    );

  const d =
    difficultyValue(
      stage,
      skills,
      skill,
      profile
    );

  // ─────────────────────────────
  // ADDITION
  // ─────────────────────────────

  if (skill === "addition") {
    if (
      subskill ===
      "basic facts"
    ) {
      const a = r(
        1,
        10 + d
      );

      const b = r(
        1,
        10 + d
      );

      return q(
        skill,
        subskill,
        "Addition",
        `${a} + ${b} = ?`,
        a + b,
        0,
        `Combine the two addends: ${a} + ${b} = ${
          a + b
        }.`
      );
    }

    if (
      subskill ===
      "two-digit addition"
    ) {
      const a = r(
        10,
        45 + d * 4
      );

      const b = r(
        10,
        45 + d * 4
      );

      return q(
        skill,
        subskill,
        "Addition",
        `${a} + ${b} = ?`,
        a + b,
        0,
        `Add ones first, then tens. ${a} + ${b} = ${
          a + b
        }.`
      );
    }

    const a = r(
      38,
      89 + d * 4
    );

    const b = r(
      18,
      79 + d * 4
    );

    return q(
      skill,
      subskill,
      "Regrouping",
      `${a} + ${b} = ?`,
      a + b,
      0,
      `Add from right to left. When a place reaches 10 or more, regroup into the next place. ${a} + ${b} = ${
        a + b
      }.`
    );
  }

  // ─────────────────────────────
  // SUBTRACTION
  // ─────────────────────────────

  if (
    skill === "subtraction"
  ) {
    if (
      subskill ===
      "basic facts"
    ) {
      const a = r(
        3,
        12 + d
      );

      const b = r(
        1,
        a
      );

      return q(
        skill,
        subskill,
        "Subtraction",
        `${a} − ${b} = ?`,
        a - b,
        0,
        `Take ${b} away from ${a}: ${a} − ${b} = ${
          a - b
        }.`
      );
    }

    if (
      subskill ===
      "two-digit subtraction"
    ) {
      const a = r(
        20,
        60 + d * 4
      );

      const b = r(
        10,
        a - 1
      );

      return q(
        skill,
        subskill,
        "Subtraction",
        `${a} − ${b} = ?`,
        a - b,
        0,
        `Subtract ones first, then tens. ${a} − ${b} = ${
          a - b
        }.`
      );
    }

    const a = r(
      55,
      120 + d * 5
    );

    const b = r(
      18,
      a - 1
    );

    return q(
      skill,
      subskill,
      "Regrouping",
      `${a} − ${b} = ?`,
      a - b,
      0,
      `Subtract from right to left. Regroup from the next place when needed. ${a} − ${b} = ${
        a - b
      }.`
    );
  }

  // ─────────────────────────────
  // MULTIPLICATION
  // ─────────────────────────────

  if (
    skill ===
    "multiplication"
  ) {
    if (
      subskill ===
      "basic facts"
    ) {
      const a = r(
        2,
        6 + d
      );

      const b = r(
        2,
        10
      );

      return q(
        skill,
        subskill,
        "Multiplication",
        `${a} × ${b} = ?`,
        a * b,
        0,
        `Think of ${a} equal groups of ${b}: ${a} × ${b} = ${
          a * b
        }.`
      );
    }

    if (
      subskill ===
      "two-digit × one-digit"
    ) {
      const a = r(
        10,
        35 + d * 3
      );

      const b = r(
        2,
        9
      );

      return q(
        skill,
        subskill,
        "Multiplication",
        `${a} × ${b} = ?`,
        a * b,
        0,
        `Multiply the ones and tens, carrying when necessary. ${a} × ${b} = ${
          a * b
        }.`
      );
    }

    const a = r(
      20,
      70 + d * 4
    );

    const b = r(
      11,
      19
    );

    return q(
      skill,
      subskill,
      "Larger multiplication",
      `${a} × ${b} = ?`,
      a * b,
      0,
      `Break the multiplier into tens and ones, multiply each part, then add the partial products. ${a} × ${b} = ${
        a * b
      }.`
    );
  }

  // ─────────────────────────────
  // DIVISION
  // ─────────────────────────────

  if (
    skill === "division"
  ) {
    if (
      subskill ===
      "fact families"
    ) {
      const b = r(
        2,
        9
      );

      const answer = r(
        2,
        10
      );

      const a =
        b * answer;

      return q(
        skill,
        subskill,
        "Division",
        `${a} ÷ ${b} = ?`,
        answer,
        0,
        `Use the related multiplication fact: ${b} × ${answer} = ${a}, so ${a} ÷ ${b} = ${answer}.`
      );
    }

    if (
      subskill ===
      "exact division"
    ) {
      const b = r(
        3,
        10 + d
      );

      const answer = r(
        3,
        12
      );

      const a =
        b * answer;

      return q(
        skill,
        subskill,
        "Division",
        `${a} ÷ ${b} = ?`,
        answer,
        0,
        `Ask how many groups of ${b} fit into ${a}. Exactly ${answer} groups fit.`
      );
    }

    const b = r(
      4,
      12
    );

    const answer = r(
      8,
      18 + d
    );

    const a =
      b * answer;

    return q(
      skill,
      subskill,
      "Larger division",
      `${a} ÷ ${b} = ?`,
      answer,
      0,
      `Use the multiplication check: ${b} × ${answer} = ${a}. Therefore the quotient is ${answer}.`
    );
  }

  // ─────────────────────────────
  // DECIMALS
  // ─────────────────────────────

  if (
    skill === "decimals"
  ) {
    if (
      subskill ===
      "place value"
    ) {
      const a =
        r(1, 9) / 10;

      const b =
        r(1, 9) / 100;

      const answer =
        round(a + b, 2);

      return q(
        skill,
        subskill,
        "Place value",
        `What is ${a} + ${b} = ?`,
        answer,
        0.005,
        `Align the decimal points and combine tenths and hundredths: ${a.toFixed(
          2
        )} + ${b.toFixed(
          2
        )} = ${answer.toFixed(2)}.`
      );
    }

    const places =
      d >= 5 ? 2 : 1;

    const factor =
      10 ** places;

    const a =
      r(10, 90) /
      factor;

    const b =
      r(5, 60) /
      factor;

    const subtract =
      subskill ===
        "decimal subtraction" ||
      Math.random() < 0.45;

    let x = a;
    let y = b;

    if (
      subtract &&
      y > x
    ) {
      [x, y] = [y, x];
    }

    const answer =
      subtract
        ? x - y
        : x + y;

    return q(
      skill,
      subskill,
      "Decimals",
      `${x.toFixed(
        places
      )} ${
        subtract ? "−" : "+"
      } ${y.toFixed(
        places
      )} = ?`,
      round(
        answer,
        places
      ),
      0.005,
      `Keep the decimal points aligned, then ${
        subtract
          ? "subtract"
          : "add"
      } place by place. The result is ${round(
        answer,
        places
      ).toFixed(places)}.`
    );
  }

  // ─────────────────────────────
  // FRACTIONS
  // ─────────────────────────────

  if (
    skill === "fractions"
  ) {
    if (
      subskill ===
      "equivalent fractions"
    ) {
      const n = r(
        1,
        4
      );

      const d = r(
        2,
        6
      );

      const m = r(
        2,
        4
      );

      return q(
        skill,
        subskill,
        "Equivalent fractions",
        `What is the new numerator when ${n}/${d} is multiplied by ${m}/${m}?`,
        n * m,
        0,
        `Multiply the numerator and denominator by the same number. ${n}/${d} becomes ${n *
          m}/${d *
          m}.`
      );
    }

    if (
      subskill ===
      "fraction operations"
    ) {
      const d = r(
        2,
        8
      );

      const n = r(
        1,
        d - 1
      );

      const n2 = r(
        1,
        d - 1
      );

      const answer =
        round(
          (n + n2) / d,
          2
        );

      return q(
        skill,
        subskill,
        "Fraction operation",
        `What is ${n}/${d} + ${n2}/${d} as a decimal?`,
        answer,
        0.005,
        `The denominators match, so add the numerators: ${n +
          n2}/${d}. Then divide ${n +
          n2} by ${d} to get ${answer}.`
      );
    }

    const den = r(
      2,
      Math.min(
        10,
        3 + d
      )
    );

    const num = r(
      1,
      den - 1
    );

    const answer =
      round(
        num / den,
        2
      );

    return q(
      skill,
      subskill,
      "Fractions",
      `What is ${num}/${den} as a decimal?`,
      answer,
      0.005,
      `Convert the fraction by dividing numerator by denominator: ${num} ÷ ${den} = ${answer}.`
    );
  }

  // ─────────────────────────────
  // ALGEBRA
  // ─────────────────────────────

  if (
    skill === "algebra"
  ) {
    if (
      subskill ===
      "two-step equations"
    ) {
      const x = r(
        2,
        5 + d
      );

      const c = r(
        2,
        5
      );

      const k = r(
        1,
        10
      );

      const result =
        c * x + k;

      return q(
        skill,
        subskill,
        "Algebra",
        `Solve: ${c}x + ${k} = ${result}`,
        x,
        0,
        `Undo the constant first: ${result} − ${k} = ${c *
          x}. Then divide by ${c}: x = ${x}.`
      );
    }

    const x = r(
      2,
      5 + d
    );

    const c = r(
      2,
      5
    );

    const result =
      c * x;

    return q(
      skill,
      subskill,
      "Algebra",
      `Solve: ${c}x = ${result}`,
      x,
      0,
      `Divide both sides by ${c}: x = ${result} ÷ ${c} = ${x}.`
    );
  }

  // ─────────────────────────────
  // FALLBACK
  // ─────────────────────────────

  const a = r(
    1,
    10
  );

  const b = r(
    1,
    10
  );

  return q(
    "addition",
    "basic facts",
    "Addition",
    `${a} + ${b} = ?`,
    a + b,
    0,
    `Combine the two numbers: ${a} + ${b} = ${
      a + b
    }.`
  );
}

// ─────────────────────────────
// QUESTION OBJECT
// ─────────────────────────────

function q(
  skill,
  subskill,
  label,
  text,
  answer,
  tolerance,
  explanation
) {
  return {
    skill,
    subskill,
    label,
    text,
    answer,
    tolerance,
    explanation
  };
}

// ─────────────────────────────
// ANSWER CHECKING
// ─────────────────────────────

export const matches = (
  value,
  question
) =>
  Math.abs(
    Number(value) -
      question.answer
  ) <=
  question.tolerance;

// ─────────────────────────────
// ANSWER DISPLAY
// ─────────────────────────────

export const answerText = (
  value
) =>
  Number.isInteger(value)
    ? String(value)
    : value
        .toFixed(3)
        .replace(
          /0+$/,
          ""
        )
        .replace(
          /\.$/,
          ""
        );