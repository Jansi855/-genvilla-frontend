"use client";
import { memo, useCallback, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Pencil,
  ShieldCheck,
  MapPin,
} from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { money } from "@/utils/currency";
import LocationAutocomplete from "@/components/location/LocationAutocomplete";

const STATUS = {
    APPLICABLE: "APPLICABLE",
    NOT_APPLICABLE: "NOT_APPLICABLE",
    DETAILS_REQUIRED: "DETAILS_REQUIRED",
    RULE_UNAVAILABLE: "RULE_UNAVAILABLE",
  },
  STEPS = ["Location", "Property", "Buyer", "Additional Costs", "Review"];
const HARYANA_RULES = [
  ["Urban", "Male", 0.07],
  ["Urban", "Female", 0.05],
  ["Rural", "Male", 0.05],
  ["Rural", "Female", 0.03],
].map(([areaType, buyer, rate]) => ({
  areaType,
  buyer,
  rate,
  effectiveFrom: "2025-01-01",
  source: "Revenue and Disaster Management Department, Haryana",
  sourceUrl: "https://revenueharyana.gov.in/faq/",
}));
const ESTIMATE_RULES = {
  brokerage: {
    label: "Brokerage",
    type: "PERCENT",
    low: 0.005,
    expected: 0.01,
    high: 0.015,
    basis: "listing price",
  },
  legal: {
    label: "Legal Verification",
    low: 10000,
    expected: 20000,
    high: 35000,
    basis: "typical professional fee",
  },
  documentation: {
    label: "Documentation / Deed Assistance",
    low: 5000,
    expected: 12000,
    high: 20000,
    basis: "typical service fee",
  },
  inspection: {
    label: "Property Inspection",
    low: 4000,
    expected: 8000,
    high: 15000,
    basis: "typical inspection fee",
  },
  moving: {
    label: "Moving / Initial Setup",
    low: 10000,
    expected: 25000,
    high: 50000,
    basis: "planning estimate",
  },
  maintenance: {
    label: "Society / Maintenance Cost",
    low: 5000,
    expected: 15000,
    high: 30000,
    basis: "initial non-government cost",
  },
};
const initialState = {
  location: {
    state: "",
    district: "",
    tehsil: "",
    locality: "",
    wardOrPargana: "",
    areaType: "",
  },
  property: {
    type: "Apartment",
    status: "Ready to Move",
    price: 0,
    marketValue: 0,
    area: 0,
    areaUnit: "sq.ft.",
    residentialCategory: "",
  },
  buyer: { type: "Male" },
  estimatedCosts: Object.fromEntries(
    Object.keys(ESTIMATE_RULES).map((id) => [
      id,
      { included: false, mode: "estimate", customAmount: 0 },
    ]),
  ),
  customCosts: { other: 0 },
  loanInterest: false,
};
const num = (value) => Math.max(0, Number(value) || 0),
  result = (status, extra = {}) => ({
    status,
    amount: 0,
    rate: null,
    calculationBase: 0,
    explanation: "",
    source: "",
    sourceType: "GOVERNMENT",
    effectiveFrom: null,
    ...extra,
  });
function resolveChargeableValue(property) {
  const price = num(property.price),
    market = num(property.marketValue);
  return market > 0 ? Math.max(price, market) : price;
}
function resolveStampDuty(form, base) {
  const { state, areaType } = form.location,
    buyer = form.buyer.type;
  if (!state)
    return result(STATUS.DETAILS_REQUIRED, {
      explanation: "Select a state to resolve Stamp Duty.",
    });
  if (!base)
    return result(STATUS.DETAILS_REQUIRED, {
      explanation: "Enter the property price.",
    });
  if (state === "Uttar Pradesh")
    return result(STATUS.RULE_UNAVAILABLE, {
      calculationBase: base,
      explanation:
        "Exact UP Stamp Duty needs the official IGRSUP document and locality rule. No universal rate is assumed.",
      source: "UP IGRSUP Stamp Duty e-Calculator",
      sourceUrl: "https://www.igrsup.gov.in/igrsup/stampFeesCalculator",
    });
  if (state === "Delhi")
    return result(STATUS.RULE_UNAVAILABLE, {
      calculationBase: base,
      explanation:
        "Exact Delhi Stamp Duty depends on buyer and property jurisdiction details. Enter the verified amount as a custom cost rather than relying on an assumed rate.",
    });
  if (state !== "Haryana")
    return result(STATUS.RULE_UNAVAILABLE, {
      explanation:
        "A stamp-duty rule is not configured for the selected location.",
    });
  if (!areaType || !buyer)
    return result(STATUS.DETAILS_REQUIRED, {
      explanation: "Select Area Type and Buyer to calculate Stamp Duty.",
    });
  const rule = HARYANA_RULES.find(
    (x) => x.areaType === areaType && x.buyer === buyer,
  );
  if (!rule)
    return result(STATUS.RULE_UNAVAILABLE, {
      calculationBase: base,
      explanation: "No configured Haryana rule matches these details.",
    });
  return result(STATUS.APPLICABLE, {
    amount: base * rule.rate,
    rate: rule.rate,
    calculationBase: base,
    explanation: `${Math.round(rule.rate * 100)}% Haryana ${areaType.toLowerCase()} ${buyer.toLowerCase()} rule.`,
    ...rule,
  });
}
function resolveRegistrationFee(form, base) {
  if (form.location.state !== "Uttar Pradesh")
    return result(STATUS.RULE_UNAVAILABLE, {
      explanation:
        "A registration rule is not configured for the selected location. Add a verified amount as a custom cost.",
    });
  if (!base)
    return result(STATUS.DETAILS_REQUIRED, {
      explanation: "Enter the property price.",
    });
  const raw = base * 0.02;
  return result(STATUS.APPLICABLE, {
    amount: Math.min(20000, Math.max(100, raw)),
    rate: 0.02,
    rawAmount: raw,
    minimum: 100,
    maximum: 20000,
    calculationBase: base,
    explanation: "2% of relevant value; minimum ₹100 and maximum ₹20,000.",
    source: "UP published registration-fee table",
    sourceUrl: "https://www.igrsup.gov.in/",
    effectiveFrom: "Configured dataset",
  });
}
function resolveGST(form) {
  const { status, residentialCategory, price } = form.property,
    base = num(price);
  if (!base)
    return result(STATUS.DETAILS_REQUIRED, {
      explanation: "Enter the property price.",
    });
  if (status === "Ready to Move" || status === "Resale")
    return result(STATUS.NOT_APPLICABLE, {
      explanation:
        "Configured completed/resale property treatment: construction-service GST is not applicable.",
      source: "Configured GST property treatment",
    });
  if (!residentialCategory)
    return result(STATUS.DETAILS_REQUIRED, {
      explanation:
        "Select a residential category for an under-construction property.",
    });
  const rate = residentialCategory === "Affordable Residential" ? 0.01 : 0.05;
  return result(STATUS.APPLICABLE, {
    amount: base * rate,
    rate,
    calculationBase: base,
    explanation: `${rate * 100}% configured under-construction residential treatment.`,
    source: "Configured GST residential treatment",
    effectiveFrom: "Configured dataset",
  });
}
const resolveOtherGovernmentCharges = () =>
  result(STATUS.NOT_APPLICABLE, {
    explanation:
      "No additional government charge is configured for this scenario.",
  });
function normalizeInputs(form) {
  return {
    ...form,
    property: {
      ...form.property,
      price: num(form.property.price),
      marketValue: num(form.property.marketValue),
      area: num(form.property.area),
    },
  };
}
function applicableAmount(chargeResult) {
  return chargeResult?.status === STATUS.APPLICABLE
    ? num(chargeResult.amount)
    : 0;
}
function calculateCompleteness(form, government) {
  const checks = [
    form.property.price > 0,
    !!form.location.state,
    !!form.location.areaType,
    !!form.buyer.type,
    form.property.marketValue > 0,
    [STATUS.APPLICABLE, STATUS.NOT_APPLICABLE].includes(
      government.stampDuty.status,
    ),
    [STATUS.APPLICABLE, STATUS.NOT_APPLICABLE].includes(
      government.registration.status,
    ),
    [STATUS.APPLICABLE, STATUS.NOT_APPLICABLE].includes(government.gst.status),
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}
function calculateConfidence(government, marketValue) {
  const unresolved = Object.values(government).filter(
    (x) =>
      x?.status === STATUS.DETAILS_REQUIRED ||
      x?.status === STATUS.RULE_UNAVAILABLE,
  ).length;
  if (!unresolved && marketValue > 0) return "HIGH";
  if (unresolved <= 1) return "MEDIUM";
  return "LOW";
}
function resolveMarketEstimates(form, propertyPrice) {
  const items = Object.entries(ESTIMATE_RULES).map(([id, rule]) => {
      const input = form.estimatedCosts[id],
        factor = rule.type === "PERCENT" ? propertyPrice : 1,
        values = {
          low: rule.low * factor,
          expected: rule.expected * factor,
          high: rule.high * factor,
        };
      if (input.mode === "custom")
        values.low = values.expected = values.high = num(input.customAmount);
      return {
        id,
        ...rule,
        ...input,
        ...values,
        sourceType: input.mode === "custom" ? "YOUR_VALUE" : "MARKET_ESTIMATE",
      };
    }),
    included = items.filter((x) => x.included);
  return {
    low: included.reduce((s, x) => s + x.low, 0),
    expected: included.reduce((s, x) => s + x.expected, 0),
    high: included.reduce((s, x) => s + x.high, 0),
    items,
  };
}
function calculateTrueCost(rawForm) {
  const form = normalizeInputs(rawForm),
    propertyPrice = form.property.price,
    governmentValue = form.property.marketValue,
    chargeableValue = resolveChargeableValue(form.property),
    stampDuty = resolveStampDuty(form, chargeableValue),
    registration = resolveRegistrationFee(form, chargeableValue),
    gst = resolveGST(form),
    other = resolveOtherGovernmentCharges(),
    government = { stampDuty, registration, gst, other };
  const governmentTotal = Object.values(government).reduce(
      (sum, item) => sum + applicableAmount(item),
      0,
    ),
    estimates = resolveMarketEstimates(form, propertyPrice),
    userItems = Object.entries(form.customCosts).map(([id, value]) => ({
      id,
      label: "Other Custom Cost",
      amount: num(value),
      sourceType: "YOUR_VALUE",
    })),
    userTotal = userItems.reduce((sum, item) => sum + item.amount, 0),
    fixed = propertyPrice + governmentTotal + userTotal,
    trueCost = {
      low: fixed + estimates.low,
      expected: fixed + estimates.expected,
      high: fixed + estimates.high,
    },
    extraAmount = trueCost.expected - propertyPrice,
    percentage = propertyPrice ? (extraAmount / propertyPrice) * 100 : 0,
    areaSqFt =
      form.property.area *
      (form.property.areaUnit === "sq.m."
        ? 10.7639
        : form.property.areaUnit === "sq.yd."
          ? 9
          : 1),
    marketTotal = estimates.items
      .filter((x) => x.included && x.sourceType === "MARKET_ESTIMATE")
      .reduce((sum, x) => sum + x.expected, 0),
    overrideTotal = estimates.items
      .filter((x) => x.included && x.sourceType === "YOUR_VALUE")
      .reduce((sum, x) => sum + x.expected, 0),
    completeness = calculateCompleteness(form, government),
    confidence = calculateConfidence(government, governmentValue),
    chart = [
      {
        name: "Property Price",
        value: propertyPrice,
        color: "#9fcab0",
        classification: "LISTING PRICE",
      },
      {
        name: "Government Charges",
        value: governmentTotal,
        color: "#e3a82b",
        classification: "GOVT VERIFIED",
      },
      {
        name: "Market Estimates",
        value: marketTotal,
        color: "#5688a6",
        classification: "MARKET ESTIMATE",
      },
      {
        name: "Your Costs",
        value: userTotal + overrideTotal,
        color: "#8b6e9e",
        classification: "YOUR VALUE",
      },
    ].filter((x) => x.value > 0),
    allRequiredResolved = [stampDuty, registration, gst].every((item) =>
      [STATUS.APPLICABLE, STATUS.NOT_APPLICABLE].includes(item.status),
    );
  return {
    propertyPrice,
    governmentValue,
    chargeableValue,
    government: { ...government, total: governmentTotal },
    estimates,
    userCosts: { total: userTotal, items: userItems },
    trueCost,
    extra: { amount: extraAmount, percentage },
    pricePerSqFt: {
      listing: areaSqFt ? propertyPrice / areaSqFt : 0,
      trueCost: areaSqFt ? trueCost.expected / areaSqFt : 0,
    },
    completeness,
    confidence,
    chart,
    status:
      propertyPrice && allRequiredResolved
        ? "Complete"
        : "Needs more information",
  };
}

export default function TrueCost() {
  const [step, setStep] = useState(0);
  const [formState, setFormState] = useState(initialState);
  const [openCharge, setOpenCharge] = useState("stampDuty");

  const calculation = useMemo(() => calculateTrueCost(formState), [formState]);

  const update = useCallback((section, key, value) => {
    setFormState((x) => ({
      ...x,
      [section]: {
        ...x[section],
        [key]: value,
      },
    }));
  }, []);

  const updateLocation = useCallback((key, value) => {
    setFormState((x) => ({
      ...x,
      location: {
        ...x.location,
        [key]: value,
      },
    }));
  }, []);

  const selectLocation = useCallback((location) => {
    setFormState((x) => ({
      ...x,
      location: {
        ...x.location,
        state: location.state,
        district: location.district,
        tehsil: location.tehsil,
        locality: location.locality,
        wardOrPargana: "",
        areaType: x.location.areaType || "Urban",
      },
    }));
  }, []);

  const updateEstimate = useCallback((id, patch) => {
    setFormState((x) => ({
      ...x,
      estimatedCosts: {
        ...x.estimatedCosts,
        [id]: {
          ...x.estimatedCosts[id],
          ...patch,
        },
      },
    }));
  }, []);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f5f8f5] px-3 py-5 text-[#10231f] md:px-5">
        <div className="mx-auto max-w-[1480px]">
          {/* HERO */}
          <section className="mb-6 overflow-hidden rounded-[28px] border border-[#dce8e1] bg-white p-6 shadow-sm md:p-8 lg:p-10">
            <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr]">
              {/* LEFT */}
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#087154] md:text-sm">
                  GENVILLA · PROPERTY PLANNING
                </p>

                <h1 className="mt-4 font-serif text-[42px] leading-[1.04] tracking-[-0.03em] text-[#08242d] md:text-[52px] lg:text-[58px]">
                  Know the <span className="text-[#16815b]">True Cost</span>
                  <br />
                  Before You Buy.
                </h1>

                <p className="mt-5 max-w-[590px] text-[15px] leading-7 text-[#62736e]">
                  Go beyond the listing price. Estimate government charges,
                  registration costs and additional expenses before making your
                  property decision.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <div className="flex items-center gap-3 rounded-2xl p-2 transition hover:bg-[#f5faf7]">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e3f5e9] text-lg font-bold text-[#087154]">
                      ₹
                    </div>

                    <div>
                      <p className="text-xs font-bold text-[#203832]">
                        Real Buying Cost
                      </p>
                      <p className="mt-1 text-[10px] text-[#788680]">
                        Beyond listing price
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl p-2 transition hover:bg-[#f5faf7]">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e3f5e9] font-bold text-[#087154]">
                      ✓
                    </div>

                    <div>
                      <p className="text-xs font-bold text-[#203832]">
                        Government Costs
                      </p>
                      <p className="mt-1 text-[10px] text-[#788680]">
                        Rule-based estimates
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl p-2 transition hover:bg-[#f5faf7]">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e3f5e9] font-bold text-[#087154]">
                      %
                    </div>

                    <div>
                      <p className="text-xs font-bold text-[#203832]">
                        Cost Breakdown
                      </p>
                      <p className="mt-1 text-[10px] text-[#788680]">
                        See where money goes
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* IMAGE */}
              <div className="group relative h-[300px] overflow-hidden rounded-[28px] shadow-[0_18px_45px_rgba(18,55,43,0.14)] md:h-[330px]">
                <img
                  src="/true-cost/true-calculator.jpg"
                  alt="True cost property planning"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />

                <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/5" />

                <div className="absolute bottom-5 left-5 rounded-2xl border border-white/50 bg-white/90 px-5 py-4 shadow-xl backdrop-blur-md">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#087154]">
                    SMART COST PLANNING
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#19332d]">
                    Know what you&apos;ll actually pay.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CALCULATOR */}
          <section className="rounded-[24px] border border-[#dce8e1] bg-white p-3 shadow-sm md:p-6">
            <div className="grid items-start gap-6 lg:grid-cols-[1.9fr_.95fr]">
              {/* LEFT */}
              <div>
                <StepNav step={step} setStep={setStep} />

                <section className="mt-6 rounded-[20px] border border-[#dce8e1] bg-white p-4 shadow-sm md:p-6">
                  {step === 0 && (
                    <LocationStep
                      form={formState}
                      update={updateLocation}
                      onLocationSelect={selectLocation}
                    />
                  )}

                  {step === 1 && (
                    <PropertyStep
                      form={formState}
                      update={update}
                      calculation={calculation}
                    />
                  )}

                  {step === 2 && <BuyerStep form={formState} update={update} />}

                  {step === 3 && (
                    <CostsStep
                      form={formState}
                      calculation={calculation}
                      updateEstimate={updateEstimate}
                      update={update}
                    />
                  )}

                  {step === 4 && (
                    <Review
                      form={formState}
                      calculation={calculation}
                      edit={setStep}
                      openCharge={openCharge}
                      setOpenCharge={setOpenCharge}
                      setLoanInterest={(value) =>
                        setFormState((x) => ({
                          ...x,
                          loanInterest: value,
                        }))
                      }
                    />
                  )}

                  {/* BUTTONS */}
                  <div className="mt-8 flex items-center justify-between border-t border-[#e3ebe6] pt-5">
                    <button
                      type="button"
                      disabled={!step}
                      onClick={() => setStep((x) => Math.max(0, x - 1))}
                      className="rounded-xl border border-[#d4e0d9] bg-white px-6 py-3 text-xs font-bold text-[#52635e] transition hover:border-[#16815b] hover:text-[#087154] disabled:opacity-40"
                    >
                      ← Back
                    </button>

                    <button
                      type="button"
                      onClick={() => setStep((x) => Math.min(4, x + 1))}
                      className="inline-flex items-center gap-3 rounded-xl bg-[#087154] px-6 py-3 text-xs font-bold text-white shadow-[0_8px_20px_rgba(8,113,84,0.20)] transition hover:-translate-y-0.5 hover:bg-[#075f47]"
                    >
                      {step === 4 ? "Review Complete" : "Save & Continue"}

                      {step < 4 && <ArrowRight size={15} />}
                    </button>
                  </div>
                </section>

                <PropertyBasis calculation={calculation} />
              </div>

              {/* RIGHT */}
              <LiveSummary calculation={calculation} />
            </div>
          </section>

          <Breakdown calculation={calculation} />

          <InsightRow calculation={calculation} />

          {/* BOTTOM */}
          <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_.9fr]">
            <div className="rounded-2xl border border-[#cfe1d7] bg-[#f4faf6] p-5 text-[11px] leading-5 text-[#35564c]">
              <p className="font-bold text-[#087154]">ⓘ Planning Estimate</p>

              <p className="mt-2">
                True Cost is an estimate for planning purposes. Final stamp
                duty, registration fees, GST, government valuation and other
                statutory amounts may depend on the property&apos;s exact legal,
                transaction and jurisdictional details.
              </p>

              <p className="mt-2">
                Verify final amounts with the relevant government authority or
                qualified professional before purchase.
              </p>
            </div>

            <LoanBridge
              form={formState}
              calculation={calculation}
              setFormState={setFormState}
            />
          </div>

          <Link
            href="/calculators"
            className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#087154]"
          >
            ← Back to calculators
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}
function LoanBridge({ form, calculation, setFormState }) {
  return (
    <section className="rounded-[20px] border border-[#dce8e1] bg-white p-5 shadow-[0_8px_24px_rgba(20,54,42,0.05)]">
      <div className="flex items-start gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#e5f6eb] text-xl text-[#16815b]">
          ₹
        </div>

        <div className="flex-1">
          <p className="text-sm font-extrabold text-[#16362c]">
            Planning to take a home loan?
          </p>

          <p className="mt-1 text-xs leading-5 text-[#74817d]">
            Continue to EMI planning after estimating your true property cost.
          </p>

          <div className="mt-4 flex gap-3">
            {[false, true].map((value) => {
              const active = form.loanInterest === value;

              return (
                <button
                  type="button"
                  key={String(value)}
                  onClick={() =>
                    setFormState((x) => ({
                      ...x,
                      loanInterest: value,
                    }))
                  }
                  className={`rounded-xl border px-5 py-2.5 text-xs font-bold transition-all duration-300 ${
                    active
                      ? "border-[#16815b] bg-[#eaf7ef] text-[#16815b]"
                      : "border-[#dce4df] text-[#5f706a] hover:border-[#a9cabb]"
                  }`}
                >
                  {value ? "Yes" : "No"}
                </button>
              );
            })}
          </div>

          {form.loanInterest && (
            <Link
              href={`/calculators/emi?propertyPrice=${calculation.propertyPrice}`}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#087154] px-5 py-3 text-xs font-extrabold text-white shadow-[0_8px_20px_rgba(8,113,84,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#075f47]"
            >
              Continue to EMI Calculator
              <ArrowRight size={14} />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
function StepNav({ step, setStep }) {
  const details = [
    {
      title: "Location",
      subtitle: "Where is the property?",
    },
    {
      title: "Property",
      subtitle: "Property details",
    },
    {
      title: "Buyer",
      subtitle: "Your profile",
    },
    {
      title: "Additional Costs",
      subtitle: "Legal & other charges",
    },
    {
      title: "Review",
      subtitle: "Summary & results",
    },
  ];

  return (
    <nav
      aria-label="Calculator steps"
      className="overflow-x-auto rounded-[20px] border border-[#dce8e1] bg-white p-2 shadow-[0_6px_22px_rgba(20,54,42,0.06)]"
    >
      <div className="flex min-w-[850px] items-center">
        {details.map((item, index) => {
          const active = step === index;
          const complete = index < step;

          return (
            <div key={item.title} className="flex flex-1 items-center">
              <button
                type="button"
                onClick={() => setStep(index)}
                className={`flex flex-1 items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all duration-300 ${
                  active
                    ? "bg-gradient-to-r from-[#16815b] to-[#0d6d4a] text-white shadow-md"
                    : "hover:bg-[#f2f8f4]"
                }`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    active
                      ? "bg-white/20 text-white"
                      : complete
                        ? "bg-[#dff5e7] text-[#16815b]"
                        : "bg-[#edf1ef] text-[#87938f]"
                  }`}
                >
                  {index + 1}
                </span>

                <div>
                  <p
                    className={`text-sm font-bold ${
                      active ? "text-white" : "text-[#203832]"
                    }`}
                  >
                    {item.title}
                  </p>

                  <p
                    className={`mt-0.5 text-[10px] ${
                      active ? "text-white/75" : "text-[#7b8a85]"
                    }`}
                  >
                    {item.subtitle}
                  </p>
                </div>
              </button>

              {index < details.length - 1 && (
                <ArrowRight
                  size={15}
                  className="mx-1 shrink-0 text-[#b5bfbb]"
                />
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
const Heading = ({ title, text }) => (
  <div className="mt-7">
    <h2 className="font-serif text-2xl">{title}</h2>
    <p className="mt-1 text-xs leading-5 text-ink/55">{text}</p>
  </div>
);
function LocationStep({ form, update, onLocationSelect }) {
  const l = form.location;

  const selected = l.locality ? `${l.locality}, ${l.tehsil}` : l.tehsil;

  return (
    <div>
      {/* HEADING */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e5f6eb] text-[#087154]">
            <MapPin size={23} />
          </div>

          <h2 className="font-serif text-[30px] leading-tight text-[#08242d]">
            Where is the property?
          </h2>

          <p className="mt-2 max-w-[650px] text-sm leading-6 text-[#687a74]">
            Search your city, sector or locality. GenVilla will use the location
            to identify the applicable property rules and charges.
          </p>
        </div>

        <div className="hidden rounded-2xl bg-[#f0f8f3] px-4 py-3 text-right md:block">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#087154]">
            Step 01
          </p>
          <p className="mt-1 text-xs font-semibold text-[#40564f]">
            Property Location
          </p>
        </div>
      </div>

      {/* LOCATION SEARCH */}
      <div className="mt-7">
        <label className="mb-2 block text-[13px] font-bold text-[#17332c]">
          Property Location
        </label>

        <div className="rounded-2xl border border-[#d8e4dd] bg-[#fbfdfb] p-2 transition-all duration-300 focus-within:border-[#16815b] focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(22,129,91,0.08)]">
          <LocationAutocomplete
            value={selected}
            onSelect={onLocationSelect}
            showMap
            mapClassName="h-52"
          />
        </div>

        <p className="mt-2 flex items-center gap-2 text-[11px] text-[#7b8a85]">
          <MapPin size={13} className="text-[#16815b]" />
          Start typing your city, sector or locality.
        </p>
      </div>

      {/* STATE + AREA */}
      <div className="mt-7 grid gap-5 md:grid-cols-2">
        {l.state && (
          <div>
            <label className="mb-2 block text-[13px] font-bold text-[#17332c]">
              State
            </label>

            <div className="flex h-[54px] items-center gap-3 rounded-xl border border-[#d8e4dd] bg-[#f4f8f5] px-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e0f3e7] text-[#16815b]">
                <MapPin size={16} />
              </div>

              <span className="text-sm font-semibold text-[#2e443d]">
                {l.state}
              </span>

              <span className="ml-auto rounded-full bg-[#daf3e3] px-2.5 py-1 text-[9px] font-extrabold text-[#087154]">
                DETECTED
              </span>
            </div>
          </div>
        )}

        <div>
          <label className="mb-2 block text-[13px] font-bold text-[#17332c]">
            Area Type
          </label>

          <select
            value={l.areaType}
            onChange={(e) => update("areaType", e.target.value)}
            className="h-[54px] w-full rounded-xl border border-[#d8e4dd] bg-white px-4 text-sm font-semibold text-[#42544e] outline-none transition-all duration-300 hover:border-[#9fc4b4] focus:border-[#16815b] focus:ring-4 focus:ring-[#16815b]/10"
          >
            <option value="">Select Area Type</option>
            <option value="Urban">Urban</option>
            <option value="Rural">Rural</option>
          </select>
        </div>
      </div>

      {/* INFO BOX */}
      <div className="mt-7 flex gap-3 rounded-2xl border border-[#d8e9df] bg-gradient-to-r from-[#edf8f1] to-[#f8fbf9] p-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#16815b] shadow-sm">
          <ShieldCheck size={18} />
        </div>

        <div>
          <p className="text-xs font-bold text-[#1c4437]">
            Why does location matter?
          </p>

          <p className="mt-1 text-[11px] leading-5 text-[#61736d]">
            Stamp duty, registration fees and government valuation rules can
            vary by state and property jurisdiction.
          </p>
        </div>
      </div>
    </div>
  );
}
function PropertyStep({ form, update, calculation }) {
  const p = form.property;
  return (
    <>
      <Heading
        title="Tell us about the property"
        text="Government value is a statutory basis where applicable—not an additional purchase cost."
      />
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <SelectField
          label="Property Type"
          value={p.type}
          onChange={(v) => update("property", "type", v)}
          options={["Apartment", "Independent House", "Villa", "Plot"]}
        />
        <SelectField
          label="Property Status"
          value={p.status}
          onChange={(v) => update("property", "status", v)}
          options={["Ready to Move", "Under Construction", "Resale"]}
        />
        {p.status === "Under Construction" && (
          <SelectField
            label="Residential Category"
            value={p.residentialCategory}
            onChange={(v) => update("property", "residentialCategory", v)}
            options={["Affordable Residential", "Other Residential"]}
            placeholder="Select Category"
          />
        )}
        <RangeInput
          label="Listing / Transaction Price"
          value={p.price}
          onChange={(v) => update("property", "price", v)}
          max={100000000}
          step={100000}
          currency
        />
        <RangeInput
          label="Government / Market Value"
          value={p.marketValue}
          onChange={(v) => update("property", "marketValue", v)}
          max={100000000}
          step={100000}
          currency
        />
        <div className="grid grid-cols-[1fr_110px] gap-2">
          <RangeInput
            label="Built-up / Plot Area"
            value={p.area}
            onChange={(v) => update("property", "area", v)}
            max={10000}
            step={25}
          />
          <SelectField
            label="Unit"
            value={p.areaUnit}
            onChange={(v) => update("property", "areaUnit", v)}
            options={["sq.ft.", "sq.m.", "sq.yd."]}
          />
        </div>
      </div>
      <div className="mt-5 rounded-xl bg-[#f1f6ef] p-4">
        <p className="text-[10px] font-bold tracking-wider text-green">
          PROPERTY VALUE BASIS
        </p>
        <dl className="mt-3 grid gap-3 sm:grid-cols-3">
          <Value
            label="Listing Price"
            value={money(calculation.propertyPrice)}
          />
          <Value
            label="Government / Market Value"
            value={money(calculation.governmentValue)}
          />
          <Value
            label="Applicable Calculation Base"
            value={money(calculation.chargeableValue)}
          />
        </dl>
      </div>
    </>
  );
}
function BuyerStep({ form, update }) {
  return (
    <>
      <Heading
        title="Who is buying?"
        text="Buyer type is used only by configured rules that explicitly support it."
      />
      <div className="mt-5 grid grid-cols-2 gap-3">
        {["Male", "Female"].map((type) => (
          <button
            key={type}
            onClick={() => update("buyer", "type", type)}
            className={`relative rounded-xl border p-5 text-left font-bold ${form.buyer.type === type ? "border-green bg-green text-white" : "border-ink/15"}`}
          >
            {form.buyer.type === type && (
              <Check className="absolute right-3 top-3" size={16} />
            )}{" "}
            {type}
          </button>
        ))}
      </div>
    </>
  );
}
function CostsStep({ form, calculation, updateEstimate, update }) {
  return (
    <>
      <Heading
        title="Add realistic acquisition costs"
        text="Market estimates are optional and never presented as government fees."
      />
      <div className="mt-5 space-y-3">
        {calculation.estimates.items.map((item) => (
          <div className="rounded-xl border border-ink/10 p-4" key={item.id}>
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <b className="text-sm">{item.label}</b>
                <Badge type={item.sourceType} />
                <p className="mt-1 text-[10px] text-ink/50">
                  Typical range {money(item.low)} – {money(item.high)} ·{" "}
                  {item.basis}
                </p>
              </div>
              <label className="flex items-center gap-2 text-xs font-bold">
                <input
                  type="checkbox"
                  checked={item.included}
                  onChange={(e) =>
                    updateEstimate(item.id, { included: e.target.checked })
                  }
                />{" "}
                Include
              </label>
            </div>
            {item.included && (
              <div className="mt-3 flex flex-wrap items-end gap-3">
                <button
                  className={`rounded-lg border px-3 py-2 text-xs font-bold ${item.mode === "estimate" ? "border-green bg-sage text-green" : "border-ink/10"}`}
                  onClick={() => updateEstimate(item.id, { mode: "estimate" })}
                >
                  Use estimate · ~{money(item.expected)}
                </button>
                <label className="text-[10px] font-bold">
                  Enter my amount
                  <input
                    aria-label={`${item.label} custom amount`}
                    className="mt-1 block h-9 w-36 rounded-lg border border-ink/15 px-2 text-sm"
                    type="number"
                    min="0"
                    value={form.estimatedCosts[item.id].customAmount}
                    onFocus={() => updateEstimate(item.id, { mode: "custom" })}
                    onChange={(e) =>
                      updateEstimate(item.id, {
                        mode: "custom",
                        customAmount: num(e.target.value),
                      })
                    }
                  />
                </label>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-5">
        <InputField
          label="Other Custom Cost"
          value={form.customCosts.other}
          onChange={(v) => update("customCosts", "other", num(v))}
        />
      </div>
    </>
  );
}
function Review({
  form,
  calculation,
  edit,
  openCharge,
  setOpenCharge,
  setLoanInterest,
}) {
  return (
    <>
      <Heading
        title="Review your True Cost"
        text="Edit any section without losing the rest of your inputs."
      />
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <ReviewCard
          title="Location"
          text={
            [
              form.location.locality,
              form.location.district,
              form.location.state,
            ]
              .filter(Boolean)
              .join(", ") || "Not selected"
          }
          onEdit={() => edit(0)}
        />
        <ReviewCard
          title="Property"
          text={`${money(calculation.propertyPrice)} · ${form.property.type}`}
          onEdit={() => edit(1)}
        />
        <ReviewCard
          title="Buyer"
          text={form.buyer.type}
          onEdit={() => edit(2)}
        />
      </div>
      <GovernmentCards
        calculation={calculation}
        open={openCharge}
        setOpen={setOpenCharge}
      />
      <div className="mt-5 rounded-xl bg-[#15352c] p-5 text-white">
        <p className="text-[10px] font-bold tracking-wider text-white/60">
          EXPECTED TRUE COST
        </p>
        <b className="mt-2 block font-serif text-4xl">
          {money(calculation.trueCost.expected)}
        </b>
        <p className="mt-2 text-xs text-white/65">
          Likely range {money(calculation.trueCost.low)} –{" "}
          {money(calculation.trueCost.high)}
        </p>
      </div>
      <div className="mt-5 rounded-xl border border-ink/10 p-4">
        <b className="text-sm">Planning to take a home loan?</b>
        <div className="mt-3 flex gap-2">
          {[false, true].map((value) => (
            <button
              key={String(value)}
              onClick={() => setLoanInterest(value)}
              className={`rounded-lg border px-5 py-2 text-xs font-bold ${form.loanInterest === value ? "border-green bg-sage text-green" : "border-ink/10"}`}
            >
              {value ? "Yes" : "No"}
            </button>
          ))}
        </div>
        {form.loanInterest && (
          <Link
            className="btn-dark mt-4"
            href={`/calculators/emi?propertyPrice=${calculation.propertyPrice}`}
          >
            Continue to EMI Calculator <ArrowRight size={15} />
          </Link>
        )}
      </div>
    </>
  );
}
function LiveSummary({ calculation }) {
  const checks = [
    ["Property price entered", calculation.propertyPrice > 0],
    ["Buyer selected", true],
    [
      "Stamp duty rule resolved",
      calculation.government.stampDuty.status === "APPLICABLE",
    ],
    [
      "Registration fee resolved",
      ["APPLICABLE", "NOT_APPLICABLE"].includes(
        calculation.government.registration.status,
      ),
    ],
    [
      "GST status resolved",
      ["APPLICABLE", "NOT_APPLICABLE"].includes(
        calculation.government.gst.status,
      ),
    ],
    ["Brokerage estimated", calculation.estimates.items[0].included],
    ["Legal verification estimated", calculation.estimates.items[1].included],
  ];

  const completion = Math.max(0, Math.min(calculation.completeness, 100));

  return (
    <aside
      aria-live="polite"
      className="h-fit overflow-hidden rounded-[24px] bg-gradient-to-br from-[#0b6a4c] via-[#0b5d44] to-[#063d30] text-white shadow-[0_18px_45px_rgba(7,76,55,0.2)] lg:sticky lg:top-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/15 px-6 py-5">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.12em]">
            Your True Cost
          </p>

          <p className="mt-1 text-xs text-white/65">
            Expected property acquisition cost
          </p>
        </div>

        <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/10">
          ₹
        </div>
      </div>

      {/* Cost Lines */}
      <div className="px-6 py-5">
        <div className="space-y-4 border-b border-white/15 pb-5">
          <SummaryLineDark
            color="blue"
            label="LISTING PRICE"
            value={money(calculation.propertyPrice)}
          />

          <SummaryLineDark
            color="green"
            label="GOVERNMENT COSTS"
            value={money(calculation.government.total)}
            badge="GOVT VERIFIED"
          />

          <SummaryLineDark
            color="orange"
            label="ESTIMATED / YOUR COSTS"
            value={`~${money(
              calculation.estimates.expected + calculation.userCosts.total,
            )}`}
          />
        </div>

        {/* Expected Cost */}
        <div className="mt-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/65">
            Expected True Cost
          </p>

          <div className="mt-2 flex items-end justify-between gap-4">
            <div>
              <p className="font-serif text-[38px] font-bold leading-none">
                {money(calculation.trueCost.expected)}
              </p>

              <p className="mt-3 text-[10px] uppercase tracking-[0.12em] text-white/50">
                Likely Range
              </p>

              <p className="mt-1 text-sm font-semibold">
                {money(calculation.trueCost.low)} –{" "}
                {money(calculation.trueCost.high)}
              </p>
            </div>

            <div className="hidden rounded-2xl bg-white/10 px-4 py-3 text-right sm:block">
              <p className="text-[10px] text-white/60">Estimate Confidence</p>

              <p
                className={`mt-1 text-sm font-bold ${
                  calculation.confidence === "HIGH"
                    ? "text-[#8ff0b8]"
                    : calculation.confidence === "MEDIUM"
                      ? "text-[#ffd77c]"
                      : "text-[#ffb08f]"
                }`}
              >
                {calculation.confidence}
              </p>
            </div>
          </div>
        </div>

        {/* Extra Cost */}
        <div className="mt-6 rounded-2xl bg-[#fff7e9] p-5 text-[#26362f] shadow-inner">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.1em]">
                You May Pay
              </p>

              <p className="mt-1 text-2xl font-extrabold text-[#d85a00]">
                ~{money(calculation.extra.amount)} EXTRA
              </p>
            </div>

            <div className="rounded-xl bg-white px-3 py-2 text-right">
              <p className="text-[9px] text-[#6b746f]">Above listing price</p>

              <p className="mt-1 text-sm font-bold text-[#16815b]">
                +{calculation.extra.percentage.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* Completeness */}
        <div className="mt-6 border-t border-white/15 pt-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.1em]">
                Calculation Completeness
              </p>

              <p className="mt-1 text-[10px] text-white/55">
                Complete the remaining inputs for better accuracy.
              </p>
            </div>

            <div
              className="relative grid h-16 w-16 place-items-center rounded-full"
              style={{
                background: `conic-gradient(
                  #72e0a2 0deg ${completion * 3.6}deg,
                  rgba(255,255,255,0.12) ${completion * 3.6}deg 360deg
                )`,
              }}
            >
              <div className="grid h-[50px] w-[50px] place-items-center rounded-full bg-[#07513c] text-xs font-extrabold">
                {completion}%
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {checks.map(([label, done]) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2"
              >
                <span className="text-[11px] text-white/80">{label}</span>

                <span
                  className={`text-xs font-bold ${
                    done ? "text-[#8ff0b8]" : "text-[#ffc27b]"
                  }`}
                >
                  {done ? "✓" : "○"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

function SummaryLineDark({ label, value, color, badge }) {
  const dotColor = {
    blue: "bg-[#6da7ff]",
    green: "bg-[#63d79b]",
    orange: "bg-[#ff9a4b]",
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className={`h-3 w-3 rounded-full ${dotColor[color]}`} />

        <div>
          <p className="text-[10px] font-bold tracking-[0.08em] text-white/80">
            {label}
          </p>

          {badge && (
            <span className="mt-1 inline-block rounded-full bg-[#bdf5d1] px-2 py-0.5 text-[7px] font-extrabold text-[#0d6848]">
              {badge}
            </span>
          )}
        </div>
      </div>

      <strong
        className={`text-sm ${
          color === "orange" ? "text-[#ffab69]" : "text-white"
        }`}
      >
        {value}
      </strong>
    </div>
  );
}
function GovernmentCards({ calculation, open, setOpen }) {
  const items = [
    ["stampDuty", "Stamp Duty"],
    ["registration", "Registration Fee"],
    ["gst", "GST"],
    ["other", "Other Government Charges"],
  ];
  return (
    <section className="mt-5">
      <h3 className="font-serif text-xl">Government Costs</h3>
      <div className="mt-3 space-y-2">
        {items.map(([id, label]) => {
          const item = calculation.government[id],
            expanded = open === id;
          return (
            <div className="rounded-xl border border-ink/10" key={id}>
              <button
                className="flex w-full items-center justify-between gap-3 p-4 text-left"
                onClick={() => setOpen(expanded ? "" : id)}
              >
                <span>
                  <b className="block text-sm">{label}</b>
                  <Status status={item.status} />
                </span>
                <b>
                  {item.status === STATUS.APPLICABLE
                    ? money(item.amount)
                    : labelForStatus(item.status)}
                </b>
                <ChevronDown
                  className={expanded ? "rotate-180" : ""}
                  size={16}
                />
              </button>
              {expanded && (
                <div className="border-t border-ink/10 p-4 text-xs leading-6 text-ink/65">
                  <p>
                    <b>Calculation Base:</b> {money(item.calculationBase)}
                  </p>
                  {item.rate !== null && (
                    <p>
                      <b>Applicable Rate:</b>{" "}
                      {Number((item.rate * 100).toFixed(2))}%
                    </p>
                  )}
                  {item.rawAmount && (
                    <p>
                      <b>Raw Calculation:</b> {money(item.rawAmount)}
                    </p>
                  )}
                  {item.maximum && (
                    <p>
                      <b>Maximum Cap:</b> {money(item.maximum)}
                    </p>
                  )}
                  <p>
                    <b>Explanation:</b> {item.explanation}
                  </p>
                  {item.source && (
                    <p>
                      <b>Source:</b> {item.source}
                    </p>
                  )}
                  {item.sourceUrl && (
                    <a
                      className="mt-2 inline-block font-bold text-green"
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View Government Source →
                    </a>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
function Breakdown({ calculation }) {
  const govt = [
    ["Stamp Duty", calculation.government.stampDuty],
    ["Registration Fee", calculation.government.registration],
    ["GST", calculation.government.gst],
    ["Other Govt. Charges", calculation.government.other],
  ];

  const hasPrice = calculation.propertyPrice > 0;

  return (
    <section className="mt-6 overflow-hidden rounded-[24px] border border-[#dce8e1] bg-white shadow-[0_10px_30px_rgba(20,54,42,0.06)]">
      {/* TABS */}
      <div className="flex gap-2 overflow-x-auto border-b border-[#e5ece8] bg-[#fbfdfb] p-2">
        <button className="rounded-xl bg-[#e5f6eb] px-5 py-3 text-xs font-extrabold text-[#087154]">
          Cost Breakdown
        </button>

        <button className="rounded-xl px-5 py-3 text-xs font-semibold text-[#596b65] transition hover:bg-[#f0f6f2]">
          Where is my money going?
        </button>

        <button className="rounded-xl px-5 py-3 text-xs font-semibold text-[#596b65] transition hover:bg-[#f0f6f2]">
          Cost Build-Up
        </button>

        <button className="rounded-xl px-5 py-3 text-xs font-semibold text-[#596b65] transition hover:bg-[#f0f6f2]">
          Per sq.ft. Analysis
        </button>
      </div>

      <div className="grid gap-5 p-5 lg:grid-cols-[.95fr_1.05fr]">
        {/* LEFT */}
        <div className="rounded-2xl border border-[#dce8e1] bg-[#fcfefc] p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#e5f6eb] text-[#087154]">
              ₹
            </div>

            <div>
              <h2 className="text-sm font-extrabold text-[#15342b]">
                Detailed Cost Breakdown
              </h2>

              <p className="mt-1 text-xs text-[#74817d]">
                See every major cost included in your property purchase.
              </p>
            </div>
          </div>

          {!hasPrice ? (
            <div className="mt-6 rounded-2xl border border-dashed border-[#cbdad2] bg-white px-6 py-10 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#edf7f1] text-2xl text-[#16815b]">
                ₹
              </div>

              <p className="mt-4 text-sm font-bold text-[#28473d]">
                Add property details to begin
              </p>

              <p className="mx-auto mt-2 max-w-[360px] text-xs leading-5 text-[#7b8984]">
                Enter your property price and location to calculate government
                charges and additional buying costs.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              <BreakdownGroup
                title="Government Costs"
                badge="VERIFIED"
                value={calculation.government.total}
              />

              {govt.map(([label, item]) => (
                <BreakdownRow
                  key={label}
                  label={label}
                  value={
                    item.status === "APPLICABLE"
                      ? money(item.amount)
                      : labelForStatus(item.status)
                  }
                />
              ))}

              <BreakdownGroup
                title="Estimated Costs"
                badge="MARKET"
                value={calculation.estimates.expected}
                orange
              />

              {calculation.estimates.items.map((item) => (
                <BreakdownRow
                  key={item.id}
                  label={item.label}
                  value={money(item.included ? item.expected : 0)}
                  muted={!item.included}
                />
              ))}

              <div className="mt-4 flex items-center justify-between rounded-xl bg-[#0b5d44] px-4 py-4 text-white">
                <span className="text-sm font-bold">Expected True Cost</span>

                <strong className="text-lg">
                  {money(calculation.trueCost.expected)}
                </strong>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="rounded-2xl border border-[#dce8e1] bg-[#fcfefc] p-5">
          <div>
            <h2 className="text-sm font-extrabold text-[#15342b]">
              Cost Distribution
            </h2>

            <p className="mt-1 text-xs text-[#74817d]">
              Understand how your total property cost is distributed.
            </p>
          </div>

          {!hasPrice ? (
            <div className="mt-6 flex min-h-[280px] items-center justify-center rounded-2xl border border-dashed border-[#cbdad2] bg-white">
              <div className="text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#edf7f1] text-2xl text-[#16815b]">
                  %
                </div>

                <p className="mt-4 text-sm font-bold text-[#28473d]">
                  Your cost chart will appear here
                </p>

                <p className="mt-2 text-xs text-[#7b8984]">
                  Enter a property price to generate your live breakdown.
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-4 grid items-center gap-4 md:grid-cols-[220px_1fr]">
              <div className="relative h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={calculation.chart}
                      dataKey="value"
                      nameKey="name"
                      innerRadius="58%"
                      outerRadius="82%"
                    >
                      {calculation.chart.map((item) => (
                        <Cell key={item.name} fill={item.color} />
                      ))}
                    </Pie>

                    <Tooltip formatter={(value) => money(value)} />
                  </PieChart>
                </ResponsiveContainer>

                <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.1em] text-[#83918c]">
                      Total
                    </p>

                    <strong className="mt-1 block text-sm text-[#15342b]">
                      {money(calculation.trueCost.expected)}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {calculation.chart.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between rounded-xl border border-[#edf1ef] bg-white px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ background: item.color }}
                      />

                      <span className="text-xs font-semibold text-[#52635d]">
                        {item.name}
                      </span>
                    </div>

                    <strong className="text-xs text-[#15342b]">
                      {money(item.value)}
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function BreakdownGroup({ title, badge, value, orange = false }) {
  return (
    <div
      className={`flex items-center justify-between rounded-xl px-4 py-3 ${
        orange ? "bg-[#fff6e9] text-[#b55b00]" : "bg-[#edf8f1] text-[#087154]"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-xs font-extrabold">{title}</span>

        <span className="rounded-full bg-white px-2 py-0.5 text-[8px] font-bold">
          {badge}
        </span>
      </div>

      <strong className="text-sm">{money(value)}</strong>
    </div>
  );
}

function BreakdownRow({ label, value, muted = false }) {
  return (
    <div
      className={`flex items-center justify-between border-b border-[#edf1ef] py-3 ${
        muted ? "opacity-45" : ""
      }`}
    >
      <span className="text-xs text-[#586b64]">{label}</span>

      <strong className="text-xs text-[#18362c]">{value}</strong>
    </div>
  );
}
function PropertyBasis({ calculation }) {
  return (
    <section className="mt-6 rounded-[22px] border border-[#dce8e1] bg-white p-5 shadow-[0_8px_24px_rgba(20,54,42,0.05)]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#16815b]">
            Property Value Basis
          </p>

          <h3 className="mt-1 text-lg font-extrabold text-[#15342b]">
            How your calculation base is decided
          </h3>

          <p className="mt-1 text-xs text-[#72817c]">
            Government charges may use the higher applicable property value.
          </p>
        </div>

        <span className="rounded-full bg-[#edf8f1] px-3 py-1.5 text-[10px] font-extrabold text-[#16815b]">
          LIVE BASIS
        </span>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {/* LISTING PRICE */}
        <BasisCard
          number="01"
          title="Listing Price"
          subtitle="Transaction value"
          value={money(calculation.propertyPrice)}
          active={calculation.chargeableValue === calculation.propertyPrice}
        />

        {/* MARKET VALUE */}
        <BasisCard
          number="02"
          title="Government / Market Value"
          subtitle="Statutory valuation"
          value={money(calculation.governmentValue)}
          active={
            calculation.governmentValue > 0 &&
            calculation.chargeableValue === calculation.governmentValue
          }
        />

        {/* CALCULATION BASE */}
        <BasisCard
          number="03"
          title="Applicable Calculation Base"
          subtitle="Higher applicable value"
          value={money(calculation.chargeableValue)}
          highlighted
        />
      </div>

      <div className="mt-5 flex gap-3 rounded-2xl bg-[#f3f9f5] p-4">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-[#16815b] shadow-sm">
          ⓘ
        </div>

        <p className="text-[11px] leading-5 text-[#5f716b]">
          The applicable calculation base is used for configured government
          charges. In many cases, this may be the higher of the transaction
          price and government valuation.
        </p>
      </div>
    </section>
  );
}

function BasisCard({
  number,
  title,
  subtitle,
  value,
  active = false,
  highlighted = false,
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
        highlighted
          ? "border-[#16815b] bg-gradient-to-br from-[#0f7755] to-[#07513c] text-white"
          : active
            ? "border-[#9cccb7] bg-[#f3faf6]"
            : "border-[#e0e8e3] bg-[#fcfefc]"
      }`}
    >
      <div className="flex items-start justify-between">
        <span
          className={`grid h-9 w-9 place-items-center rounded-xl text-xs font-extrabold ${
            highlighted
              ? "bg-white/15 text-white"
              : "bg-[#e5f6eb] text-[#16815b]"
          }`}
        >
          {number}
        </span>

        {active && !highlighted && (
          <span className="rounded-full bg-[#dcf3e5] px-2.5 py-1 text-[8px] font-extrabold text-[#16815b]">
            ACTIVE
          </span>
        )}

        {highlighted && (
          <span className="rounded-full bg-white/15 px-2.5 py-1 text-[8px] font-extrabold text-white">
            USED FOR CALCULATION
          </span>
        )}
      </div>

      <p
        className={`mt-5 text-xs font-bold ${
          highlighted ? "text-white/80" : "text-[#64756f]"
        }`}
      >
        {title}
      </p>

      <p
        className={`mt-1 text-[10px] ${
          highlighted ? "text-white/55" : "text-[#8a9893]"
        }`}
      >
        {subtitle}
      </p>

      <strong
        className={`mt-4 block text-2xl ${
          highlighted ? "text-white" : "text-[#15342b]"
        }`}
      >
        {value}
      </strong>
    </div>
  );
}
function InsightRow({ calculation }) {
  const impact =
    calculation.extra.percentage < 5
      ? "LOW"
      : calculation.extra.percentage < 10
        ? "MODERATE"
        : "HIGH";

  const impactStyle =
    impact === "LOW"
      ? "bg-[#e9f7ee] text-[#16815b]"
      : impact === "MODERATE"
        ? "bg-[#fff6df] text-[#b77900]"
        : "bg-[#fff0ee] text-[#d8504d]";

  const statusComplete = calculation.status === "Complete";

  return (
    <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* EFFECTIVE PRICE */}
      <div className="group rounded-[20px] border border-[#dce8e1] bg-white p-5 shadow-[0_8px_24px_rgba(20,54,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="flex items-center justify-between">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#e5f6eb] text-lg text-[#16815b]">
            ₹
          </div>

          <span className="text-[9px] font-extrabold uppercase tracking-[0.1em] text-[#789087]">
            Per Sq.ft.
          </span>
        </div>

        <h3 className="mt-4 text-xs font-extrabold text-[#16362c]">
          EFFECTIVE PRICE / SQ.FT.
        </h3>

        <div className="mt-5 grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] text-[#7d8b86]">Listing Rate</p>

            <strong className="mt-1 block text-sm text-[#18372e]">
              {calculation.pricePerSqFt.listing
                ? `${money(calculation.pricePerSqFt.listing)} /sq.ft.`
                : "Add area"}
            </strong>
          </div>

          <div className="border-l border-[#e6ece9] pl-4">
            <p className="text-[10px] text-[#7d8b86]">True Cost Rate</p>

            <strong className="mt-1 block text-sm text-[#16815b]">
              {calculation.pricePerSqFt.trueCost
                ? `${money(calculation.pricePerSqFt.trueCost)} /sq.ft.`
                : "Add area"}
            </strong>
          </div>
        </div>
      </div>

      {/* TRUE COST IMPACT */}
      <div className="group rounded-[20px] border border-[#dce8e1] bg-white p-5 shadow-[0_8px_24px_rgba(20,54,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="flex items-center justify-between">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#e5f6eb] text-[#16815b]">
            ↗
          </div>

          <span
            className={`rounded-full px-3 py-1 text-[9px] font-extrabold ${impactStyle}`}
          >
            {impact}
          </span>
        </div>

        <h3 className="mt-4 text-xs font-extrabold text-[#16362c]">
          TRUE COST IMPACT
        </h3>

        <p className="mt-4 text-[30px] font-extrabold leading-none text-[#15372d]">
          +{calculation.extra.percentage.toFixed(1)}%
        </p>

        <p className="mt-2 text-[10px] leading-4 text-[#7b8984]">
          Additional cost compared to listing price.
        </p>
      </div>

      {/* EXTRA AMOUNT */}
      <div className="group rounded-[20px] border border-[#dce8e1] bg-white p-5 shadow-[0_8px_24px_rgba(20,54,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="flex items-center justify-between">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#fff1df] text-[#dc6a00]">
            ₹
          </div>

          <span className="text-[9px] font-extrabold uppercase tracking-[0.1em] text-[#9a8571]">
            Extra Cost
          </span>
        </div>

        <h3 className="mt-4 text-xs font-extrabold text-[#16362c]">
          EXTRA AMOUNT
        </h3>

        <p className="mt-4 text-[28px] font-extrabold leading-none text-[#d65f00]">
          ~{money(calculation.extra.amount)}
        </p>

        <p className="mt-2 text-[10px] leading-4 text-[#7b8984]">
          Estimated amount above listing price.
        </p>
      </div>

      {/* CALCULATION STATUS */}
      <div className="group rounded-[20px] border border-[#dce8e1] bg-white p-5 shadow-[0_8px_24px_rgba(20,54,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="flex items-center justify-between">
          <div
            className={`grid h-11 w-11 place-items-center rounded-xl ${
              statusComplete
                ? "bg-[#e5f6eb] text-[#16815b]"
                : "bg-[#fff6df] text-[#b77900]"
            }`}
          >
            ✓
          </div>

          <span
            className={`rounded-full px-3 py-1 text-[9px] font-extrabold ${
              statusComplete
                ? "bg-[#e9f7ee] text-[#16815b]"
                : "bg-[#fff6df] text-[#b77900]"
            }`}
          >
            {statusComplete ? "READY" : "INCOMPLETE"}
          </span>
        </div>

        <h3 className="mt-4 text-xs font-extrabold text-[#16362c]">
          CALCULATION STATUS
        </h3>

        <p
          className={`mt-4 text-lg font-extrabold leading-tight ${
            statusComplete ? "text-[#16815b]" : "text-[#a56e00]"
          }`}
        >
          {calculation.status}
        </p>

        <p className="mt-2 text-[10px] leading-4 text-[#7b8984]">
          {statusComplete
            ? "Your available costs have been calculated."
            : "Add the remaining property details for better accuracy."}
        </p>
      </div>
    </section>
  );
}
function SummaryLine({ label, value, color, badge }) {
  const colors = {
    blue: "bg-blue-500",
    green: "bg-green",
    orange: "bg-orange-500",
  };
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-2 text-[10px] font-bold">
        <i
          className={`grid h-4 w-4 place-items-center rounded-sm text-white ${colors[color]}`}
        >
          ✓
        </i>
        <span>
          {label}
          {badge && (
            <small className="mt-1 block w-fit rounded bg-[#e9f6ed] px-1.5 py-0.5 text-[7px] text-green">
              {badge}
            </small>
          )}
        </span>
      </span>
      <b className={color === "orange" ? "text-orange-600" : ""}>{value}</b>
    </div>
  );
}
function CostHeader({ label, badge, value, green, orange, blue }) {
  return (
    <div
      className={`flex items-center justify-between border-b border-[#dbe3ec] px-4 py-3 text-[10px] ${green ? "text-green" : orange ? "text-orange-600" : blue ? "text-[#0867e8]" : ""}`}
    >
      <span className="font-bold">
        {label}
        <small className="ml-2 rounded bg-[#eef5ff] px-2 py-1 text-[7px]">
          {badge}
        </small>
      </span>
      <b>
        {orange ? "~" : ""}
        {money(value)}
      </b>
    </div>
  );
}
function CostRow({ label, value, checked }) {
  return (
    <div className="flex items-center justify-between border-b border-[#edf0f4] px-4 py-2 text-[9px]">
      <span>
        {checked !== undefined && (
          <span className={checked ? "text-[#0867e8]" : "text-[#aab3c0]"}>
            {checked ? "☑" : "☐"} &nbsp;
          </span>
        )}
        {label}
      </span>
      <b>{value}</b>
    </div>
  );
}
function Basis({ label, value, note }) {
  return (
    <div className="p-4 text-center">
      <dt className="text-[10px]">{label}</dt>
      <dd className="mt-1 text-sm font-bold">{value}</dd>
      {note && <small className="text-[9px] text-[#60708b]">{note}</small>}
    </div>
  );
}
function Insight({ title, children }) {
  return (
    <div className="min-h-32 rounded-lg border border-[#dbe3ec] bg-white p-4">
      <p className="mb-5 text-center text-[10px] font-bold">{title}</p>
      {children}
    </div>
  );
}
function RangeInput({ label, value, onChange, max, step, currency }) {
  const dynamicMax = Math.max(max, Math.ceil(num(value) / step) * step);
  return (
    <label className="block">
      <span className="text-xs font-bold">{label}</span>
      <input
        className="mt-2 h-11 w-full rounded-lg border border-ink/15 px-3 text-sm focus:border-green focus:outline-none"
        type="number"
        min="0"
        value={value}
        onChange={(e) => onChange(num(e.target.value))}
      />
      <input
        aria-label={`${label} slider`}
        className="mt-3 w-full accent-green"
        type="range"
        min="0"
        max={dynamicMax}
        step={step}
        value={Math.min(num(value), dynamicMax)}
        onChange={(e) => onChange(num(e.target.value))}
      />
      <span className="flex justify-between text-[9px] text-ink/45">
        <span>0</span>
        <span>
          {currency ? money(dynamicMax) : dynamicMax.toLocaleString("en-IN")}
        </span>
      </span>
    </label>
  );
}
function SelectField({
  label,
  value,
  onChange,
  options,
  disabled,
  placeholder,
}) {
  return (
    <label className="block text-xs font-bold">
      {label}
      <select
        className="mt-2 h-11 w-full rounded-lg border border-ink/15 bg-white px-3 text-sm focus:border-green focus:outline-none disabled:bg-ink/5"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {!placeholder && value === "" && (
          <option value="">Select {label}</option>
        )}
        {options.map((x) => (
          <option key={x}>{x}</option>
        ))}
      </select>
    </label>
  );
}
function InputField({ label, value, onChange, text }) {
  return (
    <label className="block text-xs font-bold">
      {label}
      <input
        className="mt-2 h-11 w-full rounded-lg border border-ink/15 px-3 text-sm focus:border-green focus:outline-none"
        type={text ? "text" : "number"}
        min={text ? undefined : "0"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
function ReviewCard({ title, text, onEdit }) {
  return (
    <div className="rounded-xl border border-ink/10 p-4">
      <div className="flex justify-between">
        <b className="text-xs">{title}</b>
        <button
          aria-label={`Edit ${title}`}
          onClick={onEdit}
          className="text-green"
        >
          <Pencil size={14} />
        </button>
      </div>
      <p className="mt-2 text-xs text-ink/55">{text}</p>
    </div>
  );
}
function Badge({ type }) {
  const label =
    type === "YOUR_VALUE"
      ? "YOUR VALUE"
      : type === "MARKET_ESTIMATE"
        ? "MARKET ESTIMATE"
        : type === "GOVT_VERIFIED"
          ? "GOVT VERIFIED"
          : type;
  return (
    <small className="ml-2 rounded-full bg-sage px-2 py-1 text-[8px] font-bold text-green">
      {label}
    </small>
  );
}
function Status({ status }) {
  return (
    <small className="mt-1 block text-[9px] font-bold uppercase tracking-wide text-green">
      <ShieldCheck className="mr-1 inline" size={11} />
      {labelForStatus(status)}
    </small>
  );
}
function labelForStatus(status) {
  return status
    .split("_")
    .map((x) => x[0] + x.slice(1).toLowerCase())
    .join(" ");
}
const Value = ({ label, value }) => (
    <div>
      <dt className="text-[10px] text-ink/50">{label}</dt>
      <dd className="mt-1 text-sm font-bold">{value}</dd>
    </div>
  ),
  Line = ({ label, value }) => (
    <div className="flex justify-between gap-4 text-sm">
      <dt className="text-white/60">{label}</dt>
      <dd className="font-bold">{value}</dd>
    </div>
  ),
  DarkMetric = ({ label, value }) => (
    <div className="rounded-lg bg-white/10 p-3">
      <small className="text-[9px] text-white/55">{label}</small>
      <b className="mt-1 block text-sm">{value}</b>
    </div>
  );
function ChartPlaceholder() {
  return (
    <div className="grid min-h-72 place-items-center rounded-lg border border-dashed border-[#dbe3ec] bg-[#fbfcfe] text-center text-xs text-[#657188]">
      <span>
        Enter a property price to see
        <br />
        your cost distribution and build-up.
      </span>
    </div>
  );
}
const FullBreakdown = Breakdown;
Breakdown = memo(function DeferredBreakdown({ calculation }) {
  return calculation.propertyPrice ? (
    <FullBreakdown calculation={calculation} />
  ) : (
    <section className="mt-3 rounded-lg border border-[#dbe3ec] bg-white">
      <div className="flex gap-8 overflow-x-auto border-b border-[#dbe3ec] px-6 text-[11px]">
        <b className="border-b-2 border-[#0867e8] px-2 py-3 text-[#0867e8]">
          Cost Breakdown
        </b>
        <span className="py-3">Where is my money going?</span>
        <span className="py-3">Cost Build-Up (Waterfall)</span>
        <span className="py-3">Per sq.ft. Analysis</span>
      </div>
      <div className="grid gap-5 p-4 lg:grid-cols-[.85fr_1.15fr]">
        <div className="rounded-lg border border-[#dbe3ec] p-4">
          <h2 className="text-xs font-bold">DETAILED COST BREAKDOWN</h2>
          <p className="mt-4 text-xs text-[#657188]">
            Enter property details to calculate your cost breakdown.
          </p>
        </div>
        <ChartPlaceholder />
      </div>
    </section>
  );
});
