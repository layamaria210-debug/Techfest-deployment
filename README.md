# TechFest 2026 MERN Stack Experiment

## Aim
Build a full-stack event management app using React, Express, Node.js and MongoDB.

## Requirements
Install Node.js, npm and VS Code. For database persistence, create a MongoDB Atlas cluster and copy its connection string.

## Run the backend
1. Open this folder in VS Code.
2. In terminal run `cd server` then `npm install`.
3. Copy `.env.example` to `.env` and replace the example MongoDB URI with your own.
4. Run `npm start`.
5. Open `http://localhost:5000/api/health`; expected JSON: `{"status":"ok","service":"TechFest API"}`.

## Run the frontend
Open a second terminal at project root, run `cd client`, `npm install`, copy `.env.example` to `.env`, then run `npm run dev`. Open the Vite URL shown (usually http://localhost:5173).

## Expected result
A TechFest page with an event form and upcoming event cards. Events are stored in MongoDB and can be listed and deleted. This is expected output; confirm by running it locally.

## Deployment (optional)
Push the project to GitHub. Deploy `server` as a Render web service (build `npm install`, start `npm start`) and deploy `client` to Netlify (build `npm run build`, publish `dist`). Set `MONGO_URI`, `CLIENT_ORIGIN`, and `VITE_API_URL` in the hosting dashboards. Do not commit `.env` or expose database credentials.
