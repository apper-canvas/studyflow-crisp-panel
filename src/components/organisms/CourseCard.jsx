import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";

const CourseCard = ({ course, grade, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const getGradeColor = (grade) => {
    if (grade >= 90) return "success";
    if (grade >= 80) return "primary";
    if (grade >= 70) return "warning";
    return "error";
  };

  return (
    <Card hover className="cursor-pointer group" onClick={() => navigate(`/courses/${course.Id}`)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center shadow-md"
style={{ backgroundColor: course.color_c }}
          />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors mb-1">
              {course.name_c}
            </h3>
<p className="text-sm text-slate-500">{course.course_code_c}</p>
          </div>
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(course);
            }}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ApperIcon name="Edit2" size={16} className="text-slate-600" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(course);
            }}
            className="p-2 hover:bg-error/10 rounded-lg transition-colors"
          >
            <ApperIcon name="Trash2" size={16} className="text-error" />
          </motion.button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <ApperIcon name="User" size={16} />
<span>{course.instructor_c}</span>
        </div>
        {course.schedule_c && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <ApperIcon name="Clock" size={16} />
            <span>{course.schedule_c}</span>
          </div>
        )}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
<ApperIcon name="Award" size={16} className="text-slate-500" />
            <span className="text-sm text-slate-600">{course.credits_c} Credits</span>
          </div>
          {grade !== undefined && (
            <Badge variant={getGradeColor(grade)} size="md">
              {grade.toFixed(1)}%
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CourseCard;