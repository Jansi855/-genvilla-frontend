import {
  matchesPropertyLocation,
  normalizeCity as normalizeCanonicalCity,
  normalizeLocality,
} from "@/utils/location";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const LISTINGS_PAGE_SIZE = 48;

const budgetRanges = {
  "under-1": [0, 10000000],
  "1-2": [10000000, 20000000],
  "2-4": [20000000, 40000000],
  "4-6": [40000000, 60000000],
  "6-plus": [60000000, Infinity],
};

function formatIndianPrice(amount) {
  const value = Number(amount);

  if (!Number.isFinite(value) || value <= 0) return "Price on request";

  if (value >= 10000000) {
    const crore = value / 10000000;

    return `₹${Number(crore.toFixed(2))} Cr`;
  }

  if (value >= 100000) {
    const lakh = value / 100000;

    return `₹${Number(lakh.toFixed(2))} L`;
  }

  return `₹${value.toLocaleString("en-IN")}`;
}

export function normalizeCity(city) {
  return normalizeCanonicalCity(city) || String(city || "").trim();
}

export function normalizePropertyType(propertyType) {
  const value = String(propertyType || "").trim();
  const normalized = value.toLowerCase();

  if (normalized.includes("builder floor")) return "Builder Floor";
  if (normalized.includes("villa")) return "Villa";
  if (normalized.includes("plot")) return "Plot";
  if (
    normalized.includes("apartment") ||
    normalized.includes("flat") ||
    normalized.includes("penthouse") ||
    /^\d+\s*bhk$/i.test(value)
  ) {
    return "Apartment";
  }

  return value;
}

export function normalizePurpose(transactionType) {
  return /rent|rental|lease/i.test(String(transactionType || ""))
    ? "Rent"
    : "Buy";
}

function normalizeStatus(status) {
  if (/^ready$/i.test(String(status || ""))) return "Ready to Move";

  return String(status || "");
}

// Scraped defaults are not property facts. Keep this boundary shared by cards
// and details, and never forward raw payloads or restricted contact data.
function textValue(value) {
  if (typeof value !== "string") return "";
  const text = value.trim();
  return /^(string|null|undefined|nan|n\/?a|none|unknown|not available|0|-)$/i.test(text) ? "" : text;
}

function positiveNumber(value) {
  if (typeof value !== "number" && typeof value !== "string") return null;
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : null;
}

export function safePropertyUrl(value) {
  const text = textValue(value);
  try {
    const url = new URL(text);
    return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password ? url.href : "";
  } catch {
    return "";
  }
}

export function getPropertyImages(property) {
  const images = Array.isArray(property.images) ? property.images : [];
  const valid = [...new Set(images.map(safePropertyUrl).filter(Boolean))];
  const primary = safePropertyUrl(property.image_url);
  return valid.length ? valid : primary ? [primary] : [];
}

export function formatPropertyArea(value) {
  const area = positiveNumber(value);
  return area ? `${area.toLocaleString("en-IN")} sq.ft.` : "";
}

export function formatPropertyFloor(floor, total) {
  const number = positiveNumber(floor);
  const floors = positiveNumber(total);
  // Zero is an ambiguous scraper default, not evidence of a ground floor.
  return number ? `${number}${floors ? ` (out of ${floors})` : ""}` : "";
}

function publicContact(property) {
  if (textValue(property.contact_access).toLowerCase() !== "public") return null;
  const value = textValue(property.public_contact);
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return { value, email: value };
  }
  const phone = value.replace(/[\s().-]/g, "");
  return /^\+?\d{7,15}$/.test(phone) ? { value, phone } : null;
}

export function transformProperty(property = {}) {
  if (!property || typeof property !== "object" || Array.isArray(property)) property = {};
  const priceValue = (positiveNumber(property.price_paise) || 0) / 100;
  const pricePerSqft = (positiveNumber(property.price_per_sqft_paise) || 0) / 100;
  const city = normalizeCity(textValue(property.city));
  const locality = textValue(property.locality);
  const builtupArea = positiveNumber(property.builtup_area_sqft);
  const carpetArea = positiveNumber(property.carpet_area_sqft);
  const areaValue = builtupArea || carpetArea || 0;
  const images = getPropertyImages(property);
  const latitude = typeof property.latitude === "number" || typeof property.latitude === "string" ? Number(property.latitude) : NaN;
  const longitude = typeof property.longitude === "number" || typeof property.longitude === "string" ? Number(property.longitude) : NaN;
  const hasCoordinates = Number.isFinite(latitude) && Number.isFinite(longitude) &&
    latitude !== 0 && longitude !== 0 && Math.abs(latitude) <= 90 && Math.abs(longitude) <= 180;
  const postedAt = textValue(property.posted_at);
  const validDate = postedAt && Number.isFinite(Date.parse(postedAt));
  const amenities = Array.isArray(property.amenities)
    ? [...new Set(property.amenities.map((item) => textValue(typeof item === "string" ? item : item?.name)).filter(Boolean))]
    : [];

  return {
    id: property.id,

    title:
      textValue(property.title) ||
      textValue(property.project_name) ||
      "Property",

    title: property.project_name || property.title || "Property",
    location:
      property.address ||
      `${property.locality || ""}${city ? `, ${city}` : ""}`,
    locality: normalizeLocality(property.locality),
    city,
    district: property.district || "",
    state: property.state || "",
    jurisdiction: property.jurisdiction || property.tehsil || city,
    type: normalizePropertyType(property.property_type),
    title: textValue(property.title) || textValue(property.project_name) || "Property",
    projectName: textValue(property.project_name),

    location:
      [locality, city].filter(Boolean).join(", ") ||
      textValue(property.address),

    address: textValue(property.address),

    locality,
    city,
    type: normalizePropertyType(textValue(property.property_type)),
    purpose: normalizePurpose(property.transaction_type),
    bedrooms: positiveNumber(property.bedrooms),
    bhk: positiveNumber(property.bedrooms) ? String(Number(property.bedrooms)) : "",
    builtupArea,
    carpetArea,
    areaLabel: builtupArea ? "Built-up area" : carpetArea ? "Carpet area" : "Area",
    areaValue,
    area: areaValue,
    priceValue,
    price: formatIndianPrice(priceValue),
    pricePerSqft: pricePerSqft ? `₹${Math.round(pricePerSqft).toLocaleString("en-IN")} / sq.ft.` : "",
    images,
    image: images[0] || "",
    furnishing: textValue(property.furnishing),
    bathrooms: positiveNumber(property.bathrooms),
    balconies: positiveNumber(property.balconies),
    status: normalizeStatus(textValue(property.possession_status)),
    risk: "Not assessed",
    roiValue: null,
    roi: "—",
    transactionType: textValue(property.transaction_type),
    postedAt: validDate ? postedAt : null,
    listedOn: validDate ? new Date(postedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }) : "",
    floor: formatPropertyFloor(property.floor_number, property.total_floors),
    facing: textValue(property.facing),
    parking: textValue(property.parking),
    ownership: textValue(property.ownership_type),
    propertyAge: positiveNumber(property.property_age_years),
    description: textValue(property.description),
    sellerName: textValue(property.seller_name),
    sellerType: textValue(property.seller_type),
    contact: publicContact(property),
    listingId: textValue(property.listing_key) || textValue(property.external_id) || String(property.id ?? ""),
    listingUrl: safePropertyUrl(property.listing_url),
    publisher: textValue(property.publisher),
    coordinates: hasCoordinates ? { latitude, longitude } : null,
    amenities,
  };
}

async function fetchListingsPage({ apiUrl, fetchImpl, page, signal }) {
  const params = new URLSearchParams({
    sort: "newest",
    page: String(page),
    limit: String(LISTINGS_PAGE_SIZE),
  });
  const response = await fetchImpl(`${apiUrl}/api/listings?${params}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch properties: ${response.status}`);
  }

  return response.json();
}

export async function getProperties({
  apiUrl = API_URL,
  fetchImpl = fetch,
  signal,
  filters,
} = {}) {
  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  const firstPage = await fetchListingsPage({
    apiUrl,
    fetchImpl,
    page: 1,
    signal,
  });
  const pages = Math.max(1, Number(firstPage.pagination?.pages) || 1);
  const remainingPages = await Promise.all(
    Array.from({ length: pages - 1 }, (_, index) =>
      fetchListingsPage({
        apiUrl,
        fetchImpl,
        page: index + 2,
        signal,
      }),
    ),
  );
  const rawListings = [firstPage, ...remainingPages].flatMap(
    (page) => page.items || [],
  );
  const listings = [
    ...new Map(rawListings.map((item) => [item.id, item])).values(),
  ].map(transformProperty);

  const properties = filters ? filterProperties(listings, filters) : listings;

  return {
    properties,
    total: properties.length,
    demo: false,
  };
}

function matchesBhk(property, bhk) {
  if (!bhk) return true;
  if (bhk === "4+ BHK") return property.bedrooms > 4;

  return property.bedrooms === Number.parseInt(bhk, 10);
}

export function filterProperties(properties, filters = {}) {
  const needle = String(filters.query || "")
    .trim()
    .toLowerCase();
  const results = properties.filter((property) => {
    const matchesSearch =
      !needle ||
      [
        property.title,
        property.projectName,
        property.address,
        property.location,
        property.locality,
        property.city,
      ].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(needle),
      );
    const range = budgetRanges[filters.budget];
    const matchesBudget =
      !range ||
      (property.priceValue >= range[0] && property.priceValue < range[1]);

    return (
      (!filters.purpose || property.purpose === filters.purpose) &&
      matchesPropertyLocation(property, filters) &&
      (!filters.type || property.type === filters.type) &&
      matchesBhk(property, filters.bhk) &&
      (!filters.status || property.status === filters.status) &&
      (!filters.minArea || property.areaValue >= Number(filters.minArea)) &&
      matchesSearch &&
      matchesBudget
    );
  });
  const sorters = {
    "price-low": (a, b) => a.priceValue - b.priceValue,
    "price-high": (a, b) => b.priceValue - a.priceValue,
  };

  return sorters[filters.sort]
    ? [...results].sort(sorters[filters.sort])
    : results;
}

export async function getPropertyById(id, { apiUrl = API_URL, fetchImpl = fetch, signal } = {}) {
  if (!/^[a-zA-Z0-9_-]+$/.test(String(id || ""))) return null;
  if (!apiUrl) throw new Error("Property service is unavailable");
  const response = await fetchImpl(`${apiUrl}/api/listings/${encodeURIComponent(id)}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    signal,
  });

  if (!response.ok) {
    if (response.status === 404) return null;

    throw new Error(`Failed to fetch property: ${response.status}`);
  }

  const property = await response.json();
  if (!property || typeof property !== "object" || Array.isArray(property) || property.id == null) return null;
  return transformProperty(property);
}
