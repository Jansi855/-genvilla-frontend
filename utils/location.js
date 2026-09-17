const CITY_ALIASES = new Map([
  ["gurugram", "Gurugram"],
  ["gurgaon", "Gurugram"],
  ["ggn", "Gurugram"],
  ["ghaziabad", "Ghaziabad"],
  ["gzb", "Ghaziabad"],
  ["sonipat", "Sonipat"],
  ["sonepat", "Sonipat"],
  ["noida", "Noida"],
  ["new delhi", "New Delhi"],
  ["delhi", "New Delhi"],
]);

export const supportedCities = [
  "Gurugram",
  "Ghaziabad",
  "Sonipat",
  "Noida",
  "New Delhi",
];

export function normalizeLocationValue(value) {
  return String(value || "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeCity(value) {
  const normalized = normalizeLocationValue(value).toLowerCase();

  return CITY_ALIASES.get(normalized) || "";
}

export function normalizeLocality(value) {
  const normalized = normalizeLocationValue(value);

  if (!normalized) return "";

  return normalized.replace(/\b\w/g, (character) => character.toUpperCase());
}

export function getLocationSlug(value) {
  return normalizeLocationValue(value)
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/(^-|-$)/g, "");
}

export function locationValuesMatch(left, right) {
  return (
    normalizeLocationValue(left).toLowerCase() ===
    normalizeLocationValue(right).toLowerCase()
  );
}

export function matchesPropertyLocation(property, filters = {}) {
  const city = normalizeCity(filters.city);
  const locality = normalizeLocality(filters.locality);

  if (city && normalizeCity(property.city) !== city) return false;
  if (
    locality &&
    !locationValuesMatch(normalizeLocality(property.locality), locality)
  ) {
    return false;
  }

  return true;
}

export function parseLocationFromSearchParams(params) {
  const city = normalizeCity(params?.get?.("city"));
  const locality = city ? normalizeLocality(params?.get?.("locality")) : "";

  return { city, locality };
}

export function getLocationLabel({ city, locality } = {}) {
  const canonicalCity = normalizeCity(city);
  const canonicalLocality = normalizeLocality(locality);

  return [canonicalLocality, canonicalCity].filter(Boolean).join(", ");
}

export function setLocationSearchParams(params, location = {}) {
  const city = normalizeCity(location.city);
  const locality = city ? normalizeLocality(location.locality) : "";

  params.delete("city");
  params.delete("locality");

  if (city) params.set("city", getLocationSlug(city));
  if (locality) params.set("locality", getLocationSlug(locality));

  return params;
}

export function buildPropertySearchUrl(location = {}, filters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined) {
      params.set(key, String(value));
    }
  });

  const query = params.toString();

  const path = getPropertyLocationPath(location);

  return `${path}${query ? `?${query}` : ""}`;
}

export function getPropertyLocationPath({ city, locality } = {}) {
  const canonicalCity = normalizeCity(city);
  const canonicalLocality = canonicalCity ? normalizeLocality(locality) : "";

  if (!canonicalCity) return "/properties";

  const citySlug = getLocationSlug(canonicalCity).toLowerCase();
  const localitySlug = canonicalLocality
    ? `/${getLocationSlug(canonicalLocality).toLowerCase()}`
    : "";

  return `/properties/${citySlug}${localitySlug}`;
}
