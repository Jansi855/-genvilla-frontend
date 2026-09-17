<<<<<<< HEAD
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
=======
import Link from "next/link";
import { cache, Suspense } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Bath, BedDouble, Building2, CalendarDays, Car, Check, ChevronRight, Compass, KeyRound, Mail, MapPin, Maximize2, MessageSquare, Phone, Sofa, UserRound } from "lucide-react";
import { formatPropertyArea, getPropertyById } from "@/services/properties";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LocationMap from "@/components/location/LocationMap";
import PropertyGallery from "@/components/properties/PropertyGallery";
import PropertyGridSkeleton from "@/components/properties/PropertyGridSkeleton";
import { FavoritePropertyButton, PropertyDescription, SharePropertyButton } from "@/components/properties/PropertyActions";

const loadProperty = cache(async (id) => {
  try { return { property: await getPropertyById(id) }; }
  catch { return { error: true }; }
});

export async function generateMetadata({ params }) {
  const { id } = await params;
  const { property } = await loadProperty(id);
  if (!property) return { title: "Property unavailable | GenVilla" };
  return {
    title: `${property.title}${property.location ? ` in ${property.location}` : ""} | GenVilla`,
    description: [property.title, property.location, property.price, property.type, "Explore property details, photos and GenVilla decision-support tools."].filter(Boolean).join(". "),
  };
}

export default function PropertyDetailPage({ params }) {
  return <><Navbar /><main className="bg-cream"><div className="mx-auto max-w-[1440px] px-5 py-7 lg:px-10">
    <Link href="/properties" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-green"><ArrowLeft size={16} />Back to properties</Link>
    <Suspense fallback={<div className="py-8"><PropertyGridSkeleton detail /></div>}><PropertyContent params={params} /></Suspense>
  </div></main><Footer /></>;
}

async function PropertyContent({ params }) {
  const { id } = await params;
  const { property: p, error } = await loadProperty(id);
  if (error) return <section className="my-8 rounded-[28px] border border-ink/10 bg-white p-8 text-center">
    <h1 className="font-serif text-3xl">We couldn’t load this property right now.</h1>
    <p className="mt-3 text-sm text-ink/60">Please try again in a moment.</p>
    <a href={`/properties/${encodeURIComponent(id)}`} className="btn-green mt-6">Try again</a>
  </section>;
  if (!p) notFound();

  const projectIsDistinct = p.projectName && p.projectName.toLowerCase() !== p.title.toLowerCase();
  const search = (query = "") => `/properties?${new URLSearchParams({ city: p.city, query, purpose: p.purpose })}`;
  const specs = [
    [BedDouble, "Bedrooms", p.bedrooms && `${p.bedrooms} BHK`],
    [Bath, "Bathrooms", p.bathrooms],
    [Building2, "Balconies", p.balconies],
    [Maximize2, "Built-up area", formatPropertyArea(p.builtupArea)],
    [Maximize2, "Carpet area", formatPropertyArea(p.carpetArea)],
  ].filter(([, , value]) => value);
  const details = [
    [Building2, "Property type", p.type],
    [KeyRound, "Transaction", p.transactionType],
    [Maximize2, "Built-up area", formatPropertyArea(p.builtupArea)],
    [Maximize2, "Carpet area", formatPropertyArea(p.carpetArea)],
    [Maximize2, "Price / sq.ft.", p.pricePerSqft],
    [Building2, "Floor", p.floor],
    [Compass, "Facing", p.facing],
    [Car, "Parking", p.parking],
    [Sofa, "Furnishing", p.furnishing],
    [KeyRound, "Possession", p.status],
    [KeyRound, "Ownership", p.ownership],
    [CalendarDays, "Property age", p.propertyAge && `${p.propertyAge} ${p.propertyAge === 1 ? "year" : "years"}`],
    [CalendarDays, "Listed on", p.listedOn],
    [Building2, "Listing ID", p.listingId],
  ].filter(([, , value]) => value);
  const sections = [
    ["overview", "Overview"],
    ...(p.images.length ? [["photos", "Photos"]] : []),
    ["location", "Location"],
    ...(p.projectName ? [["project", "Project"]] : []),
    ...(p.amenities.length ? [["amenities", "Amenities"]] : []),
    ["analysis", "Decision support"],
  ];

  return <>
    <nav aria-label="Breadcrumb" className="mb-6 mt-2 text-xs leading-6 text-ink/55">
      <ol className="flex flex-wrap items-center gap-x-2">
        <li><Link href="/" className="hover:text-green">Home</Link></li>
        {p.city && <li className="flex items-center gap-2"><ChevronRight size={12} /><Link href={search()}>{p.city}</Link></li>}
        {p.locality && <li className="flex items-center gap-2"><ChevronRight size={12} /><Link href={search(p.locality)}>{p.locality}</Link></li>}
        {projectIsDistinct && <li className="flex items-center gap-2"><ChevronRight size={12} /><a href="#project">{p.projectName}</a></li>}
        <li className="flex min-w-0 items-center gap-2"><ChevronRight size={12} className="shrink-0" /><span aria-current="page" className="break-words text-ink">{p.title}</span></li>
      </ol>
    </nav>

    <section id="overview" className="grid scroll-mt-28 gap-6 md:grid-cols-2 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_250px]">
      <PropertyGallery images={p.images} title={p.title} />
      <div className="min-w-0 py-2">
        <p className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-widest text-green"><span className="rounded-full bg-sage px-3 py-2">{p.purpose === "Rent" ? "For rent" : "For sale"}</span>{p.status && <span className="rounded-full border border-green/20 px-3 py-2">{p.status}</span>}</p>
        <h1 className="mt-4 break-words font-serif text-3xl leading-tight lg:text-4xl">{p.title}</h1>
        {projectIsDistinct && <a href="#project" className="mt-2 inline-block text-sm font-semibold text-green">{p.projectName}</a>}
        <a href="#location" className="mt-3 flex items-start gap-2 text-sm leading-6 text-ink/60"><MapPin size={17} className="mt-1 shrink-0" />{p.location || "Location unavailable"}</a>
        <p className="mt-6 font-serif text-4xl text-green">{p.price}</p>
        {p.pricePerSqft && <p className="mt-2 text-sm text-ink/55">{p.pricePerSqft}</p>}
        {specs.length > 0 && <dl className="my-5 grid grid-cols-2 gap-4 border-y border-ink/10 py-5 sm:grid-cols-3 md:grid-cols-2">
          {specs.map(([Icon, label, value]) => <div key={label}><dt className="flex items-center gap-2 text-[11px] text-ink/60"><Icon size={17} className="text-green" />{label}</dt><dd className="mt-2 text-sm font-bold">{value}</dd></div>)}
        </dl>}
        <p className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-ink/65">{p.furnishing && <span>{p.furnishing}</span>}{p.floor && <span>Floor {p.floor}</span>}</p>
        <div className="mt-5 flex flex-wrap gap-2"><FavoritePropertyButton property={p} /><SharePropertyButton title={p.title} /></div>
      </div>
      <aside className="h-fit rounded-[24px] border border-green/15 bg-white p-5 shadow-[0_8px_30px_rgba(16,50,41,0.05)] md:col-span-2 xl:col-span-1">
        <p className="eyebrow">CONTACT SELLER</p>
        <div className="mt-5 flex items-start gap-3"><span className="rounded-2xl bg-sage p-3 text-green"><UserRound size={22} /></span><div className="min-w-0"><h2 className="break-words font-serif text-2xl">{p.sellerName || "Seller details unavailable"}</h2>{p.sellerType && <p className="mt-1 text-xs text-ink/60">{p.sellerType}</p>}</div></div>
        {p.contact?.phone ? <div className="mt-5 space-y-3">
          <a className="btn-green w-full" href={`tel:${p.contact.phone}`}><Phone size={16} />Call seller</a>
          <a className="btn-outline w-full" href={`sms:${p.contact.phone}`}><MessageSquare size={16} />Message seller</a>
          <p className="break-words text-center text-xs text-ink/60">{p.contact.value}</p>
        </div> : p.contact?.email ? <a className="btn-green mt-5 w-full" href={`mailto:${encodeURIComponent(p.contact.email)}`}><Mail size={16} />Email seller</a> : <p className="mt-5 rounded-2xl bg-cream p-4 text-sm leading-6 text-ink/60">Public contact details are not available for this listing.</p>}
        {p.listingUrl && <a href={p.listingUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-11 items-center gap-2 text-xs font-bold text-green">View original listing<ArrowUpRight size={14} /></a>}
        <div className="mt-5 border-t border-ink/10 pt-5"><p className="font-serif text-xl">Make an informed move.</p><p className="mt-2 text-xs leading-5 text-ink/60">Explore your budget and ownership costs with GenVilla.</p><Link href="/calculators/affordability" className="btn-outline mt-4 w-full">Check affordability</Link></div>
      </aside>
    </section>

    <nav aria-label="Property sections" className="my-8 flex gap-1 overflow-x-auto border-y border-ink/10 py-2">
      {sections.map(([target, label]) => <a key={target} href={`#${target}`} className="shrink-0 rounded-full px-4 py-3 text-xs font-bold text-green hover:bg-sage">{label}</a>)}
    </nav>

    <div className="space-y-6">
      <section className="rounded-[24px] border border-ink/10 bg-white p-6 md:p-8">
        <h2 className="mb-5 font-serif text-3xl">Property description</h2>
        {p.description ? <PropertyDescription description={p.description} /> : <p className="text-sm text-ink/55">A description has not been provided for this property.</p>}
      </section>
      <section className="rounded-[24px] border border-ink/10 bg-white p-6 md:p-8">
        <h2 className="font-serif text-3xl">Key details</h2>
        <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{details.map(([Icon, label, value]) => <div key={label} className="flex min-w-0 items-start gap-3 border-b border-ink/5 pb-4"><Icon size={18} className="mt-1 shrink-0 text-green" /><div className="min-w-0"><dt className="text-xs text-ink/55">{label}</dt><dd className="mt-2 break-words text-sm font-semibold">{value}</dd></div></div>)}</dl>
      </section>
      {p.images.length > 0 && <section id="photos" className="scroll-mt-28 rounded-[24px] border border-ink/10 bg-white p-6 md:p-8"><div className="mb-5 flex items-center justify-between"><h2 className="font-serif text-3xl">Property photos</h2><span className="text-sm text-ink/55">{p.images.length} {p.images.length === 1 ? "photo" : "photos"}</span></div><PropertyGallery images={p.images} title={p.title} collection /></section>}
      <section id="location" className="scroll-mt-28 rounded-[24px] border border-ink/10 bg-white p-6 md:p-8">
        <h2 className="font-serif text-3xl">Location</h2>
        <p className="my-4 flex items-start gap-2 text-sm leading-6 text-ink/65"><MapPin size={18} className="mt-1 shrink-0 text-green" /><span>{p.address || p.location || "Location unavailable"}{p.address && p.location && p.address.toLowerCase() !== p.location.toLowerCase() && <span className="block">{p.location}</span>}{p.jurisdiction && <span className="block text-xs">{p.jurisdiction}</span>}</span></p>
        {p.coordinates ? <LocationMap location={{ ...p.coordinates, label: p.title, locality: p.locality }} className="h-[320px] md:h-[380px]" /> : <p className="rounded-2xl bg-cream p-5 text-sm text-ink/55">Exact map location is not available for this listing.</p>}
      </section>
      {p.projectName && <section id="project" className="scroll-mt-28 rounded-[24px] border border-ink/10 bg-white p-6 md:p-8"><p className="eyebrow">PROJECT</p><h2 className="mt-3 break-words font-serif text-3xl">{p.projectName}</h2>{p.location && <p className="mt-3 text-sm text-ink/60">{p.location}</p>}</section>}
      {p.amenities.length > 0 && <section id="amenities" className="scroll-mt-28 rounded-[24px] border border-ink/10 bg-white p-6 md:p-8"><h2 className="font-serif text-3xl">Listed amenities</h2><ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{p.amenities.map((amenity) => <li key={amenity} className="flex items-start gap-2 text-sm"><Check size={17} className="shrink-0 text-green" />{amenity}</li>)}</ul></section>}
      <section id="analysis" className="scroll-mt-28 rounded-[28px] bg-[#15352c] p-6 text-white md:p-8">
        <p className="eyebrow !text-[#a6cbbd]">GENVILLA DECISION SUPPORT</p>
        <h2 className="mt-3 font-serif text-3xl md:text-4xl">Look beyond the asking price.</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">Use your financial details to estimate affordability, ownership costs and rental potential. These tools provide estimates, separate from the listing information.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[
          ["affordability", "Check affordability"], ["emi", "Calculate EMI"], ["true-cost", "Calculate true cost"], ["rental-roi", "Analyze rental ROI"], ["risk-analysis", "Risk analysis"], ["buy-vs-rent", "Buy vs rent"], ["smart-property-analyzer", "Analyze this property"],
        ].map(([slug, label]) => <Link key={slug} href={`/calculators/${slug}`} className="flex min-h-14 items-center justify-between gap-2 rounded-2xl border border-white/20 px-4 py-3 text-sm hover:bg-white/10">{label}<ArrowUpRight size={16} className="shrink-0" /></Link>)}<Link href={`/smart-recommendation?property=${encodeURIComponent(p.id)}`} className="flex min-h-14 items-center justify-between gap-2 rounded-2xl border border-white/20 px-4 py-3 text-sm hover:bg-white/10">Smart recommendation<ArrowUpRight size={16} /></Link></div>
      </section>
      {p.publisher && <p className="text-xs text-ink/50">Listing published by {p.publisher}. Availability and prices may change.</p>}
    </div>
  </>;
>>>>>>> 1712d91 (Update property listing and property details UI)
}
