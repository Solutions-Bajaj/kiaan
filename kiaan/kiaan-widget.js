// Kiaan Widget - Solutions Bajaj AI Assistant
(function() {
  // Check if config is loaded
  if (typeof window.KiaanConfig === 'undefined') {
    console.error('Kiaan: Configuration not found. Please include the config.js file before kiaan-widget.js');
    return;
  }
  
  // Load config
  const config = window.KiaanConfig;
  
  // Create container for the widget
  const container = document.createElement('div');
  container.id = 'kiaan-voice-assistant-container';
  document.body.appendChild(container);

  // Create overlay for when panel is open
  const overlay = document.createElement('div');
  overlay.id = 'kiaan-overlay';
  overlay.className = 'kiaan-overlay';
  container.appendChild(overlay);

  // Create orb button
  const orb = document.createElement('button');
  orb.id = 'kiaan-orb';
  orb.className = 'kiaan-orb';
  orb.setAttribute('aria-label', 'Open Kiaan Voice Assistant');
  orb.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 4V20M8 13L16 20M8 11L16 4" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M4 8h4 M4 16h4 M16 8h4 M16 16h4 M18 4v4 M18 16v4" stroke="${config.appearance.primaryColor}" stroke-width="1" stroke-linecap="round" stroke-opacity="0.8"/>
      <circle cx="8" cy="8" r="1" fill="${config.appearance.primaryColor}" fill-opacity="0.8" />
      <circle cx="8" cy="16" r="1" fill="${config.appearance.primaryColor}" fill-opacity="0.8" />
      <circle cx="16" cy="8" r="1" fill="${config.appearance.primaryColor}" fill-opacity="0.8" />
      <circle cx="16" cy="16" r="1" fill="${config.appearance.primaryColor}" fill-opacity="0.8" />
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
      <a href="${config.branding.footerLink}" target="_blank" rel="noopener noreferrer">
        ${config.branding.footerText}
      </a>
    </div>
  `;
  container.appendChild(panel);

  // Load AI script and create widget
  const createAIWidget = () => {
    // Voice mode - load the Elevenlabs widget
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
          widgetNode.setAttribute('agent-id', config.agentIds.chat);
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
        widgetNode.setAttribute('agent-id', config.agentIds.chat);
        widgetNode.style.width = '100%';
        widgetNode.style.height = '100%';
        contentContainer.appendChild(widgetNode);
      }
    }
  };

  // Initialize widget
  const initWidget = () => {
    // Toggle panel visibility
    let isOpen = false;
    let isDragging = false;
    
    // Set initial position (bottom right)
    const setInitialPosition = () => {
      const orbWidth = orb.offsetWidth || 48;
      const orbHeight = orb.offsetHeight || 48;
      
      // Default position - bottom right with some margin
      const defaultX = window.innerWidth - orbWidth - config.appearance.orbMargin.right;
      const defaultY = window.innerHeight - orbHeight - config.appearance.orbMargin.bottom;
      
      orb.style.left = `${defaultX}px`;
      orb.style.top = `${defaultY}px`;
    };
    
    // Make the orb draggable
    const makeOrbDraggable = () => {
      let offsetX, offsetY;
      
      // Mouse events
      orb.addEventListener('mousedown', function(e) {
        if (isOpen) return;
        
        isDragging = false; // Reset dragging flag
        const initialX = e.clientX;
        const initialY = e.clientY;
        
        // Get the current position of the orb
        const orbRect = orb.getBoundingClientRect();
        
        // Calculate the offset of the mouse click relative to the orb position
        offsetX = e.clientX - orbRect.left;
        offsetY = e.clientY - orbRect.top;
        
        const mouseMove = function(e) {
          // Check if we've moved enough to consider it a drag (prevents accidental drags)
          if (!isDragging) {
            const dx = Math.abs(e.clientX - initialX);
            const dy = Math.abs(e.clientY - initialY);
            if (dx > 5 || dy > 5) {
              isDragging = true;
              orb.classList.add('dragging');
            }
          }
          
          if (isDragging) {
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
        };
        
        const mouseUp = function() {
          if (isDragging) {
            orb.classList.remove('dragging');
          }
          document.removeEventListener('mousemove', mouseMove);
          document.removeEventListener('mouseup', mouseUp);
        };
        
        document.addEventListener('mousemove', mouseMove);
        document.addEventListener('mouseup', mouseUp);
        
        // Prevent default behavior to avoid text selection during drag
        e.preventDefault();
      });
      
      // Touch events for mobile
      orb.addEventListener('touchstart', function(e) {
        if (isOpen) return;
        
        isDragging = false; // Reset dragging flag
        const touch = e.touches[0];
        const initialX = touch.clientX;
        const initialY = touch.clientY;
        
        // Get the current position of the orb
        const orbRect = orb.getBoundingClientRect();
        
        // Calculate the offset of the touch relative to the orb position
        offsetX = touch.clientX - orbRect.left;
        offsetY = touch.clientY - orbRect.top;
        
        const touchMove = function(e) {
          // Check if we've moved enough to consider it a drag
          if (!isDragging) {
            const touch = e.touches[0];
            const dx = Math.abs(touch.clientX - initialX);
            const dy = Math.abs(touch.clientY - initialY);
            if (dx > 5 || dy > 5) {
              isDragging = true;
              orb.classList.add('dragging');
            }
          }
          
          if (isDragging && e.touches.length > 0) {
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
          }
          
          // Prevent default to avoid scrolling while dragging
          e.preventDefault();
        };
        
        const touchEnd = function() {
          if (isDragging) {
            orb.classList.remove('dragging');
          }
          document.removeEventListener('touchmove', touchMove);
          document.removeEventListener('touchend', touchEnd);
        };
        
        document.addEventListener('touchmove', touchMove, { passive: false });
        document.addEventListener('touchend', touchEnd);
        
        // Prevent default behavior to avoid scrolling during drag on mobile
        e.preventDefault();
      }, { passive: false });
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
    
    // Close when clicking on overlay
    overlay.addEventListener('click', () => {
      isOpen = false;
      panel.classList.remove('open');
      orb.classList.remove('hidden');
      overlay.classList.remove('visible');
      document.body.style.overflow = ''; // Allow scrolling again
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
