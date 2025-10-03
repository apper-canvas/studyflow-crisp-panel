import { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ onMenuClick, onAddClick }) => {
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ApperIcon name="Menu" size={24} className="text-slate-700" />
            </button>
            <div className="lg:hidden flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="GraduationCap" size={18} className="text-white" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                StudyFlow
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
<Button
                variant="primary"
                size="md"
                onClick={() => setShowQuickAdd(!showQuickAdd)}
                icon={<ApperIcon name="Plus" size={20} />}
              >
                <span className="hidden sm:inline">Quick Add</span>
              </Button>
              {showQuickAdd && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowQuickAdd(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-20"
                  >
                    <button
                      onClick={() => {
                        onAddClick("course");
                        setShowQuickAdd(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-3 transition-colors"
                    >
                      <ApperIcon name="BookOpen" size={18} className="text-primary" />
                      <span className="text-slate-700">Add Course</span>
                    </button>
                    <button
                      onClick={() => {
                        onAddClick("assignment");
                        setShowQuickAdd(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-3 transition-colors"
                    >
                      <ApperIcon name="ClipboardList" size={18} className="text-secondary" />
                      <span className="text-slate-700">Add Assignment</span>
                    </button>
                    <button
                      onClick={() => {
                        onAddClick("grade");
                        setShowQuickAdd(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-3 transition-colors"
                    >
                      <ApperIcon name="TrendingUp" size={18} className="text-accent" />
                      <span className="text-slate-700">Add Grade</span>
                    </button>
                    <button
                      onClick={() => {
                        onAddClick("student");
                        setShowQuickAdd(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-3 transition-colors"
                    >
                      <ApperIcon name="Users" size={18} className="text-info" />
                      <span className="text-slate-700">Add Student</span>
                    </button>
                  </motion.div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;