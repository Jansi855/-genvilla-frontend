import { getProperties } from "@/services/properties";

export const unavailable = "Not available";
export const textValue = (value) =>
  typeof value === "string" && value.trim() ? value.trim() : null;
export const positiveNumber = (value) => {
  if (typeof value !== "number" && typeof value !== "string") return null;
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : null;
};

function transactionKind(value) {
  const text = textValue(value)?.toLowerCase();
  if (["buy", "sale", "sell", "for sale", "resale", "new property"].includes(text)) return "sale";
  if (["rent", "rental", "for rent"].includes(text)) return "rent";
  return null;
}

export function comparisonProperty(property, raw = {}) {
  const builtup = positiveNumber(raw.builtup_area_sqft);
  const carpet = positiveNumber(raw.carpet_area_sqft);
  const area = builtup ?? carpet;
  const pricePaise = positiveNumber(raw.price_paise);
  const price = pricePaise === null ? null : pricePaise / 100;
  const bedroomValue = raw.bedrooms;
  const bedrooms =
    (typeof bedroomValue === "number" ||
      (typeof bedroomValue === "string" && bedroomValue.trim())) &&
    Number.isInteger(Number(bedroomValue)) &&
    Number(bedroomValue) >= 0
      ? Number(bedroomValue)
      : null;
  const bhk = textValue(raw.property_type)?.match(/^(\d+)\s*bhk$/i)?.[1];
  const amenities = Array.isArray(raw.amenities)
    ? raw.amenities
        .map((item) => textValue(item) || textValue(item?.name))
        .filter(Boolean)
    : textValue(raw.amenities);

  return {
    id: property.id,
    title: textValue(raw.project_name) || textValue(raw.title),
    location:
      textValue(raw.address) ||
      [textValue(raw.locality), textValue(property.city)]
        .filter(Boolean)
        .join(", ") ||
      null,
    city: textValue(property.city),
    type: textValue(property.type),
    image: textValue(raw.image_url),
    price,
    area,
    areaBasis: builtup ? "Built-up" : carpet ? "Carpet" : null,
    pricePerSqft: price && area ? positiveNumber(price / area) : null,
    listedPricePerSqft: positiveNumber(raw.price_per_sqft_paise) === null
      ? null : Number(raw.price_per_sqft_paise) / 100,
    bedrooms,
    bhk: bhk ? `${bhk} BHK` : null,
    amenities: Array.isArray(amenities)
      ? [...new Set(amenities)].join(", ") || null
      : amenities,
    status: textValue(property.status),
    // Only report identifiers supplied by the feed; never infer registration.
    rera: textValue(raw.rera_registration_number) || textValue(raw.rera_number),
    transaction: textValue(raw.transaction_type),
    transactionKind: transactionKind(raw.transaction_type),
  };
}

// Preserve original optional fields while reusing the existing service's
// endpoint, pagination, deduplication, normalization and cancellation.
export async function getComparisonProperties({
  signal,
  fetchImpl = fetch,
  apiUrl,
} = {}) {
  const rawPages = new Map();
  const result = await getProperties({
    signal,
    ...(apiUrl === undefined ? {} : { apiUrl }),
    fetchImpl: async (...args) => {
      const response = await fetchImpl(...args);
      if (response.ok) {
        const payload = await response.clone().json();
        const page = Number(new URL(String(args[0])).searchParams.get("page"));
        rawPages.set(page, payload.items || []);
      }
      return response;
    },
  });
  const rawById = new Map(
    [...rawPages]
      .sort(([a], [b]) => a - b)
      .flatMap(([, items]) => items.map((item) => [item.id, item])),
  );
  return result.properties
    .filter(
      (property) =>
        property.id !== undefined && property.id !== null && property.id !== "",
    )
    .map((property) => comparisonProperty(property, rawById.get(property.id)));
}

export function comparisonHighlights(properties) {
  const result = { price: [], area: [], pricePerSqft: [] };
  if (properties.length < 2) return result;
  const sameTransaction = properties.every((p) => p.transactionKind === "sale");
  const sameAreaBasis =
    properties[0].areaBasis &&
    properties.every((p) => p.areaBasis === properties[0].areaBasis);

  function highlight(field, direction, allowed) {
    if (!allowed || !properties.every((p) => positiveNumber(p[field]) !== null))
      return;
    const values = properties.map((p) => p[field]);
    // No difference to highlight when every value is identical.
    if (Math.min(...values) === Math.max(...values)) return;
    const best =
      direction === "min" ? Math.min(...values) : Math.max(...values);
    result[field] = properties
      .filter((p) => p[field] === best)
      .map((p) => p.id);
  }
  // Rent periods are not exposed by the existing mapper, so price highlights
  // are limited to sale listings to avoid comparing incompatible amounts.
  highlight("price", "min", sameTransaction);
  highlight("area", "max", sameAreaBasis);
  highlight("pricePerSqft", "min", sameTransaction && sameAreaBasis);
  return result;
}
