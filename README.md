# AI Transcription Frontend

A modern React-based web application for processing and transcribing video content with automatic subtitle generation and multilingual support.

## Description

This frontend application provides an intuitive interface for video transcription services. Users can upload video files, select input and target languages, choose ASR model sizes, and receive processed videos with embedded subtitles. The application also generates text summaries of the transcribed content.

## Features

- Video file upload with drag-and-drop support
- Multiple language selection for transcription and translation
- ASR model size configuration
- Subtitle track downloads in VTT format
- Processed video downloads with embedded subtitles
- Text summaries of transcribed content
- Responsive design with modern UI components

## Technology Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Radix UI with shadcn/ui components
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: TanStack Query (React Query)
- **HTTP Client**: Axios and Fetch API
- **Package Manager**: npm

## Prerequisites

- Node.js (version 18 or higher)
- npm (comes with Node.js)
- Access to the AI Transcription Pipeline API

## API Integration

This application is designed to consume the REST API provided by the [AI Transcription Pipeline](https://github.com/D0esN0tM1tter/ai_transcription_pipeline) repository. Ensure the backend API is running and accessible before using this frontend application.

## Installation

1. Clone the repository:

**Linux/macOS:**
```bash
git clone <repository-url>
cd ai_transcription_frontend
```

**Windows (Command Prompt):**
```cmd
git clone <repository-url>
cd ai_transcription_frontend
```

**Windows (PowerShell):**
```powershell
git clone <repository-url>
cd ai_transcription_frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure the API endpoint:
   - The application expects the backend API to be available at `/api/*` endpoints
   - Configure your proxy settings in `vite.config.ts` if the API runs on a different port

## Running the Application

### Development Mode

Start the development server:

**Linux/macOS:**
```bash
npm run dev
```

**Windows (Command Prompt):**
```cmd
npm run dev
```

**Windows (PowerShell):**
```powershell
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build

1. Build the application:

**Linux/macOS:**
```bash
npm run build
```

**Windows (Command Prompt/PowerShell):**
```cmd
npm run build
```

2. Preview the production build:

**Linux/macOS:**
```bash
npm run preview
```

**Windows (Command Prompt/PowerShell):**
```cmd
npm run preview
```

### Development Build

For development environment builds:

**Linux/macOS:**
```bash
npm run build:dev
```

**Windows (Command Prompt/PowerShell):**
```cmd
npm run build:dev
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui component library
│   ├── Hero.tsx        # Landing page hero section
│   ├── Navigation.tsx  # Main navigation component
│   └── ...
├── pages/              # Route components
│   ├── Landing.tsx     # Landing page
│   ├── Upload.tsx      # Video upload interface
│   ├── Result.tsx      # Processing results display
│   └── NotFound.tsx    # 404 page
├── lib/                # Utility functions and API calls
│   ├── api.ts          # API integration functions
│   └── utils.ts        # General utilities
├── hooks/              # Custom React hooks
└── assets/             # Static assets
```

## API Endpoints

The application integrates with the following API endpoints:

- `POST /api/pipeline/process` - Submit video for processing
- `GET /api/downloads/download_video/{jobId}` - Download processed video
- `GET /api/downloads/download_subtitles/{jobId}/{languageCode}` - Download subtitle files
- `GET /api/downloads/summaries/{jobId}` - Fetch text summaries

## Development

### Code Quality

Run ESLint for code quality checks:

**Linux/macOS:**
```bash
npm run lint
```

**Windows (Command Prompt/PowerShell):**
```cmd
npm run lint
```

### Styling

The application uses Tailwind CSS for styling with a custom design system. Component styles are defined using the shadcn/ui library for consistency and accessibility.

## Contributing

1. Follow the existing code style and conventions
2. Ensure all TypeScript types are properly defined
3. Test your changes thoroughly before submitting
4. Update documentation as needed

## License

This project is private and proprietary.
