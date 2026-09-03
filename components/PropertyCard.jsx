"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Building2,
  Heart,
  Images,
  MapPin,
  Maximize2,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

export default function PropertyCard({ property }) {
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    if (!property?.id) return;

    const savedProperties = JSON.parse(
      localStorage.getItem("genvilla-saved-properties") || "[]",
    );

    const alreadySaved = savedProperties.some(
      (item) => item.id === property.id,
    );

    setSaved(alreadySaved);
  }, [property?.id]);

  // ==========================================
  // PROPERTY DATA
  // ==========================================

  const id = property?.id || property?._id || property?.slug || "";

  const title = property?.title || property?.name || "Property";

  const image =
    property?.image ||
    property?.imageUrl ||
    property?.thumbnail ||
    property?.images?.[0] ||
    "/placeholder-property.jpg";

  const propertyType = property?.propertyType || property?.type || "Apartment";

  const bhkValue = property?.bhk || property?.bedrooms || 3;

  const bhk = String(bhkValue).toLowerCase().includes("bhk")
    ? bhkValue
    : `${bhkValue} BHK`;

  const price =
    property?.priceFormatted ||
    property?.formattedPrice ||
    property?.price ||
    "Price on request";

  const rawArea =
    property?.areaFormatted || property?.area || property?.size || "—";

  const locality = property?.locality || property?.sector || "";

  const city = property?.city || "";

  const location =
    property?.location ||
    [locality, city].filter(Boolean).join(", ") ||
    "Location unavailable";

  const risk = property?.risk || property?.riskLevel || "Low Risk";

  const rentalYield =
    property?.rentalYield ?? property?.rentalROI ?? property?.roi ?? "—";

  const photoCount = property?.photoCount || property?.images?.length || null;

  const featured = property?.featured === true || property?.isFeatured === true;

  // ==========================================
  // PROPERTY URL
  // ==========================================

  const propertyHref = property?.slug
    ? `/properties/${property.slug}`
    : id
      ? `/properties/${id}`
      : "/properties";

  // ==========================================
  // AREA
  // ==========================================

  let area = "—";

  if (typeof rawArea === "number") {
    area = `${rawArea.toLocaleString("en-IN")} sq.ft.`;
  } else if (rawArea !== "—" && String(rawArea).toLowerCase().includes("sq")) {
    area = rawArea;
  } else if (rawArea !== "—") {
    area = `${rawArea} sq.ft.`;
  }

  // ==========================================
  // RENTAL ROI
  // ==========================================

  let rentalROI = "—";

  if (rentalYield !== "—") {
    const value = String(rentalYield);

    rentalROI = value.includes("%") ? `${value} yield` : `${value}% yield`;
  }

  // ==========================================
  // RISK
  // ==========================================

  const riskText = String(risk).toLowerCase();

  const moderateRisk =
    riskText.includes("moderate") || riskText.includes("medium");

  const highRisk = riskText.includes("high");

  return (
    <article
      className="
        group
        relative
        overflow-hidden
        rounded-[28px]
        border
        border-[#173c30]/10
        bg-white

        shadow-[0_8px_30px_rgba(16,50,41,0.07)]

        transition-all
        duration-500
        ease-out

        hover:-translate-y-2
        hover:border-[#08785a]/25
        hover:shadow-[0_26px_65px_rgba(8,88,65,0.17)]
      "
    >
      {/* ========================================
          IMAGE
      ========================================= */}

      <div
        className="
          relative
          h-[260px]
          overflow-hidden
          sm:h-[280px]
          xl:h-[290px]
        "
      >
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="
            h-full
            w-full
            object-cover

            transition-transform
            duration-700
            ease-out

            group-hover:scale-[1.07]
          "
        />

        {/* Image gradient */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0

            bg-gradient-to-t
            from-black/45
            via-transparent
            to-black/5

            opacity-60

            transition-opacity
            duration-500

            group-hover:opacity-80
          "
        />

        {/* ======================================
            PROPERTY TYPE
        ======================================= */}

        <div
          className="
            absolute
            left-4
            top-4

            inline-flex
            items-center
            gap-2

            rounded-full
            border
            border-white/70
            bg-white/95

            px-3.5
            py-2

            text-[11px]
            font-semibold
            text-[#17352c]

            shadow-sm
            backdrop-blur-xl

            transition-transform
            duration-300

            group-hover:-translate-y-0.5
          "
        >
          <Building2 size={14} className="text-[#08785a]" />

          {propertyType}
        </div>

        {/* ======================================
            WISHLIST BUTTON
        ======================================= */}

        <button
          type="button"
          aria-label={saved ? "Remove saved property" : "Save property"}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();

            const savedProperties = JSON.parse(
              localStorage.getItem("genvilla-saved-properties") || "[]",
            );

            if (saved) {
              // Remove property from saved list
              const updatedProperties = savedProperties.filter(
                (item) => item.id !== property.id,
              );

              localStorage.setItem(
                "genvilla-saved-properties",
                JSON.stringify(updatedProperties),
              );

              setSaved(false);
            } else {
              // Save property
              const alreadySaved = savedProperties.some(
                (item) => item.id === property.id,
              );

              if (!alreadySaved) {
                savedProperties.push(property);

                localStorage.setItem(
                  "genvilla-saved-properties",
                  JSON.stringify(savedProperties),
                );
              }

              setSaved(true);
            }
          }}
          className="
            absolute
            right-4
            top-4

            flex
            h-11
            w-11
            items-center
            justify-center

            rounded-full

            border
            border-white/70

            bg-white/95

            shadow-md
            backdrop-blur-xl

            transition-all
            duration-300

            hover:-translate-y-1
            hover:scale-110
            hover:shadow-lg

            active:scale-90
          "
        >
          <Heart
            size={19}
            className={`
              transition-all
              duration-300

              ${
                saved
                  ? `
                    scale-110
                    fill-[#08785a]
                    text-[#08785a]
                  `
                  : `
                    text-[#17352c]
                  `
              }
            `}
          />
        </button>

        {/* ======================================
            PHOTO COUNT
        ======================================= */}

        {photoCount && (
          <div
            className="
              absolute
              bottom-4
              left-4

              inline-flex
              items-center
              gap-2

              rounded-full

              border
              border-white/10

              bg-black/55

              px-3
              py-1.5

              text-[10px]
              font-medium
              text-white

              backdrop-blur-md
            "
          >
            <Images size={13} />
            {photoCount} Photos
          </div>
        )}

        {/* ======================================
            FEATURED BADGE
        ======================================= */}

        {featured && (
          <div
            className="
              absolute
              bottom-4
              right-4

              rounded-full

              bg-[#08785a]

              px-3
              py-1.5

              text-[9px]
              font-bold
              uppercase
              tracking-[0.12em]
              text-white

              shadow-lg
            "
          >
            ★ Featured
          </div>
        )}
      </div>

      {/* ========================================
          PROPERTY CONTENT
      ========================================= */}

      <div className="p-5 sm:p-6">
        {/* BHK + PRICE */}

        <div
          className="
            flex
            items-start
            justify-between
            gap-4
          "
        >
          <span
            className="
              text-[12px]
              font-bold
              uppercase
              tracking-[0.08em]
              text-[#08785a]
            "
          >
            {bhk}
          </span>

          <span
            className="
              text-right
              text-[18px]
              font-bold
              tracking-tight
              text-[#13231e]
            "
          >
            {price}
          </span>
        </div>

        {/* ======================================
            TITLE
        ======================================= */}

        <Link href={propertyHref} className="block">
          <h3
            className="
              mt-2

              font-serif
              text-[25px]
              leading-tight
              text-[#10251e]

              transition-all
              duration-300

              group-hover:translate-x-1
              group-hover:text-[#08785a]
            "
          >
            {title}
          </h3>
        </Link>

        {/* ======================================
            LOCATION
        ======================================= */}

        <div
          className="
            mt-3
            flex
            items-center
            gap-2

            text-[12px]
            text-[#6c7773]
          "
        >
          <MapPin
            size={15}
            className="
              shrink-0
              text-[#71807b]
            "
          />

          <span className="truncate">{location}</span>
        </div>

        {/* Divider */}

        <div
          className="
            my-5
            h-px
            bg-[#12281f]/10
          "
        />

        {/* ======================================
            PROPERTY STATS
        ======================================= */}

        <div
          className="
            grid
            grid-cols-3
            gap-2
          "
        >
          <PropertyStat icon={Maximize2} value={area} label="Area" />

          <PropertyStat
            icon={ShieldCheck}
            value={risk}
            label="Risk"
            warning={moderateRisk}
            danger={highRisk}
          />

          <PropertyStat
            icon={TrendingUp}
            value={rentalROI}
            label="Rental ROI"
          />
        </div>
      </div>

      {/* ========================================
          VIEW PROPERTY
      ========================================= */}

      <Link
        href={propertyHref}
        className="
          group/link

          flex
          items-center
          justify-between

          border-t
          border-[#11281f]/10

          bg-[#fbfcfa]

          px-6
          py-4

          text-[13px]
          font-bold
          text-[#08785a]

          transition-all
          duration-300

          hover:bg-[#edf7f2]
        "
      >
        <span
          className="
            transition-transform
            duration-300

            group-hover/link:translate-x-1
          "
        >
          View property
        </span>

        <span
          className="
            flex
            h-8
            w-8
            items-center
            justify-center

            rounded-full

            bg-[#edf7f2]

            transition-all
            duration-300

            group-hover/link:bg-[#08785a]
            group-hover/link:text-white
          "
        >
          <ArrowUpRight
            size={16}
            className="
              transition-transform
              duration-300

              group-hover/link:-translate-y-0.5
              group-hover/link:translate-x-0.5
            "
          />
        </span>
      </Link>
    </article>
  );
}

/* =========================================================
   PROPERTY STAT
========================================================= */

function PropertyStat({
  icon: Icon,
  value,
  label,
  warning = false,
  danger = false,
}) {
  return (
    <div
      className="
        group/stat
        min-w-0

        rounded-xl

        p-1

        transition-all
        duration-300

        hover:bg-[#f4f8f5]
      "
    >
      <div
        className="
          flex
          items-center
          gap-2
        "
      >
        {/* ICON */}

        <span
          className={`
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center

            rounded-lg

            transition-all
            duration-300

            group-hover/stat:-translate-y-0.5
            group-hover/stat:scale-110

            ${
              danger
                ? "bg-red-50 text-red-600"
                : warning
                  ? "bg-amber-50 text-amber-600"
                  : "bg-[#edf7f2] text-[#08785a]"
            }
          `}
        >
          <Icon size={15} />
        </span>

        {/* VALUE */}

        <div className="min-w-0">
          <p
            className={`
              truncate
              text-[11px]
              font-bold

              ${
                danger
                  ? "text-red-600"
                  : warning
                    ? "text-amber-600"
                    : "text-[#15271f]"
              }
            `}
          >
            {value}
          </p>

          <p
            className="
              mt-0.5
              text-[9px]
              text-[#7a8581]
            "
          >
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}
