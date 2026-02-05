
import React from 'react';
import { motion } from 'framer-motion';

const MotionDiv = motion.div as any;

const LoadingScreen: React.FC = () => {
  return (
    <MotionDiv
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center"
    >
      <div className="flex flex-col items-center gap-8">
        <div className="flex flex-col items-center">
           <MotionDiv
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="text-2xl md:text-4xl font-black tracking-tighter uppercase text-white mb-2"
           >
              YESWANTHRAM
           </MotionDiv>
           <div className="mono text-[10px] tracking-[0.6em] text-white/30 uppercase">
              Initializing Core
           </div>
        </div>

        <div className="w-48 h-[1px] bg-white/5 relative overflow-hidden">
          <MotionDiv
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-white"
          />
        </div>
      </div>
    </MotionDiv>
  );
};

export default LoadingScreen;
