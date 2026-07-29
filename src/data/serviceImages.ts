// Central mapping of all services to professional, realistic, high-quality images.
// These are shared consistently between the home page cards and the individual service detail pages.

export const serviceImages: Record<string, string> = {
  'garage-door-repair': '/assets/images/garage-door-repair.png',
  'garage-door-spring-repair': '/assets/images/garage-door-spring-repair.png', // Technical steel spring/mechanic
  'garage-door-opener-repair': '/assets/images/garage-door-opener-repair.png', // Electronic motor circuit repair
  'garage-door-opener-installation': '/assets/images/garage-door-opener-installation.png', // Technical maintenance worker installing/tuning
  'garage-door-installation': '/assets/images/garage-door-installation.png', // Beautiful residential modern garage doors
  'emergency-garage-door-repair': '/assets/images/emergency-garage-door-repair.png', // Nighttime glowing garage
};

// Default high-quality fallback image (technician on site)
export const DEFAULT_SERVICE_IMAGE = '/assets/images/garage-door-repair.png';

export function getServiceImage(serviceId: string): string {
  return serviceImages[serviceId] || DEFAULT_SERVICE_IMAGE;
}
