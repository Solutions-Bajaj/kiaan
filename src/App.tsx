
import { useState } from 'react';
import './App.css';

function App() {
  const [showFullCode, setShowFullCode] = useState(false);
  
  const snippet = `<link rel="stylesheet" href="https://erp.solutionsbajaj.com/kiaan/public/kiaan-widget-standalone.css">
<script src="https://erp.solutionsbajaj.com/kiaan/public/kiaan-widget-standalone.js"></script>`;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Kiaan Voice Assistant Widget</h1>
        <p className="text-gray-600 mt-2">A voice-only assistant widget powered by Solutions Bajaj AI</p>
      </header>
      
      <main className="space-y-8">
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Quick Start</h2>
          <p className="mb-4">Add Kiaan to your website by copying and pasting this code just before the closing <code>&lt;/body&gt;</code> tag:</p>
          
          <div className="bg-gray-800 text-white p-4 rounded-md font-mono text-sm relative mb-4">
            <pre>{snippet}</pre>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(snippet);
                alert('Code copied to clipboard!');
              }}
              className="absolute top-2 right-2 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
            >
              Copy
            </button>
          </div>
          
          <p>This will add the Kiaan floating button to your website, giving your users instant access to voice assistance.</p>
          
          <div className="mt-6 flex justify-end">
            <button 
              onClick={() => setShowFullCode(!showFullCode)}
              className="text-blue-500 hover:text-blue-700 underline"
            >
              {showFullCode ? 'Hide detailed implementation' : 'View detailed implementation'}
            </button>
          </div>
          
          {showFullCode && (
            <div className="mt-4">
              <h3 className="font-medium text-lg mb-2">Detailed Implementation</h3>
              <p className="mb-2">For more control over the widget, you can download and host these files directly:</p>
              
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>
                  <a href="/kiaan-widget-standalone.css" download className="text-blue-500 hover:text-blue-700">
                    Download kiaan-widget-standalone.css
                  </a>
                </li>
                <li>
                  <a href="/kiaan-widget-standalone.js" download className="text-blue-500 hover:text-blue-700">
                    Download kiaan-widget-standalone.js
                  </a>
                </li>
              </ul>
              
              <p>Then reference these files from your own server:</p>
              
              <div className="bg-gray-800 text-white p-4 rounded-md font-mono text-sm mt-2">
                <pre>{`<link rel="stylesheet" href="/path/to/kiaan-widget-standalone.css">
<script src="/path/to/kiaan-widget-standalone.js"></script>`}</pre>
              </div>
            </div>
          )}
        </section>
        
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Features</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Floating, animated assistant orb</li>
            <li>Voice-first interaction</li>
            <li>Clean, modern design</li>
            <li>Mobile-responsive</li>
            <li>Easy to embed in any website</li>
            <li>Powered by Solutions Bajaj AI</li>
          </ul>
        </section>
      </main>
      
      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>© 2025 Solutions Bajaj. All rights reserved.</p>
      </footer>
      
      {/* Kiaan widget is automatically loaded in this demo */}
      <script dangerouslySetInnerHTML={{ __html: `
        // Auto-initialize Kiaan widget for this demo
        document.addEventListener('DOMContentLoaded', function() {
          if (!window.kiaanWidgetInitialized) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = '/kiaan-widget-standalone.css';
            document.head.appendChild(link);
            
            const script = document.createElement('script');
            script.src = '/kiaan-widget-standalone.js';
            document.body.appendChild(script);
          }
        });
      `}} />
    </div>
  );
}

export default App;
