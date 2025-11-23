// routes/risk.js
var express = require('express');
var router = express.Router();
const RiskCheck = require('../models/RiskCheck');

const { calculateRiskScore, mapRiskLevel, buildSuggestions } = require('../services/riskLogic');
const { getAqiData } = require('../services/aqiService');
const { getAiExplanation } = require('../services/openaiService'); // ya simple explanation wali file

// GET /api/risk/test
router.get('/test', (req, res) => {
  res.json({ message: 'Risk route working' });
});

// POST /api/risk/check
router.post('/check', async (req, res) => {
  try {
    const { location, healthCategory, age, activityPlan } = req.body;

    // 1) Real AQI data from OpenWeather
    const aqiData = await getAqiData(location);

    // 2) Risk scoring
    const riskScore = calculateRiskScore(aqiData.aqi, healthCategory, activityPlan);
    const riskLevel = mapRiskLevel(riskScore);

    // 3) Suggestions NOW depend on AQI as well
    const suggestions = buildSuggestions(riskLevel, activityPlan, aqiData.aqi);

    // 4) Explanation (hamara custom ya OpenAI fallback)
    const aiExplanation = await getAiExplanation({
      aqiData,
      healthCategory,
      age,
      activityPlan,
      riskLevel,
      suggestions,
      location,
    });

    // 5) Save & respond
    const newCheck = await RiskCheck.create({
      location,
      healthProfile: { category: healthCategory, age },
      activityPlan,
      aqiData,
      riskScore,
      riskLevel,
      suggestions,
      aiExplanation,
    });

    res.json(newCheck);
  } catch (error) {
    console.error('Risk check error:', error);
    res.status(500).json({ error: error.message || 'Something went wrong' });
  }
});

module.exports = router;
