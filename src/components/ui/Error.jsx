import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center min-h-[400px]"
    >
      <div className="text-center max-w-md mx-auto p-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring" }}
          className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-error/10 to-error/5 rounded-full flex items-center justify-center"
        >
          <ApperIcon name="AlertCircle" className="w-10 h-10 text-error" />
        </motion.div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">Oops!</h3>
        <p className="text-slate-600 mb-6">{message}</p>
        {onRetry && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRetry}
            className="px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-shadow"
          >
            Try Again
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default Error;