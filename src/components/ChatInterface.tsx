
import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Send } from 'lucide-react';

interface ChatInterfaceProps {
  webhookUrl: string;
  onActivityChange?: (hasActivity: boolean) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ webhookUrl, onActivityChange }) => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Optimistically update the UI
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Notify activity
    if (onActivityChange) {
      onActivityChange(true);
    }

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botMessage = { role: 'assistant', content: data.response };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Revert the UI update if sending fails
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages.pop();
        return newMessages;
      });
      alert('Failed to send message. Please try again.');
    }
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Clear activity after a delay
  useEffect(() => {
    if (messages.length > 0 && onActivityChange) {
      const timer = setTimeout(() => {
        onActivityChange(false);
      }, 5000); // Clear after 5 seconds of inactivity

      return () => clearTimeout(timer);
    }
  }, [messages, onActivityChange]);

  return (
    <div className="flex flex-col h-full bg-gray-900">
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, index) => (
          <div key={index} className={`text-sm ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`px-3 py-1 rounded-full inline-block ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-100'}`}>
              {msg.content}
            </span>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-800 relative z-30 bg-gray-900/90 backdrop-blur-md">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
            className="flex-1 bg-gray-800 border-gray-700 text-white"
          />
          <Button onClick={sendMessage} className="z-40 bg-blue-500 hover:bg-blue-600"><Send className="w-4 h-4" /></Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
