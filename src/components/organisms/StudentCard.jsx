import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ConfirmDialog from '@/components/molecules/ConfirmDialog';

function StudentCard({ student, onEdit, onDelete }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    onDelete(student.Id);
    setShowDeleteDialog(false);
  };

  const getYearColor = (year) => {
    const colors = {
      'Freshman': 'bg-blue-100 text-blue-700',
      'Sophomore': 'bg-green-100 text-green-700',
      'Junior': 'bg-yellow-100 text-yellow-700',
      'Senior': 'bg-purple-100 text-purple-700'
    };
    return colors[year] || 'bg-slate-100 text-slate-700';
  };

  const formatGPA = (gpa) => {
    return gpa ? gpa.toFixed(2) : 'N/A';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-all duration-300">
        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-800">{student.name}</h3>
              <p className="text-sm text-slate-600 mt-1">{student.major}</p>
            </div>
            <Badge className={getYearColor(student.year)}>
              {student.year}
            </Badge>
          </div>

          {/* Contact Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <ApperIcon name="Mail" size={16} className="text-slate-400" />
              <span className="truncate">{student.email}</span>
            </div>
            {student.phone && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <ApperIcon name="Phone" size={16} className="text-slate-400" />
                <span>{student.phone}</span>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <ApperIcon name="GraduationCap" size={16} className="text-primary" />
              <span className="text-sm font-medium text-slate-700">GPA: {formatGPA(student.gpa)}</span>
            </div>
            <div className="flex items-center gap-2">
              <ApperIcon name="Calendar" size={16} className="text-slate-400" />
              <span className="text-xs text-slate-500">{formatDate(student.enrollmentDate)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(student)}
              className="flex-1"
              icon={<ApperIcon name="Edit" size={16} />}
            >
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              className="text-error hover:bg-error hover:text-white border-error"
              icon={<ApperIcon name="Trash2" size={16} />}
            >
              Delete
            </Button>
          </div>
        </div>
      </Card>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Student"
        message={`Are you sure you want to delete ${student.name}? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </>
  );
}

export default StudentCard;