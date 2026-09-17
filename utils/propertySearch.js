import { normalizeCity, normalizeLocality } from '@/utils/location';

export const propertySearchDefaults = {
  purpose: 'Buy',
  query: '',
  city: '',
  locality: '',
  type: '',
  bhk: '',
  budget: '',
  sort: 'recommended',
};

export function normalizePropertySearchParams(params, pathLocation = {}) {
  const filters = Object.fromEntries(
    Object.keys(propertySearchDefaults).map((key) => [
      key,
      params?.get?.(key) || propertySearchDefaults[key],
    ]),
  );
  const mode = params?.get?.('mode');
  const bedrooms = params?.get?.('bedrooms');
  const propertyType = params?.get?.('propertyType');

  filters.city = normalizeCity(pathLocation.city || filters.city);
  filters.locality = filters.city
    ? normalizeLocality(pathLocation.locality || filters.locality)
    : '';

  if (filters.city && filters.query && !filters.locality) {
    filters.locality = normalizeLocality(filters.query);
    filters.query = '';
  }
  if (mode === 'Buy' || mode === 'Rent') filters.purpose = mode;
  if (bedrooms && /^\d+$/.test(bedrooms)) filters.bhk = `${bedrooms} BHK`;
  if (propertyType) filters.type = normalizePropertyTypeParam(propertyType);
  if (['Any type', 'Any Property Type'].includes(filters.type)) filters.type = '';
  if (['Any budget', 'Any Budget'].includes(filters.budget)) filters.budget = '';
  if (filters.bhk === 'Any BHK') filters.bhk = '';
  if (!['recommended', 'price-low', 'price-high'].includes(filters.sort)) {
    filters.sort = 'recommended';
  }

  return filters;
}

export function hasIndexableFilterParams(params) {
  return [...(params?.keys?.() || [])].some(
    (key) => !['city', 'locality'].includes(key),
  );
}

function normalizePropertyTypeParam(value) {
  const normalized = String(value).replace(/[-_]+/g, ' ').trim().toLowerCase();
  const types = {
    apartment: 'Apartment',
    apartments: 'Apartment',
    'builder floor': 'Builder Floor',
    villa: 'Villa',
    villas: 'Villa',
    plot: 'Plot',
    plots: 'Plot',
  };

  return types[normalized] || value;
}
