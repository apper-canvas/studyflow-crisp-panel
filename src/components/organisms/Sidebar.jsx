import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", path: "/", icon: "LayoutDashboard" },
    { name: "Courses", path: "/courses", icon: "BookOpen" },
    { name: "Assignments", path: "/assignments", icon: "ClipboardList" },
    { name: "Calendar", path: "/calendar", icon: "Calendar" },
    { name: "Grades", path: "/grades", icon: "TrendingUp" }
  ];

  const NavItem = ({ item }) => {
    const isActive = location.pathname === item.path;

    return (
      <NavLink
        to={item.path}
        onClick={() => onClose && onClose()}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
          isActive
            ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-md"
            : "text-slate-700 hover:bg-slate-100"
        }`}
      >
        <ApperIcon name={item.icon} size={20} />
        <span className="font-medium">{item.name}</span>
      </NavLink>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 bg-white border-r border-slate-200 h-full">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="GraduationCap" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                StudyFlow
              </h1>
              <p className="text-xs text-slate-500">Academic Manager</p>
            </div>
          </div>
          <nav className="space-y-2">
            {navigation.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 25 }}
            className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-white shadow-2xl z-50"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                    <ApperIcon name="GraduationCap" size={24} className="text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      StudyFlow
                    </h1>
                    <p className="text-xs text-slate-500">Academic Manager</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>
              <nav className="space-y-2">
                {navigation.map((item) => (
                  <NavItem key={item.path} item={item} />
                ))}
              </nav>
            </div>
          </motion.div>
        </>
      )}
    </>
  );
};

export default Sidebar;