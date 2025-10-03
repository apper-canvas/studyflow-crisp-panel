import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Select from "@/components/atoms/Select";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";

function StudentForm({ student, onSubmit, onCancel }) {
const [formData, setFormData] = useState({
    name_c: student?.name_c || '',
    email_c: student?.email_c || '',
    phone_c: student?.phone_c || '',
    enrollment_date_c: student?.enrollment_date_c || '',
    major_c: student?.major_c || '',
    year_c: student?.year_c || 'Freshman',
    gpa_c: student?.gpa_c || ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

if (!formData.name_c.trim()) {
      newErrors.name_c = 'Name is required';
    }

    if (!formData.email_c.trim()) {
      newErrors.email_c = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_c)) {
      newErrors.email_c = 'Invalid email format';
    }

    if (!formData.enrollment_date_c) {
      newErrors.enrollment_date_c = 'Enrollment date is required';
    }

    if (!formData.major_c.trim()) {
      newErrors.major_c = 'Major is required';
    }

    if (formData.gpa_c && (isNaN(formData.gpa_c) || formData.gpa_c < 0 || formData.gpa_c > 4.0)) {
      newErrors.gpa_c = 'GPA must be between 0.0 and 4.0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
name_c: formData.name_c,
        email_c: formData.email_c,
        phone_c: formData.phone_c,
        enrollment_date_c: formData.enrollment_date_c,
        major_c: formData.major_c,
        year_c: formData.year_c,
        gpa_c: formData.gpa_c ? parseFloat(formData.gpa_c) : null
      });
    }
  };

return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Input
            label="Full Name"
            name="name_c"
            value={formData.name_c}
            onChange={handleChange}
            error={errors.name_c}
            required
          />
        </div>

        <Input
          label="Email"
          type="email"
          name="email_c"
          value={formData.email_c}
          onChange={handleChange}
          error={errors.email_c}
          required
        />

        <Input
          label="Phone"
          type="tel"
          name="phone_c"
          value={formData.phone_c}
          onChange={handleChange}
          error={errors.phone_c}
        />

        <Input
          label="Enrollment Date"
          type="date"
          name="enrollment_date_c"
          value={formData.enrollment_date_c}
          onChange={handleChange}
          error={errors.enrollment_date_c}
          required
        />

        <Input
          label="Major"
          name="major_c"
          value={formData.major_c}
          onChange={handleChange}
          error={errors.major_c}
          placeholder="e.g., Computer Science"
          required
        />

        <Select
          label="Year"
          name="year_c"
          value={formData.year_c}
          onChange={handleChange}
          error={errors.year_c}
          required
        >
          <option value="Freshman">Freshman</option>
          <option value="Sophomore">Sophomore</option>
          <option value="Junior">Junior</option>
          <option value="Senior">Senior</option>
        </Select>

        <Input
          label="GPA"
          type="number"
          name="gpa_c"
          value={formData.gpa_c}
          onChange={handleChange}
          error={errors.gpa_c}
          step="0.01"
          placeholder="3.75"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          icon={<ApperIcon name="X" size={18} />}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          icon={<ApperIcon name={student ? "Save" : "Plus"} size={18} />}
        >
          {student ? 'Update Student' : 'Add Student'}
        </Button>
      </div>
    </form>
  );
}

export default StudentForm;