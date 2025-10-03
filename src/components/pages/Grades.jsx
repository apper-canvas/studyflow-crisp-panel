import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import GradeForm from "@/components/organisms/GradeForm";
import GradeProgressRing from "@/components/organisms/GradeProgressRing";
import Modal from "@/components/molecules/Modal";
import ConfirmDialog from "@/components/molecules/ConfirmDialog";
import courseService from "@/services/api/courseService";
import gradeService from "@/services/api/gradeService";
import gradeCategoryService from "@/services/api/gradeCategoryService";
import { calculateCourseGrade, getLetterGrade } from "@/utils/gradeCalculator";

const Grades = () => {
  const [courses, setCourses] = useState([]);
  const [grades, setGrades] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);
  const [deletingGrade, setDeletingGrade] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!selectedCourse && courses.length > 0) {
      setSelectedCourse(courses[0].Id.toString());
    }
  }, [courses]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [coursesData, gradesData, categoriesData] = await Promise.all([
        courseService.getAll(),
        gradeService.getAll(),
        gradeCategoryService.getAll()
      ]);
      setCourses(coursesData);
      setGrades(gradesData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingGrade(null);
    setIsModalOpen(true);
  };

  const handleEdit = (grade) => {
    setEditingGrade(grade);
    setIsModalOpen(true);
  };

  const handleSubmit = async (gradeData) => {
    try {
      if (editingGrade) {
        const updated = await gradeService.update(editingGrade.Id, gradeData);
        setGrades((prev) => prev.map((g) => (g.Id === updated.Id ? updated : g)));
        toast.success("Grade updated successfully!");
      } else {
        const newGrade = await gradeService.create(gradeData);
        setGrades((prev) => [...prev, newGrade]);
        toast.success("Grade added successfully!");
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Failed to save grade");
    }
  };

  const handleDelete = async () => {
    if (!deletingGrade) return;
    try {
      await gradeService.delete(deletingGrade.Id);
      setGrades((prev) => prev.filter((g) => g.Id !== deletingGrade.Id));
      toast.success("Grade deleted successfully!");
      setDeletingGrade(null);
    } catch (err) {
      toast.error("Failed to delete grade");
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  if (courses.length === 0) {
    return (
      <Empty
        title="No Courses Available"
        description="Add courses first to start tracking your grades"
        icon="TrendingUp"
      />
    );
  }

  const courseGrades = selectedCourse
    ? grades.filter((g) => g.courseId === parseInt(selectedCourse))
    : [];

  const courseCategories = selectedCourse
    ? categories.filter((c) => c.courseId === parseInt(selectedCourse))
    : [];

  const currentGrade = calculateCourseGrade(courseGrades, courseCategories);
  const letterGrade = getLetterGrade(currentGrade);

  const gradesByCategory = courseCategories.map((category) => {
    const categoryGrades = courseGrades.filter((g) => g.category === category.name);
    const avgScore =
      categoryGrades.length > 0
        ? categoryGrades.reduce((sum, g) => sum + (g.score / g.maxScore) * 100, 0) / categoryGrades.length
        : 0;
    return {
      ...category,
      grades: categoryGrades,
      average: avgScore
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Grades</h1>
          <p className="text-slate-600 mt-1">Track your academic performance</p>
        </div>
        <Button
          variant="primary"
          onClick={handleAdd}
          icon={<ApperIcon name="Plus" size={20} />}
        >
          Add Grade
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Select
          label="Select Course"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          {courses.map((course) => (
            <option key={course.Id} value={course.Id}>
              {course.courseCode} - {course.name}
            </option>
          ))}
        </Select>
      </div>

      {courseGrades.length === 0 ? (
        <Empty
          title="No Grades Yet"
          description="Add your first grade for this course to start tracking your performance"
          icon="TrendingUp"
          actionLabel="Add Grade"
          onAction={handleAdd}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
              <GradeProgressRing value={currentGrade} size={120} strokeWidth={10} />
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-slate-900">Current Grade</h3>
                <p className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {letterGrade}
                </p>
                <p className="text-slate-600 mt-1">{currentGrade.toFixed(1)}%</p>
              </div>
            </Card>

            {gradesByCategory.slice(0, 2).map((category) => (
              <Card key={category.Id}>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{category.name}</h3>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-slate-600">Weight: {(category.weight * 100).toFixed(0)}%</span>
                  <Badge variant="primary">
                    {category.grades.length} {category.grades.length === 1 ? "grade" : "grades"}
                  </Badge>
                </div>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">Average</span>
                    <span className="text-sm font-semibold text-primary">{category.average.toFixed(1)}%</span>
                  </div>
                  <div className="flex h-2 overflow-hidden rounded-full bg-slate-200">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${category.average}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="bg-gradient-to-r from-primary to-primary-dark shadow-sm"
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="space-y-6">
            {gradesByCategory.map((category) => (
              <Card key={category.Id}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{category.name}</h3>
                    <p className="text-sm text-slate-600">
                      Weight: {(category.weight * 100).toFixed(0)}% | Average: {category.average.toFixed(1)}%
                    </p>
                  </div>
                </div>
                {category.grades.length === 0 ? (
                  <p className="text-center py-4 text-slate-600">No grades in this category yet</p>
                ) : (
                  <div className="space-y-2">
                    {category.grades.map((grade) => (
                      <div
                        key={grade.Id}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg group hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-900">{grade.title}</h4>
                          <p className="text-sm text-slate-600">
                            {grade.score} / {grade.maxScore} ({((grade.score / grade.maxScore) * 100).toFixed(1)}%)
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge
                            variant={
                              (grade.score / grade.maxScore) * 100 >= 90
                                ? "success"
                                : (grade.score / grade.maxScore) * 100 >= 80
                                ? "primary"
                                : (grade.score / grade.maxScore) * 100 >= 70
                                ? "warning"
                                : "error"
                            }
                          >
                            {getLetterGrade((grade.score / grade.maxScore) * 100)}
                          </Badge>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleEdit(grade)}
                              className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                            >
                              <ApperIcon name="Edit2" size={16} className="text-slate-600" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setDeletingGrade(grade)}
                              className="p-2 hover:bg-error/10 rounded-lg transition-colors"
                            >
                              <ApperIcon name="Trash2" size={16} className="text-error" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingGrade ? "Edit Grade" : "Add New Grade"}
      >
        <GradeForm
          grade={editingGrade}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingGrade}
        onClose={() => setDeletingGrade(null)}
        onConfirm={handleDelete}
        title="Delete Grade"
        message="Are you sure you want to delete this grade? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </motion.div>
  );
};

export default Grades;