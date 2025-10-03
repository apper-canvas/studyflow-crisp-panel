import { motion } from "framer-motion";

const Loading = ({ type = "default" }) => {
  if (type === "cards") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6 space-y-4"
          >
            <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-100 rounded animate-pulse" />
            <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-100 rounded w-2/3 animate-pulse" />
            <div className="space-y-2">
              <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-100 rounded animate-pulse" />
              <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-100 rounded w-5/6 animate-pulse" />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === "list") {
    return (
      <div className="space-y-4">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-slate-200 to-slate-100 rounded-lg animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-100 rounded w-1/3 animate-pulse" />
              <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-100 rounded w-2/3 animate-pulse" />
            </div>
            <div className="w-24 h-8 bg-gradient-to-r from-slate-200 to-slate-100 rounded animate-pulse" />
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full"
        />
        <p className="text-slate-600 font-medium">Loading...</p>
      </motion.div>
    </div>
  );
};

export default Loading;