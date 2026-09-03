"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

import {
  Home,
  Building2,
  Calculator,
  BarChart3,
  ShieldCheck,
  Wrench,
  Info,
  ArrowUpRight,
  ChevronDown,
  WalletCards,
  FileText,
  TrendingUp,
  Scale,
  Sparkles,
  Menu,
  X,
  Check,
} from "lucide-react";

/* =========================
   NAVIGATION
========================= */

const nav = [
  ["Home", "/", Home],
  ["Properties", "/properties", Building2],
  ["Calculators", "/calculators", Calculator],
  ["Insights", "/insights", BarChart3],
  ["Schemes", "/schemes", ShieldCheck],
  ["Tools", "/tools", Wrench],
  ["About", "/about", Info],
];

/* =========================
   CALCULATOR GROUPS
========================= */

const calculatorGroups = [
  {
    title: "Finance",
    icon: WalletCards,

    items: [
      ["EMI Calculator", "/calculators/emi", "Estimate your monthly EMI"],

      [
        "Affordability Calculator",
        "/calculators/affordability",
        "Check what property you can afford",
      ],
    ],
  },

  {
    title: "Property Cost",
    icon: FileText,

    items: [
      [
        "True Cost Calculator",
        "/calculators/true-cost",
        "Know your complete buying cost",
      ],
    ],
  },

  {
    title: "Investment",
    icon: TrendingUp,

    items: [
      [
        "Rental ROI Calculator",
        "/calculators/rental-roi",
        "Calculate rental returns",
      ],

      [
        "Risk Analysis",
        "/calculators/risk-analysis",
        "Analyze property investment risks",
      ],
    ],
  },

  {
    title: "Decision Tools",
    icon: Scale,

    items: [
      [
        "Buy vs Rent Calculator",
        "/calculators/buy-vs-rent",
        "Compare buying and renting",
      ],

      [
        "Smart Property Analyzer",
        "/calculators/smart-property-analyzer",
        "Smart property decision analysis",
      ],
    ],
  },
];

/* =========================
   NAVBAR
========================= */

export default function Navbar() {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [calculatorOpen, setCalculatorOpen] = useState(false);

  const active = (href) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  };

  return (
    <header
      className="
        sticky
        top-0
        z-50
        border-b
        border-black/5
        bg-[#faf9f4]/95
        backdrop-blur-xl
      "
    >
      {/* =========================
          MAIN NAVBAR
      ========================= */}

      <div
        className="
          mx-auto
          flex
          h-[92px]
          max-w-[1600px]
          items-center
          gap-5
          px-5
          lg:px-8
          xl:px-10
        "
      >
        {/* =========================
            COMPLETE PNG LOGO
        ========================= */}

        <Link
          href="/"
          className="
            group
            mr-auto
            flex
            shrink-0
            items-center
          "
        >
          <Image
            src="/Genvilla-navbar (2).png"
            alt="GenVilla - Find Analyze Own"
            width={600}
            height={180}
            priority
            className="
            h-[75px]
            w-[420px]
            object-contain
            object-left
            transition-all
            duration-300
            ease-out
            group-hover:-translate-y-[2px]
            group-hover:scale-[1.02]
  "
          />
        </Link>

        {/* =========================
            DESKTOP NAVIGATION
        ========================= */}

        <nav
          className="
            hidden
            items-center
            gap-3
            lg:flex
            xl:gap-5
          "
        >
          {nav.map(([label, href, Icon]) => {
            /* =========================
               CALCULATORS
            ========================= */

            if (label === "Calculators") {
              return (
                <div key={href} className="relative">
                  <button
                    type="button"
                    aria-expanded={calculatorOpen}
                    onClick={() => setCalculatorOpen((value) => !value)}
                    className={`
                      group
                      relative

                      flex
                      min-w-[76px]
                      flex-col
                      items-center
                      justify-center
                      gap-1.5

                      py-3

                      text-[12px]
                      font-medium

                      transition-all
                      duration-300

                      hover:-translate-y-[2px]
                      hover:text-[#087552]

                      after:absolute
                      after:-bottom-[6px]
                      after:left-1/2

                      after:h-[2px]

                      after:-translate-x-1/2
                      after:bg-[#087552]

                      after:transition-all
                      after:duration-300

                      ${
                        active(href)
                          ? "text-[#087552] after:w-full"
                          : "text-[#27332f]/70 after:w-0 hover:after:w-full"
                      }
                    `}
                  >
                    <Calculator
                      size={20}
                      strokeWidth={1.7}
                      className="
                        transition-transform
                        duration-300
                        group-hover:scale-110
                      "
                    />

                    <div
                      className="
                        flex
                        items-center
                        gap-1
                      "
                    >
                      <span>Calculators</span>

                      <ChevronDown
                        size={12}
                        className={`
                          transition-transform
                          duration-300

                          ${calculatorOpen ? "rotate-180" : ""}
                        `}
                      />
                    </div>
                  </button>

                  {/* =========================
                      MEGA MENU
                  ========================= */}

                  <div
                    className={`
                      absolute
                      left-1/2
                      top-[70px]

                      w-[900px]

                      -translate-x-1/2
                      origin-top

                      overflow-hidden

                      rounded-2xl

                      border
                      border-black/10

                      bg-white

                      shadow-[0_25px_70px_rgba(18,45,37,0.16)]

                      transition-all
                      duration-300

                      ${
                        calculatorOpen
                          ? `
                            translate-y-0
                            scale-100
                            opacity-100
                            pointer-events-auto
                          `
                          : `
                            -translate-y-3
                            scale-95
                            opacity-0
                            pointer-events-none
                          `
                      }
                    `}
                    style={{
                      transitionTimingFunction:
                        "cubic-bezier(0.34,1.56,0.64,1)",
                    }}
                  >
                    {/* CALCULATOR CATEGORIES */}

                    <div
                      className="
                        grid
                        grid-cols-4
                        divide-x
                        divide-black/10
                        p-6
                      "
                    >
                      {calculatorGroups.map((group) => {
                        const GroupIcon = group.icon;

                        return (
                          <div
                            key={group.title}
                            className="
                              px-5
                              first:pl-0
                              last:pr-0
                            "
                          >
                            {/* CATEGORY TITLE */}

                            <div
                              className="
                                mb-4
                                flex
                                items-center
                                gap-2
                              "
                            >
                              <div
                                className="
                                  rounded-lg
                                  bg-[#eef4ed]
                                  p-2
                                  text-[#087552]
                                "
                              >
                                <GroupIcon size={18} />
                              </div>

                              <h3
                                className="
                                  text-sm
                                  font-semibold
                                  text-[#087552]
                                "
                              >
                                {group.title}
                              </h3>
                            </div>

                            {/* CATEGORY LINKS */}

                            <div className="space-y-2">
                              {group.items.map(([name, path, description]) => {
                                const isSmart = path.includes("smart-property");

                                return (
                                  <Link
                                    key={path}
                                    href={path}
                                    onClick={() => setCalculatorOpen(false)}
                                    className="
                                        block
                                        rounded-xl

                                        px-3
                                        py-2.5

                                        transition-all
                                        duration-200

                                        hover:-translate-y-[2px]
                                        hover:bg-[#f5f8f4]
                                      "
                                  >
                                    <div
                                      className="
                                          flex
                                          items-center
                                          justify-between
                                          gap-2
                                        "
                                    >
                                      <span
                                        className={`
                                            text-sm
                                            font-semibold

                                            ${
                                              pathname === path
                                                ? "text-[#087552]"
                                                : "text-[#17231f]"
                                            }
                                          `}
                                      >
                                        {name}
                                      </span>

                                      {isSmart ? (
                                        <span
                                          className="
                                              rounded-full
                                              bg-[#087552]

                                              px-2
                                              py-0.5

                                              text-[8px]
                                              font-bold
                                              text-white
                                            "
                                        >
                                          NEW
                                        </span>
                                      ) : (
                                        pathname === path && (
                                          <Check
                                            size={14}
                                            className="text-[#087552]"
                                          />
                                        )
                                      )}
                                    </div>

                                    <p
                                      className="
                                          mt-1

                                          text-xs
                                          leading-5

                                          text-[#17231f]/50
                                        "
                                    >
                                      {description}
                                    </p>
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* =========================
                        SMART RECOMMENDATION
                    ========================= */}

                    <Link
                      href="/smart-recommendation"
                      onClick={() => setCalculatorOpen(false)}
                      className="
                        group

                        flex
                        items-center
                        justify-between

                        border-t
                        border-[#087552]/10

                        bg-[#f4f7ef]

                        px-7
                        py-4

                        transition-all
                        duration-300

                        hover:bg-[#eaf1e5]
                      "
                    >
                      <div
                        className="
                          flex
                          items-center
                          gap-4
                        "
                      >
                        <Sparkles
                          size={20}
                          className="
                            text-[#087552]

                            transition-transform
                            duration-300

                            group-hover:rotate-6
                            group-hover:scale-110
                          "
                        />

                        <div>
                          <p
                            className="
                              text-sm
                              font-semibold
                              text-[#087552]
                            "
                          >
                            Smart Recommendation
                          </p>

                          <p
                            className="
                              mt-0.5
                              text-xs
                              text-[#17231f]/55
                            "
                          >
                            Get personalized Buy, Wait or Rent recommendations
                          </p>
                        </div>
                      </div>

                      <span
                        className="
                          flex
                          items-center
                          gap-1

                          text-sm
                          font-semibold
                          text-[#087552]
                        "
                      >
                        Try now
                        <ArrowUpRight
                          size={15}
                          className="
                            transition-transform
                            duration-300

                            group-hover:translate-x-1
                            group-hover:-translate-y-1
                          "
                        />
                      </span>
                    </Link>
                  </div>
                </div>
              );
            }

            /* =========================
               NORMAL NAV LINKS
            ========================= */

            return (
              <Link
                key={href}
                href={href}
                className={`
                  group
                  relative

                  flex
                  min-w-[58px]
                  flex-col
                  items-center
                  justify-center
                  gap-1.5

                  py-3

                  text-[12px]
                  font-medium

                  transition-all
                  duration-300

                  hover:-translate-y-[2px]
                  hover:text-[#087552]

                  after:absolute
                  after:-bottom-[6px]
                  after:left-1/2

                  after:h-[2px]

                  after:-translate-x-1/2
                  after:bg-[#087552]

                  after:transition-all
                  after:duration-300

                  ${
                    active(href)
                      ? "text-[#087552] after:w-full"
                      : "text-[#27332f]/70 after:w-0 hover:after:w-full"
                  }
                `}
              >
                <Icon
                  size={20}
                  strokeWidth={1.7}
                  className="
                    transition-all
                    duration-300
                    group-hover:scale-110
                  "
                />

                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* =========================
            RIGHT SIDE
        ========================= */}

        <div
          className="
            ml-2
            hidden
            items-center
            gap-3
            lg:flex
          "
        >
          <Link
            href="/signin"
            className="
              whitespace-nowrap

              px-2
              py-2

              text-sm
              font-semibold
              text-[#17231f]

              transition-all
              duration-300

              hover:-translate-y-[2px]
              hover:text-[#087552]
            "
          >
            Sign in
          </Link>

          <Link
            href="/sell"
            className="
              group

              flex
              items-center
              gap-2

              whitespace-nowrap

              rounded-full

              bg-[#0d2922]

              px-5
              py-3.5

              text-sm
              font-semibold
              text-white

              transition-all
              duration-300

              hover:-translate-y-1
              hover:scale-[1.03]
              hover:bg-[#12382e]

              hover:shadow-[0_12px_30px_rgba(13,41,34,0.22)]

              active:translate-y-0
              active:scale-95
            "
          >
            List your property
            <ArrowUpRight
              size={15}
              className="
                transition-transform
                duration-300

                group-hover:translate-x-1
                group-hover:-translate-y-1
              "
            />
          </Link>
        </div>

        {/* =========================
            MOBILE BUTTON
        ========================= */}

        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((value) => !value)}
          className="
            ml-3

            rounded-full

            border
            border-black/15

            p-2.5

            text-[#17231f]

            transition-all
            duration-300

            hover:scale-105
            hover:border-[#087552]
            hover:text-[#087552]

            lg:hidden
          "
        >
          {mobileOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {/* =========================
          MOBILE NAV
      ========================= */}

      <div
        className={`
          overflow-hidden

          border-t
          border-black/5

          bg-[#faf9f4]

          transition-all
          duration-300

          lg:hidden

          ${mobileOpen ? "max-h-[950px] opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <nav className="px-5 py-5">
          {nav.map(([label, href, Icon]) => {
            if (label === "Calculators") {
              return (
                <details
                  key={href}
                  className="
                    border-b
                    border-black/5
                    py-3
                  "
                >
                  <summary
                    className="
                      flex
                      cursor-pointer
                      list-none
                      items-center
                      gap-3

                      font-medium
                      text-[#17231f]
                    "
                  >
                    <Calculator size={18} className="text-[#087552]" />
                    Calculators
                  </summary>

                  <div
                    className="
                      mt-3
                      space-y-2
                      pl-7
                    "
                  >
                    {calculatorGroups.flatMap((group) =>
                      group.items.map(([name, path]) => (
                        <Link
                          key={path}
                          href={path}
                          onClick={() => setMobileOpen(false)}
                          className={`
                            flex
                            items-center
                            justify-between

                            py-2

                            text-sm

                            transition-all
                            duration-200

                            hover:translate-x-1
                            hover:text-[#087552]

                            ${
                              pathname === path
                                ? "font-bold text-[#087552]"
                                : "text-[#17231f]/70"
                            }
                          `}
                        >
                          {name}

                          {pathname === path && <Check size={14} />}
                        </Link>
                      )),
                    )}
                  </div>
                </details>
              );
            }

            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex
                  items-center
                  gap-3

                  border-b
                  border-black/5

                  py-3

                  font-medium

                  transition-all
                  duration-200

                  hover:translate-x-1
                  hover:text-[#087552]

                  ${active(href) ? "text-[#087552]" : "text-[#17231f]"}
                `}
              >
                <Icon size={18} strokeWidth={1.7} />

                {label}
              </Link>
            );
          })}

          {/* MOBILE BUTTONS */}

          <div
            className="
              mt-5
              grid
              grid-cols-2
              gap-3
            "
          >
            <Link
              href="/signin"
              onClick={() => setMobileOpen(false)}
              className="
                flex
                items-center
                justify-center

                rounded-full

                border
                border-[#087552]/30

                px-4
                py-3

                text-sm
                font-semibold
                text-[#087552]
              "
            >
              Sign in
            </Link>

            <Link
              href="/sell"
              onClick={() => setMobileOpen(false)}
              className="
                flex
                items-center
                justify-center
                gap-1

                rounded-full

                bg-[#0d2922]

                px-4
                py-3

                text-sm
                font-semibold
                text-white
              "
            >
              List property
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
