import { SUBSKILLS } from "./storage.js";

const r = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (a) => a[r(0, a.length - 1)];
const round = (n, p = 2) => Math.round((n + Number.EPSILON) * 10 ** p) / 10 ** p;

function chooseSubskill(skill, profile) {
  const options = SUBSKILLS[skill] ?? ["general practice"];
  const entries = options.map((name) => profile?.[`${skill}:${name}`]);
  const weakest = Math.min(...entries.map((x) => x?.level ?? 1));
  const pool = options.flatMap((name) => {
    const level = profile?.[`${skill}:${name}`]?.level ?? 1;
    return Array(Math.max(1, 7 - Math.round(level) + (level <= weakest + 0.5 ? 3 : 0))).fill(name);
  });
  return pick(pool);
}

export function makeQuestion(stage, skills, profile = {}) {
  const pool = stage.focus.flatMap(skill => Array(Math.max(1, 9 - Math.round(skills[skill] ?? 1))).fill(skill));
  const skill = pick(pool);
  const subskill = chooseSubskill(skill, profile);
  const d = Math.max(1, Math.min(8, Math.round(skills[skill] ?? 1)));

  if (skill === "addition") {
    if (subskill === "basic facts") { const a=r(1,10+d), b=r(1,10+d); return q(skill,subskill,"Addition",`${a} + ${b} = ?`,a+b,0,`Combine the two addends: ${a} + ${b} = ${a+b}.`); }
    if (subskill === "two-digit addition") { const a=r(10,45+d*4), b=r(10,45+d*4); return q(skill,subskill,"Addition",`${a} + ${b} = ?`,a+b,0,`Add ones first, then tens. ${a} + ${b} = ${a+b}.`); }
    const a=r(38,89+d*4), b=r(18,79+d*4); return q(skill,subskill,"Regrouping",`${a} + ${b} = ?`,a+b,0,`Add from right to left. When a place reaches 10 or more, regroup into the next place. ${a} + ${b} = ${a+b}.`);
  }
  if (skill === "subtraction") {
    if (subskill === "basic facts") { let a=r(3,12+d), b=r(1,a); return q(skill,subskill,"Subtraction",`${a} − ${b} = ?`,a-b,0,`Take ${b} away from ${a}: ${a} − ${b} = ${a-b}.`); }
    if (subskill === "two-digit subtraction") { let a=r(20,60+d*4), b=r(10,a-1); return q(skill,subskill,"Subtraction",`${a} − ${b} = ?`,a-b,0,`Subtract ones first, then tens. ${a} − ${b} = ${a-b}.`); }
    let a=r(55,120+d*5), b=r(18,a-1); return q(skill,subskill,"Regrouping",`${a} − ${b} = ?`,a-b,0,`Subtract from right to left. Regroup from the next place when needed. ${a} − ${b} = ${a-b}.`);
  }
  if (skill === "multiplication") {
    if (subskill === "basic facts") { const a=r(2,6+d), b=r(2,10); return q(skill,subskill,"Multiplication",`${a} × ${b} = ?`,a*b,0,`Think of ${a} equal groups of ${b}: ${a} × ${b} = ${a*b}.`); }
    if (subskill === "two-digit × one-digit") { const a=r(10,35+d*3), b=r(2,9); return q(skill,subskill,"Multiplication",`${a} × ${b} = ?`,a*b,0,`Multiply the ones and tens, carrying when necessary. ${a} × ${b} = ${a*b}.`); }
    const a=r(20,70+d*4), b=r(11,19); return q(skill,subskill,"Larger multiplication",`${a} × ${b} = ?`,a*b,0,`Break the multiplier into tens and ones, multiply each part, then add the partial products. ${a} × ${b} = ${a*b}.`);
  }
  if (skill === "division") {
    if (subskill === "fact families") { const b=r(2,9), answer=r(2,10), a=b*answer; return q(skill,subskill,"Division",`${a} ÷ ${b} = ?`,answer,0,`Use the related multiplication fact: ${b} × ${answer} = ${a}, so ${a} ÷ ${b} = ${answer}.`); }
    if (subskill === "exact division") { const b=r(3,10+d), answer=r(3,12), a=b*answer; return q(skill,subskill,"Division",`${a} ÷ ${b} = ?`,answer,0,`Ask how many groups of ${b} fit into ${a}. Exactly ${answer} groups fit.`); }
    const b=r(4,12), answer=r(8,18+d), a=b*answer; return q(skill,subskill,"Larger division",`${a} ÷ ${b} = ?`,answer,0,`Use the multiplication check: ${b} × ${answer} = ${a}. Therefore the quotient is ${answer}.`);
  }
  if (skill === "decimals") {
    if (subskill === "place value") { const a=r(1,9)/10, b=r(1,9)/100; return q(skill,subskill,"Place value",`What is ${a} + ${b} = ?`,round(a+b,2),.005,`Align the decimal points and combine tenths and hundredths: ${a.toFixed(2)} + ${b.toFixed(2)} = ${round(a+b,2).toFixed(2)}.`); }
    const p=d>=5?2:1, f=10**p, a=r(10,90)/f, b=r(5,60)/f, subtract=subskill === "decimal subtraction" || Math.random()<.45; let x=a,y=b;if(subtract&&y>x)[x,y]=[y,x];const ans=subtract?x-y:x+y; return q(skill,subskill,"Decimals",`${x.toFixed(p)} ${subtract?"−":"+"} ${y.toFixed(p)} = ?`,round(ans,p),.005,`Keep the decimal points aligned, then ${subtract?"subtract":"add"} place by place. The result is ${round(ans,p).toFixed(p)}.`);
  }
  if (skill === "fractions") {
    if (subskill === "equivalent fractions") { const n=r(1,4), d=r(2,6), m=r(2,4); return q(skill,subskill,"Equivalent fractions",`What is ${n}/${d} × ${m} = ?`,round((n*m)/(d*m),2),.005,`Multiply the numerator and denominator by the same number. ${n}/${d} becomes ${n*m}/${d*m}, which is about ${round(n/d,2)} as a decimal.`); }
    if (subskill === "fraction operations") { const d=r(2,8), n=r(1,d-1), n2=r(1,d-1); return q(skill,subskill,"Fraction operation",`What is ${n}/${d} + ${n2}/${d} as a decimal?`,round((n+n2)/d,2),.005,`The denominators match, so add the numerators: ${n+n2}/${d}. Then divide ${n+n2} by ${d} to get ${round((n+n2)/d,2)}.`); }
    const den=r(2,Math.min(10,3+d)), num=r(1,den-1); return q(skill,subskill,"Fractions",`What is ${num}/${den} as a decimal?`,round(num/den,2),.005,`Convert the fraction by dividing numerator by denominator: ${num} ÷ ${den} = ${round(num/den,2)}.`);
  }
  if (subskill === "two-step equations") { const x=r(2,5+d), c=r(2,5), k=r(1,10), result=c*x+k; return q(skill,subskill,"Algebra",`Solve: ${c}x + ${k} = ${result}`,x,0,`Undo the constant first: ${result} − ${k} = ${c*x}. Then divide by ${c}: x = ${x}.`); }
  const x=r(2,5+d), c=r(2,5), result=c*x; return q(skill,subskill,"Algebra",`Solve: ${c}x = ${result}`,x,0,`Divide both sides by ${c}: x = ${result} ÷ ${c} = ${x}.`);
}

function q(skill, subskill, label, text, answer, tolerance, explanation){ return { skill, subskill, label, text, answer, tolerance, explanation }; }
export const matches = (value, question) => Math.abs(Number(value)-question.answer) <= question.tolerance;
export const answerText = value => Number.isInteger(value) ? String(value) : value.toFixed(3).replace(/0+$/,'').replace(/\.$/,'');
