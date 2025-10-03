import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import CourseCard from "@/components/organisms/CourseCard";
import AssignmentCard from "@/components/organisms/AssignmentCard";
import GradeProgressRing from "@/components/organisms/GradeProgressRing";
import courseService from "@/services/api/courseService";
import assignmentService from "@/services/api/assignmentService";
import gradeService from "@/services/api/gradeService";
import gradeCategoryService from "@/services/api/gradeCategoryService";
import { calculateCourseGrade, calculateGPA } from "@/utils/gradeCalculator";
import { sortByDueDate } from "@/utils/dateHelpers";

const Dashboard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [coursesData, assignmentsData, gradesData, categoriesData] = await Promise.all([
        courseService.getAll(),
        assignmentService.getAll(),
        gradeService.getAll(),
        gradeCategoryService.getAll()
      ]);
      setCourses(coursesData);
      setAssignments(assignmentsData);
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

  const getOverallGPA = () => {
    const courseGrades = courses.map((course) => ({
      grade: getCourseGrade(course.Id),
      credits: course.credits_c
    }));
    return calculateGPA(courseGrades);
  };
const upcomingAssignments = sortByDueDate(
    assignments.filter((a) => a.status_c !== "completed")
  ).slice(0, 5);

  const handleStatusChange = async (assignmentId, newStatus) => {
    try {
      await assignmentService.updateStatus(assignmentId, newStatus);
      setAssignments((prev) =>
        prev.map((a) => (a.Id === assignmentId ? { ...a, status: newStatus } : a))
      );
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  if (courses.length === 0) {
    return (
      <Empty
        title="Welcome to StudyFlow!"
        description="Start organizing your academic life by adding your first course."
        icon="GraduationCap"
        actionLabel="Add Course"
        onAction={() => navigate("/courses")}
      />
    );
  }

  const gpa = getOverallGPA();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">Your academic overview at a glance</p>
        </div>
      </div>

      {/* GPA and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="text-center">
          <GradeProgressRing value={gpa * 25} size={100} strokeWidth={8} />
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-slate-900">Overall GPA</h3>
            <p className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {gpa.toFixed(2)}
            </p>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
              <ApperIcon name="BookOpen" size={24} className="text-primary" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Courses</p>
              <p className="text-2xl font-bold text-slate-900">{courses.length}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-warning/10 to-warning/5 rounded-lg flex items-center justify-center">
              <ApperIcon name="ClipboardList" size={24} className="text-warning" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Pending Tasks</p>
              <p className="text-2xl font-bold text-slate-900">
{assignments.filter((a) => a.status_c !== "completed").length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-success/10 to-success/5 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckCircle2" size={24} className="text-success" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Completed</p>
<p className="text-2xl font-bold text-slate-900">
                {assignments.filter((a) => a.status_c === "completed").length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Upcoming Assignments */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">Upcoming Assignments</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate("/assignments")}>
            View All
            <ApperIcon name="ArrowRight" size={16} />
          </Button>
        </div>
        {upcomingAssignments.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <ApperIcon name="CheckCircle2" size={48} className="text-success mx-auto mb-3" />
              <p className="text-slate-600">All caught up! No upcoming assignments.</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {upcomingAssignments.map((assignment) => (
              <AssignmentCard
key={assignment.Id}
                assignment={assignment}
                course={courses.find((c) => {
                  const assignmentCourseId = assignment.course_id_c?.Id || assignment.course_id_c;
                  return c.Id === assignmentCourseId;
                })}
                onStatusChange={handleStatusChange}
                onEdit={() => navigate("/assignments")}
                onDelete={() => {}}
              />
            ))}
          </div>
        )}
      </div>

      {/* Courses Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">Your Courses</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate("/courses")}>
            View All
            <ApperIcon name="ArrowRight" size={16} />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.slice(0, 6).map((course) => (
            <CourseCard
              key={course.Id}
              course={course}
              grade={getCourseGrade(course.Id)}
              onEdit={() => navigate("/courses")}
              onDelete={() => {}}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;