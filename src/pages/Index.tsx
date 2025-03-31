
import KiaanVoiceAssistant from '@/components/KiaanVoiceAssistant';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-4 text-slate-800">Meet Kiaan</h1>
        <p className="text-xl text-slate-600 mb-8">Your futuristic voice-only AI assistant</p>
        <p className="text-slate-500 mb-2">Click the voice orb in the bottom-right corner to start speaking with Kiaan.</p>
        <p className="text-slate-400 text-sm">Powered by ElevenLabs AI voice technology</p>
      </div>
      
      {/* The Kiaan Voice Assistant will appear in the bottom-right corner */}
      <KiaanVoiceAssistant />
    </div>
  );
};

export default Index;
