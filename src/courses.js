export const COURSES = [
  {
    id: "arithmetic",
    name: "Arithmetic",
    description:
      "Master numbers, calculations and everyday mathematics.",
    status: "available",
    color: "blue"
  },

  {
    id: "algebra",
    name: "Algebra",
    description:
      "Work confidently with unknowns, expressions and equations.",
    status: "locked",
    color: "purple"
  },

  {
    id: "geometry",
    name: "Geometry",
    description:
      "Explore shapes, space, measurement and patterns.",
    status: "locked",
    color: "green"
  },

  {
    id: "statistics",
    name: "Statistics",
    description:
      "Understand data, averages, probability and patterns.",
    status: "locked",
    color: "orange"
  },

  {
    id: "calculus",
    name: "Calculus",
    description:
      "Explore change, motion, limits and accumulation.",
    status: "locked",
    color: "red"
  }
];

export function getCourse(id) {
  return (
    COURSES.find(
      (course) => course.id === id
    ) ?? COURSES[0]
  );
}