"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";

import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Coins,
  Home,
  IndianRupee,
  Info,
  Landmark,
  Lightbulb,
  PiggyBank,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { money } from "@/utils/currency";

/* =========================================================
   STEPS
========================================================= */

const STEP_DETAILS = [
  {
    title: "Income",
    subtitle: "Your earnings",
    icon: Coins,
  },
  {
    title: "Expenses",
    subtitle: "Monthly outflows",
    icon: Wallet,
  },
  {
    title: "Savings",
    subtitle: "Financial cushion",
    icon: PiggyBank,
  },
  {
    title: "Property",
    subtitle: "Property details",
    icon: Home,
  },
  {
    title: "Financing",
    subtitle: "Loan & EMI",
    icon: Landmark,
  },
  {
    title: "Results",
    subtitle: "Your affordability",
    icon: BarChart3,
  },
];

/* =========================================================
   INITIAL DATA
========================================================= */

const initial = {
  income: {
    monthlyIncome: 0,
    coApplicantIncome: 0,
  },

  expenses: {
    householdExpenses: 0,
    existingEmi: 0,
    rent: 0,
    continueRent: false,
    otherCommitments: 0,
  },

  savings: {
    totalSavings: 0,
    emergencyFund: 0,
    availableDownPayment: 0,
  },

  property: {
    listingPrice: 0,
    trueCost: 0,
  },

  financing: {
    mode: "LOAN",
    loanAmount: 0,
    downPayment: 0,
    interestRate: 8.5,
    tenureYears: 20,
  },
};

/* =========================================================
   HELPERS
========================================================= */

const n = (value) => {
  return Math.max(0, Number(value) || 0);
};

function scoreLabel(score) {
  if (score >= 80) return "COMFORTABLE";
  if (score >= 65) return "MANAGEABLE";
  if (score >= 50) return "STRETCH";

  return "HIGH PRESSURE";
}

/* =========================================================
   AMOUNT IN WORDS
========================================================= */

function amountToIndianWords(value) {
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];

  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  function twoDigit(num) {
    if (num < 20) {
      return ones[num];
    }

    return tens[Math.floor(num / 10)] + (num % 10 ? ` ${ones[num % 10]}` : "");
  }

  function threeDigit(num) {
    if (num >= 100) {
      return (
        `${ones[Math.floor(num / 100)]} Hundred` +
        (num % 100 ? ` ${twoDigit(num % 100)}` : "")
      );
    }

    return twoDigit(num);
  }

  let number = Math.floor(n(value));

  if (!number) {
    return "Zero Rupees";
  }

  const output = [];

  const groups = [
    ["Crore", 10000000],
    ["Lakh", 100000],
    ["Thousand", 1000],
  ];

  for (const [name, size] of groups) {
    const part = Math.floor(number / size);

    if (part) {
      output.push(`${threeDigit(part)} ${name}`);
    }

    number %= size;
  }

  if (number) {
    output.push(threeDigit(number));
  }

  return `${output.join(" ")} Rupees`;
}

/* =========================================================
   EMI
========================================================= */

function calculateEmi(principalAmount, rate, years) {
  const principal = n(principalAmount);

  const months = Math.round(n(years) * 12);

  const monthlyRate = n(rate) / 1200;

  if (!principal || !months) {
    return 0;
  }

  if (!monthlyRate) {
    return principal / months;
  }

  return (
    (principal * monthlyRate * (1 + monthlyRate) ** months) /
    ((1 + monthlyRate) ** months - 1)
  );
}

/* =========================================================
   LOAN FROM EMI
========================================================= */

function principalFromEmi(payment, rate, years) {
  const emi = n(payment);

  const months = Math.round(n(years) * 12);

  const monthlyRate = n(rate) / 1200;

  if (!emi || !months) {
    return 0;
  }

  if (!monthlyRate) {
    return emi * months;
  }

  return (emi * (1 - (1 + monthlyRate) ** -months)) / monthlyRate;
}

/* =========================================================
   SCORING
========================================================= */

function scoreFoir(ratio) {
  if (ratio <= 0.3) return 30;
  if (ratio <= 0.35) return 27;
  if (ratio <= 0.4) return 23;
  if (ratio <= 0.45) return 18;
  if (ratio <= 0.5) return 12;
  if (ratio <= 0.6) return 6;

  return 0;
}

function scoreCashFlow(balance, income) {
  if (!income || balance < 0) {
    return 0;
  }

  const ratio = balance / income;

  if (ratio >= 0.3) return 25;
  if (ratio >= 0.25) return 22;
  if (ratio >= 0.2) return 18;
  if (ratio >= 0.15) return 14;
  if (ratio >= 0.1) return 9;
  if (ratio >= 0.05) return 5;

  return 2;
}

function scoreLiquidity(months) {
  if (months >= 9) return 20;
  if (months >= 6) return 18;
  if (months >= 4) return 15;
  if (months >= 3) return 11;
  if (months >= 2) return 7;
  if (months >= 1) return 3;

  return 0;
}

function scoreLtv(ltv) {
  if (ltv <= 0.6) return 15;
  if (ltv <= 0.7) return 13;
  if (ltv <= 0.75) return 11;
  if (ltv <= 0.8) return 8;
  if (ltv <= 0.9) return 4;

  return 0;
}

function scoreExistingDebt(ratio) {
  if (ratio <= 0.1) return 10;
  if (ratio <= 0.2) return 8;
  if (ratio <= 0.25) return 6;
  if (ratio <= 0.3) return 4;
  if (ratio <= 0.4) return 2;

  return 0;
}

/* =========================================================
   AFFORDABILITY CALCULATION
========================================================= */

function calculateAffordability(form) {
  const income =
    n(form.income.monthlyIncome) + n(form.income.coApplicantIncome);

  const expenses = form.expenses;

  const savings = form.savings;

  const financing = form.financing;

  const isLoan = financing.mode === "LOAN";

  const listingPrice = n(form.property.listingPrice);

  const trueCost = n(form.property.trueCost);

  const propertyCost = trueCost || listingPrice;

  const existingEmi = n(expenses.existingEmi);

  const householdExpenses = n(expenses.householdExpenses);

  const otherCommitments = n(expenses.otherCommitments);

  const continuingRent = expenses.continueRent ? n(expenses.rent) : 0;

  const loanAmount = isLoan ? n(financing.loanAmount) : 0;

  const homeEmi = isLoan
    ? calculateEmi(loanAmount, financing.interestRate, financing.tenureYears)
    : 0;

  const totalDebt = existingEmi + homeEmi;

  const totalCommitments =
    totalDebt + householdExpenses + otherCommitments + continuingRent;

  const monthlyBalance = income - totalCommitments;

  const isSurplus = monthlyBalance >= 0;

  const foir = income ? totalDebt / income : 0;

  const commitmentRatio = income ? totalCommitments / income : 0;

  const existingDebtRatio = income ? existingEmi / income : 0;

  const downPayment = n(financing.downPayment);

  const reservedEmergencyFund = Math.min(
    n(savings.emergencyFund),
    n(savings.totalSavings),
  );

  const usableSavings = Math.max(
    n(savings.totalSavings) - reservedEmergencyFund,
    0,
  );

  const additionalCost = Math.max(propertyCost - listingPrice, 0);

  const upfrontCashRequired = isLoan
    ? downPayment + additionalCost
    : propertyCost;

  const remainingSavings = Math.max(usableSavings - upfrontCashRequired, 0);

  const emergencyBuffer =
    totalCommitments > 0
      ? reservedEmergencyFund / totalCommitments
      : reservedEmergencyFund > 0
        ? 12
        : 0;

  const ltv = propertyCost ? loanAmount / propertyCost : 0;

  const ltvCeiling =
    loanAmount <= 3000000 ? 0.9 : loanAmount <= 7500000 ? 0.8 : 0.75;

  /* Comfortable affordability */

  const requiredSurplus = income * 0.2;

  const debtCapacity = Math.max(income * 0.4 - existingEmi, 0);

  const cashCapacity = Math.max(
    income -
      existingEmi -
      householdExpenses -
      otherCommitments -
      continuingRent -
      requiredSurplus,
    0,
  );

  const comfortableEmi = Math.min(debtCapacity, cashCapacity);

  const comfortableLoan = principalFromEmi(
    comfortableEmi,
    financing.interestRate,
    financing.tenureYears,
  );

  const usableDownPayment = Math.min(
    downPayment || n(savings.availableDownPayment),
    usableSavings,
  );

  const comfortMax = isLoan
    ? comfortableLoan + usableDownPayment
    : usableSavings;

  const comfortMin = comfortMax * 0.8;

  /* Stretch affordability */

  const stretchDebt = Math.max(income * 0.5 - existingEmi, 0);

  const stretchCash = Math.max(
    income -
      existingEmi -
      householdExpenses -
      otherCommitments -
      continuingRent -
      income * 0.1,
    0,
  );

  const stretchLoan = principalFromEmi(
    Math.min(stretchDebt, stretchCash),
    financing.interestRate,
    financing.tenureYears,
  );

  const stretchMax = isLoan ? stretchLoan + usableDownPayment : usableSavings;

  const gap = comfortMax - propertyCost;

  /* Score */

  const loanScores = {
    foir: scoreFoir(foir),

    cashFlow: scoreCashFlow(monthlyBalance, income),

    liquidity: scoreLiquidity(emergencyBuffer),

    ltv: scoreLtv(ltv),

    existingDebt: scoreExistingDebt(existingDebtRatio),
  };

  const cashScores = {
    funding:
      propertyCost && usableSavings >= propertyCost
        ? 30
        : propertyCost && usableSavings / propertyCost >= 0.9
          ? 24
          : 15,

    cashFlow: scoreCashFlow(monthlyBalance, income),

    liquidity: scoreLiquidity(emergencyBuffer),

    existingDebt: scoreExistingDebt(existingDebtRatio),

    remaining: remainingSavings > 0 ? 15 : 0,
  };

  const scores = isLoan ? loanScores : cashScores;

  const rawScore = Object.values(scores).reduce(
    (total, score) => total + score,
    0,
  );

  const issues = [];

  let finalScore = rawScore;

  if (monthlyBalance < 0) {
    finalScore = Math.min(finalScore, 39);

    issues.push("MONTHLY DEFICIT");
  }

  if (foir > 0.6) {
    finalScore = Math.min(finalScore, 39);

    issues.push("FOIR ABOVE 60%");
  }

  if (totalCommitments > 0 && emergencyBuffer < 1) {
    finalScore = Math.min(finalScore, 44);

    issues.push("EMERGENCY BUFFER BELOW 1 MONTH");
  }

  if (propertyCost > stretchMax && stretchMax > 0) {
    finalScore = Math.min(finalScore, 49);

    issues.push("PROPERTY ABOVE STRETCH MAXIMUM");
  }

  if (isLoan && ltv > ltvCeiling + 0.05) {
    finalScore = Math.min(finalScore, 49);

    issues.push("LTV ABOVE MODEL CEILING");
  }

  finalScore = Math.max(0, Math.min(Math.round(finalScore), 100));

  /* Donut Data */

  const donut = [
    ["Home EMI", homeEmi, "#19734b"],

    ["Existing EMI", existingEmi, "#d08a28"],

    ["Household Expenses", householdExpenses, "#547ba8"],

    ["Other Commitments", otherCommitments, "#8a6fb2"],

    ["Continuing Rent", continuingRent, "#c76b6b"],

    ["Monthly Surplus", Math.max(monthlyBalance, 0), "#88b99d"],
  ]
    .filter(([, value]) => value > 0)
    .map(([name, value, color]) => ({
      name,
      value,
      color,
    }));

  return {
    income,

    listing: listingPrice,

    cost: propertyCost,

    isLoan,

    loan: loanAmount,

    homeEmi,

    debt: totalDebt,

    commitments: totalCommitments,

    continuingRent,

    monthlyBalance,

    isSurplus,

    monthlyCashFlow: {
      value: Math.abs(monthlyBalance),

      signedValue: monthlyBalance,
    },

    additionalCost,

    upfront: upfrontCashRequired,

    reservedEmergency: reservedEmergencyFund,

    usableSavings,

    remaining: remainingSavings,

    buffer: emergencyBuffer,

    ltv,

    ltvCeiling,

    ratios: {
      emi: income ? homeEmi / income : 0,

      debt: foir,

      foir,

      commitment: commitmentRatio,

      existingDebt: existingDebtRatio,
    },

    scores,

    rawScore,

    score: finalScore,

    label: scoreLabel(finalScore),

    appliedGuardrails: issues,

    comfortMin,

    comfortMax,

    stretchMax,

    gap,

    donut,
  };
}

/* =========================================================
   AMOUNT INPUT
========================================================= */

function Amount({
  label,
  value,
  onChange,
  max = 10000000,
  step = 10000,
  words = true,
}) {
  const upper = Math.max(max, Math.ceil(n(value) / step) * step);

  const percentage = upper ? Math.min((n(value) / upper) * 100, 100) : 0;

  return (
    <label className="group block">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-[13px] font-bold text-[#102a26]">{label}</span>

        <Info size={14} className="text-[#9aa7a2]" />
      </div>

      <div className="relative">
        <IndianRupee
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8c9a95]"
        />

        <input
          type="number"
          min="0"
          value={value || ""}
          onChange={(e) => onChange(n(e.target.value))}
          placeholder="0"
          className="h-[58px] w-full rounded-xl border border-[#d9e2dd] bg-white pl-11 pr-4 text-lg font-semibold text-[#102a26] outline-none transition-all duration-300 placeholder:text-[#aeb9b5] hover:border-[#a6cbbb] focus:border-[#16815b] focus:ring-4 focus:ring-[#16815b]/10"
        />
      </div>

      <input
        aria-label={`${label} slider`}
        type="range"
        min="0"
        max={upper}
        step={step}
        value={Math.min(n(value), upper)}
        onChange={(e) => onChange(n(e.target.value))}
        className="affordability-range mt-5 w-full"
        style={{
          "--progress": `${percentage}%`,
        }}
      />

      <div className="mt-2 flex justify-between text-[11px] text-[#7d8c87]">
        <span>₹0</span>

        <span>{money(upper)}</span>
      </div>

      {words && (
        <small className="mt-1 block text-[11px] font-normal text-[#70817b]">
          {amountToIndianWords(value)}
        </small>
      )}
    </label>
  );
}

/* =========================================================
   NUMBER INPUT
========================================================= */

function Num({ label, value, onChange, suffix, max = 40, step = 1 }) {
  const upper = Math.max(max, n(value));

  return (
    <label className="block">
      <p className="mb-2 text-[13px] font-bold text-[#102a26]">{label}</p>

      <input
        type="number"
        min="0"
        value={value}
        onChange={(e) => onChange(n(e.target.value))}
        className="h-[58px] w-full rounded-xl border border-[#d9e2dd] bg-white px-4 text-lg font-semibold outline-none transition-all focus:border-[#16815b] focus:ring-4 focus:ring-[#16815b]/10"
      />

      <input
        type="range"
        min="0"
        max={upper}
        step={step}
        value={Math.min(n(value), upper)}
        onChange={(e) => onChange(n(e.target.value))}
        className="mt-5 w-full accent-[#16815b]"
      />

      <small className="mt-1 block text-[11px] text-[#70817b]">{suffix}</small>
    </label>
  );
}

/* =========================================================
   HERO FEATURE
========================================================= */

function HeroFeature({ icon, title, text }) {
  return (
    <div className="group flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e2f6e9] text-[#16815b] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#16815b] group-hover:text-white">
        {icon}
      </div>

      <div>
        <p className="text-xs font-bold text-[#203832]">{title}</p>

        <p className="mt-1 text-[11px] text-[#74827e]">{text}</p>
      </div>
    </div>
  );
}

/* =========================================================
   SIDEBAR
========================================================= */

function Side({ c }) {
  const cashLabel = c.isSurplus ? "Monthly Surplus" : "Monthly Deficit";

  const scoreDegrees = Math.max(0, Math.min(c.score, 100)) * 3.6;

  const scoreColor =
    c.score >= 80
      ? "#15905f"
      : c.score >= 65
        ? "#72a94a"
        : c.score >= 50
          ? "#e5a321"
          : "#ef5350";

  return (
    <aside className="h-fit overflow-hidden rounded-[24px] border border-[#d9e4de] bg-white shadow-[0_12px_35px_rgba(26,74,57,0.08)] lg:sticky lg:top-5">
      {/* Header */}

      <div className="flex items-center justify-between border-b border-[#edf1ef] px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e6f7ec] text-[#16815b]">
            <TrendingUp size={21} />
          </div>

          <p className="text-xs font-extrabold uppercase tracking-[0.13em] text-[#16815b]">
            Your Affordability
          </p>
        </div>

        <span className="flex items-center gap-2 rounded-full bg-[#eaf8ee] px-3 py-1.5 text-[11px] font-bold text-[#16815b]">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#28b56f]" />
          Live
        </span>
      </div>

      {/* Score */}

      <div className="grid items-center gap-5 px-6 py-6 sm:grid-cols-[1fr_145px]">
        <div>
          <p className="text-sm text-[#50615c]">AFFORDABILITY SCORE</p>

          <div className="mt-2 flex items-end gap-2">
            <strong
              className="text-[48px] leading-none"
              style={{
                color: scoreColor,
              }}
            >
              {c.score}
            </strong>

            <span className="mb-1 text-xl text-[#8a9692]">/ 100</span>
          </div>

          <span
            className={`mt-4 inline-flex rounded-full px-4 py-1.5 text-xs font-extrabold ${
              c.label === "HIGH PRESSURE"
                ? "bg-[#fff0ef] text-[#e34d49]"
                : c.label === "STRETCH"
                  ? "bg-[#fff6df] text-[#b37b00]"
                  : "bg-[#e9f7ed] text-[#16815b]"
            }`}
          >
            {c.label}
          </span>
        </div>

        {/* Gauge */}

        <div className="relative mx-auto h-[125px] w-[125px]">
          <div
            className="h-full w-full rounded-full"
            style={{
              background: `conic-gradient(
                ${scoreColor} 0deg ${scoreDegrees}deg,
                #edf1ef ${scoreDegrees}deg 360deg
              )`,
            }}
          />

          <div className="absolute inset-[13px] flex flex-col items-center justify-center rounded-full bg-white">
            <strong className="text-3xl text-[#142824]">{c.score}</strong>

            <span className="text-[11px] text-[#7c8985]">Score</span>
          </div>
        </div>
      </div>

      {/* Metrics */}

      <div className="border-t border-[#edf1ef] px-6">
        <SideMetric
          icon={<IndianRupee size={18} />}
          label="Comfortable Range"
          value={`${money(c.comfortMin)} – ${money(c.comfortMax)}`}
        />

        <SideMetric
          icon={<Home size={18} />}
          label="Current Property"
          value={money(c.cost)}
        />

        <SideMetric
          icon={<ShieldCheck size={18} />}
          label={c.gap >= 0 ? "Affordability Buffer" : "Affordability Gap"}
          value={money(Math.abs(c.gap))}
        />

        <SideMetric
          icon={<TrendingUp size={18} />}
          label={cashLabel}
          value={money(c.monthlyCashFlow.value)}
        />

        <SideMetric
          icon={<PiggyBank size={18} />}
          label="Emergency Buffer"
          value={`${c.buffer.toFixed(1)} months`}
          last
        />
      </div>

      {/* Tip */}

      <div className="m-5 flex gap-3 rounded-2xl bg-gradient-to-r from-[#fff8e5] to-[#fffdf5] p-4">
        <Lightbulb size={21} className="shrink-0 text-[#e4a221]" />

        <p className="text-xs leading-5 text-[#5c5543]">
          <strong>Tip:</strong> Aim to keep your total EMI within a comfortable
          portion of your monthly income.
        </p>
      </div>
    </aside>
  );
}

function SideMetric({ icon, label, value, last = false }) {
  return (
    <div
      className={`flex items-center justify-between gap-4 py-4 ${
        last ? "" : "border-b border-[#edf1ef]"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="text-[#16815b]">{icon}</div>

        <span className="text-sm text-[#53655f]">{label}</span>
      </div>

      <strong className="text-sm text-[#152a26]">{value}</strong>
    </div>
  );
}

/* =========================================================
   REVIEW ROW
========================================================= */

function ReviewRow({ label, value, negative = false }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#edf1ee] py-3">
      <span className="text-sm text-[#60716c]">{label}</span>

      <strong
        className={`text-sm ${negative ? "text-red-600" : "text-[#182f29]"}`}
      >
        {value}
      </strong>
    </div>
  );
}

/* =========================================================
   REPORT
========================================================= */

function ReviewReport({ c }) {
  return (
    <div>
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#dff5e7] text-[#16815b]">
          <ShieldCheck size={28} />
        </div>

        <div>
          <h1 className="text-2xl font-extrabold text-[#142a26]">
            YOUR AFFORDABILITY REPORT
          </h1>

          <p className="mt-1 text-sm text-[#667771]">
            Your final affordability summary based on the information provided.
          </p>
        </div>
      </div>

      {/* Score */}

      <div className="mt-7 grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-[#dce5e0] p-5">
          <p className="text-xs font-bold text-[#6e7d78]">
            AFFORDABILITY SCORE
          </p>

          <p className="mt-2 text-4xl font-extrabold">
            {c.score} <span className="text-xl text-[#8c9995]">/ 100</span>
          </p>

          <p
            className={`mt-3 text-sm font-bold ${
              c.label === "HIGH PRESSURE" ? "text-red-600" : "text-[#16815b]"
            }`}
          >
            {c.label}
          </p>
        </div>

        <div className="rounded-2xl border border-[#dce5e0] p-5">
          <p className="text-xs font-bold text-[#6e7d78]">
            COMFORTABLE PROPERTY RANGE
          </p>

          <p className="mt-2 text-2xl font-extrabold text-[#16815b]">
            {money(c.comfortMin)} – {money(c.comfortMax)}
          </p>

          <p className="mt-2 text-xs text-[#70817b]">
            Stretch maximum: {money(c.stretchMax)}
          </p>
        </div>
      </div>

      {/* Financial Analysis */}

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#dce5e0] p-5">
          <h3 className="font-bold text-[#18312b]">MONTHLY CASH FLOW</h3>

          <ReviewRow label="Household Income" value={money(c.income)} />

          <ReviewRow label="Home EMI" value={money(c.homeEmi)} />

          <ReviewRow
            label="Total Monthly Commitments"
            value={money(c.commitments)}
          />

          <ReviewRow
            label={c.isSurplus ? "Monthly Surplus" : "Monthly Deficit"}
            value={money(c.monthlyCashFlow.value)}
            negative={!c.isSurplus}
          />
        </div>

        <div className="rounded-2xl border border-[#dce5e0] p-5">
          <h3 className="font-bold text-[#18312b]">SAVINGS & PROPERTY</h3>

          <ReviewRow label="Property Cost" value={money(c.cost)} />

          <ReviewRow label="Upfront Cash Required" value={money(c.upfront)} />

          <ReviewRow label="Usable Savings" value={money(c.usableSavings)} />

          <ReviewRow
            label="Emergency Buffer"
            value={`${c.buffer.toFixed(1)} months`}
          />
        </div>
      </div>

      {/* Risks */}

      {c.appliedGuardrails.length > 0 && (
        <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-5">
          <h3 className="font-bold text-red-700">Why is your score limited?</h3>

          <div className="mt-3 space-y-2">
            {c.appliedGuardrails.map((issue) => (
              <p key={issue} className="text-sm text-red-600">
                ⚠ {issue}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}

      <div className="mt-7 flex flex-wrap gap-3">
        <Link
          href="/calculators/emi"
          className="rounded-xl bg-[#16815b] px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#106c4b]"
        >
          Continue to EMI Planning →
        </Link>

        <Link
          href="/calculators/true-cost"
          className="rounded-xl border border-[#d8e2dd] px-5 py-3 text-sm font-bold text-[#425750] transition hover:border-[#16815b] hover:text-[#16815b]"
        >
          Calculate True Cost
        </Link>
      </div>
    </div>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function Page() {
  const [formState, setFormState] = useState(initial);

  const [step, setStep] = useState(0);

  const c = useMemo(() => calculateAffordability(formState), [formState]);

  const update = useCallback((section, key, value) => {
    setFormState((state) => ({
      ...state,

      [section]: {
        ...state[section],

        [key]: value,
      },
    }));
  }, []);

  const f = formState;

  /* =======================================================
     STEP PAGES
  ======================================================= */

  const pages = [
    /* 01 INCOME */

    <div key="income">
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#dff5e7] text-[#16815b]">
            <Coins size={28} />
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-[#142a26]">
              YOUR MONTHLY INCOME
            </h1>

            <p className="mt-1 text-sm text-[#667771]">
              Tell us about your income sources to get started.
            </p>
          </div>
        </div>

        <p className="hidden rotate-[-3deg] text-right font-serif text-lg italic text-[#16815b] md:block">
          Every big dream
          <br />
          starts with a plan
        </p>
      </div>

      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        <Amount
          label="Monthly Take-home Income *"
          value={f.income.monthlyIncome}
          onChange={(value) => update("income", "monthlyIncome", value)}
          max={500000}
          step={5000}
        />

        <Amount
          label="Co-applicant Monthly Income"
          value={f.income.coApplicantIncome}
          onChange={(value) => update("income", "coApplicantIncome", value)}
          max={500000}
          step={5000}
        />
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-[#e9f8ee] to-[#f4faf5] p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#16815b] shadow-sm">
            <Coins size={22} />
          </div>

          <div>
            <p className="text-sm font-extrabold text-[#145d43]">
              TOTAL HOUSEHOLD INCOME
            </p>

            <p className="mt-1 text-xs text-[#61746d]">
              Combined monthly income
            </p>
          </div>
        </div>

        <strong className="text-2xl text-[#145d43]">
          {money(c.income)} <span className="text-base">/ month</span>
        </strong>
      </div>
    </div>,

    /* 02 EXPENSES */

    <div key="expenses">
      <h1 className="text-2xl font-extrabold">MONTHLY EXPENSES</h1>

      <p className="mt-2 text-sm text-[#667771]">
        Add your regular monthly financial commitments.
      </p>

      <div className="mt-7 grid gap-7 sm:grid-cols-2">
        <Amount
          label="Existing EMIs"
          value={f.expenses.existingEmi}
          onChange={(value) => update("expenses", "existingEmi", value)}
          max={300000}
          words={false}
        />

        <Amount
          label="Monthly Household Expenses"
          value={f.expenses.householdExpenses}
          onChange={(value) => update("expenses", "householdExpenses", value)}
          max={300000}
          words={false}
        />

        <Amount
          label="Current Rent"
          value={f.expenses.rent}
          onChange={(value) => update("expenses", "rent", value)}
          max={200000}
          words={false}
        />

        <Amount
          label="Other Fixed Commitments"
          value={f.expenses.otherCommitments}
          onChange={(value) => update("expenses", "otherCommitments", value)}
          max={200000}
          words={false}
        />
      </div>

      <div className="mt-7">
        <p className="text-sm font-bold">
          Will you continue paying rent after buying?
        </p>

        <div className="mt-3 flex gap-3">
          <button
            type="button"
            onClick={() => update("expenses", "continueRent", true)}
            className={`rounded-xl border px-5 py-2.5 text-sm font-semibold transition ${
              f.expenses.continueRent
                ? "border-[#16815b] bg-[#eaf7ef] text-[#16815b]"
                : "border-[#dce4df]"
            }`}
          >
            Yes
          </button>

          <button
            type="button"
            onClick={() => update("expenses", "continueRent", false)}
            className={`rounded-xl border px-5 py-2.5 text-sm font-semibold transition ${
              !f.expenses.continueRent
                ? "border-[#16815b] bg-[#eaf7ef] text-[#16815b]"
                : "border-[#dce4df]"
            }`}
          >
            No
          </button>
        </div>
      </div>
    </div>,

    /* 03 SAVINGS */

    <div key="savings">
      <h1 className="text-2xl font-extrabold">YOUR SAVINGS</h1>

      <p className="mt-2 text-sm text-[#667771]">
        Tell us about your savings and financial safety buffer.
      </p>

      <div className="mt-7 grid gap-7 sm:grid-cols-3">
        <Amount
          label="Total Savings"
          value={f.savings.totalSavings}
          onChange={(value) => update("savings", "totalSavings", value)}
          step={100000}
        />

        <Amount
          label="Emergency Fund"
          value={f.savings.emergencyFund}
          onChange={(value) => update("savings", "emergencyFund", value)}
          step={100000}
        />

        <Amount
          label="Available Down Payment"
          value={f.savings.availableDownPayment}
          onChange={(value) => update("savings", "availableDownPayment", value)}
          step={100000}
        />
      </div>
    </div>,

    /* 04 PROPERTY */

    <div key="property">
      <h1 className="text-2xl font-extrabold">PROPERTY YOU ARE CONSIDERING</h1>

      <p className="mt-2 text-sm text-[#667771]">
        Enter the property value you are planning to buy.
      </p>

      <div className="mt-7 grid gap-7 sm:grid-cols-2">
        <Amount
          label="Listing Price"
          value={f.property.listingPrice}
          onChange={(value) => update("property", "listingPrice", value)}
          step={100000}
        />

        <Amount
          label="True Acquisition Cost (optional)"
          value={f.property.trueCost}
          onChange={(value) => update("property", "trueCost", value)}
          step={100000}
        />
      </div>

      <div className="mt-6 rounded-xl bg-[#eef7f0] p-4 text-sm">
        {f.property.trueCost ? (
          <span>True acquisition cost is being used.</span>
        ) : (
          <>
            Using listing price.{" "}
            <Link
              href="/calculators/true-cost"
              className="font-bold text-[#16815b]"
            >
              Calculate True Cost →
            </Link>
          </>
        )}
      </div>
    </div>,

    /* 05 FINANCING */

    <div key="financing">
      <h1 className="text-2xl font-extrabold">HOW ARE YOU PLANNING TO BUY?</h1>

      <p className="mt-2 text-sm text-[#667771]">
        Choose how you plan to finance the property.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => update("financing", "mode", "CASH")}
          className={`rounded-xl border px-5 py-3 text-sm font-semibold transition ${
            !c.isLoan
              ? "border-[#16815b] bg-[#eaf7ef] text-[#16815b]"
              : "border-[#dce4df]"
          }`}
        >
          Cash / Self-funded
        </button>

        <button
          type="button"
          onClick={() => update("financing", "mode", "LOAN")}
          className={`rounded-xl border px-5 py-3 text-sm font-semibold transition ${
            c.isLoan
              ? "border-[#16815b] bg-[#eaf7ef] text-[#16815b]"
              : "border-[#dce4df]"
          }`}
        >
          Home Loan
        </button>
      </div>

      {c.isLoan && (
        <div className="mt-7 grid gap-7 sm:grid-cols-2">
          <Amount
            label="Loan Amount"
            value={f.financing.loanAmount}
            onChange={(value) => update("financing", "loanAmount", value)}
            step={100000}
          />

          <Amount
            label="Down Payment"
            value={f.financing.downPayment}
            onChange={(value) => update("financing", "downPayment", value)}
            step={100000}
          />

          <Num
            label="Interest Rate"
            value={f.financing.interestRate}
            onChange={(value) => update("financing", "interestRate", value)}
            suffix="Annual percentage"
            max={15}
            step={0.1}
          />

          <Num
            label="Loan Tenure"
            value={f.financing.tenureYears}
            onChange={(value) => update("financing", "tenureYears", value)}
            suffix="Years"
            max={30}
          />
        </div>
      )}
    </div>,

    /* 06 RESULTS */

    <ReviewReport key="results" c={c} />,
  ];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f8faf6] px-4 py-8 text-[#15233a]">
        <div className="mx-auto max-w-[1400px]">
          {/* HERO */}

          <section className="grid items-center gap-10 lg:grid-cols-2">
            {/* LEFT */}

            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#087154]">
                GENVILLA · PLANNING TOOL
              </p>

              <h1 className="mt-5 font-serif text-[46px] leading-[1.05] tracking-[-0.03em] text-[#08242d] md:text-[58px]">
                Affordability{" "}
                <span className="relative text-[#16815b]">
                  Calculator
                  <span className="absolute -bottom-2 left-0 h-[3px] w-full rounded-full bg-[#42ad78]/50" />
                </span>
              </h1>

              <h2 className="mt-7 text-xl font-semibold text-[#405650]">
                Can you comfortably afford this property?
              </h2>

              <p className="mt-3 max-w-[610px] text-sm leading-6 text-[#647670]">
                Understand your financial position and plan your dream home with
                confidence. Make smarter property decisions before you buy.
              </p>

              <div className="mt-7 flex flex-wrap gap-6">
                <HeroFeature
                  icon={<BarChart3 size={19} />}
                  title="Smart Analysis"
                  text="Data-driven insights"
                />

                <HeroFeature
                  icon={<ShieldCheck size={19} />}
                  title="Plan Confidently"
                  text="Know your limits"
                />

                <HeroFeature
                  icon={<Home size={19} />}
                  title="Build Your Future"
                  text="Smarter decisions"
                />
              </div>
            </div>

            {/* YOUR SAME IMAGE */}

            <div className="group relative h-[300px] overflow-hidden rounded-[28px] shadow-[0_14px_40px_rgba(20,54,42,0.12)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(20,54,42,0.18)]">
              <img
                src="/affordability/affordability-calculator.jpg"
                alt="Home affordability planning"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-transparent" />

              <div className="absolute bottom-5 left-5 rounded-2xl border border-white/30 bg-white/90 px-5 py-4 shadow-lg backdrop-blur-md">
                <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.13em] text-[#16815b]">
                  <Sparkles size={15} />
                  Smarter Property Planning
                </p>

                <p className="mt-1 text-sm font-semibold text-[#1b332e]">
                  Know your budget before you buy.
                </p>
              </div>
            </div>
          </section>

          {/* STEPPER */}

          <div className="my-8 overflow-x-auto rounded-[22px] border border-[#dde6e1] bg-white p-2 shadow-[0_6px_25px_rgba(19,57,43,0.06)]">
            <div className="flex min-w-[900px] items-center">
              {STEP_DETAILS.map((item, index) => {
                const Icon = item.icon;

                const active = index === step;

                const complete = index < step;

                return (
                  <div key={item.title} className="flex flex-1 items-center">
                    <button
                      type="button"
                      onClick={() => setStep(index)}
                      className={`group flex flex-1 items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all duration-300 ${
                        active
                          ? "bg-gradient-to-r from-[#16815b] to-[#0d6c4a] text-white shadow-md"
                          : "hover:bg-[#f2f8f4]"
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          active
                            ? "bg-white/20 text-white"
                            : complete
                              ? "bg-[#dff5e7] text-[#16815b]"
                              : "bg-[#edf1ef] text-[#87938f]"
                        }`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <Icon
                        size={19}
                        className={active ? "text-white" : "text-[#31453f]"}
                      />

                      <div>
                        <p
                          className={`text-xs font-bold ${
                            active ? "text-white" : "text-[#213833]"
                          }`}
                        >
                          {item.title}
                        </p>

                        <p
                          className={`text-[9px] ${
                            active ? "text-white/75" : "text-[#7b8a85]"
                          }`}
                        >
                          {item.subtitle}
                        </p>
                      </div>
                    </button>

                    {index < STEP_DETAILS.length - 1 && (
                      <ArrowRight size={14} className="mx-1 text-[#b2bcb8]" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* CALCULATOR */}

          <div className="grid gap-6 lg:grid-cols-[1.45fr_.75fr]">
            <section className="rounded-[24px] border border-[#dbe4df] bg-white p-7 shadow-[0_12px_35px_rgba(26,74,57,0.07)] lg:p-8">
              {pages[step]}

              {/* BUTTONS */}

              <div className="mt-9 flex justify-between border-t border-[#e8eeeb] pt-6">
                <button
                  type="button"
                  disabled={!step}
                  onClick={() => setStep((current) => current - 1)}
                  className="group flex items-center gap-2 rounded-xl border border-[#dce4df] px-5 py-3 text-sm font-semibold text-[#53635e] transition hover:border-[#16815b] hover:text-[#16815b] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ArrowLeft
                    size={16}
                    className="transition group-hover:-translate-x-1"
                  />
                  Back
                </button>

                {step < 5 && (
                  <button
                    type="button"
                    onClick={() =>
                      setStep((current) => Math.min(5, current + 1))
                    }
                    className="group rounded-xl bg-gradient-to-r from-[#16815b] to-[#0d6d4a] px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-[#16815b]/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    <span className="flex items-center gap-2">
                      Save & Continue
                      <ArrowRight
                        size={16}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </span>
                  </button>
                )}
              </div>
            </section>

            <Side c={c} />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
