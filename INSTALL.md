# NEXUS Installation Guide

## Prerequisites

1. **Node.js 18+** - Download from https://nodejs.org
2. **Python 3.8+** - Download from https://python.org
3. **Tesseract OCR** - Required for text extraction from screenshots

### Installing Tesseract OCR (Windows)

1. Download from: https://github.com/UB-Mannheim/tesseract/wiki
2. Install to default location (usually `C:\Program Files\Tesseract-OCR`)
3. Add to PATH: `C:\Program Files\Tesseract-OCR`

## Installation Steps

### 1. Clone and Setup

```bash
cd "C:\Users\Syed Qamber Abbas\nexus"
```

### 2. Install Node.js Dependencies

```bash
npm install
```

### 3. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 4. Build the Project

```bash
npm run build
```

### 5. Run Development Mode

```bash
npm run dev
```

### 6. Build Installer

```bash
npm run build:installer
```

The installer will be created in `packages/app/dist/installer/`

## Configuration

After first launch, configure your AI providers in Settings:

- **Claude**: Get API key from https://console.anthropic.com
- **OpenAI**: Get API key from https://platform.openai.com
- **Gemini**: Get API key from https://ai.google.dev
- **Groq**: Get API key from https://console.groq.com
- **Ollama**: Install from https://ollama.com and run `ollama serve`

## Troubleshooting

### Python not found
Make sure Python is in your PATH. Run `python --version` to verify.

### Tesseract not found
Make sure Tesseract is installed and in your PATH. Run `tesseract --version` to verify.

### Build errors
Delete `node_modules` and `dist` folders, then run `npm install` again.

## System Requirements

- Windows 10/11 (64-bit)
- 4GB RAM minimum (8GB recommended)
- 500MB disk space
- Internet connection for cloud LLM providers
