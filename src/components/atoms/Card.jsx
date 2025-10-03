import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Card = ({ children, className, hover = false, ...props }) => {
  const Component = hover ? motion.div : "div";
  const motionProps = hover ? {
    whileHover: { y: -4, boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)" },
    transition: { duration: 0.2 }
  } : {};

  return (
    <Component
      className={cn(
        "bg-white rounded-xl shadow-sm p-6 transition-shadow duration-200",
        className
      )}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Card;