import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import CourseCard from "@/components/organisms/CourseCard";
import CourseForm from "@/components/organisms/CourseForm";
import Modal from "@/components/molecules/Modal";
import ConfirmDialog from "@/components/molecules/ConfirmDialog";
import courseService from "@/services/api/courseService";
import gradeService from "@/services/api/gradeService";
import gradeCategoryService from "@/services/api/gradeCategoryService";
import { calculateCourseGrade } from "@/utils/gradeCalculator";

const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [grades, setGrades] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [deletingCourse, setDeletingCourse] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

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

const getCourseGrade = (courseId) => {
    const courseGrades = grades.filter((g) => {
      const gradeCoursceId = g.course_id_c?.Id || g.course_id_c;
      return gradeCoursceId === courseId;
    });
    const courseCategories = categories.filter((c) => {
      const catCourseId = c.course_id_c?.Id || c.course_id_c;
      return catCourseId === courseId;
    });
    return calculateCourseGrade(courseGrades, courseCategories);
  };

  const handleAdd = () => {
    setEditingCourse(null);
    setIsModalOpen(true);
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const handleSubmit = async (courseData) => {
    try {
      if (editingCourse) {
        const updated = await courseService.update(editingCourse.Id, courseData);
        setCourses((prev) => prev.map((c) => (c.Id === updated.Id ? updated : c)));
        toast.success("Course updated successfully!");
      } else {
        const newCourse = await courseService.create(courseData);
        setCourses((prev) => [...prev, newCourse]);
        toast.success("Course created successfully!");
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Failed to save course");
    }
  };

  const handleDelete = async () => {
    if (!deletingCourse) return;
    try {
      await courseService.delete(deletingCourse.Id);
      setCourses((prev) => prev.filter((c) => c.Id !== deletingCourse.Id));
      toast.success("Course deleted successfully!");
      setDeletingCourse(null);
    } catch (err) {
      toast.error("Failed to delete course");
    }
  };

const filteredCourses = courses.filter((course) =>
    course.name_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.course_code_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor_c?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Courses</h1>
          <p className="text-slate-600 mt-1">Manage your academic courses</p>
        </div>
        <Button
          variant="primary"
          onClick={handleAdd}
          icon={<ApperIcon name="Plus" size={20} />}
        >
          Add Course
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <ApperIcon
            name="Search"
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <Input
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <Empty
          title="No Courses Found"
          description={searchTerm ? "Try adjusting your search" : "Add your first course to get started"}
          icon="BookOpen"
          actionLabel={!searchTerm ? "Add Course" : undefined}
          onAction={!searchTerm ? handleAdd : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.Id}
              course={course}
              grade={getCourseGrade(course.Id)}
              onEdit={handleEdit}
              onDelete={setDeletingCourse}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCourse ? "Edit Course" : "Add New Course"}
      >
        <CourseForm
          course={editingCourse}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingCourse}
        onClose={() => setDeletingCourse(null)}
        onConfirm={handleDelete}
        title="Delete Course"
        message="Are you sure you want to delete this course? This action cannot be undone and will also delete all associated assignments and grades."
        confirmText="Delete"
        variant="danger"
      />
    </motion.div>
  );
};

export default Courses;