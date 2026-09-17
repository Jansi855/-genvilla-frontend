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
