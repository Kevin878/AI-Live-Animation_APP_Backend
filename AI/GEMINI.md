# GEMINI.md

## Project Overview

This project is a Node.js web server that provides an API for audio analysis using Google's Gemini AI. It uses Express.js to create the web server and Multer to handle file uploads. The core functionality is to receive an audio file, send it to the Gemini 2.5 Flash-Lite model, and return a summarized transcript of the audio.

The code is written in modern JavaScript (ES modules) and includes comments in Traditional Chinese.

## Building and Running

### Prerequisites

*   Node.js installed
*   A Google Gemini API key

### Installation

1.  Install the dependencies:
    ```bash
    npm install
    ```

### Running the Application

1.  Set the `GEMINI_API_KEY` environment variable with your API key:
    ```bash
    export GEMINI_API_KEY="YOUR_API_KEY"
    ```

2.  Start the server:
    ```bash
    node index.js
    ```

The server will start on `http://localhost:3000`.

## API Endpoint

### `POST /api/analyze-audio`

*   **Description:** Analyzes an audio file and returns a summarized transcript.
*   **Request:** `multipart/form-data` with an `audio` field containing the audio file.
*   **Response:** A JSON object with the summarized transcript.

**Example using `curl`:**

```bash
curl -X POST -F "audio=@/path/to/your/audio.webm" http://localhost:3000/api/analyze-audio
```

## Development Conventions
*   **ES Modules:** The project uses ES modules (`import`/`export`).
*   **Code Style:** The code is well-formatted and includes descriptive comments in Traditional Chinese.
*   **Error Handling:** The server includes basic error handling for API calls and file uploads.
*   **Environment Variables:** The Gemini API key is managed through an environment variable (`GEMINI_API_KEY`) for security.
