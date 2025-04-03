
# Kiaan - Voice Assistant Widget

A futuristic, voice-only assistant widget powered by Solutions Bajaj AI.

## Features

- Floating, animated assistant orb in the bottom-right corner
- Seamless integration with voice agent
- Clean, futuristic white design with subtle animations
- Fully responsive interface
- Easy to embed in any website
- File attachments support (PDF, CSV, JPEG, PNG, WEBP, XLSX, DOCX)
- Unique user tracking with persistent user IDs

## Usage

### React Component

For React projects, import the `KiaanVoiceAssistant` component:

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

### Standalone Widget

For non-React websites, add this simple HTML snippet:

```html
<!-- Add this to your HTML -->
<link rel="stylesheet" href="https://your-site.com/kiaan-widget.css">
<script src="https://your-site.com/kiaan-widget.js"></script>
```

## API Integration

### Webhook Request Format

When a user interacts with the chat interface, the following JSON payload is sent to your webhook:

```json
{
  "message": "User's text message",
  "attachments": [
    {
      "name": "document.pdf",
      "type": "application/pdf",
      "data": "base64-encoded-file-content"
    }
  ],
  "userId": "unique-user-identifier",
  "userName": "Guest User",
  "timestamp": "2023-06-15T14:30:45.123Z"
}
```

- `message`: The text input from the user (may be empty if only files are sent)
- `attachments`: Array of file attachments (optional)
- `userId`: A unique identifier for the user, persisted across sessions
- `userName`: The name of the user, defaults to "Guest User"
- `timestamp`: ISO timestamp when the request was sent

### Webhook Response Format

Your webhook should return one of the following formats:

```json
{
  "response": "Your response text here",
  "attachments": [
    {
      "name": "response.pdf",
      "type": "application/pdf",
      "data": "base64-encoded-file-content"
    }
  ]
}
```

OR

```json
{
  "output": "Your response text here",
  "attachments": [
    {
      "name": "response.pdf",
      "type": "application/pdf",
      "data": "base64-encoded-file-content"
    }
  ]
}
```

Plain text responses are also supported.

## Customization

You can customize the appearance of the Kiaan assistant by modifying the CSS variables in the `kiaan-widget.css` file.

## License

MIT
