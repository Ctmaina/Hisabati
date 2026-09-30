# Hisabati v0.8

Hisabati is an adaptive mathematics learning game built with Vite and vanilla JavaScript.

## What changed in v0.8

The major change is the **Adaptive Learning Profile**. Earlier versions tracked broad skills such as multiplication or fractions. v0.8 goes one level deeper and tracks subskills such as:

- Multiplication → basic facts
- Multiplication → two-digit × one-digit
- Multiplication → larger multiplication
- Addition → basic facts / two-digit addition / regrouping
- Subtraction → basic facts / two-digit subtraction / regrouping
- Division → fact families / exact division / larger division
- Decimals → decimal addition / decimal subtraction / place value
- Fractions → fraction to decimal / equivalent fractions / fraction operations
- Algebra → one-step equations / two-step equations / equation fluency

Each subskill records attempts, correct answers and a mastery level. Hisabati uses those levels to make weaker subskills appear more often.

## Run locally

1. Open this folder in VS Code.
2. Open the terminal in the folder containing `package.json`.
3. Run `npm.cmd install` if PowerShell blocks `npm`.
4. Run `npm.cmd run dev`.
5. Open the local Vite address shown in the terminal.

## Important

v0.8 uses a new localStorage key (`hisabati-save-v8`). Existing v0.7 progress is therefore not automatically converted into the new subskill profile. This is intentional while the learning model is being redesigned.
