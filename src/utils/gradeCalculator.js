export const calculateCourseGrade = (grades, categories) => {
  if (!grades || grades.length === 0) return 0;

  const categoryMap = new Map();
  categories.forEach((cat) => {
    categoryMap.set(cat.name, { weight: cat.weight, grades: [] });
  });

  grades.forEach((grade) => {
    if (categoryMap.has(grade.category)) {
      categoryMap.get(grade.category).grades.push(grade);
    }
  });

  let totalWeightedScore = 0;
  let totalWeight = 0;

  categoryMap.forEach((categoryData) => {
    if (categoryData.grades.length > 0) {
      const categoryAverage =
        categoryData.grades.reduce((sum, g) => sum + (g.score / g.maxScore) * 100, 0) /
        categoryData.grades.length;
      totalWeightedScore += categoryAverage * categoryData.weight;
      totalWeight += categoryData.weight;
    }
  });

  return totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
};

export const calculateGPA = (courseGrades) => {
  if (!courseGrades || courseGrades.length === 0) return 0;

  const gradeToGPA = (grade) => {
    if (grade >= 93) return 4.0;
    if (grade >= 90) return 3.7;
    if (grade >= 87) return 3.3;
    if (grade >= 83) return 3.0;
    if (grade >= 80) return 2.7;
    if (grade >= 77) return 2.3;
    if (grade >= 73) return 2.0;
    if (grade >= 70) return 1.7;
    if (grade >= 67) return 1.3;
    if (grade >= 65) return 1.0;
    return 0.0;
  };

  const totalPoints = courseGrades.reduce((sum, { grade, credits }) => {
    return sum + gradeToGPA(grade) * credits;
  }, 0);

  const totalCredits = courseGrades.reduce((sum, { credits }) => sum + credits, 0);

  return totalCredits > 0 ? totalPoints / totalCredits : 0;
};

export const getLetterGrade = (numericGrade) => {
  if (numericGrade >= 93) return "A";
  if (numericGrade >= 90) return "A-";
  if (numericGrade >= 87) return "B+";
  if (numericGrade >= 83) return "B";
  if (numericGrade >= 80) return "B-";
  if (numericGrade >= 77) return "C+";
  if (numericGrade >= 73) return "C";
  if (numericGrade >= 70) return "C-";
  if (numericGrade >= 67) return "D+";
  if (numericGrade >= 65) return "D";
  return "F";
};