import { useState, useEffect } from "react";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import courseService from "@/services/api/courseService";

const AssignmentForm = ({ assignment, onSubmit, onCancel }) => {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    courseId: "",
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    status: "pending"
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (assignment) {
      const dueDateStr = new Date(assignment.dueDate).toISOString().split("T")[0];
      setFormData({
        ...assignment,
        courseId: assignment.courseId.toString(),
        dueDate: dueDateStr
      });
    }
  }, [assignment]);

  const loadCourses = async () => {
    try {
      const data = await courseService.getAll();
      setCourses(data);
      if (!assignment && data.length > 0) {
        setFormData((prev) => ({ ...prev, courseId: data[0].Id.toString() }));
      }
    } catch (error) {
      console.error("Failed to load courses:", error);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.courseId) newErrors.courseId = "Please select a course";
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.dueDate) newErrors.dueDate = "Due date is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        ...formData,
        courseId: parseInt(formData.courseId),
        dueDate: new Date(formData.dueDate).getTime()
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (courses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-600 mb-4">No courses available. Please create a course first.</p>
        <Button variant="outline" onClick={onCancel}>
          Close
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Select
        label="Course"
        id="courseId"
        value={formData.courseId}
        onChange={(e) => handleChange("courseId", e.target.value)}
        error={errors.courseId}
      >
        {courses.map((course) => (
          <option key={course.Id} value={course.Id}>
            {course.courseCode} - {course.name}
          </option>
        ))}
      </Select>

      <Input
        label="Assignment Title"
        id="title"
        value={formData.title}
        onChange={(e) => handleChange("title", e.target.value)}
        error={errors.title}
        placeholder="Programming Assignment 1"
      />

      <Textarea
        label="Description"
        id="description"
        value={formData.description}
        onChange={(e) => handleChange("description", e.target.value)}
        placeholder="Add assignment details..."
        rows={4}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Due Date"
          id="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={(e) => handleChange("dueDate", e.target.value)}
          error={errors.dueDate}
        />
        <Select
          label="Priority"
          id="priority"
          value={formData.priority}
          onChange={(e) => handleChange("priority", e.target.value)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </Select>
      </div>

      {assignment && (
        <Select
          label="Status"
          id="status"
          value={formData.status}
          onChange={(e) => handleChange("status", e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </Select>
      )}

      <div className="flex gap-3 justify-end pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {assignment ? "Update Assignment" : "Create Assignment"}
        </Button>
      </div>
    </form>
  );
};

export default AssignmentForm;