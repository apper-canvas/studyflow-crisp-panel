import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const colors = [
  "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", 
  "#ef4444", "#06b6d4", "#ec4899", "#14b8a6",
  "#6366f1", "#f97316", "#84cc16", "#a855f7"
];

const CourseColorPicker = ({ value, onChange, label }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-3">
          {label}
        </label>
      )}
      <div className="grid grid-cols-6 gap-3">
        {colors.map((color) => (
          <motion.button
            key={color}
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(color)}
            className={cn(
              "w-10 h-10 rounded-lg transition-all duration-200",
              value === color && "ring-4 ring-primary/30 shadow-lg"
            )}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
};

export default CourseColorPicker;