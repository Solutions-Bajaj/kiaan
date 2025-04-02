import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface VoiceOrbProps {
  isOpen: boolean;
  onClick: () => void;
}

const VoiceOrb: React.FC<VoiceOrbProps> = ({ isOpen, onClick }) => {
  const [isPulsing, setIsPulsing] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const orbRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsPulsing(prev => !prev);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const defaultX = window.innerWidth - 80;
    const defaultY = window.innerHeight - 80;
    
    setPosition({ x: defaultX, y: defaultY });
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isOpen) return;
    
    setIsDragging(true);
    
    const offsetX = e.clientX - position.x;
    const offsetY = e.clientY - position.y;
    
    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - offsetX;
      const newY = e.clientY - offsetY;
      
      const orbSize = orbRef.current?.offsetWidth || 48;
      const maxX = window.innerWidth - orbSize;
      const maxY = window.innerHeight - orbSize;
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };
  
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isOpen) return;
    
    setIsDragging(true);
    
    const touch = e.touches[0];
    const offsetX = touch.clientX - position.x;
    const offsetY = touch.clientY - position.y;
    
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        
        const newX = touch.clientX - offsetX;
        const newY = touch.clientY - offsetY;
        
        const orbSize = orbRef.current?.offsetWidth || 48;
        const maxX = window.innerWidth - orbSize;
        const maxY = window.innerHeight - orbSize;
        
        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY))
        });
      }
    };
    
    const handleTouchEnd = () => {
      setIsDragging(false);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
    
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
  };
  
  const handleClick = (e: React.MouseEvent) => {
    if (!isDragging) {
      onClick();
    }
  };

  return (
    <button
      ref={orbRef}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      className={cn(
        "fixed z-50 flex items-center justify-center rounded-full p-3 shadow-lg transition-all duration-300 ease-in-out",
        "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600",
        "border-2 border-white/10 backdrop-blur-sm",
        "cursor-grab active:cursor-grabbing",
        isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100",
        isDragging ? "transition-none" : "",
        isPulsing ? "animate-pulse" : ""
      )}
      style={{
        bottom: 'auto',
        right: 'auto',
        transform: 'none',
        top: `${position.y}px`,
        left: `${position.x}px`,
      }}
      aria-label="Open Kiaan Voice Assistant"
    >
      <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      
      <div className="relative w-6 h-6 flex items-center justify-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute">
          <path 
            d="M8 4V20M8 13L16 20M8 11L16 4" 
            stroke="white" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path 
            d="M4 8h4 M4 16h4 M16 8h4 M16 16h4 M18 4v4 M18 16v4" 
            stroke="#60a5fa" 
            strokeWidth="1" 
            strokeLinecap="round" 
            strokeOpacity="0.8"
          />
          <circle cx="8" cy="8" r="1" fill="#60a5fa" fillOpacity="0.8" />
          <circle cx="8" cy="16" r="1" fill="#60a5fa" fillOpacity="0.8" />
          <circle cx="16" cy="8" r="1" fill="#60a5fa" fillOpacity="0.8" />
          <circle cx="16" cy="16" r="1" fill="#60a5fa" fillOpacity="0.8" />
        </svg>
        
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute blur-[2px]">
          <path 
            d="M8 4V20M8 13L16 20M8 11L16 4" 
            stroke="#90cdf4" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeOpacity="0.5"
          />
        </svg>
        
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
