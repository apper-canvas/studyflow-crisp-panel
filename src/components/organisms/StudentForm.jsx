import { useState } from 'react';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

function StudentForm({ student, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: student?.name || '',
    email: student?.email || '',
    phone: student?.phone || '',
    enrollmentDate: student?.enrollmentDate || '',
    major: student?.major || '',
    year: student?.year || 'Freshman',
    gpa: student?.gpa || ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.enrollmentDate) {
      newErrors.enrollmentDate = 'Enrollment date is required';
    }

    if (!formData.major.trim()) {
      newErrors.major = 'Major is required';
    }

    if (formData.gpa && (isNaN(formData.gpa) || formData.gpa < 0 || formData.gpa > 4.0)) {
      newErrors.gpa = 'GPA must be between 0.0 and 4.0';
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
        ...formData,
        gpa: formData.gpa ? parseFloat(formData.gpa) : null
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Input
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter student name"
            error={errors.name}
            required
          />
        </div>

        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="student@university.edu"
          error={errors.email}
          required
        />

        <Input
          label="Phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="(555) 123-4567"
          error={errors.phone}
        />

        <Input
          label="Enrollment Date"
          name="enrollmentDate"
          type="date"
          value={formData.enrollmentDate}
          onChange={handleChange}
          error={errors.enrollmentDate}
          required
        />

        <Input
          label="Major"
          name="major"
          value={formData.major}
          onChange={handleChange}
          placeholder="Computer Science"
          error={errors.major}
          required
        />

        <Select
          label="Academic Year"
          name="year"
          value={formData.year}
          onChange={handleChange}
          required
        >
          <option value="Freshman">Freshman</option>
          <option value="Sophomore">Sophomore</option>
          <option value="Junior">Junior</option>
          <option value="Senior">Senior</option>
        </Select>

        <Input
          label="GPA"
          name="gpa"
          type="number"
          step="0.01"
          min="0"
          max="4.0"
          value={formData.gpa}
          onChange={handleChange}
          placeholder="3.75"
          error={errors.gpa}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
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