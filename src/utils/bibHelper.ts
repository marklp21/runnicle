/**
 * Normalizes distance string to a standard form.
 * e.g., "5K" -> "5K", "5km" -> "5K", "Half Marathon" -> "21K"
 */
export function normalizeDistance(distance: string): string {
  const norm = (distance || '').toUpperCase().trim();
  if (norm.includes('3K') || norm.includes('3KM') || norm === '3') return '3K';
  if (norm.includes('5K') || norm.includes('5KM') || norm === '5') return '5K';
  if (norm.includes('10K') || norm.includes('10KM') || norm === '10') return '10K';
  if (norm.includes('16K') || norm.includes('16KM') || norm === '16') return '16K';
  if (norm.includes('21K') || norm.includes('HALF') || norm === '21') return '21K';
  if (norm.includes('42K') || norm.includes('MARATHON') || norm === '42') return '42K';
  
  // Extract number from string if it exists
  const match = norm.match(/(\d+)/);
  if (match) {
    return `${match[1]}K`;
  }
  return norm || '3K';
}

/**
 * Gets the starting bib number for a normalized distance.
 */
export function getStartingBib(distance: string): number {
  const norm = normalizeDistance(distance);
  if (norm === '3K') return 3001;
  if (norm === '5K') return 5001;
  if (norm === '10K') return 10001;
  if (norm === '16K') return 16001;
  if (norm === '21K') return 21001;
  if (norm === '42K') return 42001;
  
  const match = norm.match(/(\d+)/);
  if (match) {
    return parseInt(match[1]) * 1000 + 1;
  }
  return 1001;
}

/**
 * Calculates the next sequential bib number for an event and category.
 */
export function getNextBibNumber(
  distance: string,
  eventTitle: string,
  registrations: any[]
): string {
  const normDistance = normalizeDistance(distance);
  const startingBib = getStartingBib(distance);

  // Filter registrations for the same event and normalized category
  const matchingRegs = (registrations || []).filter(r => {
    const isSameEvent = (r.eventTitle || '').toLowerCase() === (eventTitle || '').toLowerCase();
    const isSameCategory = normalizeDistance(r.distance) === normDistance;
    return isSameEvent && isSameCategory;
  });

  // Extract all valid bib numbers
  const assignedBibs = matchingRegs
    .map(r => parseInt(r.registeredBib))
    .filter(b => !isNaN(b) && b >= startingBib);

  if (assignedBibs.length === 0) {
    return startingBib.toString();
  }

  // Next bib is maximum assigned bib + 1
  const maxBib = Math.max(...assignedBibs);
  return (maxBib + 1).toString();
}
