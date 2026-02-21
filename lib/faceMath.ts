/**
 * Face Math Utility
 * Calculates facial harmony score based on golden ratio (1.618)
 */

export interface FaceLandmarks {
  x: number;
  y: number;
  z: number;
}

export interface FaceMeasurements {
  faceWidth: number;
  faceHeight: number;
  eyeDistance: number;
  noseAlignment: number;
}

export interface MoodAnalysis {
  dominant: string;
  confidence: number;
  scores: {
    happy: number;
    sad: number;
    surprised: number;
    angry: number;
    neutral: number;
  };
}

export interface JawlineAnalysis {
  sharpness: number;
  jawAngle: number;
  definition: number;
  chinProminence: number;
}

export interface FacialFeatures {
  faceShape: string;
  noseBridge: number;
  noseLength: number;
  cheekboneProminence: number;
  lipFullness: number;
  eyeSize: number;
  foreheadHeight: number;
}

export interface HarmonyScore {
  overall: number;
  faceRatio: number;
  eyeRatio: number;
  symmetry: number;
  measurements: FaceMeasurements;
  mood: MoodAnalysis;
  jawline: JawlineAnalysis;
  features: FacialFeatures;
}

const GOLDEN_RATIO = 1.618;

/**
 * Calculate Euclidean distance between two landmarks
 */
function getDistance(p1: FaceLandmarks, p2: FaceLandmarks): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  const dz = p1.z - p2.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Calculate how close a ratio is to the golden ratio (0-100)
 */
function scoreRatio(ratio: number): number {
  const difference = Math.abs(ratio - GOLDEN_RATIO);
  const maxDifference = 1.0; // Allow deviation up to 1.0
  const score = Math.max(0, 100 - (difference / maxDifference) * 100);
  return Math.min(100, score);
}

/**
 * Calculate facial measurements from landmarks
 */
function getMeasurements(landmarks: FaceLandmarks[]): FaceMeasurements {
  // Face width: left temple (234) to right temple (454)
  const faceWidth = getDistance(landmarks[234], landmarks[454]);
  
  // Face height: top of forehead (10) to chin (152)
  const faceHeight = getDistance(landmarks[10], landmarks[152]);
  
  // Eye distance: left eye inner corner (33) to right eye inner corner (263)
  const eyeDistance = getDistance(landmarks[33], landmarks[263]);
  
  // Nose center alignment: nose tip (1) should be centered between temples
  const faceCenterX = (landmarks[234].x + landmarks[454].x) / 2;
  const noseAlignment = Math.abs(landmarks[1].x - faceCenterX);
  
  return {
    faceWidth,
    faceHeight,
    eyeDistance,
    noseAlignment,
  };
}

/**
 * Analyze mood/emotion from facial expression
 */
function analyzeMood(landmarks: FaceLandmarks[]): MoodAnalysis {
  // Mouth corners: left (61), right (291), center top (13), bottom (14)
  const leftMouthCorner = landmarks[61];
  const rightMouthCorner = landmarks[291];
  const mouthTop = landmarks[13];
  const mouthBottom = landmarks[14];
  
  // Eyebrows: left inner (70), left outer (63), right inner (300), right outer (293)
  const leftBrowInner = landmarks[70];
  const leftBrowOuter = landmarks[63];
  const rightBrowInner = landmarks[300];
  const rightBrowOuter = landmarks[293];
  
  // Eyes: left center (159), right center (386)
  const leftEye = landmarks[159];
  const rightEye = landmarks[386];
  
  // Calculate mouth curvature (smile/frown)
  const mouthHeight = mouthBottom.y - mouthTop.y;
  const leftMouthLift = leftMouthCorner.y - mouthBottom.y;
  const rightMouthLift = rightMouthCorner.y - mouthBottom.y;
  const mouthCurvature = (leftMouthLift + rightMouthLift) / 2;
  
  // Calculate eyebrow position relative to eyes
  const leftBrowHeight = leftEye.y - ((leftBrowInner.y + leftBrowOuter.y) / 2);
  const rightBrowHeight = rightEye.y - ((rightBrowInner.y + rightBrowOuter.y) / 2);
  const avgBrowHeight = (leftBrowHeight + rightBrowHeight) / 2;
  
  // Calculate mouth openness
  const mouthOpenness = Math.abs(mouthHeight) * 100;
  
  // Score each emotion (0-100)
  let happyScore = 0;
  let sadScore = 0;
  let surprisedScore = 0;
  let angryScore = 0;
  let neutralScore = 50;
  
  // Happy: mouth corners up, neutral brows
  if (mouthCurvature < 0) {
    happyScore = Math.min(100, Math.abs(mouthCurvature) * 500);
    neutralScore -= happyScore * 0.7;
  }
  
  // Sad: mouth corners down, brows slightly down
  if (mouthCurvature > 0) {
    sadScore = Math.min(100, mouthCurvature * 500);
    neutralScore -= sadScore * 0.7;
  }
  
  // Surprised: mouth open, eyebrows raised
  if (mouthOpenness > 2 && avgBrowHeight > 0.02) {
    surprisedScore = Math.min(100, mouthOpenness * 2 + avgBrowHeight * 500);
    neutralScore -= surprisedScore * 0.8;
  }
  
  // Angry: eyebrows down and together
  if (avgBrowHeight < -0.01) {
    angryScore = Math.min(100, Math.abs(avgBrowHeight) * 500);
    neutralScore -= angryScore * 0.7;
  }
  
  // Normalize scores
  neutralScore = Math.max(0, neutralScore);
  
  const scores = { happy: happyScore, sad: sadScore, surprised: surprisedScore, angry: angryScore, neutral: neutralScore };
  
  // Find dominant emotion
  const dominant = Object.entries(scores).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  const confidence = Math.max(...Object.values(scores));
  
  return {
    dominant: dominant.charAt(0).toUpperCase() + dominant.slice(1),
    confidence: Math.round(confidence),
    scores: {
      happy: Math.round(happyScore),
      sad: Math.round(sadScore),
      surprised: Math.round(surprisedScore),
      angry: Math.round(angryScore),
      neutral: Math.round(neutralScore),
    },
  };
}

/**
 * Analyze jawline characteristics
 */
function analyzeJawline(landmarks: FaceLandmarks[]): JawlineAnalysis {
  // Jaw points: chin (152), left jaw (234), right jaw (454)
  // Lower jaw points: (172, 136, 150, 149, 176, 148, 152, 377, 400, 378, 379, 365, 397, 288, 361)
  const chin = landmarks[152];
  const leftJaw = landmarks[172];
  const rightJaw = landmarks[397];
  const leftCheek = landmarks[234];
  const rightCheek = landmarks[454];
  
  // Calculate jaw angle (closer to 90 degrees is more defined)
  const leftAngle = Math.abs(Math.atan2(leftJaw.y - chin.y, leftJaw.x - chin.x) * 180 / Math.PI);
  const rightAngle = Math.abs(Math.atan2(rightJaw.y - chin.y, rightJaw.x - chin.x) * 180 / Math.PI);
  const jawAngle = (leftAngle + rightAngle) / 2;
  
  // Calculate jawline definition (how distinct the jaw edge is)
  const jawWidth = getDistance(leftJaw, rightJaw);
  const cheekWidth = getDistance(leftCheek, rightCheek);
  const jawToFaceRatio = jawWidth / cheekWidth;
  const definition = Math.min(100, jawToFaceRatio * 100);
  
  // Jaw sharpness (Z-depth variation along jawline)
  const jawSharpness = Math.min(100, Math.abs(chin.z - ((leftJaw.z + rightJaw.z) / 2)) * 1000);
  
  // Chin prominence (how far forward the chin extends)
  const chinProminence = Math.min(100, Math.abs(chin.z) * 1000);
  
  return {
    sharpness: Math.round(jawSharpness),
    jawAngle: Math.round(jawAngle),
    definition: Math.round(definition),
    chinProminence: Math.round(chinProminence),
  };
}

/**
 * Analyze detailed facial features
 */
function analyzeFacialFeatures(landmarks: FaceLandmarks[]): FacialFeatures {
  // Face dimensions
  const faceWidth = getDistance(landmarks[234], landmarks[454]);
  const faceHeight = getDistance(landmarks[10], landmarks[152]);
  const jawWidth = getDistance(landmarks[172], landmarks[397]);
  
  // Determine face shape
  const faceRatio = faceHeight / faceWidth;
  const jawRatio = jawWidth / faceWidth;
  let faceShape = 'Oval';
  
  if (faceRatio > 1.4 && jawRatio < 0.8) faceShape = 'Heart';
  else if (faceRatio > 1.5) faceShape = 'Oblong';
  else if (faceRatio < 1.3 && jawRatio > 0.85) faceShape = 'Round';
  else if (Math.abs(faceRatio - 1.0) < 0.2 && jawRatio > 0.85) faceShape = 'Square';
  else if (jawRatio < 0.75) faceShape = 'Diamond';
  
  // Nose bridge width and length
  const noseBridge = landmarks[6];
  const noseTip = landmarks[1];
  const leftNostril = landmarks[98];
  const rightNostril = landmarks[327];
  
  const noseWidth = getDistance(leftNostril, rightNostril);
  const noseBridgeScore = Math.min(100, (noseWidth / faceWidth) * 500);
  const noseLength = getDistance(noseBridge, noseTip);
  const noseLengthScore = Math.min(100, (noseLength / faceHeight) * 300);
  
  // Cheekbone prominence
  const leftCheekbone = landmarks[234];
  const rightCheekbone = landmarks[454];
  const cheekboneWidth = getDistance(leftCheekbone, rightCheekbone);
  const cheekboneProminence = Math.min(100, (cheekboneWidth / faceWidth) * 100);
  
  // Lip fullness
  const upperLipTop = landmarks[13];
  const upperLipBottom = landmarks[12];
  const lowerLipTop = landmarks[14];
  const lowerLipBottom = landmarks[152];
  
  const upperLipThickness = getDistance(upperLipTop, upperLipBottom);
  const lowerLipThickness = getDistance(lowerLipTop, lowerLipBottom);
  const totalLipThickness = upperLipThickness + lowerLipThickness;
  const lipFullness = Math.min(100, (totalLipThickness / faceHeight) * 1000);
  
  // Eye size
  const leftEyeInner = landmarks[33];
  const leftEyeOuter = landmarks[133];
  const rightEyeInner = landmarks[263];
  const rightEyeOuter = landmarks[362];
  
  const leftEyeWidth = getDistance(leftEyeInner, leftEyeOuter);
  const rightEyeWidth = getDistance(rightEyeInner, rightEyeOuter);
  const avgEyeWidth = (leftEyeWidth + rightEyeWidth) / 2;
  const eyeSize = Math.min(100, (avgEyeWidth / faceWidth) * 400);
  
  // Forehead height
  const foreheadTop = landmarks[10];
  const eyebrowCenter = landmarks[8];
  const foreheadHeight = getDistance(foreheadTop, eyebrowCenter);
  const foreheadHeightScore = Math.min(100, (foreheadHeight / faceHeight) * 300);
  
  return {
    faceShape,
    noseBridge: Math.round(noseBridgeScore),
    noseLength: Math.round(noseLengthScore),
    cheekboneProminence: Math.round(cheekboneProminence),
    lipFullness: Math.round(lipFullness),
    eyeSize: Math.round(eyeSize),
    foreheadHeight: Math.round(foreheadHeightScore),
  };
}


/**
 * Calculate facial harmony score from MediaPipe landmarks
 * @param landmarks Array of 468 facial landmarks from MediaPipe FaceMesh
 * @returns Harmony score object with overall score (0-100) and component scores
 */
export function calculateFacialHarmony(landmarks: FaceLandmarks[]): HarmonyScore {
  if (!landmarks || landmarks.length < 468) {
    return {
      overall: 0,
      faceRatio: 0,
      eyeRatio: 0,
      symmetry: 0,
      measurements: {
        faceWidth: 0,
        faceHeight: 0,
        eyeDistance: 0,
        noseAlignment: 0,
      },
      mood: {
        dominant: 'Neutral',
        confidence: 0,
        scores: { happy: 0, sad: 0, surprised: 0, angry: 0, neutral: 0 },
      },
      jawline: {
        sharpness: 0,
        jawAngle: 0,
        definition: 0,
        chinProminence: 0,
      },
      features: {
        faceShape: 'Unknown',
        noseBridge: 0,
        noseLength: 0,
        cheekboneProminence: 0,
        lipFullness: 0,
        eyeSize: 0,
        foreheadHeight: 0,
      },
    };
  }

  const measurements = getMeasurements(landmarks);
  
  // Calculate face height to width ratio (ideal is golden ratio)
  const faceRatio = measurements.faceHeight / measurements.faceWidth;
  const faceRatioScore = scoreRatio(faceRatio);
  
  // Calculate face width to eye distance ratio (ideal is golden ratio)
  const eyeRatio = measurements.faceWidth / measurements.eyeDistance;
  const eyeRatioScore = scoreRatio(eyeRatio);
  
  // Symmetry score: nose should be centered (lower alignment = better)
  const maxAlignment = 0.1; // 10% of face width
  const alignmentScore = Math.max(0, 100 - (measurements.noseAlignment / maxAlignment) * 100);
  const symmetryScore = Math.min(100, alignmentScore);
  
  // Analyze mood, jawline, and features
  const mood = analyzeMood(landmarks);
  const jawline = analyzeJawline(landmarks);
  const features = analyzeFacialFeatures(landmarks);
  
  // Overall score: weighted average
  const overall = (
    faceRatioScore * 0.35 +
    eyeRatioScore * 0.35 +
    symmetryScore * 0.30
  );
  
  return {
    overall: Math.round(overall),
    faceRatio: Math.round(faceRatioScore),
    eyeRatio: Math.round(eyeRatioScore),
    symmetry: Math.round(symmetryScore),
    measurements,
    mood,
    jawline,
    features,
  };
}

/**
 * Get color class based on score
 */
export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-500';
  if (score >= 60) return 'text-yellow-500';
  return 'text-red-500';
}

/**
 * Get background color class based on score
 */
export function getScoreBgColor(score: number): string {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-yellow-500';
  return 'bg-red-500';
}

/**
 * Get score label
 */
export function getScoreLabel(score: number): string {
  if (score >= 90) return 'Exceptional';
  if (score >= 80) return 'Excellent';
  if (score >= 70) return 'Very Good';
  if (score >= 60) return 'Good';
  if (score >= 50) return 'Fair';
  return 'Needs Improvement';
}
