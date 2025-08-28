# SNRT Subtitle Generation Frontend

This is the frontend application for SNRT Subtitle Generation, a web-based tool designed to generate subtitles for videos using advanced AI models. The project provides a modern, responsive user interface for uploading videos, viewing results, and managing subtitle files.

## Features
- Upload video files for subtitle generation
- View and download generated subtitles
- Responsive design for desktop and mobile
- Modern UI components built with React and Tailwind CSS

## Tech Stack
- **React** (TypeScript)
- **Vite** (build tool)
- **Tailwind CSS** (styling)
- **Bun** (package manager)

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) or [Bun](https://bun.sh/)

### Installation
Clone the repository and install dependencies:

```bash
git clone <repo-url>
cd subtitle_generation
bun install # or npm install
```

### Running the Development Server

```bash
bun run dev # or npm run dev
```
The app will be available at `http://localhost:5173` (default Vite port).

### Building for Production

```bash
bun run build # or npm run build
```

### Preview Production Build

```bash
bun run preview # or npm run preview
```

## Project Structure

- `src/` - Main source code
	- `components/` - Reusable UI components
	- `pages/` - Application pages (Landing, Upload, Result, etc.)
	- `hooks/` - Custom React hooks
	- `lib/` - Utility functions and API calls
	- `assets/` - Images and static assets
- `public/` - Static files
- `index.html` - Main HTML file
- `vite.config.ts` - Vite configuration
- `tailwind.config.js` - Tailwind CSS configuration

## Contributing
Contributions are welcome! Please open issues or submit pull requests for improvements and bug fixes.

## License
This project is licensed under the MIT License.

## Contact
For questions or support, please contact the SNRT team.
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/d35e9720-8b84-4b92-99e6-c78ee76e5166

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/d35e9720-8b84-4b92-99e6-c78ee76e5166) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

