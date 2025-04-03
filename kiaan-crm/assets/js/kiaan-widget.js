
// Kiaan Voice Assistant Widget
// Version: 1.0.0

(function() {
    'use strict';

    // Configuration variables (populated from PHP settings)
    let config = {
        chatWebhookUrl: '',
        agentIdChat: '',
        agentIdMeeting: '',
        primaryColor: '#60a5fa',
        secondaryColor: '#34d399',
        footerText: 'Powered by Solutions Bajaj',
        footerLink: 'https://solutionsbajaj.com'
    };

    // Initialize the Kiaan widget
    function initKiaanWidget() {
        // Create orb element
        const orb = document.createElement('button');
        orb.className = 'kiaan-orb';
        orb.setAttribute('aria-label', 'Open Kiaan Voice Assistant');
        orb.innerHTML = `
            <div class="kiaan-pulse-ring"></div>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" x2="12" y1="19" y2="22"></line>
            </svg>
        `;
        
        // Set initial position (bottom right)
        orb.style.bottom = '20px';
        orb.style.right = '20px';
        
        // Handle click to open panel
        orb.addEventListener('click', togglePanel);
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'kiaan-overlay';
        overlay.addEventListener('click', closePanel);
        
        // Create panel
        const panel = document.createElement('div');
        panel.className = 'kiaan-panel';
        panel.innerHTML = `
            <div class="kiaan-panel-header">
                <div class="kiaan-panel-title">
                    <div class="kiaan-status-dot"></div>
                    <h2>Kiaan Voice Assistant</h2>
                </div>
                <button class="kiaan-close-btn" aria-label="Close">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div class="kiaan-panel-content">
                <elevenlabs-convai agent-id="placeholder-agent-id"></elevenlabs-convai>
            </div>
            <div class="kiaan-panel-footer">
                <a href="#" target="_blank" rel="noopener noreferrer">Powered by Solutions Bajaj</a>
            </div>
        `;
        
        // Handle close button
        const closeBtn = panel.querySelector('.kiaan-close-btn');
        closeBtn.addEventListener('click', closePanel);
        
        // Append to body
        document.body.appendChild(orb);
        document.body.appendChild(overlay);
        document.body.appendChild(panel);
        
        // Load ElevenLabs script
        const script = document.createElement('script');
        script.src = 'https://api.elevenlabs.io/v1/convai-integration/script.js';
        script.async = true;
        document.head.appendChild(script);
        
        // Apply configuration
        updateConfig();
    }
    
    // Toggle panel visibility
    function togglePanel() {
        const panel = document.querySelector('.kiaan-panel');
        const overlay = document.querySelector('.kiaan-overlay');
        const orb = document.querySelector('.kiaan-orb');
        
        if (panel.classList.contains('open')) {
            closePanel();
        } else {
            panel.classList.add('open');
            overlay.classList.add('visible');
            orb.classList.add('hidden');
        }
    }
    
    // Close panel
    function closePanel() {
        const panel = document.querySelector('.kiaan-panel');
        const overlay = document.querySelector('.kiaan-overlay');
        const orb = document.querySelector('.kiaan-orb');
        
        panel.classList.remove('open');
        overlay.classList.remove('visible');
        orb.classList.remove('hidden');
    }
    
    // Update configuration from PHP settings
    function updateConfig() {
        // This would be populated from PHP in a real implementation
        if (window.kiaanConfig) {
            config = Object.assign(config, window.kiaanConfig);
        }
        
        // Update agent ID
        const convaiElement = document.querySelector('elevenlabs-convai');
        if (convaiElement) {
            convaiElement.setAttribute('agent-id', config.agentIdChat);
        }
        
        // Update footer
        const footer = document.querySelector('.kiaan-panel-footer a');
        if (footer) {
            footer.textContent = config.footerText;
            footer.href = config.footerLink;
        }
        
        // Apply colors
        document.documentElement.style.setProperty('--kiaan-primary-color', config.primaryColor);
        document.documentElement.style.setProperty('--kiaan-secondary-color', config.secondaryColor);
    }
    
    // Initialize on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initKiaanWidget);
    } else {
        initKiaanWidget();
    }
})();
