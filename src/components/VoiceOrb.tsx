
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
      
      {/* K logo with circuit elements */}
      <div className="relative w-6 h-6 flex items-center justify-center">
        {/* Main K shape */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute">
          <path 
            d="M8 4V20M8 13L16 20M8 11L16 4" 
            stroke="white" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          {/* Circuit lines */}
          <path 
            d="M4 8h4 M4 16h4 M16 8h4 M16 16h4 M18 4v4 M18 16v4" 
            stroke="#60a5fa" 
            strokeWidth="1" 
            strokeLinecap="round" 
            strokeOpacity="0.8"
          />
          {/* Connection dots */}
          <circle cx="8" cy="8" r="1" fill="#60a5fa" fillOpacity="0.8" />
          <circle cx="8" cy="16" r="1" fill="#60a5fa" fillOpacity="0.8" />
          <circle cx="16" cy="8" r="1" fill="#60a5fa" fillOpacity="0.8" />
          <circle cx="16" cy="16" r="1" fill="#60a5fa" fillOpacity="0.8" />
        </svg>
        
        {/* Glow effects */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute blur-[2px]">
          <path 
            d="M8 4V20M8 13L16 20M8 11L16 4" 
            stroke="#90cdf4" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeOpacity="0.5"
          />
        </svg>
        
        {/* Diffused background glow */}
        <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl"></div>
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
