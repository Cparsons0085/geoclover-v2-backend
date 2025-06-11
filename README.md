# GeoClover-v2 Backend

This is the backend for the GeoClover-v2 web application — a real-time geospatial platform that allows users to submit clover sightings with custom usernames (no ArcGIS OAuth required). The backend handles data persistence, WebSocket communication, and interaction with ArcGIS Feature Services.

---

## 🔧 Key Responsibilities

* Manage and verify user-generated username + short password entries
* Accept clover submissions (photo + GPS coordinates) from frontend
* Store and update clover data to an ArcGIS Online Feature Layer
* Enable real-time data syncing between clients using Socket.IO
* Provide RESTful API endpoints for frontend interactions

---

## 🛠️ Tech Stack

* **Node.js + Express.js** – server and routing
* **Socket.IO** – real-time WebSocket communication
* **ArcGIS REST API** – data persistence in hosted Feature Layers
* **Axios** – external HTTP requests
* **dotenv** – environment configuration

---

## 📁 Folder Structure

* `/routes` – Express routes for POST/GET submissions
* `/services` – Helper logic for working with ArcGIS Feature Services
* `/sockets` – Socket.IO configuration for live map syncing
* `/utils` – Username/password validation and local ID handling

---

## 🌐 Environment Variables

Create a `.env` file in the root directory with the following:

```
ARCGIS_CLIENT_ID=your-client-id
ARCGIS_CLIENT_SECRET=your-client-secret
ARCGIS_REDIRECT_URI=http://localhost:3000/callback
FEATURE_LAYER_URL=https://services.arcgis.com/.../FeatureServer/0
```

Obtain your credentials from [ArcGIS Developer](https://developers.arcgis.com/).

---

## 🚀 Getting Started

```bash
git clone https://github.com/Cparsons0085/geoclover-v2-backend.git
cd geoclover-v2-backend
npm install
npm run dev
```

Server will run at: `http://localhost:3000`

Make sure the frontend (on port 5173) is configured to send data to this backend.

---

## 🧪 API Endpoints

* `POST /submit` – Accepts clover sightings (username, image, location)
* `GET /clovers` – Returns list of submitted clovers
* `POST /verify-user` – Verifies or registers short username/password

---

## 🔄 WebSocket Events

* `new-clover` – Broadcasts new sighting to all connected clients
* `connect-user` – Initializes map view for new session

---

## 👤 Author

Cristy Parsons
[GitHub](https://github.com/Cparsons0085) · [Email](mailto:cristylynn0920@gmail.com)

---

## 📅 Project Status

🔧 Version 2 backend is under development. Focused on simplified auth, improved real-time sync, and expanded support for creative geospatial games and uploads.

