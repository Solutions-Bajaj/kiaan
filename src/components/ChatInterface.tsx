import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Send, PaperclipIcon, X } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';

interface ChatInterfaceProps {
  webhookUrl?: string;
  onActivityChange?: (hasActivity: boolean) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  webhookUrl = "https://choco.solutionsbajaj.com/webhook/sberpkiaan", 
  onActivityChange 
}) => {
  const [messages, setMessages] = useState<{ role: string; content: string; attachment?: string }[]>([]);
  const [input, setInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  const sendMessage = async () => {
    if (!input.trim() && !attachmentPreview) return;

    // Optimistically update the UI
    const userMessage = { 
      role: 'user', 
      content: input, 
      attachment: attachmentPreview || undefined 
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setAttachmentPreview(null);

    // Notify activity
    if (onActivityChange) {
      onActivityChange(true);
    }

    try {
      // Create form data to support file uploads
      const formData = new FormData();
      formData.append('message', input);
      
      if (attachmentPreview) {
        // Convert base64 to blob if needed
        const response = await fetch(attachmentPreview);
        const blob = await response.blob();
        formData.append('file', blob, 'attachment');
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botMessage = { role: 'assistant', content: data.response || data.output };
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      setAttachmentPreview(reader.result as string);
      setIsUploading(false);
    };
    reader.onerror = () => {
      console.error('Error reading file');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const clearAttachment = () => {
    setAttachmentPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
    <div className="flex flex-col h-full">
      <div 
        ref={chatContainerRef} 
        className={`flex-1 overflow-y-auto p-2 md:p-4 space-y-2 ${isMobile ? 'pb-4' : ''}`}
      >
        {messages.map((msg, index) => (
          <div key={index} className={`text-sm ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`px-3 py-1 rounded-lg inline-block ${msg.role === 'user' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
              {msg.content}
              {msg.attachment && (
                <div className="mt-1">
                  <img src={msg.attachment} alt="Attachment" className="max-w-xs rounded-md" />
                </div>
              )}
            </span>
          </div>
        ))}
      </div>
      
      {/* Attachment preview */}
      {attachmentPreview && (
        <div className="p-2 border-t border-gray-200">
          <div className="relative inline-block">
            <img src={attachmentPreview} alt="Preview" className="h-16 rounded-md" />
            <button 
              onClick={clearAttachment}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 h-5 w-5 flex items-center justify-center"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Input area - adjusted for mobile */}
      <div className={`p-2 md:p-4 border-t border-gray-200 ${isMobile ? 'mt-auto bg-white' : ''}`}>
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
            className="flex-1"
          />
          
          {/* File upload button */}
          <input 
            type="file" 
            ref={fileInputRef}
            id="file-upload" 
            className="hidden" 
            onChange={handleFileUpload}
            accept="image/*,.pdf,.doc,.docx,.txt" 
          />
          <Button 
            variant="outline" 
            size={isMobile ? "sm" : "default"}
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="relative"
          >
            {isUploading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-blue-400"></div>
            ) : (
              <PaperclipIcon className="w-4 h-4" />
            )}
          </Button>
          
          {/* Send button */}
          <Button 
            onClick={sendMessage}
            size={isMobile ? "sm" : "default"}
            disabled={input.trim() === '' && !attachmentPreview}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
