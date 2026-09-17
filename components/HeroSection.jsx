"use client";
import { assetUrl } from "@/lib/assets";

import Link from "next/link";
import HomePropertySearch from "@/components/HomePropertySearch";
import { useEffect, useState } from "react";
import { ANALYSIS_KEY, LOCATION_KEY, ANALYSIS_EVENT, parseAnalysis, writeContext } from "@/utils/latestAnalysis";
import { normalizeCity, getPropertyLocationPath } from "@/utils/location";
import {
  ArrowRight,
  BarChart3,
  Building2,
  Check,
  IndianRupee,
  MapPin,
  ShieldCheck,
  Sparkles,
  WalletCards,
} from "lucide-react";

const cities = ["Gurugram", "Noida", "Ghaziabad", "Sonipat", "New Delhi"];

export default function HeroSection() {
  const [analysis, setAnalysis] = useState(null);
  const [selectedCity, setSelectedCity] = useState('');
  useEffect(() => {
    const read = () => {
      try {
        setAnalysis(parseAnalysis(window.localStorage.getItem(ANALYSIS_KEY)));
        const context = JSON.parse(window.localStorage.getItem(LOCATION_KEY) || 'null');
        setSelectedCity(normalizeCity(context?.city));
      } catch { setAnalysis(null); setSelectedCity(''); }
    };
    read();
    window.addEventListener('storage', read);
    window.addEventListener(ANALYSIS_EVENT, read);
    window.addEventListener('pageshow', read);
    return () => {
      window.removeEventListener('storage', read);
      window.removeEventListener(ANALYSIS_EVENT, read);
      window.removeEventListener('pageshow', read);
    };
  }, []);
  const metrics = analysis?.metrics;
  const unavailable = 'Not enough data';
  return (
    <section className="relative isolate">
      {/* =====================================================
          BACKGROUND VIDEO
      ====================================================== */}
      <video
        poster={assetUrl("/hero/property-lifestyle.png")}
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
          max-w-[1450px]
          items-center
          gap-8
          px-6
          pb-12
          pt-10
          lg:grid-cols-[1.15fr_1fr]
          lg:px-10
          xl:gap-12
        "
      >
        {/* ===================================================
            LEFT CONTENT
        ==================================================== */}
        <div className="min-w-0 max-w-[690px]">
          {/* TOP BADGE */}
          <div
            className="
              mb-7
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-white/20
              bg-black/20
              px-4
              py-2.5
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
              text-[36px]
              leading-[1.08]
              tracking-[-0.035em]
              text-white
              sm:text-[44px]
              lg:text-[48px]
              xl:text-[54px]
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
              mt-5
              max-w-[620px]
              text-[16px]
              leading-7
              text-white/80
            "
          >
            Explore homes across Gurugram, Ghaziabad, Sonipat, Noida and New
            Delhi—then understand what each property really means for your
            finances.
          </p>

          {/* BUTTONS */}
          <div className="mt-6 flex flex-wrap gap-3">
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
          <div
            className="
              group
              relative
              overflow-hidden
              rounded-[30px]
              border
              border-white/25
              bg-[#071f1b]/90
              p-6
              shadow-[0_35px_90px_rgba(0,0,0,0.40)]
              backdrop-blur-xl
              transition-all
              duration-500
              hover:-translate-y-1
              hover:border-[#4bdca7]/35
              hover:shadow-[0_40px_100px_rgba(0,0,0,0.48)]
              sm:p-7
            "
          >
            {/* GREEN GLOW */}
            <div
              className="
                pointer-events-none
                absolute
                -right-20
                -top-20
                h-[230px]
                w-[230px]
                rounded-full
                bg-[#24d496]/10
                blur-[80px]
              "
            />

            {/* HEADER */}
            <div
              className="
                relative
                flex
                items-start
               justify-start
                gap-5
              "
            >
              <div className="flex items-start gap-2">
                <div
                  className="
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#47dea9]/30
                    bg-[#0c3a31]
                    text-[#77e2b8]
                    transition-all
                    duration-300
                    group-hover:rotate-6
                    group-hover:scale-105
                  "
                >
                  <Sparkles size={20} />
                </div>

                <div>
                  <h2
                    className="
                      text-[20px]
                      font-bold
                      text-white
                    "
                  >
                    GenVilla Analysis
                  </h2>

                  <p
                    className="
                      mt-1
                      text-[12px]
                      text-white/50
                    "
                  >
                    {analysis ? `Latest completed analysis: ${[analysis.property.locality, analysis.property.city].filter(Boolean).join(', ')}` : 'Analyze a property to see affordability, EMI, rental yield and risk insights.'}
                  </p>
                </div>
              </div>

              {/* INVESTMENT SCORE */}
              {analysis && <div
                className="
    hidden
    min-w-[165px]
    shrink-0
    rounded-[18px]
    border
    border-[#4be0a9]/55
    bg-[#07503e]/95
    px-4
    py-3
    text-white
    shadow-[0_12px_30px_rgba(0,0,0,0.25)]
    backdrop-blur-xl
    transition-all
    duration-300
    hover:-translate-y-1
    hover:border-[#62e8b7]
    xl:block
  "
              >
                <div
                  className="
      flex
      items-center
      gap-2
      text-[9px]
      font-semibold
      uppercase
      tracking-[0.08em]
      text-white/70
    "
                >
                  <BarChart3 size={13} className="text-[#8ae7c2]" />
                  Investment Score
                </div>

                <div className="mt-2 flex items-end gap-1">
                  <span className={metrics.investment === null ? 'text-sm font-bold' : 'text-[30px] font-bold leading-none'}>
                    {metrics.investment === null ? unavailable : (metrics.investment / 10).toFixed(1)}
                  </span>

                  <span className="mb-1 text-[10px] font-semibold text-white/55">
                    {metrics.investment !== null ? '/10' : ''}
                  </span>
                </div>

              </div>}
              {/* CHECK */}
              {analysis && <div
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-[#e9fff6]
                  text-[#07885e]
                  shadow-lg
                  transition-all
                  duration-300
                  hover:rotate-6
                  hover:scale-110
                "
              >
                <Check size={22} />
              </div>}
            </div>

            {/* ===============================================
                METRICS
            ================================================ */}
            {analysis && <div className="relative mt-7 space-y-3">
              <MetricCard
                icon={WalletCards}
                title="Affordability"
                subtitle="How easily this fits your budget"
                value={metrics.affordability === null ? unavailable : `${metrics.affordability}/100`}
                progress={metrics.affordability ?? undefined}
              />

              <MetricCard
                icon={Building2}
                title="Rental Yield"
                subtitle="Estimated annual rental return"
                value={metrics.rentalYield === null ? unavailable : `${metrics.rentalYield.toFixed(2)}%`}
              />

              <MetricCard
                icon={ShieldCheck}
                title="Risk Level"
                subtitle="Overall property risk assessment"
                value={metrics.risk || unavailable}
              />

              <MetricCard
                icon={IndianRupee}
                title="Estimated EMI"
                subtitle="Estimated monthly loan payment"
                value={metrics.emi === null ? unavailable : `₹${Math.round(metrics.emi).toLocaleString('en-IN')}`}
                extra={metrics.emi === null ? undefined : '/ month'}
              />
            </div>}

            {/* ===============================================
                RECOMMENDATION
            ================================================ */}
            {analysis && <button type="button" className="relative mt-4 text-sm text-white/70 underline hover:text-white" onClick={() => { writeContext(ANALYSIS_KEY, null); setAnalysis(null); }}>Clear latest analysis</button>}
            {!analysis && selectedCity && <Link className="relative mt-5 inline-block text-sm font-semibold text-white underline" href={`/smart-recommendation?city=${encodeURIComponent(selectedCity)}`}>Get Smart Recommendations</Link>}
            <div
              className="
                relative
                mt-6
                border-t
                border-white/15
                pt-6
              "
            >
              <div
                className="
                  flex
                  flex-col
                  gap-5
                  sm:flex-row
                  sm:items-end
                  sm:justify-between
                "
              >
                <div>
                  <p
                    className="
                      text-[11px]
                      font-medium
                      uppercase
                      tracking-[0.12em]
                      text-white/45
                    "
                  >
                    {analysis ? 'Your saved analysis' : selectedCity ? 'Your selected market' : 'Start your analysis'}
                  </p>

                  <div
                    className="
                      mt-2
                      flex
                      items-center
                      gap-3
                    "
                  >
                    {analysis && <span
                      className="
                        h-3
                        w-3
                        animate-pulse
                        rounded-full
                        bg-[#32d99b]
                        shadow-[0_0_12px_rgba(50,217,155,0.8)]
                      "
                    />}

                    <h3
                      className="
                        text-[30px]
                        font-bold
                        text-[#32d99b]
                      "
                    >
                      {analysis ? 'Analysis complete' : selectedCity ? `Explore properties in ${selectedCity}` : 'Analyze a Property'}
                    </h3>
                  </div>

                  <p
                    className="
                      mt-2
                      max-w-[270px]
                      text-[12px]
                      leading-5
                      text-white/50
                    "
                  >
                    {analysis ? 'Estimates based on the inputs you submitted.' : 'Choose a property and review its financial assumptions to get personalized insights.'}
                  </p>
                </div>

                <Link
                  href={selectedCity && !analysis ? getPropertyLocationPath({city: selectedCity}) : '/calculators/smart-property-analyzer'}
                  className="
                    group/button
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-full
                    bg-[#07885e]
                    px-6
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    shadow-[0_12px_30px_rgba(7,136,94,0.25)]
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:bg-[#0a9c6c]
                    hover:shadow-[0_16px_35px_rgba(7,136,94,0.35)]
                  "
                >
                  {selectedCity && !analysis ? 'Explore properties' : 'Analyze a Property'}
                  <ArrowRight
                    size={15}
                    className="
                      transition-transform
                      duration-300
                      group-hover/button:translate-x-1
                    "
                  />
                </Link>
              </div>
            </div>
          </div>

          {/* =================================================
              VERIFIED BADGE
          ================================================== */}
          <div
            className="
              absolute
              -bottom-9
              right-5
              z-20
              hidden
              items-center
              gap-3
              rounded-2xl
              border
              border-white/70
              bg-white/95
              px-5
              py-4
              shadow-[0_18px_45px_rgba(0,0,0,0.28)]
              backdrop-blur-lg
              transition-all
              duration-300
              hover:-translate-y-1
              hover:scale-[1.03]
              md:flex
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
                bg-[#e0f8ee]
                text-[#07885e]
              "
            >
              <ShieldCheck size={20} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <p
                  className="
                    text-[13px]
                    font-bold
                    text-[#17231f]
                  "
                >
                  Verified Data
                </p>

                <span
                  className="
                    h-2
                    w-2
                    animate-pulse
                    rounded-full
                    bg-[#22cc8d]
                  "
                />
              </div>

              <p
                className="
                  mt-1
                  text-[10px]
                  text-[#6d7772]
                "
              >
                Updated property insights
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-30 mx-auto max-w-[1450px] px-4 pb-5 sm:px-6 lg:px-10">
        <HomePropertySearch />
      </div>

      {/* =====================================================
          CITY BAR
      ====================================================== */}
      <div
        className="
          relative
          z-10
          mx-auto
          max-w-[1450px]
          px-6
          pb-8
          lg:px-10
        "
      >
        <div
          className="
            grid
            overflow-hidden
            rounded-2xl
            border
            border-white/15
            bg-[#041914]/75
            shadow-[0_15px_40px_rgba(0,0,0,0.20)]
            backdrop-blur-xl
            sm:grid-cols-2
            lg:grid-cols-5
          "
        >
          {cities.map((city) => (
            <Link
              key={city}
              href={getPropertyLocationPath({ city })}
              className="
                group/city
                flex
                items-center
                gap-3
                border-b
                border-white/10
                px-5
                py-4
                transition-all
                duration-300
                hover:bg-white/10
                sm:border-r
                lg:border-b-0
                last:border-r-0
              "
            >
              <div
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-white/10
                  text-[#8ce2c0]
                  transition-all
                  duration-300
                  group-hover/city:-translate-y-1
                  group-hover/city:scale-110
                  group-hover/city:bg-[#0b5943]
                "
              >
                <MapPin size={16} />
              </div>

              <span
                className="
                  text-[12px]
                  font-semibold
                  text-white
                  transition-colors
                  duration-300
                  group-hover/city:text-[#9de4c7]
                "
              >
                {city}
              </span>
            </Link>
          ))}
        </div>
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
