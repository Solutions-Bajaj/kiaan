
import KiaanVoiceAssistant from '@/components/KiaanVoiceAssistant';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100">
      <div className="text-center max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-4 text-white">Meet Kiaan</h1>
        <p className="text-xl text-gray-300 mb-8">Your futuristic voice-only AI assistant</p>
        <p className="text-gray-400 mb-2">Click the voice orb in the bottom-right corner to start speaking with Kiaan.</p>
        <p className="text-gray-500 text-sm">Powered by <a href="https://solutionsbajaj.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">Solutions Bajaj</a></p>
      </div>
      
      {/* The Kiaan Voice Assistant will appear in the bottom-right corner */}
      <KiaanVoiceAssistant />
    </div>
  );
};

export default Index;
