"use client";
import { assetUrl } from "@/lib/assets";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import * as Icons from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import PropertyCard from "@/components/PropertyCard";
import RecommendationPreview from "@/components/RecommendationPreview";

import { getHomeData } from "@/services/home";
import { cities, tools } from "@/data/home";
import { getPropertyLocationPath } from "@/utils/location";

export default function HomePage() {
  const [city, setCity] = useState(cities[0]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["home", city],
    queryFn: () => getHomeData(city),
  });

  const visible = data?.featuredProperties?.slice(0, 3) || [];

  return (
    <>
      <Navbar />

      <main>
        {/* =========================
            HERO SECTION
        ========================= */}

        <HeroSection />

        <section className="bg-[#fbfcf9] px-5 pb-8 lg:px-10" aria-labelledby="explore-by-city">
          <div className="mx-auto max-w-[1280px] rounded-[24px] border border-[#173c30]/10 bg-white px-5 py-5 shadow-sm">
            <h2 id="explore-by-city" className="font-serif text-2xl text-[#10241e]">Explore properties by city</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {cities.map((cityName) => (
                <Link className="rounded-full border border-[#173c30]/10 bg-[#f4f1e9] px-4 py-2 text-sm font-bold text-[#173c30]/70 transition hover:border-[#08785a] hover:text-[#08785a]" href={getPropertyLocationPath({city:cityName})} key={cityName}>
                  {cityName}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* =========================
            EXPLORE PROPERTIES
        ========================= */}

        <Section className="relative overflow-hidden bg-[#fbfcf9]">
          {/* Decorative dots */}
          <div
            className="pointer-events-none absolute right-[14%] top-20 hidden h-24 w-24 opacity-30 lg:block"
            style={{
              backgroundImage:
                "radial-gradient(#0b7657 1.3px, transparent 1.3px)",
              backgroundSize: "12px 12px",
            }}
          />

          {/* Section Header */}
          <div className="mb-10 flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#70ac8f]" />

                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#08785a]">
                  Curated For You
                </p>
              </div>

              <h2 className="mt-4 font-serif text-[46px] leading-[0.95] tracking-[-0.035em] text-[#10241e] sm:text-[56px] lg:text-[64px]">
                Explore properties
              </h2>

              <p className="mt-4 text-[15px] text-[#77817e]">
                Shortlist homes with the essential numbers already in view.
              </p>
            </div>

            <Link
              href="/properties"
              className="group inline-flex items-center gap-2 text-sm font-bold text-[#08785a] transition-all duration-300 hover:-translate-y-0.5"
            >
              See all properties
              <Icons.ArrowUpRight
                size={16}
                className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </Link>
          </div>

          {/* City Filters */}
          <div className="mb-10 flex flex-wrap items-center gap-3">
            {cities.map((cityName) => (
              <button
                key={cityName}
                type="button"
                onClick={() => setCity(cityName)}
                className={`group inline-flex items-center gap-2.5 rounded-full border px-5 py-3 text-[13px] font-semibold shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md active:scale-[0.97] ${
                  city === cityName
                    ? "border-[#08785a] bg-[#08785a] text-white shadow-[0_10px_25px_rgba(8,120,90,0.20)]"
                    : "border-[#142a21]/8 bg-white text-[#4e5b56] hover:border-[#08785a]/20 hover:text-[#08785a]"
                }`}
              >
                <Icons.MapPin
                  size={15}
                  className="transition-transform duration-300 group-hover:scale-110"
                />

                {cityName}
              </button>
            ))}
          </div>

          {/* Properties */}
          {isLoading ? (
            <Skeleton />
          ) : isError ? (
            <State
              title="We couldn’t load properties"
              action="Try again"
              onClick={refetch}
            />
          ) : visible.length ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {visible.map((property, index) => (
                <div
                  key={property.id}
                  className="property-card-reveal"
                  style={{
                    animationDelay: `${index * 120}ms`,
                  }}
                >
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          ) : (
            <State
              title={`No properties found in ${city}`}
              action="Explore all"
              href="/properties"
            />
          )}

          {/* Carousel dots */}
          {visible.length > 0 && (
            <div className="mt-7 flex items-center justify-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#d5ddd9]" />
              <span className="h-2 w-6 rounded-full bg-[#08785a]" />
              <span className="h-2 w-2 rounded-full bg-[#d5ddd9]" />
            </div>
          )}

          {/* Demo warning */}
          {data?.demo && (
            <div className="mt-7 flex items-center gap-2 text-[11px] text-[#8a9490]">
              <Icons.Info size={15} />

              <p>
                Preview listings shown for product demonstration. Availability
                and prices are illustrative.
              </p>
            </div>
          )}

          {/* Smart Recommendation CTA */}
          <div className="group relative mt-10 overflow-hidden rounded-[26px] border border-[#08785a]/10 bg-gradient-to-r from-[#edf8f3] via-[#f8fbf8] to-[#eef7f1] px-6 py-7 shadow-[0_10px_35px_rgba(12,71,53,0.05)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(12,71,53,0.10)] md:px-8">
            {/* Background Glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#70d0a8]/15 blur-[60px] transition-all duration-700 group-hover:scale-125" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#08785a] text-white shadow-[0_10px_30px_rgba(8,120,90,0.22)] transition-all duration-500 group-hover:-rotate-3 group-hover:scale-110">
                  <Icons.BarChart3 size={26} />
                </div>

                <div>
                  <h3 className="font-serif text-[25px] text-[#12251f]">
                    Not sure where to start?
                  </h3>

                  <p className="mt-1 text-[13px] text-[#6c7974]">
                    Get smart property recommendations tailored to your budget
                    and goals.
                  </p>
                </div>
              </div>

              <Link
                href="/smart-recommendation"
                className="group/button inline-flex items-center justify-center gap-3 rounded-full bg-[#075a43] px-7 py-4 text-[13px] font-bold text-white shadow-[0_12px_28px_rgba(7,90,67,0.20)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#08785a] hover:shadow-[0_16px_35px_rgba(7,90,67,0.28)]"
              >
                <Icons.Sparkles
                  size={16}
                  className="transition-transform duration-300 group-hover/button:rotate-12 group-hover/button:scale-110"
                />
                Get smart recommendations
                <Icons.ArrowUpRight
                  size={16}
                  className="transition-transform duration-300 group-hover/button:-translate-y-1 group-hover/button:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </Section>

        {/* =========================
            SMART DECISION
        ========================= */}

        <Section className="bg-cream !pb-10">
          <div className="grid items-start gap-12 lg:grid-cols-[.72fr_1.28fr]">
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow">DECIDE WITH CONTEXT</p>

              <h2 className="section-title mt-4">
                Your property.
                <br />
                Your finances.
                <br />
                <em>Your decision.</em>
              </h2>

              <p className="mt-6 max-w-md leading-7 text-ink/60">
                We bring the price, total cost, EMI, rental potential and risk
                into one clear view—then explain what points toward buy, wait or
                avoid.
              </p>
              {/* Decision badges */}
              <div className="mt-8 flex flex-wrap gap-4">
                {/* BUY */}
                <div className="group flex items-center gap-3 rounded-full border border-emerald-300 bg-emerald-50/80 px-5 py-2.5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <Icons.Sparkles size={14} />
                  </span>

                  <span className="h-5 w-px bg-emerald-300" />

                  <span className="text-xs font-bold tracking-[0.08em] text-emerald-700">
                    BUY
                  </span>
                </div>

                {/* WAIT */}
                <div className="group flex items-center gap-3 rounded-full border border-amber-300 bg-amber-50/80 px-5 py-2.5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-amber-500">
                    <Icons.Sparkles size={14} />
                  </span>

                  <span className="h-5 w-px bg-amber-300" />

                  <span className="text-xs font-bold tracking-[0.08em] text-amber-700">
                    WAIT
                  </span>
                </div>

                {/* AVOID */}
                <div className="group flex items-center gap-3 rounded-full border border-red-300 bg-red-50/80 px-5 py-2.5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-100 text-red-500">
                    <Icons.Sparkles size={14} />
                  </span>

                  <span className="h-5 w-px bg-red-300" />

                  <span className="text-xs font-bold tracking-[0.08em] text-red-600">
                    AVOID
                  </span>
                </div>
              </div>

              {/* Property image */}
              <div className="group relative mt-10 overflow-hidden rounded-[28px] border border-ink/5 bg-white shadow-[0_15px_40px_rgba(20,50,40,0.08)]">
                <img
                  src={assetUrl("/hero/property-lifestyle.png")}
                  alt="Modern residential property"
                  className="h-[180px] w-full object-cover object-center opacity-75 transition-all duration-700 group-hover:scale-105 group-hover:opacity-90"
                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#f7f4ec] via-[#f7f4ec]/10 to-transparent" />

                <div className="absolute bottom-4 left-4 z-10 rounded-full border border-white/50 bg-white/85 px-4 py-2 text-[11px] font-semibold text-[#315348] shadow-sm backdrop-blur-md">
                  Smarter property decisions
                </div>
              </div>
            </div>

            <RecommendationPreview />
          </div>
        </Section>

        {/* =========================
            FINANCIAL TOOLS
        ========================= */}

        <Section className="bg-white">
          <SectionHead
            eyebrow="FINANCIAL TOOLKIT"
            title="Popular tools"
            text={`Turn a ${city} listing into numbers you can act on.`}
            action={["View all calculators", "/calculators"]}
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map(([icon, title, text, href]) => {
              const Icon = Icons[icon];

              const categories = {
                "EMI Calculator": {
                  label: "LOAN",
                  className:
                    "border-emerald-200 bg-emerald-50 text-emerald-700",
                },

                "True Cost Calculator": {
                  label: "COST",
                  className: "border-cyan-200 bg-cyan-50 text-cyan-700",
                },

                "Affordability Check": {
                  label: "BUDGET",
                  className: "border-amber-200 bg-amber-50 text-amber-700",
                },

                "Rental ROI Calculator": {
                  label: "RETURNS",
                  className: "border-blue-200 bg-blue-50 text-blue-700",
                },

                "Risk Analysis": {
                  label: "RISK",
                  className: "border-violet-200 bg-violet-50 text-violet-700",
                },

                "Buy vs Rent": {
                  label: "COMPARE",
                  className: "border-teal-200 bg-teal-50 text-teal-700",
                },
              };

              const category = categories[title];

              if (!Icon) {
                return null;
              }

              return (
                <Link
                  key={title}
                  href={href}
                  className="group relative min-h-[230px] overflow-hidden rounded-[26px] border border-ink/10 bg-white p-6 shadow-[0_8px_30px_rgba(16,39,33,0.05)] transition-all duration-500 hover:-translate-y-2 hover:border-[#16835e]/40 hover:shadow-[0_22px_55px_rgba(16,90,65,0.13)]"
                >
                  {/* Recommended badge */}
                  {title === "Affordability Check" && (
                    <div className="absolute right-0 top-0 z-20 rounded-bl-[18px] bg-[#08785a] px-5 py-2 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                      Recommended
                    </div>
                  )}

                  {/* Background glow */}
                  <div
                    className={`pointer-events-none absolute -bottom-20 -right-20 h-52 w-52 rounded-full blur-3xl transition-all duration-700 group-hover:scale-125 ${
                      title === "EMI Calculator"
                        ? "bg-emerald-100/50 group-hover:bg-emerald-100/80"
                        : title === "True Cost Calculator"
                          ? "bg-cyan-100/50 group-hover:bg-cyan-100/80"
                          : title === "Affordability Check"
                            ? "bg-amber-100/50 group-hover:bg-amber-100/80"
                            : title === "Rental ROI Calculator"
                              ? "bg-blue-100/50 group-hover:bg-blue-100/80"
                              : title === "Risk Analysis"
                                ? "bg-violet-100/50 group-hover:bg-violet-100/80"
                                : "bg-teal-100/50 group-hover:bg-teal-100/80"
                    }`}
                  />
                  <div className="relative z-10 flex h-full flex-col">
                    {/* Top content */}
                    <div className="flex items-start gap-5">
                      {/* Icon */}
                      <div
                        className={`flex h-[62px] w-[62px] shrink-0 items-center justify-center rounded-[20px] shadow-[0_8px_20px_rgba(8,120,90,0.08)] transition-all duration-500 group-hover:-rotate-3 group-hover:scale-110 group-hover:text-white ${
                          title === "EMI Calculator"
                            ? "bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600"
                            : title === "True Cost Calculator"
                              ? "bg-cyan-50 text-cyan-700 group-hover:bg-cyan-600"
                              : title === "Affordability Check"
                                ? "bg-amber-50 text-amber-700 group-hover:bg-amber-500"
                                : title === "Rental ROI Calculator"
                                  ? "bg-blue-50 text-blue-700 group-hover:bg-blue-600"
                                  : title === "Risk Analysis"
                                    ? "bg-violet-50 text-violet-700 group-hover:bg-violet-600"
                                    : "bg-teal-50 text-teal-700 group-hover:bg-teal-600"
                        }`}
                      >
                        <Icon size={25} strokeWidth={1.8} />
                      </div>

                      {/* Category + title + description */}
                      <div className="pt-1">
                        {category && (
                          <span
                            className={`mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] ${category.className}`}
                          >
                            <Icons.Sparkles size={11} strokeWidth={2.2} />
                            {category.label}
                          </span>
                        )}

                        <b className="block font-serif text-[24px] leading-tight text-[#10241e] transition-colors duration-300 group-hover:text-[#08785a]">
                          {title}
                        </b>

                        <p className="mt-3 max-w-[240px] text-[14px] leading-6 text-ink/55">
                          {text}
                        </p>
                      </div>
                    </div>

                    {/* Mini visual */}
                    <div className="mt-6 h-10">
                      {title === "EMI Calculator" && (
                        <div className="flex h-full items-end gap-1.5 opacity-60 transition-all duration-500 group-hover:opacity-100">
                          {[30, 42, 55, 68, 82, 95].map((height, index) => (
                            <span
                              key={index}
                              className="w-1.5 rounded-full bg-emerald-500"
                              style={{ height: `${height / 3}px` }}
                            />
                          ))}
                        </div>
                      )}

                      {title === "True Cost Calculator" && (
                        <div className="flex h-full items-center gap-2 opacity-60 transition-all duration-500 group-hover:opacity-100">
                          <span className="h-2 w-10 rounded-full bg-cyan-200" />
                          <span className="h-2 w-14 rounded-full bg-cyan-400" />
                          <span className="h-2 w-8 rounded-full bg-cyan-600" />
                        </div>
                      )}

                      {title === "Affordability Check" && (
                        <div className="flex h-full items-center gap-3 opacity-60 transition-all duration-500 group-hover:opacity-100">
                          <div className="h-9 w-9 rounded-full border-[5px] border-amber-200 border-r-amber-500" />
                          <span className="text-xs font-bold text-amber-700">
                            Budget fit
                          </span>
                        </div>
                      )}

                      {title === "Rental ROI Calculator" && (
                        <div className="flex h-full items-end gap-1.5 opacity-60 transition-all duration-500 group-hover:opacity-100">
                          {[35, 48, 40, 62, 76, 92].map((height, index) => (
                            <span
                              key={index}
                              className="w-1.5 rounded-full bg-blue-500"
                              style={{ height: `${height / 3}px` }}
                            />
                          ))}
                        </div>
                      )}

                      {title === "Risk Analysis" && (
                        <div className="flex h-full items-center gap-2 opacity-60 transition-all duration-500 group-hover:opacity-100">
                          <span className="h-2 w-16 rounded-full bg-violet-200">
                            <span className="block h-full w-2/3 rounded-full bg-violet-500" />
                          </span>

                          <span className="text-xs font-bold text-violet-700">
                            Risk level
                          </span>
                        </div>
                      )}

                      {title === "Buy vs Rent" && (
                        <div className="flex h-full items-end gap-2 opacity-60 transition-all duration-500 group-hover:opacity-100">
                          <div className="flex items-end gap-1">
                            <span className="h-5 w-2 rounded-full bg-teal-300" />
                            <span className="h-8 w-2 rounded-full bg-teal-600" />
                          </div>

                          <span className="text-xs font-bold text-teal-700">
                            Compare
                          </span>
                        </div>
                      )}
                    </div>
                    {/* Bottom action */}
                    <div className="mt-auto flex items-center justify-between pt-6">
                      <span className="inline-flex items-center gap-2 text-[14px] font-bold text-[#08785a]">
                        Use tool
                        <Icons.ArrowRight
                          size={17}
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </span>

                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e7f5eb] text-[#08785a] shadow-sm transition-all duration-300 group-hover:rotate-45 group-hover:scale-110 group-hover:bg-[#08785a] group-hover:text-white">
                        <Icons.ArrowUpRight size={19} />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </Section>
        {/* =========================
    HOW GENVILLA WORKS
========================= */}

        <Section className="bg-[#fbfaf6]">
          <SectionHead
            eyebrow="A BETTER BUYING PROCESS"
            title="How GenVilla works"
            text="From discovering the right property to making the final decision, GenVilla helps you understand every step clearly."
          />

          <div className="relative mt-10">
            <div className="relative z-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  number: "01",
                  title: "FIND",
                  image: assetUrl("/how-it-works/find-property.jpg"),

                  text: "Explore verified properties across your city and find the one that fits your needs.",

                  benefit: "Right property, right location",

                  benefitIcon: Icons.MapPin,

                  accent: "#08785a",
                  cornerBg: "linear-gradient(135deg, #dff2e3 0%, #eef8ef 100%)",
                  benefitBg: "#edf8ef",
                },

                {
                  number: "02",
                  title: "COST",
                  image: assetUrl("/how-it-works/calculate-cost.jpeg"),

                  text: "Calculate the true cost with all charges, taxes, and hidden costs included.",

                  benefit: "No surprises, total clarity",

                  benefitIcon: Icons.IndianRupee,

                  accent: "#0d8c88",
                  cornerBg: "linear-gradient(135deg, #d9f0ed 0%, #edf9f7 100%)",
                  benefitBg: "#e9f7f5",
                },

                {
                  number: "03",
                  title: "ANALYZE",
                  image: assetUrl("/how-it-works/analyze-property.jfif"),

                  text: "Check affordability, ROI, and risk to understand if it’s the right move.",

                  benefit: "Data-backed insights",

                  benefitIcon: Icons.ShieldCheck,

                  accent: "#d99b0b",
                  cornerBg: "linear-gradient(135deg, #ffedc1 0%, #fff7e4 100%)",
                  benefitBg: "#fff6df",
                },

                {
                  number: "04",
                  title: "DECIDE",
                  image: assetUrl("/how-it-works/smart-decision.jfif"),

                  text: "Get a smart recommendation — buy, wait, or avoid with confidence.",

                  benefit: "Make the right decision",

                  benefitIcon: Icons.BadgeCheck,

                  accent: "#08785a",
                  cornerBg: "linear-gradient(135deg, #dff2e3 0%, #eef8ef 100%)",
                  benefitBg: "#edf8ef",
                },
              ].map((step, index) => {
                const BenefitIcon = step.benefitIcon;

                return (
                  <div
                    key={step.title}
                    className="
              group
              relative
              min-h-[590px]
              overflow-visible
              rounded-[28px]
              border
              border-[#173c30]/10
              bg-white
              px-5
              pb-6
              pt-6
              shadow-[0_12px_35px_rgba(18,55,43,0.07)]
              transition-all
              duration-500
              hover:-translate-y-2
              hover:shadow-[0_24px_55px_rgba(18,55,43,0.13)]
            "
                  >
                    {/* Corner decoration */}
                    <div
                      className="pointer-events-none absolute left-0 top-0 h-[125px] w-[125px] rounded-tl-[28px]"
                      style={{
                        background: step.cornerBg,
                        clipPath: "polygon(0 0, 100% 0, 0 100%)",
                      }}
                    />

                    {/* Number */}
                    <div
                      className="
                relative
                z-20
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-full
                text-base
                font-extrabold
                text-white
                shadow-lg
              "
                      style={{
                        backgroundColor: step.accent,
                      }}
                    >
                      {step.number}
                    </div>

                    {/* Photo */}
                    <div
                      className="
                group/image
                relative
                mt-6
                h-[210px]
                w-full
                overflow-hidden
                rounded-[24px]
              "
                    >
                      <img
                        src={step.image}
                        alt={`${step.title} property step`}
                        className="
                  h-full
                  w-full
                  object-cover
                  object-center
                  transition-transform
                  duration-700
                  group-hover/image:scale-105
                "
                      />

                      {/* Light overlay */}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />

                      {/* Small label */}
                      <div className="absolute bottom-4 left-4 rounded-full border border-white/30 bg-white/90 px-3 py-1.5 shadow-md backdrop-blur-md">
                        <span
                          className="text-[9px] font-extrabold uppercase tracking-[0.12em]"
                          style={{
                            color: step.accent,
                          }}
                        >
                          Step {step.number}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3
                      className="
                mt-7
                text-center
                font-serif
                text-3xl
                font-bold
              "
                      style={{
                        color: step.accent,
                      }}
                    >
                      {step.title}
                    </h3>

                    {/* Dots */}
                    <div className="mt-3 flex justify-center gap-1.5">
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: step.accent }}
                      />
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: step.accent }}
                      />
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: step.accent }}
                      />
                    </div>

                    {/* Description */}
                    <p className="mx-auto mt-5 max-w-[280px] text-center text-sm leading-6 text-[#173c30]/70">
                      {step.text}
                    </p>

                    {/* Benefit */}
                    <div
                      className="
                mt-6
                flex
                items-center
                gap-3
                rounded-[20px]
                px-4
                py-4
              "
                      style={{
                        backgroundColor: step.benefitBg,
                      }}
                    >
                      <div
                        className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  text-white
                "
                        style={{
                          backgroundColor: step.accent,
                        }}
                      >
                        <BenefitIcon size={18} />
                      </div>

                      <p className="text-sm font-semibold text-[#173c30]">
                        {step.benefit}
                      </p>
                    </div>

                    {/* Connecting arrow */}
                    {index !== 3 && (
                      <div
                        className="
                  absolute
                  -right-[29px]
                  top-[240px]
                  z-30
                  hidden
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-full
                  bg-[#08785a]
                  text-white
                  shadow-[0_10px_30px_rgba(8,120,90,0.25)]
                  xl:flex
                "
                      >
                        <Icons.ArrowRight size={21} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom trust strip */}
            <div
              className="
        mt-8
        grid
        gap-4
        rounded-[26px]
        border
        border-[#173c30]/10
        bg-white
        p-5
        shadow-[0_10px_30px_rgba(18,55,43,0.05)]
        sm:grid-cols-2
        lg:grid-cols-4
      "
            >
              {[
                {
                  icon: Icons.Sparkles,
                  title: "Smart & Simple",
                  text: "Easy-to-understand property decisions",
                },
                {
                  icon: Icons.BadgeCheck,
                  title: "100% Transparent",
                  text: "Clear numbers without hidden surprises",
                },
                {
                  icon: Icons.ShieldCheck,
                  title: "Secure & Private",
                  text: "Your personal data stays protected",
                },
                {
                  icon: Icons.Headphones,
                  title: "Always Here",
                  text: "Support when you need it",
                },
              ].map((item) => {
                const TrustIcon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="
              group
              flex
              items-center
              gap-4
              rounded-[18px]
              px-4
              py-4
              transition-all
              duration-300
              hover:bg-[#f5faf7]
            "
                  >
                    <div
                      className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-[#edf8ef]
                text-[#08785a]
                transition-transform
                duration-300
                group-hover:scale-110
              "
                    >
                      <TrustIcon size={19} />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-[#173c30]">
                        {item.title}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-[#173c30]/55">
                        {item.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Section>
        {/* =========================
    SELL PROPERTY
========================= */}

        <Section className="bg-white">
          <div className="group relative overflow-hidden rounded-[34px] bg-[#0b4938] px-6 py-7 shadow-[0_24px_70px_rgba(11,73,56,0.18)] transition-all duration-700 hover:-translate-y-1 hover:shadow-[0_34px_90px_rgba(11,73,56,0.25)] md:px-8 md:py-9 lg:px-10 lg:py-10">
            {/* Background decoration */}
            <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-emerald-300/5 blur-3xl transition-all duration-1000 group-hover:scale-125" />

            <div className="pointer-events-none absolute -bottom-32 left-[30%] h-80 w-80 rounded-full bg-emerald-200/5 blur-3xl transition-all duration-1000 group-hover:scale-125" />

            <div className="relative z-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              {/* =========================
          LEFT SIDE
      ========================= */}

              <div className="flex flex-col justify-center px-2 py-3 md:px-4 lg:px-2">
                {/* Eyebrow */}
                <div className="flex items-center gap-4">
                  <span className="text-[12px] font-extrabold uppercase tracking-[0.2em] text-[#9ad5b9]">
                    For Property Owners
                  </span>

                  <span className="h-px w-14 bg-[#78c69f]/70 transition-all duration-500 group-hover:w-20" />
                </div>

                {/* Heading */}
                <h2 className="mt-6 max-w-[560px] font-serif text-[48px] leading-[1.02] tracking-[-0.035em] text-white sm:text-[58px] lg:text-[66px]">
                  Have a property
                  <br />
                  to <span className="text-[#aee6c7]">sell?</span>
                </h2>

                {/* Description */}
                <p className="mt-6 max-w-[560px] text-[16px] leading-8 text-white/70">
                  List your property on GenVilla and connect with serious buyers
                  across all five launch cities.
                </p>

                {/* Benefits */}
                <div className="mt-9 grid gap-5 sm:grid-cols-3">
                  {/* Verified Buyers */}
                  <div className="group/benefit">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[16px] border border-white/10 bg-white/8 text-[#9ae2be] transition-all duration-500 group-hover/benefit:-rotate-3 group-hover/benefit:scale-110 group-hover/benefit:bg-[#9ae2be] group-hover/benefit:text-[#0b4938]">
                      <Icons.Users size={23} />
                    </div>

                    <h3 className="mt-4 text-[14px] font-bold text-white transition-colors duration-300 group-hover/benefit:text-[#b7ecd0]">
                      Verified Buyers
                    </h3>

                    <p className="mt-2 text-[12px] leading-5 text-white/55">
                      Connect with genuine and serious buyers.
                    </p>
                  </div>

                  {/* Easy Listing */}
                  <div className="group/benefit">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[16px] border border-white/10 bg-white/8 text-[#9ae2be] transition-all duration-500 group-hover/benefit:-rotate-3 group-hover/benefit:scale-110 group-hover/benefit:bg-[#9ae2be] group-hover/benefit:text-[#0b4938]">
                      <Icons.ClipboardList size={23} />
                    </div>

                    <h3 className="mt-4 text-[14px] font-bold text-white transition-colors duration-300 group-hover/benefit:text-[#b7ecd0]">
                      Easy Listing
                    </h3>

                    <p className="mt-2 text-[12px] leading-5 text-white/55">
                      List in minutes with a simple and secure flow.
                    </p>
                  </div>

                  {/* Lead Tracking */}
                  <div className="group/benefit">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[16px] border border-white/10 bg-white/8 text-[#9ae2be] transition-all duration-500 group-hover/benefit:-rotate-3 group-hover/benefit:scale-110 group-hover/benefit:bg-[#9ae2be] group-hover/benefit:text-[#0b4938]">
                      <Icons.BarChart3 size={23} />
                    </div>

                    <h3 className="mt-4 text-[14px] font-bold text-white transition-colors duration-300 group-hover/benefit:text-[#b7ecd0]">
                      Lead Tracking
                    </h3>

                    <p className="mt-2 text-[12px] leading-5 text-white/55">
                      Track views, leads and conversations in real time.
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="my-8 h-px bg-white/10" />

                {/* Safety Line */}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-[13px] font-semibold text-white/80">
                  <span className="inline-flex items-center gap-2">
                    <Icons.ShieldCheck size={18} className="text-[#8fdab3]" />
                    100% Safe & Secure
                  </span>

                  <span className="h-1 w-1 rounded-full bg-white/40" />

                  <span>No Spam</span>

                  <span className="h-1 w-1 rounded-full bg-white/40" />

                  <span>Full Privacy</span>
                </div>

                {/* CTA */}
                <div className="mt-9 flex flex-col gap-5 sm:flex-row sm:items-center">
                  <Link
                    href="/sell"
                    className="group/button inline-flex items-center justify-center gap-3 rounded-[18px] bg-[#f6fbf7] px-7 py-4 text-[15px] font-bold text-[#0c4938] shadow-[0_12px_28px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_35px_rgba(0,0,0,0.16)]"
                  >
                    List your property
                    <Icons.ArrowUpRight
                      size={18}
                      className="transition-transform duration-300 group-hover/button:-translate-y-1 group-hover/button:translate-x-1"
                    />
                  </Link>

                  <span className="text-[14px] font-semibold text-[#9cd7b9] transition-all duration-300 group-hover:translate-x-1">
                    It’s free and easy →
                  </span>
                </div>
              </div>

              {/* =========================
          RIGHT SIDE
      ========================= */}

              <div className="rounded-[28px] bg-[#f8f6ef] p-5 shadow-[0_20px_45px_rgba(0,0,0,0.10)] transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_28px_60px_rgba(0,0,0,0.14)] md:p-6">
                {/* Top Header */}
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-extrabold uppercase tracking-[0.15em] text-[#29463c]">
                    Listing Preview
                  </span>

                  <span className="inline-flex items-center gap-2 rounded-full bg-[#e4efe7] px-4 py-2 text-[11px] font-bold uppercase text-[#08785a]">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-[#2eb67d]" />
                    Active
                  </span>
                </div>

                {/* Property Info */}
                <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-center">
                  {/* Image */}
                  <div className="relative h-[115px] w-full overflow-hidden rounded-[18px] sm:w-[145px]">
                    <img
                      src={assetUrl("/hero/property-lifestyle.png")}
                      alt="Palm Grove Residence"
                      className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <h3 className="font-serif text-[24px] text-[#17352b]">
                      Palm Grove Residence
                    </h3>

                    <p className="mt-2 flex items-center gap-2 text-[13px] text-[#68756f]">
                      <Icons.MapPin size={15} />
                      Sector 57, Gurugram
                    </p>

                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[12px] text-[#52615b]">
                      <span>3 BHK</span>
                      <span>•</span>
                      <span>1,850 sq.ft</span>
                      <span>•</span>
                      <span>Ready to Move</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="sm:text-right">
                    <b className="text-[22px] text-[#10241e]">₹ 2.85 Cr</b>

                    <p className="mt-1 text-[12px] font-medium text-[#08785a]">
                      Negotiable
                    </p>
                  </div>
                </div>

                {/* Metrics */}
                <div className="mt-7 grid overflow-hidden rounded-[20px] bg-white shadow-[0_8px_24px_rgba(18,55,43,0.05)] sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    {
                      icon: Icons.Eye,
                      value: "1,248",
                      label: "Views",
                    },

                    {
                      icon: Icons.Users,
                      value: "86",
                      label: "Leads",
                    },

                    {
                      icon: Icons.MessageSquare,
                      value: "24",
                      label: "Messages",
                    },

                    {
                      icon: Icons.ClipboardList,
                      value: "1",
                      label: "Active Listing",
                    },
                  ].map((metric, index) => {
                    const MetricIcon = metric.icon;

                    return (
                      <div
                        key={metric.label}
                        className={`group/metric flex flex-col items-center justify-center px-4 py-5 transition-all duration-300 hover:bg-[#f5faf7] ${
                          index !== 3 ? "lg:border-r lg:border-[#17352b]/8" : ""
                        }`}
                      >
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ebf5ed] text-[#08785a] transition-all duration-300 group-hover/metric:scale-110 group-hover/metric:bg-[#08785a] group-hover/metric:text-white">
                          <MetricIcon size={20} />
                        </div>

                        <b className="mt-3 text-[22px] text-[#10241e] transition-transform duration-300 group-hover/metric:scale-105">
                          {metric.value}
                        </b>

                        <span className="mt-1 text-[12px] text-[#75817c]">
                          {metric.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Insights */}
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {/* Leads This Week */}
                  <div className="rounded-[18px] bg-white p-4 shadow-[0_8px_22px_rgba(18,55,43,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(18,55,43,0.10)]">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-semibold text-[#31483f]">
                        Leads this week
                      </span>

                      <span className="rounded-full bg-[#e9f6ed] px-3 py-1 text-[11px] font-bold text-[#16835e]">
                        ↑ 35%
                      </span>
                    </div>

                    {/* Mini Graph */}
                    <div className="mt-5 flex h-[70px] items-end gap-2">
                      {[28, 42, 35, 54, 66, 48, 58, 72].map((height, index) => (
                        <span
                          key={index}
                          className="flex-1 rounded-t-full bg-[#7ccfa3]/60 transition-all duration-300 hover:scale-y-110 hover:bg-[#16835e]"
                          style={{
                            height: `${height}%`,
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Top Source */}
                  <div className="rounded-[18px] bg-white p-4 shadow-[0_8px_22px_rgba(18,55,43,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(18,55,43,0.10)]">
                    <span className="text-[13px] font-semibold text-[#31483f]">
                      Top Source
                    </span>

                    <div className="mt-5 flex items-center justify-between">
                      <b className="text-[15px] text-[#17352b]">
                        GenVilla Search
                      </b>

                      <span className="text-[13px] font-bold text-[#17352b]">
                        62%
                      </span>
                    </div>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#dfe9e3]">
                      <div className="h-full w-[62%] rounded-full bg-[#16835e] transition-all duration-700 hover:w-[70%]" />
                    </div>
                  </div>
                </div>

                {/* Privacy Strip */}
                <div className="group/privacy mt-5 flex items-center gap-4 rounded-[18px] bg-[#e8f3e9] px-5 py-4 transition-all duration-300 hover:-translate-y-1 hover:bg-[#dff0e3]">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-[#08785a] transition-all duration-300 group-hover/privacy:rotate-6 group-hover/privacy:scale-110 group-hover/privacy:bg-[#08785a] group-hover/privacy:text-white">
                    <Icons.ShieldCheck size={24} />
                  </div>

                  <div>
                    <b className="text-[14px] text-[#14382c]">
                      Your property. Your control.
                    </b>

                    <p className="mt-1 text-[12px] text-[#607169]">
                      You approve every lead. We keep your data private.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* =========================
    INSIGHTS + GOVERNMENT BENEFITS
========================= */}

        <Section className="bg-[#fbfaf6]">
          <div className="grid gap-8 xl:grid-cols-2">
            {/* =====================================================
        LEFT — REAL ESTATE INSIGHTS
    ===================================================== */}

            <div className="relative overflow-hidden rounded-[30px] border border-[#173c30]/8 bg-gradient-to-br from-[#f8fbf8] to-[#f3f7f3] p-6 shadow-[0_14px_40px_rgba(18,55,43,0.06)] md:p-8">
              {/* Decorative glow */}
              <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-emerald-100/60 blur-3xl" />

              {/* Header */}
              <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_.85fr] lg:items-center">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#e7f4eb] text-[#08785a]">
                      <Icons.TrendingUp size={20} />
                    </span>

                    <span className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#08785a]">
                      Know Your Market
                    </span>
                  </div>

                  <h2 className="mt-5 font-serif text-[46px] leading-[0.98] tracking-[-0.04em] text-[#10241e] sm:text-[56px]">
                    Real estate
                    <br />
                    <span className="text-[#08785a]">insights</span>
                  </h2>

                  <p className="mt-5 max-w-[430px] text-[15px] leading-7 text-[#586b64]">
                    Actionable data to help you understand markets, prices and
                    rental trends better.
                  </p>

                  <Link
                    href="/insights"
                    className="group mt-6 inline-flex items-center gap-2 text-[14px] font-bold text-[#08785a]"
                  >
                    View all insights
                    <Icons.ArrowRight
                      size={17}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>
                </div>

                {/* Market Image */}
                <div className="group/market relative hidden h-[230px] overflow-hidden rounded-[24px] lg:block">
                  <img
                    src={assetUrl("/insights/market-insights.jpg")}
                    alt="GenVilla real estate market insights"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover/market:scale-110"
                  />

                  {/* Dark gradient */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />

                  {/* Badge */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-white/30 bg-white/90 px-4 py-2 shadow-lg backdrop-blur-md">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-[#08785a]" />

                    <span className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#08785a]">
                      Market Intelligence
                    </span>
                  </div>
                </div>
              </div>

              {/* Insight cards */}
              <div className="relative z-10 mt-8 space-y-4">
                {/* Price Trends */}
                <Link
                  href="/insights"
                  className="group/card grid gap-4 rounded-[22px] border border-[#173c30]/8 bg-white p-5 shadow-[0_8px_24px_rgba(18,55,43,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#08785a]/20 hover:shadow-[0_14px_32px_rgba(18,55,43,0.09)] sm:grid-cols-[72px_1fr_auto] sm:items-center"
                >
                  <div className="flex h-[68px] w-[68px] items-center justify-center rounded-[18px] bg-[#eaf5ed] text-[#08785a] transition-all duration-300 group-hover/card:scale-105 group-hover/card:bg-[#08785a] group-hover/card:text-white">
                    <Icons.ChartNoAxesCombined size={30} />
                  </div>

                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#08785a]">
                      Price Trends
                    </span>

                    <h3 className="mt-2 font-serif text-[22px] text-[#10241e]">
                      Where are prices moving?
                    </h3>

                    <p className="mt-2 text-[13px] leading-6 text-[#6c7974]">
                      Compare locality-level movement before you shortlist.
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eef7f1] text-[#08785a] transition-all duration-300 group-hover/card:rotate-45 group-hover/card:bg-[#08785a] group-hover/card:text-white">
                    <Icons.ArrowUpRight size={18} />
                  </div>
                </Link>

                {/* Rental Yield */}
                <Link
                  href="/calculators/rental-roi"
                  className="group/card grid gap-4 rounded-[22px] border border-[#173c30]/8 bg-white p-5 shadow-[0_8px_24px_rgba(18,55,43,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#08785a]/20 hover:shadow-[0_14px_32px_rgba(18,55,43,0.09)] sm:grid-cols-[72px_1fr_auto_auto] sm:items-center"
                >
                  <div className="flex h-[68px] w-[68px] items-center justify-center rounded-[18px] bg-[#eaf5ed] text-[#08785a] transition-all duration-300 group-hover/card:scale-105 group-hover/card:bg-[#08785a] group-hover/card:text-white">
                    <Icons.IndianRupee size={29} />
                  </div>

                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#08785a]">
                      Rental Yield
                    </span>

                    <h3 className="mt-2 font-serif text-[22px] text-[#10241e]">
                      What could your asset earn?
                    </h3>

                    <p className="mt-2 text-[13px] leading-6 text-[#6c7974]">
                      Understand rent, vacancy and potential yield.
                    </p>
                  </div>

                  <div className="flex h-[72px] w-[72px] flex-col items-center justify-center rounded-[18px] bg-[#eef7f1]">
                    <b className="text-[20px] text-[#08785a]">4.2%</b>

                    <span className="mt-1 text-[10px] text-[#6e7b75]">
                      Avg. Yield
                    </span>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eef7f1] text-[#08785a] transition-all duration-300 group-hover/card:rotate-45 group-hover/card:bg-[#08785a] group-hover/card:text-white">
                    <Icons.ArrowUpRight size={18} />
                  </div>
                </Link>

                {/* Affordability */}
                <Link
                  href="/calculators/affordability"
                  className="group/card grid gap-4 rounded-[22px] border border-[#173c30]/8 bg-white p-5 shadow-[0_8px_24px_rgba(18,55,43,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#08785a]/20 hover:shadow-[0_14px_32px_rgba(18,55,43,0.09)] sm:grid-cols-[72px_1fr_auto_auto] sm:items-center"
                >
                  <div className="flex h-[68px] w-[68px] items-center justify-center rounded-[18px] bg-[#eaf5ed] text-[#08785a] transition-all duration-300 group-hover/card:scale-105 group-hover/card:bg-[#08785a] group-hover/card:text-white">
                    <Icons.WalletCards size={30} />
                  </div>

                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#08785a]">
                      Affordability
                    </span>

                    <h3 className="mt-2 font-serif text-[22px] text-[#10241e]">
                      Can you afford it comfortably?
                    </h3>

                    <p className="mt-2 text-[13px] leading-6 text-[#6c7974]">
                      Check affordability, EMI impact and budget fit.
                    </p>
                  </div>

                  <div className="min-w-[105px] rounded-[18px] bg-[#eef7f1] px-4 py-3">
                    <b className="block text-[17px] text-[#08785a]">
                      ₹45,230
                      <span className="ml-1 text-[9px] font-medium">/mo</span>
                    </b>

                    <span className="mt-1 block text-[10px] text-[#718079]">
                      Example EMI
                    </span>

                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#cfe2d5]">
                      <div className="h-full w-[58%] rounded-full bg-[#08785a]" />
                    </div>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eef7f1] text-[#08785a] transition-all duration-300 group-hover/card:rotate-45 group-hover/card:bg-[#08785a] group-hover/card:text-white">
                    <Icons.ArrowUpRight size={18} />
                  </div>
                </Link>
              </div>

              {/* Trust strip */}
              <div className="relative z-10 mt-5 flex flex-col gap-4 rounded-[22px] border border-[#173c30]/6 bg-[#edf6ef] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#08785a] shadow-sm">
                    <Icons.ShieldCheck size={23} />
                  </div>

                  <div>
                    <b className="text-[14px] text-[#14382c]">
                      Data-backed property insights
                    </b>

                    <p className="mt-1 text-[12px] text-[#65736d]">
                      Clear numbers. Transparent methodology.
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-white px-4 py-2 text-[11px] font-bold text-[#08785a]">
                  Built for smarter decisions
                </span>
              </div>
            </div>

            {/* =====================================================
        RIGHT — GOVERNMENT BENEFITS
    ===================================================== */}

            <div className="relative overflow-hidden rounded-[30px] border border-[#9d6117]/8 bg-gradient-to-br from-[#fffaf3] to-[#fbf5eb] p-6 shadow-[0_14px_40px_rgba(91,59,17,0.06)] md:p-8">
              {/* Glow */}
              <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-orange-100/70 blur-3xl" />

              {/* Header */}
              <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_.85fr] lg:items-center">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#fff0df] text-[#c96a10]">
                      <Icons.Landmark size={20} />
                    </span>

                    <span className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#b85f13]">
                      Housing Support
                    </span>
                  </div>

                  <h2 className="mt-5 font-serif text-[46px] leading-[0.98] tracking-[-0.04em] text-[#10241e] sm:text-[56px]">
                    Government
                    <br />
                    <span className="text-[#c96a10]">benefits</span>
                  </h2>

                  <p className="mt-5 max-w-[430px] text-[15px] leading-7 text-[#6e665c]">
                    Explore schemes and subsidies that can make homeownership
                    more affordable.
                  </p>

                  <Link
                    href="/schemes"
                    className="group mt-6 inline-flex items-center gap-2 text-[14px] font-bold text-[#c96a10]"
                  >
                    Explore schemes
                    <Icons.ArrowRight
                      size={17}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>
                </div>

                {/* Government Benefits Image */}
                <div className="group/government relative hidden h-[230px] overflow-hidden rounded-[24px] lg:block">
                  <img
                    src={assetUrl("/insights/government-benefits.webp")}
                    alt="Government housing benefits and schemes"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover/government:scale-110"
                  />

                  {/* Warm gradient */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#5c3518]/45 via-transparent to-transparent" />

                  {/* Badge */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-white/30 bg-white/90 px-4 py-2 shadow-lg backdrop-blur-md">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-[#c96a10]" />

                    <span className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#a6530d]">
                      Housing Support
                    </span>
                  </div>
                </div>
              </div>

              {/* Scheme cards */}
              <div className="relative z-10 mt-8 space-y-4">
                {/* PMAY */}
                <Link
                  href="/schemes"
                  className="group/scheme grid gap-4 overflow-hidden rounded-[22px] border border-[#9d6117]/8 bg-white p-4 shadow-[0_8px_24px_rgba(91,59,17,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_14px_32px_rgba(91,59,17,0.09)] sm:grid-cols-[76px_1fr_auto]"
                >
                  <div className="flex h-[72px] w-[72px] items-center justify-center rounded-[18px] bg-[#fff2e3] text-[#d87516] transition-all duration-300 group-hover/scheme:scale-105 group-hover/scheme:bg-[#d87516] group-hover/scheme:text-white">
                    <Icons.House size={30} />
                  </div>

                  <div>
                    <h3 className="font-serif text-[21px] text-[#10241e]">
                      Pradhan Mantri Awas Yojana
                    </h3>

                    <p className="mt-2 text-[13px] leading-6 text-[#6e6a64]">
                      Home-loan interest support for eligible urban households.
                    </p>

                    <span className="mt-3 inline-flex rounded-full bg-[#fff3e7] px-3 py-1.5 text-[10px] font-bold text-[#b75e12]">
                      Income & property criteria apply
                    </span>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center self-center rounded-full bg-[#fff4e8] text-[#c96a10] transition-all duration-300 group-hover/scheme:rotate-45 group-hover/scheme:bg-[#c96a10] group-hover/scheme:text-white">
                    <Icons.ArrowUpRight size={18} />
                  </div>
                </Link>

                {/* Haryana Housing */}
                <Link
                  href="/schemes"
                  className="group/scheme grid gap-4 rounded-[22px] border border-[#275986]/8 bg-white p-4 shadow-[0_8px_24px_rgba(39,89,134,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_14px_32px_rgba(39,89,134,0.09)] sm:grid-cols-[76px_1fr_auto]"
                >
                  <div className="flex h-[72px] w-[72px] items-center justify-center rounded-[18px] bg-[#edf5fd] text-[#2367a0] transition-all duration-300 group-hover/scheme:scale-105 group-hover/scheme:bg-[#2367a0] group-hover/scheme:text-white">
                    <Icons.Home size={30} />
                  </div>

                  <div>
                    <h3 className="font-serif text-[21px] text-[#10241e]">
                      Haryana Housing Schemes
                    </h3>

                    <p className="mt-2 text-[13px] leading-6 text-[#6e6a64]">
                      State-led affordable housing opportunities in notified
                      areas.
                    </p>

                    <span className="mt-3 inline-flex rounded-full bg-[#edf5fd] px-3 py-1.5 text-[10px] font-bold text-[#2367a0]">
                      Affordable housing support
                    </span>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center self-center rounded-full bg-[#edf5fd] text-[#2367a0] transition-all duration-300 group-hover/scheme:rotate-45 group-hover/scheme:bg-[#2367a0] group-hover/scheme:text-white">
                    <Icons.ArrowUpRight size={18} />
                  </div>
                </Link>

                {/* Stamp Duty */}
                <Link
                  href="/schemes"
                  className="group/scheme grid gap-4 rounded-[22px] border border-violet-200/40 bg-white p-4 shadow-[0_8px_24px_rgba(99,61,140,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_14px_32px_rgba(99,61,140,0.09)] sm:grid-cols-[76px_1fr_auto]"
                >
                  <div className="flex h-[72px] w-[72px] items-center justify-center rounded-[18px] bg-violet-50 text-violet-700 transition-all duration-300 group-hover/scheme:scale-105 group-hover/scheme:bg-violet-600 group-hover/scheme:text-white">
                    <Icons.BadgePercent size={30} />
                  </div>

                  <div>
                    <h3 className="font-serif text-[21px] text-[#10241e]">
                      Stamp Duty & Registration Benefits
                    </h3>

                    <p className="mt-2 text-[13px] leading-6 text-[#6e6a64]">
                      Concessions and rebates that may reduce your property
                      buying cost.
                    </p>

                    <span className="mt-3 inline-flex rounded-full bg-violet-50 px-3 py-1.5 text-[10px] font-bold text-violet-700">
                      Benefits vary by state
                    </span>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center self-center rounded-full bg-violet-50 text-violet-700 transition-all duration-300 group-hover/scheme:rotate-45 group-hover/scheme:bg-violet-600 group-hover/scheme:text-white">
                    <Icons.ArrowUpRight size={18} />
                  </div>
                </Link>
              </div>

              {/* Bottom CTA */}
              <div className="relative z-10 mt-5 flex flex-col gap-4 rounded-[22px] border border-[#d69b53]/10 bg-[#fff6e9] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-[#c96a10] shadow-sm">
                    <Icons.Gift size={23} />
                  </div>

                  <div>
                    <b className="text-[14px] text-[#3a2b1e]">
                      Save more with the right scheme.
                    </b>

                    <p className="mt-1 text-[12px] text-[#76695e]">
                      Check eligibility, documents and application process.
                    </p>
                  </div>
                </div>

                <Link
                  href="/schemes"
                  className="group/button inline-flex items-center justify-center gap-2 rounded-full bg-[#c96a10] px-5 py-3 text-[12px] font-bold text-white shadow-[0_8px_18px_rgba(201,106,16,0.20)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#a9550d]"
                >
                  Check now
                  <Icons.ArrowUpRight
                    size={15}
                    className="transition-transform duration-300 group-hover/button:-translate-y-0.5 group-hover/button:translate-x-0.5"
                  />
                </Link>
              </div>
            </div>
          </div>
        </Section>

        {/* =========================
    FINAL CTA
========================= */}

        <section className="bg-[#d0923d] px-5 py-16 md:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
              {/* LEFT CONTENT */}
              <div className="max-w-xl">
                <p className="eyebrow !text-ink/60">
                  YOUR NEXT MOVE, MADE CLEARER
                </p>

                <h2 className="mt-5 font-serif text-5xl leading-[0.95] text-ink md:text-6xl">
                  Ready to make a smarter property decision?
                </h2>

                <p className="mt-6 max-w-lg text-base leading-7 text-ink/65">
                  Compare your options, understand affordability, and make your
                  next property move with greater confidence.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link className="btn-dark" href="/properties">
                    Explore properties
                    <Icons.ArrowUpRight size={16} />
                  </Link>

                  <Link className="btn-ghost" href="/calculators/affordability">
                    Check affordability
                  </Link>
                </div>
              </div>

              {/* RIGHT IMAGE AREA */}
              <div className="relative">
                {/* Soft background glow */}
                <div className="absolute -inset-4 rounded-[36px] bg-white/10 blur-2xl" />

                <div className="relative rounded-[34px] border border-white/20 bg-white/10 p-3 shadow-[0_20px_60px_rgba(22,38,32,0.18)] backdrop-blur-sm">
                  {/* Top label */}
                  <div className="mb-3 flex items-center justify-between px-2">
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-ink/55">
                        Property Decision
                      </p>

                      <p className="mt-1 text-sm font-semibold text-ink/80">
                        Buy · Rent · Sell · Invest
                      </p>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 shadow-sm">
                      <Icons.Home size={16} className="text-[#08785a]" />
                    </div>
                  </div>

                  {/* Image */}
                  <div className="group relative overflow-hidden rounded-[26px]">
                    <img
                      src={assetUrl("/insights/property-decision.jpg")}
                      alt="Compare property buying, renting, selling and investing decisions"
                      className="h-[330px] w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.04] md:h-[380px]"
                    />

                    {/* Better gradient */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />

                    {/* Main badge */}
                    <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full border border-white/30 bg-white/95 px-4 py-2 shadow-lg backdrop-blur-md">
                      <Icons.Home size={14} className="text-[#08785a]" />

                      <span className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#173c30]">
                        Make the right move
                      </span>
                    </div>
                  </div>

                  {/* Small info chips */}
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="rounded-[18px] bg-white/70 px-4 py-3 backdrop-blur-sm">
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-ink/45">
                        Compare
                      </p>
                      <p className="mt-1 text-sm font-bold text-ink">
                        Buy vs Rent
                      </p>
                    </div>

                    <div className="rounded-[18px] bg-white/70 px-4 py-3 backdrop-blur-sm">
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-ink/45">
                        Analyze
                      </p>
                      <p className="mt-1 text-sm font-bold text-ink">
                        Affordability
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

/* =========================================================
   SECTION WRAPPER
========================================================= */

function Section({ children, className = "" }) {
  return (
    <section className={`px-5 py-16 md:py-24 lg:px-10 ${className}`}>
      <div className="mx-auto max-w-[1360px]">{children}</div>
    </section>
  );
}

/* =========================================================
   SECTION HEADING
========================================================= */

function SectionHead({ eyebrow, title, text, action }) {
  return (
    <div className="mb-9 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
      <div>
        <p className="eyebrow">{eyebrow}</p>

        <h2 className="section-title mt-3">{title}</h2>

        {text && <p className="mt-3 text-ink/55">{text}</p>}
      </div>

      {action && (
        <Link
          className="inline-flex items-center gap-2 text-sm font-bold text-green"
          href={action[1]}
        >
          {action[0]}
          <Icons.ArrowUpRight size={16} />
        </Link>
      )}
    </div>
  );
}

/* =========================================================
   PROPERTY LOADING SKELETON
========================================================= */

function Skeleton() {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="h-[460px] animate-pulse rounded-[24px] bg-cream"
        />
      ))}
    </div>
  );
}

/* =========================================================
   EMPTY / ERROR STATE
========================================================= */

function State({ title, action, onClick, href }) {
  return (
    <div className="rounded-3xl border border-dashed border-ink/20 p-12 text-center">
      <h3 className="font-serif text-2xl">{title}</h3>

      {action && href ? (
        <Link href={href} className="btn-outline mt-5">
          {action}
        </Link>
      ) : action ? (
        <button type="button" className="btn-outline mt-5" onClick={onClick}>
          {action}
        </button>
      ) : null}
    </div>
  );
}
