#  AQI Health Risk Predictor

A full-stack web application that analyzes **real-time air quality data (AQI)** and generates a personalized **health risk score**, along with **human-readable safety advice** based on the user's location, health category, age, and planned activity.

This project combines:
- Real-time environmental data  
- Custom risk calculation  
- Smart rule-based “AI-style” natural language explanations  
- A clean and simple React UI  

---

##  Features

-  **Real-time AQI data** (via OpenWeather Air Pollution API)  
-  **City-based lookup** using geocoding  
-  **Risk Score (0–100)** based on AQI, health, age & activity  
-  **Risk Level:** low / medium / high / very_high  
-  **Suggestions:** mask type, window settings, purifier usage  
-  **AI-style explanation:** readable advice for the specific city and situation  
-  Separate frontend (React) + backend (Node/Express/MongoDB)

---

##  Tech Stack

### **Frontend**
- React (CRA)
- Fetch API
- Custom CSS (dark UI)

### **Backend**
- Node.js + Express
- MongoDB + Mongoose
- OpenWeather Geocoding + Air Pollution API
- Custom logic-based advice generator

---

## 📁 Project Structure
AQI-API/
aqi-frontend/ # React UI
bin/ # Express server bootstrap
models/ # Mongoose schemas
routes/ # API endpoints (/api/risk)
services/ # AQI fetcher, risk logic, explanation generation
views/ # Default EJS (from express-generator)
app.js # Express entry point
package.json
.gitignore



## 📦 Installation & Running the Project :-

### **1️⃣ Run the Backend**

```bash
cd AQI-API   # root folder
npm install
npm run dev
run at :- http://localhost:3000

### **1️⃣ Run the Frontend**
cd AQI-API/aqi-frontend
npm install
npm start

