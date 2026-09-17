import Link from 'next/link';
import { Suspense } from 'react';
import { filterProperties, getProperties } from '@/services/properties';
import {
  getCityLocations,
  getLocalitiesForCity,
  isIndexableLocation,
} from '@/data/locations';
import { decisionTools } from '@/data/propertySeo';
import {
  getLocationLabel,
  getPropertyLocationPath,
} from '@/utils/location';
import { normalizePropertySearchParams } from '@/utils/propertySearch';
import PropertiesClient from './PropertiesClient';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://genvilla.in';

export function getLocationPageMetadata(location, searchParams = {}) {
  const params = toSearchParams(searchParams);
  const filters = normalizePropertySearchParams(params, location);
  const label = getLocationLabel(location);
  const intent = filters.purpose === 'Rent' ? 'Rent' : 'Sale';
  const canonicalPath = getPropertyLocationPath(location);
  const filtered = [...params.keys()].length > 0;

  return {
    title: `Properties for ${intent} in ${label} | GenVilla`,
    description: location.locality
      ? `Explore properties for ${intent.toLowerCase()} in ${label}. Compare available listings, prices, maps and GenVilla property decision tools.`
      : `Explore properties for ${intent.toLowerCase()} in ${label} on GenVilla. Compare available homes, prices, locations, EMI estimates, affordability and property analysis tools.`,
    alternates: { canonical: `${SITE_URL}${canonicalPath}` },
    robots: {
      index: isIndexableLocation(location) && !filtered,
      follow: true,
    },
  };
}

export default async function LocationLanding({ location, searchParams }) {
  const params = toSearchParams(await searchParams);
  const filters = normalizePropertySearchParams(params, location);
  let allProperties = [];

  try {
    const data = await getProperties();
    allProperties = data.properties;
  } catch {
    // The existing client error state remains responsible for API outages.
  }

  const marketFilters = {
    city: location.city,
    locality: location.locality,
    purpose: filters.purpose,
  };
  const marketProperties = filterProperties(allProperties, marketFilters);
  const filteredProperties = filterProperties(allProperties, filters);
  const initialData = allProperties.length
    ? {
        properties: filteredProperties,
        total: filteredProperties.length,
        demo: false,
      }
    : undefined;
  const label = getLocationLabel(location);
  const canonicalPath = getPropertyLocationPath(location);
  const propertyTypes = countPropertyTypes(marketProperties);
  const breadcrumbs = buildBreadcrumbs(location);
  const schemas = [
    breadcrumbSchema(breadcrumbs),
    itemListSchema(filteredProperties.slice(0, 6)),
  ].filter(Boolean);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJson(schemas) }}
      />
      <Suspense fallback={<main className="min-h-screen bg-cream" />}>
        <PropertiesClient
          location={{ city: location.city, locality: location.locality }}
          initialData={initialData}
          marketCount={allProperties.length ? marketProperties.length : null}
          breadcrumbs={<Breadcrumbs entries={breadcrumbs} />}
          seoContent={
            <LocationContent
              location={location}
              label={label}
              canonicalPath={canonicalPath}
              localities={getLocalitiesForCity(location.city).filter(isIndexableLocation)}
              propertyTypes={propertyTypes}
            />
          }
        />
      </Suspense>
    </>
  );
}

function Breadcrumbs({ entries }) {
  return (
    <nav aria-label="Breadcrumb" className="bg-[#eef1ea] px-5 pt-5 lg:px-10">
      <ol className="mx-auto flex max-w-[1360px] flex-wrap items-center gap-2 text-xs font-semibold text-ink/55">
        {entries.map((entry, index) => (
          <li className="flex items-center gap-2" key={entry.href}>
            {index > 0 && <span aria-hidden="true">›</span>}
            {index === entries.length - 1 ? (
              <span aria-current="page" className="text-ink">{entry.name}</span>
            ) : (
              <Link className="hover:text-green" href={entry.href}>{entry.name}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function LocationContent({ location, label, canonicalPath, localities, propertyTypes }) {
  const cityPath = getPropertyLocationPath({ city: location.city });
  const otherCities = getCityLocations().filter((item) => item.city !== location.city);
  const recommendation = new URLSearchParams({ city: location.city });
  if (location.locality) recommendation.set('locality', location.locality);

  return (
    <section className="bg-white px-5 py-14 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-[1360px] space-y-12">
        <div className="max-w-4xl">
          <p className="eyebrow">PROPERTY SEARCH GUIDE</p>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl">Explore property options in {label}</h2>
          <p className="mt-4 leading-7 text-ink/60">
            {location.locality
              ? `${location.locality} is a supported GenVilla locality within ${location.city}, ${location.district} district. Browse its current sale and rental inventory, then use GenVilla’s affordability, EMI, true-cost and risk tools to evaluate a shortlisted property.`
              : `${location.city} is one of GenVilla’s supported property markets in ${location.state}. Browse structured listings across its supported localities, compare available property types, and carry any shortlist into GenVilla’s affordability, EMI, true-cost, rental-return and risk tools.`}
          </p>
        </div>

        {!location.locality && localities.length > 0 && (
          <section aria-labelledby="popular-localities">
            <h2 id="popular-localities" className="font-serif text-3xl">Supported localities in {location.city}</h2>
            <div className="mt-5 flex flex-wrap gap-3">
              {localities.map((item) => (
                <Link className="rounded-full border border-ink/10 bg-cream px-4 py-2 text-sm font-bold text-ink/65 transition hover:border-green hover:text-green" href={getPropertyLocationPath(item)} key={item.id}>
                  {item.locality}
                </Link>
              ))}
            </div>
          </section>
        )}

        {propertyTypes.length > 0 && (
          <section aria-labelledby="property-types">
            <h2 id="property-types" className="font-serif text-3xl">Explore by property type</h2>
            <div className="mt-5 flex flex-wrap gap-3">
              {propertyTypes.map(([type, count]) => (
                <Link className="rounded-2xl border border-ink/10 px-5 py-3 text-sm font-bold hover:border-green hover:text-green" href={`${canonicalPath}?type=${encodeURIComponent(type)}`} key={type}>
                  {type} ({count})
                </Link>
              ))}
            </div>
          </section>
        )}

        <section aria-labelledby="decision-tools">
          <h2 id="decision-tools" className="font-serif text-3xl">Make a better property decision in {label}</h2>
          <p className="mt-3 max-w-3xl leading-7 text-ink/55">Move from discovery to a clearer financial decision with GenVilla’s calculators and property-analysis tools.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {decisionTools.map(([name, href]) => (
              <Link className="rounded-2xl border border-ink/10 bg-cream p-4 text-sm font-bold transition hover:-translate-y-0.5 hover:border-green hover:text-green" href={name === 'Smart Recommendation' ? `${href}?${recommendation}` : href} key={name}>
                {name}
              </Link>
            ))}
          </div>
        </section>

        <section aria-labelledby="other-markets">
          <h2 id="other-markets" className="font-serif text-3xl">Explore other GenVilla markets</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {location.locality && <Link className="text-sm font-bold text-green" href={cityPath}>All {location.city} properties</Link>}
            {otherCities.map((city) => (
              <Link className="text-sm font-bold text-green" href={getPropertyLocationPath(city)} key={city.id}>{city.city}</Link>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}

function buildBreadcrumbs(location) {
  const entries = [
    { name: 'Home', href: '/' },
    { name: 'Properties', href: '/properties' },
    { name: location.city, href: getPropertyLocationPath({ city: location.city }) },
  ];
  if (location.locality) entries.push({ name: location.locality, href: getPropertyLocationPath(location) });

  return entries;
}

function breadcrumbSchema(entries) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: entries.map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: entry.name,
      item: `${SITE_URL}${entry.href}`,
    })),
  };
}

function itemListSchema(properties) {
  if (!properties.length) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    numberOfItems: properties.length,
    itemListElement: properties.map((property, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: property.title,
      url: `${SITE_URL}/properties/${property.id}`,
    })),
  };
}

function countPropertyTypes(properties) {
  const counts = new Map();
  properties.forEach((property) => counts.set(property.type, (counts.get(property.type) || 0) + 1));

  return [...counts.entries()].filter(([type]) => type).sort((a, b) => b[1] - a[1]);
}

function toSearchParams(value = {}) {
  if (value instanceof URLSearchParams) return value;
  const params = new URLSearchParams();
  Object.entries(value || {}).forEach(([key, entry]) => {
    if (Array.isArray(entry)) entry.forEach((item) => params.append(key, item));
    else if (entry !== undefined) params.set(key, entry);
  });

  return params;
}

function safeJson(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
