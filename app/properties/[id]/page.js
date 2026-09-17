import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { ArrowLeft, ArrowUpRight, MapPin, ShieldCheck, TrendingUp } from 'lucide-react';
import { getPropertyById } from '@/services/properties';
import { findLocationByPath } from '@/data/locations';
import { getPropertyLocationPath } from '@/utils/location';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LocationLanding, { getLocationPageMetadata } from '@/components/properties/LocationLanding';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://genvilla.in';
const getCachedProperty = cache(getPropertyById);

export async function generateMetadata({ params, searchParams }) {
  const { id } = await params;
  const location = findLocationByPath(id);
  if (location) return getLocationPageMetadata(location, await searchParams);

  const property = await getCachedProperty(id);
  if (!property) return {};
  const locationLabel = [property.locality, property.city].filter(Boolean).join(', ');
  const bhk = property.bhk ? `${property.bhk} BHK ` : '';
  const intent = property.purpose === 'Rent' ? 'Rent' : 'Sale';

  return {
    title: `${bhk}${property.type} for ${intent} in ${locationLabel} | GenVilla`,
    description: `Explore this ${bhk}${property.type.toLowerCase()} for ${intent.toLowerCase()} in ${locationLabel}. View its price, area, location and GenVilla property analysis tools.`,
    alternates: { canonical: `${SITE_URL}/properties/${property.id}` },
  };
}

export default async function PropertyDetailPage({ params, searchParams }) {
  const { id } = await params;
  const locationPage = findLocationByPath(id);
  if (locationPage) return <LocationLanding location={locationPage} searchParams={searchParams} />;

  const property = await getCachedProperty(id);

  if (!property) notFound();
  const cityPath = getPropertyLocationPath({ city: property.city });
  const localityPath = getPropertyLocationPath({ city: property.city, locality: property.locality });
  const supportedLocality = property.locality
    ? findLocationByPath(property.city, property.locality)
    : null;
  const imageAlt = `${property.bhk ? `${property.bhk} BHK ` : ''}${property.type.toLowerCase()} in ${[property.locality, property.city].filter(Boolean).join(', ')}`;
  const propertySchema = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: property.title,
    image: property.image,
    url: `${SITE_URL}/properties/${property.id}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: property.locality,
      addressRegion: property.city,
      addressCountry: 'IN',
    },
    ...(property.priceValue ? { offers: { '@type': 'Offer', price: property.priceValue, priceCurrency: 'INR' } } : {}),
  };
  const breadcrumbEntries = [
    ['Home', '/'],
    ['Properties', '/properties'],
    [property.city, cityPath],
    ...(supportedLocality ? [[property.locality, localityPath]] : []),
    [property.title, `/properties/${property.id}`],
  ];
  const structuredData = [
    propertySchema,
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbEntries.map(([name, href], index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name,
        item: `${SITE_URL}${href}`,
      })),
    },
  ];

  return (
    <>
      <Navbar />

      <main className="bg-cream">
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(structuredData).replace(/</g, '\\u003c')}} />
        <div className="mx-auto max-w-[1360px] px-5 py-8 lg:px-10">

          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-sm font-bold text-green">
              <li><Link href="/"><ArrowLeft className="inline" size={16}/> Home</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href="/properties">Properties</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href={cityPath}>{property.city}</Link></li>
              {supportedLocality && <><li aria-hidden="true">›</li><li><Link href={localityPath}>{property.locality}</Link></li></>}
              <li aria-hidden="true">›</li>
              <li aria-current="page" className="text-ink/55">{property.title}</li>
            </ol>
          </nav>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.35fr_.65fr]">

            {/* LEFT SIDE */}
            <div>

              {/* PROPERTY IMAGE */}
              <div className="relative h-[340px] overflow-hidden rounded-[28px] bg-sage md:h-[560px]">

                {/* Blurred Background */}
                <img
                  src={property.image}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl opacity-40"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/10" />

                {/* Main Image */}
                <img
                  src={property.image}
                  alt={imageAlt}
                  className="relative z-10 h-full w-full object-contain"
                />

              </div>

              {/* PROPERTY INFORMATION */}
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">

                {[
                  ["Property type", property.type],
                  ["Home size", property.area],
                  ["Risk", property.risk],
                  ["Rental ROI", property.roi],
                ].map(([label, value]) => (
                  <div
                    className="rounded-2xl border border-ink/10 bg-white p-4"
                    key={label}
                  >
                    <small className="block text-ink/45">
                      {label}
                    </small>

                    <b className="mt-1 block text-sm">
                      {value}
                    </b>
                  </div>
                ))}

              </div>
            </div>

            {/* RIGHT SIDE */}
            <aside className="h-fit rounded-[28px] border border-ink/10 bg-white p-6 md:p-8">

              <p className="eyebrow">
                {property.purpose.toUpperCase()} ·{" "}
                {property.status.toUpperCase()}
              </p>

              <h1 className="mt-3 font-serif text-4xl leading-tight">
                {property.title}
              </h1>

              <p className="mt-3 flex items-center gap-1 text-ink/55">
                <MapPin size={16} />
                {property.location}
              </p>

              {/* PRICE */}
              <p className="mt-8 font-serif text-4xl">
                {property.price}
              </p>

              <p className="mt-1 text-sm text-ink/55">
                {property.bhk} BHK · {property.area} sq.ft.
              </p>

              {/* ANALYSIS */}
              <div className="mt-7 space-y-3 border-y border-ink/10 py-5">

                <p className="flex gap-3 text-sm">
                  <ShieldCheck
                    className="text-green"
                    size={18}
                  />

                  <span>
                    <b>{property.risk}</b>
                    <br />

                    <small className="text-ink/50">
                      Demo risk indicator
                    </small>
                  </span>
                </p>

                <p className="flex gap-3 text-sm">
                  <TrendingUp
                    className="text-green"
                    size={18}
                  />

                  <span>
                    <b>{property.roi}</b>
                    <br />

                    <small className="text-ink/50">
                      Illustrative rental potential
                    </small>
                  </span>
                </p>

              </div>

              {/* BUTTONS */}
              <Link
                className="btn-green mt-7 w-full"
                href="/calculators/affordability"
              >
                Check affordability
                <ArrowUpRight size={16} />
              </Link>

              <Link
                className="btn-outline mt-3 w-full"
                href={`/smart-recommendation?property=${property.id}`}
              >
                Analyze this property
              </Link>

            </aside>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
