// Load environment variables from the correct .env file
const path = require('path');
const ENV_PATH = process.env.NODE_ENV === 'production' 
  ? '.env.production' 
  : '.env.development';

require('dotenv').config({ path: path.resolve(__dirname, ENV_PATH) });

const express = require('express');
const http = require('http');
const cors = require('cors');
const axios = require('axios');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
const FRONTEND_URL =
  (process.env.FRONTEND_URL || 'http://localhost:5173').trim();
const ARCGIS_LAYER_URL = process.env.ARCGIS_LAYER_URL;

console.log('🛠️ FRONTEND_URL =>', JSON.stringify(FRONTEND_URL));

// Enable CORS
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));

app.use(express.json());

// In-memory user store (for now)
const users = [];

app.post("/api/signup", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  const existingUser = users.find((u) => u.username === username);
  if (existingUser) {
    return res.status(409).json({ error: "Username taken" });
  }

  users.push({ username, password }); // For real apps, hash passwords and use a database
  res.json({ token: "fake-token-for-now" });
});

// Socket.IO server with CORS
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"]
  }
});

// Fetch ArcGIS token using client credentials
async function getAccessToken() {
  try {
    const response = await axios.post('https://www.arcgis.com/sharing/rest/oauth2/token', null, {
      params: {
        client_id: process.env.ARCGIS_CLIENT_ID,
        client_secret: process.env.ARCGIS_CLIENT_SECRET,
        grant_type: 'client_credentials',
        expiration: 60,
        f: 'json'
      }
    });

    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching ArcGIS token:', error.response?.data || error.message);
    return null;
  }
}

// Socket.IO Events
io.on("connection", (socket) => {
  console.log("✅ Socket connected");

  socket.on("new-pin", async (data) => {
    console.log("📍 Received pin:", data);
    io.emit("add-pin", data);

    const token = await getAccessToken();
    // send to ArcGIS Feature Layer via axios...
    if (!token) return console.error("❌ Failed to get ArcGIS token.");

    try {
      const response = await axios.post(ARCGIS_LAYER_URL, null, {
        params: {
          f: "json",
          adds: JSON.stringify([{
            geometry: {
              x: data.lng,
              y: data.lat,
              spatialReference: { wkid: 4326 }
            },
            attributes: {
              username: data.username,
              imageUrl: data.imageUrl,
              timestamp: new Date().toISOString()
            }
          }]),
          token: token
        }
      });

      console.log("✅ ArcGIS response:", response.data);
    } catch (error) {
      console.error("❌ Error sending to ArcGIS:", error.response?.data || error.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("⚡️ Socket disconnected");
  });
});

// Remove ArcGIS OAuth Route for v2
// Exchange OAuth code for token (called from frontend, sends a code and you exchange for a token)
// app.post('/api/auth/exchange-code', async (req, res) => {
//   const { code, redirect_uri } = req.body;

//   if (!code || !redirect_uri) {
//     return res.status(400).json({ error: 'Missing code or redirect_uri' });
//   }

//   try {
//     const params = new URLSearchParams({
//       client_id: process.env.ARCGIS_CLIENT_ID,
//       client_secret: process.env.ARCGIS_CLIENT_SECRET,
//       grant_type: 'authorization_code',
//       code: code,
//       redirect_uri: redirect_uri,
//       f: 'json',
//     });

//     const response = await axios.post('https://www.arcgis.com/sharing/rest/oauth2/token', params);
//     res.json(response.data);
//   } catch (error) {
//     console.error('Error exchanging code:', error.response?.data || error.message);
//     res.status(500).json({ error: 'Failed to exchange code for token' });
//   }
// });

// Simple test route
app.get('/', (req, res) => {
  res.send('🌱 GeoClover backend is live!');
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
