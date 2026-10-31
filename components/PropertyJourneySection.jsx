"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BarChart3, Calculator, Heart } from "lucide-react";

import {
  ANALYSIS_EVENT,
  ANALYSIS_KEY,
  parseAnalysis,
} from "@/utils/latestAnalysis";

const analysisHref = "/calculators/smart-property-analyzer";

const linkClassName =
  "group/link inline-flex min-h-9 items-center gap-1.5 text-[13px] font-semibold text-green transition-colors hover:text-[#075c43] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green";

export default function PropertyJourneySection() {
  return (
    <section
      aria-labelledby="property-journey-title"
      className="mt-5 mb-3 sm:mt-6 sm:mb-4"
    >
      {/* HEADER */}
      <div className="mb-5 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-green">
            Your Property Journey
          </p>

          <h2
            id="property-journey-title"
            className="mt-1.5 font-serif text-[28px] leading-tight text-ink sm:text-[32px] lg:text-[36px]"
          >
            Continue Where You Left Off
          </h2>
        </div>

        <p className="max-w-[300px] text-[13px] leading-5 text-ink/60">
          Pick up from where you stopped or explore new possibilities.
        </p>
      </div>

      {/* CARDS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <SavedPropertiesCard />

        <RecentAnalysisCard />

        <JourneyCard
          icon={Calculator}
          title="Explore Calculators"
          image="/home/journey/calculator-property.webp"
          imageAlt="Property calculator"
          tone="bg-[#f7f6ef]"
        >
          <p className="max-w-[60%] text-[13px] leading-5 text-ink/60">
            EMI, true cost, affordability, rental ROI and more.
          </p>

          <JourneyLink href="/calculators">Explore Calculators</JourneyLink>
        </JourneyCard>
      </div>
    </section>
  );
}

/* =========================================================
   SAVED PROPERTIES
========================================================= */

function SavedPropertiesCard() {
  return (
    <JourneyCard
      icon={Heart}
      title="Saved Properties"
      image="/home/journey/saved-property.png"
      imageAlt="Modern residential property"
      tone="bg-[#eef7f1]"
    >
      <p className="max-w-[60%] text-[13px] leading-5 text-ink/60">
        Sign in to save and revisit properties you like.
      </p>

      <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-1 pt-4">
        <Link href="/login" className={linkClassName}>
          Sign In
          <JourneyArrow />
        </Link>

        <Link
          href="/properties"
          className="group/link inline-flex min-h-9 items-center gap-1 text-[12px] font-medium text-ink/55 transition-colors hover:text-green"
        >
          Explore Properties
          <ArrowRight
            size={13}
            aria-hidden="true"
            className="transition-transform duration-200 group-hover/link:translate-x-0.5"
          />
        </Link>
      </div>
    </JourneyCard>
  );
}

/* =========================================================
   RECENT ANALYSIS
========================================================= */

function RecentAnalysisCard() {
  const [recent, setRecent] = useState({
    status: "loading",
    analysis: null,
  });

  useEffect(() => {
    const read = () => {
      try {
        const raw = window.localStorage.getItem(ANALYSIS_KEY);
        const analysis = parseAnalysis(raw);

        setRecent({
          status: raw !== null && !analysis ? "error" : "ready",
          analysis,
        });
      } catch {
        setRecent({
          status: "error",
          analysis: null,
        });
      }
    };

    const onStorage = (event) => {
      if (event.key === ANALYSIS_KEY || event.key === null) {
        read();
      }
    };

    read();

    window.addEventListener("storage", onStorage);
    window.addEventListener(ANALYSIS_EVENT, read);
    window.addEventListener("pageshow", read);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(ANALYSIS_EVENT, read);
      window.removeEventListener("pageshow", read);
    };
  }, []);

  const { analysis, status } = recent;

  const locality =
    typeof analysis?.property?.locality === "string"
      ? analysis.property.locality
      : "";

  const city =
    typeof analysis?.property?.city === "string" ? analysis.property.city : "";

  return (
    <JourneyCard
      icon={BarChart3}
      title="Recent Analysis"
      image="/home/journey/recent-analysis.webp"
      imageAlt="Property analysis report"
      tone="bg-[#f1f7f4]"
    >
      <div
        className="max-w-[61%] text-[13px] leading-5 text-ink/60"
        aria-busy={status === "loading"}
        aria-live="polite"
      >
        {status === "loading" ? (
          <div role="status">
            <span className="sr-only">Loading recent analysis</span>

            <div
              aria-hidden="true"
              className="space-y-2 motion-safe:animate-pulse"
            >
              <div className="h-3 w-3/4 rounded bg-green/10" />
              <div className="h-3 w-1/2 rounded bg-green/10" />
            </div>
          </div>
        ) : status === "error" ? (
          <p>Unable to load your recent analysis.</p>
        ) : analysis ? (
          <>
            <p className="font-semibold text-ink">Smart Property Analyzer</p>

            {(locality || city) && (
              <p className="mt-0.5 break-words">
                {[locality, city].filter(Boolean).join(", ")}
              </p>
            )}

            {analysis.metrics?.affordability !== null &&
              analysis.metrics?.affordability !== undefined && (
                <p className="mt-1">
                  Affordability{" "}
                  <span className="font-semibold text-green">
                    {Math.round(analysis.metrics.affordability)}/100
                  </span>
                </p>
              )}
          </>
        ) : (
          <p>You haven&apos;t completed an analysis yet.</p>
        )}
      </div>

      <JourneyLink href={analysisHref}>
        {analysis ? "Continue Analysis" : "Start Analysis"}
      </JourneyLink>
    </JourneyCard>
  );
}

/* =========================================================
   REUSABLE CARD
========================================================= */

function JourneyCard({ icon: Icon, title, image, imageAlt, tone, children }) {
  return (
    <article
      className={`group relative flex min-h-[210px] min-w-0 overflow-hidden rounded-[20px] border border-green/10 p-5 shadow-[0_5px_18px_rgba(19,45,35,0.035)] transition-all duration-300 hover:-translate-y-0.5 hover:border-green/20 hover:shadow-[0_10px_28px_rgba(19,45,35,0.07)] ${tone}`}
    >
      {/* LEFT CONTENT */}
      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/85 text-green shadow-sm">
            <Icon size={18} strokeWidth={1.7} aria-hidden="true" />
          </div>

          <h3 className="font-serif text-[20px] leading-tight text-ink sm:text-[21px]">
            {title}
          </h3>
        </div>

        {children}
      </div>

      {/* RIGHT IMAGE */}
      {image && (
        <div className="pointer-events-none absolute bottom-0 right-0 h-[125px] w-[145px] sm:h-[135px] sm:w-[155px]">
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="155px"
            className="object-contain object-bottom-right transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      )}

      {/* SOFT IMAGE BLEND */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 h-24 w-36 bg-gradient-to-tl from-white/10 to-transparent"
      />
    </article>
  );
}

/* =========================================================
   LINKS
========================================================= */

function JourneyLink({ href, children }) {
  return (
    <div className="mt-auto pt-4">
      <Link href={href} className={linkClassName}>
        {children}
        <JourneyArrow />
      </Link>
    </div>
  );
}

function JourneyArrow() {
  return (
    <ArrowRight
      size={14}
      aria-hidden="true"
      className="transition-transform duration-200 group-hover/link:translate-x-1"
    />
  );
}
