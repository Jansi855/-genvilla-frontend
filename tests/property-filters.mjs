import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile(
  new URL("../services/properties.js", import.meta.url),
  "utf8",
);
const locationSource = await readFile(
  new URL("../utils/location.js", import.meta.url),
  "utf8",
);
const locationModule = `data:text/javascript;base64,${Buffer.from(locationSource).toString("base64")}`;
const {
  filterProperties,
  getProperties,
  normalizeCity,
  normalizePropertyType,
  normalizePurpose,
  transformProperty,
  getPropertyById,
} = await import(
  `data:text/javascript;base64,${Buffer.from(source.replace('from "@/utils/location"', `from "${locationModule}"`)).toString("base64")}`
);

const rawListings = [
  listing(1, {
    city: "Gurgaon",
    property_type: "3 BHK",
    bedrooms: 3,
    price_paise: 800000000,
    transaction_type: "Sale",
    builtup_area_sqft: 1300,
    locality: "Sector 57",
    possession_status: "READY",
  }),
  listing(2, {
    city: "Ghaziabad",
    property_type: "Builder Floor Apartment",
    bedrooms: 2,
    price_paise: 1500000000,
    transaction_type: "Resale",
    builtup_area_sqft: 1100,
    locality: "Indirapuram",
  }),
  listing(3, {
    city: "Sonipat",
    property_type: "Penthouse",
    bedrooms: 5,
    price_paise: 2500000000,
    transaction_type: "New Property",
    builtup_area_sqft: 3000,
    locality: "Kundli",
  }),
  listing(4, {
    city: "Noida",
    property_type: "Villa",
    bedrooms: 4,
    price_paise: 4500000000,
    transaction_type: "Rent",
    builtup_area_sqft: 2400,
    locality: "Sector 150",
  }),
  listing(5, {
    city: "New Delhi",
    property_type: "Plot",
    bedrooms: 1,
    price_paise: 6500000000,
    transaction_type: "Lease",
    builtup_area_sqft: 900,
    locality: "Dwarka",
  }),
];

const requestedPages = [];
const pages = {
  1: { items: rawListings.slice(0, 2), pagination: { page: 1, pages: 3 } },
  2: { items: rawListings.slice(2, 4), pagination: { page: 2, pages: 3 } },
  3: {
    items: [rawListings[4], rawListings[0]],
    pagination: { page: 3, pages: 3 },
  },
};
const fetchImpl = async (url) => {
  const parsed = new URL(url);
  const page = Number(parsed.searchParams.get("page"));

  requestedPages.push(page);
  assert.equal(parsed.searchParams.get("limit"), "48");

  return {
    ok: true,
    json: async () => pages[page],
  };
};
const data = await getProperties({ apiUrl: "https://example.test", fetchImpl });
const properties = data.properties;

assert.deepEqual(requestedPages.sort(), [1, 2, 3]);
assert.equal(properties.length, 5, "duplicate listing IDs should be removed");

assert.equal(normalizeCity("Gurgaon"), "Gurugram");
assert.equal(normalizeCity(" new-delhi "), "New Delhi");
assert.equal(normalizeCity("Ghaziabad"), "Ghaziabad");
assert.equal(normalizePropertyType("Builder Floor Apartment"), "Builder Floor");
assert.equal(normalizePropertyType("3 BHK"), "Apartment");
assert.equal(normalizePropertyType("Penthouse"), "Apartment");
assert.equal(normalizePurpose("Rental"), "Rent");
assert.equal(normalizePurpose("Resale"), "Buy");

for (const city of ["Gurugram", "Ghaziabad", "Sonipat", "Noida", "New Delhi"]) {
  assert.equal(filterProperties(properties, { city }).length, 1, city);
}

assert.deepEqual(
  ids(filterProperties(properties, { type: "Apartment" })),
  [1, 3],
);
assert.deepEqual(
  ids(filterProperties(properties, { type: "Builder Floor" })),
  [2],
);
assert.deepEqual(ids(filterProperties(properties, { type: "Villa" })), [4]);
assert.deepEqual(ids(filterProperties(properties, { type: "Plot" })), [5]);

for (const [bhk, id] of [
  ["1 BHK", 5],
  ["2 BHK", 2],
  ["3 BHK", 1],
  ["4 BHK", 4],
  ["4+ BHK", 3],
]) {
  assert.deepEqual(ids(filterProperties(properties, { bhk })), [id], bhk);
}

for (const [budget, id] of [
  ["under-1", 1],
  ["1-2", 2],
  ["2-4", 3],
  ["4-6", 4],
  ["6-plus", 5],
]) {
  assert.deepEqual(ids(filterProperties(properties, { budget })), [id], budget);
}

assert.deepEqual(
  ids(filterProperties(properties, { purpose: "Buy" })),
  [1, 2, 3],
);
assert.deepEqual(
  ids(filterProperties(properties, { purpose: "Rent" })),
  [4, 5],
);
assert.deepEqual(ids(filterProperties(properties, { query: "kundli" })), [3]);
assert.deepEqual(
  ids(filterProperties(properties, { city: "Gurugram", bhk: "3 BHK" })),
  [1],
);
assert.deepEqual(
  ids(filterProperties(properties, {
    city: "Ghaziabad",
    locality: "Indirapuram",
    purpose: "Buy",
    type: "Builder Floor",
    bhk: "2 BHK",
    budget: "1-2",
  })),
  [2],
  "location and every active property filter should combine with AND semantics",
);
assert.deepEqual(
  ids(filterProperties(properties, { city: "Noida", locality: "sector-150" })),
  [4],
);
assert.deepEqual(
  ids(filterProperties(properties, { city: "Gurugram", locality: "Sector 150" })),
  [],
  "locality must never match without its selected city",
);

assert.deepEqual(
  ids(filterProperties(properties, { sort: "price-low" })),
  [1, 2, 3, 4, 5],
);
assert.deepEqual(
  ids(filterProperties(properties, { sort: "price-high" })),
  [5, 4, 3, 2, 1],
);

console.log(
  "Property pagination, normalization, filter, and sort tests passed.",
);

const imageUrls = Array.from({ length: 16 }, (_, i) => `https://images.example.test/${i}.jpg`);
const complete = transformProperty({
  id: 90, title: "2 BHK Apartment", project_name: "Project name", city: "Gurgaon", locality: "Sector 89",
  builtup_area_sqft: "1196", carpet_area_sqft: 850, price_paise: 1600000000,
  price_per_sqft_paise: 1337700, bedrooms: 2, bathrooms: 2, balconies: 1,
  floor_number: 5, total_floors: 14, facing: "East", parking: "Covered", ownership_type: "Freehold",
  property_age_years: 4, furnishing: "Semi furnished", possession_status: "READY",
  posted_at: "2026-09-16T18:31:06.100Z", description: "Description. ".repeat(200),
  seller_name: "Listed seller", seller_type: "Individual", contact_access: "public", public_contact: "+91 99999 00000",
  latitude: 28.45, longitude: 77.03, images: [...imageUrls, imageUrls[0], "", null, "javascript:alert(1)", {}],
  image_url: "https://images.example.test/primary.jpg", raw_data: "PRIVATE_RAW", source_fetch_id: 999,
});
assert.equal(complete.title, "2 BHK Apartment");
assert.equal(complete.projectName, "Project name");
assert.equal(complete.location, "Sector 89, Gurugram");
assert.equal(complete.price, "₹1.6 Cr");
assert.equal(complete.pricePerSqft, "₹13,377 / sq.ft.");
assert.equal(complete.builtupArea, 1196);
assert.equal(complete.carpetArea, 850);
assert.equal(complete.floor, "5 (out of 14)");
assert.equal(complete.images.length, 16);
assert.equal(complete.image, imageUrls[0]);
assert.equal(complete.contact.phone, "+919999900000");
assert.deepEqual(complete.coordinates, { latitude: 28.45, longitude: 77.03 });
assert.equal(complete.listedOn, "16 Sept 2026");
assert.ok(complete.description.length > 650);
assert.equal("raw_data" in complete, false);
assert.equal("source_fetch_id" in complete, false);
assert.deepEqual(ids(filterProperties([complete], { query: "Project name" })), [90]);

for (const access of ["private", "restricted", "login_required", "unknown", "", null, "not_public"]) {
  const property = transformProperty({ id: 1, public_contact: "9999900000", contact_access: access });
  assert.equal(property.contact, null, `Contact must stay private for ${access}`);
  assert.ok(!JSON.stringify(property).includes("9999900000"));
}
assert.equal(transformProperty({ contact_access: "public", public_contact: "javascript:alert(1)" }).contact, null);
assert.equal(transformProperty({ contact_access: "public", public_contact: "person@example.test" }).contact.email, "person@example.test");
assert.deepEqual(transformProperty({ images: ["", "bad"], image_url: imageUrls[0] }).images, [imageUrls[0]]);
assert.deepEqual(transformProperty({ images: [imageUrls[0], imageUrls[0]] }).images, [imageUrls[0]]);
assert.deepEqual(transformProperty({ images: "not-an-array", image_url: "javascript:alert(1)" }).images, []);
assert.equal(transformProperty({ builtup_area_sqft: 1200 }).areaLabel, "Built-up area");
assert.equal(transformProperty({ carpet_area_sqft: 850 }).areaLabel, "Carpet area");
assert.equal(transformProperty({ title: "string", project_name: "Real project" }).title, "Real project");
assert.equal(transformProperty({ title: "Long title ".repeat(100) }).title.length, 1099);
assert.equal(transformProperty({ latitude: 91, longitude: 77 }).coordinates, null);
assert.equal(transformProperty({ latitude: 28, longitude: 181 }).coordinates, null);

const empty = transformProperty({
  id: 5, bedrooms: 0, bathrooms: 0, balconies: 0, builtup_area_sqft: 0, carpet_area_sqft: 0,
  price_paise: "NaN", price_per_sqft_paise: -5, floor_number: 0, total_floors: 0,
  property_age_years: 0, latitude: 0, longitude: 0, furnishing: "string", posted_at: "invalid",
  description: null, seller_name: "N/A", image_count: 25, listing_url: "javascript:alert(1)",
});
assert.equal(empty.price, "Price on request");
assert.equal(empty.pricePerSqft, "");
for (const field of ["bedrooms", "bathrooms", "balconies", "builtupArea", "carpetArea", "propertyAge", "coordinates", "contact"]) assert.equal(empty[field], null, field);
for (const field of ["floor", "furnishing", "description", "sellerName", "listedOn", "listingUrl"]) assert.equal(empty[field], "", field);
assert.deepEqual(empty.images, []);
assert.deepEqual(empty.amenities, []);
assert.equal(transformProperty({ price_paise: Infinity }).price, "Price on request");
assert.equal(transformProperty({ bedrooms: true }).bedrooms, null);

assert.equal(await getPropertyById("../bad", { fetchImpl: () => { throw new Error("Invalid ID should not fetch"); } }), null);
assert.equal(await getPropertyById(1, { apiUrl: "https://example.test", fetchImpl: async () => ({ ok: false, status: 404 }) }), null);
await assert.rejects(getPropertyById(1, { apiUrl: "https://example.test", fetchImpl: async () => ({ ok: false, status: 500 }) }));
await assert.rejects(getPropertyById(1, { apiUrl: "https://example.test", fetchImpl: async () => { throw new Error("Network offline"); } }));
assert.equal(await getPropertyById(1, { apiUrl: "https://example.test", fetchImpl: async () => ({ ok: true, json: async () => null }) }), null);
assert.equal((await getPropertyById(1, { apiUrl: "https://example.test", fetchImpl: async () => ({ ok: true, json: async () => ({ id: 1, title: "Detail" }) }) })).title, "Detail");
console.log("Rich property data, image collections, contact privacy and detail error tests passed.");

function listing(id, overrides) {
  return {
    id,
    title: `Property ${id}`,
    project_name: null,
    city: "",
    locality: "",
    address: "",
    property_type: "",
    transaction_type: "",
    bedrooms: null,
    bathrooms: null,
    balconies: null,
    builtup_area_sqft: 0,
    carpet_area_sqft: 0,
    price_paise: 0,
    furnishing: null,
    possession_status: null,
    image_url: null,
    posted_at: null,
    ...overrides,
  };
}

function ids(listings) {
  return listings.map((property) => property.id);
}
