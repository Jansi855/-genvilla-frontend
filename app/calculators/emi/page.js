"use client";

import { useMemo, useState } from "react";
import {
  Calculator,
  ShieldCheck,
  TrendingUp,
  Lightbulb,
  Home,
  WalletCards,
  IndianRupee,
  Info,
  ChevronRight,
} from "lucide-react";

const formatINR = (value) => {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(Math.round(value));
};

export default function EmiCalculatorPage() {
  const [propertyPrice, setPropertyPrice] = useState(10000000);
  const [downPayment, setDownPayment] = useState(2000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  const result = useMemo(() => {
    const loanAmount = Math.max(propertyPrice - downPayment, 0);

    const monthlyRate = interestRate / 12 / 100;
    const months = tenure * 12;

    let emi = 0;

    if (loanAmount > 0 && monthlyRate > 0 && months > 0) {
      emi =
        (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);
    }

    const totalRepayment = emi * months;
    const totalInterest = totalRepayment - loanAmount;

    const principalPercent =
      totalRepayment > 0 ? (loanAmount / totalRepayment) * 100 : 0;

    const interestPercent =
      totalRepayment > 0 ? (totalInterest / totalRepayment) * 100 : 0;

    const downPaymentPercent =
      propertyPrice > 0 ? (downPayment / propertyPrice) * 100 : 0;

    return {
      loanAmount,
      emi,
      totalInterest,
      totalRepayment,
      principalPercent,
      interestPercent,
      downPaymentPercent,
    };
  }, [propertyPrice, downPayment, interestRate, tenure]);

  const changePropertyPrice = (value) => {
    setPropertyPrice(value);

    if (downPayment > value) {
      setDownPayment(value);
    }
  };

  return (
    <main className="min-h-screen bg-[#fbfaf6] text-[#09231f]">
      <section className="mx-auto max-w-[1360px] px-4 pb-16 pt-6 sm:px-6 lg:px-10">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-[13px] text-[#5f6d6a]">
          <span>Home</span>

          <ChevronRight size={14} />

          <span>Calculators</span>

          <ChevronRight size={14} />

          <span className="text-[#2d3a37]">EMI Calculator</span>
        </div>

        {/* HERO */}
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.05fr]">
          {/* Left */}
          <div>
            <p className="mb-4 text-[13px] font-bold uppercase tracking-[0.17em] text-[#087154]">
              Home Loan Calculator
            </p>

            <h1 className="hero-title font-serif text-4xl leading-[0.98] tracking-[-0.02em] text-[#08242d] sm:text-[52px] lg:text-[56px] xl:text-[60px]">
              <span className="sm:whitespace-nowrap">Plan Your Home Loan</span>
              <br />
              <span className="sm:whitespace-nowrap">With Confidence.</span>
            </h1>

            <p className="mt-6 max-w-[620px] text-[16px] leading-7 text-[#566764]">
              Estimate your monthly EMI, total interest and overall loan
              repayment before making a property decision.
            </p>
          </div>

          {/* Right Image */}
          <div className="hero-image group relative h-[310px] overflow-hidden rounded-[28px] shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
            <img
              src="/emi/home-loan.jpg"
              alt="Home loan"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-[#fbfaf6] via-[#fbfaf6]/20 to-transparent" />

            <p className="absolute right-[13%] top-8 rotate-[-5deg] font-serif text-[28px] italic leading-8 text-[#09262c]">
              A Smarter
              <br />
              Tomorrow
            </p>
          </div>
        </div>

        {/* Feature Row */}
        <div className="mt-7 flex flex-wrap items-center gap-8 lg:gap-12">
          <FeatureItem
            icon={<Calculator size={21} />}
            title="Accurate Estimates"
            description="Plan your finances better"
          />

          <FeatureItem
            icon={<ShieldCheck size={21} />}
            title="Make Informed Decisions"
            description="Compare different scenarios"
          />

          <FeatureItem
            icon={<TrendingUp size={21} />}
            title="Your Dream Home Closer"
            description="Smart tools for a brighter future"
          />

          {/* Adjustment Tip */}
          <div className="group ml-auto flex w-full min-w-0 items-center gap-4 rounded-[14px] border border-[#d1dfd7] bg-[#f1f8f2] px-5 py-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#9fc5b4] hover:bg-[#eaf6ed] hover:shadow-lg sm:w-auto sm:min-w-[320px]">
            <Lightbulb size={25} className="shrink-0 text-[#087154]" />

            <p className="text-[13px] leading-5 text-[#2e5149]">
              Adjust the values to see how your EMI
              <br />
              and total interest change in real time.
            </p>
          </div>
        </div>

        {/* Calculator Grid */}
        <div className="mt-7 grid min-w-0 gap-6 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]">
          {/* LEFT CARD */}
          <div className="min-w-0 rounded-[18px] border border-[#d9dfdc] bg-white p-5 shadow-[0_3px_16px_rgba(0,0,0,0.03)] sm:p-6 lg:p-7">
            {/* Heading */}
            <div className="group flex cursor-default items-center gap-3 rounded-xl p-2 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-md">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#def4e6] text-[#087154] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#087154] group-hover:text-white">
                <Calculator size={22} />
              </div>

              <h2 className="font-serif text-[27px] font-semibold text-[#102a2f]">
                Loan Details
              </h2>
            </div>

            {/* Property Price */}
            <SliderField
              label="Property Price"
              value={propertyPrice}
              min={1000000}
              max={50000000}
              step={100000}
              display={`₹${formatINR(propertyPrice)}`}
              minLabel="₹10,00,000"
              maxLabel="₹5,00,00,000"
              onChange={changePropertyPrice}
            />

            {/* Down Payment */}
            <SliderField
              label="Down Payment"
              value={downPayment}
              min={0}
              max={propertyPrice}
              step={100000}
              display={`₹${formatINR(downPayment)}`}
              minLabel="₹0"
              maxLabel={`₹${formatINR(propertyPrice)}`}
              onChange={setDownPayment}
            />

            {/* Loan Amount */}
            <div className="mb-8 flex items-center justify-between rounded-[10px] bg-[#edf7ed] px-4 py-4 text-[#087154]">
              <div className="flex items-center gap-3 font-semibold">
                <Home size={22} />

                <span>Estimated Loan Amount</span>
              </div>

              <strong>₹{formatINR(result.loanAmount)}</strong>
            </div>

            {/* Interest */}
            <SliderField
              label="Interest Rate (% p.a.)"
              value={interestRate}
              min={6}
              max={15}
              step={0.05}
              display={`${interestRate.toFixed(2)} %`}
              minLabel="6%"
              maxLabel="15%"
              onChange={setInterestRate}
            />

            {/* Tenure */}
            <div className="mb-5">
              <p className="mb-4 text-[14px] font-semibold">Loan Tenure</p>

              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                {[5, 10, 15, 20, 25, 30].map((year) => (
                  <button
                    key={year}
                    onClick={() => setTenure(year)}
                    type="button"
                    className={`rounded-[7px] border py-3 text-[12px] font-medium transition ${
                      tenure === year
                        ? "border-[#087154] bg-[#087154] text-white"
                        : "border-[#d9dfdc] bg-white text-[#34433f] hover:border-[#087154]"
                    }`}
                  >
                    {year} Yrs
                  </button>
                ))}
              </div>
            </div>

            {/* Downpayment note */}
            <div className="flex gap-3 rounded-[10px] border border-[#d5e1db] bg-[#f7fbf7] px-4 py-4">
              <Info size={23} className="mt-[2px] shrink-0 text-[#087154]" />

              <div>
                <p className="text-[13px] font-semibold text-[#223834]">
                  Your down payment covers{" "}
                  {result.downPaymentPercent.toFixed(1)}% of the property price.
                </p>

                <p className="mt-1 text-[11px] leading-5 text-[#687772]">
                  Increasing your down payment can significantly reduce your EMI
                  and total interest.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT CARD */}
          <div className="min-w-0 rounded-[18px] border border-[#d9dfdc] bg-white p-5 shadow-[0_3px_16px_rgba(0,0,0,0.03)] sm:p-6 lg:p-7">
            {/* EMI Header */}
            <div className="flex justify-between gap-6">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-[14px] font-semibold">
                    Estimated Monthly EMI
                  </p>

                  <Info size={15} className="text-[#71807b]" />
                </div>

                <div className="mt-3 font-serif text-[60px] leading-none text-[#087154] lg:text-[66px]">
                  ₹{formatINR(result.emi)}
                </div>

                <p className="mt-2 text-[19px] font-semibold">per month</p>

                <p className="mt-4 max-w-[440px] text-[13px] leading-5 text-[#677773]">
                  Based on your loan details, this is your estimated monthly
                  payment.
                </p>
              </div>

              {/* Small graphic */}
              <div className="hidden min-w-[150px] text-center sm:block">
                <p className="rotate-[-6deg] font-serif text-[19px] italic leading-6">
                  Home
                  <br />
                  today
                  <br />
                  brighter
                  <br />
                  tomorrow
                </p>

                <Home
                  size={60}
                  strokeWidth={1.4}
                  className="mx-auto mt-2 text-[#16855e]"
                />
              </div>
            </div>

            {/* Summary Cards */}
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <SummaryCard
                icon={<WalletCards size={22} />}
                label="Loan Amount"
                value={`₹${formatINR(result.loanAmount)}`}
              />

              <SummaryCard
                icon={<TrendingUp size={22} />}
                label="Total Interest"
                value={`₹${formatINR(result.totalInterest)}`}
              />

              <SummaryCard
                icon={<IndianRupee size={22} />}
                label="Total Repayment"
                value={`₹${formatINR(result.totalRepayment)}`}
              />
            </div>

            {/* Breakdown */}
            <div className="mt-5 rounded-[14px] border border-[#dce2df] p-5">
              <div className="flex items-center gap-2">
                <p className="text-[14px] font-semibold">Loan Breakdown</p>

                <Info size={14} className="text-[#71807b]" />
              </div>

              <div className="mt-7 grid items-center gap-8 md:grid-cols-[220px_1fr]">
                {/* Donut */}
                <div className="relative mx-auto h-[210px] w-[210px]">
                  <div
                    className="h-full w-full rounded-full"
                    style={{
                      background: `conic-gradient(
                        #087154 0% ${result.principalPercent}%,
                        #ffb115 ${result.principalPercent}% 100%
                      )`,
                    }}
                  />

                  <div className="absolute inset-[35px] flex flex-col items-center justify-center rounded-full bg-white text-center">
                    <span className="text-[12px] text-[#71807b]">
                      Total Payment
                    </span>

                    <strong className="mt-1 font-serif text-[19px]">
                      ₹{formatINR(result.totalRepayment)}
                    </strong>
                  </div>
                </div>

                {/* Breakdown right */}
                <div>
                  <BreakdownRow
                    color="#087154"
                    label="Principal Amount"
                    value={`₹${formatINR(result.loanAmount)}`}
                    percentage={result.principalPercent}
                  />

                  <BreakdownRow
                    color="#ffb115"
                    label="Total Interest"
                    value={`₹${formatINR(result.totalInterest)}`}
                    percentage={result.interestPercent}
                  />

                  <div className="mt-6 flex gap-3 rounded-[10px] bg-[#edf6ea] px-4 py-4">
                    <Info size={21} className="shrink-0 text-[#087154]" />

                    <p className="text-[12px] leading-5 text-[#38544c]">
                      You will pay around{" "}
                      <strong>{result.interestPercent.toFixed(0)}%</strong> of
                      the total repayment as interest.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ---------------- FEATURE ---------------- */

function FeatureItem({ icon, title, description }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#def4e6] text-[#087154]">
        {icon}
      </div>

      <div>
        <p className="text-[12px] font-semibold text-[#1f3732]">{title}</p>

        <p className="mt-1 text-[11px] text-[#6e7b77]">{description}</p>
      </div>
    </div>
  );
}

/* ---------------- SLIDER ---------------- */

function SliderField({
  label,
  value,
  min,
  max,
  step,
  display,
  minLabel,
  maxLabel,
  onChange,
}) {
  const percent = max > min ? ((value - min) / (max - min)) * 100 : 0;

  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center justify-between gap-4">
        <label className="text-[14px] font-semibold">{label}</label>

        <div className="min-w-[132px] rounded-[8px] border border-[#d7dfdb] bg-white px-4 py-3 text-right text-[14px] font-semibold">
          {display}
        </div>
      </div>

      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="genvilla-range w-full"
        style={{
          "--range-progress": `${percent}%`,
        }}
      />

      <div className="mt-2 flex justify-between text-[11px] text-[#788681]">
        <span>{minLabel}</span>

        <span>{maxLabel}</span>
      </div>
    </div>
  );
}

/* ---------------- SUMMARY ---------------- */

function SummaryCard({ icon, label, value }) {
  return (
    <div className="rounded-[10px] border border-[#dce2df] bg-white p-4">
      <div className="flex items-center gap-3">
        <div className="text-[#087154]">{icon}</div>

        <div>
          <p className="text-[10px] text-[#71807b]">{label}</p>

          <p className="mt-1 font-serif text-[17px] font-semibold text-[#132d29]">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------------- BREAKDOWN ---------------- */

function BreakdownRow({ color, label, value, percentage }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[#e4e8e6] py-4 text-[12px]">
      <div className="flex items-center gap-3">
        <span
          className="h-3 w-3 rounded-full"
          style={{
            backgroundColor: color,
          }}
        />

        <span>{label}</span>
      </div>

      <div className="flex gap-4 font-semibold">
        <span>{value}</span>

        <span>{percentage.toFixed(1)}%</span>
      </div>
    </div>
  );
}
