import React, { useEffect, useState } from "react";
import CourseColorPicker from "@/components/molecules/CourseColorPicker";
import Textarea from "@/components/atoms/Textarea";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";

const CourseForm = ({ course, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
name_c: "",
    course_code_c: "",
    instructor_c: "",
    schedule_c: "",
    credits_c: "",
    color_c: "#3b82f6",
    semester_c: "Fall 2024"
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (course) {
      setFormData(course);
    }
  }, [course]);

const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name_c?.trim()) newErrors.name_c = "Course name is required";
    if (!formData.course_code_c?.trim()) newErrors.course_code_c = "Course code is required";
    if (!formData.instructor_c?.trim()) newErrors.instructor_c = "Instructor name is required";
    if (!formData.credits_c || formData.credits_c < 1) newErrors.credits_c = "Credits must be at least 1";
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
        credits_c: parseInt(formData.credits_c)
      });
    } catch (error) {
      console.error('Failed to submit course:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Input
          label="Course Name"
          value={formData.name_c}
          onChange={(e) => handleChange("name_c", e.target.value)}
          error={errors.name_c}
          placeholder="Introduction to Computer Science"
        />

        <Input
          label="Course Code"
          value={formData.course_code_c}
          onChange={(e) => handleChange("course_code_c", e.target.value)}
          error={errors.course_code_c}
          placeholder="e.g., CS101"
        />

        <Input
          label="Instructor"
          value={formData.instructor_c}
          onChange={(e) => handleChange("instructor_c", e.target.value)}
          error={errors.instructor_c}
          placeholder="Dr. Sarah Johnson"
        />

        <Input
          label="Schedule"
          value={formData.schedule_c}
          onChange={(e) => handleChange("schedule_c", e.target.value)}
          error={errors.schedule_c}
          placeholder="e.g., Mon/Wed 10:00 AM - 11:30 AM"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Credits"
            type="number"
            value={formData.credits_c}
            onChange={(e) => handleChange("credits_c", e.target.value)}
            error={errors.credits_c}
            min="1"
            placeholder="3"
          />

          <Input
            label="Semester"
            value={formData.semester_c}
            onChange={(e) => handleChange("semester_c", e.target.value)}
            error={errors.semester_c}
            placeholder="e.g., Fall 2024"
          />
        </div>

        <CourseColorPicker
          label="Course Color"
          value={formData.color_c}
          onChange={(color) => handleChange("color_c", color)}
        />
      </div>

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