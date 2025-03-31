
import React, { useState, useEffect } from 'react';
import { Mic, PhoneOff, MessageCircle, Users } from 'lucide-react';
import { useConversation } from '@11labs/react';
import { Button } from './ui/button';

interface SolutionsBajajAIProps {
  agentId: string;
}

// Define type for the message source
type Role = 'assistant' | 'user' | 'system' | 'ai';

// Properly type the message interface to match what the useConversation hook provides
interface ConversationMessage {
  message: string;
  source: Role;
  is_final?: boolean;
}

const SolutionsBajajAI: React.FC<SolutionsBajajAIProps> = ({ agentId }) => {
  const [isWaitingForMicPermission, setIsWaitingForMicPermission] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [mode, setMode] = useState<'chat' | 'meeting'>('chat');
  
  // Define agent IDs for different modes
  const AGENTS = {
    chat: agentId, // Original agent ID passed as prop
    meeting: '0OxkgMLQJmZuT23PE2Cv' // Meeting mode agent ID
  };

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
        agentId: AGENTS[mode] 
      });
      
      setIsWaitingForMicPermission(false);
    } catch (error) {
      console.error('Error starting conversation:', error);
      setIsWaitingForMicPermission(false);
    }
  };

  const handleStop = async () => {
    try {
      await conversation.endSession();
      setMessages([]);
    } catch (error) {
      console.error('Error ending conversation:', error);
    }
  };

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (status === 'connected') {
        conversation.endSession();
      }
    };
  }, [status]);

  const isConnected = status === 'connected';
  const isPending = isWaitingForMicPermission || status === 'connecting';

  const handleModeChange = (newMode: 'chat' | 'meeting') => {
    setMode(newMode);
    // If we're already connected, restart the conversation with the new mode
    if (isConnected) {
      handleStop().then(() => {
        handleStart();
      });
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative">
      {/* Futuristic animation background */}
      <div 
        className={`absolute inset-0 flex items-center justify-center overflow-hidden z-0 pointer-events-none`}
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

      {/* Main content */}
      <div className="text-center space-y-6 max-w-md z-10">
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
              className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all ${
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
              {/* Hang Up Button */}
              <button
                onClick={handleStop}
                className="relative w-16 h-16 rounded-full flex items-center justify-center transition-all bg-red-500 text-white hover:bg-red-600"
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
        
        {/* Mode selection buttons */}
        <div className="flex space-x-4 justify-center mt-6">
          <Button 
            variant={mode === 'chat' ? 'default' : 'outline'} 
            className={`flex items-center gap-2 ${mode === 'chat' ? 'bg-gradient-to-r from-blue-400 to-purple-400' : ''}`}
            onClick={() => handleModeChange('chat')}
          >
            <MessageCircle className="w-4 h-4" />
            Chat with Kiaan
          </Button>
          
          <Button 
            variant={mode === 'meeting' ? 'default' : 'outline'} 
            className={`flex items-center gap-2 ${mode === 'meeting' ? 'bg-gradient-to-r from-blue-400 to-purple-400' : ''}`}
            onClick={() => handleModeChange('meeting')}
          >
            {mode === 'meeting' ? (
              <>
                <MessageCircle className="w-4 h-4" />
                Talk with Kiaan
              </>
            ) : (
              <>
                <Users className="w-4 h-4" />
                Meeting Mode
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SolutionsBajajAI;
