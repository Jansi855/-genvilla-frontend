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

  if (!value) return "Price on request";

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
  const value = String(city || "").trim();

  if (/^gurgaon$/i.test(value)) return "Gurugram";

  return value;
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

export function transformProperty(property) {
  const priceValue = property.price_paise ? property.price_paise / 100 : 0;
  const city = normalizeCity(property.city);
  const areaValue =
    property.builtup_area_sqft || property.carpet_area_sqft || 0;

  return {
    id: property.id,
    title: property.project_name || property.title || "Property",
    location:
      property.address ||
      `${property.locality || ""}${city ? `, ${city}` : ""}`,
    locality: property.locality || "",
    city,
    type: normalizePropertyType(property.property_type),
    purpose: normalizePurpose(property.transaction_type),
    bedrooms: Number(property.bedrooms) || null,
    bhk: property.bedrooms ? String(property.bedrooms) : "",
    areaValue,
    area: areaValue,
    priceValue,
    price: formatIndianPrice(priceValue),
    image: property.image_url || "/properties/property-placeholder.jpg",
    furnishing: property.furnishing || "",
    bathrooms: property.bathrooms || null,
    balconies: property.balconies || null,
    status: normalizeStatus(property.possession_status),
    risk: "Not assessed",
    roiValue: null,
    roi: "—",
    transactionType: property.transaction_type || "",
    postedAt: property.posted_at || null,
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

  return {
    properties: listings,
    total: listings.length,
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
  const city = normalizeCity(filters.city);
  const results = properties.filter((property) => {
    const matchesSearch =
      !needle ||
      [
        property.title,
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
      (!city || property.city === city) &&
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

export async function getPropertyById(id) {
  const response = await fetch(`${API_URL}/api/listings/${id}`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    if (response.status === 404) return null;

    throw new Error(`Failed to fetch property: ${response.status}`);
  }

  return transformProperty(await response.json());
}
