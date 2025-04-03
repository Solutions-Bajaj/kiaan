
// Kiaan Widget Standalone JavaScript
(function() {
  // Only run once to prevent multiple instances
  if (window.kiaanWidgetInitialized) {
    console.warn('Kiaan widget already initialized');
    return;
  }
  window.kiaanWidgetInitialized = true;

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
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 4V20M8 13L16 20M8 11L16 4" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <div class="kiaan-pulse-ring"></div>
  `;
  container.appendChild(orb);

  // Create overlay for when panel is open
  const overlay = document.createElement('div');
  overlay.id = 'kiaan-overlay';
  overlay.className = 'kiaan-overlay';
  container.appendChild(overlay);

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
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6 6 18"></path>
          <path d="m6 6 12 12"></path>
        </svg>
      </button>
    </div>
    <div class="kiaan-panel-content" id="kiaan-ai-content">
      <!-- AI content will be added here -->
    </div>
    <div class="kiaan-panel-footer">
      <a href="https://solutionsbajaj.com" target="_blank" rel="noopener noreferrer">
        Powered by Solutions Bajaj
      </a>
    </div>
  `;
  container.appendChild(panel);

  // Load AI script and create widget
  const createAIWidget = () => {
    // Load the script
    if (!document.querySelector('script[src="https://elevenlabs.io/convai-widget/index.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://elevenlabs.io/convai-widget/index.js';
      script.async = true;
      script.type = 'text/javascript';
      document.body.appendChild(script);
      
      // After script loads, create the widget
      script.onload = () => {
        const contentContainer = document.getElementById('kiaan-ai-content');
        if (contentContainer) {
          const widgetNode = document.createElement('elevenlabs-convai');
          widgetNode.setAttribute('agent-id', 'S4i7eNeg211h4p6hHRXK');
          widgetNode.style.width = '100%';
          widgetNode.style.height = '100%';
          contentContainer.appendChild(widgetNode);
        }
      };
    } else {
      // Script already loaded, just create the widget
      const contentContainer = document.getElementById('kiaan-ai-content');
      if (contentContainer && !contentContainer.querySelector('elevenlabs-convai')) {
        const widgetNode = document.createElement('elevenlabs-convai');
        widgetNode.setAttribute('agent-id', 'S4i7eNeg211h4p6hHRXK');
        widgetNode.style.width = '100%';
        widgetNode.style.height = '100%';
        contentContainer.appendChild(widgetNode);
      }
    }
  };

  // Initialize widget functionality
  const initWidget = () => {
    // Toggle panel visibility
    let isOpen = false;
    
    orb.addEventListener('click', () => {
      isOpen = true;
      panel.classList.add('open');
      orb.classList.add('hidden');
      overlay.classList.add('visible');
      document.body.style.overflow = 'hidden'; // Prevent scrolling
      createAIWidget();
    });
    
    const closeBtn = panel.querySelector('.kiaan-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        isOpen = false;
        panel.classList.remove('open');
        orb.classList.remove('hidden');
        overlay.classList.remove('visible');
        document.body.style.overflow = ''; // Allow scrolling again
      });
    }
    
    // Prevent closing panel when clicking outside - only close with X button
    overlay.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent clicks from propagating through
    });
  };

  // Initialize when DOM is fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }
  
  // Log success message
  console.log('Kiaan widget initialized successfully');
})();
