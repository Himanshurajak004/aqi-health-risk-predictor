const mongoose = require('mongoose');

const RiskCheckSchema = new mongoose.Schema({
  location: {
    city: String,
    lat: Number,
    lon: Number
  },

  healthProfile: {
    category: String,   // healthy / sensitive / asthma
    age: Number
  },

  activityPlan: String, // jogging / commute / indoor

  aqiData: {
    aqi: Number,
    pm25: Number,
    pm10: Number,
    source: String
  },

  riskScore: Number,
  riskLevel: String,

  suggestions: {
    maskType: String,
    windows: String,
    purifier: String,
    bestTimeToGoOut: String
  },

  aiExplanation: String,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('RiskCheck', RiskCheckSchema);
