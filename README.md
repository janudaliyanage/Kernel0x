# Kernel0X

Kernel0X is a Capture The Flag (CTF) project developed for cybersecurity learning and practice. This repository includes the website frontend, backend, and supporting project files.

## Requirements

Before running the project, make sure you have installed:

- Git
- Node.js
- npm

## Getting Started

### 1. Clone the repository

Open a terminal and run:

```bash
git clone https://github.com/janudaliyanage/Kernel0x.git
```

Move into the project directory:

```bash
cd Kernel0x
```

### 2. Install dependencies

Install the project dependencies using npm:

```bash
npm install
```

If the frontend and backend have separate `package.json` files, install their dependencies separately as well.

For the frontend:

```bash
cd frontend
npm install
```

For the backend, open another terminal from the project root:

```bash
cd backend
npm install
```

### 3. Run the website

Check the available scripts in each `package.json` file:

```bash
npm run
```

Use the appropriate command listed in the scripts to start the frontend and backend. If the frontend provides a `dev` script, run:

```bash
npm run dev
```

Start the backend using its configured development or start script.

### 4. Open the website

After starting the required services, open the local URL shown in the terminal in your web browser.

Keep the frontend and backend terminals running while using the website.

## Project Structure

- `frontend/` – Website user interface
- `backend/` – Server-side application
- `public/` – Public assets and resources
- `package.json` – Project dependencies and npm scripts
- `README.md` – Project documentation

## Notes

- Install the dependencies before starting the application.
- The frontend and backend may need to run in separate terminals.
- Follow any environment configuration required by the project.
- Do not upload passwords, API keys, or other sensitive configuration to GitHub.

