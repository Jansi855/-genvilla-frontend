"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Home,
  KeyRound,
  Scale,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { amountToIndianWords, money, percent } from "@/utils/currency";

import {
  calculateAffordability,
  calculateBuyVsRent,
  calculateEmi,
  calculateRentalRoi,
  calculateRisk,
  calculateTrueCost,
} from "@/lib/calculators";

import CalculatorDisclaimer from "./CalculatorDisclaimer";

/* =========================================================
   CALCULATOR CONFIG
========================================================= */

const configs = {
  emi: {
    title: "EMI Calculator",
    text: "Estimate your home-loan monthly payment and complete interest cost.",

    defaults: {
      propertyPrice: 12000000,
      downPayment: 2400000,
      interestRate: 8.5,
      tenureYears: 20,
    },

    fields: [
      ["propertyPrice", "Property price"],
      ["downPayment", "Down payment"],
      ["interestRate", "Interest rate (%)"],
      ["tenureYears", "Loan tenure (years)"],
    ],
  },

  "true-cost": {
    title: "True Cost Calculator",

    text: "See beyond the listing price with taxes, charges and loan interest together.",

    defaults: {
      propertyPrice: 12000000,
      downPayment: 2400000,
      stampDuty: 840000,
      registration: 120000,
      brokerage: 120000,
      interiors: 400000,
      interestRate: 8.5,
      tenureYears: 20,
    },

    fields: [
      ["propertyPrice", "Property price"],
      ["downPayment", "Down payment"],
      ["stampDuty", "Stamp duty"],
      ["registration", "Registration charges"],
      ["brokerage", "Brokerage"],
      ["interiors", "Interiors / furnishing"],
      ["interestRate", "Interest rate (%)"],
      ["tenureYears", "Loan tenure (years)"],
    ],
  },

  affordability: {
    title: "Affordability Check",

    text: "Understand whether a property leaves enough room in your monthly cash flow.",

    defaults: {
      monthlyIncome: 150000,
      coApplicantIncome: 0,
      monthlyExpenses: 45000,
      existingEmi: 10000,
      otherObligations: 5000,
      savings: 4000000,
      downPayment: 2400000,
      emergencyFund: 800000,
      propertyPrice: 12000000,
      interestRate: 8.5,
      tenureYears: 20,
    },

    fields: [
      ["monthlyIncome", "Monthly take-home income"],
      ["coApplicantIncome", "Co-applicant income"],
      ["monthlyExpenses", "Household expenses"],
      ["existingEmi", "Existing EMI"],
      ["otherObligations", "Other obligations"],
      ["savings", "Total liquid savings"],
      ["downPayment", "Down payment"],
      ["emergencyFund", "Desired emergency fund"],
      ["propertyPrice", "Property price"],
      ["interestRate", "Interest rate (%)"],
      ["tenureYears", "Loan tenure (years)"],
    ],
  },

  "rental-roi": {
    title: "Rental ROI Calculator",

    text: "Estimate gross and net rental yield after vacancy and recurring property costs.",

    defaults: {
      propertyPrice: 12000000,
      monthlyRent: 42000,
      annualMaintenance: 60000,
      propertyTax: 18000,
      vacancyPercent: 5,
      annualExpenses: 12000,
    },

    fields: [
      ["propertyPrice", "Property price"],
      ["monthlyRent", "Expected monthly rent"],
      ["annualMaintenance", "Annual maintenance"],
      ["propertyTax", "Property tax"],
      ["vacancyPercent", "Vacancy estimate (%)"],
      ["annualExpenses", "Other annual expenses"],
    ],
  },

  "risk-analysis": {
    title: "Risk Analysis",

    text: "Get a transparent view of the financial and property factors to consider.",

    defaults: {
      monthlyIncome: 150000,
      monthlyExpenses: 45000,
      existingEmi: 10000,
      savings: 4000000,
      downPayment: 2400000,
      emergencyFund: 800000,
      propertyPrice: 12000000,
      interestRate: 8.5,
      tenureYears: 20,
      netYield: 3.4,
    },

    fields: [
      ["monthlyIncome", "Monthly take-home income"],
      ["monthlyExpenses", "Household expenses"],
      ["existingEmi", "Existing EMI"],
      ["savings", "Total liquid savings"],
      ["downPayment", "Down payment"],
      ["emergencyFund", "Desired emergency fund"],
      ["propertyPrice", "Property price"],
      ["interestRate", "Interest rate (%)"],
      ["tenureYears", "Loan tenure (years)"],
      ["netYield", "Estimated rental yield (%)"],
    ],
  },

  "buy-vs-rent": {
    title: "Buy vs Rent",

    text: "Compare ownership costs and rental flexibility over the years you expect to stay.",

    defaults: {
      propertyPrice: 12000000,
      downPayment: 2400000,
      interestRate: 8.5,
      tenureYears: 20,
      registration: 960000,
      annualMaintenance: 60000,
      propertyTax: 18000,
      monthlyRent: 30000,
      securityDeposit: 60000,
      rentIncrease: 5,
      years: 5,
    },

    fields: [
      ["propertyPrice", "Property price"],
      ["downPayment", "Down payment"],
      ["interestRate", "Interest rate (%)"],
      ["tenureYears", "Loan tenure (years)"],
      ["registration", "Registration and upfront charges"],
      ["annualMaintenance", "Annual maintenance"],
      ["propertyTax", "Property tax"],
      ["monthlyRent", "Current monthly rent"],
      ["securityDeposit", "Security deposit"],
      ["rentIncrease", "Annual rent increase (%)"],
      ["years", "Expected years in home"],
    ],
  },
};

const schema = z.record(
  z.coerce.number().min(0, "Use a value of zero or more."),
);

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function CalculatorTool({ type }) {
  const config = configs[type];

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: config.defaults,
    mode: "onChange",
  });

  const values = watch();

  const result = useMemo(() => calculate(type, values), [type, values]);

  const isBuyVsRent = type === "buy-vs-rent";

  return (
    <main className="bg-cream">
      {/* =====================================================
          HERO
      ===================================================== */}

      {isBuyVsRent ? (
        <section className="bvr-hero relative overflow-hidden border-b border-ink/10 bg-[#edf4ef]">
          {/* soft background shapes */}
          <div className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-[#7ac9a8]/20 blur-3xl" />
          <div className="pointer-events-none absolute left-[38%] top-[-120px] h-[420px] w-[420px] rounded-full bg-[#e6d8ae]/25 blur-3xl" />

          <div className="relative mx-auto grid min-h-[560px] max-w-[1360px] lg:grid-cols-[1.02fr_.98fr]">
            {/* LEFT CONTENT */}
            <div className="bvr-fade-up flex flex-col justify-center px-5 py-12 lg:px-10 lg:py-16">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-green/15 bg-white/85 px-4 py-2 shadow-sm backdrop-blur-md">
                <Scale size={14} className="text-green" />
                <span className="text-[9px] font-bold uppercase tracking-[.18em] text-green">
                  Property Finance · Smarter Decision
                </span>
              </div>

              <h1 className="mt-6 max-w-[680px] font-serif text-5xl leading-[.96] tracking-[-.05em] text-[#142a22] sm:text-6xl lg:text-[76px]">
                Buy
                <span className="mx-3 italic text-green">vs</span>
                Rent
              </h1>

              <h2 className="mt-5 max-w-xl text-xl font-semibold text-[#26463b] md:text-2xl">
                Which choice makes more financial sense for you?
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-7 text-ink/60 md:text-base">
                Compare the real cost of owning a home against renting over the
                years you expect to stay — including EMI, upfront costs,
                maintenance, taxes and rent growth.
              </p>

              {/* 4 feature cards */}
              <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="bvr-feature-card">
                  <div className="bvr-feature-icon">
                    <Home size={18} />
                  </div>
                  <div>
                    <b className="text-xs text-[#193b30]">Ownership Cost</b>
                    <p className="mt-1 text-[10px] leading-5 text-ink/50">
                      EMI, taxes and maintenance.
                    </p>
                  </div>
                </div>

                <div className="bvr-feature-card">
                  <div className="bvr-feature-icon">
                    <KeyRound size={18} />
                  </div>
                  <div>
                    <b className="text-xs text-[#193b30]">Rental Cost</b>
                    <p className="mt-1 text-[10px] leading-5 text-ink/50">
                      Rent, deposit and annual increase.
                    </p>
                  </div>
                </div>

                <div className="bvr-feature-card">
                  <div className="bvr-feature-icon">
                    <TrendingUp size={18} />
                  </div>
                  <div>
                    <b className="text-xs text-[#193b30]">Compare Clearly</b>
                    <p className="mt-1 text-[10px] leading-5 text-ink/50">
                      Understand the cost difference.
                    </p>
                  </div>
                </div>

                <div className="bvr-feature-card">
                  <div className="bvr-feature-icon">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <b className="text-xs text-[#193b30]">Smarter Decision</b>
                    <p className="mt-1 text-[10px] leading-5 text-ink/50">
                      Make a choice that fits your goals.
                    </p>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#buy-vs-rent-calculator"
                  className="inline-flex items-center gap-3 rounded-full bg-[#0f5c46] px-6 py-3 text-sm font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-[#0b4d3b]"
                >
                  Start Comparing Now
                  <ArrowRight size={17} />
                </a>

                <a
                  href="#buy-vs-rent-calculator"
                  className="inline-flex items-center gap-2 rounded-full border border-green/15 bg-white/80 px-5 py-3 text-sm font-semibold text-[#254438] shadow-sm transition hover:-translate-y-1 hover:bg-white"
                >
                  <Sparkles size={16} className="text-green" />
                  See How It Works
                </a>
              </div>

              {/* trust row */}
              <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3">
                <span className="flex items-center gap-2 text-[10px] font-semibold text-ink/55">
                  <Check size={13} className="text-green" />
                  Dynamic comparison
                </span>

                <span className="flex items-center gap-2 text-[10px] font-semibold text-ink/55">
                  <Check size={13} className="text-green" />
                  Live calculations
                </span>

                <span className="flex items-center gap-2 text-[10px] font-semibold text-ink/55">
                  <Check size={13} className="text-green" />
                  Clear insights
                </span>
              </div>
            </div>

            {/* RIGHT SIDE WITH YOUR SAME PHOTO */}
            <div className="bvr-image-wrapper relative min-h-[420px] overflow-hidden lg:min-h-[560px]">
              {/* decorative background */}
              <img
                src="/buy-vs-rent/buy-rent-home.jpeg"
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full scale-110 object-cover opacity-15 blur-xl"
              />

              {/* YOUR ORIGINAL PHOTO — unchanged */}
              <div className="absolute inset-0 flex items-center justify-center p-4 lg:p-6">
                <img
                  src="/buy-vs-rent/buy-rent-home.jpeg"
                  alt="Buy versus rent property comparison"
                  className="bvr-main-image h-full w-full rounded-[32px] object-contain shadow-[0_30px_80px_rgba(20,55,43,.18)]"
                />
              </div>

              {/* blend into left side */}
              <div className="pointer-events-none absolute inset-y-0 left-0 w-36 bg-gradient-to-r from-[#edf4ef] via-[#edf4ef]/70 to-transparent lg:w-44" />

              {/* top-right card */}
              <div className="bvr-floating-card absolute right-6 top-7 rounded-2xl border border-white/60 bg-white/90 px-4 py-3 shadow-xl backdrop-blur-xl">
                <p className="text-[9px] font-bold uppercase tracking-[.15em] text-ink/40">
                  LONG-TERM VALUE
                </p>

                <div className="mt-1 flex items-center gap-2">
                  <TrendingUp size={16} className="text-green" />
                  <b className="text-sm text-[#17392e]">
                    Build equity for your future
                  </b>
                </div>
              </div>

              {/* quote card */}
              <div className="bvr-quote absolute bottom-8 left-10 max-w-[310px] rounded-[26px] border border-white/60 bg-white/92 p-6 shadow-2xl backdrop-blur-xl">
                <span className="font-serif text-4xl leading-none text-green">
                  “
                </span>

                <p className="mt-1 font-serif text-[22px] italic leading-8 text-[#164c3b]">
                  The right home decision starts with the right numbers.
                </p>

                <span className="mt-4 block text-[9px] font-bold uppercase tracking-[.15em] text-green">
                  GenVilla Property Intelligence
                </span>
              </div>

              {/* bottom-right mini card */}
              <div className="bvr-floating-mini absolute bottom-8 right-7 rounded-2xl border border-white/60 bg-white/90 px-4 py-3 shadow-xl backdrop-blur-xl">
                <p className="text-[9px] font-bold uppercase tracking-[.15em] text-ink/40">
                  FLEXIBILITY TODAY
                </p>

                <div className="mt-1 flex items-center gap-2">
                  <KeyRound size={15} className="text-green" />
                  <b className="text-sm text-[#17392e]">Freedom for tomorrow</b>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* ORIGINAL HERO FOR OTHER CALCULATORS */

        <section className="border-b border-ink/10 bg-[#eef1ea]">
          <div className="mx-auto max-w-[1360px] px-5 py-12 lg:px-10">
            <p className="eyebrow">PROPERTY FINANCE TOOL</p>

            <h1 className="mt-3 font-serif text-5xl tracking-[-.04em]">
              {config.title}
            </h1>

            <p className="mt-4 max-w-2xl leading-7 text-ink/60">
              {config.text}
            </p>
          </div>
        </section>
      )}

      {/* =====================================================
          CALCULATOR AREA
      ===================================================== */}

      <section className="mx-auto max-w-[1360px] px-5 py-8 md:py-12 lg:px-10">
        {/* Buy vs Rent heading */}

        {isBuyVsRent && (
          <div className="mb-7">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#e6f2eb] px-3 py-2 text-[9px] font-bold uppercase tracking-[.16em] text-green">
              <Scale size={13} />
              Live financial comparison
            </div>

            <h2 className="mt-3 font-serif text-3xl tracking-tight md:text-4xl">
              Compare your numbers
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/55">
              Adjust any value below and your Buy vs Rent comparison updates
              automatically.
            </p>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[.95fr_1.05fr]">
          {/* INPUT FORM */}

          <form
            className={
              isBuyVsRent
                ? "bvr-form rounded-[30px] border border-ink/10 bg-white p-5 shadow-[0_18px_55px_rgba(25,65,50,.07)] md:p-7"
                : "rounded-[26px] border border-ink/10 bg-white p-5 md:p-7"
            }
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[.16em] text-green">
                  YOUR DETAILS
                </p>

                <h2 className="mt-1 font-serif text-3xl">Your inputs</h2>
              </div>

              {isBuyVsRent && (
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#e7f3ed] text-green">
                  <Home size={19} />
                </span>
              )}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {config.fields.map(([name, label]) => (
                <CalculatorField
                  key={name}
                  name={name}
                  label={label}
                  value={Number(values[name]) || 0}
                  register={register}
                  setValue={setValue}
                  error={errors[name]?.message}
                />
              ))}
            </div>

            <CalculatorDisclaimer />
          </form>

          {/* RESULT PANEL */}

          <section
            aria-live="polite"
            className={
              isBuyVsRent
                ? "bvr-result relative overflow-hidden rounded-[30px] bg-[#15352c] p-5 text-white shadow-[0_24px_70px_rgba(15,53,44,.18)] md:p-7"
                : "rounded-[26px] bg-[#15352c] p-5 text-white md:p-7"
            }
          >
            {isBuyVsRent && (
              <>
                <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-[#54b88c]/10 blur-3xl" />

                <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-[#d8b867]/10 blur-3xl" />
              </>
            )}

            <div className="relative">
              <div className="flex items-center justify-between">
                <p className="eyebrow !text-[#a6cbbd]">LIVE ESTIMATE</p>

                {isBuyVsRent && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[.06] px-3 py-2 text-[9px] font-semibold text-white/60">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#72d3a6]" />
                    Updating live
                  </span>
                )}
              </div>

              <Result type={type} result={result} />

              <Link
                className="btn-light mt-7"
                href="/calculators/smart-property-analyzer"
              >
                Analyze this property
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </section>
        </div>
      </section>

      {/* =====================================================
          BUY VS RENT ANIMATIONS
      ===================================================== */}

      {isBuyVsRent && (
        <style jsx global>{`
          @keyframes bvrFadeUp {
            from {
              opacity: 0;
              transform: translateY(22px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes bvrFloat {
            0%,
            100% {
              transform: translateY(0);
            }

            50% {
              transform: translateY(-7px);
            }
          }

          .bvr-fade-up {
            opacity: 0;
            animation: bvrFadeUp 0.7s ease forwards;
          }

          .bvr-delay-1 {
            animation-delay: 0.08s;
          }

          .bvr-delay-2 {
            animation-delay: 0.16s;
          }

          .bvr-delay-3 {
            animation-delay: 0.24s;
          }

          .bvr-delay-4 {
            animation-delay: 0.32s;
          }

          /* FEATURE CARDS */

          .bvr-feature-card {
            display: flex;

            align-items: flex-start;

            gap: 11px;

            min-height: 100px;

            padding: 15px;

            border: 1px solid rgba(25, 115, 75, 0.12);

            border-radius: 18px;

            background: linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.92),
              rgba(245, 251, 248, 0.75)
            );

            box-shadow: 0 8px 25px rgba(20, 70, 50, 0.04);

            transition:
              transform 0.28s ease,
              box-shadow 0.28s ease,
              border-color 0.28s ease;
          }

          .bvr-feature-card:hover {
            transform: translateY(-6px);

            border-color: rgba(15, 151, 104, 0.32);

            box-shadow: 0 18px 38px rgba(12, 86, 61, 0.12);
          }

          .bvr-feature-icon {
            width: 40px;

            height: 40px;

            flex-shrink: 0;

            display: flex;

            align-items: center;

            justify-content: center;

            border-radius: 12px;

            background: #e2f3eb;

            color: #087c5b;

            transition:
              transform 0.28s ease,
              background 0.28s ease,
              color 0.28s ease;
          }

          .bvr-feature-card:hover .bvr-feature-icon {
            transform: rotate(-5deg) scale(1.08);

            background: #087c5b;

            color: white;
          }

          /* HERO IMAGE */

          .bvr-main-image {
            transition:
              transform 1s cubic-bezier(0.2, 0.7, 0.2, 1),
              filter 0.35s ease;
          }

          .bvr-image-wrapper:hover .bvr-main-image {
            transform: scale(1.035);

            filter: saturate(1.06) contrast(1.02);
          }

          /* FLOATING CARD */

          .bvr-floating-card {
            animation: bvrFloat 4s ease-in-out infinite;
          }

          /* QUOTE */

          .bvr-quote {
            transition:
              transform 0.3s ease,
              box-shadow 0.3s ease;
          }

          .bvr-quote:hover {
            transform: translateY(-5px);

            box-shadow: 0 24px 50px rgba(20, 50, 40, 0.18);
          }

          /* INPUT CARD */

          .bvr-form {
            transition:
              transform 0.3s ease,
              box-shadow 0.3s ease;
          }

          .bvr-form:hover {
            box-shadow: 0 24px 65px rgba(25, 65, 50, 0.1);
          }

          /* RESULT CARD */

          .bvr-result {
            transition:
              transform 0.3s ease,
              box-shadow 0.3s ease;
          }

          .bvr-result:hover {
            transform: translateY(-3px);

            box-shadow: 0 30px 80px rgba(15, 53, 44, 0.25);
          }

          /* MOBILE */

          @media (max-width: 1023px) {
            .bvr-image-wrapper {
              min-height: 440px;
            }
          }

          @media (max-width: 640px) {
            .bvr-image-wrapper {
              min-height: 350px;
            }

            .bvr-floating-card {
              right: 14px;
              top: 14px;
            }

            .bvr-quote {
              left: 14px;
              bottom: 14px;
              max-width: 235px;
              padding: 16px;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .bvr-fade-up,
            .bvr-floating-card {
              opacity: 1;

              animation: none;
            }

            .bvr-feature-card,
            .bvr-feature-icon,
            .bvr-main-image,
            .bvr-quote,
            .bvr-form,
            .bvr-result {
              transition: none;
            }
          }
        `}</style>
      )}
    </main>
  );
}

/* =========================================================
   CALCULATOR FIELD
========================================================= */

function CalculatorField({ name, label, value, register, setValue, error }) {
  const percentage = /rate|yield|vacancy|increase/i.test(name);

  const years = /tenure|years/i.test(name);

  const currency = !percentage && !years;

  const max = currency
    ? Math.max(10000000, Math.ceil(value / 100000) * 100000)
    : percentage
      ? 30
      : 40;

  const step = currency
    ? name.includes("monthly") || name.includes("Rent")
      ? 1000
      : 100000
    : percentage
      ? 0.1
      : 1;

  return (
    <label className="calc-field">
      <span>{label}</span>

      <input type="number" min="0" step={step} {...register(name)} />

      {currency && (
        <>
          <small className="text-ink/55">{amountToIndianWords(value)}</small>

          <input
            aria-label={`${label} slider`}
            aria-valuemin="0"
            aria-valuemax={max}
            aria-valuenow={value}
            className="mt-2 w-full accent-green"
            type="range"
            min="0"
            max={max}
            step={step}
            value={Math.min(value, max)}
            onChange={(e) =>
              setValue(name, Number(e.target.value), {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
          />

          <small className="flex justify-between text-ink/45">
            <span>₹0</span>

            <span>{money(max)}</span>
          </small>
        </>
      )}

      {!currency && (
        <input
          aria-label={`${label} slider`}
          className="mt-2 w-full accent-green"
          type="range"
          min="0"
          max={max}
          step={step}
          value={Math.min(value, max)}
          onChange={(e) =>
            setValue(name, Number(e.target.value), {
              shouldValidate: true,
              shouldDirty: true,
            })
          }
        />
      )}

      {error && <small>{error}</small>}
    </label>
  );
}

/* =========================================================
   CALCULATIONS
========================================================= */

function calculate(type, v) {
  if (type === "emi") {
    return calculateEmi({
      loanAmount: v.propertyPrice - v.downPayment,

      interestRate: v.interestRate,

      tenureYears: v.tenureYears,
    });
  }

  if (type === "true-cost") {
    return calculateTrueCost(v);
  }

  if (type === "affordability") {
    return calculateAffordability(v);
  }

  if (type === "rental-roi") {
    return calculateRentalRoi(v);
  }

  if (type === "risk-analysis") {
    const affordability = calculateAffordability(v);

    return {
      ...affordability,

      ...calculateRisk({
        ...affordability,

        emergencyFund: v.emergencyFund,

        possessionStatus: "Ready to Move",

        netYield: v.netYield,
      }),
    };
  }

  return calculateBuyVsRent(v);
}

/* =========================================================
   RESULTS
========================================================= */

function Result({ type, result }) {
  if (type === "emi") {
    return (
      <>
        <h2 className="mt-4 font-serif text-4xl">
          {money(result.emi, " / month")}
        </h2>

        <p className="mt-1 text-white/55">Estimated monthly EMI</p>

        <Metrics
          values={[
            ["Principal", money(result.principal)],

            ["Total interest", money(result.totalInterest)],

            ["Total payment", money(result.totalPayment)],

            ["Tenure", `${result.payments / 12} years`],
          ]}
        />
      </>
    );
  }

  if (type === "true-cost") {
    return (
      <>
        <h2 className="mt-4 font-serif text-4xl">{money(result.trueCost)}</h2>

        <p className="mt-1 text-white/55">Estimated true ownership cost</p>

        <Metrics
          values={[
            ["Listed price", money(result.propertyPrice)],

            ["Upfront purchase cost", money(result.upfrontCharges)],

            ["Loan interest", money(result.totalInterest)],

            ["Loan amount", money(result.loanAmount)],
          ]}
        />
      </>
    );
  }

  if (type === "affordability") {
    return (
      <>
        <Status status={result.status} />

        <Metrics
          values={[
            ["Proposed EMI", money(result.emi, " / month")],

            ["EMI burden", percent(result.emiBurden)],

            ["Monthly cash remaining", money(result.cashRemaining)],

            ["Savings after purchase", money(result.savingsRemaining)],
          ]}
        />
      </>
    );
  }

  if (type === "rental-roi") {
    return (
      <>
        <h2 className="mt-4 font-serif text-4xl">{percent(result.netYield)}</h2>

        <p className="mt-1 text-white/55">Estimated net rental yield</p>

        <Metrics
          values={[
            ["Annual gross rent", money(result.grossRent)],

            ["Gross yield", percent(result.grossYield)],

            ["Annual expenses", money(result.expenses + result.vacancyLoss)],

            ["Net rental income", money(result.netIncome)],
          ]}
        />
      </>
    );
  }

  if (type === "risk-analysis") {
    return (
      <>
        <Status status={result.level} />

        <Metrics
          values={[
            ["EMI burden", percent(result.emiBurden)],

            ["Monthly cash remaining", money(result.cashRemaining)],

            ["Savings after purchase", money(result.savingsRemaining)],

            ["Risk factors", String(result.flags.length)],
          ]}
        />

        <ul className="mt-5 space-y-2 text-sm text-white/65">
          {result.flags.length ? (
            result.flags.map((f) => <li key={f}>• {f}</li>)
          ) : (
            <li className="flex gap-2">
              <CheckCircle2 size={16} />
              No high-pressure factors from these inputs.
            </li>
          )}
        </ul>
      </>
    );
  }

  /* =====================================================
     BUY VS RENT RESULT
  ===================================================== */

  return (
    <>
      <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.06] px-3 py-2">
        <Scale size={13} className="text-[#9fd2b9]" />

        <p className="text-[9px] font-bold uppercase tracking-[.15em] text-[#a6cbbd]">
          Neutral Comparison
        </p>
      </div>

      <h2 className="mt-4 max-w-lg font-serif text-3xl leading-tight md:text-4xl">
        {result.conclusion}
      </h2>

      <p className="mt-2 max-w-xl text-xs leading-6 text-white/55">
        Based on the property, loan and rental assumptions you entered.
      </p>

      <Metrics
        values={[
          ["Buying total, 5 years", money(result.buyingTotal)],

          ["Renting total, 5 years", money(result.rentTotal)],

          ["Buying EMI", money(result.emi, " / month")],

          ["Monthly difference", money(result.monthlyDifference)],
        ]}
      />

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/[.05] p-4">
        <div className="flex gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#ffffff10] text-[#9fd2b9]">
            <Sparkles size={16} />
          </span>

          <div>
            <p className="text-[9px] font-bold uppercase tracking-[.15em] text-white/40">
              KEY INSIGHT
            </p>

            <p className="mt-1 text-xs leading-6 text-white/70">
              Compare the total cost difference together with how long you
              expect to stay. A lower short-term cost does not automatically
              mean it is the better long-term choice.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

/* =========================================================
   STATUS
========================================================= */

function Status({ status }) {
  return (
    <>
      <h2 className="mt-4 font-serif text-4xl">{status}</h2>

      <p className="mt-1 text-white/55">Based on the information provided</p>
    </>
  );
}

/* =========================================================
   METRICS
========================================================= */

function Metrics({ values }) {
  return (
    <div className="mt-7 grid grid-cols-2 gap-3">
      {values.map(([label, value]) => (
        <div
          className="rounded-2xl border border-white/[.04] bg-white/[.07] p-4 transition duration-300 hover:-translate-y-1 hover:bg-white/[.10]"
          key={label}
        >
          <span className="block text-xs text-white/50">{label}</span>

          <b className="mt-1 block text-sm">{value}</b>
        </div>
      ))}
    </div>
  );
}
