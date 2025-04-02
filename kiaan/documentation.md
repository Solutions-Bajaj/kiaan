
# Kiaan Voice & Chat Assistant - Technical Documentation

This document provides a comprehensive technical overview of the Kiaan Assistant widget, designed for developers who need to understand, modify, or extend its functionality.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [File Structure](#file-structure)
3. [Configuration](#configuration)
4. [Core Components](#core-components)
5. [Voice Mode Integration](#voice-mode-integration)
6. [Text Chat Mode](#text-chat-mode)
7. [UI Elements](#ui-elements)
8. [CSS Styling](#css-styling)
9. [Browser Compatibility](#browser-compatibility)
10. [Webhook API Integration](#webhook-api-integration)
11. [Extending Functionality](#extending-functionality)
12. [Troubleshooting](#troubleshooting)

## Architecture Overview

The Kiaan Assistant is a lightweight, standalone JavaScript widget that can be embedded in any website. It consists of:

- A floating orb that users can click to open the assistant
- A modal panel that displays either a voice or text chat interface
- Integration with ElevenLabs' Convai API for voice interaction
- A custom text chat interface that communicates with a webhook

The widget is designed to be self-contained and requires no external dependencies. It uses vanilla JavaScript and CSS to ensure maximum compatibility and minimal impact on page load times.

## File Structure

```
kiaan/
├── config.js           # Configuration settings
├── kiaan-widget.js     # Main JavaScript implementation
├── kiaan-widget.css    # Styling for the widget
├── README.md           # Installation instructions
└── documentation.md    # This technical documentation
```

## Configuration

The `config.js` file contains all the customizable settings for the widget:

```javascript
const KiaanConfig = {
  // Chat webhook URL
  chatWebhookUrl: "https://example.com/webhook",
  
  // Agent IDs
  agentIds: {
    chat: "agent-id-for-chat",
    meeting: "agent-id-for-meeting"
  },
  
  // Appearance
  appearance: {
    primaryColor: "#60a5fa",
    secondaryColor: "#34d399",
    orbMargin: {
      bottom: 32,
      right: 32
    }
  },
  
  // Branding
  branding: {
    footerText: "Powered by Your Brand",
    footerLink: "https://yourbrand.com"
  }
};
```

### Key Configuration Options

| Option | Description |
|--------|-------------|
| `chatWebhookUrl` | The endpoint that will receive and process chat messages |
| `agentIds.chat` | The ElevenLabs agent ID for standard voice chat |
| `agentIds.meeting` | The ElevenLabs agent ID for meeting mode |
| `appearance.primaryColor` | The primary color for gradients and highlights |
| `appearance.secondaryColor` | The secondary color for gradients |
| `appearance.orbMargin` | Controls the position of the orb |
| `branding.footerText` | Text displayed in the footer |
| `branding.footerLink` | URL for the footer link |

## Core Components

### 1. Orb Component

The orb is the entry point for users to interact with the assistant. It's a draggable button that floats on the page.

Key features:
- Draggable positioning (users can move it)
- Pulse animation to attract attention
- Persists position between page loads (using localStorage)
- Responsive design that adapts to screen size

### 2. Panel Component

The panel appears when the orb is clicked and contains the assistant interface.

Key features:
- Modal dialog with header, content area, and footer
- Backdrop blur effect for modern aesthetics
- Smooth open/close animations
- Responsive sizing based on screen dimensions

### 3. Content Manager

Handles the switching between different interaction modes:
- Text chat interface (custom implementation)
- Voice chat via ElevenLabs Convai API
- Meeting mode via ElevenLabs Convai API

## Voice Mode Integration

The voice mode uses ElevenLabs' Convai API, which is loaded dynamically when needed.

Implementation details:
1. A `<script>` tag is dynamically added to load the Convai widget
2. An `<elevenlabs-convai>` custom element is created with the appropriate agent ID
3. The element is appended to the content container

```javascript
const widgetNode = document.createElement('elevenlabs-convai');
widgetNode.setAttribute('agent-id', config.agentIds.chat); // or meeting
widgetNode.style.width = '100%';
widgetNode.style.height = '100%';
contentContainer.appendChild(widgetNode);
```

## Text Chat Mode

The text chat mode is a custom implementation that sends messages to a webhook and displays the responses.

Key components:
1. Message container - displays the conversation history
2. Input container - contains the text input, file upload, and send button
3. File attachment handling - supports images, PDFs, and other documents

### Message Flow

1. User enters text and/or attaches a file
2. Client sends a POST request to the webhook URL with the message content
3. Webhook processes the message and returns a response
4. Client displays the response in the chat interface

### File Attachment Implementation

Files are handled using the FileReader API to convert them to base64-encoded data URLs for preview. When sending to the server, they're converted back to blobs:

```javascript
// For preview
const reader = new FileReader();
reader.onloadend = () => {
  currentAttachment = reader.result; // base64 data URL
  // Display preview
};
reader.readAsDataURL(file);

// For sending to server
const response = await fetch(currentAttachment);
const blob = await response.blob();
formData.append('file', blob, 'attachment');
```

## UI Elements

### Message Bubbles

Messages are displayed in bubbles with different styling based on who sent them:
- User messages: Right-aligned with blue background
- Assistant messages: Left-aligned with gray background

### File Previews

File previews are shown differently based on file type:
- Images: Thumbnail preview
- Other files: File icon with filename

### Input Area

The input area consists of:
- Text input field
- File attachment button
- Send button (disabled until there's input)

## CSS Styling

The CSS is organized into sections:

1. **Core Components**
   - Orb styling
   - Panel layout
   - Animation definitions

2. **Chat Interface**
   - Message containers and bubbles
   - Input area and buttons
   - File attachments and previews

3. **Responsive Adaptations**
   - Mobile-specific adjustments
   - Touch-friendly controls

### Key CSS Features

- CSS animations for smooth transitions
- Backdrop filters for modern glass effects
- Flexbox layout for responsive positioning
- CSS variables for theming (via JavaScript)

## Browser Compatibility

The widget is compatible with all modern browsers:
- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+
- Opera 47+

### Mobile Support

Special considerations for mobile:
- Touch events for dragging the orb
- Optimized layout for small screens
- Input positioned at the bottom for easier typing
- Larger touch targets for buttons

## Webhook API Integration

### Request Format

When a user sends a message, a POST request is sent to the webhook URL with this structure:

```javascript
// Using FormData
const formData = new FormData();
formData.append('message', 'User text message');

// If there's a file attachment
formData.append('file', blobData, 'filename');
```

### Expected Response Format

The webhook should return a JSON response with either:

```json
{
  "response": "Assistant's reply message"
}
```

or

```json
{
  "output": "Assistant's reply message"
}
```

Both formats are supported for compatibility.

## Extending Functionality

### Adding New Modes

To add a new interaction mode:

1. Update the config object with new agent IDs or endpoints
2. Add mode selection UI elements
3. Implement the mode switching logic
4. Add custom handling for the new mode

### Custom Styling

To customize the appearance beyond the config options:

1. Edit the CSS variables in `kiaan-widget.css`
2. Add new CSS classes for custom elements
3. Modify the existing classes to match your design

### Advanced Features

For more advanced customization:

1. Modify the `kiaan-widget.js` file directly
2. Add event listeners for custom behavior
3. Extend the message handling to support new message types

## Troubleshooting

### Common Issues

1. **Widget doesn't appear**
   - Check if the script tags are properly added to the page
   - Verify that the CSS is properly loaded
   - Check console for JavaScript errors

2. **Voice mode doesn't work**
   - Verify that the ElevenLabs agent ID is correct
   - Check that microphone permissions are granted
   - Ensure the browser supports the required APIs

3. **Messages aren't sending**
   - Verify the webhook URL is correct and accessible
   - Check network tab for HTTP errors
   - Ensure the server is responding with the expected format

### Debugging

The widget includes console logging for key events. To enable verbose logging, add this before loading the widget:

```javascript
window.KiaanDebug = true;
```

This will output detailed logs to the console for troubleshooting.

---

This documentation is intended for developers who need to understand or modify the Kiaan Assistant widget. For basic installation and configuration, please refer to the README.md file.
