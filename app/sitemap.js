import { getIndexableLocations } from '@/data/locations';
import { getProperties } from '@/services/properties';
import { getPropertyLocationPath } from '@/utils/location';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://genvilla.in';

export default async function sitemap() {
  const now = new Date();
  const staticPaths = [
    '',
    '/properties',
    '/calculators',
    '/calculators/emi',
    '/calculators/affordability',
    '/calculators/true-cost',
    '/calculators/rental-roi',
    '/calculators/risk-analysis',
    '/calculators/buy-vs-rent',
    '/calculators/smart-property-analyzer',
    '/smart-recommendation',
  ];
  const locationEntries = getIndexableLocations().map((location) => ({
    url: `${SITE_URL}${getPropertyLocationPath(location)}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: location.locality ? 0.7 : 0.8,
  }));
  let propertyEntries = [];

  try {
    const data = await getProperties();
    propertyEntries = data.properties.map((property) => ({
      url: `${SITE_URL}/properties/${property.id}`,
      lastModified: property.postedAt ? new Date(property.postedAt) : now,
      changeFrequency: 'weekly',
      priority: 0.6,
    }));
  } catch {
    // Location and static URLs remain available if inventory is temporarily unavailable.
  }

  return [
    ...staticPaths.map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency: path === '' ? 'weekly' : 'monthly',
      priority: path === '' ? 1 : 0.7,
    })),
    ...locationEntries,
    ...propertyEntries,
  ];
}
