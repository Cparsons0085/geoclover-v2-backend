require('dotenv').config();

const express = require('express');
const http = require('http');
const cors = require('cors');
const axios = require('axios');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "*"
//   }
// });
const io = new Server(server, {
  cors: {
    origin: allowedOrigin,
    methods: ["GET", "POST"]
  }
});

// app.use(cors());
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({
  origin: allowedOrigin,
  credentials: true, // only if you need to support cookies
}));

app.use(express.json());

const PORT = process.env.PORT || 3000;

// ArcGIS Feature Layer API endpoint and token placeholder
const ARCGIS_LAYER_URL = process.env.ARCGIS_LAYER_URL;
// const ARCGIS_TOKEN = process.env.ARCGIS_TOKEN;

// Function to get a fresh token using client credentials
// async function getAccessToken() {
//   try {
//     // const response = await axios.post('https://www.arcgis.com/sharing/rest/oauth2/token', null, {
//     const response = await axios.post(`${ARCGIS_LAYER_URL}/applyEdits`, null, {  
//       params: {
//         client_id: process.env.ARCGIS_CLIENT_ID,
//         client_secret: process.env.ARCGIS_CLIENT_SECRET,
//         grant_type: 'client_credentials',
//         expiration: 60, // 60 minutes
//         f: 'json'
//       }
//     });

//     return response.data.access_token;
//   } catch (error) {
//     console.error('Error fetching ArcGIS token:', error.response?.data || error);
//     return null;
//   }
// }

// Update getAccessToken function
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
    console.error('Error fetching ArcGIS token:', error.response?.data || error);
    return null;
  }
}


io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("new-pin", async (data) => {
    console.log("Received pin:", data);

    // Broadcast the new pin to all clients
    io.emit("add-pin", data);

    // Fetch a fresh ArcGIS token
    const token = await getAccessToken();
    if (!token) {
      console.error("Failed to get ArcGIS token.");
    }
    // Send to ArcGIS layer via REST API
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

      console.log("ArcGIS response:", response.data);
    } catch (error) {
      console.error("Error sending to ArcGIS:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.get('/', (req, res) => {
  res.send('GeoClover backend is running. This server uses Socket.IO and REST APIs.');
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});