require('dotenv').config();
const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
//
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
const corsOptions = {
  origin: 'https://seo-task.onrender.com',
  credentials: true,
};
const _dirname = path.resolve();
app.use(cors(corsOptions));

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);
let accessToken = '';
let refreshToken = '';

app.get('/auth-url', (req, res) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent', // Force consent to get refresh_token every time
    scope: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });
  res.send({ authUrl });
});

app.post('/auth-callback', async (req, res) => {
  const code = req.body.code;
  try {
    const { tokens } = await oAuth2Client.getToken(code);

    accessToken = tokens.access_token;
    refreshToken = tokens.refresh_token;

    console.log('Access Token:', accessToken);
    console.log('Refresh Token:', refreshToken);

    oAuth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    res.send({ success: true });
  } catch (error) {
    console.error('Token exchange failed:', error);
    res.status(400).send({ error: 'Error retrieving access token' });
  }
});

app.get('/search-console-data', async (req, res) => {
  try {
    if (!refreshToken) {
      return res
        .status(401)
        .send({ error: 'Missing refresh token. Please authenticate again.' });
    }

    oAuth2Client.setCredentials({ refresh_token: refreshToken });

    const searchconsole = google.searchconsole({
      version: 'v1',
      auth: oAuth2Client,
    });

    const response = await searchconsole.searchanalytics.query({
      siteUrl: 'https://seoscientist.agency/', // Replace with your verified GSC property
      requestBody: {
        startDate: '2025-05-01',
        endDate: '2025-05-17',
        dimensions: ['query'],
        rowLimit: 10,
      },
    });

    res.send(response.data);
  } catch (error) {
    console.error('Failed to fetch Search Console data:', error.message);
    res.status(500).send({ error: 'Search Console API request failed' });
  }
});
app.use(express.static(path.join(_dirname, '/client/dist')));
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(_dirname, 'client', 'dist', 'index.html'));
});
const PORT = 3001;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
