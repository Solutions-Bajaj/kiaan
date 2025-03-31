
import React, { useEffect, useRef } from 'react';

interface SolutionsBajajAIProps {
  agentId: string;
}

const SolutionsBajajAI: React.FC<SolutionsBajajAIProps> = ({ agentId }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Load the required script if not already loaded
      if (!document.querySelector('script[src="https://elevenlabs.io/convai-widget/index.js"]')) {
        const script = document.createElement('script');
        script.src = 'https://elevenlabs.io/convai-widget/index.js';
        script.async = true;
        script.type = 'text/javascript';
        document.body.appendChild(script);
      }
      
      // Create the widget element
      const widgetNode = document.createElement('elevenlabs-convai');
      widgetNode.setAttribute('agent-id', agentId);
      widgetNode.style.width = '100%';
      widgetNode.style.height = '100%';
      
      // Clear container and append the new element
      while (containerRef.current.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild);
      }
      containerRef.current.appendChild(widgetNode);
    }
  }, [agentId]);

  return <div ref={containerRef} className="w-full h-full" />;
};

export default SolutionsBajajAI;
