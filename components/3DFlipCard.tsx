import React from 'react';
import { motion } from 'framer-motion';

interface FlipCardProps {
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  className?: string;
  delay?: number;
}

const FlipCard: React.FC<FlipCardProps> = ({ 
  frontContent, 
  backContent, 
  className = '',
  delay = 0
}) => {
  const [isFlipped, setIsFlipped] = React.useState(false);

  return (
    <div 
      className={`cursor-pointer perspective-1000 ${className}`}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-full preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ 
          duration: 0.6,
          delay
        }}
      >
        <div className="absolute inset-0 backface-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg p-6 flex flex-col">
          {frontContent}
        </div>
        <div 
          className="absolute inset-0 backface-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-dark p-6 flex flex-col text-white rotate-y-180"
          style={{ transform: 'rotateY(180deg)' }}
        >
          {backContent}
        </div>
      </motion.div>
    </div>
  );
};

export default FlipCard;