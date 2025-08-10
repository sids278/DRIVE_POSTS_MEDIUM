# Blog CRUD API with Google Drive Integration

This project is a full-stack blog application where blog posts can be created, uploaded (with optional file attachments), and retrieved. The backend stores uploaded files and text files in a specified Google Drive folder using Google Drive API and OAuth 2.0 authentication. The frontend is built with React and communicates with the backend to create and display blog posts.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Google API Setup](#google-api-setup)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [API Endpoints](#api-endpoints)
- [Common Issues and Troubleshooting](#common-issues-and-troubleshooting)
- [Styling and UI](#styling-and-ui)
- [Future Improvements](#future-improvements)

---

## Project Overview

- **Backend**: Node.js + Express server handles OAuth 2.0 authentication, file uploads, text uploads, and blog post CRUD operations. Uploaded files are saved in a Google Drive folder.
- **Frontend**: React app with components for creating blog posts (with optional file uploads) and listing posts fetched from the backend.
- **Storage**: Google Drive used as storage for uploaded files and text posts.
- **Authentication**: Uses Google OAuth 2.0 with client credentials and refresh tokens.

---

## Features

- OAuth 2.0 flow to authenticate and authorize Google Drive API access.
- Upload files to Google Drive folder.
- Upload plain text posts to Google Drive as `.txt` files.
- Create blog posts referencing uploaded files or text content.
- List and display blog posts by fetching text content from Google Drive.
- Frontend React form to create posts and upload files.
- Posts displayed with improved styling using Noto Sans font and dark mode support.

---

## Prerequisites

- Node.js and npm installed on your machine.
- Google account with Google Drive enabled.
- Visual Studio or your preferred editor for frontend React development.

---

## Google API Setup

1. **Create a Google Cloud Project:**

   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one.

2. **Enable Drive API:**

   - Navigate to **APIs & Services > Library**.
   - Search for **Google Drive API** and enable it.

3. **Create OAuth 2.0 Credentials:**

   - Go to **APIs & Services > Credentials**.
   - Click **Create Credentials > OAuth client ID**.
   - Choose **Desktop app** or **Web application** depending on your usage.
   - Add authorized redirect URI:  
     ```
     http://localhost:5001/oauth2callback
     ```
   - Download the JSON file (credentials.json).

4. **Place `credentials.json` in your backend project root folder.**

5. **Authentication Flow:**

   - Run the backend server.
   - Visit `http://localhost:5001/auth` in browser.
   - Sign in with your Google account and authorize.
   - The token will be saved to `token.json` for future use.

---

## Backend Setup

1. Clone or download the backend folder.

2. Place `credentials.json` in the backend folder.

3. Install dependencies:

   ```bash
   npm install express multer googleapis body-parser cors
