// services/riskLogic.js

// 1) Convert AQI + health + activity → 0–100 risk score
function calculateRiskScore(aqi, healthCategory, activityPlan) {
  let score = 0;

  // Base score from AQI
  if (aqi <= 50) score += 10;
  else if (aqi <= 100) score += 30;
  else if (aqi <= 200) score += 50;
  else if (aqi <= 300) score += 75;
  else score += 90;

  // Health sensitivity
  if (healthCategory === 'healthy') score += 0;
  if (healthCategory === 'sensitive') score += 10;   // kids, elders, smoker
  if (healthCategory === 'asthma') score += 20;

  // Activity effect
  if (activityPlan === 'jogging') score += 15;
  if (activityPlan === 'commute') score += 5;
  if (activityPlan === 'mostly_indoor') score += 0;

  if (score > 100) score = 100;

  return score;
}

// 2) Risk score → risk level label
function mapRiskLevel(score) {
  if (score <= 25) return 'low';
  if (score <= 50) return 'medium';
  if (score <= 75) return 'high';
  return 'very_high';
}

// 3) AQI + activity → mask/windows/purifier/best time suggestions
// NOTE: ab yahan AQI direct use ho raha hai, sirf riskLevel par nahi.
function buildSuggestions(riskLevel, activityPlan, aqi) {
  let maskType = 'none';
  let windows = 'open';
  let purifier = 'not needed';
  let bestTimeToGoOut = 'Anytime';

  // WINDOWS LOGIC (realistic)
  if (aqi <= 100) {
    windows = 'open';
  } else if (aqi <= 150) {
    windows = 'open but avoid peak traffic hours';
  } else if (aqi <= 200) {
    windows = 'slightly closed during peak hours';
  } else if (aqi <= 300) {
    windows = 'mostly closed';
  } else {
    windows = 'keep windows closed';
  }

  // MASK LOGIC
  if (aqi <= 150) {
    maskType = 'no mask needed';
  } else if (aqi <= 200) {
    maskType = 'light / surgical mask';
  } else if (aqi <= 300) {
    maskType = 'KN95 mask';
  } else {
    maskType = 'N95 mask';
  }

  // PURIFIER LOGIC
  if (aqi <= 150) {
    purifier = 'not needed';
  } else if (aqi <= 200) {
    purifier = 'optional';
  } else if (aqi <= 300) {
    purifier = 'recommended';
  } else {
    purifier = 'strongly recommended';
  }

  // BEST TIME TO GO OUT
  if (aqi <= 150) {
    bestTimeToGoOut = 'Anytime';
  } else if (aqi <= 200) {
    bestTimeToGoOut = 'Afternoon is better than early morning';
  } else if (aqi <= 300) {
    bestTimeToGoOut = 'Avoid morning; prefer evening if possible';
  } else {
    bestTimeToGoOut = 'Avoid going out unless it is urgent';
  }

  // Jogging special case: thoda strict
  if (activityPlan === 'jogging' && aqi > 150) {
    bestTimeToGoOut = 'Outdoor jogging is not recommended at this AQI';
  }

  return { maskType, windows, purifier, bestTimeToGoOut };
}

module.exports = {
  calculateRiskScore,
  mapRiskLevel,
  buildSuggestions,
};
