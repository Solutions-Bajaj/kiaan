
import React, { useRef, useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import SolutionsBajajAI from './SolutionsBajajAI';
import AgentAnimation from './AgentAnimation';

interface VoicePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const VoicePanel: React.FC<VoicePanelProps> = ({ isOpen, onClose }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [terminalMessages, setTerminalMessages] = useState<string[]>([
    "Agent initializing...",
    "Loading NLP modules...",
    "Connecting to voice services...",
    "Kiaan Assistant ready."
  ]);
  
  const [isAgentActive, setIsAgentActive] = useState(false);
  
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setIsAgentActive(false);
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
          onClick={(e) => e.stopPropagation()}
        />
      )}
      
      <div
        ref={panelRef}
        className={cn(
          "fixed z-40 flex flex-col rounded-2xl shadow-xl transition-all duration-500 ease-in-out",
          "bg-gray-900 backdrop-blur-md border border-gray-800 overflow-hidden",
          "w-[90vw] h-[85vh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800 relative z-40 bg-gray-900/90 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse" />
            <h2 className="text-lg font-medium text-white">Kiaan</h2>
          </div>
          <div className="flex items-center">
            <button 
              onClick={handleClose} 
              className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors z-40"
              aria-label="Close Kiaan Voice Assistant"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex flex-col md:flex-row h-full overflow-hidden">
            <div className="w-full md:w-1/2 border-r border-gray-800 bg-transparent text-green-400 p-2 font-mono text-sm overflow-hidden flex flex-col relative z-5">
              <AgentAnimation isActive={isAgentActive} messages={terminalMessages} />
            </div>
            
            <div className="w-full md:w-1/2 flex items-center justify-center overflow-hidden relative z-20">
              {isOpen && (
                <SolutionsBajajAI 
                  agentId="S4i7eNeg211h4p6hHRXK" 
                  onActiveStateChange={(active) => setIsAgentActive(active)}
                />
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 p-4 relative z-40 bg-gray-900/90 backdrop-blur-md">
          <div className="flex justify-center space-x-4">
            {/* The mode buttons will be handled by SolutionsBajajAI */}
          </div>
        </div>
      </div>
    </>
  );
};

export default VoicePanel;
