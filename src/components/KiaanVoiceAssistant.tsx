
import React, { useState } from 'react';
import VoiceOrb from './VoiceOrb';
import VoicePanel from './VoicePanel';

const KiaanVoiceAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePanel = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <>
      <VoiceOrb isOpen={isOpen} onClick={togglePanel} />
      <VoicePanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default KiaanVoiceAssistant;
