
import React, { useEffect, useRef, useState } from 'react';
import { Mic } from 'lucide-react';

interface SolutionsBajajAIProps {
  agentId: string;
}

const SolutionsBajajAI: React.FC<SolutionsBajajAIProps> = ({ agentId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // We'll still load the script but we won't use the widget directly
    if (!document.querySelector('script[src="https://elevenlabs.io/convai-widget/index.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://elevenlabs.io/convai-widget/index.js';
      script.async = true;
      script.type = 'text/javascript';
      document.body.appendChild(script);
    }
  }, []);

  const initializeConversation = () => {
    setIsConnecting(true);
    // In a real implementation, we would connect to the agent API here
    // For now, we'll just simulate the connection
    setTimeout(() => {
      setIsConnecting(false);
    }, 1500);
  };

  return (
    <div ref={containerRef} className="w-full h-full flex flex-col items-center justify-center">
      <div className="text-center space-y-4">
        <h3 className="text-xl font-medium text-slate-700 mb-4">Talk With Kiaan</h3>
        
        <button
          onClick={initializeConversation}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
            isConnecting 
              ? "bg-indigo-100 text-indigo-500 animate-pulse" 
              : "bg-gradient-to-r from-blue-400 to-purple-400 text-white hover:shadow-lg hover:scale-105"
          }`}
          disabled={isConnecting}
        >
          <Mic className="w-8 h-8" />
        </button>
        
        <p className="text-sm text-slate-500 mt-4">
          {isConnecting 
            ? "Connecting..." 
            : "Tap the microphone to start speaking with Kiaan"}
        </p>
      </div>
    </div>
  );
};

export default SolutionsBajajAI;
