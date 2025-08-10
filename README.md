# Google Drive Blog Posts API

This is a **Node.js + Express** backend API for a blog application that stores blog posts and uploaded files directly on **Google Drive** instead of a traditional database.

---

## Features

- OAuth2 authentication with Google Drive API  
- Upload plain text blog posts as `.txt` files to a specified Google Drive folder  
- Upload files (images, documents, etc.) to Google Drive  
- Fetch all blog posts by reading `.txt` files from Google Drive folder  
- In-memory storage of post metadata (for demo/testing)  
- CORS enabled for React frontend at `localhost:3000`  

---

## Setup & Usage

### Prerequisites

- Node.js installed  
- Google Cloud project with Drive API enabled  
- OAuth 2.0 client credentials JSON file (`credentials.json`)  
- Google Drive folder created for storing blog posts and files  
- OAuth token file (`token.json`) generated after first OAuth flow  

---

### Installation

1. Clone the repository and navigate inside the project directory:
   ```bash
   git clone https://github.com/USERNAME/REPO.git
   cd REPO
