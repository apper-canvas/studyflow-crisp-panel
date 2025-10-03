import { motion } from "framer-motion";

const GradeProgressRing = ({ value, size = 120, strokeWidth = 10, label, color }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  const getColorClass = () => {
    if (color) return color;
    if (value >= 90) return "#10b981";
    if (value >= 80) return "#3b82f6";
    if (value >= 70) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: "easeOut" }}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={getColorClass()}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">
              {value.toFixed(1)}
            </div>
            {label && <div className="text-xs text-slate-500">{label}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradeProgressRing;