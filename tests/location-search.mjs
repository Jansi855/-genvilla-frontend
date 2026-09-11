import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile(
  new URL("../data/locations.js", import.meta.url),
  "utf8",
);
const { searchLocations } = await import(
  `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`
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
assert.equal(searchLocations("gurgaon")[0].city, "Gurugram");

console.log("Location autocomplete ranking tests passed.");
