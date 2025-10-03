import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  children, 
  variant = "primary", 
  size = "md", 
  className,
  disabled,
  loading,
  icon,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-primary-dark text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
    secondary: "bg-white text-primary border-2 border-primary hover:bg-primary/5 active:bg-primary/10",
    outline: "border-2 border-slate-300 text-slate-700 hover:border-primary hover:text-primary hover:bg-primary/5",
    ghost: "text-slate-700 hover:bg-slate-100 active:bg-slate-200",
    danger: "bg-gradient-to-r from-error to-red-600 text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
    success: "bg-gradient-to-r from-success to-green-600 text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-6 py-3 text-lg"
  };

  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      disabled={disabled || loading}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {loading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
        />
      ) : icon ? (
        icon
      ) : null}
      {children}
    </motion.button>
  );
});

Button.displayName = "Button";

export default Button;