"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Calculator,
  TrendingUp,
  Gauge,
  Lightbulb,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { money, amountToIndianWords } from "@/utils/currency";
import { analyzeProperty } from "@/lib/calculators/propertyDecision";
import LocationAutocomplete from "@/components/location/LocationAutocomplete";
const STEPS = [
  "Property",
  "Financial Profile",
  "Financing",
  "Investment Intent",
  "Analysis",
  "Decision Report",
];
const INITIAL = {
  user: {
    monthlyIncome: 200000,
    coApplicantIncome: 0,
    monthlyExpenses: 50000,
    existingEmi: 10000,
    otherCommitments: 10000,
    savings: 4000000,
    emergencyReserve: 1000000,
    currentRent: 25000,
  },
  property: {
    price: 6500000,
    trueCost: 7000000,
    state: "Haryana",
    city: "Gurugram",
    locality: "Sector 57",
    jurisdiction: "URBAN",
    propertyType: "Apartment",
    bhk: "3 BHK",
    area: 1600,
    status: "Ready to move",
    expectedRent: 35000,
  },
  financing: {
    mode: "LOAN",
    downPayment: 3500000,
    loanAmount: 3500000,
    interestRate: 8.5,
    tenureYears: 20,
  },
  intent: { type: "SELF_USE" },
  rental: {
    vacancyRate: 5,
    annualExpenses: 60000,
    rentGrowthRate: 5,
    appreciationRate: 5,
    holdingYears: 5,
  },
  schemeProfile: {
    ownsPuccaHouse: "",
    previousHousingBenefit: "",
    familySize: 0,
  },
};
const num = (x) => Math.max(0, Number(x) || 0),
  signed = (x) => `${x >= 0 ? "+" : "−"}${money(Math.abs(x))}`,
  fitTone = (x) =>
    x >= 80
      ? "text-green"
      : x >= 65
        ? "text-[#9a6b16]"
        : x >= 50
          ? "text-[#bd671c]"
          : "text-red-700";
function Amount({ label, value, onChange, max = 10000000, step = 10000 }) {
  const upper = Math.max(max, Math.ceil(num(value) / step) * step);
  return (
    <label>
      <span className="text-[10px] font-bold uppercase tracking-[.13em] text-ink/55">
        {label}
      </span>
      <div className="mt-2 flex items-center rounded-xl border border-[#d9e5de] bg-[#fcfdfb] px-3 shadow-[0_3px_12px_rgba(20,65,48,0.03)] transition-all duration-300 focus-within:border-green/50 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(20,112,79,0.06)] hover:border-green/25">
        <span className="text-ink/40">₹</span>
        <input
          className="h-11 w-full px-2 font-semibold outline-none"
          value={value || ""}
          onChange={(e) => onChange(num(e.target.value))}
          type="number"
          min="0"
        />
      </div>
      <p className="mt-1 min-h-4 text-[10px] text-ink/45">
        {amountToIndianWords(value)}
      </p>
      <input
        aria-label={`${label} slider`}
        className="spa-range mt-2 w-full cursor-pointer accent-green"
        type="range"
        min="0"
        max={upper}
        step={step}
        value={Math.min(value, upper)}
        onChange={(e) => onChange(num(e.target.value))}
      />
      <span className="flex justify-between text-[9px] text-ink/35">
        <span>₹0</span>
        <span>{money(upper)}</span>
      </span>
    </label>
  );
}
function Num({ label, value, onChange, suffix, max = 50, step = 1 }) {
  return (
    <label>
      <span className="text-[10px] font-bold uppercase tracking-[.13em] text-ink/55">
        {label}
      </span>
      <div className="mt-2 flex items-center rounded-xl border border-[#d9e5de] bg-[#fcfdfb] px-3 shadow-[0_3px_12px_rgba(20,65,48,0.03)] transition-all duration-300 hover:border-green/30 focus-within:border-green/50 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(20,112,79,0.06)]">
        <input
          className="h-11 w-full font-semibold outline-none"
          value={value}
          onChange={(e) => onChange(num(e.target.value))}
          type="number"
          min="0"
          max={max}
          step={step}
        />
        <span className="text-xs text-ink/45">{suffix}</span>
      </div>
    </label>
  );
}
function Text({ label, value, onChange, options }) {
  return (
    <label>
      <span className="text-[10px] font-bold uppercase tracking-[.13em] text-ink/55">
        {label}
      </span>
      {options ? (
        <select
          className="mt-2 h-11 w-full rounded-xl border border-[#d9e5de] bg-[#fcfdfb] px-3 text-sm font-medium outline-none transition-all duration-300 hover:border-green/30 focus:border-green/50 focus:bg-white focus:shadow-[0_0_0_4px_rgba(20,112,79,0.06)]"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      ) : (
        <input
          className="mt-2 h-11 w-full rounded-xl border border-[#d9e5de] bg-[#fcfdfb] px-3 text-sm font-medium outline-none transition-all duration-300 hover:border-green/30 focus:border-green/50 focus:bg-white focus:shadow-[0_0_0_4px_rgba(20,112,79,0.06)]"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}
function Choice({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`spa-choice-card rounded-xl border px-4 py-3 text-left text-xs font-bold transition-all ${
        active
          ? "border-green bg-[#eaf1e9] text-green"
          : "border-ink/10 bg-white hover:border-green/30 hover:bg-[#f7fbf8]"
      }`}
    >
      {active && <Check size={11} className="mr-2 inline" />}
      {children}
    </button>
  );
}
const Grid = ({ children }) => (
  <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">{children}</div>
);
function Intro({ n, title, text }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-[#e5f5ec] px-2 text-[10px] font-bold text-green">
          {n}
        </span>

        <p className="text-[10px] font-bold uppercase tracking-[.16em] text-green">
          Smart Property Analyzer
        </p>
      </div>

      <h2 className="mt-4 font-serif text-3xl leading-tight text-[#163b30] sm:text-4xl">
        {title}
      </h2>

      <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/55">{text}</p>

      <div className="mt-5 h-px w-full bg-gradient-to-r from-green/20 via-ink/10 to-transparent" />
    </div>
  );
}
function FormStep({ step, input, set, result }) {
  const u = (group, key, value) =>
      set((x) => ({ ...x, [group]: { ...x[group], [key]: value } })),
    selectLocation = (location) =>
      set((x) => ({
        ...x,
        property: {
          ...x.property,
          city: location.city,
          locality: location.locality,
          state: location.state,
        },
      }));
  if (step === 0)
    return (
      <>
        <Intro
          n="01"
          title="Which property are you considering?"
          text="Choose a GENVILLA property when listings are available, or enter any property you found elsewhere."
        />
        <div className="mb-6 grid gap-2 sm:grid-cols-2">
          <Choice active onClick={() => {}}>
            Enter manually
          </Choice>
          <button
            type="button"
            disabled
            className="group relative overflow-hidden rounded-xl border border-dashed border-green/20 bg-[#f7fbf8] p-3 text-left text-xs font-bold text-ink/45 transition-all duration-300"
          >
            <div className="flex items-center justify-between gap-3">
              <span>Select from GENVILLA</span>

              <span className="rounded-full bg-white px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-green shadow-sm">
                Coming soon
              </span>
            </div>

            <p className="mt-1 text-[10px] font-medium leading-4 text-ink/35">
              Choose directly from GenVilla listings.
            </p>
          </button>
        </div>
        <Grid>
          <Amount
            label="Property price"
            value={input.property.price}
            onChange={(v) => u("property", "price", v)}
            max={100000000}
          />
          <Amount
            label="True acquisition cost"
            value={input.property.trueCost}
            onChange={(v) => u("property", "trueCost", v)}
            max={100000000}
          />
          <div className="sm:col-span-2 rounded-2xl border border-[#dce8e1] bg-[#f9fcfa] p-4 shadow-[0_6px_20px_rgba(20,65,48,0.04)] transition-all duration-300 hover:border-green/25 hover:shadow-[0_10px_28px_rgba(20,65,48,0.07)]"></div>
          <Text
            label="Property type"
            value={input.property.propertyType}
            onChange={(v) => u("property", "propertyType", v)}
            options={["Apartment", "Independent House", "Plot", "Commercial"]}
          />
          <Text
            label="BHK"
            value={input.property.bhk}
            onChange={(v) => u("property", "bhk", v)}
            options={["1 BHK", "2 BHK", "3 BHK", "4 BHK+"]}
          />
          <Num
            label="Area"
            value={input.property.area}
            onChange={(v) => u("property", "area", v)}
            suffix="sq ft"
            max={10000}
          />
          <Text
            label="Property status"
            value={input.property.status}
            onChange={(v) => u("property", "status", v)}
            options={["Ready to move", "Under construction", "Resale"]}
          />
        </Grid>
      </>
    );
  if (step === 1)
    return (
      <>
        <Intro
          n="02"
          title="Your financial profile"
          text="Enter this once. Every connected calculator will use the same profile."
        />
        <Grid>
          <Amount
            label="Monthly take-home income"
            value={input.user.monthlyIncome}
            onChange={(v) => u("user", "monthlyIncome", v)}
          />
          <Amount
            label="Co-applicant income"
            value={input.user.coApplicantIncome}
            onChange={(v) => u("user", "coApplicantIncome", v)}
          />
          <Amount
            label="Monthly household expenses"
            value={input.user.monthlyExpenses}
            onChange={(v) => u("user", "monthlyExpenses", v)}
            max={500000}
            step={1000}
          />
          <Amount
            label="Existing EMI"
            value={input.user.existingEmi}
            onChange={(v) => u("user", "existingEmi", v)}
            max={500000}
            step={1000}
          />
          <Amount
            label="Other fixed commitments"
            value={input.user.otherCommitments}
            onChange={(v) => u("user", "otherCommitments", v)}
            max={500000}
            step={1000}
          />
          <Amount
            label="Current rent"
            value={input.user.currentRent}
            onChange={(v) => u("user", "currentRent", v)}
            max={500000}
            step={1000}
          />
          <Amount
            label="Total savings"
            value={input.user.savings}
            onChange={(v) => u("user", "savings", v)}
            max={100000000}
          />
          <Amount
            label="Reserved emergency fund"
            value={input.user.emergencyReserve}
            onChange={(v) => u("user", "emergencyReserve", v)}
            max={10000000}
          />
        </Grid>
      </>
    );
  if (step === 2)
    return (
      <>
        <Intro
          n="03"
          title="How are you planning to purchase?"
          text="Loans are optional. If you are undecided, we estimate a comfortable loan range."
        />
        <div className="grid gap-2 sm:grid-cols-3">
          {[
            ["CASH", "Cash / Self-funded"],
            ["LOAN", "Home Loan"],
            ["UNDECIDED", "Not decided yet"],
          ].map(([mode, name]) => (
            <Choice
              key={mode}
              active={input.financing.mode === mode}
              onClick={() => u("financing", "mode", mode)}
            >
              {name}
            </Choice>
          ))}
        </div>
        {input.financing.mode !== "CASH" && (
          <div className="mt-6">
            <Grid>
              <Amount
                label="Down payment"
                value={input.financing.downPayment}
                onChange={(v) => u("financing", "downPayment", v)}
                max={50000000}
              />
              <Amount
                label="Loan amount"
                value={input.financing.loanAmount}
                onChange={(v) => u("financing", "loanAmount", v)}
                max={100000000}
              />
              <Num
                label="Interest rate"
                value={input.financing.interestRate}
                onChange={(v) => u("financing", "interestRate", v)}
                suffix="% p.a."
                step={0.1}
                max={20}
              />
              <Num
                label="Loan tenure"
                value={input.financing.tenureYears}
                onChange={(v) => u("financing", "tenureYears", v)}
                suffix="years"
                max={40}
              />
            </Grid>
          </div>
        )}
      </>
    );
  if (step === 3)
    return (
      <>
        <Intro
          n="04"
          title="What are you buying this property for?"
          text="Investment inputs appear only when rental performance is relevant."
        />
        <div className="grid gap-2 sm:grid-cols-3">
          {[
            ["SELF_USE", "Self Use"],
            ["INVESTMENT", "Investment / Rental"],
            ["NOT_SURE", "Not Sure"],
          ].map(([type, name]) => (
            <Choice
              key={type}
              active={input.intent.type === type}
              onClick={() => u("intent", "type", type)}
            >
              {name}
            </Choice>
          ))}
        </div>
        {input.intent.type === "INVESTMENT" && (
          <div className="mt-6">
            <Grid>
              <Amount
                label="Expected monthly rent"
                value={input.property.expectedRent}
                onChange={(v) => u("property", "expectedRent", v)}
                max={500000}
                step={1000}
              />
              <Num
                label="Expected vacancy"
                value={input.rental.vacancyRate}
                onChange={(v) => u("rental", "vacancyRate", v)}
                suffix="%"
                max={50}
              />
              <Amount
                label="Annual maintenance / expenses"
                value={input.rental.annualExpenses}
                onChange={(v) => u("rental", "annualExpenses", v)}
                max={1000000}
                step={1000}
              />
              <Num
                label="Holding period"
                value={input.rental.holdingYears}
                onChange={(v) => u("rental", "holdingYears", v)}
                suffix="years"
                max={30}
              />
              <Num
                label="Expected appreciation"
                value={input.rental.appreciationRate}
                onChange={(v) => u("rental", "appreciationRate", v)}
                suffix="%"
                max={25}
              />
              <Num
                label="Expected rent growth"
                value={input.rental.rentGrowthRate}
                onChange={(v) => u("rental", "rentGrowthRate", v)}
                suffix="%"
                max={25}
              />
            </Grid>
          </div>
        )}
      </>
    );
  if (step === 4) return <Analysis result={result} />;
  return <Report result={result} input={input} />;
}
function Analysis({ result }) {
  const rows = [
    ["True acquisition cost", true],
    ["Financing", true],
    ["Affordability", true],
    ["Risk", true],
    ["Rental return", !!result.rentalROI],
    ["Buy vs Rent", true],
  ];
  return (
    <>
      <Intro
        n="05"
        title="Analysis complete"
        text="Each result is calculated from your shared input—no duplicated forms or competing formulas."
      />
      <div className="relative overflow-hidden rounded-[28px] bg-[#15352c] p-6 text-white shadow-[0_18px_45px_rgba(21,53,44,0.2)] sm:p-8">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-green/10 blur-3xl" />
        <Sparkles className="text-[#b8d4c5]" />
        <h3 className="mt-4 font-serif text-3xl">Your property is analyzed.</h3>
        <p className="mt-2 text-sm text-white/60">
          Generating your explainable decision report now.
        </p>
        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          {rows.map(([name, active]) => (
            <p
              className={`rounded-xl border p-3 text-xs transition-all duration-300 ${
                active
                  ? "border-white/10 bg-white/10 hover:-translate-y-0.5 hover:bg-white/15"
                  : "border-white/5 bg-white/5 text-white/35"
              }`}
            >
              {active ? "✓" : "—"} {name}
              {!active && " · Not applicable"}
            </p>
          ))}
        </div>
      </div>
    </>
  );
}
const Section = ({ eyebrow, title, children }) => (
  <section>
    <p className="eyebrow">{eyebrow}</p>
    <h3 className="mt-1 font-serif text-2xl">{title}</h3>
    {children}
  </section>
);
function Card({ label, value, sub, good }) {
  return (
    <div className="spa-report-card rounded-2xl border border-[#dce8e1] bg-white p-4 shadow-[0_6px_20px_rgba(20,65,48,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-green/25 hover:shadow-[0_14px_34px_rgba(20,65,48,0.08)]">
      <small className="text-[9px] font-bold uppercase tracking-widest text-ink/45">
        {label}
      </small>
      <b className={`mt-2 block text-xl ${good ? "text-green" : ""}`}>
        {value}
      </b>
      {sub && <p className="mt-1 text-[10px] leading-4 text-ink/50">{sub}</p>}
    </div>
  );
}
function Report({ result, input }) {
  const r = result.risk,
    m = result.risk.metrics,
    rec = result.recommendation,
    cost = result.trueCost;
  return (
    <div>
      <Intro
        n="06"
        title="GenVilla Property Decision Report"
        text="A financial planning and property comparison view—not a guarantee or loan approval."
      />
      <div className="relative overflow-hidden rounded-[30px] bg-[#15352c] p-6 text-white shadow-[0_20px_55px_rgba(21,53,44,0.22)] sm:p-8">
        <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-green/10 blur-3xl" />
        <p className="text-[10px] font-bold tracking-[.2em] text-[#b8d4c5]">
          GENVILLA PROPERTY DECISION REPORT
        </p>
        <h3 className="mt-3 font-serif text-3xl">
          {input.property.bhk} {input.property.propertyType}
        </h3>
        <p className="mt-1 text-sm text-white/60">
          {input.property.locality}, {input.property.city}
        </p>
        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          <div>
            <small className="text-white/45">LISTING PRICE</small>
            <b className="mt-1 block text-xl">{money(cost.listingPrice)}</b>
          </div>
          <div>
            <small className="text-white/45">EXPECTED TRUE COST</small>
            <b className="mt-1 block text-xl">{money(cost.expected)}</b>
            <p className="mt-1 text-[10px] text-white/45">
              {amountToIndianWords(cost.expected)}
            </p>
          </div>
          <div>
            <small className="text-white/45">GENVILLA FIT SCORE</small>
            <b className="mt-1 block font-serif text-4xl">
              {rec.fitScore}
              <span className="text-lg text-white/40"> / 100</span>
            </b>
            <p className="mt-1 text-xs font-bold text-[#b8d4c5]">{rec.label}</p>
          </div>
        </div>
      </div>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          label="Monthly cash flow"
          value={`${m.cashFlowType} ${money(Math.abs(m.monthlyBalance))}`}
          good={m.monthlyBalance >= 0}
        />
        <Card
          label="Overall risk"
          value={`${r.overall.score} / 100`}
          sub={r.overall.label}
        />
        <Card
          label="Emergency buffer"
          value={`${m.emergencyBufferMonths.toFixed(1)} months`}
        />
        <Card
          label="Analysis confidence"
          value={`${result.confidence}%`}
          sub="Based on data you provided"
        />
      </div>
      <div className="mt-8 grid gap-8 xl:grid-cols-2">
        <Section eyebrow="TRUE COST & FINANCING" title="Purchase position">
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Card
              label="Additional acquisition cost"
              value={money(cost.estimatedBuyingCosts)}
            />
            <Card
              label="Monthly EMI"
              value={
                input.financing.mode === "CASH"
                  ? "Not applicable"
                  : money(result.emi.emi)
              }
            />
            <Card
              label="Comfortable loan range"
              value={money(m.comfortableMaximum)}
            />
            <Card
              label="Selected loan"
              value={
                input.financing.mode === "CASH"
                  ? "Cash funded"
                  : money(result.emi.loanAmount)
              }
            />
          </div>
        </Section>
        <Section eyebrow="AFFORDABILITY" title="Can this fit comfortably?">
          <div className="mt-4 rounded-2xl border border-ink/10 p-5">
            <b className="font-serif text-4xl">
              {Math.round(100 - r.pillars.affordability.normalizedPercentage)}
              <span className="text-base text-ink/40"> / 100</span>
            </b>
            <p className="mt-2 text-xs text-ink/55">
              Comfortable property range {money(m.comfortableMaximum)} · True
              cost {money(cost.expected)}
            </p>
            <p
              className={`mt-3 text-sm font-bold ${m.affordabilityGap <= 0 ? "text-green" : "text-red-700"}`}
            >
              {m.affordabilityGap <= 0
                ? "Within comfortable range"
                : `${money(m.affordabilityGap)} above comfortable range`}
            </p>
          </div>
        </Section>
      </div>
      <div className="mt-8">
        <Section eyebrow="MONTHLY CASH FLOW" title="Your ongoing position">
          <div className="mt-4 max-w-lg space-y-2 rounded-2xl border border-ink/10 p-5 text-sm">
            <Line label="Income" value={money(m.totalIncome)} />
            <Line
              label="Household + commitments"
              value={`−${money(input.user.monthlyExpenses + input.user.otherCommitments)}`}
            />
            <Line
              label="Existing EMI"
              value={`−${money(input.user.existingEmi)}`}
            />
            <Line label="New EMI" value={`−${money(result.emi.emi)}`} />
            <Line
              label={
                m.cashFlowType === "SURPLUS"
                  ? "MONTHLY SURPLUS"
                  : "MONTHLY DEFICIT"
              }
              value={money(Math.abs(m.monthlyBalance))}
              strong
            />
          </div>
        </Section>
      </div>
      <div className="mt-8">
        <Section eyebrow="PROPERTY PURCHASE RISK" title="Risk pillars">
          <div className="mt-4 space-y-3">
            {Object.entries(r.pillars)
              .filter(([, p]) => p.applicable)
              .map(([name, p]) => (
                <div
                  className="grid items-center gap-3 sm:grid-cols-[150px_1fr_120px]"
                  key={name}
                >
                  <b className="text-xs">
                    {name.replace(/^./, (x) => x.toUpperCase())}
                  </b>
                  <span className="relative h-2.5 overflow-hidden rounded-full bg-[#e8eee9]">
                    <i
                      className={`block h-full rounded-full transition-all duration-700 ${
                        p.normalizedPercentage < 35
                          ? "bg-green"
                          : p.normalizedPercentage < 65
                            ? "bg-[#c99a2e]"
                            : "bg-[#b8573d]"
                      }`}
                      style={{ width: `${p.normalizedPercentage}%` }}
                    />
                  </span>
                  <small className="text-right font-bold">{p.label}</small>
                </div>
              ))}
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <Card
              label="Severe stress balance"
              value={signed(r.scenarios.severe.monthlyBalance)}
              good={r.scenarios.severe.monthlyBalance >= 0}
            />
            <Card
              label="FOIR under stress"
              value={`${r.scenarios.severe.foir.toFixed(1)}%`}
            />
            <Card
              label="Main pressure point"
              value={r.mainPressurePoint.replace(/^./, (x) => x.toUpperCase())}
            />
          </div>
        </Section>
      </div>
      {result.rentalROI && (
        <div className="mt-8">
          <Section eyebrow="RENTAL PERFORMANCE" title="Investment return">
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <Card
                label="Expected rent"
                value={`${money(input.property.expectedRent)}/mo`}
              />
              <Card
                label="Gross yield"
                value={`${result.rentalROI.grossRentalYield.toFixed(1)}%`}
              />
              <Card
                label="Net yield"
                value={`${result.rentalROI.netRentalYield.toFixed(1)}%`}
              />
              <Card
                label="Rental cash flow"
                value={signed(result.rentalROI.monthlyCashFlow)}
                good={result.rentalROI.monthlyCashFlow >= 0}
              />
              <Card
                label="Break-even rent"
                value={money(result.rentalROI.breakEvenRent)}
              />
            </div>
          </Section>
        </div>
      )}
      <div className="mt-10 grid gap-6 lg:gap-8 xl:grid-cols-2">
        <Section
          eyebrow="WHY THIS RESULT?"
          title="Strongest factors and concerns"
        >
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs font-bold text-green">STRONGEST FACTORS</p>
              {rec.strengths.map((x) => (
                <p className="mt-3 text-xs leading-5" key={x}>
                  ✓ {x}
                </p>
              ))}
            </div>
            <div>
              <p className="text-xs font-bold text-red-700">MAIN CONCERNS</p>
              {rec.concerns.map((x) => (
                <p className="mt-3 text-xs leading-5" key={x}>
                  ⚠ {x}
                </p>
              ))}
            </div>
          </div>
        </Section>
        <Section eyebrow="DECISION DRIVERS" title="What moves your fit score">
          <div className="mt-4 space-y-3">
            {rec.drivers.map((d) => (
              <div
                className="grid grid-cols-[120px_1fr_46px] items-center gap-3 text-xs"
                key={d.name}
              >
                <span>{d.name}</span>
                <span className="h-2 overflow-hidden rounded-full bg-ink/10">
                  <i
                    className="block h-full rounded-full bg-green"
                    style={{ width: `${d.score}%` }}
                  />
                </span>
                <b>{d.score}</b>
              </div>
            ))}
          </div>
        </Section>
      </div>
      <div className="mt-8">
        <Section eyebrow="HOW SENSITIVE IS THIS?" title="Fit-score scenarios">
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {result.sensitivity.map((s) => (
              <Card
                key={s.name}
                label={s.name}
                value={`${rec.fitScore} → ${s.fitScore}`}
                sub="Rerun with the same engine"
              />
            ))}
          </div>
        </Section>
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/calculators/risk-analysis" className="btn-outline">
          See detailed Risk Analysis <ArrowRight size={15} />
        </Link>
        <button
          className="btn-dark"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Compare another property
        </button>
      </div>
    </div>
  );
}
function SchemeBenefit({ matches }) {
  return (
    <section className="mt-8 rounded-2xl border border-ink/10 bg-[#eef1ea] p-5">
      <p className="eyebrow">GOVERNMENT BENEFITS FOR YOU</p>
      <h3 className="mt-1 font-serif text-2xl">Potential scheme matches</h3>
      <p className="mt-2 text-xs leading-5 text-ink/55">
        These are pre-screening results. Confirm ownership, prior-benefit and
        jurisdiction details in the Schemes section before relying on a match.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {matches.map((m) => (
          <div className="rounded-xl bg-white p-4" key={m.schemeId}>
            <b>PMAY-U 2.0</b>
            <p className="mt-2 text-[10px] font-bold text-[#9a6b16]">
              {m.status}
            </p>
            <p className="mt-2 text-xs text-ink/55">
              {m.confirmed || "Additional information required"}
            </p>
            <Link
              href={`/schemes/${m.slug}`}
              className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-green"
            >
              View Scheme <ArrowRight size={13} />
            </Link>
          </div>
        ))}
      </div>
      <Link
        href="/schemes"
        className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-green"
      >
        Explore All Government Schemes <ArrowRight size={14} />
      </Link>
    </section>
  );
}
function Line({ label, value, strong }) {
  return (
    <div
      className={`flex justify-between border-b border-ink/10 pb-2 ${strong ? "pt-2 text-base font-bold text-green" : ""}`}
    >
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}
export default function Page() {
  const [input, setInput] = useState(INITIAL);
  const [step, setStep] = useState(0);

  const result = useMemo(() => analyzeProperty(input), [input]);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f6f4ed]">
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-ink/10 bg-[#edf4ef]">
          <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-green/10 blur-3xl" />
          <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#d9eade] blur-3xl" />

          <div className="relative mx-auto grid min-w-0 max-w-[1320px] lg:grid-cols-2">
            {/* LEFT */}
            <div className="spa-fade-up flex min-w-0 flex-col justify-center px-5 py-12 lg:px-10 lg:py-16">
              <div className="inline-flex max-w-full w-fit items-center gap-2 rounded-full border border-green/15 bg-white/80 px-4 py-2">
                <Sparkles size={14} className="text-green" />

                <span className="min-w-0 text-[9px] font-bold uppercase leading-4 tracking-[.16em] text-green">
                  One Property · One Financial Picture
                </span>
              </div>

              <h1 className="mt-6 max-w-xl font-serif text-5xl leading-[.95] text-[#14382d] sm:text-6xl">
                Smart Property
                <em className="ml-3 font-normal text-green">Analyzer</em>
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-7 text-ink/60">
                True Cost, EMI, affordability, risk, rental return and
                buy-vs-rent — all in one clear property decision.
              </p>

              {/* FEATURES */}
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <Feature
                  icon={<Calculator size={19} />}
                  title="Financial Analysis"
                  text="One shared property picture"
                />

                <Feature
                  icon={<Gauge size={19} />}
                  title="Affordability"
                  text="Know what fits comfortably"
                />

                <Feature
                  icon={<ShieldCheck size={19} />}
                  title="Risk Insights"
                  text="Understand pressure points"
                />

                <Feature
                  icon={<TrendingUp size={19} />}
                  title="Investment View"
                  text="Compare long-term potential"
                />
              </div>

              <a
                href="#smart-analyzer-form"
                className="spa-primary-btn mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-[#15352c] px-6 py-3 text-sm font-bold text-white"
              >
                Analyze Your Property
                <ArrowRight size={16} />
              </a>
            </div>

            {/* RIGHT IMAGE */}
            <div className="relative min-w-0 min-h-[430px] overflow-hidden p-6 lg:min-h-[550px] lg:p-8">
              <img
                src="/smart-analyzer/property-analyzer-hero.jpg"
                alt=""
                className="absolute inset-0 h-full w-full scale-110 object-contain opacity-10 blur-xl"
              />

              <img
                src="/smart-analyzer/property-analyzer-hero.jpg"
                alt="Smart Property Analyzer"
                className="spa-hero-image relative z-10 h-full w-full rounded-[32px] object-contain shadow-2xl"
              />

              <div className="spa-side-card absolute bottom-10 left-10 z-20 max-w-[250px] rounded-2xl bg-white/90 p-4 shadow-xl backdrop-blur">
                <p className="text-[9px] font-bold uppercase tracking-widest text-ink/40">
                  SMARTER INSIGHTS
                </p>

                <b className="mt-1 block text-sm text-[#15352c]">
                  Better property decisions
                </b>
              </div>

              <div className="spa-side-card absolute bottom-4 left-4 z-20 max-w-[220px] rounded-2xl bg-white/90 p-3 shadow-xl backdrop-blur sm:bottom-6 sm:left-6 sm:max-w-[240px] sm:p-4 lg:bottom-10 lg:left-10 lg:max-w-[250px]">
                <Lightbulb size={17} className="text-green" />

                <p className="mt-2 font-serif text-lg italic text-[#15352c]">
                  Turn property data into clarity.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* STEP NAV */}
        <div className="sticky top-0 z-30 border-b border-ink/10 bg-white/95 backdrop-blur">
          <nav className="mx-auto flex max-w-[1320px] overflow-x-auto px-5 lg:px-10">
            {STEPS.map((name, i) => (
              <button
                key={name}
                type="button"
                onClick={() => setStep(i)}
                className={`spa-step min-w-fit rounded-t-xl border-b-2 px-4 py-4 text-[10px] font-bold uppercase tracking-[0.08em] transition-all duration-300 ${
                  step === i
                    ? "border-green bg-[#eef7f2] text-green"
                    : "border-transparent text-ink/40 hover:bg-[#f7faf8] hover:text-green"
                }`}
              >
                {String(i + 1).padStart(2, "0")} · {name}
              </button>
            ))}
          </nav>
        </div>

        {/* MAIN */}
        <div
          id="smart-analyzer-form"
          className="mx-auto grid max-w-[1240px] gap-6 px-5 py-8 lg:grid-cols-[1fr_280px] lg:px-10"
        >
          {/* FORM */}
          <section className="spa-main-card relative overflow-hidden rounded-[30px] border border-[#dce8e1] bg-white p-5 shadow-[0_18px_55px_rgba(20,65,48,0.07)] sm:p-8">
            <div className="mb-7">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-ink/40">
                  Analysis Progress
                </span>

                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[#eef7f2] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-green">
                    Step {step + 1} of {STEPS.length}
                  </span>

                  <span className="text-[10px] font-bold text-green">
                    {Math.round(((step + 1) / STEPS.length) * 100)}%
                  </span>
                </div>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-[#e8eee9]">
                <div
                  className="spa-progress-fill h-full rounded-full bg-green transition-all duration-500"
                  style={{
                    width: `${((step + 1) / STEPS.length) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div key={step} className="spa-step-content">
              <FormStep
                step={step}
                input={input}
                set={setInput}
                result={result}
              />
            </div>

            <div className="mt-9 flex items-center justify-between border-t border-ink/10 pt-5">
              <button
                type="button"
                disabled={step === 0}
                className="inline-flex items-center gap-2 rounded-full border border-[#cfded6] bg-white px-5 py-3 text-sm font-bold text-[#15352c] transition-all duration-300 hover:-translate-y-0.5 hover:border-green/40 hover:bg-[#f7fbf8] hover:shadow-[0_8px_20px_rgba(20,70,52,0.08)] disabled:cursor-not-allowed disabled:opacity-30"
                onClick={() => setStep((x) => x - 1)}
              >
                <ChevronLeft size={15} />
                Previous
              </button>

              <span className="text-[10px] text-ink/35">{step + 1} of 6</span>

              {step < 5 ? (
                <button
                  type="button"
                  className="spa-primary-btn inline-flex items-center gap-2 rounded-full bg-[#15352c] px-6 py-3 text-sm font-bold text-white shadow-[0_10px_24px_rgba(21,53,44,0.16)]"
                  onClick={() => setStep((x) => x + 1)}
                >
                  {step === 4 ? "View Decision Report" : "Continue"}

                  <ChevronRight size={15} />
                </button>
              ) : (
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => setStep(0)}
                >
                  Edit analysis
                </button>
              )}
            </div>
          </section>

          {/* SIDEBAR */}
          <aside className="space-y-4">
            <div className="spa-side-card rounded-[24px] border border-ink/10 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#e5f5ec] text-green">
                  <Lightbulb size={18} />
                </span>
                <div>
                  <b className="block text-sm text-[#15352c]">
                    Why these details matter
                  </b>

                  <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-[#eaf5ef] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-green">
                    <span className="h-1.5 w-1.5 rounded-full bg-green" />
                    Live analysis
                  </div>
                </div>
              </div>

              <p className="mt-4 text-xs leading-6 text-ink/55">
                Your property and financial details help GenVilla create a more
                useful analysis.
              </p>

              <div className="mt-5 space-y-3">
                {[
                  "More accurate analysis",
                  "Personalized recommendations",
                  "Compare buy vs rent",
                  "Understand financial risk",
                ].map((item) => (
                  <p
                    key={item}
                    className="flex items-center gap-2 text-xs text-ink/60"
                  >
                    <Check size={12} className="text-green" />
                    {item}
                  </p>
                ))}
              </div>
            </div>

            <div className="spa-side-card overflow-hidden rounded-[24px] border border-ink/10 bg-white shadow-sm">
              <img
                src="/smart-analyzer/property-analyzer.jpg"
                alt="Property analysis"
                className="spa-sidebar-image h-44 w-full object-cover"
              />

              <div className="p-5">
                <p className="eyebrow">SMARTER PROPERTY DECISIONS</p>

                <h3 className="mt-2 font-serif text-xl">
                  Better insights.
                  <br />
                  Brighter future.
                </h3>
              </div>
            </div>
          </aside>
        </div>

        {/* DISCLAIMER */}
        <div className="mx-auto max-w-[1240px] px-5 pb-10 lg:px-10">
          <div className="flex gap-3 rounded-2xl border border-ink/10 bg-white p-5 text-xs leading-5 text-ink/55">
            <ShieldCheck className="shrink-0 text-green" size={18} />

            <p>
              GenVilla analysis is a financial planning and comparison tool.
              Results are estimates and not legal, investment or loan-approval
              advice.
            </p>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .spa-range {
          height: 6px;
          border-radius: 999px;
          outline: none;
          transition: opacity 0.25s ease;
        }

        .spa-range:hover {
          opacity: 0.85;
        }

        .spa-range::-webkit-slider-thumb {
          cursor: grab;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .spa-range::-webkit-slider-thumb:hover {
          transform: scale(1.18);
        }

        .spa-range::-webkit-slider-thumb:active {
          cursor: grabbing;
          transform: scale(1.1);
        }
        @keyframes spaProgressShine {
          0% {
            transform: translateX(-100%);
          }

          100% {
            transform: translateX(100%);
          }
        }

        .spa-progress-fill {
          position: relative;
          overflow: hidden;
        }

        .spa-progress-fill::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.55),
            transparent
          );
          transform: translateX(-100%);
          animation: spaProgressShine 2.4s ease-in-out infinite;
        }

        @keyframes spaStepEnter {
          from {
            opacity: 0;
            transform: translateY(12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .spa-step-content {
          animation: spaStepEnter 0.4s ease-out;
        }
        @keyframes spaFadeUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spaFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-7px);
          }
        }

        .spa-fade-up {
          animation: spaFadeUp 0.7s ease forwards;
        }

        .spa-float {
          animation: spaFloat 4s ease-in-out infinite;
        }

        .spa-feature-card,
        .spa-side-card,
        .spa-main-card,
        .spa-choice-card {
          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease,
            border-color 0.3s ease;
        }

        .spa-main-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 24px 65px rgba(20, 65, 48, 0.1);
          border-color: rgba(20, 112, 79, 0.18);
        }

        .spa-feature-card:hover,
        .spa-side-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 18px 40px rgba(20, 70, 52, 0.1);
        }

        .spa-choice-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(20, 70, 52, 0.08);
          border-color: rgba(20, 112, 79, 0.35);
        }

        .spa-hero-image {
          transition: transform 0.8s ease;
        }

        .spa-hero-image:hover {
          transform: scale(1.03);
        }

        .spa-sidebar-image {
          transition: transform 0.6s ease;
        }

        .spa-side-card:hover .spa-sidebar-image {
          transform: scale(1.05);
        }

        .spa-primary-btn {
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease;
        }

        .spa-primary-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(10, 70, 52, 0.2);
        }

        .spa-step {
          position: relative;
          transition:
            color 0.25s ease,
            background-color 0.25s ease,
            transform 0.25s ease;
        }

        .spa-step:hover {
          transform: translateY(-1px);
        }

        .spa-step::after {
          content: "";
          position: absolute;
          left: 50%;
          bottom: -1px;
          width: 0;
          height: 2px;
          border-radius: 999px;
          background: #14704f;
          transform: translateX(-50%);
          transition: width 0.3s ease;
        }

        .spa-step:hover::after {
          width: 55%;
        }
      `}</style>

      <Footer />
    </>
  );
}

function Feature({ icon, title, text }) {
  return (
    <div className="spa-feature-card rounded-[20px] border border-green/10 bg-white/80 p-4 shadow-sm backdrop-blur">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#e5f5ec] text-green">
          {icon}
        </span>

        <div>
          <b className="text-sm text-[#15352c]">{title}</b>

          <p className="mt-1 text-[11px] text-ink/50">{text}</p>
        </div>
      </div>
    </div>
  );
}
