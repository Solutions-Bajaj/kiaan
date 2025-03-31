import React from 'react';
import ChatInterface from './ChatInterface';

interface KiaanVoiceAssistantProps {
  webhookUrl?: string;
}

const KiaanVoiceAssistant: React.FC<KiaanVoiceAssistantProps> = ({ 
  webhookUrl = "https://choco.solutionsbajaj.com/webhook-test/sberpkiaan" 
}) => {
  return (
    <div className="kiaan-voice-assistant">
      <ChatInterface webhookUrl={webhookUrl} />
    </div>
  );
};

export default KiaanVoiceAssistant;
