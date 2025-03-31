
import React, { useState, useEffect } from 'react';
import { Mic, MicOff, VolumeX, Volume2 } from 'lucide-react';
import { useConversation } from '@11labs/react';

interface SolutionsBajajAIProps {
  agentId: string;
}

const SolutionsBajajAI: React.FC<SolutionsBajajAIProps> = ({ agentId }) => {
  const [isWaitingForMicPermission, setIsWaitingForMicPermission] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [isMuted, setIsMuted] = useState(false);

  // Initialize the ElevenLabs conversation hook
  const conversation = useConversation({
    onMessage: (message) => {
      console.log('Received message:', message);
      
      if (message.type === 'assistant_response' || message.type === 'assistant_message') {
        setMessages(prev => [...prev, { role: 'assistant', content: message.content }]);
      } else if (message.type === 'transcription') {
        if (message.is_final) {
          setMessages(prev => [...prev, { role: 'user', content: message.content }]);
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

  const toggleMute = () => {
    if (isMuted) {
      conversation.setVolume({ volume: 1.0 });
    } else {
      conversation.setVolume({ volume: 0.0 });
    }
    setIsMuted(!isMuted);
  };

  const handleStart = async () => {
    try {
      setIsWaitingForMicPermission(true);
      
      // Check if microphone permission is already granted
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Important: Release the stream to avoid permission issues
      stream.getTracks().forEach(track => track.stop());
      
      // Start the conversation with the agent ID
      await conversation.startSession({ 
        agentId: agentId 
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

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="text-center space-y-6 max-w-md">
        <h3 className="text-xl font-medium text-slate-700">Talk With Kiaan</h3>
        
        {/* Debug message showing current status */}
        <div className="text-sm text-slate-500">
          Status: {status} {isPending ? "(Connecting...)" : ""}
          {isConnected && isSpeaking ? " (Agent is speaking)" : ""}
        </div>
        
        {/* Message area */}
        {messages.length > 0 && (
          <div className="mt-4 mb-4 max-h-32 overflow-y-auto text-left p-2 bg-slate-50 rounded-lg">
            {messages.slice(-3).map((message, index) => (
              <div key={index} className={`mb-2 ${message.role === 'assistant' ? 'text-blue-600' : 'text-slate-700'}`}>
                <span className="font-semibold">{message.role === 'assistant' ? 'Kiaan: ' : 'You: '}</span>
                {message.content}
              </div>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-center gap-4">
          {/* Main microphone button */}
          <button
            onClick={isConnected ? handleStop : handleStart}
            disabled={isPending}
            className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all ${
              isPending
                ? "bg-indigo-100 text-indigo-500 animate-pulse"
                : isConnected
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-gradient-to-r from-blue-400 to-purple-400 text-white hover:shadow-lg hover:scale-105"
            }`}
            aria-label={isConnected ? "Stop conversation" : "Start conversation"}
          >
            {isPending ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
            ) : isConnected ? (
              <MicOff className="w-8 h-8" />
            ) : (
              <Mic className="w-8 h-8" />
            )}
            
            {isConnected && isSpeaking && (
              <div className="absolute -inset-1 rounded-full border-4 border-blue-300 animate-ping opacity-50"></div>
            )}
          </button>
          
          {/* Volume toggle button - only shown when connected */}
          {isConnected && (
            <button
              onClick={toggleMute}
              className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          )}
        </div>
        
        <p className="text-sm text-slate-500 mt-2">
          {isPending
            ? "Waiting for microphone permission..."
            : isConnected
              ? isSpeaking 
                ? "Kiaan is speaking..." 
                : "Kiaan is listening..."
              : "Tap the microphone to start speaking with Kiaan"}
        </p>
      </div>
    </div>
  );
};

export default SolutionsBajajAI;
