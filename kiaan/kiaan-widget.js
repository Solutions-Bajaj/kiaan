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
    // Determine which mode to use - text or voice
    const mode = panel.getAttribute('data-mode') || 'text';
    const contentContainer = document.getElementById('kiaan-ai-content');
    
    if (mode === 'voice') {
      // Voice mode - load the Elevenlabs widget
      if (!document.querySelector('script[src="https://elevenlabs.io/convai-widget/index.js"]')) {
        const script = document.createElement('script');
        script.src = 'https://elevenlabs.io/convai-widget/index.js';
        script.async = true;
        script.type = 'text/javascript';
        document.body.appendChild(script);
        
        // After script loads, create the widget
        script.onload = () => {
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
        if (contentContainer && !contentContainer.querySelector('elevenlabs-convai')) {
          const widgetNode = document.createElement('elevenlabs-convai');
          widgetNode.setAttribute('agent-id', config.agentIds.chat);
          widgetNode.style.width = '100%';
          widgetNode.style.height = '100%';
          contentContainer.appendChild(widgetNode);
        }
      }
    } else {
      // Text mode - load chat interface
      if (contentContainer) {
        contentContainer.innerHTML = '';
        
        // Create chat container
        const chatContainer = document.createElement('div');
        chatContainer.className = 'kiaan-chat-container';
        contentContainer.appendChild(chatContainer);
        
        // Add chat interface
        initializeChatInterface(chatContainer);
      }
    }
  };

  // Initialize text chat interface
  const initializeChatInterface = (container) => {
    // Create messages container
    const messagesContainer = document.createElement('div');
    messagesContainer.className = 'kiaan-messages-container';
    container.appendChild(messagesContainer);
    
    // Create input container
    const inputContainer = document.createElement('div');
    inputContainer.className = 'kiaan-input-container';
    container.appendChild(inputContainer);
    
    // Create file preview area
    const previewContainer = document.createElement('div');
    previewContainer.className = 'kiaan-preview-container';
    previewContainer.style.display = 'none';
    inputContainer.appendChild(previewContainer);
    
    // Create input area
    const inputWrapper = document.createElement('div');
    inputWrapper.className = 'kiaan-input-wrapper';
    inputContainer.appendChild(inputWrapper);
    
    // Create actual input field
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'kiaan-input';
    input.placeholder = 'Type your message...';
    inputWrapper.appendChild(input);
    
    // Create file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.className = 'kiaan-file-input';
    fileInput.id = 'kiaan-file-input';
    fileInput.accept = 'image/*,.pdf,.doc,.docx,.txt';
    fileInput.style.display = 'none';
    inputWrapper.appendChild(fileInput);
    
    // Create file button
    const fileButton = document.createElement('button');
    fileButton.className = 'kiaan-file-button';
    fileButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>';
    fileButton.addEventListener('click', () => fileInput.click());
    inputWrapper.appendChild(fileButton);
    
    // Create send button
    const sendButton = document.createElement('button');
    sendButton.className = 'kiaan-send-button';
    sendButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>';
    sendButton.disabled = true;
    inputWrapper.appendChild(sendButton);
    
    // Store messages and attachment
    let messages = [];
    let currentAttachment = null;
    
    // Handle file selection
    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onloadend = () => {
        currentAttachment = reader.result;
        
        // Show preview
        previewContainer.style.display = 'block';
        
        // Create preview content
        if (file.type.startsWith('image/')) {
          previewContainer.innerHTML = `
            <div class="kiaan-attachment-preview">
              <img src="${currentAttachment}" alt="Attachment">
              <button class="kiaan-remove-attachment">×</button>
            </div>
          `;
        } else {
          previewContainer.innerHTML = `
            <div class="kiaan-attachment-preview">
              <div class="kiaan-file-icon">${file.name}</div>
              <button class="kiaan-remove-attachment">×</button>
            </div>
          `;
        }
        
        // Enable send button if we have attachment
        sendButton.disabled = false;
        
        // Add remove button handler
        const removeButton = previewContainer.querySelector('.kiaan-remove-attachment');
        if (removeButton) {
          removeButton.addEventListener('click', () => {
            currentAttachment = null;
            previewContainer.style.display = 'none';
            fileInput.value = '';
            sendButton.disabled = input.value.trim() === '';
          });
        }
      };
      
      reader.readAsDataURL(file);
    });
    
    // Enable/disable send button based on input
    input.addEventListener('input', () => {
      sendButton.disabled = input.value.trim() === '' && !currentAttachment;
    });
    
    // Handle Enter key
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !sendButton.disabled) {
        sendMessage();
      }
    });
    
    // Handle send button click
    sendButton.addEventListener('click', sendMessage);
    
    // Function to send message
    async function sendMessage() {
      const text = input.value.trim();
      if (!text && !currentAttachment) return;
      
      // Add user message to UI
      addMessage('user', text, currentAttachment);
      
      // Clear input
      input.value = '';
      previewContainer.style.display = 'none';
      
      // Prepare data to send
      const formData = new FormData();
      formData.append('message', text);
      
      if (currentAttachment) {
        // Convert base64 to blob
        const response = await fetch(currentAttachment);
        const blob = await response.blob();
        formData.append('file', blob, 'attachment');
        
        // Reset attachment
        currentAttachment = null;
        fileInput.value = '';
      }
      
      // Disable send button
      sendButton.disabled = true;
      
      try {
        // Send to webhook
        const response = await fetch(config.chatWebhookUrl, {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        // Parse response
        const data = await response.json();
        
        // Add bot response to UI
        addMessage('assistant', data.response || data.output);
      } catch (error) {
        console.error('Error sending message:', error);
        addMessage('assistant', 'Sorry, I encountered an error. Please try again.');
      }
      
      // Re-enable send button based on input
      sendButton.disabled = input.value.trim() === '';
    }
    
    // Function to add a message to the UI
    function addMessage(role, content, attachment = null) {
      // Create message element
      const messageElement = document.createElement('div');
      messageElement.className = `kiaan-message kiaan-message-${role}`;
      
      // Create content element
      const contentElement = document.createElement('div');
      contentElement.className = 'kiaan-message-content';
      contentElement.textContent = content;
      messageElement.appendChild(contentElement);
      
      // Add attachment if present
      if (attachment) {
        const attachmentElement = document.createElement('div');
        attachmentElement.className = 'kiaan-message-attachment';
        
        // Check if it's an image
        if (attachment.startsWith('data:image/')) {
          const img = document.createElement('img');
          img.src = attachment;
          img.alt = 'Attachment';
          attachmentElement.appendChild(img);
        } else {
          // Generic file attachment
          attachmentElement.textContent = 'File attachment';
        }
        
        messageElement.appendChild(attachmentElement);
      }
      
      // Add to messages container
      messagesContainer.appendChild(messageElement);
      
      // Scroll to bottom
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      
      // Add to messages array
      messages.push({ role, content, attachment });
    }
  };

  // Add styles
  const addStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
      .kiaan-orb {
        position: fixed;
        bottom: ${config.appearance.orbMargin.bottom}px;
        right: ${config.appearance.orbMargin.right}px;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        background: linear-gradient(to right, ${config.appearance.primaryColor}, ${config.appearance.secondaryColor});
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
        background: linear-gradient(to right, ${config.appearance.primaryColor}, ${config.appearance.secondaryColor});
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
        display: flex;
        flex-direction: column;
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
        color: ${config.appearance.primaryColor};
      }
      
      /* Chat interface styles */
      .kiaan-chat-container {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 1rem;
      }
      
      .kiaan-messages-container {
        flex: 1;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        margin-bottom: 1rem;
      }
      
      .kiaan-message {
        display: flex;
        flex-direction: column;
        max-width: 80%;
        padding: 0.75rem;
        border-radius: 0.75rem;
      }
      
      .kiaan-message-user {
        align-self: flex-end;
        background-color: #e0f2fe;
        color: #0c4a6e;
      }
      
      .kiaan-message-assistant {
        align-self: flex-start;
        background-color: #f1f5f9;
        color: #334155;
      }
      
      .kiaan-message-attachment {
        margin-top: 0.5rem;
        max-width: 100%;
        border-radius: 0.5rem;
        overflow: hidden;
      }
      
      .kiaan-message-attachment img {
        max-width: 100%;
        max-height: 200px;
        object-fit: contain;
      }
      
      .kiaan-input-container {
        display: flex;
        flex-direction: column;
      }
      
      .kiaan-preview-container {
        margin-bottom: 0.5rem;
      }
      
      .kiaan-attachment-preview {
        position: relative;
        display: inline-block;
        max-width: 100px;
        max-height: 100px;
        border-radius: 0.5rem;
        overflow: hidden;
        border: 1px solid #e2e8f0;
      }
      
      .kiaan-attachment-preview img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      .kiaan-file-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100px;
        height: 60px;
        background-color: #f1f5f9;
        color: #64748b;
        font-size: 0.75rem;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 0.25rem;
      }
      
      .kiaan-remove-attachment {
        position: absolute;
        top: -5px;
        right: -5px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: #ef4444;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        cursor: pointer;
        font-size: 1rem;
        line-height: 1;
      }
      
      .kiaan-input-wrapper {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background-color: white;
        border: 1px solid #e2e8f0;
        border-radius: 0.5rem;
        padding: 0.5rem;
      }
      
      .kiaan-input {
        flex: 1;
        border: none;
        outline: none;
        font-size: 1rem;
        background: transparent;
      }
      
      .kiaan-file-button,
      .kiaan-send-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2rem;
        height: 2rem;
        border-radius: 0.5rem;
        border: none;
        cursor: pointer;
        color: #64748b;
        background-color: transparent;
        transition: all 0.2s ease;
      }
      
      .kiaan-file-button:hover,
      .kiaan-send-button:not(:disabled):hover {
        background-color: #f1f5f9;
        color: ${config.appearance.primaryColor};
      }
      
      .kiaan-send-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      
      /* Panel decorative elements */
      .kiaan-panel::before {
        content: "";
        position: absolute;
        top: -6rem;
        right: -6rem;
        width: 12rem;
        height: 12rem;
        border-radius: 50%;
        background: linear-gradient(to right, ${config.appearance.primaryColor}, ${config.appearance.secondaryColor});
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
        background: linear-gradient(to right, ${config.appearance.secondaryColor}, ${config.appearance.primaryColor});
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
        
        .kiaan-message {
          max-width: 90%;
        }
        
        .kiaan-input-wrapper {
          padding: 0.4rem;
        }
        
        .kiaan-file-button,
        .kiaan-send-button {
          width: 1.75rem;
          height: 1.75rem;
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
    
    // Toggle between text and voice modes
    let currentMode = 'text'; // Default to text mode
    
    // Function to switch modes
    const switchMode = (mode) => {
      currentMode = mode;
      panel.setAttribute('data-mode', mode);
      
      // Clear existing content
      const contentContainer = document.getElementById('kiaan-ai-content');
      if (contentContainer) {
        contentContainer.innerHTML = '';
      }
      
      // Create the appropriate widget
      createAIWidget();
    };
    
    // Handle orb click to open panel
    orb.addEventListener('click', function(e) {
      if (!isDragging) {
        isOpen = true;
        panel.classList.add('open');
        orb.classList.add('hidden');
        overlay.classList.add('visible');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        // Initialize in the current mode
        switchMode(currentMode);
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
    
    // Prevent closing panel when clicking inside
    panel.addEventListener('click', (e) => {
      e.stopPropagation();
    });
    
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
