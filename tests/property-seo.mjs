import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const locationSource = await readFile(new URL('../utils/location.js', import.meta.url), 'utf8');
const locationModule = `data:text/javascript;base64,${Buffer.from(locationSource).toString('base64')}`;
const searchSource = await readFile(new URL('../utils/propertySearch.js', import.meta.url), 'utf8');
const searchModule = await import(
  `data:text/javascript;base64,${Buffer.from(searchSource.replace("from '@/utils/location'", `from '${locationModule}'`)).toString('base64')}`
);

const filters = searchModule.normalizePropertySearchParams(
  new URLSearchParams('bedrooms=3&propertyType=apartment&sort=price-low'),
  { city: 'Noida', locality: 'Sector 62' },
);

assert.deepEqual(filters, {
  purpose: 'Buy',
  query: '',
  city: 'Noida',
  locality: 'Sector 62',
  type: 'Apartment',
  bhk: '3 BHK',
  budget: '',
  sort: 'price-low',
});
assert.equal(
  searchModule.hasIndexableFilterParams(new URLSearchParams('sort=price-low')),
  true,
);

const sitemapSource = await readFile(new URL('../app/sitemap.js', import.meta.url), 'utf8');
const robotsSource = await readFile(new URL('../app/robots.js', import.meta.url), 'utf8');
assert.match(sitemapSource, /getIndexableLocations/);
assert.match(sitemapSource, /getProperties/);
assert.match(robotsSource, /sitemap\.xml/);
assert.match(robotsSource, /\/properties\//);

console.log('Property SEO route filters, sitemap, and robots tests passed.');
