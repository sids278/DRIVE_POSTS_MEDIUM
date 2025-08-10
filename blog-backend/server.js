const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { google } = require('googleapis');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5001;
const cors = require('cors');
app.use(cors({ origin: 'http://localhost:3000' }));
const posts = []; // In-memory posts array (for demo; replace with DB in production)
// Google Drive folder ID (replace with your own folder ID)
const FOLDER_ID =process.env.FOLDER_ID || '';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const upload = multer({ dest: 'uploads/' });


const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');
const TOKEN_PATH = path.join(__dirname, 'token.json');

let oAuth2Client;

fs.readFile(CREDENTIALS_PATH, (err, content) => {
  if (err) {
    console.error('Error loading credentials.json:', err);
    return;
  }

  const credentials = JSON.parse(content);

  const authData = credentials.installed || credentials.web;
  if (!authData) {
    console.error('Invalid credentials.json format. No installed or web keys found.');
    return;
  }

  const { client_secret, client_id, redirect_uris } = authData;
  oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) {
      console.log('No token found. Visit http://localhost:5001/auth to authenticate.');
    } else {
      oAuth2Client.setCredentials(JSON.parse(token));
    }
  });
});

app.get('/auth', (req, res) => {
  if (!oAuth2Client) return res.status(500).send('OAuth client not initialized.');

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/drive.file'],
  });
  res.redirect(authUrl);
});

// OAuth2 callback
app.get('/oauth2callback', (req, res) => {
  const code = req.query.code;
  if (!oAuth2Client) return res.status(500).send('OAuth client not initialized.');

  oAuth2Client.getToken(code, (err, token) => {
    if (err) return res.status(400).send('Error retrieving access token: ' + err.message);

    oAuth2Client.setCredentials(token);
    fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
      if (err) console.error('Error saving token:', err);
      console.log('Token stored to', TOKEN_PATH);
    });

    res.send('Authentication successful! You can now POST files to /upload.');
  });
});

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded. Field name must be "file".' });
    }
    if (!oAuth2Client) {
      return res.status(500).json({ error: 'OAuth client not initialized.' });
    }

    const drive = google.drive({ version: 'v3', auth: oAuth2Client });

    const fileMetadata = {
      name: req.file.originalname,
      parents: [FOLDER_ID],
    };

    const media = {
      mimeType: req.file.mimetype,
      body: fs.createReadStream(req.file.path),
    };

    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id',
    });

    // Remove local temp file
    fs.unlinkSync(req.file.path);

    res.json({ fileId: file.data.id, message: 'File uploaded successfully!' });
  } catch (err) {
    console.error('Error uploading file:', err);
    res.status(500).json({ error: 'Error uploading file', details: err.message });
  }
});

app.post('/upload-text', async (req, res) => {
  try {
    const { text, filename } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'No text provided.' });
    }
    if (!oAuth2Client) {
      return res.status(500).json({ error: 'OAuth client not initialized.' });
    }

    const safeFilename = filename && filename.trim() ? filename.trim() : `uploaded_text_${Date.now()}.txt`;
    const tempPath = path.join(__dirname, 'uploads', `${Date.now()}_${safeFilename}`);

    fs.writeFileSync(tempPath, text, 'utf8');

    const drive = google.drive({ version: 'v3', auth: oAuth2Client });

    const fileMetadata = {
      name: safeFilename,
      parents: [FOLDER_ID],
    };

    const media = {
      mimeType: 'text/plain',
      body: fs.createReadStream(tempPath),
    };

    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id',
    });

    fs.unlinkSync(tempPath);

    res.json({ fileId: file.data.id, message: 'Text uploaded successfully!' });
  } catch (err) {
    console.error('Error uploading text:', err);
    res.status(500).json({ error: 'Error uploading text', details: err.message });
  }
});


// Get all posts
app.get('/posts', async (req, res) => {
  try {
    if (!oAuth2Client) {
      return res.status(500).json({ error: 'OAuth client not initialized.' });
    }

    const drive = google.drive({ version: 'v3', auth: oAuth2Client });

    const response = await drive.files.list({
      q: `'${FOLDER_ID}' in parents and trashed=false and mimeType='text/plain'`,
      fields: 'files(id, name, mimeType, createdTime)',
      orderBy: 'createdTime desc',
    });

    const files = await Promise.all(
      response.data.files.map(async (file) => {
        const contentRes = await drive.files.get(
          { fileId: file.id, alt: 'media' },
          { responseType: 'text' }
        );

        return {
          id: file.id,
          title: file.name.replace(/\.[^/.]+$/, ""), // remove extension
          content: contentRes.data,
          createdAt: file.createdTime
        };
      })
    );

    res.json(files);
  } catch (err) {
    console.error('Error fetching posts from Drive:', err);
    res.status(500).json({ error: 'Error fetching posts', details: err.message });
  }
});
app.post('/posts', async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!content) {
      return res.status(400).json({ error: 'No content provided.' });
    }
    if (!oAuth2Client) {
      return res.status(500).json({ error: 'OAuth client not initialized.' });
    }

    const safeFilename = title && title.trim() ? `${title.trim()}.txt` : `post_${Date.now()}.txt`;
    const tempPath = path.join(__dirname, 'uploads', `${Date.now()}_${safeFilename}`);
    fs.writeFileSync(tempPath, content, 'utf8');

    const drive = google.drive({ version: 'v3', auth: oAuth2Client });
    const fileMetadata = {
      name: safeFilename,
      parents: [FOLDER_ID],
    };
    const media = {
      mimeType: 'text/plain',
      body: fs.createReadStream(tempPath),
    };

    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id, createdTime',
    });

    fs.unlinkSync(tempPath);

    const post = {
      id: file.data.id,
      title,
      content,
      createdAt: file.data.createdTime,
    };
    posts.push(post); // optional: only for keeping recent cache

    res.json({ message: 'Post created successfully!', post });
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ error: 'Error creating post', details: err.message });
  }
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
