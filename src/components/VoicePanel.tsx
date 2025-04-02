
import React, { useRef, useState } from 'react';
import { X, Terminal, Code, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import SolutionsBajajAI from './SolutionsBajajAI';

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
  
  // When the panel is open, prevent body scrolling
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle close with page refresh
  const handleClose = () => {
    onClose();
    // Add a small delay to ensure the panel closing animation has time to start
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <>
      {/* Full-screen overlay to prevent clicks on background */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
          onClick={(e) => e.stopPropagation()} // Prevent clicks from propagating
        />
      )}
      
      <div
        ref={panelRef}
        className={cn(
          "fixed z-40 flex flex-col rounded-2xl shadow-xl transition-all duration-500 ease-in-out",
          "bg-white/90 backdrop-blur-md border border-slate-200 overflow-hidden",
          // Always use fullscreen dimensions
          "w-[90vw] h-[85vh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse" />
            <h2 className="text-lg font-medium text-slate-700">Kiaan</h2>
          </div>
          <div className="flex items-center">
            <button 
              onClick={handleClose} 
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Close Kiaan Voice Assistant"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Main Content Area with a flex-1 to take up all available space */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Split View Container - with fixed height that doesn't include footer */}
          <div className="flex flex-col md:flex-row h-full overflow-hidden">
            {/* Left Column - Agent Terminal with transparent background */}
            <div className="w-full md:w-1/2 border-r border-slate-200 bg-transparent text-green-400 p-2 font-mono text-sm overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-2 text-xs text-slate-400 border-b border-slate-700 pb-2">
                <div className="flex items-center gap-2">
                  <Terminal size={14} />
                  <span>Agent Terminal</span>
                </div>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                {terminalMessages.map((msg, index) => (
                  <div key={index} className="mb-1 opacity-80">
                    <span className="text-blue-400 mr-2">&gt;</span>
                    <span>{msg}</span>
                  </div>
                ))}
                
                <div className="flex items-center mt-3 text-slate-400">
                  <ChevronsRight size={14} className="mr-1" />
                  <span className="animate-pulse">_</span>
                </div>
              </div>
              
              <div className="mt-2 border-t border-slate-700 pt-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Code size={12} />
                  <span>System: Kiaan AI v2.4.1</span>
                </div>
              </div>
            </div>
            
            {/* Right Column - Voice Assistant Content */}
            <div className="w-full md:w-1/2 flex items-center justify-center overflow-hidden">
              {isOpen && <SolutionsBajajAI agentId="S4i7eNeg211h4p6hHRXK" />}
            </div>
          </div>
        </div>

        {/* Footer - Now positioned at the bottom with borders */}
        <div className="mt-auto border-t border-slate-200 p-4">
          {/* The footer is now outside of the flex-1 container, ensuring it stays at the bottom */}
          <div className="flex justify-center space-x-4">
            {/* The mode buttons are now handled directly by SolutionsBajajAI but positioned in this footer */}
          </div>
        </div>
      </div>
    </>
  );
};

export default VoicePanel;
