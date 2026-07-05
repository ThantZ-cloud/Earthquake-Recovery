import { point, lineString } from '@turf/helpers';
import { distance } from '@turf/distance';
import { nearestPointOnLine } from '@turf/nearest-point-on-line';
import { bbox } from '@turf/bbox';

// Risk thresholds (km) — wider zones since we use plate boundaries (not precise fault lines)
const HIGH_RISK_KM = 30;
const MEDIUM_RISK_KM = 80;

const RISK_COLORS = {
  high: '#d32f2f',
  medium: '#ed6c02',
  low: '#2e7d32',
};

const RISK_LABELS = {
  high: 'High Risk (0–30 km)',
  medium: 'Medium Risk (30–80 km)',
  low: 'Low Risk (>80 km)',
};

// Quick bounding box check — skip plates that are far away
function isNearby(damCoords, plateBbox, bufferDeg = 0.2) {
  return (
    damCoords[0] >= plateBbox[0] - bufferDeg &&
    damCoords[0] <= plateBbox[2] + bufferDeg &&
    damCoords[1] >= plateBbox[1] - bufferDeg &&
    damCoords[1] <= plateBbox[3] + bufferDeg
  );
}

// Pre-process plates: flatten into individual line features with bounding boxes
function preprocessPlates(platesGeojson) {
  const lines = [];
  for (const plate of platesGeojson.features) {
    const geom = plate.geometry;
    if (!geom) continue;

    const coords =
      geom.type === 'MultiLineString' ? geom.coordinates :
      geom.type === 'LineString' ? [geom.coordinates] : [];

    for (const c of coords) {
      const line = lineString(c);
      lines.push({ line, bbox: bbox(line) });
    }
  }
  return lines;
}

function getDamRisk(damCoords, preprocessedPlates) {
  const damPt = point(damCoords);
  let minDist = Infinity;

  for (const { line, bbox: plateBbox } of preprocessedPlates) {
    // Skip if bounding boxes don't overlap
    if (!isNearby(damCoords, plateBbox)) continue;

    const snapped = nearestPointOnLine(line, damPt);
    const dist = distance(damPt, snapped, { units: 'kilometers' });
    if (dist < minDist) minDist = dist;
    if (minDist <= HIGH_RISK_KM) break; // Can't get worse
  }

  let risk, color, label;
  if (minDist <= HIGH_RISK_KM) {
    risk = 'high';
    color = RISK_COLORS.high;
    label = RISK_LABELS.high;
  } else if (minDist <= MEDIUM_RISK_KM) {
    risk = 'medium';
    color = RISK_COLORS.medium;
    label = RISK_LABELS.medium;
  } else {
    risk = 'low';
    color = RISK_COLORS.low;
    label = RISK_LABELS.low;
  }

  return { risk, color, label, distanceKm: minDist.toFixed(1) };
}

/**
 * Enrich all dams with risk data.
 * Plates are pre-processed once for speed.
 */
export function classifyDams(damsGeojson, platesGeojson) {
  const preprocessedPlates = preprocessPlates(platesGeojson);

  return damsGeojson.features.map((dam) => {
    const riskData = getDamRisk(dam.geometry.coordinates, preprocessedPlates);
    return {
      ...dam.properties,
      coordinates: dam.geometry.coordinates,
      ...riskData,
    };
  });
}

export { RISK_COLORS, RISK_LABELS, HIGH_RISK_KM, MEDIUM_RISK_KM };
