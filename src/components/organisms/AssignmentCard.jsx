import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import { getRelativeDate, getDueDateStatus } from "@/utils/dateHelpers";

const AssignmentCard = ({ assignment, course, onStatusChange, onEdit, onDelete }) => {
  const dueDateInfo = getDueDateStatus(assignment.dueDate);

  const priorityConfig = {
    low: { color: "default", icon: "ArrowDown" },
    medium: { color: "info", icon: "Minus" },
    high: { color: "error", icon: "ArrowUp" }
  };

  const statusConfig = {
    pending: { color: "default", icon: "Circle" },
    "in-progress": { color: "warning", icon: "Clock" },
    completed: { color: "success", icon: "CheckCircle2" }
  };

  const priority = priorityConfig[assignment.priority];
  const status = statusConfig[assignment.status];

  const handleStatusClick = (e) => {
    e.stopPropagation();
    const statuses = ["pending", "in-progress", "completed"];
    const currentIndex = statuses.indexOf(assignment.status);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    onStatusChange(assignment.Id, nextStatus);
  };

  return (
    <Card hover className="group">
      <div className="flex items-start gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleStatusClick}
          className="flex-shrink-0 mt-1"
        >
          <ApperIcon
            name={status.icon}
            size={24}
            className={`${
              assignment.status === "completed" ? "text-success" : "text-slate-400"
            } transition-colors`}
          />
        </motion.button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 mb-1">{assignment.title}</h3>
              {assignment.description && (
                <p className="text-sm text-slate-600 line-clamp-2">{assignment.description}</p>
              )}
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onEdit(assignment)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ApperIcon name="Edit2" size={16} className="text-slate-600" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onDelete(assignment)}
                className="p-2 hover:bg-error/10 rounded-lg transition-colors"
              >
                <ApperIcon name="Trash2" size={16} className="text-error" />
              </motion.button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-3">
            {course && (
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: course.color }}
                />
                <span className="text-sm text-slate-600">{course.courseCode}</span>
              </div>
            )}
            <Badge variant={dueDateInfo.color} size="sm">
              <ApperIcon name="Calendar" size={12} className="mr-1" />
              {getRelativeDate(assignment.dueDate)}
            </Badge>
            <Badge variant={priority.color} size="sm">
              <ApperIcon name={priority.icon} size={12} className="mr-1" />
              {assignment.priority}
            </Badge>
            <Badge variant={status.color} size="sm">
              <ApperIcon name={status.icon} size={12} className="mr-1" />
              {assignment.status}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AssignmentCard;