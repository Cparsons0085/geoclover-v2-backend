# GeoClover-v2-Backend

> Backend for the GeoClover real-time pin-drop app  
> Built with Node.js, Express, Socket.io, and Axios

---

## 👩‍💻 About Me

👋 Hi, I’m **Cristy Parsons** ([@Cparsons0085](https://github.com/Cparsons0085))  
🎓 Currently pursuing a degree in CIT with a focus on Geospatial Technologies  
🌱 Learning full-stack development (React, Node.js, ect.) and DevOps practices  
🔭 Building GeoClover-v2: a real-time GIS-powered pin-drop app  
💬 Feel free to **message me** here on GitHub or via email at `cristylynn0920@gmail.com`

---

## 🚀 Features

- **User signup** (`POST /api/signup`)  
- **Real-time pin broadcasting** via Socket.io  
- **ArcGIS Feature Layer** integration for persisting pins  
- **CORS** configured for your Vite/Netlify frontend  

## 🛠️ Prerequisites

- Node.js ≥ 16  
- npm  
- A GitHub repo (this one)  
- A Render.com account (or another hosting provider)  

## ⚙️ Environment Variables

Create `.env.development` and `.env.production` (already in `.gitignore`):

```dotenv
# .env.development
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173
ARCGIS_LAYER_URL=https://your-arcgis-service/FeatureServer/0/applyEdits
ARCGIS_CLIENT_ID=yourClientId
ARCGIS_CLIENT_SECRET=yourClientSecret


## 👤 Author

Cristy Parsons
[GitHub](https://github.com/Cparsons0085) · [Email](mailto:cristylynn0920@gmail.com)

---

## 📅 Project Status

🔧 Version 2 backend is under development. Focused on simplified auth, improved real-time sync, and expanded support for creative geospatial games and uploads.

