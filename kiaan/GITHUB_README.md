
# Kiaan Voice Assistant Widget

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A lightweight, embeddable voice assistant widget that can be added to any website. The Kiaan assistant provides an interactive, AI-powered voice and chat interface through a draggable orb that floats on your website.

![Kiaan Voice Assistant](https://placeholder-for-kiaan-screenshot.png)

## Quick Start

1. Clone this repository or download the `kiaan` folder:
   ```bash
   git clone https://github.com/solutions-bajaj/kiaan-widget.git
   ```

2. Copy the `kiaan` folder to your website's root directory.

3. Add the following code to your website footer (before the closing `</body>` tag):
   ```html
   <!-- Kiaan Assistant -->
   <script src="/kiaan/config.js"></script>
   <link rel="stylesheet" href="/kiaan/kiaan-widget.css">
   <script src="/kiaan/kiaan-widget.js"></script>
   ```

That's it! The Kiaan assistant will now appear as a floating, draggable orb in the bottom-right corner of your website.

## Features

- 🎤 **Voice Interactions**: Powered by ElevenLabs Convai API
- 💬 **Text Chat**: Text-based alternative with webhook support
- 🖱️ **Draggable Orb**: Flexible positioning anywhere on the screen
- 📱 **Fully Responsive**: Works on desktop and mobile devices
- 🔗 **Easy Integration**: Simple HTML snippet to add to any website
- 🎨 **Customizable**: Easily change colors, position, and behavior
- 📎 **File Attachments**: Support for various file formats
- 🔄 **Persistent State**: Remembers user settings between sessions

## Configuration

Customize the Kiaan assistant by editing the `kiaan/config.js` file:

```javascript
const KiaanConfig = {
  // Chat webhook URL for text-based messaging
  chatWebhookUrl: "https://your-webhook-url.com",
  
  // Agent IDs for voice interactions (from ElevenLabs)
  agentIds: {
    chat: "your-elevenLabs-agent-id",
    meeting: "your-meeting-mode-agent-id"
  },
  
  // Customization options
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

## Browser Compatibility

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+
- Opera 47+

## Troubleshooting

If the assistant doesn't appear:
1. Check that all files are in the correct locations
2. Ensure the script tags are added before the closing `</body>` tag
3. Check the browser console for any errors
4. Verify that the webhook URL in the config file is correct

## React Integration

For React projects, we provide a dedicated React component:

```jsx
import KiaanVoiceAssistant from './components/KiaanVoiceAssistant';

function App() {
  return (
    <div>
      <h1>Your Application</h1>
      <KiaanVoiceAssistant />
    </div>
  );
}
```

## License

[MIT License](LICENSE)
