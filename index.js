const express = require('express');
const http = require('http');
const cors = require('cors');
const axios = require('axios');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Example ArcGIS Feature Layer API endpoint and token placeholder
const ARCGIS_LAYER_URL = "https://services.arcgis.com/YOUR_ORG_ID/arcgis/rest/services/YOUR_LAYER_NAME/FeatureServer/0/applyEdits";
const ARCGIS_TOKEN = "YOUR_ARCGIS_TOKEN";

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("new-pin", async (data) => {
    console.log("Received pin:", data);

    // Broadcast the new pin to all clients
    io.emit("add-pin", data);

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
          token: ARCGIS_TOKEN
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