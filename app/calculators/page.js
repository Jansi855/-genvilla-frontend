import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CalculatorCard from "@/components/calculators/CalculatorCard";
import { calculators } from "@/data/calculators";
import { cities } from "@/data/home";
export const metadata = {
  title: "Property Finance Calculators | GenVilla",
  description:
    "Calculate EMI, true property cost, affordability, rental ROI, risk and buy versus rent with GenVilla.",
};
export default function CalculatorsPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="border-b border-ink/10 bg-[#eef1ea]">
          <div className="mx-auto max-w-[1360px] px-5 py-14 lg:px-10 lg:py-16">
            <p className="eyebrow">PROPERTY FINANCE TOOLS</p>
            <h1 className="mt-4 max-w-4xl font-serif text-5xl leading-[1.03] tracking-[-.035em] md:text-7xl">
              Understand the Numbers Before You Buy.
            </h1>
            <p className="mt-6 max-w-3xl leading-7 text-ink/60">
              Calculate EMI, true ownership cost, affordability, rental returns
              and risk for properties across GenVilla&apos;s five Delhi NCR
              markets.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-2">
              <MapPin className="mr-1 text-green" size={17} />
              {cities.map((city) => (
                <span
                  className="rounded-full border border-ink/10 bg-white/70 px-3 py-1.5 text-xs font-bold text-ink/60"
                  key={city}
                >
                  {city}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                className="btn-dark"
                href="/calculators/smart-property-analyzer"
              >
                Analyze a property <ArrowUpRight size={16} />
              </Link>
              <Link className="btn-outline" href="/calculators/affordability">
                Start with affordability
              </Link>
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-[1360px] px-5 pt-12 lg:px-10">
          <div className="rounded-3xl bg-[#15352c] p-7 text-white lg:p-10">
            <p className="eyebrow !text-[#a6cbbd]">ANALYZE A PROPERTY</p>
            <div className="mt-3 grid gap-7 lg:grid-cols-[1fr_.75fr]">
              <div>
                <h2 className="font-serif text-4xl leading-[1.04]">
                  One property. One clear financial decision.
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-6 text-white/60">
                  Choose the city once, then bring True Cost, EMI,
                  affordability, risk, rental ROI and Buy vs Rent insights into
                  one shared profile.
                </p>
                <Link
                  href="/calculators/smart-property-analyzer"
                  className="btn-light mt-6"
                >
                  Analyze Property <ArrowUpRight size={16} />
                </Link>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <Flow
                  title="Enter once"
                  items="Location · Property · Income · Savings · Financing"
                />
                <Flow
                  title="Get clarity"
                  items="True cost · Fit score · Risks · Sensitivity"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-[1360px] px-5 py-16 lg:px-10">
          <div className="mb-9">
            <p className="eyebrow">SIX TOOLS, ONE CLEARER DECISION</p>
            <h2 className="section-title mt-3">Build your financial picture</h2>
            <p className="mt-4 max-w-2xl leading-7 text-ink/55">
              Location-aware inputs now cover Gurugram, Ghaziabad, Sonipat,
              Noida and New Delhi where jurisdiction or market context matters.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {calculators.map((tool) => (
              <CalculatorCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
function Flow({ title, items }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/[.05] p-5">
      <p className="text-xs font-bold uppercase tracking-widest text-[#a6cbbd]">
        {title}
      </p>
      <p className="mt-4 text-sm leading-6 text-white/70">{items}</p>
    </div>
  );
}
