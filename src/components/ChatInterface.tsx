
import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, PaperclipIcon, XCircle, ArrowDown } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { Input } from './ui/input';
import { v4 as uuidv4 } from 'uuid';

interface FileAttachment {
  name: string;
  type: string;
  data: string | ArrayBuffer; // Base64 encoded file content
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  attachments?: FileAttachment[];
}

interface ChatInterfaceProps {
  webhookUrl: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ webhookUrl }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [userId] = useState(() => {
    // Try to get user ID from localStorage or generate a new one
    const storedUserId = localStorage.getItem('kiaan_user_id');
    if (storedUserId) return storedUserId;
    
    const newUserId = uuidv4();
    localStorage.setItem('kiaan_user_id', newUserId);
    return newUserId;
  });
  
  // Add userName state, stored in localStorage
  const [userName] = useState(() => {
    const storedUserName = localStorage.getItem('kiaan_user_name');
    return storedUserName || 'Guest User';
  });

  // Allowed file types
  const allowedFileTypes = '.pdf,.csv,.jpeg,.jpg,.png,.webp,.xlsx,.docx';

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Only take the first file if multiple are selected
      setSelectedFile(e.target.files[0]);
      
      // Reset the file input value to allow selecting the same file again
      e.target.value = '';
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  const convertFileToBase64 = async (file: File): Promise<FileAttachment> => {
    return new Promise<FileAttachment>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          resolve({
            name: file.name,
            type: file.type,
            data: reader.result
          });
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  };

  const downloadFile = (attachment: FileAttachment) => {
    // Create a temporary link to download the file
    const link = document.createElement('a');
    link.href = attachment.data as string; // The data should be in Data URL format
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if there is a file but no message
    const userMessage = inputMessage.trim();
    if (selectedFile && !userMessage) {
      toast.error('Please add a message describing what you want to do with the attached file');
      return;
    }
    
    // Make sure there's at least a message or a file
    if (!userMessage && !selectedFile) return;
    
    setInputMessage('');
    
    // Convert file to base64
    let attachment: FileAttachment | undefined;
    if (selectedFile) {
      try {
        attachment = await convertFileToBase64(selectedFile);
      } catch (error) {
        console.error('Error converting file to base64:', error);
        toast.error('Failed to process file');
        return;
      }
    }

    // Add user message
    setMessages(prev => [...prev, { 
      role: 'user', 
      content: userMessage,
      attachments: attachment ? [attachment] : undefined
    }]);
    
    // Clear file selection
    setSelectedFile(null);
    
    setIsLoading(true);

    try {
      // Create timestamp
      const timestamp = new Date().toISOString();
      
      // Use the webhook URL directly from this file
      const response = await fetch("https://choco.solutionsbajaj.com/webhook-test/sberpkiaan", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: userMessage,
          attachments: attachment ? [attachment] : undefined,
          userId: userId,
          userName: userName, // Add userName to the payload
          timestamp: timestamp
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      // Get response as text first
      const responseText = await response.text();
      console.log('Webhook response text:', responseText);
      
      // Check if the response is a valid JSON string
      let data;
      try {
        // Only try to parse if there's actual content
        if (responseText && responseText.trim()) {
          data = JSON.parse(responseText);
        } else {
          // Handle empty response
          throw new Error('Empty response received');
        }
      } catch (jsonError) {
        console.error('Error parsing JSON:', jsonError);
        // If text is not JSON but has content, show it as plain text response
        if (responseText && responseText.trim()) {
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: responseText
          }]);
          setIsLoading(false);
          return;
        }
        throw new Error('Invalid response format');
      }
      
      // Add assistant response - handle both response formats and attachments
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.output || data.response || 'I received your message but was unable to process it properly.',
        attachments: data.attachments
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
                
                {/* Display attachments if any */}
                {message.attachments && message.attachments.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {message.attachments.map((attachment, i) => (
                      <div 
                        key={i} 
                        className={`flex items-center justify-between p-2 rounded ${
                          message.role === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-slate-200 text-slate-800'
                        }`}
                      >
                        <div className="truncate text-sm">{attachment.name}</div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={`p-1 ${message.role === 'user' ? 'text-white hover:bg-blue-700' : 'text-slate-800 hover:bg-slate-300'}`}
                          onClick={() => downloadFile(attachment)}
                        >
                          <ArrowDown className="w-4 h-4" />
                          <span className="sr-only">Download</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Selected file preview */}
      {selectedFile && (
        <div className="border-t border-slate-200 p-2 bg-slate-50">
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1 bg-slate-100 rounded-full pl-3 pr-1 py-1">
              <span className="text-xs text-slate-600 truncate max-w-[150px]">{selectedFile.name}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-5 w-5 p-0 rounded-full hover:bg-slate-200" 
                onClick={removeFile}
              >
                <XCircle className="w-4 h-4" />
                <span className="sr-only">Remove</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Input area */}
      <form onSubmit={handleSubmit} className="border-t border-slate-200 p-3">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={openFileSelector}
            className="rounded-full"
            disabled={!!selectedFile}
          >
            <PaperclipIcon className="w-5 h-5 text-slate-500" />
            <span className="sr-only">Attach file</span>
          </Button>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept={allowedFileTypes}
          />
          
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={isLoading}
          />
          
          <Button 
            type="submit" 
            disabled={isLoading || (!inputMessage.trim() && !selectedFile)} 
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
