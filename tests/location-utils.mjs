import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile(
  new URL("../utils/location.js", import.meta.url),
  "utf8",
);
const location = await import(
  `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`
);

assert.equal(location.normalizeCity("NEW-DELHI"), "New Delhi");
assert.equal(location.normalizeCity(" Gurgaon "), "Gurugram");
assert.equal(location.normalizeLocality(" sector-62 "), "Sector 62");
assert.equal(location.getLocationSlug("New Delhi"), "New-Delhi");
assert.deepEqual(
  location.parseLocationFromSearchParams(
    new URLSearchParams("city=Noida&locality=Sector-62"),
  ),
  { city: "Noida", locality: "Sector 62" },
);
assert.equal(
  location.buildPropertySearchUrl(
    { city: "New Delhi", locality: "Dwarka" },
    { purpose: "Rent" },
  ),
  "/properties/new-delhi/dwarka?purpose=Rent",
);
assert.equal(
  location.getPropertyLocationPath({ city: "Noida", locality: "Sector 62" }),
  "/properties/noida/sector-62",
);
assert.equal(
  location.matchesPropertyLocation(
    { city: "NOIDA", locality: "Sector 62" },
    { city: "noida", locality: "sector-62" },
  ),
  true,
);
assert.equal(
  location.matchesPropertyLocation(
    { city: "Ghaziabad", locality: "Sector 62" },
    { city: "Noida", locality: "Sector 62" },
  ),
  false,
);

console.log("Location normalization, URL, parsing, and matching tests passed.");
