
import React, { useState, useEffect, useRef } from 'react';
import { Mic } from 'lucide-react';
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
        "bg-gradient-to-r from-blue-400 to-cyan-300 hover:from-blue-500 hover:to-cyan-400",
        "border-2 border-white/10 backdrop-blur-sm",
        isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100",
        isPulsing ? "animate-pulse" : ""
      )}
      aria-label="Open Kiaan Voice Assistant"
    >
      <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <Mic className="h-6 w-6 text-white" />
      <div 
        className={cn(
          "absolute -inset-2 rounded-full bg-blue-400/20 transition-all duration-1000",
          isPulsing ? "scale-110 opacity-100" : "scale-100 opacity-0"
        )} 
      />
    </button>
  );
};

export default VoiceOrb;
