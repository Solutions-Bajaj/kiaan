
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface VoiceOrbProps {
  isOpen: boolean;
  onClick: () => void;
}

const VoiceOrb: React.FC<VoiceOrbProps> = ({ isOpen, onClick }) => {
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsPulsing(prev => !prev);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed bottom-8 right-8 z-50 flex items-center justify-center rounded-full p-3 shadow-lg transition-all duration-500 ease-in-out",
        "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600",
        "border-2 border-white/10 backdrop-blur-sm",
        isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100",
        isPulsing ? "animate-pulse" : ""
      )}
      aria-label="Open Kiaan Voice Assistant"
    >
      <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      
      {/* Custom K icon with futuristic styling */}
      <div className="relative w-6 h-6 flex items-center justify-center text-white font-bold">
        <span className="absolute w-full h-full flex items-center justify-center transform -rotate-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M7 4V20M7 12L17 20M7 12L17 4" 
              stroke="white" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="absolute w-full h-full flex items-center justify-center text-blue-200 opacity-70 blur-[1px]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M7 4V20M7 12L17 20M7 12L17 4" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
      
      <div 
        className={cn(
          "absolute -inset-2 rounded-full bg-purple-400/20 transition-all duration-1000",
          isPulsing ? "scale-110 opacity-100" : "scale-100 opacity-0"
        )} 
      />
    </button>
  );
};

export default VoiceOrb;
