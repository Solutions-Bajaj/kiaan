
import React, { useState, useEffect } from 'react';

interface AgentAnimationProps {
  isActive: boolean;
  messages: string[];
}

const AgentAnimation: React.FC<AgentAnimationProps> = ({ isActive, messages }) => {
  const [animationState, setAnimationState] = useState<'idle' | 'transitioning' | 'active'>('idle');
  
  useEffect(() => {
    if (isActive) {
      setAnimationState('transitioning');
      const timer = setTimeout(() => {
        setAnimationState('active');
      }, 2000); // Transition takes 2 seconds
      return () => clearTimeout(timer);
    } else {
      setAnimationState('idle');
    }
  }, [isActive]);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 relative overflow-hidden">
        {/* Matrix-style code rain background with lighter opacity */}
        <div className="absolute inset-0 matrix-rain opacity-20"></div>
        
        {/* Grid overlay with lighter colors */}
        <div className="absolute inset-0 grid-overlay"></div>
        
        {/* Agent visualization container */}
        <div className="absolute inset-0 flex items-center justify-center">
          {animationState === 'idle' && (
            <div className="agent-idle">
              {/* Floating objects */}
              <div className="floating-object floating-object-1"></div>
              <div className="floating-object floating-object-2"></div>
              <div className="floating-object floating-object-3"></div>
              <div className="floating-object floating-object-4"></div>
              <div className="floating-object floating-object-5"></div>
              
              {/* New sphere animation with lighter colors */}
              <div className="sphere-container">
                <div className="sphere-outer"></div>
                <div className="sphere-middle"></div>
                <div className="sphere-inner"></div>
                <div className="particle-container">
                  {[...Array(20)].map((_, i) => (
                    <div key={i} className={`particle particle-${i + 1}`}></div>
                  ))}
                </div>
              </div>
              <div className="orbit orbit-1"></div>
              <div className="orbit orbit-2"></div>
              <div className="orbit orbit-3"></div>
              <div className="orbit orbit-4">
                <div className="traveling-dot traveling-dot-1"></div>
                <div className="traveling-dot traveling-dot-2"></div>
                <div className="traveling-dot traveling-dot-3"></div>
              </div>
            </div>
          )}
          
          {animationState === 'transitioning' && (
            <div className="agent-transition">
              <div className="agent-core transition-core"></div>
              <div className="ring ring-1 transition-ring-1"></div>
              <div className="ring ring-2 transition-ring-2"></div>
              <div className="ring ring-3 transition-ring-3"></div>
              <div className="transition-mask"></div>
              <div className="transition-face"></div>
            </div>
          )}
          
          {animationState === 'active' && (
            <div className="agent-active">
              <div className="agent-face"></div>
              <div className="circuit-paths"></div>
              <div className="data-points active-data-points"></div>
              <div className="glow-eyes left"></div>
              <div className="glow-eyes right"></div>
            </div>
          )}
        </div>
        
        {/* Terminal messages overlay - only shown when active */}
        <div className={`absolute bottom-0 left-0 right-0 p-2 transition-opacity duration-500 ${animationState === 'active' ? 'opacity-80' : 'opacity-0'}`}>
          <div className="terminal-messages max-h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            {messages.map((msg, index) => (
              <div key={index} className="mb-1 text-xs">
                <span className="text-blue-400 mr-2">&gt;</span>
                <span className="text-green-400">{msg}</span>
              </div>
            ))}
            
            <div className="flex items-center mt-1 text-slate-400 text-xs">
              <span className="mr-1">&gt;</span>
              <span className="animate-pulse">_</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentAnimation;
