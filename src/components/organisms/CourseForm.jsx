import { useState, useEffect } from "react";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Button from "@/components/atoms/Button";
import CourseColorPicker from "@/components/molecules/CourseColorPicker";

const CourseForm = ({ course, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    courseCode: "",
    instructor: "",
    schedule: "",
    credits: "",
    color: "#3b82f6",
    semester: "Fall 2024"
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (course) {
      setFormData(course);
    }
  }, [course]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Course name is required";
    if (!formData.courseCode.trim()) newErrors.courseCode = "Course code is required";
    if (!formData.instructor.trim()) newErrors.instructor = "Instructor name is required";
    if (!formData.credits || formData.credits < 1) newErrors.credits = "Credits must be at least 1";
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
        credits: parseInt(formData.credits)
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Course Name"
          id="name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          error={errors.name}
          placeholder="Introduction to Computer Science"
        />
        <Input
          label="Course Code"
          id="courseCode"
          value={formData.courseCode}
          onChange={(e) => handleChange("courseCode", e.target.value)}
          error={errors.courseCode}
          placeholder="CS101"
        />
      </div>

      <Input
        label="Instructor"
        id="instructor"
        value={formData.instructor}
        onChange={(e) => handleChange("instructor", e.target.value)}
        error={errors.instructor}
        placeholder="Dr. Sarah Johnson"
      />

      <Input
        label="Schedule"
        id="schedule"
        value={formData.schedule}
        onChange={(e) => handleChange("schedule", e.target.value)}
        placeholder="Mon, Wed, Fri 10:00 AM - 11:00 AM"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Credits"
          id="credits"
          type="number"
          min="1"
          max="6"
          value={formData.credits}
          onChange={(e) => handleChange("credits", e.target.value)}
          error={errors.credits}
          placeholder="3"
        />
        <Input
          label="Semester"
          id="semester"
          value={formData.semester}
          onChange={(e) => handleChange("semester", e.target.value)}
          placeholder="Fall 2024"
        />
      </div>

      <CourseColorPicker
        label="Course Color"
        value={formData.color}
        onChange={(color) => handleChange("color", color)}
      />

      <div className="flex gap-3 justify-end pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {course ? "Update Course" : "Create Course"}
        </Button>
      </div>
    </form>
  );
};

export default CourseForm;