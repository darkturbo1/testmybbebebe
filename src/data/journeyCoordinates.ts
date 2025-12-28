// Fantasy destination coordinates (fictional but mapped to real-world locations for visualization)
export const destinationCoordinates: Record<string, { lat: number; lng: number; name: string }> = {
  hogwarts: { lat: 56.4907, lng: -5.6076, name: "Hogwarts" }, // Scottish Highlands
  mordor: { lat: -39.1234, lng: 175.3456, name: "Mordor" }, // New Zealand (where LOTR was filmed)
  narnia: { lat: 54.6333, lng: -5.9167, name: "Narnia" }, // Northern Ireland forests
  rivendell: { lat: -41.2865, lng: 174.7762, name: "Rivendell" }, // Wellington, NZ area
  asgard: { lat: 63.4305, lng: 10.3951, name: "Asgard" }, // Norway (Norse mythology)
  wakanda: { lat: -1.2921, lng: 36.8219, name: "Wakanda" }, // East Africa region
};

// Starting point (London as default departure)
export const startingPoint = { lat: 51.5074, lng: -0.1278, name: "London" };

// Calculate intermediate points along a journey
export function getJourneyPath(
  start: { lat: number; lng: number },
  end: { lat: number; lng: number },
  progressPercent: number
): { coordinates: [number, number][]; currentPosition: [number, number] } {
  const numPoints = 50;
  const coordinates: [number, number][] = [];
  
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const lat = start.lat + (end.lat - start.lat) * t;
    const lng = start.lng + (end.lng - start.lng) * t;
    coordinates.push([lng, lat]);
  }
  
  // Calculate current position based on progress
  const progressIndex = Math.floor((progressPercent / 100) * numPoints);
  const currentPosition = coordinates[Math.min(progressIndex, numPoints)];
  
  return { coordinates, currentPosition };
}
