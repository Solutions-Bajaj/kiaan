// Standalone script that can be included in any website to add the Kiaan widget
(function() {
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
      <path d="M4 8h4 M4 16h4 M16 8h4 M16 16h4 M18 4v4 M18 16v4" stroke="#60a5fa" stroke-width="1" stroke-linecap="round" stroke-opacity="0.8"/>
      <circle cx="8" cy="8" r="1" fill="#60a5fa" fill-opacity="0.8" />
      <circle cx="8" cy="16" r="1" fill="#60a5fa" fill-opacity="0.8" />
      <circle cx="16" cy="8" r="1" fill="#60a5fa" fill-opacity="0.8" />
      <circle cx="16" cy="16" r="1" fill="#60a5fa" fill-opacity="0.8" />
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
      <div class="flex items-center">
        <button class="kiaan-close-btn" aria-label="Close Kiaan Voice Assistant">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x">
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button>
      </div>
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

  // Add styles
  const addStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
      .kiaan-orb {
        position: fixed;
        bottom: auto;
        right: auto;
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
        cursor: grab;
        transition: all 0.3s ease;
        outline: none;
        touch-action: none;
      }
      
      .kiaan-orb:active {
        cursor: grabbing;
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
      
      .kiaan-orb.dragging {
        transition: none;
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
      
      .kiaan-overlay {
        position: fixed;
        inset: 0;
        z-index: 9997;
        background-color: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
      }
      
      .kiaan-overlay.visible {
        opacity: 1;
        pointer-events: all;
      }
      
      .kiaan-panel {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.95);
        z-index: 9998;
        display: flex;
        flex-direction: column;
        width: 80vw;
        height: 80vh;
        border-radius: 1rem;
        background-color: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(226, 232, 240, 1);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        transition: all 0.5s ease;
        opacity: 0;
        pointer-events: none;
      }
      
      .kiaan-panel.open {
        transform: translate(-50%, -50%) scale(1);
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
      
      .kiaan-panel-footer a {
        color: inherit;
        text-decoration: none;
        transition: color 0.2s ease;
      }
      
      .kiaan-panel-footer a:hover {
        color: #3b82f6;
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
      
      /* Responsive adjustments */
      @media (max-width: 640px) {
        .kiaan-panel {
          width: 95vw;
          height: 95vh;
        }
      }
    `;
    document.head.appendChild(style);
  };

  // Initialize widget
  const initWidget = () => {
    addStyles();
    
    // Toggle panel visibility
    let isOpen = false;
    let isDragging = false;
    
    // Set initial position (bottom right)
    const setInitialPosition = () => {
      const orbWidth = orb.offsetWidth || 48;
      const orbHeight = orb.offsetHeight || 48;
      
      // Default position - bottom right with some margin
      const defaultX = window.innerWidth - orbWidth - 32;
      const defaultY = window.innerHeight - orbHeight - 32;
      
      orb.style.left = `${defaultX}px`;
      orb.style.top = `${defaultY}px`;
    };
    
    // Make the orb draggable
    const makeOrbDraggable = () => {
      let offsetX, offsetY;
      
      // Mouse events
      orb.addEventListener('mousedown', function(e) {
        if (isOpen) return;
        
        isDragging = true;
        orb.classList.add('dragging');
        
        // Get the current position of the orb
        const orbRect = orb.getBoundingClientRect();
        
        // Calculate the offset of the mouse click relative to the orb position
        offsetX = e.clientX - orbRect.left;
        offsetY = e.clientY - orbRect.top;
        
        document.addEventListener('mousemove', mouseMove);
        document.addEventListener('mouseup', mouseUp);
        
        // Prevent default behavior to avoid text selection during drag
        e.preventDefault();
      });
      
      // Touch events for mobile
      orb.addEventListener('touchstart', function(e) {
        if (isOpen) return;
        
        isDragging = true;
        orb.classList.add('dragging');
        
        // Get the current position of the orb
        const orbRect = orb.getBoundingClientRect();
        const touch = e.touches[0];
        
        // Calculate the offset of the touch relative to the orb position
        offsetX = touch.clientX - orbRect.left;
        offsetY = touch.clientY - orbRect.top;
        
        document.addEventListener('touchmove', touchMove, { passive: false });
        document.addEventListener('touchend', touchEnd);
        
        // Prevent default behavior to avoid scrolling during drag on mobile
        e.preventDefault();
      }, { passive: false });
      
      function mouseMove(e) {
        const orbWidth = orb.offsetWidth;
        const orbHeight = orb.offsetHeight;
        
        // Calculate new position
        let newLeft = e.clientX - offsetX;
        let newTop = e.clientY - offsetY;
        
        // Keep the orb within the viewport bounds
        newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - orbWidth));
        newTop = Math.max(0, Math.min(newTop, window.innerHeight - orbHeight));
        
        // Update orb position
        orb.style.left = `${newLeft}px`;
        orb.style.top = `${newTop}px`;
      }
      
      function touchMove(e) {
        const touch = e.touches[0];
        const orbWidth = orb.offsetWidth;
        const orbHeight = orb.offsetHeight;
        
        // Calculate new position
        let newLeft = touch.clientX - offsetX;
        let newTop = touch.clientY - offsetY;
        
        // Keep the orb within the viewport bounds
        newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - orbWidth));
        newTop = Math.max(0, Math.min(newTop, window.innerHeight - orbHeight));
        
        // Update orb position
        orb.style.left = `${newLeft}px`;
        orb.style.top = `${newTop}px`;
        
        // Prevent default to avoid scrolling while dragging
        e.preventDefault();
      }
      
      function mouseUp() {
        isDragging = false;
        orb.classList.remove('dragging');
        document.removeEventListener('mousemove', mouseMove);
        document.removeEventListener('mouseup', mouseUp);
      }
      
      function touchEnd() {
        isDragging = false;
        orb.classList.remove('dragging');
        document.removeEventListener('touchmove', touchMove);
        document.removeEventListener('touchend', touchEnd);
      }
    };
    
    // Initialize position and draggability
    setInitialPosition();
    makeOrbDraggable();
    
    // Handle orb click to open panel
    orb.addEventListener('click', function(e) {
      if (!isDragging) {
        isOpen = true;
        panel.classList.add('open');
        orb.classList.add('hidden');
        overlay.classList.add('visible');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        createAIWidget();
      }
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
    
    // Update panel position when window is resized
    window.addEventListener('resize', function() {
      // If the orb is outside the viewport after resize, reposition it
      const orbRect = orb.getBoundingClientRect();
      const orbWidth = orb.offsetWidth || 48;
      const orbHeight = orb.offsetHeight || 48;
      
      let needsRepositioning = false;
      let newLeft = parseInt(orb.style.left);
      let newTop = parseInt(orb.style.top);
      
      if (orbRect.right > window.innerWidth) {
        newLeft = window.innerWidth - orbWidth - 16;
        needsRepositioning = true;
      }
      
      if (orbRect.bottom > window.innerHeight) {
        newTop = window.innerHeight - orbHeight - 16;
        needsRepositioning = true;
      }
      
      if (needsRepositioning) {
        orb.style.left = `${newLeft}px`;
        orb.style.top = `${newTop}px`;
      }
    });
  };

  // Initialize when DOM is fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }
})();
