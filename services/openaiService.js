// services/openaiService.js

// Ab hum OpenAI API use nahi kar rahe.
// Yahan hum AQI + user health + activity ke basis pe
// real-looking English advice generate kar rahe hain.

async function getAiExplanation({
  aqiData,
  healthCategory,
  age,
  activityPlan,
  riskLevel,
  suggestions,
  location,
}) {
  const city = location?.city || "your area";
  const aqi = aqiData?.aqi;
  const pm25 = aqiData?.pm25;
  const pm10 = aqiData?.pm10;

  // 1) AQI ke hisaab se overall line
  let qualityLine = "";
  if (aqi <= 50) {
    qualityLine = "The air quality is good today and there is very little health risk for most people.";
  } else if (aqi <= 100) {
    qualityLine = "The air quality is acceptable today, with only a small risk for sensitive people.";
  } else if (aqi <= 150) {
    qualityLine = "The air is moderately polluted. Most healthy people will be fine, but sensitive groups should be a bit careful.";
  } else if (aqi <= 200) {
    qualityLine = "The air is fairly polluted today. Some people may start to feel irritation after long exposure.";
  } else if (aqi <= 300) {
    qualityLine = "The air quality is very poor and can cause breathing discomfort, especially if you stay outside for long.";
  } else {
    qualityLine = "The air quality is extremely poor and can affect health even after short exposure.";
  }

  // 2) Health category ke hisaab se extra warning
  let healthLine = "";
  if (healthCategory === "healthy") {
    healthLine = "Since you are generally healthy, your risk is moderate but you should still avoid unnecessary exposure when levels are high.";
  } else if (healthCategory === "sensitive") {
    healthLine =
      "You are in a sensitive group (children, elders or smokers), so you should be more careful and avoid staying outside for long when the air is polluted.";
  } else if (healthCategory === "asthma") {
    healthLine =
      "Because you have asthma or breathing issues, your lungs can react faster to bad air, so it is important to limit outdoor time when the AQI is high.";
  }

  // 3) Activity ke hisaab se advice
  let activityLine = "";
  if (activityPlan === "jogging") {
    if (aqi <= 150) {
      activityLine =
        "Outdoor jogging is still okay, but try to choose a cleaner time of the day and avoid busy roads.";
    } else if (aqi <= 200) {
      activityLine =
        "Outdoor jogging is not ideal at this AQI. If possible, move your workout indoors or keep it short and light.";
    } else {
      activityLine =
        "Outdoor jogging is not recommended at this pollution level. It is safer to exercise indoors today.";
    }
  } else if (activityPlan === "commute") {
    if (aqi <= 150) {
      activityLine =
        "Your normal commute is fine, but try to keep vehicle windows closed in heavy traffic.";
    } else if (aqi <= 200) {
      activityLine =
        "For your commute, try to avoid heavy traffic areas and do not stay near exhaust or construction for too long.";
    } else {
      activityLine =
        "During your commute, try to spend as little time as possible on busy roads and avoid walking along heavy traffic if you can.";
    }
  } else if (activityPlan === "mostly_indoor") {
    activityLine =
      "Since you plan to stay mostly indoors, your risk is lower, but it still helps to keep indoor air clean and avoid outdoor exposure when levels are very high.";
  }

  // 4) Suggestions ko human English me summarize karein
  const maskLine =
    suggestions.maskType === "no mask needed"
      ? "You do not really need a mask today unless you are very sensitive."
      : `Using a ${suggestions.maskType} when you go outside will give you extra protection.`;

  const windowLine = `For windows, it is better to keep them ${suggestions.windows.toLowerCase()}.`;
  const purifierLine = `Air purifier: ${suggestions.purifier}.`;
  const timeLine = `Suggested time to go outside: ${suggestions.bestTimeToGoOut}.`;

  // 5) Final message combine
  const lines = [
    `Today in ${city}, the approximate AQI is ${aqi}.`,
    qualityLine,
    `PM2.5 is around ${pm25.toFixed(1)} and PM10 is around ${pm10.toFixed(1)}, which contributes to the current "${riskLevel}" risk level.`,
    healthLine,
    activityLine,
    maskLine,
    windowLine,
    purifierLine,
    timeLine,
  ].filter(Boolean);

  return lines.join(" ");
}

module.exports = { getAiExplanation };
