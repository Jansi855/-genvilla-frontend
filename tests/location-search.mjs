import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile(
  new URL("../data/locations.js", import.meta.url),
  "utf8",
);
const locationSource = await readFile(
  new URL("../utils/location.js", import.meta.url),
  "utf8",
);
const locationModule = `data:text/javascript;base64,${Buffer.from(locationSource).toString("base64")}`;
const { findLocationByPath, getIndexableLocations, searchLocations } = await import(
  `data:text/javascript;base64,${Buffer.from(source.replace("from '@/utils/location'", `from '${locationModule}'`)).toString("base64")}`
);

for (const city of ["Gurugram", "Ghaziabad", "Sonipat", "Noida", "New Delhi"]) {
  const [first] = searchLocations(city);

  assert.equal(first.city, city);
  assert.equal(
    first.locality,
    "",
    `${city} should rank ahead of its localities`,
  );
}

assert.equal(searchLocations("Kundli")[0].locality, "Kundli");
assert.equal(searchLocations("Sector 62")[0].city, "Noida");
assert.equal(searchLocations("gurgaon")[0].city, "Gurugram");
assert.equal(findLocationByPath("new-delhi").city, "New Delhi");
assert.equal(findLocationByPath("noida", "sector-62").locality, "Sector 62");
assert.equal(findLocationByPath("mumbai"), null);
assert.ok(getIndexableLocations().some((location) => location.id === "noida-sector-62"));

console.log("Location autocomplete ranking tests passed.");
