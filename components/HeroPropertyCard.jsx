"use client";

import Link from "next/link";
import { BedDouble, MapPin, Maximize2 } from "lucide-react";
import { formatPropertyArea } from "@/services/properties";
import { FavoritePropertyButton } from "./properties/PropertyActions";
import { PropertyImage } from "./properties/PropertyGallery";

export default function HeroPropertyCard({ property }) {
  const title = property.title || "Property";
  const href = `/properties/${encodeURIComponent(property.slug || property.id)}`;
  const image = property.images?.[0] || property.image;
  const bedrooms = Number.parseInt(property.bedrooms || property.bhk, 10);
  const area = formatPropertyArea(property.areaValue || property.area);
  const badge = property.status || property.type;

  return (
    <article className="group relative h-full overflow-hidden rounded-2xl border border-white/15 bg-[#f7faf8] shadow-sm transition-[transform,border-color] duration-300 hover:border-[#20c997]/60 motion-safe:[@media(hover:hover)]:hover:-translate-y-0.5 motion-reduce:transition-none">
      <Link
        href={href}
        prefetch={false}
        className="block h-full focus-visible:outline-offset-[-3px]"
        aria-label={`View ${title}`}
      >
        <div className="relative h-[200px] overflow-hidden bg-sage md:h-[210px]">
          <PropertyImage
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 motion-safe:[@media(hover:hover)]:group-hover:scale-[1.03] motion-reduce:transition-none"
          />
          {badge && (
            <span className="absolute left-2.5 top-2.5 max-w-[calc(100%-76px)] truncate rounded-full bg-[#062f27]/90 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
              {badge}
            </span>
          )}
        </div>
        <div className="p-3">
          <p className="truncate text-[18px] font-bold leading-6 tracking-tight text-[#075a43]">
            {property.price || "Price on request"}
          </p>
          <h3
            className="mt-1 truncate text-[13px] font-semibold leading-5 text-ink"
            title={title}
          >
            {title}
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-[11px] leading-4 text-ink/60">
            <MapPin size={12} className="shrink-0" aria-hidden="true" />
            <span className="truncate" title={property.location}>
              {property.location || "Location unavailable"}
            </span>
          </p>
          <div className="mt-2 flex min-h-[25px] items-center justify-between gap-2 border-t border-ink/10 pt-2 text-[11px] font-semibold leading-4 text-ink/70">
            {area && (
              <span className="flex min-w-0 items-center gap-1.5">
                <Maximize2
                  size={12}
                  className="shrink-0 text-green"
                  aria-hidden="true"
                />
                <span className="truncate">{area}</span>
              </span>
            )}
            {bedrooms > 0 && (
              <span className="flex shrink-0 items-center gap-1.5">
                <BedDouble
                  size={13}
                  className="text-green"
                  aria-hidden="true"
                />
                {bedrooms} BHK
              </span>
            )}
          </div>
        </div>
      </Link>
      {property.id != null && (
        <div className="absolute right-2 top-2">
          <FavoritePropertyButton property={property} compact />
        </div>
      )}
    </article>
  );
}
