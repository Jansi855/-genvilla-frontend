"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Landmark,
  Search,
  ShieldCheck,
  Sparkles,
  UserCheck,
  FileCheck2,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { governmentSchemes } from "@/data/governmentSchemes";

const filters = [
  "All Schemes",
  "Central Government",
  "State Government",
  "Affordable Housing",
  "Home Purchase",
  "Home Construction",
  "Home Improvement",
];

const schemeImages = {
  "pmay-urban-2": "/schemes/pmay-urban.png",
  "ambedkar-awas-navinikaran": "/schemes/ambedkar-awas.png",
  "mukhyamantri-awas-yojana": "/schemes/up-awas.webp",
  clss: "/schemes/clss.png",
};

function getSchemeImage(scheme) {
  if (schemeImages[scheme.slug]) {
    return schemeImages[scheme.slug];
  }

  const name = scheme.name?.toLowerCase() || "";

  if (name.includes("pradhan mantri awas")) {
    return "/schemes/pmay-urban.png";
  }

  if (name.includes("ambedkar")) {
    return "/schemes/ambedkar-awas.png";
  }

  if (name.includes("mukhyamantri")) {
    return "/schemes/up-awas.webp";
  }

  if (name.includes("credit linked") || name.includes("clss")) {
    return "/schemes/clss.png";
  }

  return "/schemes/hero-schemes.png";
}

export default function SchemesPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All Schemes");

  const visible = useMemo(() => {
    return governmentSchemes.filter((s) => {
      const text = [s.name, s.shortName, s.authority, s.state, ...s.schemeType]
        .join(" ")
        .toLowerCase();

      const found = !query || text.includes(query.toLowerCase());

      const selected =
        filter === "All Schemes" ||
        (filter === "Central Government" && s.level === "CENTRAL") ||
        (filter === "State Government" && s.level === "STATE") ||
        s.schemeType.includes(filter);

      return found && selected;
    });
  }, [query, filter]);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-cream">
        {/* HERO */}
        <section className="overflow-hidden border-b border-ink/10 bg-[#eef1ea]">
          <div className="mx-auto grid max-w-[1320px] gap-10 px-5 py-12 lg:grid-cols-[1fr_.9fr] lg:items-center lg:px-10 lg:py-16">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-green/15 bg-white/70 px-3 py-2 shadow-sm backdrop-blur">
                <ShieldCheck size={14} className="text-green" />
                <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-green">
                  Verified Government Housing Schemes
                </span>
              </div>

              <h1 className="mt-5 max-w-3xl font-serif text-5xl leading-[0.95] text-[#15352c] sm:text-6xl">
                Find housing support that may match your profile.
              </h1>

              <p className="mt-6 max-w-2xl text-sm leading-7 text-ink/60">
                Explore verified Central and State housing schemes, understand
                available benefits, and check whether you may be eligible before
                applying.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/schemes/check-eligibility" className="btn-dark">
                  Check My Eligibility
                  <ArrowRight size={15} />
                </Link>

                <a href="#all-schemes" className="btn-outline">
                  Explore All Schemes
                </a>
              </div>

              <div className="mt-8 max-w-xl rounded-2xl border border-ink/10 bg-white px-4 shadow-[0_8px_25px_rgba(20,65,48,0.05)] transition-all duration-300 focus-within:border-green/30 focus-within:shadow-[0_10px_30px_rgba(20,65,48,0.08)]">
                <label className="flex items-center gap-3">
                  <Search size={18} className="shrink-0 text-ink/40" />

                  <input
                    className="h-14 w-full bg-transparent text-sm outline-none"
                    placeholder="Search schemes, locations or benefits..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </label>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-y-4">
                <div className="group flex items-center gap-2.5 pr-5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e5f3eb] text-green transition-all duration-300 group-hover:-translate-y-0.5 group-hover:bg-green group-hover:text-white">
                    <ShieldCheck size={17} strokeWidth={2} />
                  </div>

                  <span className="text-[11px] font-semibold text-[#39594f]">
                    Verified information
                  </span>
                </div>

                <div className="hidden h-7 w-px bg-green/20 sm:block" />

                <div className="group flex items-center gap-2.5 px-5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e5f3eb] text-green transition-all duration-300 group-hover:-translate-y-0.5 group-hover:bg-green group-hover:text-white">
                    <UserCheck size={17} strokeWidth={2} />
                  </div>

                  <span className="text-[11px] font-semibold text-[#39594f]">
                    Eligibility guidance
                  </span>
                </div>

                <div className="hidden h-7 w-px bg-green/20 sm:block" />

                <div className="group flex items-center gap-2.5 pl-5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e5f3eb] text-green transition-all duration-300 group-hover:-translate-y-0.5 group-hover:bg-green group-hover:text-white">
                    <FileCheck2 size={17} strokeWidth={2} />
                  </div>

                  <span className="text-[11px] font-semibold text-[#39594f]">
                    Official application routes
                  </span>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-[32px] border border-white/80 bg-white shadow-[0_22px_60px_rgba(20,65,48,0.13)]">
              <img
                src="/schemes/hero-schemes.png"
                alt="Government housing support"
                className="h-[360px] w-full object-cover transition-transform duration-700 group-hover:scale-[1.035] sm:h-[420px] lg:h-[460px]"
              />

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#102c24]/90 via-[#102c24]/35 to-transparent p-6 pt-28 text-white sm:p-8">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 backdrop-blur">
                  <Sparkles size={12} />
                  <span className="text-[9px] font-bold uppercase tracking-[0.12em]">
                    Housing Support
                  </span>
                </div>

                <p className="mt-3 max-w-md font-serif text-2xl leading-tight sm:text-3xl">
                  A secure home can be the beginning of a better future.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* MAIN CONTENT */}
        <section
          id="all-schemes"
          className="mx-auto max-w-[1320px] px-5 py-10 lg:px-10 lg:py-14"
        >
          {/* ELIGIBILITY CTA */}
          <div className="relative overflow-hidden rounded-[28px] bg-[#15352c] p-6 text-white shadow-[0_18px_45px_rgba(21,53,44,0.18)] sm:p-8">
            <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute -bottom-20 -left-12 h-56 w-56 rounded-full bg-green/10 blur-3xl" />

            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="eyebrow !text-[#a6cbbd]">
                  CHECK WHICH SCHEMES MATCH YOU
                </p>

                <h2 className="mt-3 max-w-3xl font-serif text-3xl leading-tight sm:text-4xl">
                  Get an explainable pre-screening result using your household
                  and property details.
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60">
                  Check likely eligibility conditions before you visit the
                  official application portal.
                </p>
              </div>

              <Link
                href="/schemes/check-eligibility"
                className="btn-light shrink-0"
              >
                Check My Eligibility
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* FILTERS */}
          <div className="mt-9 flex gap-2 overflow-x-auto pb-2">
            {filters.map((x) => (
              <button
                key={x}
                type="button"
                onClick={() => setFilter(x)}
                className={`whitespace-nowrap rounded-full border px-4 py-2.5 text-xs font-bold transition-all duration-300 ${
                  filter === x
                    ? "border-green bg-[#eaf1e9] text-green shadow-sm"
                    : "border-ink/10 bg-white text-ink/60 hover:border-green/30 hover:bg-[#f7fbf8] hover:text-green"
                }`}
              >
                {x}
              </button>
            ))}
          </div>

          {/* SCHEMES HEADING */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">VERIFIED SCHEME REGISTRY</p>

              <h2 className="mt-2 font-serif text-4xl text-[#15352c] sm:text-5xl">
                Government housing schemes
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/55">
                Browse verified schemes and understand their location, purpose,
                benefits, eligibility and application route.
              </p>
            </div>

            <div className="rounded-full border border-ink/10 bg-white px-4 py-2 text-xs font-bold text-ink/50">
              {visible.length} {visible.length === 1 ? "scheme" : "schemes"}{" "}
              found
            </div>
          </div>

          {/* SCHEME CARDS */}
          <div className="mt-7 grid gap-6 md:grid-cols-2">
            {visible.map((s) => (
              <article
                key={s.id}
                className="group overflow-hidden rounded-[28px] border border-ink/10 bg-white shadow-[0_8px_30px_rgba(20,65,48,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-green/20 hover:shadow-[0_18px_45px_rgba(20,65,48,0.1)]"
              >
                <div className="relative h-[220px] overflow-hidden bg-[#eef1ea] sm:h-[250px]">
                  <img
                    src={getSchemeImage(s)}
                    alt={s.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                  />

                  <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4">
                    <span className="rounded-full bg-white/90 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.06em] text-green shadow-sm backdrop-blur">
                      {s.level === "CENTRAL"
                        ? "CENTRAL GOVERNMENT"
                        : s.state?.toUpperCase()}
                    </span>

                    <span className="rounded-full bg-[#e8f5ed]/95 px-3 py-1.5 text-[9px] font-bold uppercase text-green shadow-sm backdrop-blur">
                      {s.status}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <Landmark className="text-[#b98032]" size={23} />

                  <h3 className="mt-4 font-serif text-2xl leading-tight text-[#15352c] sm:text-3xl">
                    {s.name}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-ink/55">
                    {s.description}
                  </p>

                  <dl className="mt-6 grid gap-4 border-y border-ink/10 py-4 text-xs">
                    <div>
                      <dt className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink/40">
                        Location
                      </dt>

                      <dd className="mt-1 font-bold text-ink/80">
                        {s.eligibility.geography}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink/40">
                        Scheme Type
                      </dt>

                      <dd className="mt-1 leading-5 font-bold text-ink/80">
                        {s.schemeType.join(" · ")}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                    <Link
                      href={`/schemes/${s.slug}`}
                      className="inline-flex items-center gap-2 text-xs font-bold text-green transition-all hover:gap-3"
                    >
                      View Details
                      <ArrowRight size={14} />
                    </Link>

                    <Link
                      href="/schemes/check-eligibility"
                      className="rounded-full bg-[#15352c] px-4 py-2.5 text-xs font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-green hover:shadow-lg"
                    >
                      Check Eligibility
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {!visible.length && (
            <div className="mt-10 rounded-3xl border border-dashed border-ink/15 bg-white p-10 text-center">
              <Search size={28} className="mx-auto text-ink/30" />

              <h3 className="mt-4 font-serif text-2xl text-[#15352c]">
                No schemes found
              </h3>

              <p className="mt-2 text-sm text-ink/50">
                Try changing your search text or selecting another filter.
              </p>
            </div>
          )}

          {/* BENEFIT / GUIDANCE CARDS */}
          <section className="mt-16">
            <div className="text-center">
              <p className="eyebrow">FROM ELIGIBILITY TO APPLICATION</p>

              <h2 className="mt-2 font-serif text-4xl text-[#15352c]">
                Understand the complete process
              </h2>

              <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-ink/55">
                GenVilla helps you understand what to check, what benefits may
                apply, which documents you may need and where to apply.
              </p>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              <GuideCard
                image="/schemes/eligibility.jfif"
                title="Check Eligibility"
                text="Review household, income and property conditions before applying."
                href="/schemes/check-eligibility"
              />

              <GuideCard
                image="/schemes/benefits.png"
                title="Know the Benefits"
                text="Understand financial assistance, housing support and scheme-specific benefits."
              />

              <GuideCard
                image="/schemes/documents.jpg"
                title="Documents Required"
                text="Prepare the documents that may be required for verification and application."
              />

              <GuideCard
                image="/schemes/apply.png"
                title="How to Apply"
                text="Follow the official application route and understand the next steps."
              />
            </div>
          </section>
        </section>
      </main>

      <Footer />
    </>
  );
}

function GuideCard({ image, title, text, href }) {
  const content = (
    <div className="group h-full overflow-hidden rounded-[24px] border border-ink/10 bg-white shadow-[0_8px_25px_rgba(20,65,48,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-green/20 hover:shadow-[0_16px_38px_rgba(20,65,48,0.09)]">
      <div className="h-[160px] overflow-hidden bg-[#eef1ea]">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.08] group-hover:brightness-[0.88]"
        />
      </div>

      <div className="p-5">
        <h3 className="font-serif text-2xl text-[#15352c]">{title}</h3>

        <p className="mt-2 text-xs leading-5 text-ink/55">{text}</p>

        <div className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-green">
          {href ? "Get Started" : "Learn More"}

          <ArrowRight
            size={13}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {content}
      </Link>
    );
  }

  return content;
}
