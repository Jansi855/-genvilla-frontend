"use client";

import Link from "next/link";
import { Bath, BedDouble, Building2, MapPin, Maximize2 } from "lucide-react";
import { formatPropertyArea } from "@/services/properties";
import { FavoritePropertyButton } from "./properties/PropertyActions";
import { PropertyImage } from "./properties/PropertyGallery";

export default function PropertyCard({ property, horizontal = false }) {
  const images = property.images?.length
    ? property.images
    : property.image
      ? [property.image]
      : [];
  const title = property.title || "Property";
  const href = `/properties/${encodeURIComponent(property.slug || property.id)}`;
  const bedrooms = Number.parseInt(property.bedrooms || property.bhk, 10);
  const area = formatPropertyArea(property.areaValue || property.area);
  const project =
    property.projectName &&
    property.projectName.toLowerCase() !== title.toLowerCase()
      ? property.projectName
      : "";

  return (
    <article
      className={`group overflow-hidden rounded-[28px] border border-ink/10 bg-white shadow-[0_8px_30px_rgba(16,50,41,0.07)] transition-shadow hover:shadow-soft ${horizontal ? "sm:grid sm:grid-cols-[230px_minmax(0,1fr)] lg:grid-cols-[290px_minmax(0,1fr)]" : "flex h-full flex-col"}`}
    >
      <div className={`relative min-w-0 bg-sage/40 ${horizontal ? "p-3" : ""}`}>
        <Link
          href={href}
          aria-label={`View ${title}`}
          className={`block overflow-hidden ${
            horizontal
              ? "h-[220px] rounded-[20px] sm:h-[240px]"
              : "h-[190px] sm:h-[205px]"
          }`}
        >
          <PropertyImage
            src={images[0]}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </Link>
        <div className="absolute right-5 top-5">
          <FavoritePropertyButton property={property} compact />
        </div>
        {property.type && (
          <span className="absolute left-5 top-5 inline-flex max-w-[65%] items-center gap-1.5 rounded-full bg-white/95 px-3 py-2 text-[11px] font-bold text-green">
            <Building2 size={14} className="shrink-0" />
            {property.type}
          </span>
        )}
        
      </div>
      <div className="flex min-w-0 flex-1 flex-col p-4">
        <p className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-bold uppercase tracking-wider text-green">
          <span>{property.purpose === "Rent" ? "For rent" : "For sale"}</span>
          {property.status && (
            <span className="text-ink/55">{property.status}</span>
          )}
        </p>
        <Link href={href}>
          <h3 className="mt-2 line-clamp-2 break-words font-serif text-[18px] leading-[1.2] text-ink transition-colors group-hover:text-green">
            {title}
          </h3>
        </Link>
        {project && (
          <p className="mt-1 truncate text-sm text-green">{project}</p>
        )}
        <p className="mt-2 flex items-start gap-2 text-xs leading-5 text-ink/60">
          <MapPin size={15} className="mt-0.5 shrink-0" />
          <span>{property.location || "Location unavailable"}</span>
        </p>
        <div className="my-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <p className="text-[20px] font-bold tracking-tight text-ink">
            {property.price || "Price on request"}
          </p>
          {property.pricePerSqft && (
            <p className="text-xs text-ink/55">{property.pricePerSqft}</p>
          )}
        </div>
        <dl className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-ink/10 py-3">
          {bedrooms > 0 && (
            <Stat icon={BedDouble} label="Bedrooms" value={`${bedrooms} BHK`} />
          )}
          {property.bathrooms > 0 && (
            <Stat
              icon={Bath}
              label="Bathrooms"
              value={`${property.bathrooms} Bath${property.bathrooms > 1 ? "s" : ""}`}
            />
          )}
          {area && (
            <Stat
              icon={Maximize2}
              label={property.areaLabel || "Area"}
              value={area}
            />
          )}
        </dl>
        {(property.furnishing || property.floor) && (
          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink/65">
            {property.furnishing && <span>{property.furnishing}</span>}
            {property.floor && <span>Floor {property.floor}</span>}
          </p>
        )}
        {property.listedOn && (
          <p className="mt-2 text-[10px] text-ink/45">
            Listed {property.listedOn}
          </p>
        )}
      </div>
    </article>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon size={14} className="shrink-0 text-green" />
      <dd className="whitespace-nowrap text-[11px] font-semibold text-ink/70">
        {value}
      </dd>
    </div>
  );
}
