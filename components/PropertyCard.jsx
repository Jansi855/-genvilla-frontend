"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Bath, BedDouble, Building2, Images, MapPin, Maximize2 } from "lucide-react";
import { formatPropertyArea } from "@/services/properties";
import { FavoritePropertyButton } from "./properties/PropertyActions";
import { PropertyImage } from "./properties/PropertyGallery";

export default function PropertyCard({ property, horizontal = false }) {
  const [selected, setSelected] = useState(0);
  const images = property.images?.length ? property.images : property.image ? [property.image] : [];
  const title = property.title || "Property";
  const href = `/properties/${encodeURIComponent(property.slug || property.id)}`;
  const bedrooms = Number.parseInt(property.bedrooms || property.bhk, 10);
  const area = formatPropertyArea(property.areaValue || property.area);
  const project = property.projectName && property.projectName.toLowerCase() !== title.toLowerCase() ? property.projectName : "";

  return (
    <article className={`group overflow-hidden rounded-[28px] border border-ink/10 bg-white shadow-[0_8px_30px_rgba(16,50,41,0.07)] transition-shadow hover:shadow-soft ${horizontal ? "sm:grid sm:grid-cols-[230px_minmax(0,1fr)] lg:grid-cols-[290px_minmax(0,1fr)]" : "flex h-full flex-col"}`}>
      <div className={`relative min-w-0 bg-sage/40 ${horizontal ? "p-3" : ""}`}>
        <Link href={href} aria-label={`View ${title}`} className={`block overflow-hidden ${horizontal ? "h-[240px] rounded-[20px] sm:h-[270px]" : "h-[260px]"}`}>
          <PropertyImage src={images[selected] || images[0]} alt={title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
        </Link>
        <div className="absolute right-5 top-5"><FavoritePropertyButton property={property} compact /></div>
        {property.type && <span className="absolute left-5 top-5 inline-flex max-w-[65%] items-center gap-1.5 rounded-full bg-white/95 px-3 py-2 text-[11px] font-bold text-green"><Building2 size={14} className="shrink-0" />{property.type}</span>}
        {images.length > 1 && <div className={`flex items-center gap-2 ${horizontal ? "mt-2" : "p-3"}`}>
          {images.slice(0, 3).map((src, index) => <button type="button" key={src} aria-label={`Show ${title} photo ${index + 1}`} aria-pressed={selected === index} onClick={() => setSelected(index)} className={`h-12 min-w-0 flex-1 overflow-hidden rounded-lg border-2 ${selected === index ? "border-green" : "border-transparent"}`}>
            <PropertyImage src={src} alt={`${title}, thumbnail ${index + 1}`} className="h-full w-full object-cover" />
          </button>)}
          <Link href={`${href}#photos`} className="flex h-12 flex-1 flex-col items-center justify-center rounded-lg bg-white px-1 text-[10px] font-bold text-green"><Images size={15} />{images.length} Photos</Link>
        </div>}
      </div>
      <div className="flex min-w-0 flex-1 flex-col p-5 sm:p-6">
        <p className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-bold uppercase tracking-wider text-green">
          <span>{property.purpose === "Rent" ? "For rent" : "For sale"}</span>
          {property.status && <span className="text-ink/55">{property.status}</span>}
        </p>
        <Link href={href}><h3 className="mt-3 line-clamp-3 break-words font-serif text-2xl leading-tight text-ink group-hover:text-green">{title}</h3></Link>
        {project && <p className="mt-1 truncate text-sm text-green">{project}</p>}
        <p className="mt-2 flex items-start gap-2 text-xs leading-5 text-ink/60"><MapPin size={15} className="mt-0.5 shrink-0" /><span>{property.location || "Location unavailable"}</span></p>
        <div className="my-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <p className="text-2xl font-bold tracking-tight">{property.price || "Price on request"}</p>
          {property.pricePerSqft && <p className="text-xs text-ink/55">{property.pricePerSqft}</p>}
        </div>
        <dl className="flex flex-wrap gap-x-6 gap-y-3 border-y border-ink/10 py-4">
          {bedrooms > 0 && <Stat icon={BedDouble} label="Bedrooms" value={`${bedrooms} BHK`} />}
          {property.bathrooms > 0 && <Stat icon={Bath} label="Bathrooms" value={`${property.bathrooms} Bath${property.bathrooms > 1 ? "s" : ""}`} />}
          {area && <Stat icon={Maximize2} label={property.areaLabel || "Area"} value={area} />}
        </dl>
        {(property.furnishing || property.floor) && <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink/65">{property.furnishing && <span>{property.furnishing}</span>}{property.floor && <span>Floor {property.floor}</span>}</p>}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
          <span className="text-[11px] text-ink/50">{property.listedOn ? `Listed ${property.listedOn}` : ""}</span>
          <Link href={href} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-green px-5 py-2 text-xs font-bold text-white">View details <ArrowUpRight size={16} /></Link>
        </div>
      </div>
    </article>
  );
}

function Stat({ icon: Icon, label, value }) {
  return <div><dt className="text-[10px] text-ink/55">{label}</dt><dd className="mt-1 flex items-center gap-2 text-xs font-bold"><Icon size={16} className="text-green" />{value}</dd></div>;
}
