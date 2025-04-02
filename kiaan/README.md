
# Kiaan Voice & Chat Assistant

A lightweight, embeddable voice and chat assistant widget that can be added to any website. This widget provides an interactive, AI-powered assistant that floats on your website and can be accessed with a simple click.

## Installation

Installing the Kiaan assistant into your website is easy:

### 1. Copy the Kiaan folder

Place the entire `kiaan` folder in your website's root directory. For example:

```
/var/www/html/your-website/kiaan/
```

### 2. Add the following code to your footer (before the closing `</body>` tag):

```html
<!-- Kiaan Assistant -->
<script src="/kiaan/config.js"></script>
<link rel="stylesheet" href="/kiaan/kiaan-widget.css">
<script src="/kiaan/kiaan-widget.js"></script>
```

That's it! The Kiaan assistant will now appear as a floating orb in the bottom-right corner of your website.

## Customization

### Configuration

You can customize the Kiaan assistant by editing the `kiaan/config.js` file:

```javascript
const KiaanConfig = {
  // Chat webhook URL for text-based messaging
  chatWebhookUrl: "https://choco.solutionsbajaj.com/webhook/sberpkiaan",
  
  // Agent IDs for voice interactions
  agentIds: {
    // Standard chat agent ID
    chat: "S4i7eNeg211h4p6hHRXK",
    
    // Meeting mode agent ID
    meeting: "0OxkgMLQJmZuT23PE2Cv"
  },
  
  // Customization options
  appearance: {
    // Main gradient colors
    primaryColor: "#60a5fa",
    secondaryColor: "#34d399",
    
    // Position of the orb (in pixels from the edge)
    orbMargin: {
      bottom: 32,
      right: 32
    }
  },
  
  // Branding
  branding: {
    // Footer text and link
    footerText: "Powered by Solutions Bajaj",
    footerLink: "https://solutionsbajaj.com"
  }
};
```

### Important Configuration Properties

- **chatWebhookUrl**: The webhook URL that will process text messages from the chat interface
- **agentIds.chat**: The ElevenLabs agent ID for the standard voice chat mode
- **agentIds.meeting**: The ElevenLabs agent ID for the meeting mode
- **appearance.primaryColor** and **appearance.secondaryColor**: The colors used for the gradient in the orb and other UI elements
- **appearance.orbMargin**: Controls the position of the orb from the bottom and right edges of the screen
- **branding**: Customize the footer text and link

## Advanced Customization

For more advanced customization, you can modify the CSS in `kiaan-widget.css` or the JavaScript in `kiaan-widget.js`.

## Browser Compatibility

The Kiaan assistant works in all modern browsers:
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

## Support

For assistance, please contact:
- Email: support@solutionsbajaj.com

## License

MIT License
