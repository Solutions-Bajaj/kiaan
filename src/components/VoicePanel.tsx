
import React, { useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import SolutionsBajajAI from './SolutionsBajajAI';

interface VoicePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const VoicePanel: React.FC<VoicePanelProps> = ({ isOpen, onClose }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  
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
          "w-[80vw] h-[80vh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        {/* Futuristic background elements */}
        <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 blur-3xl" />
          <div className="absolute top-1/3 -left-12 w-24 h-24 rounded-full bg-gradient-to-r from-purple-400 to-blue-300 blur-2xl" />
          <div className="absolute -bottom-12 left-1/3 w-32 h-32 rounded-full bg-gradient-to-r from-cyan-300 to-blue-200 blur-2xl" />
          
          {/* Grid lines */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzIwNzZmZiIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIgLz48L3N2Zz4=')]" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse" />
            <h2 className="text-lg font-medium text-slate-700">Kiaan</h2>
          </div>
          <div className="flex items-center">
            <button 
              onClick={onClose} 
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Close Kiaan Voice Assistant"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Voice Assistant Container - centered content */}
        <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
          {isOpen && <SolutionsBajajAI agentId="S4i7eNeg211h4p6hHRXK" />}
        </div>

        {/* Footer */}
        <div className="p-3 text-center text-xs text-slate-400 border-t border-slate-100">
          <a href="https://solutionsbajaj.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">
            Powered by Solutions Bajaj
          </a>
        </div>
      </div>
    </>
  );
};

export default VoicePanel;
