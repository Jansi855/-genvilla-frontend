"use client";

import Link from "next/link";
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
  return (
    <section className="relative min-h-[860px] overflow-hidden">
      {/* =====================================================
          BACKGROUND VIDEO
      ====================================================== */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/hero/property-video.mp4" type="video/mp4" />
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
          min-h-[730px]
          max-w-[1450px]
          items-center
          gap-16
          px-6
          pb-16
          pt-16
          lg:grid-cols-[0.9fr_1.1fr]
          lg:px-10
          xl:gap-24
        "
      >
        {/* ===================================================
            LEFT CONTENT
        ==================================================== */}
        <div className="max-w-[690px]">
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
            <span
              className="
                h-2
                w-2
                animate-pulse
                rounded-full
                bg-[#73e4b7]
              "
            />

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
              text-[48px]
              leading-[0.98]
              tracking-[-0.035em]
              text-white
              sm:text-[58px]
              lg:text-[64px]
              xl:text-[72px]
            "
          >
            Find the right
            <br />
            property.
            <span className="mt-2 block text-[#a4e3ca]">
              Make the right
              <br />
              decision.
            </span>
          </h1>

          {/* DESCRIPTION */}
          <p
            className="
              mt-8
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
          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/properties"
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
                    Smart overview of this property.
                  </p>
                </div>
              </div>

              {/* INVESTMENT SCORE */}
              <div
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
                  <span className="text-[30px] font-bold leading-none">
                    8.6
                  </span>

                  <span className="mb-1 text-[10px] font-semibold text-white/55">
                    /10
                  </span>
                </div>

                <div className="mt-2 text-[11px] tracking-[2px] text-[#ffd34e]">
                  ★★★★★
                </div>

                <p className="mt-1 text-[9px] font-semibold text-[#90e8c4]">
                  Very Good
                </p>
              </div>
              {/* CHECK */}
              <div
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
              </div>
            </div>

            {/* ===============================================
                METRICS
            ================================================ */}
            <div className="relative mt-7 space-y-3">
              <MetricCard
                icon={WalletCards}
                title="Affordability"
                subtitle="How easily this fits your budget"
                value="82/100"
                progress={82}
              />

              <MetricCard
                icon={Building2}
                title="Rental Yield"
                subtitle="Estimated annual rental return"
                value="4.7%"
                progress={72}
              />

              <MetricCard
                icon={ShieldCheck}
                title="Risk Level"
                subtitle="Overall property risk assessment"
                value="Low"
                risk
              />

              <MetricCard
                icon={IndianRupee}
                title="Estimated EMI"
                subtitle="Estimated monthly loan payment"
                value="₹72K"
                extra="/ month"
              />
            </div>

            {/* ===============================================
                RECOMMENDATION
            ================================================ */}
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
                    Recommendation
                  </p>

                  <div
                    className="
                      mt-2
                      flex
                      items-center
                      gap-3
                    "
                  >
                    <span
                      className="
                        h-3
                        w-3
                        animate-pulse
                        rounded-full
                        bg-[#32d99b]
                        shadow-[0_0_12px_rgba(50,217,155,0.8)]
                      "
                    />

                    <h3
                      className="
                        text-[30px]
                        font-bold
                        text-[#32d99b]
                      "
                    >
                      Good Fit
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
                    Strong match based on affordability, return potential and
                    risk.
                  </p>
                </div>

                <Link
                  href="/smart-recommendation"
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
                  Full Analysis
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
              href={`/properties?city=${encodeURIComponent(city)}`}
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

            <div className="shrink-0 text-right">
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
