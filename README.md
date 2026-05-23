# NEXUS - Native EXecution & Understanding System

A Windows-native autonomous AI agent that allows users to control their entire PC through a conversational chat interface.

## Features

- **Claude/ChatGPT-style Chat UI**: Beautiful, responsive chat interface with streaming responses
- **Multi-LLM Support**: Switch between Claude, GPT-4o, Gemini, Groq, Ollama, and custom providers
- **PC Control**: Full control over mouse, keyboard, file system, and applications
- **Screen Vision**: Screenshot capture and OCR text extraction
- **Action Transparency**: See and approve every action before execution
- **Conversation Memory**: Persistent storage of conversations and tasks
- **Windows Integration**: System tray, notifications, custom title bar

## Tech Stack

- **Frontend**: Electron + React + TypeScript + TailwindCSS
- **Agent Engine**: Node.js
- **PC Automation**: Python (pyautogui, pywin32, mss, pytesseract)
- **Database**: SQLite (better-sqlite3)
- **Browser Control**: Playwright

## Installation

### Prerequisites

- Node.js 18+
- Python 3.8+
- Tesseract OCR (for text extraction from screenshots)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/nexus.git
cd nexus
```

2. Install dependencies:
```bash
npm install
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

4. Build the project:
```bash
npm run build
```

5. Run the app:
```bash
npm run dev
```

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Type check
npm run typecheck

# Lint
npm run lint

# Format
npm run format
```

## Configuration

API keys are stored securely in Windows Credential Manager. Configure them in the app settings:

- **Claude**: Get your API key from https://console.anthropic.com
- **OpenAI**: Get your API key from https://platform.openai.com
- **Gemini**: Get your API key from https://ai.google.dev
- **Groq**: Get your API key from https://console.groq.com
- **Ollama**: Install from https://ollama.com and run `ollama serve`

## Safety Modes

- **SAFE** (default): Agent asks for approval before every destructive action
- **AUTO**: Agent executes all steps automatically with audit trail
- **RESTRICTED**: Only file-read and screenshot actions allowed

## License

MIT
