
// Standalone script that can be included in any website to add the Kiaan widget
const createKiaanWidget = () => {
  // Create container for the widget
  const container = document.createElement('div');
  container.id = 'kiaan-voice-assistant-container';
  document.body.appendChild(container);

  // Create orb button
  const orb = document.createElement('button');
  orb.id = 'kiaan-orb';
  orb.className = 'kiaan-orb';
  orb.setAttribute('aria-label', 'Open Kiaan Voice Assistant');
  orb.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mic">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
      <line x1="12" x2="12" y1="19" y2="22"></line>
    </svg>
    <div class="kiaan-pulse-ring"></div>
  `;
  container.appendChild(orb);

  // Create panel
  const panel = document.createElement('div');
  panel.id = 'kiaan-panel';
  panel.className = 'kiaan-panel';
  panel.innerHTML = `
    <div class="kiaan-panel-header">
      <div class="kiaan-panel-title">
        <div class="kiaan-status-dot"></div>
        <h2>Kiaan</h2>
      </div>
      <button class="kiaan-close-btn" aria-label="Close Kiaan Voice Assistant">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x">
          <path d="M18 6 6 18"></path>
          <path d="m6 6 12 12"></path>
        </svg>
      </button>
    </div>
    <div class="kiaan-panel-content">
      <elevenlabs-convai agent-id="S4i7eNeg211h4p6hHRXK"></elevenlabs-convai>
    </div>
    <div class="kiaan-panel-footer">
      <a href="https://solutionsbajaj.com" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: none; transition: color 0.2s ease;">
        <span style="display: inline-block;">Powered by Solutions Bajaj</span>
      </a>
    </div>
  `;
  container.appendChild(panel);

  // Load ElevenLabs script
  const loadElevenLabsScript = () => {
    const script = document.createElement('script');
    script.src = 'https://elevenlabs.io/convai-widget/index.js';
    script.async = true;
    script.type = 'text/javascript';
    document.body.appendChild(script);
  };

  // Add styles
  const addStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
      .kiaan-orb {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        background: linear-gradient(to right, #60a5fa, #34d399);
        color: white;
        border: 2px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        cursor: pointer;
        transition: all 0.3s ease;
        outline: none;
      }
      
      .kiaan-orb:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
      }
      
      .kiaan-orb.hidden {
        transform: scale(0);
        opacity: 0;
        pointer-events: none;
      }
      
      .kiaan-pulse-ring {
        position: absolute;
        inset: -0.5rem;
        border-radius: 50%;
        background-color: rgba(96, 165, 250, 0.2);
        opacity: 0;
        transition: all 1s ease;
      }
      
      .kiaan-orb:not(.hidden) .kiaan-pulse-ring {
        animation: kiaan-pulse 3s infinite;
      }
      
      @keyframes kiaan-pulse {
        0% {
          transform: scale(1);
          opacity: 0;
        }
        50% {
          opacity: 0.4;
        }
        100% {
          transform: scale(1.1);
          opacity: 0;
        }
      }
      
      .kiaan-panel {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        z-index: 9998;
        display: flex;
        flex-direction: column;
        width: 380px;
        height: 600px;
        max-height: 80vh;
        border-radius: 1rem;
        background-color: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(226, 232, 240, 1);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        transition: all 0.5s ease;
        transform: translateY(20px);
        opacity: 0;
        pointer-events: none;
      }
      
      .kiaan-panel.open {
        transform: translateY(0);
        opacity: 1;
        pointer-events: all;
      }
      
      .kiaan-panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem;
        border-bottom: 1px solid rgba(226, 232, 240, 1);
      }
      
      .kiaan-panel-title {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      
      .kiaan-status-dot {
        width: 0.75rem;
        height: 0.75rem;
        border-radius: 50%;
        background: linear-gradient(to right, #60a5fa, #34d399);
        animation: kiaan-pulse 3s infinite;
      }
      
      .kiaan-panel-title h2 {
        margin: 0;
        font-size: 1.125rem;
        font-weight: 500;
        color: #1e293b;
      }
      
      .kiaan-close-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.25rem;
        border-radius: 50%;
        color: #94a3b8;
        background: transparent;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      
      .kiaan-close-btn:hover {
        color: #475569;
        background-color: #f1f5f9;
      }
      
      .kiaan-panel-content {
        flex: 1;
        padding: 1rem;
        overflow: hidden;
        position: relative;
      }
      
      .kiaan-panel-content::before {
        content: "";
        position: absolute;
        inset: 0;
        background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzIwNzZmZiIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIgLz48L3N2Zz4=');
        opacity: 0.3;
        pointer-events: none;
        z-index: -1;
      }
      
      .kiaan-panel-content elevenlabs-convai {
        width: 100%;
        height: 100%;
      }
      
      .kiaan-panel-footer {
        padding: 0.75rem;
        text-align: center;
        font-size: 0.75rem;
        color: #94a3b8;
        border-top: 1px solid rgba(226, 232, 240, 1);
      }
      
      /* Background decorative elements */
      .kiaan-panel::before {
        content: "";
        position: absolute;
        top: -6rem;
        right: -6rem;
        width: 12rem;
        height: 12rem;
        border-radius: 50%;
        background: linear-gradient(to right, #60a5fa, #34d399);
        opacity: 0.1;
        filter: blur(3rem);
        z-index: -1;
        pointer-events: none;
      }
      
      .kiaan-panel::after {
        content: "";
        position: absolute;
        bottom: -3rem;
        left: 25%;
        width: 8rem;
        height: 8rem;
        border-radius: 50%;
        background: linear-gradient(to right, #34d399, #60a5fa);
        opacity: 0.1;
        filter: blur(2rem);
        z-index: -1;
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);
  };

  // Initialize widget
  const initWidget = () => {
    addStyles();
    
    // Toggle panel visibility
    let isOpen = false;
    
    orb.addEventListener('click', () => {
      isOpen = true;
      panel.classList.add('open');
      orb.classList.add('hidden');
      
      // Load ElevenLabs script if not already loaded
      if (!document.querySelector('script[src="https://elevenlabs.io/convai-widget/index.js"]')) {
        loadElevenLabsScript();
      }
    });
    
    const closeBtn = panel.querySelector('.kiaan-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        isOpen = false;
        panel.classList.remove('open');
        orb.classList.remove('hidden');
      });
    }
    
    // Close panel when clicking outside
    document.addEventListener('mousedown', (e) => {
      if (isOpen && !panel.contains(e.target as Node) && e.target !== orb) {
        isOpen = false;
        panel.classList.remove('open');
        orb.classList.remove('hidden');
      }
    });
  };

  // Initialize when DOM is fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }
};

// Auto-initialize widget when script is loaded
createKiaanWidget();

export default createKiaanWidget;
