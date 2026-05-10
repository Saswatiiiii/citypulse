# 🚦 CityPulse 🌆

Smart City Monitoring and Incident Reporting System

---

# 📌 Overview

CityPulse is a real-time smart city monitoring web application that allows users to report urban issues directly on a live map. The system helps visualize incidents, monitor city problems, and analyze urban activity through an interactive dashboard.

The platform supports:
- live incident reporting
- realtime analytics
- dynamic map markers
- voting system
- incident tracking
- realtime Firebase syncing
- weather monitoring

using Firebase and Leaflet maps.

---

# 🌍 Problem Statement

City infrastructure information is often outdated and slow to update.

CityPulse solves this problem by enabling citizens to crowdsource and visualize:
- safety hazards
- accessibility problems
- traffic issues
- lighting failures
- road damage

in real time using an interactive map platform.

---

# 🚀 Features

## 🗺️ Live Interactive Map
- Users can report issues directly on the map
- Dynamic map markers for every report
- Realtime updates without refreshing
- OpenStreetMap integration
- Kalyani / Haringhata focused deployment

---

## 📊 Realtime Dashboard
- Live analytics cards
- Weekly report activity graph
- Incident distribution pie chart
- Recent activity section
- Dynamic statistics

---

## 🚨 Incident Reporting

Users can report:

- Safety issues
- Traffic problems
- Road damage
- Lighting issues
- Accessibility concerns

---

## 👍 Voting System
- Users can upvote incidents
- Priority level updates dynamically

---

## 📈 Priority Detection

Priority is automatically generated:

- High → Votes > 8
- Medium → Votes > 5
- Low → Votes ≤ 5

---

## 📂 Reports Management
- Search reports
- Realtime incident cards
- Dynamic status display
- Actual location coordinates shown
- Timestamp tracking

---

# 🌦️ Weather Monitoring

CityPulse also includes a dedicated weather monitoring section to help users stay updated with environmental conditions that may affect city infrastructure and public safety.

### Features
- Live weather updates
- Temperature monitoring
- Weather condition display
- Smart city environment integration
- Responsive weather dashboard UI

### Purpose
The weather section helps correlate:
- rainfall with flood reports
- visibility with traffic conditions
- weather conditions with road safety

This makes CityPulse a more complete smart-city monitoring platform.

---

## ☁️ Firebase Integration
- Firestore realtime database
- Firebase Hosting
- Live syncing of reports
- Realtime listeners using `onSnapshot()`

---

# 🧠 System Workflow

1. User clicks on the map
2. Location coordinates are captured
3. User submits incident details
4. Data is stored in Firebase Firestore
5. Realtime listeners update:
   - map markers
   - dashboard analytics
   - reports page
6. Users can upvote incidents
7. Priority updates dynamically

---

# 📡 Realtime Functionality

CityPulse uses Firebase Firestore realtime listeners (`onSnapshot`) to instantly synchronize:
- incident reports
- dashboard statistics
- map markers
- vote updates

across all users without page refresh.

---

# 🛠️ Tech Stack

## Frontend
- React.js
- React Router
- CSS3
- React Icons

## Backend / Database
- Firebase Firestore
- Firebase Hosting

## Maps & Visualization
- React Leaflet
- OpenStreetMap
- Recharts

---

# 📁 Project Structure

```bash
src/
│
├── components/
│   └── Sidebar.js
│
├── pages/
│   ├── Dashboard.js
│   ├── MapPage.js
│   ├── Reports.js
│   └── Weather.js
│
├── styles/
│   ├── Dashboard.css
│   ├── MapPage.css
│   ├── Reports.css
│   ├── Sidebar.css
│   └── Weather.css
│
├── firebase.js
├── App.js
└── index.js
```

---

# ⚙️ Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/Saswatiiiii/citypulse.git
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Start Development Server

```bash
npm start
```

---

# 🔥 Firebase Setup

1. Create Firebase Project  
2. Enable Firestore Database  
3. Enable Firebase Hosting  
4. Copy Firebase Config  
5. Create `firebase.js`

### Example

```javascript
import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
```

---

# 📌 Firestore Collection Structure

## Collection Name

```bash
reports
```

---

## Document Example

```json
{
  "type": "road",
  "desc": "Large pothole causing accidents",
  "lat": 22.5726,
  "lng": 88.3639,
  "votes": 7,
  "createdAt": "timestamp"
}
```

---

# 🌐 Live Demo

https://citypulse-2ef8d.web.app

---

# 📷 Screenshots

## 📊 Dashboard

![Dashboard](assets/screenshots/dashboard.png)

---

## 🗺️ Map Page

![Map](assets/screenshots/map.png)

---

## 📂 Reports Page

![Reports](assets/screenshots/reports.png)

---

## 🌦️ Weather Page

![Weather](assets/screenshots/weather.png)

---

# 🌟 Future Improvements

- Reverse geocoding for location names
- Admin dashboard
- Image upload support
- Notification system
- AI-based incident prediction
- Route optimization
- Emergency alert system

---

# 👨‍💻 Developed By

- Saswati Chatterjee
- Debolina Mitra

---

# 📄 License

This project was built for educational, portfolio, and hackathon purposes.