
import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  webhookUrl: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ webhookUrl }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const responseText = await response.text();
      console.log('Webhook response text:', responseText);
      
      // Check if the response is a valid JSON string
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (jsonError) {
        console.error('Error parsing JSON:', jsonError);
        throw new Error('Invalid response format');
      }
      
      // Add assistant response - handle both response formats
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.output || data.response || 'I received your message but was unable to process it properly.'
      }]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      toast.error('Failed to get response from the server');
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I experienced a technical issue. Please try again later.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-400 text-sm">
            Start a conversation with Kiaan
          </div>
        ) : (
          messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-400 text-white' 
                    : 'bg-slate-100 text-slate-800'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <form onSubmit={handleSubmit} className="border-t border-slate-200 p-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={isLoading || !inputMessage.trim()} 
            className="bg-gradient-to-r from-blue-400 to-purple-400 p-2 rounded-full"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
