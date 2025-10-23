import React from 'react';
import { motion } from 'framer-motion';

interface FloatingElementProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  intensity?: number;
  duration?: number;
}

const FloatingElement: React.FC<FloatingElementProps> = ({ 
  children, 
  className = '',
  delay = 0,
  intensity = 1,
  duration = 3
}) => {
  return (
    <motion.div
      className={className}
      initial={{ y: 0 }}
      animate={{ 
        y: [-intensity * 10, intensity * 10, -intensity * 10] 
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
};

export default FloatingElement;