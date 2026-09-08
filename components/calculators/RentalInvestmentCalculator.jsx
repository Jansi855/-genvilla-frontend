"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Info, TriangleAlert } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { amountToIndianWords, money, percent } from "@/utils/currency";
import {
  calculateRentalROI,
  calculateRentalScenarios,
} from "@/lib/calculators/rentalRoi";
import CalculatorDisclaimer from "./CalculatorDisclaimer";
import LocationAutocomplete from "@/components/location/LocationAutocomplete";

const steps = [
  "Property",
  "Rental Income",
  "Expenses",
  "Financing",
  "Growth & Holding",
  "Results",
];
const initial = {
  propertyPrice: 8000000,
  trueAcquisitionCost: 8600000,
  knowsTrueCost: true,
  propertyType: "Apartment",
  propertyArea: 1200,
  location: "Gurugram",
  monthlyRent: 35000,
  otherMonthlyIncome: 0,
  securityDeposit: 70000,
  vacancyRate: 5,
  propertyTax: 25000,
  societyCharges: 35000,
  insurance: 0,
  repairReserve: 30000,
  managementMode: "percent",
  managementFeeRate: 0,
  managementFeeAmount: 0,
  otherAnnualExpenses: 0,
  financed: false,
  loanAmount: 5000000,
  downPayment: 3000000,
  interestRate: 8.5,
  tenureYears: 20,
  initialSetupCosts: 0,
  rentGrowthRate: 5,
  appreciationRate: 5,
  holdingYears: 5,
  sellingCostRate: 2,
  targetNetYield: 5,
};
const scenarioDefaults = {
  Conservative: {
    vacancyRate: 10,
    rentGrowthRate: 3,
    appreciationRate: 3,
    repairReserve: 45000,
  },
  Expected: {
    vacancyRate: 5,
    rentGrowthRate: 5,
    appreciationRate: 5,
    repairReserve: 30000,
  },
  Optimistic: {
    vacancyRate: 2,
    rentGrowthRate: 7,
    appreciationRate: 7,
    repairReserve: 20000,
  },
};
const compact = (v) => {
  const n = Math.abs(Number(v) || 0);
  return `${v < 0 ? "-" : ""}₹${n >= 10000000 ? (n / 10000000).toFixed(2) + "Cr" : n >= 100000 ? (n / 100000).toFixed(2) + "L" : n >= 1000 ? Math.round(n / 1000) + "K" : Math.round(n)}`;
};

export default function RentalInvestmentCalculator() {
  const [form, setForm] = useState(initial),
    [step, setStep] = useState(0),
    [projectionYears, setProjectionYears] = useState(5),
    [scenarios, setScenarios] = useState(scenarioDefaults);
  const activeForm = useMemo(
    () => ({
      ...form,
      trueAcquisitionCost: form.knowsTrueCost ? form.trueAcquisitionCost : 0,
    }),
    [form],
  );
  const result = useMemo(() => calculateRentalROI(activeForm), [activeForm]);
  const scenarioResults = useMemo(
    () => calculateRentalScenarios(activeForm, scenarios),
    [activeForm, scenarios],
  );
  const set = (name, value) => setForm((x) => ({ ...x, [name]: value }));
  const visibleProjection = result.projection.slice(0, projectionYears),
    allocation = [
      ["Property Tax", form.propertyTax, "#386c5b"],
      ["Maintenance", form.societyCharges, "#78a18f"],
      ["Vacancy", result.vacancyLoss, "#d8a34a"],
      ["Repairs", form.repairReserve, "#bd725d"],
      ["Management", result.managementFee, "#8a7564"],
      ["Other", form.insurance + form.otherAnnualExpenses, "#a9a29a"],
      ["Loan Payments", result.annualDebtService, "#253b35"],
      ["Net Cash Flow", Math.max(0, result.annualCashFlow), "#63a374"],
    ].filter((x) => x[1] > 0);
  return (
    <main className="bg-cream text-ink">
      <header className="border-b border-ink/10 bg-[#f7faf6]">
        <div className="mx-auto grid max-w-[1360px] items-center gap-10 px-5 py-10 lg:grid-cols-[1fr_1.05fr] lg:px-10 lg:py-12">
          {/* LEFT */}
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#087154]">
              PROPERTY FINANCE TOOL
            </p>

            <h1 className="mt-4 font-serif text-[46px] leading-[1.03] tracking-[-0.04em] text-[#08242d] md:text-[58px]">
              Rental Investment
              <br />
              <span className="text-[#16815b]">Performance.</span>
            </h1>

            <p className="mt-5 max-w-[590px] text-[15px] leading-7 text-[#61736d]">
              See the return you may earn after vacancy, operating costs,
              acquisition cost and optional financing.
            </p>

            <div className="mt-7 flex flex-wrap gap-6">
              <HeroFeature
                icon="↗"
                title="Rental Yield"
                text="Estimate returns"
              />

              <HeroFeature
                icon="₹"
                title="Clear Costs"
                text="Understand expenses"
              />

              <HeroFeature
                icon="📈"
                title="Growth Insights"
                text="Track long-term value"
              />
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="group relative h-[320px] overflow-hidden rounded-[28px] shadow-[0_18px_45px_rgba(18,55,43,0.14)]">
            <img
              src="/roi/rental-investment.jpg"
              alt="Rental investment property"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/5" />

            <div className="absolute bottom-5 left-5 rounded-2xl border border-white/40 bg-white/90 px-5 py-4 shadow-xl backdrop-blur-md">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#16815b]">
                SMART RENTAL PLANNING
              </p>

              <p className="mt-1 text-sm font-semibold text-[#19332d]">
                Turn property into performance.
              </p>
            </div>
          </div>
        </div>
      </header>
      <nav className="sticky top-0 z-20 overflow-x-auto border-b border-[#dce6e0] bg-[#f8faf7]/95 backdrop-blur">
        <ol className="mx-auto flex min-w-[980px] max-w-[1360px] items-center gap-2 px-5 py-3 lg:px-10">
          {steps.map((item, index) => {
            const active = step === index;
            const complete = index < step;

            return (
              <li key={item} className="flex flex-1 items-center">
                <button
                  type="button"
                  onClick={() => setStep(index)}
                  className={`flex flex-1 items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all duration-300 ${
                    active
                      ? "bg-gradient-to-r from-[#16815b] to-[#0d6d4a] text-white shadow-md"
                      : "hover:bg-white"
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${
                      active
                        ? "bg-white/20 text-white"
                        : complete
                          ? "bg-[#dff5e7] text-[#16815b]"
                          : "bg-[#edf1ef] text-[#87938f]"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div>
                    <p
                      className={`text-xs font-extrabold ${
                        active ? "text-white" : "text-[#203832]"
                      }`}
                    >
                      {item}
                    </p>

                    <p
                      className={`mt-0.5 text-[9px] ${
                        active ? "text-white/70" : "text-[#7b8a85]"
                      }`}
                    >
                      {index === 0 && "Property details"}
                      {index === 1 && "Rental income"}
                      {index === 2 && "Operating costs"}
                      {index === 3 && "Loan planning"}
                      {index === 4 && "Growth assumptions"}
                      {index === 5 && "Investment results"}
                    </p>
                  </div>
                </button>

                {index < steps.length - 1 && (
                  <ArrowRight
                    size={14}
                    className="mx-1 shrink-0 text-[#b4bebb]"
                  />
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <div className="mx-auto max-w-[1360px] px-5 py-8 lg:px-10">
        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <section className="min-w-0 rounded-3xl border border-ink/10 bg-white p-5 md:p-7">
            {step === 0 && (
              <Step
                title="Property"
                intro="Start with the location, listing price and the most complete acquisition cost available."
              >
                <div className="mb-7 flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-[#dce8e1] bg-gradient-to-r from-[#f4faf6] to-white p-5">
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#16815b]">
                      PROPERTY DETAILS
                    </p>

                    <h3 className="mt-2 font-serif text-2xl text-[#12372d]">
                      Build your investment profile
                    </h3>

                    <p className="mt-1 max-w-xl text-xs leading-5 text-[#6f807a]">
                      Add accurate property details to get a more reliable
                      rental return estimate.
                    </p>
                  </div>

                  <span className="rounded-full bg-[#e5f6eb] px-4 py-2 text-[10px] font-extrabold text-[#16815b]">
                    STEP 01
                  </span>
                </div>
                <div className="rounded-[20px] border border-[#dce8e1] bg-[#fbfdfb] p-4 shadow-[0_6px_18px_rgba(20,54,42,0.04)]">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[13px] font-bold text-[#17332c]">
                        Property location
                      </p>

                      <p className="mt-1 text-[10px] text-[#7b8984]">
                        Search your city, sector or locality.
                      </p>
                    </div>

                    <span className="rounded-full bg-[#e5f6eb] px-3 py-1 text-[9px] font-extrabold text-[#16815b]">
                      LOCATION
                    </span>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-[#d8e4dd] bg-white">
                    <LocationAutocomplete
                      label=""
                      value={form.location}
                      onSelect={(location) => set("location", location.label)}
                      showMap
                      mapClassName="h-52"
                    />
                  </div>

                  <p className="mt-3 text-[10px] leading-4 text-[#6f807a]">
                    Your selected location helps make rental assumptions and
                    market context more relevant.
                  </p>
                </div>
                <div className="mt-6 rounded-[20px] border border-[#dce8e1] bg-white p-5 shadow-[0_6px_18px_rgba(20,54,42,0.04)]">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[13px] font-bold text-[#17332c]">
                        Property listing price
                      </p>

                      <p className="mt-1 text-[10px] text-[#7b8984]">
                        Enter the advertised or negotiated purchase price.
                      </p>
                    </div>

                    <span className="rounded-full bg-[#fff4df] px-3 py-1 text-[9px] font-extrabold text-[#bd7400]">
                      PURCHASE VALUE
                    </span>
                  </div>

                  <MoneyField
                    label=""
                    name="propertyPrice"
                    value={form.propertyPrice}
                    onChange={set}
                    max={100000000}
                  />

                  <div className="mt-4 flex items-center justify-between rounded-xl bg-[#f5faf7] px-4 py-3">
                    <span className="text-[10px] text-[#75857f]">
                      Current listing value
                    </span>

                    <strong className="text-sm text-[#16815b]">
                      {money(form.propertyPrice)}
                    </strong>
                  </div>
                </div>
                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  {/* PROPERTY TYPE */}
                  <div className="rounded-[20px] border border-[#dce8e1] bg-white p-5 shadow-[0_6px_18px_rgba(20,54,42,0.04)]">
                    <div className="mb-4">
                      <p className="text-[13px] font-bold text-[#17332c]">
                        Property type
                      </p>

                      <p className="mt-1 text-[10px] text-[#7b8984]">
                        Select the type of rental asset.
                      </p>
                    </div>

                    <Select
                      label=""
                      value={form.propertyType}
                      onChange={(value) => set("propertyType", value)}
                      options={[
                        "Apartment",
                        "Independent House",
                        "Villa",
                        "Plot",
                      ]}
                    />
                  </div>

                  {/* PROPERTY AREA */}
                  <div className="rounded-[20px] border border-[#dce8e1] bg-white p-5 shadow-[0_6px_18px_rgba(20,54,42,0.04)]">
                    <div className="mb-4">
                      <p className="text-[13px] font-bold text-[#17332c]">
                        Property area
                      </p>

                      <p className="mt-1 text-[10px] text-[#7b8984]">
                        Enter the usable area in square feet.
                      </p>
                    </div>

                    <NumberField
                      label=""
                      value={form.propertyArea}
                      onChange={(value) => set("propertyArea", value)}
                      min={0}
                      max={100000}
                    />

                    <div className="mt-4 rounded-xl bg-[#f5faf7] px-4 py-3">
                      <p className="text-[10px] text-[#75857f]">Current area</p>

                      <strong className="mt-1 block text-sm text-[#16815b]">
                        {form.propertyArea || 0} sq.ft.
                      </strong>
                    </div>
                  </div>
                </div>
                <div className="mt-6 rounded-[22px] border border-[#dce8e1] bg-gradient-to-r from-[#f7fbf8] to-white p-5 shadow-[0_6px_18px_rgba(20,54,42,0.04)]">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-[13px] font-bold text-[#17332c]">
                        Do you know the True Acquisition Cost?
                      </p>
                      <p className="mt-1 text-[10px] leading-5 text-[#7b8984]">
                        Use the complete purchase cost when available for a more
                        accurate ROI.
                      </p>
                    </div>

                    <span className="rounded-full bg-[#e5f6eb] px-3 py-1 text-[9px] font-extrabold text-[#16815b]">
                      RECOMMENDED
                    </span>
                  </div>

                  <div className="mt-4">
                    <Choice
                      label=""
                      value={form.knowsTrueCost}
                      onChange={(v) => set("knowsTrueCost", v)}
                      yes="Yes — I know the complete cost"
                      no="No — Help me estimate it"
                    />
                  </div>

                  {form.knowsTrueCost ? (
                    <div className="mt-5 rounded-2xl border border-[#dce8e1] bg-white p-4">
                      <MoneyField
                        label="True acquisition cost"
                        name="trueAcquisitionCost"
                        value={form.trueAcquisitionCost}
                        onChange={set}
                        max={120000000}
                      />

                      <div className="mt-4 flex items-center justify-between rounded-xl bg-[#edf8f1] px-4 py-3">
                        <span className="text-[10px] text-[#6f807a]">
                          ROI will use this value
                        </span>
                        <strong className="text-sm text-[#16815b]">
                          {money(form.trueAcquisitionCost)}
                        </strong>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-5 rounded-2xl border border-[#f0dfbd] bg-[#fffaf0] p-5">
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#b8750b]">
                        DON'T KNOW THE TRUE COST?
                      </p>
                      <p className="mt-2 text-xs leading-5 text-[#6f706b]">
                        The listing price may exclude stamp duty, registration,
                        GST, legal and other acquisition costs.
                      </p>
                      <Link
                        className="btn-outline mt-4 !min-h-9 !text-xs"
                        href="/calculators/true-cost"
                      >
                        Calculate True Cost <ArrowRight size={14} />
                      </Link>
                    </div>
                  )}
                </div>
              </Step>
            )}
            {step === 1 && (
              <Step
                title="Rental Income"
                intro="Deposits stay separate and are not treated as income."
              >
                <MoneyField
                  label="Expected monthly rent"
                  name="monthlyRent"
                  value={form.monthlyRent}
                  onChange={set}
                  max={500000}
                />
                <MoneyField
                  label="Other monthly rental income"
                  name="otherMonthlyIncome"
                  value={form.otherMonthlyIncome}
                  onChange={set}
                  max={200000}
                />
                <PercentField
                  label="Expected vacancy"
                  name="vacancyRate"
                  value={form.vacancyRate}
                  onChange={set}
                  max={30}
                />
                <MoneyField
                  label="Security deposit"
                  name="securityDeposit"
                  value={form.securityDeposit}
                  onChange={set}
                  max={2000000}
                />
                <Note>Security deposits are not counted as rental income.</Note>
              </Step>
            )}
            {step === 2 && (
              <Step
                title="Operating Expenses"
                intro="Enter annual costs only. Loan payments remain separate from NOI."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <MoneyField
                    label="Annual property tax"
                    name="propertyTax"
                    value={form.propertyTax}
                    onChange={set}
                  />
                  <MoneyField
                    label="Annual society / maintenance"
                    name="societyCharges"
                    value={form.societyCharges}
                    onChange={set}
                  />
                  <MoneyField
                    label="Annual insurance"
                    name="insurance"
                    value={form.insurance}
                    onChange={set}
                  />
                  <MoneyField
                    label="Annual repair reserve (assumption)"
                    name="repairReserve"
                    value={form.repairReserve}
                    onChange={set}
                  />
                  <MoneyField
                    label="Other annual expenses"
                    name="otherAnnualExpenses"
                    value={form.otherAnnualExpenses}
                    onChange={set}
                  />
                </div>
                <Select
                  label="Management fee method"
                  value={form.managementMode}
                  onChange={(v) => set("managementMode", v)}
                  options={["percent", "amount"]}
                  labels={["% of effective rent", "Annual ₹ amount"]}
                />
                {form.managementMode === "percent" ? (
                  <PercentField
                    label="Management fee"
                    name="managementFeeRate"
                    value={form.managementFeeRate}
                    onChange={set}
                    max={20}
                  />
                ) : (
                  <MoneyField
                    label="Annual management fee"
                    name="managementFeeAmount"
                    value={form.managementFeeAmount}
                    onChange={set}
                  />
                )}
              </Step>
            )}
            {step === 3 && (
              <Step
                title="Financing"
                intro="Cash purchase is the default. Financing affects cash flow, not operating expenses."
              >
                <Choice
                  label="Is this property financed?"
                  value={form.financed}
                  onChange={(v) => set("financed", v)}
                  yes="Yes — Home / Investment Loan"
                  no="No — Cash Purchase"
                />
                {form.financed ? (
                  <>
                    <MoneyField
                      label="Loan amount"
                      name="loanAmount"
                      value={form.loanAmount}
                      onChange={set}
                      max={form.propertyPrice}
                    />
                    <MoneyField
                      label="Down payment"
                      name="downPayment"
                      value={form.downPayment}
                      onChange={set}
                      max={form.propertyPrice}
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <PercentField
                        label="Annual interest rate"
                        name="interestRate"
                        value={form.interestRate}
                        onChange={set}
                        max={20}
                      />
                      <NumberField
                        label="Loan tenure (years)"
                        value={form.tenureYears}
                        onChange={(v) => set("tenureYears", v)}
                        min={1}
                        max={40}
                      />
                    </div>
                    <MoneyField
                      label="Initial setup costs paid in cash"
                      name="initialSetupCosts"
                      value={form.initialSetupCosts}
                      onChange={set}
                    />
                    {form.loanAmount > form.propertyPrice && (
                      <Warning>
                        Loan amount exceeds the listing price. Review whether
                        the funding assumption is realistic.
                      </Warning>
                    )}
                  </>
                ) : (
                  <Note>
                    Loan inputs and debt-service metrics are not applicable for
                    a cash purchase.
                  </Note>
                )}
              </Step>
            )}
            {step === 4 && (
              <Step
                title="Growth & Holding"
                intro="Growth rates are assumptions, not guaranteed returns."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <PercentField
                    label="Annual rent growth"
                    name="rentGrowthRate"
                    value={form.rentGrowthRate}
                    onChange={set}
                    max={15}
                  />
                  <PercentField
                    label="Property appreciation"
                    name="appreciationRate"
                    value={form.appreciationRate}
                    onChange={set}
                    max={15}
                  />
                  <Select
                    label="Holding period"
                    value={String(form.holdingYears)}
                    onChange={(v) => set("holdingYears", Number(v))}
                    options={["1", "3", "5", "10", "15", "20"]}
                    labels={[
                      "1 year",
                      "3 years",
                      "5 years",
                      "10 years",
                      "15 years",
                      "20 years",
                    ]}
                  />
                  <PercentField
                    label="Expected selling cost"
                    name="sellingCostRate"
                    value={form.sellingCostRate}
                    onChange={set}
                    max={10}
                  />
                </div>
                <Warning>
                  Property appreciation is an assumption, not a guaranteed
                  return.
                </Warning>
              </Step>
            )}
            {step === 5 && (
              <Results
                result={result}
                form={form}
                onFormChange={set}
                allocation={allocation}
                projection={visibleProjection}
                projectionYears={projectionYears}
                setProjectionYears={setProjectionYears}
                scenarios={scenarios}
                setScenarios={setScenarios}
                scenarioResults={scenarioResults}
              />
            )}
            {step < 5 && (
              <div className="mt-8 flex justify-between">
                <button
                  className="btn-outline disabled:opacity-30"
                  disabled={!step}
                  onClick={() => setStep((x) => x - 1)}
                >
                  Previous
                </button>
                <button
                  className="btn-green"
                  onClick={() => setStep((x) => x + 1)}
                >
                  Continue <ArrowRight size={15} />
                </button>
              </div>
            )}
          </section>
          <Live result={result} form={form} activeForm={activeForm} />
        </div>
        <CalculatorDisclaimer />
      </div>
    </main>
  );
}

function Step({ title, intro, children }) {
  return (
    <>
      <p className="eyebrow">ENTER ASSUMPTIONS</p>
      <h2 className="mt-2 font-serif text-3xl">{title}</h2>
      <p className="mt-2 text-sm text-ink/55">{intro}</p>
      <div className="mt-7 space-y-5">{children}</div>
    </>
  );
}
function baseNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? Math.max(0, n) : 0;
}
function MoneyField({ label, name, value, onChange, max = 10000000 }) {
  const dynamicMax = Math.max(
      max,
      Math.ceil(baseNumber(value) / 100000) * 100000,
    ),
    step = dynamicMax <= 500000 ? 1000 : 100000;
  return (
    <label className="block">
      <span className="text-xs font-bold">{label}</span>
      <div className="mt-2 flex items-center rounded-xl border border-ink/15 px-3 focus-within:border-green">
        <span className="text-ink/45">₹</span>
        <input
          className="h-11 w-full px-2 outline-none"
          type="number"
          min="0"
          value={value}
          onChange={(e) => onChange(name, baseNumber(e.target.value))}
        />
      </div>
      <small className="mt-1 block text-[11px] text-green">
        {amountToIndianWords(value)}
      </small>
      <input
        aria-label={`${label} slider`}
        className="mt-3 w-full accent-green"
        type="range"
        min="0"
        max={dynamicMax}
        step={step}
        value={Math.min(value, dynamicMax)}
        onChange={(e) => onChange(name, Number(e.target.value))}
      />
      <span className="flex justify-between text-[10px] text-ink/40">
        <span>₹0</span>
        <span>{money(dynamicMax)}</span>
      </span>
    </label>
  );
}
function PercentField({ label, name, value, onChange, max }) {
  return (
    <label className="block">
      <span className="flex justify-between text-xs font-bold">
        <span>{label}</span>
        <output>{percent(value)}</output>
      </span>
      <input
        className="mt-3 w-full accent-green"
        type="range"
        min="0"
        max={max}
        step="0.1"
        value={value}
        onChange={(e) => onChange(name, Number(e.target.value))}
      />
      <input
        className="mt-2 h-10 w-28 rounded-lg border border-ink/15 px-3 text-sm"
        type="number"
        min="0"
        max={max}
        step="0.1"
        value={value}
        onChange={(e) => onChange(name, baseNumber(e.target.value))}
      />
    </label>
  );
}
function NumberField({ label, value, onChange, min = 0, max }) {
  return (
    <label className="block">
      <span className="text-xs font-bold">{label}</span>
      <input
        className="mt-2 h-11 w-full rounded-xl border border-ink/15 px-3"
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(baseNumber(e.target.value))}
      />
    </label>
  );
}
function TextField({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="text-xs font-bold">{label}</span>
      <input
        className="mt-2 h-11 w-full rounded-xl border border-ink/15 px-3"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
function Select({ label, value, onChange, options, labels = options }) {
  return (
    <label className="block">
      <span className="text-xs font-bold">{label}</span>
      <select
        className="mt-2 h-11 w-full rounded-xl border border-ink/15 bg-white px-3"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((x, i) => (
          <option key={x} value={x}>
            {labels[i]}
          </option>
        ))}
      </select>
    </label>
  );
}
function Choice({ label, value, onChange, yes, no }) {
  return (
    <fieldset>
      <legend className="text-xs font-bold">{label}</legend>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {[
          [true, yes],
          [false, no],
        ].map(([v, l]) => (
          <button
            type="button"
            key={l}
            onClick={() => onChange(v)}
            className={`rounded-xl border p-3 text-left text-xs font-bold ${value === v ? "border-green bg-[#eef4ef] text-green" : "border-ink/10"}`}
          >
            {value === v ? "●" : "○"} &nbsp;{l}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
function Note({ children }) {
  return (
    <p className="flex gap-2 rounded-xl bg-[#eef4ef] p-3 text-xs text-ink/65">
      <Info size={16} />
      {children}
    </p>
  );
}
function Warning({ children }) {
  return (
    <p className="flex gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-900">
      <TriangleAlert size={16} />
      {children}
    </p>
  );
}
function Live({ result, form, activeForm }) {
  const yieldValue = Number(result.netRentalYield) || 0;

  const gaugeValue = Math.min(Math.max(yieldValue, 0), 10);

  const isDeficit = result.monthlyCashFlow < 0;

  const yieldStatus =
    yieldValue >= 6
      ? "STRONG POTENTIAL"
      : yieldValue >= 4
        ? "MODERATE"
        : "LOW YIELD";

  return (
    <aside className="h-fit overflow-hidden rounded-[26px] bg-gradient-to-br from-[#0b664a] via-[#0c5942] to-[#073a2d] text-white shadow-[0_18px_45px_rgba(9,77,57,0.22)] xl:sticky xl:top-24">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-white/15 px-6 py-5">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-[#b7e7cb]">
            Live Summary
          </p>

          <p className="mt-1 text-[10px] text-white/55">
            Real-time rental performance
          </p>
        </div>

        <span className="rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-bold text-[#bcefd0]">
          ● Live
        </span>
      </div>

      {/* YIELD */}
      <div className="grid items-center gap-5 px-6 py-6 sm:grid-cols-[145px_1fr]">
        <div className="relative mx-auto h-[140px] w-[140px]">
          <div
            className="h-full w-full rounded-full"
            style={{
              background: `conic-gradient(
                #64d99a 0deg ${gaugeValue * 36}deg,
                rgba(255,255,255,0.12) ${gaugeValue * 36}deg 360deg
              )`,
            }}
          />

          <div className="absolute inset-[14px] flex flex-col items-center justify-center rounded-full bg-[#0b4e3a]">
            <strong className="text-[32px] leading-none">
              {percent(result.netRentalYield)}
            </strong>

            <span className="mt-1 text-[10px] text-white/60">
              Net rental yield
            </span>
          </div>
        </div>

        <div>
          <span
            className={`inline-flex rounded-full px-3 py-1.5 text-[9px] font-extrabold ${
              yieldValue >= 6
                ? "bg-[#dff7e8] text-[#11734f]"
                : yieldValue >= 4
                  ? "bg-[#fff4d9] text-[#a66e00]"
                  : "bg-[#ffe9e7] text-[#c84b47]"
            }`}
          >
            {yieldStatus}
          </span>

          <p className="mt-3 text-sm font-semibold">
            Rental performance at a glance
          </p>

          <p className="mt-2 text-[10px] leading-5 text-white/60">
            Your yield updates automatically as you adjust rent, operating
            expenses and acquisition assumptions.
          </p>
        </div>
      </div>

      {/* METRICS */}
      <div className="grid gap-3 px-6 pb-6 sm:grid-cols-2">
        <SummaryMetric label="NOI / year" value={money(result.noi)} />

        <SummaryMetric
          label="Effective income"
          value={money(result.effectiveRentalIncome)}
        />

        <SummaryMetric
          label={isDeficit ? "Monthly deficit" : "Monthly surplus"}
          value={money(Math.abs(result.monthlyCashFlow))}
          danger={isDeficit}
        />

        <SummaryMetric
          label="Break-even rent"
          value={money(result.breakEvenRent)}
        />
      </div>

      {/* ROI BASIS */}
      <div className="border-t border-white/15 px-6 py-5">
        <p className="text-[10px] uppercase tracking-[0.1em] text-white/50">
          ROI calculated using
        </p>

        <p className="mt-1 text-sm font-bold">
          {form?.knowsTrueCost
            ? `True Acquisition Cost · ${money(
                activeForm?.trueAcquisitionCost || 0,
              )}`
            : `Listing Price · ${money(activeForm?.propertyPrice || 0)}`}
        </p>
      </div>
    </aside>
  );
}

function SummaryMetric({ label, value, danger = false }) {
  return (
    <div className="rounded-2xl bg-white/10 p-4 transition-all duration-300 hover:bg-white/15">
      <p className="text-[10px] text-white/55">{label}</p>

      <strong
        className={`mt-1 block text-sm ${
          danger ? "text-[#ffb4aa]" : "text-white"
        }`}
      >
        {value}
      </strong>
    </div>
  );
}

function Results({
  result,
  form,
  onFormChange,
  allocation,
  projection,
  projectionYears,
  setProjectionYears,
  scenarios,
  setScenarios,
  scenarioResults,
}) {
  const flow = [
    ["Gross annual income", result.grossAnnualIncome],
    ["Vacancy loss", -result.vacancyLoss],
    ["Operating expenses", -result.totalOperatingExpenses],
    ["NOI", result.noi],
    ["Loan payments", -result.annualDebtService],
    ["Annual cash flow", result.annualCashFlow],
  ];
  return (
    <>
      <p className="eyebrow">YOUR RENTAL INVESTMENT REPORT</p>
      <h2 className="mt-2 font-serif text-3xl">Performance dashboard</h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Hero label="Net rental yield" value={percent(result.netRentalYield)} />
        <Hero
          label="Net operating income"
          value={`${compact(result.noi)} / year`}
        />
        <Hero
          label={
            result.monthlyCashFlow < 0
              ? "Monthly cash deficit"
              : "Monthly cash surplus"
          }
          value={`${result.monthlyCashFlow >= 0 ? "+" : ""}${money(Math.abs(result.monthlyCashFlow))}`}
          tone={result.monthlyCashFlow < 0 ? "bad" : "good"}
        />
        {form.financed && (
          <Hero
            label="Cash-on-cash return"
            value={percent(result.cashOnCashReturn)}
          />
        )}
      </div>
      <Panel title="Investment summary">
        <dl className="grid gap-x-8 gap-y-3 text-xs sm:grid-cols-2">
          {[
            ["Listing price", result.form.propertyPrice],
            [
              "True acquisition cost",
              result.form.trueAcquisitionCost || "Not provided",
            ],
            ["Cash invested", result.cashInvested],
            [
              "Loan amount",
              form.financed ? result.form.loanAmount : "Cash purchase",
            ],
            ["Expected monthly rent", result.form.monthlyRent],
            ["Effective annual rent", result.effectiveRentalIncome],
            ["Operating expenses", result.totalOperatingExpenses],
            ["NOI", result.noi],
          ].map(([l, v]) => (
            <div
              className="flex justify-between border-b border-ink/10 pb-2"
              key={l}
            >
              <dt className="text-ink/55">{l}</dt>
              <dd className="font-bold">
                {typeof v === "number" ? money(v) : v}
              </dd>
            </div>
          ))}
        </dl>
      </Panel>
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Rental income waterfall">
          <div className="space-y-2">
            {flow.map(([l, v], i) => (
              <div
                key={l}
                className={`flex items-center justify-between rounded-lg p-3 text-xs ${i === flow.length - 1 ? "bg-[#15352c] text-white" : "bg-[#f4f5f1]"}`}
              >
                <span>{l}</span>
                <b>
                  {v < 0 ? "-" : ""}
                  {money(Math.abs(v))}
                </b>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Annual rental income allocation">
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={allocation.map(([name, value, color]) => ({
                    name,
                    value,
                    color,
                  }))}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="52%"
                  outerRadius="78%"
                >
                  {allocation.map((x) => (
                    <Cell key={x[0]} fill={x[2]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => money(v)} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {result.annualCashFlow < 0 && (
            <Warning>
              Annual financing deficit: {money(Math.abs(result.annualCashFlow))}
              . Deficits are shown separately, never as negative donut slices.
            </Warning>
          )}
        </Panel>
      </div>
      <Panel
        title="5 / 10-year projection"
        action={
          <div className="flex gap-1">
            {[5, 10].map((y) => (
              <button
                className={`rounded-full px-3 py-1 text-[10px] font-bold ${projectionYears === y ? "bg-green text-white" : "bg-ink/5"}`}
                key={y}
                onClick={() => setProjectionYears(y)}
              >
                {y} years
              </button>
            ))}
          </div>
        }
      >
        <div className="h-72">
          <ResponsiveContainer>
            <LineChart data={projection}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={compact} />
              <Tooltip formatter={(v) => money(v)} />
              <Legend />
              <Line
                dataKey="propertyValue"
                name="Property value"
                stroke="#155f4b"
                dot={false}
              />
              <Line
                dataKey="annualRent"
                name="Annual rent"
                stroke="#d39a3e"
                dot={false}
              />
              <Line dataKey="noi" name="NOI" stroke="#6d8f82" dot={false} />
              <Line
                dataKey="annualCashFlow"
                name="Cash flow"
                stroke="#9b5d4d"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-[11px]">
            <thead>
              <tr className="border-b border-ink/10">
                {[
                  "Year",
                  "Rent",
                  "NOI",
                  "Cash Flow",
                  "Est. Property Value",
                ].map((x) => (
                  <th className="py-2" key={x}>
                    {x}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projection
                .filter((_, i) => i < 3 || i === 4 || i === 9)
                .map((x) => (
                  <tr className="border-b border-ink/5" key={x.year}>
                    <td className="py-2">{x.year}</td>
                    <td>{money(x.annualRent)}</td>
                    <td>{money(x.noi)}</td>
                    <td>{money(x.annualCashFlow)}</td>
                    <td>{money(x.propertyValue)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Panel>
      <Panel title="Scenario analysis">
        <p className="text-xs text-ink/55">
          Assumptions are visible and editable. Results are calculated, not
          hardcoded.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[680px] text-[11px]">
            <thead>
              <tr>
                <th className="text-left">Assumption / result</th>
                {Object.keys(scenarios).map((n) => (
                  <th key={n}>{n}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Vacancy", "vacancyRate", "%"],
                ["Rent growth", "rentGrowthRate", "%"],
                ["Appreciation", "appreciationRate", "%"],
                ["Repair reserve", "repairReserve", "₹"],
              ].map(([label, key, suffix]) => (
                <tr key={key}>
                  <td>{label}</td>
                  {Object.entries(scenarios).map(([name, s]) => (
                    <td className="p-1" key={name}>
                      <input
                        aria-label={`${name} ${label}`}
                        className="w-24 rounded border border-ink/10 p-1 text-center"
                        type="number"
                        value={s[key]}
                        onChange={(e) =>
                          setScenarios((all) => ({
                            ...all,
                            [name]: {
                              ...all[name],
                              [key]: baseNumber(e.target.value),
                            },
                          }))
                        }
                      />
                      {suffix}
                    </td>
                  ))}
                </tr>
              ))}
              {[
                ["Net yield", (r) => percent(r.netRentalYield)],
                ["Monthly cash flow", (r) => money(r.monthlyCashFlow)],
                ["5-year ROI", (r) => percent(r.totalROI)],
                ["Property value", (r) => money(r.estimatedSalePrice)],
              ].map(([label, get]) => (
                <tr className="border-t border-ink/10 font-bold" key={label}>
                  <td className="py-2">{label}</td>
                  {Object.keys(scenarios).map((n) => (
                    <td className="text-center" key={n}>
                      {get(scenarioResults[n])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Break-even & target rent">
          <MetricRow
            label="Break-even rent"
            value={`${money(result.breakEvenRent)} / month`}
          />
          <MetricRow label="Current rent" value={money(form.monthlyRent)} />
          <MetricRow
            label={
              form.monthlyRent >= result.breakEvenRent
                ? "Buffer above break-even"
                : "Shortfall"
            }
            value={`${money(Math.abs(form.monthlyRent - result.breakEvenRent))} / month`}
          />
          <hr className="my-4" />
          <PercentField
            label="Target net yield"
            name="targetNetYield"
            value={form.targetNetYield}
            onChange={onFormChange}
            max={12}
          />
          <MetricRow
            label="Required monthly rent"
            value={money(result.targetRent)}
          />
          <MetricRow
            label="Rent gap"
            value={`${money(Math.abs(result.targetRent - form.monthlyRent))} / month`}
          />
        </Panel>
        <Panel title="Rental investment health">
          <div className="flex items-end gap-3">
            <b className="font-serif text-5xl">{result.healthScore}</b>
            <span className="pb-1 text-sm">
              / 100 ·{" "}
              {result.healthScore >= 70
                ? "HEALTHY"
                : result.healthScore >= 45
                  ? "WATCH MARGINS"
                  : "PRESSURED"}
            </span>
          </div>
          <p className="mt-2 text-[10px] text-ink/50">
            A GENVILLA planning score, not a bank or government score.
          </p>
          {Object.entries(result.healthParts).map(([k, v]) => (
            <div className="mt-3" key={k}>
              <div className="flex justify-between text-[10px]">
                <span className="capitalize">
                  {k.replace(/([A-Z])/g, " $1")}
                </span>
                <b>{Math.round(v)}</b>
              </div>
              <div className="mt-1 h-1.5 rounded bg-ink/10">
                <i
                  className="block h-full rounded bg-green"
                  style={{
                    width: `${(v / (k === "expenseLoad" || k === "vacancy" ? 20 : 30)) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </Panel>
      </div>
      <Panel title="Stress tests & holding return">
        <div className="grid gap-3 sm:grid-cols-2">
          <Hero
            label={`At ${form.vacancyRate + 5}% vacancy`}
            value={`${result.vacancyStressCashFlow < 0 ? "Deficit " : "Surplus "}${money(Math.abs(result.vacancyStressCashFlow))}/mo`}
            tone={result.vacancyStressCashFlow < 0 ? "bad" : "good"}
          />
          {form.financed && (
            <Hero
              label={`At ${result.interestStress.rate}% interest`}
              value={`${money(result.interestStress.emi)}/mo EMI`}
              tone={result.interestStress.monthlyCashFlow < 0 ? "bad" : "good"}
            />
          )}
          <Hero
            label={`${form.holdingYears}-year total ROI`}
            value={percent(result.totalROI)}
          />
          <Hero
            label="Estimated annualized return"
            value={percent(result.annualizedReturn)}
          />
        </div>
        <div className="mt-4 grid gap-2 text-xs sm:grid-cols-2">
          <MetricRow
            label="Estimated sale price"
            value={money(result.estimatedSalePrice)}
          />
          <MetricRow label="Selling costs" value={money(result.sellingCosts)} />
          <MetricRow
            label="Outstanding loan"
            value={money(result.outstandingLoanBalance)}
          />
          <MetricRow
            label="Net sale proceeds"
            value={money(result.netSaleProceeds)}
          />
        </div>
      </Panel>
      <Insights result={result} form={form} />
    </>
  );
}
function Panel({ title, action, children }) {
  return (
    <section className="mt-5 rounded-2xl border border-ink/10 p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-serif text-xl">{title}</h3>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}
function Hero({ label, value, tone }) {
  return (
    <div
      className={`rounded-xl p-4 ${tone === "bad" ? "bg-red-50 text-red-900" : tone === "good" ? "bg-[#eaf4ed]" : "bg-[#f4f5f1]"}`}
    >
      <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
        {label}
      </span>
      <b className="mt-2 block text-lg">{value}</b>
    </div>
  );
}
function MetricRow({ label, value }) {
  return (
    <div className="flex justify-between gap-3 border-b border-ink/10 py-2 text-xs">
      <span className="text-ink/55">{label}</span>
      <b className="text-right">{value}</b>
    </div>
  );
}
function Insights({ result, form }) {
  const items = [
    [result.noi >= 0, "Positive operating income.", result.noi < 0],
    [
      result.noi > 0 && result.annualCashFlow < 0,
      "Financing turns positive NOI into negative monthly cash flow.",
      true,
    ],
    [
      form.monthlyRent >= result.breakEvenRent,
      `Current rent is ${money(Math.abs(form.monthlyRent - result.breakEvenRent))} ${form.monthlyRent >= result.breakEvenRent ? "above" : "below"} break-even.`,
      form.monthlyRent < result.breakEvenRent,
    ],
    [
      result.vacancyStressCashFlow < 0,
      `A ${form.vacancyRate + 5}% vacancy assumption produces a monthly deficit.`,
      true,
    ],
    [
      result.targetRent > form.monthlyRent,
      `Target ${form.targetNetYield}% net yield needs about ${money(result.targetRent - form.monthlyRent)} more monthly rent.`,
      true,
    ],
  ].filter((x) => x[0]);
  return (
    <Panel title="Investment insights">
      <ul className="space-y-3 text-xs">
        {items.map(([_, text, warn]) => (
          <li className="flex gap-2" key={text}>
            {warn ? (
              <TriangleAlert className="shrink-0 text-amber-700" size={16} />
            ) : (
              <CheckCircle2 className="shrink-0 text-green" size={16} />
            )}
            <span>{text}</span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
function HeroFeature({ icon, title, text }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e3f5e9] font-bold text-[#16815b]">
        {icon}
      </div>

      <div>
        <p className="text-xs font-bold text-[#203832]">{title}</p>

        <p className="mt-1 text-[10px] text-[#788680]">{text}</p>
      </div>
    </div>
  );
}
