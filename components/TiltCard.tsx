import React from 'react';
import { motion } from 'framer-motion';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  intensity?: number;
  scale?: number;
}

const TiltCard: React.FC<TiltCardProps> = ({ 
  children, 
  className = '',
  delay = 0,
  intensity = 10,
  scale = 1.05
}) => {
  const [rotation, setRotation] = React.useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateY = ((x - centerX) / centerX) * intensity;
    const rotateX = ((centerY - y) / centerY) * intensity;
    
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  return (
    <motion.div
      className={`perspective-1000 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ scale: 1 }}
      animate={{ 
        scale: isHovered ? scale : 1,
        transition: { duration: 0.3, delay }
      }}
    >
      <motion.div
        className="relative w-full h-full rounded-2xl shadow-lg transition-all duration-300 will-change-transform"
        animate={{
          rotateX: rotation.x,
          rotateY: rotation.y,
        }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 20,
          mass: 1
        }}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default TiltCard;