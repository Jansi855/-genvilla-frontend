import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

// Isolated test fixtures only; no fixture listings are loaded by the tool.
const asModule = (source) =>
  `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`;
const serviceSource = await readFile(
  new URL("../../../../services/properties.js", import.meta.url),
  "utf8",
);
const source = (
  await readFile(new URL("./comparison.js", import.meta.url), "utf8")
).replace('"@/services/properties"', JSON.stringify(asModule(serviceSource)));
const { comparisonProperty, comparisonHighlights, getComparisonProperties } =
  await import(asModule(source));
const { transformProperty } = await import(asModule(serviceSource));
const adapt = (raw) => comparisonProperty(transformProperty(raw), raw);

test("missing fields do not inherit service placeholders or default buying status", () => {
  const property = adapt({ id: "missing" });
  for (const key of [
    "title",
    "location",
    "image",
    "price",
    "area",
    "bedrooms",
    "bhk",
    "amenities",
    "rera",
    "transaction",
    "transactionKind",
    "status",
    "type",
    "pricePerSqft",
    "listedPricePerSqft",
  ]) {
    assert.equal(property[key], null, key);
  }
});

test("preserves real optional fields and calculates rupees per square foot", () => {
  const property = adapt({
    id: "fields",
    price_paise: 100000000,
    builtup_area_sqft: 1000,
    carpet_area_sqft: 800,
    bedrooms: 2,
    city: "Gurgaon",
    locality: "Sector",
    image_url: "/real.jpg",
    amenities: ["Lift", "Lift", { name: "Parking" }, null],
    rera_registration_number: "SUPPLIED-IDENTIFIER",
    possession_status: "Ready",
    transaction_type: "Sale",
  });
  assert.equal(property.price, 1000000);
  assert.equal(property.area, 1000);
  assert.equal(property.areaBasis, "Built-up");
  assert.equal(property.pricePerSqft, 1000);
  assert.equal(property.amenities, "Lift, Parking");
  assert.equal(property.rera, "SUPPLIED-IDENTIFIER");
  assert.equal(property.location, "Sector, Gurugram");
  assert.equal(property.status, "Ready to Move");
  assert.equal(adapt({ id: 1, property_type: "3 BHK" }).bhk, "3 BHK");
  assert.equal(adapt({ id: 1, bedrooms: 0 }).bedrooms, 0);
  assert.equal(adapt({ id: 1, price_per_sqft_paise: 125050 }).listedPricePerSqft, 1250.5);
  for (const transaction_type of ["Resale", "New Property"]) {
    assert.equal(adapt({ id: 1, transaction_type }).transactionKind, "sale");
  }
});

test("invalid numbers and missing areas cannot produce metrics", () => {
  for (const bad of [null, "", "invalid", -1, Infinity, false, 0]) {
    const property = adapt({ id: 1, price_paise: bad, builtup_area_sqft: bad });
    assert.equal(property.price, null);
    assert.equal(property.area, null);
    assert.equal(property.pricePerSqft, null);
  }
  assert.equal(adapt({ id: 1, price_paise: 10000 }).pricePerSqft, null);
});

const property = (id, price, area, other = {}) => ({
  id,
  price,
  area,
  pricePerSqft: price / area,
  transactionKind: "sale",
  areaBasis: "Built-up",
  ...other,
});
test("highlights factual differences, including ties, only across complete comparable data", () => {
  const a = property("a", 100, 10);
  const b = property("b", 200, 20);
  const c = property("c", 100, 20);
  assert.deepEqual(comparisonHighlights([a, b, c]), {
    price: ["a", "c"],
    area: ["b", "c"],
    pricePerSqft: ["c"],
  });
  assert.deepEqual(comparisonHighlights([a]), {
    price: [],
    area: [],
    pricePerSqft: [],
  });
  assert.deepEqual(comparisonHighlights([a, { ...a, id: "same" }]), {
    price: [],
    area: [],
    pricePerSqft: [],
  });
  assert.deepEqual(
    comparisonHighlights([a, { ...b, price: null, pricePerSqft: null }]).price,
    [],
  );
  assert.deepEqual(
    comparisonHighlights([a, { ...b, areaBasis: "Carpet" }]).area,
    [],
  );
  assert.deepEqual(
    comparisonHighlights([a, { ...b, areaBasis: "Carpet" }]).pricePerSqft,
    [],
  );
  for (const transactionKind of ["rent", null]) {
    assert.deepEqual(
      comparisonHighlights([a, { ...c, transactionKind }]).price,
      [],
    );
    assert.deepEqual(
      comparisonHighlights([a, { ...c, transactionKind }]).pricePerSqft,
      [],
    );
  }
});

test("reuses service pagination and cancellation without duplicate requests or losing raw fields", async () => {
  const calls = [];
  const controller = new AbortController();
  const result = await getComparisonProperties({
    apiUrl: "https://example.test",
    signal: controller.signal,
    fetchImpl: async (url, options) => {
      calls.push(url);
      assert.equal(options.signal, controller.signal);
      const page = Number(new URL(url).searchParams.get("page"));
      return new Response(
        JSON.stringify({
          items:
            page === 1
              ? [{ id: "a", title: "Earlier", amenities: ["Earlier"] }]
              : [
                  { id: "a", title: "Current", amenities: ["Supplied"] },
                  { id: "b", carpet_area_sqft: 900 },
                ],
          pagination: { pages: 2 },
        }),
      );
    },
  });
  assert.equal(calls.length, 2);
  assert.equal(result.length, 2);
  assert.equal(result[0].title, "Current");
  assert.equal(result[0].amenities, "Supplied");
  assert.equal(result[1].areaBasis, "Carpet");
});

test("feed failures reject rather than falling back to sample data", async () => {
  await assert.rejects(
    getComparisonProperties({
      apiUrl: "https://example.test",
      fetchImpl: async () => new Response("", { status: 503 }),
    }),
    /Failed to fetch properties/,
  );
});
