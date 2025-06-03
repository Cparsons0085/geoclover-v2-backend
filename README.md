# GeoClover Backend

This is the backend service for the GeoClover application. It handles real-time data processing, APIs, and business logic for geospatial features.

## Features

- Real-time communication with clients via Socket.IO
- RESTful API endpoints for geospatial data updates
- Integration with ArcGIS Feature Layer API to store geospatial data
- CORS enabled for cross-origin requests
- Handles geospatial queries and data manipulation

## Technologies

- Node.js with Express.js
- Socket.IO for real-time WebSocket communication
- Axios for REST API requests
- ArcGIS Feature Layer API for geospatial data storage

## Getting Started

### Environment Variables

Create a `.env` file in the root directory with the following:
ARCGIS_CLIENT_ID=your-client-id
ARCGIS_CLIENT_SECRET=your-client-secret
ARCGIS_REDIRECT_URI=http://localhost:3000/callback

> You can obtain these by registering an application at [ArcGIS Developer](https://developers.arcgis.com/).

### Prerequisites

- Install [Node.js](https://nodejs.org/) (v16+ recommended)
- An ArcGIS Feature Layer URL and token or API key for data persistence

### Installation

```bash
git clone https://github.com/Cparsons0085/geoclover-backend.git
cd geoclover-backend
npm install

