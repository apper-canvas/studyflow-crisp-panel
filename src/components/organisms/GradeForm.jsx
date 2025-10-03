import { useState, useEffect } from "react";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import courseService from "@/services/api/courseService";
import gradeCategoryService from "@/services/api/gradeCategoryService";

const GradeForm = ({ grade, onSubmit, onCancel }) => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    courseId: "",
    category: "",
    title: "",
    score: "",
    maxScore: "100",
    weight: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (formData.courseId) {
      loadCategories(formData.courseId);
    }
  }, [formData.courseId]);

  useEffect(() => {
    if (grade) {
      setFormData({
        courseId: grade.courseId.toString(),
        category: grade.category,
        title: grade.title,
        score: grade.score.toString(),
        maxScore: grade.maxScore.toString(),
        weight: (grade.weight * 100).toString()
      });
    }
  }, [grade]);

  const loadCourses = async () => {
    try {
      const data = await courseService.getAll();
      setCourses(data);
      if (!grade && data.length > 0) {
        setFormData((prev) => ({ ...prev, courseId: data[0].Id.toString() }));
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
          category: data[0].name,
          weight: (data[0].weight * 100).toString()
        }));
      }
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.courseId) newErrors.courseId = "Please select a course";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.score || formData.score < 0) newErrors.score = "Score must be 0 or greater";
    if (!formData.maxScore || formData.maxScore <= 0) newErrors.maxScore = "Max score must be greater than 0";
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
        courseId: parseInt(formData.courseId),
        category: formData.category,
        title: formData.title,
        score: parseFloat(formData.score),
        maxScore: parseFloat(formData.maxScore),
        weight: parseFloat(formData.weight) / 100
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
    handleChange("category", categoryName);
    const selectedCategory = categories.find((c) => c.name === categoryName);
    if (selectedCategory) {
      handleChange("weight", (selectedCategory.weight * 100).toString());
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

      {categories.length > 0 ? (
        <Select
          label="Category"
          id="category"
          value={formData.category}
          onChange={(e) => handleCategoryChange(e.target.value)}
          error={errors.category}
        >
          {categories.map((cat) => (
            <option key={cat.Id} value={cat.name}>
              {cat.name} ({(cat.weight * 100).toFixed(0)}%)
            </option>
          ))}
        </Select>
      ) : (
        <Input
          label="Category"
          id="category"
          value={formData.category}
          onChange={(e) => handleChange("category", e.target.value)}
          error={errors.category}
          placeholder="Exams, Assignments, etc."
        />
      )}

      <Input
        label="Title"
        id="title"
        value={formData.title}
        onChange={(e) => handleChange("title", e.target.value)}
        error={errors.title}
        placeholder="Midterm Exam"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input
          label="Score"
          id="score"
          type="number"
          min="0"
          step="0.01"
          value={formData.score}
          onChange={(e) => handleChange("score", e.target.value)}
          error={errors.score}
          placeholder="85"
        />
        <Input
          label="Max Score"
          id="maxScore"
          type="number"
          min="1"
          step="0.01"
          value={formData.maxScore}
          onChange={(e) => handleChange("maxScore", e.target.value)}
          error={errors.maxScore}
          placeholder="100"
        />
        <Input
          label="Weight (%)"
          id="weight"
          type="number"
          min="0"
          max="100"
          step="1"
          value={formData.weight}
          onChange={(e) => handleChange("weight", e.target.value)}
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