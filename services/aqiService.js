// services/aqiService.js
const axios = require('axios');

async function getLatLon(city) {
  const apiKey = process.env.AQI_API_KEY;

  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
    city
  )}&limit=1&appid=${apiKey}`;

  const { data } = await axios.get(url);

  if (!data || data.length === 0) {
    throw new Error(`City not found: ${city}`);
  }

  return {
    lat: data[0].lat,
    lon: data[0].lon,
  };
}

async function getAqiData(location) {
  const apiKey = process.env.AQI_API_KEY;
  const city = location.city;

  if (!city) {
    throw new Error("City name is required");
  }

  // 🔥 Step 1: Convert city → lat & lon
  const { lat, lon } = await getLatLon(city);

  // 🔥 Step 2: Fetch AQI using lat & lon
  const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  const { data } = await axios.get(url);

  if (!data.list || !data.list[0]) {
    throw new Error('No AQI data received from API');
  }

  const item = data.list[0];

  const pm25 = item.components.pm2_5;
  const pm10 = item.components.pm10;
  const aqiIndex = item.main.aqi; // 1..5 scale

  const aqiMap = {
    1: 50,
    2: 100,
    3: 150,
    4: 200,
    5: 300,
  };

  const aqiApprox = aqiMap[aqiIndex] || 0;

  return {
    aqi: aqiApprox,
    pm25,
    pm10,
    source: "openweathermap",
    rawIndex: aqiIndex,
    lat,
    lon,
  };
}

module.exports = { getAqiData };
