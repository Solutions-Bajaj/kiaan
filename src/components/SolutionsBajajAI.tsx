
import React, { useState, useEffect } from 'react';
import { Mic, PhoneOff, MessageCircle, Users, MessageSquare, PaperclipIcon } from 'lucide-react';
import { useConversation } from '@11labs/react';
import { Button } from './ui/button';
import ChatInterface from './ChatInterface';
import { useIsMobile } from '../hooks/use-mobile';

interface SolutionsBajajAIProps {
  agentId: string;
  onActiveStateChange?: (isActive: boolean) => void;
  callActive?: boolean;
}

type Role = 'assistant' | 'user' | 'system' | 'ai';

interface ConversationMessage {
  message: string;
  source: Role;
  is_final?: boolean;
}

type InteractionMode = 'chat' | 'meeting' | 'text-chat';

const SolutionsBajajAI: React.FC<SolutionsBajajAIProps> = ({ 
  agentId, 
  onActiveStateChange,
  callActive 
}) => {
  const [isWaitingForMicPermission, setIsWaitingForMicPermission] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [mode, setMode] = useState<InteractionMode>('chat');
  const isMobile = useIsMobile();
  
  // Define agent IDs for different modes
  const AGENTS = {
    chat: agentId,
    meeting: '0OxkgMLQJmZuT23PE2Cv'
  };

  // Define webhook URL for text chat mode
  const WEBHOOK_URL = "https://choco.solutionsbajaj.com/webhook/sberpkiaan";

  // Initialize the ElevenLabs conversation hook
  const conversation = useConversation({
    onMessage: (message: ConversationMessage) => {
      console.log('Received message:', message);
      
      if (message.source === 'assistant' || message.source === 'ai') {
        setMessages(prev => [...prev, { role: 'assistant', content: message.message }]);
      } else if (message.source === 'user') {
        if (message.is_final) {
          setMessages(prev => [...prev, { role: 'user', content: message.message }]);
        }
      }
    },
    onError: (error) => {
      console.error('Conversation error:', error);
    },
    onConnect: () => {
      console.log('Connected to ElevenLabs');
    },
    onDisconnect: () => {
      console.log('Disconnected from ElevenLabs');
    }
  });

  const { status, isSpeaking } = conversation;

  const handleStart = async () => {
    try {
      setIsWaitingForMicPermission(true);
      
      // Check if microphone permission is already granted
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Important: Release the stream to avoid permission issues
      stream.getTracks().forEach(track => track.stop());
      
      // Start the conversation with the agent ID based on current mode
      await conversation.startSession({ 
        agentId: AGENTS[mode === 'text-chat' ? 'chat' : mode] 
      });
      
      setIsWaitingForMicPermission(false);
      
      // Notify parent component that the agent is now active
      if (onActiveStateChange) {
        onActiveStateChange(true);
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
      setIsWaitingForMicPermission(false);
    }
  };

  const handleStop = async () => {
    try {
      await conversation.endSession();
      setMessages([]);
      
      // Notify parent component that the agent is now inactive
      if (onActiveStateChange) {
        onActiveStateChange(false);
      }
    } catch (error) {
      console.error('Error ending conversation:', error);
    }
  };

  // Update active state based on conversation status and mode
  useEffect(() => {
    if (onActiveStateChange) {
      // Agent is active if connected in voice mode or in text-chat mode with messages
      const isActive = (status === 'connected') || 
                       (mode === 'text-chat' && messages.length > 0);
      onActiveStateChange(isActive);
    }
  }, [status, mode, messages.length, onActiveStateChange]);

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (status === 'connected') {
        conversation.endSession();
        if (onActiveStateChange) {
          onActiveStateChange(false);
        }
      }
    };
  }, [status]);

  const isConnected = status === 'connected';
  const isPending = isWaitingForMicPermission || status === 'connecting';

  // Determine if any voice mode is active
  const isVoiceModeActive = isConnected && (mode === 'chat' || mode === 'meeting');

  const handleModeChange = (newMode: InteractionMode) => {
    // Don't allow mode changes when a voice call is active
    if (isVoiceModeActive) {
      return;
    }
    
    setMode(newMode);
    // If we're already connected, restart the conversation with the new mode
    if (isConnected && newMode !== 'text-chat') {
      handleStop().then(() => {
        handleStart();
      });
    } else if (isConnected && mode !== 'text-chat' && newMode === 'text-chat') {
      // If switching to text chat from voice, just stop the voice conversation
      handleStop();
    }
  };

  // Track chat activity for the text chat mode
  const handleChatActivity = (hasActivity: boolean) => {
    if (mode === 'text-chat' && onActiveStateChange) {
      onActiveStateChange(hasActivity);
    }
  };

  // Main content rendering
  const renderMainContent = () => {
    if (mode === 'text-chat') {
      return (
        <div className="text-center w-full h-full flex flex-col z-10">
          <h3 className="text-xl font-medium text-slate-700 py-1">Chat with Kiaan</h3>
          <div className="flex-1 overflow-hidden flex flex-col">
            <ChatInterface 
              webhookUrl={WEBHOOK_URL} 
              onActivityChange={handleChatActivity}
            />
          </div>
        </div>
      );
    }
    
    return (
      <div className="text-center space-y-4 md:space-y-6 max-w-md z-10 px-2">
        <h3 className="text-xl font-medium text-slate-700">
          {mode === 'chat' ? 'Talk With Kiaan' : 'Meeting Mode'}
        </h3>
        
        {/* Debug message showing current status */}
        <div className="text-sm text-slate-500">
          Status: {status} {isPending ? "(Connecting...)" : ""}
          {isConnected && isSpeaking ? " (Agent is speaking)" : ""}
        </div>
        
        <div className="flex items-center justify-center gap-4">
          {/* Main microphone button */}
          {!isConnected ? (
            <button
              onClick={handleStart}
              disabled={isPending}
              className={`relative w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all ${
                isPending
                  ? "bg-indigo-100 text-indigo-500 animate-pulse"
                  : "bg-gradient-to-r from-blue-400 to-purple-400 text-white hover:shadow-lg hover:scale-105"
              }`}
              aria-label="Start conversation"
            >
              {isPending ? (
                <div className="animate-spin rounded-full h-5 w-5 md:h-6 md:w-6 border-b-2 border-indigo-500"></div>
              ) : (
                <Mic className="w-6 h-6 md:w-8 md:h-8" />
              )}
            </button>
          ) : (
            <>
              {/* Hang Up Button */}
              <button
                onClick={handleStop}
                className="relative w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all bg-red-500 text-white hover:bg-red-600"
                aria-label="End conversation"
              >
                <PhoneOff className="w-6 h-6 md:w-8 md:h-8" />
              </button>
            </>
          )}
        </div>
        
        <p className="text-sm text-slate-500 mt-2">
          {isPending
            ? "Waiting for microphone permission..."
            : isConnected
              ? isSpeaking 
                ? mode === 'chat' ? "Kiaan is speaking..." : "In meeting mode..."
                : mode === 'chat' ? "Kiaan is listening..." : "Meeting mode is listening..."
              : mode === 'chat' 
                ? "Tap the microphone to start speaking with Kiaan" 
                : "Tap the microphone to start a meeting"}
        </p>
        
        {isVoiceModeActive && (
          <div className="text-xs text-amber-600 mt-2 p-2 bg-amber-50 rounded-md">
            Please end your current call before switching modes
          </div>
        )}
      </div>
    );
  };

  // Animations for voice modes - simplified for mobile
  const renderVoiceAnimations = () => {
    if (mode === 'text-chat' || isMobile) return null;
    
    // Only render full animations on desktop
    return (
      <div 
        className="absolute inset-0 flex items-center justify-center overflow-hidden z-0 pointer-events-none"
      >
        {/* Speaking animation - outward movement */}
        {isConnected && isSpeaking && (
          <div className="relative">
            {[...Array(5)].map((_, i) => (
              <div
                key={`speak-ring-${i}`}
                className="absolute rounded-full border border-blue-400/30"
                style={{
                  width: `${100 + i * 40}px`,
                  height: `${100 + i * 40}px`,
                  animation: `speakPulseOut ${1.5 + i * 0.3}s infinite ease-out`,
                  animationDelay: `${i * 0.2}s`,
                  opacity: 0.7 - i * 0.1,
                }}
              />
            ))}
          </div>
        )}
        
        {/* Listening animation - inward movement */}
        {isConnected && !isSpeaking && (
          <div className="relative">
            {[...Array(5)].map((_, i) => (
              <div
                key={`listen-ring-${i}`}
                className="absolute rounded-full border border-green-400/30"
                style={{
                  width: `${300 - i * 40}px`,
                  height: `${300 - i * 40}px`,
                  animation: `listenPulseIn ${1.5 + i * 0.3}s infinite ease-in`,
                  animationDelay: `${i * 0.2}s`,
                  opacity: 0.7 - i * 0.1,
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  // Render the mode buttons - optimized for mobile
  const renderModeButtons = () => {
    return (
      <div className={`flex justify-center ${isMobile ? 'flex-wrap gap-2' : 'space-x-4'}`}>
        <Button 
          variant={mode === 'chat' ? 'default' : 'outline'} 
          className={`flex items-center gap-1 text-xs md:text-sm md:gap-2 ${mode === 'chat' ? 'bg-gradient-to-r from-blue-400 to-purple-400' : ''}`}
          onClick={() => handleModeChange('chat')}
          disabled={isVoiceModeActive} // Disable when in voice call
          size={isMobile ? "sm" : "default"}
        >
          <MessageCircle className="w-3 h-3 md:w-4 md:h-4" />
          Talk
        </Button>
        
        <Button 
          variant={mode === 'meeting' ? 'default' : 'outline'} 
          className={`flex items-center gap-1 text-xs md:text-sm md:gap-2 ${mode === 'meeting' ? 'bg-gradient-to-r from-blue-400 to-purple-400' : ''}`}
          onClick={() => handleModeChange('meeting')}
          disabled={isVoiceModeActive} // Disable when in voice call
          size={isMobile ? "sm" : "default"}
        >
          <Users className="w-3 h-3 md:w-4 md:h-4" />
          Meeting
        </Button>
        
        <Button 
          variant={mode === 'text-chat' ? 'default' : 'outline'} 
          className={`flex items-center gap-1 text-xs md:text-sm md:gap-2 ${mode === 'text-chat' ? 'bg-gradient-to-r from-blue-400 to-purple-400' : ''}`}
          onClick={() => handleModeChange('text-chat')}
          disabled={isVoiceModeActive} // Disable when in voice call
          size={isMobile ? "sm" : "default"}
        >
          <MessageSquare className="w-3 h-3 md:w-4 md:h-4" />
          Chat
        </Button>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-between relative p-2 md:p-4">
      {/* Voice animations */}
      {renderVoiceAnimations()}
      
      {/* Main content area */}
      <div className="flex-1 w-full flex items-center justify-center overflow-hidden">
        {renderMainContent()}
      </div>
      
      {/* Mode buttons */}
      {renderModeButtons()}
    </div>
  );
};

export default SolutionsBajajAI;
