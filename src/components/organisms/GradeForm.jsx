import React, { useEffect, useState } from "react";
import Select from "@/components/atoms/Select";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import gradeCategoryService from "@/services/api/gradeCategoryService";
import courseService from "@/services/api/courseService";

const GradeForm = ({ grade, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    course_id_c: "",
    category_c: "",
    title_c: "",
    score_c: "",
    max_score_c: "",
    weight_c: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCourses();
  }, []);

useEffect(() => {
    if (formData.course_id_c) {
      loadCategories(formData.course_id_c);
    }
  }, [formData.course_id_c]);

  useEffect(() => {
    if (grade) {
      setFormData({
course_id_c: (grade.course_id_c?.Id || grade.course_id_c).toString(),
        category_c: grade.category_c,
        title_c: grade.title_c,
        score_c: grade.score_c.toString(),
        max_score_c: grade.max_score_c.toString(),
        weight_c: (grade.weight_c * 100).toString()
      });
    }
  }, [grade]);

const loadCourses = async () => {
    try {
      const data = await courseService.getAll();
      setCourses(data);
      if (!grade && data.length > 0) {
        setFormData((prev) => ({ ...prev, course_id_c: data[0].Id.toString() }));
      }
    } catch (error) {
      console.error("Failed to load courses:", error);
    }
  };

const loadCategories = async (courseId) => {
    try {
      const data = await gradeCategoryService.getByCourseId(parseInt(courseId));
      setCategories(data);
      if (data.length > 0 && !grade) {
        setFormData((prev) => ({
          ...prev,
          category_c: data[0].name_c,
          weight_c: (data[0].weight_c * 100).toString()
        }));
      }
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.course_id_c) newErrors.course_id_c = "Course is required";
    if (!formData.category_c) newErrors.category_c = "Category is required";
    if (!formData.title_c) newErrors.title_c = "Title is required";
    if (!formData.score_c || parseFloat(formData.score_c) < 0) newErrors.score_c = "Score must be 0 or greater";
    if (!formData.max_score_c || parseFloat(formData.max_score_c) <= 0) newErrors.max_score_c = "Max score must be greater than 0";
    if (!formData.weight_c || parseFloat(formData.weight_c) < 0 || parseFloat(formData.weight_c) > 100) newErrors.weight_c = "Weight must be between 0 and 100";
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
course_id_c: parseInt(formData.course_id_c),
        category_c: formData.category_c,
        title_c: formData.title_c,
        score_c: parseFloat(formData.score_c),
        max_score_c: parseFloat(formData.max_score_c),
        weight_c: parseFloat(formData.weight_c) / 100
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

const handleCategoryChange = (categoryName) => {
    handleChange("category_c", categoryName);
    const selectedCategory = categories.find((c) => c.name_c === categoryName);
    if (selectedCategory) {
      handleChange("weight_c", (selectedCategory.weight_c * 100).toString());
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

      {categories.length > 0 ? (
        <Select
          label="Category"
          value={formData.category_c}
          onChange={(e) => {
            handleChange("category_c", e.target.value);
            handleCategoryChange(e.target.value);
          }}
          error={errors.category_c}
        >
          {categories.map((cat) => (
            <option key={cat.Id} value={cat.name_c}>
              {cat.name_c} ({(cat.weight_c * 100).toFixed(0)}%)
            </option>
          ))}
        </Select>
      ) : (
        <Input
          label="Category"
          value={formData.category_c}
          onChange={(e) => handleChange("category_c", e.target.value)}
          error={errors.category_c}
          placeholder="e.g., Homework"
        />
      )}

      <Input
        label="Title"
        value={formData.title_c}
        onChange={(e) => handleChange("title_c", e.target.value)}
        error={errors.title_c}
        placeholder="e.g., Midterm Exam"
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Score"
          type="number"
          value={formData.score_c}
          onChange={(e) => handleChange("score_c", e.target.value)}
          error={errors.score_c}
          min="0"
          step="0.01"
          placeholder="85"
        />

        <Input
          label="Max Score"
          type="number"
          value={formData.max_score_c}
          onChange={(e) => handleChange("max_score_c", e.target.value)}
          error={errors.max_score_c}
          min="1"
          step="0.01"
          placeholder="100"
        />
      </div>

      <Input
        label="Weight (%)"
        type="number"
        value={formData.weight_c}
        onChange={(e) => handleChange("weight_c", e.target.value)}
        error={errors.weight_c}
        min="0"
        max="100"
        step="1"
        placeholder="30"
        disabled={categories.length > 0}
      />
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {grade ? "Update Grade" : "Add Grade"}
        </Button>
      </div>
    </form>
  );
};

export default GradeForm;