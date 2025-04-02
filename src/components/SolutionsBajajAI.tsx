import React, { useState, useEffect } from 'react';
import { Mic, PhoneOff, MessageCircle, Users, MessageSquare } from 'lucide-react';
import { useConversation } from '@11labs/react';
import { Button } from './ui/button';
import ChatInterface from './ChatInterface';

interface SolutionsBajajAIProps {
  agentId: string;
  onActiveStateChange?: (isActive: boolean) => void;
}

type Role = 'assistant' | 'user' | 'system' | 'ai';

interface ConversationMessage {
  message: string;
  source: Role;
  is_final?: boolean;
}

type InteractionMode = 'chat' | 'meeting' | 'text-chat';

const SolutionsBajajAI: React.FC<SolutionsBajajAIProps> = ({ agentId, onActiveStateChange }) => {
  const [isWaitingForMicPermission, setIsWaitingForMicPermission] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [mode, setMode] = useState<InteractionMode>('chat');
  
  const AGENTS = {
    chat: agentId,
    meeting: '0OxkgMLQJmZuT23PE2Cv'
  };

  const WEBHOOK_URL = "https://choco.solutionsbajaj.com/webhook/sberpkiaan";

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
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      
      await conversation.startSession({ 
        agentId: AGENTS[mode === 'text-chat' ? 'chat' : mode] 
      });
      
      setIsWaitingForMicPermission(false);
      
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
      
      if (onActiveStateChange) {
        onActiveStateChange(false);
      }
    } catch (error) {
      console.error('Error ending conversation:', error);
    }
  };

  useEffect(() => {
    if (onActiveStateChange) {
      const isActive = (status === 'connected') || 
                       (mode === 'text-chat' && messages.length > 0);
      onActiveStateChange(isActive);
    }
  }, [status, mode, messages.length, onActiveStateChange]);

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

  const handleModeChange = (newMode: InteractionMode) => {
    setMode(newMode);
    if (isConnected && newMode !== 'text-chat') {
      handleStop().then(() => {
        handleStart();
      });
    } else if (isConnected && mode !== 'text-chat' && newMode === 'text-chat') {
      handleStop();
    }
  };

  const handleChatActivity = (hasActivity: boolean) => {
    if (mode === 'text-chat' && onActiveStateChange) {
      onActiveStateChange(hasActivity);
    }
  };

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
      <div className="text-center space-y-6 max-w-md z-10">
        <h3 className="text-xl font-medium text-slate-700">
          {mode === 'chat' ? 'Talk With Kiaan' : 'Meeting Mode'}
        </h3>
        
        <div className="text-sm text-slate-500">
          Status: {status} {isPending ? "(Connecting...)" : ""}
          {isConnected && isSpeaking ? " (Agent is speaking)" : ""}
        </div>
        
        <div className="flex items-center justify-center gap-4">
          {!isConnected ? (
            <button
              onClick={handleStart}
              disabled={isPending}
              className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all z-20 ${
                isPending
                  ? "bg-indigo-100 text-indigo-500 animate-pulse"
                  : "bg-gradient-to-r from-blue-400 to-purple-400 text-white hover:shadow-lg hover:scale-105"
              }`}
              aria-label="Start conversation"
            >
              {isPending ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
              ) : (
                <Mic className="w-8 h-8" />
              )}
            </button>
          ) : (
            <>
              <button
                onClick={handleStop}
                className="relative w-16 h-16 rounded-full flex items-center justify-center transition-all bg-red-500 text-white hover:bg-red-600 z-20"
                aria-label="End conversation"
              >
                <PhoneOff className="w-8 h-8" />
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
      </div>
    );
  };

  const renderVoiceAnimations = () => {
    if (mode === 'text-chat') return null;
    
    return (
      <div 
        className="absolute inset-0 flex items-center justify-center overflow-hidden z-0 pointer-events-none"
      >
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

  const renderModeButtons = () => {
    return (
      <div className="flex justify-center space-x-4 relative z-50">
        <Button 
          variant={mode === 'chat' ? 'default' : 'outline'} 
          className={`flex items-center gap-2 ${mode === 'chat' ? 'bg-gradient-to-r from-blue-400 to-purple-400 text-white shadow-md' : 'bg-white/10 backdrop-blur-sm text-white border-white/20'}`}
          onClick={() => handleModeChange('chat')}
        >
          <MessageCircle className="w-4 h-4" />
          Talk with Kiaan
        </Button>
        
        <Button 
          variant={mode === 'meeting' ? 'default' : 'outline'} 
          className={`flex items-center gap-2 ${mode === 'meeting' ? 'bg-gradient-to-r from-blue-400 to-purple-400 text-white shadow-md' : 'bg-white/10 backdrop-blur-sm text-white border-white/20'}`}
          onClick={() => handleModeChange('meeting')}
        >
          <Users className="w-4 h-4" />
          Meeting Mode
        </Button>
        
        <Button 
          variant={mode === 'text-chat' ? 'default' : 'outline'} 
          className={`flex items-center gap-2 ${mode === 'text-chat' ? 'bg-gradient-to-r from-blue-400 to-purple-400 text-white shadow-md' : 'bg-white/10 backdrop-blur-sm text-white border-white/20'}`}
          onClick={() => handleModeChange('text-chat')}
        >
          <MessageSquare className="w-4 h-4" />
          Chat with Kiaan
        </Button>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-between relative p-4">
      {renderVoiceAnimations()}
      
      <div className="flex-1 w-full flex items-center justify-center overflow-hidden relative z-10">
        {renderMainContent()}
      </div>
      
      <div className="relative z-50">
        {renderModeButtons()}
      </div>
    </div>
  );
};

export default SolutionsBajajAI;
