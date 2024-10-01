// Calculate vulnerability based on sensitivity and adaptive capacity
export const calculateVulnerability = (sensitivity, adaptiveCapacity) => {
  return sensitivity * (1 - adaptiveCapacity);
};

// Calculate risk based on exposure and vulnerability
export const calculateRisk = (exposure, vulnerability) => {
  return exposure * vulnerability;
};

// Main function to calculate risk for a given sector and hazard
export const calculateSectorRisk = (data) => {
  const {
    climateThreatScore,
    exposureScore,
    sensitivityScore,
    adaptiveCapacity,
  } = data;

  const vulnerability = calculateVulnerability(
    sensitivityScore,
    adaptiveCapacity,
  );
  const risk = calculateRisk(exposureScore, vulnerability);

  return {
    ...data,
    vulnerabilityScore: vulnerability,
    riskScore: risk,
    riskLevel: getRiskLevel(risk),
  };
};

// Helper function to determine risk level based on risk score
const getRiskLevel = (riskScore) => {
  if (riskScore < 0.25) return "Low";
  if (riskScore < 0.5) return "Medium";
  if (riskScore < 0.75) return "High";
  return "Very High";
};
