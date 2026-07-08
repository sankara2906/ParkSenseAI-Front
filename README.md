# 🏎️ ParkSense AI — Smart Parking Digital Twin Client

ParkSense AI is an award-winning, Awwwards-quality futuristic smart parking digital twin dashboard built using React, Three.js, and Tailwind CSS. It communicates directly with the ParkSense telemetry core server to deliver real-time parking logistics.

## 🚀 Key Features
* **Interactive 3D Digital Twin Platform**: Interact with a real-time smart parking lot featuring a Sports Coupe, EV SUV, and Cybertruck with headlight control sweeps and pointlight EV charging animations.
* **Premium Glassmorphic HUD telemetry**: 6 floating telemetry cards displaying dynamic count-up statistics.
* **Secure Auth Console**: Fully functional sign-in and sign-up modals backed by security checks.
* **Responsive Command Center Dashboard**: Real-time CCTV streams, AI occupancy predictors, vehicle trackers, settings logs, and emergency monitors.

## 📦 Setup & Local Development
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite local development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Production Environment Variables
When deploying the frontend to hosting services like Vercel or Netlify, configure the API target variable:
* `VITE_API_URL`: Set this to your deployed FastAPI backend URL (e.g. `https://parksense-api.onrender.com`).
