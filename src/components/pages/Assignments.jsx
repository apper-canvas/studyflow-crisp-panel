import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import AssignmentCard from "@/components/organisms/AssignmentCard";
import AssignmentForm from "@/components/organisms/AssignmentForm";
import Modal from "@/components/molecules/Modal";
import ConfirmDialog from "@/components/molecules/ConfirmDialog";
import courseService from "@/services/api/courseService";
import assignmentService from "@/services/api/assignmentService";
import { groupByDueDate } from "@/utils/dateHelpers";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [deletingAssignment, setDeletingAssignment] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [assignmentsData, coursesData] = await Promise.all([
        assignmentService.getAll(),
        courseService.getAll()
      ]);
      setAssignments(assignmentsData);
      setCourses(coursesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingAssignment(null);
    setIsModalOpen(true);
  };

  const handleEdit = (assignment) => {
    setEditingAssignment(assignment);
    setIsModalOpen(true);
  };

  const handleSubmit = async (assignmentData) => {
    try {
      if (editingAssignment) {
        const updated = await assignmentService.update(editingAssignment.Id, assignmentData);
        setAssignments((prev) => prev.map((a) => (a.Id === updated.Id ? updated : a)));
        toast.success("Assignment updated successfully!");
      } else {
        const newAssignment = await assignmentService.create(assignmentData);
        setAssignments((prev) => [...prev, newAssignment]);
        toast.success("Assignment created successfully!");
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Failed to save assignment");
    }
  };

  const handleStatusChange = async (assignmentId, newStatus) => {
    try {
      await assignmentService.updateStatus(assignmentId, newStatus);
      setAssignments((prev) =>
        prev.map((a) => (a.Id === assignmentId ? { ...a, status: newStatus } : a))
      );
      toast.success("Status updated!");
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!deletingAssignment) return;
    try {
      await assignmentService.delete(deletingAssignment.Id);
      setAssignments((prev) => prev.filter((a) => a.Id !== deletingAssignment.Id));
      toast.success("Assignment deleted successfully!");
      setDeletingAssignment(null);
    } catch (err) {
      toast.error("Failed to delete assignment");
    }
  };

const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch = assignment.title_c?.toLowerCase().includes(searchTerm.toLowerCase());
    const assignmentCourseId = assignment.course_id_c?.Id || assignment.course_id_c;
    const matchesCourse = filterCourse === "all" || assignmentCourseId === parseInt(filterCourse);
    const matchesStatus = filterStatus === "all" || assignment.status_c === filterStatus;
    const matchesPriority = filterPriority === "all" || assignment.priority_c === filterPriority;
    return matchesSearch && matchesCourse && matchesStatus && matchesPriority;
  });

  const groupedAssignments = groupByDueDate(filteredAssignments);

  if (loading) return <Loading type="list" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const renderGroup = (title, assignments, icon, color) => {
    if (assignments.length === 0) return null;
    return (
      <div>
        <div className="flex items-center gap-2 mb-3">
          <ApperIcon name={icon} size={20} className={color} />
          <h3 className="text-lg font-semibold text-slate-900">
            {title} ({assignments.length})
          </h3>
        </div>
        <div className="space-y-3">
          {assignments.map((assignment) => (
            <AssignmentCard
key={assignment.Id}
              assignment={assignment}
              course={courses.find((c) => {
                const assignmentCourseId = assignment.course_id_c?.Id || assignment.course_id_c;
                return c.Id === assignmentCourseId;
              })}
              onStatusChange={handleStatusChange}
              onEdit={handleEdit}
              onDelete={setDeletingAssignment}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Assignments</h1>
          <p className="text-slate-600 mt-1">Track and manage your assignments</p>
        </div>
        <Button
          variant="primary"
          onClick={handleAdd}
          icon={<ApperIcon name="Plus" size={20} />}
        >
          Add Assignment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <ApperIcon
            name="Search"
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <Input
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
<Select value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)}>
          <option value="all">All Courses</option>
          {courses.map((course) => (
            <option key={course.Id} value={course.Id}>
              {course.course_code_c}
              {course.courseCode}
            </option>
          ))}
        </Select>
        <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </Select>
        <Select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
          <option value="all">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </Select>
      </div>

      {filteredAssignments.length === 0 ? (
        <Empty
          title="No Assignments Found"
          description={searchTerm ? "Try adjusting your search or filters" : "Add your first assignment to get started"}
          icon="ClipboardList"
          actionLabel={!searchTerm ? "Add Assignment" : undefined}
          onAction={!searchTerm ? handleAdd : undefined}
        />
      ) : (
        <div className="space-y-8">
          {renderGroup("Overdue", groupedAssignments.overdue, "AlertCircle", "text-error")}
          {renderGroup("Due Today", groupedAssignments.today, "Calendar", "text-warning")}
          {renderGroup("Due Tomorrow", groupedAssignments.tomorrow, "Clock", "text-warning")}
          {renderGroup("This Week", groupedAssignments.thisWeek, "CalendarDays", "text-info")}
          {renderGroup("Later", groupedAssignments.later, "CalendarRange", "text-slate-500")}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAssignment ? "Edit Assignment" : "Add New Assignment"}
      >
        <AssignmentForm
          assignment={editingAssignment}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingAssignment}
        onClose={() => setDeletingAssignment(null)}
        onConfirm={handleDelete}
        title="Delete Assignment"
        message="Are you sure you want to delete this assignment? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </motion.div>
  );
};

export default Assignments;