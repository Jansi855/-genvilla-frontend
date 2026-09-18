"use client";
import { assetUrl } from "@/lib/assets";

import HeroPropertyCard from "@/components/HeroPropertyCard";
import Link from "next/link";
import HomePropertySearch from "@/components/HomePropertySearch";
import { useEffect, useRef, useState } from "react";
import {
  ANALYSIS_KEY,
  LOCATION_KEY,
  ANALYSIS_EVENT,
  parseAnalysis,
  writeContext,
} from "@/utils/latestAnalysis";
import { normalizeCity, getPropertyLocationPath } from "@/utils/location";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Building2,
  Check,
  IndianRupee,
  Home,
  MapPin,
  ShieldCheck,
  Sparkles,
  Target,
  WalletCards,
} from "lucide-react";

const cities = ["Gurugram", "Noida", "Ghaziabad", "Sonipat", "New Delhi"];
const propertySlideClassName =
  "w-[82%] shrink-0 snap-start md:w-[44%] xl:w-[30%]";

export default function HeroSection({
  properties = [],
  isLoading = false,
  isError = false,
  onRetry,
}) {
  const [propertyPurpose, setPropertyPurpose] = useState("Buy");

  const filteredProperties = properties.filter(
    (property) => property.purpose === propertyPurpose,
  );
  const carouselRef = useRef(null);
  const scrollProperties = (direction) => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const cardWidth =
      carousel.firstElementChild?.getBoundingClientRect().width || 270;
    const gap =
      Number.parseFloat(window.getComputedStyle(carousel).columnGap) || 0;
    carousel.scrollBy({
      left: direction * (cardWidth + gap),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  };
  const [analysis, setAnalysis] = useState(null);
  const [selectedCity, setSelectedCity] = useState("");
  useEffect(() => {
    const read = () => {
      try {
        setAnalysis(parseAnalysis(window.localStorage.getItem(ANALYSIS_KEY)));
        const context = JSON.parse(
          window.localStorage.getItem(LOCATION_KEY) || "null",
        );
        setSelectedCity(normalizeCity(context?.city));
      } catch {
        setAnalysis(null);
        setSelectedCity("");
      }
    };
    read();
    window.addEventListener("storage", read);
    window.addEventListener(ANALYSIS_EVENT, read);
    window.addEventListener("pageshow", read);
    return () => {
      window.removeEventListener("storage", read);
      window.removeEventListener(ANALYSIS_EVENT, read);
      window.removeEventListener("pageshow", read);
    };
  }, []);
  const metrics = analysis?.metrics;
  const unavailable = "Not enough data";
  return (
    <section className="relative isolate">
      {/* =====================================================
          BACKGROUND VIDEO
      ====================================================== */}
      <video
        poster={assetUrl("/hero/property-amenities.jpg")}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source
          src={
            process.env.NEXT_PUBLIC_PROPERTY_VIDEO_URL ||
            "/hero/property-video.mp4"
          }
          type="video/mp4"
        />
      </video>

      {/* =====================================================
          VIDEO OVERLAY
      ====================================================== */}
      <div className="absolute inset-0 bg-black/15" />

      <div
        className="
          absolute
          inset-0
          bg-gradient-to-r
          from-[#031813]/80
          via-[#031813]/45
          to-[#031813]/10
        "
      />

      <div
        className="
          absolute
          inset-x-0
          bottom-0
          h-[260px]
          bg-gradient-to-t
          from-[#03130f]/70
          to-transparent
        "
      />

      {/* =====================================================
          MAIN HERO
      ====================================================== */}
      <div
        className="
    relative
    z-10
    mx-auto
    grid
    w-full
    max-w-[1450px]
    grid-cols-1
    items-center
    gap-7
    px-4
    pb-5
    pt-5
    sm:px-6
    sm:pt-6
    lg:grid-cols-[1.15fr_1fr]
    lg:gap-8
    lg:px-10
    lg:pt-7
    xl:gap-10
  "
      >
        {/* ===================================================
            LEFT CONTENT
        ==================================================== */}
        <div className="min-w-0 max-w-[690px]">
          {/* TOP BADGE */}
          <div
            className="
              mb-4
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-white/20
              bg-black/20
              px-4
              py-2
              backdrop-blur-md
              transition-all
              duration-300
              hover:-translate-y-1
              hover:bg-white/10
            "
          >
            <Sparkles size={15} strokeWidth={2} className="text-[#73e4b7]" />

            <span
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.22em]
                text-[#d1f2e5]
              "
            >
              Real Estate, Made Clear
            </span>
          </div>

          {/* HEADING */}
          <h1
            className="
  max-w-[650px]
  font-serif
  text-[34px]
  leading-[1.05]
  tracking-[-0.035em]
  text-white
  sm:text-[40px]
  md:text-[44px]
  lg:text-[46px]
  xl:text-[50px]
"
          >
            Find the right property.
            <span className="mt-2 block text-[#a4e3ca]">
              Make the right decision.
            </span>
          </h1>

          {/* DESCRIPTION */}
          <p
            className="
  mt-4
  max-w-[600px]
  text-[14px]
  leading-6
  text-white/80
  sm:text-[15px]
"
          >
            Explore homes across Gurugram, Ghaziabad, Sonipat, Noida and New
            Delhi—then understand what each property really means for your
            finances.
          </p>

          {/* BUTTONS */}
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="#hero-property-search"
              className="
                group
                inline-flex
                items-center
                justify-center
                gap-3
                rounded-xl
                bg-[#07885e]
                px-7
                py-4
                text-sm
                font-semibold
                text-white
                shadow-[0_16px_40px_rgba(0,0,0,0.25)]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:scale-[1.02]
                hover:bg-[#0a9a6b]
                hover:shadow-[0_20px_45px_rgba(0,0,0,0.30)]
                active:scale-[0.98]
              "
            >
              Explore Properties
              <ArrowRight
                size={18}
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />
            </Link>

            <Link
              href="/smart-recommendation"
              className="
              w-full
sm:w-auto
                group
                inline-flex
                items-center
                justify-center
                gap-3
                rounded-xl
                border
                border-white/25
                bg-black/20
                px-7
                py-4
                text-sm
                font-semibold
                text-white
                backdrop-blur-lg
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-white/40
                hover:bg-white/15
                active:scale-[0.98]
              "
            >
              <BarChart3
                size={18}
                className="
                  text-[#91e2c2]
                  transition-transform
                  duration-300
                  group-hover:scale-110
                "
              />
              Analyze a Property
            </Link>
          </div>
        </div>

        {/* ===================================================
            RIGHT SIDE
        ==================================================== */}
        <div
          className="
            relative
            mx-auto
            w-full
            max-w-[590px]
          "
        >
          {/* =================================================
              MAIN ANALYSIS CARD
          ================================================== */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <div
              className="
      w-full
      max-w-[470px]
      rounded-[28px]
      border
      border-[#25c995]/40
      bg-[#062c26]/95
      p-6
      text-white
      shadow-[0_25px_70px_rgba(0,0,0,0.35)]
      backdrop-blur-xl
      sm:p-7
    "
            >
              {/* Header */}
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#29d9a2]/50 bg-[#063c32]">
                  <Sparkles size={22} className="text-[#36e0aa]" />
                </div>

                <h3 className="text-xl font-bold sm:text-2xl">
                  GenVilla Analysis
                </h3>
              </div>

              {/* Insights */}
              <div className="mt-7 grid grid-cols-2 gap-x-6 gap-y-6">
                <div className="flex items-center gap-3">
                  <BarChart3 size={23} className="text-[#36e0aa]" />
                  <span className="text-sm font-medium">Affordability</span>
                </div>

                <div className="flex items-center gap-3">
                  <Home size={23} className="text-[#36e0aa]" />
                  <span className="text-sm font-medium">Rental Yield</span>
                </div>

                <div className="flex items-center gap-3">
                  <ShieldCheck size={23} className="text-[#36e0aa]" />
                  <span className="text-sm font-medium">Risk Insights</span>
                </div>

                <div className="flex items-center gap-3">
                  <Target size={23} className="text-[#36e0aa]" />
                  <span className="text-sm font-medium">Personalized View</span>
                </div>
              </div>

              {/* CTA */}
              <Link
                href="/smart-recommendation"
                className="
        mt-7
        flex
        w-full
        items-center
        justify-center
        gap-3
        rounded-2xl
        bg-[#08a878]
        px-5
        py-4
        text-sm
        font-bold
        text-white
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:bg-[#0abb87]
      "
              >
                Analyze a Property
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div
        className="
    relative
    z-30
    mx-auto
    -mt-1
    w-full
    max-w-[1450px]
    px-4
    pb-4
    sm:px-6
    lg:px-10
  "
      >
        <HomePropertySearch onPurposeChange={setPropertyPurpose} />
      </div>
      {/* POPULAR PROPERTIES */}
      <div className="relative z-10 mx-auto w-full max-w-[1450px] px-4 pb-5 sm:px-6 lg:px-10">
        <section
          aria-labelledby="hero-popular-properties-title"
          aria-busy={isLoading}
          className="w-full rounded-[24px] border border-[#20c997]/30 bg-[#062f27]/85 p-3.5 shadow-[0_18px_50px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:p-4 lg:p-5"
        >
          <div className="mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <div>
              <h2
                id="hero-popular-properties-title"
                className="text-base font-bold text-white sm:text-lg"
              >
                Popular Properties
              </h2>
              <p className="mt-0.5 text-[11px] text-white/65">
                Handpicked properties for you
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/properties"
                className="flex min-h-9 items-center gap-1.5 text-[11px] font-semibold text-[#b6f2da] transition-colors hover:text-white focus-visible:outline-white"
              >
                View All Properties
                <ArrowRight size={13} aria-hidden="true" />
              </Link>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  aria-label="Previous properties"
                  aria-controls="hero-property-carousel"
                  disabled={isLoading || isError || !properties.length}
                  onClick={() => scrollProperties(-1)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition-colors hover:bg-white/15 focus-visible:outline-white disabled:cursor-default disabled:opacity-35"
                >
                  <ArrowLeft size={16} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label="Next properties"
                  aria-controls="hero-property-carousel"
                  disabled={isLoading || isError || !properties.length}
                  onClick={() => scrollProperties(1)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition-colors hover:bg-white/15 focus-visible:outline-white disabled:cursor-default disabled:opacity-35"
                >
                  <ArrowRight size={16} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
          {isLoading ? (
            <div role="status">
              <span className="sr-only">Loading properties…</span>
              <div
                aria-hidden="true"
                className="flex gap-3 overflow-hidden py-1"
              >
                {Array.from({ length: 4 }, (_, index) => (
                  <div
                    key={index}
                    className={`${propertySlideClassName} overflow-hidden rounded-2xl border border-white/15 bg-[#f7faf8] motion-safe:animate-pulse`}
                  >
                    <div className="h-[200px] bg-sage md:h-[210px]" />
                    <div className="p-3">
                      <div className="h-6 w-2/5 rounded bg-sage" />
                      <div className="mt-1 h-5 w-4/5 rounded bg-sage" />
                      <div className="mt-1 h-4 w-3/5 rounded bg-sage" />
                      <div className="mt-2 flex justify-between border-t border-ink/10 pt-2">
                        <div className="h-4 w-1/3 rounded bg-sage" />
                        <div className="h-4 w-1/4 rounded bg-sage" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : isError || !properties.length ? (
            <div
              role="status"
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-6 text-center text-sm text-white/75"
            >
              <p>
                {isError
                  ? "We couldn't load properties"
                  : "No properties available right now. Explore all properties for more options."}
              </p>
              {isError && onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="mt-3 rounded-full border border-white/25 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10 focus-visible:outline-white"
                >
                  Try Again
                </button>
              )}
            </div>
          ) : (
            <ul
              id="hero-property-carousel"
              ref={carouselRef}
              aria-label="Popular properties"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.target !== event.currentTarget) return;
                if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                  event.preventDefault();
                  scrollProperties(event.key === "ArrowLeft" ? -1 : 1);
                }
              }}
              className="flex snap-x snap-mandatory scroll-smooth gap-3 overflow-x-auto overscroll-x-contain rounded-2xl py-1 motion-reduce:scroll-auto [scrollbar-width:none] focus-visible:outline-white [&::-webkit-scrollbar]:hidden"
            >
              {filteredProperties.map((property) => (
                <li
                  key={property.id || property.slug}
                  className={propertySlideClassName}
                >
                  <HeroPropertyCard property={property} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </section>
  );
}

/* =========================================================
   METRIC CARD
========================================================= */

function MetricCard({
  icon: Icon,
  title,
  subtitle,
  value,
  progress,
  risk = false,
  extra,
}) {
  return (
    <div
      className="
        group/metric
        rounded-2xl
        border
        border-white/10
        bg-black/20
        p-4
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-[#40dca3]/30
        hover:bg-black/30
        hover:shadow-[0_12px_30px_rgba(0,0,0,0.20)]
      "
    >
      <div className="flex items-center gap-4">
        {/* ICON */}
        <div
          className="
            flex
            h-12
            w-12
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-white/95
            text-[#07885e]
            shadow-sm
            transition-all
            duration-300
            group-hover/metric:rotate-3
            group-hover/metric:scale-110
          "
        >
          <Icon size={20} />
        </div>

        {/* CONTENT */}
        <div className="min-w-0 flex-1">
          <div
            className="
              flex
              items-start
              justify-between
              gap-4
            "
          >
            <div>
              <p
                className="
                  text-[13px]
                  font-semibold
                  text-white
                "
              >
                {title}
              </p>

              <p
                className="
                  mt-1
                  text-[10px]
                  text-white/45
                "
              >
                {subtitle}
              </p>
            </div>

            <div className="min-w-0 max-w-[50%] break-words text-right">
              <p
                className="
                  text-[19px]
                  font-bold
                  text-[#35d99d]
                "
              >
                {value}
              </p>

              {extra && (
                <p
                  className="
                    mt-0.5
                    text-[9px]
                    text-white/40
                  "
                >
                  {extra}
                </p>
              )}
            </div>
          </div>

          {/* PROGRESS BAR */}
          {progress !== undefined && (
            <div
              className="
                mt-3
                h-[6px]
                overflow-hidden
                rounded-full
                bg-white/15
              "
            >
              <div
                className="
                  h-full
                  rounded-full
                  bg-gradient-to-r
                  from-[#63e3b1]
                  to-[#0ea873]
                  transition-all
                  duration-1000
                  ease-out
                "
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          )}

          {/* RISK INDICATOR */}
          {risk && (
            <div
              className="
                mt-3
                flex
                items-center
                justify-between
              "
            >
              <span
                className="
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-wider
                  text-white/35
                "
              >
                Low risk
              </span>

              <div className="flex gap-1.5">
                <span
                  className="
                    h-2
                    w-5
                    rounded-full
                    bg-[#36d99e]
                    shadow-[0_0_8px_rgba(54,217,158,0.55)]
                  "
                />

                <span className="h-2 w-5 rounded-full bg-white/15" />
                <span className="h-2 w-5 rounded-full bg-white/15" />
                <span className="h-2 w-5 rounded-full bg-white/15" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
