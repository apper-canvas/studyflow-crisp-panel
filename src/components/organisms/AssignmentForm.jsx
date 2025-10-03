import React, { useEffect, useState } from "react";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import courseService from "@/services/api/courseService";

const AssignmentForm = ({ assignment, onSubmit, onCancel }) => {
  const [courses, setCourses] = useState([]);
const [formData, setFormData] = useState({
    course_id_c: "",
    title_c: "",
    description_c: "",
    due_date_c: "",
    priority_c: "medium",
    status_c: "pending"
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (assignment) {
const dueDateStr = new Date(assignment.due_date_c).toISOString().split("T")[0];
      const assignmentCourseId = assignment.course_id_c?.Id || assignment.course_id_c;
      setFormData({
        title_c: assignment.title_c,
        description_c: assignment.description_c,
        due_date_c: dueDateStr,
        priority_c: assignment.priority_c,
        status_c: assignment.status_c,
        course_id_c: assignmentCourseId.toString()
      });
    }
  }, [assignment]);

const loadCourses = async () => {
    try {
      const data = await courseService.getAll();
      setCourses(data);
      if (!assignment && data.length > 0) {
        setFormData((prev) => ({ ...prev, course_id_c: data[0].Id.toString() }));
      }
    } catch (error) {
      console.error("Failed to load courses:", error);
    }
  };

const validate = () => {
    const newErrors = {};
    if (!formData.course_id_c) newErrors.course_id_c = "Please select a course";
    if (!formData.title_c?.trim()) newErrors.title_c = "Title is required";
    if (!formData.due_date_c) newErrors.due_date_c = "Due date is required";
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
        title_c: formData.title_c,
        description_c: formData.description_c,
        due_date_c: new Date(formData.due_date_c).getTime(),
        priority_c: formData.priority_c,
        status_c: formData.status_c,
        course_id_c: parseInt(formData.course_id_c)
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
        value={formData.course_id_c}
        onChange={(e) => handleChange("course_id_c", e.target.value)}
        error={errors.course_id_c}
      >
        {courses.map((course) => (
          <option key={course.Id} value={course.Id}>
            {course.course_code_c} - {course.name_c}
          </option>
        ))}
      </Select>

      <Input
        label="Assignment Title"
        value={formData.title_c}
        onChange={(e) => handleChange("title_c", e.target.value)}
        error={errors.title_c}
        placeholder="Programming Assignment 1"
      />

<Textarea
        label="Description"
        value={formData.description_c}
        onChange={(e) => handleChange("description_c", e.target.value)}
        error={errors.description_c}
        placeholder="Enter assignment description"
        rows={4}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Due Date"
          type="date"
          value={formData.due_date_c}
          onChange={(e) => handleChange("due_date_c", e.target.value)}
          error={errors.due_date_c}
        />
<Select
          label="Priority"
          value={formData.priority_c}
          onChange={(e) => handleChange("priority_c", e.target.value)}
          error={errors.priority_c}
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </Select>
      </div>

{assignment && (
        <Select
          label="Status"
          value={formData.status_c}
          onChange={(e) => handleChange("status_c", e.target.value)}
          error={errors.status_c}
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