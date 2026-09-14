"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  Check,
  ClipboardCheck,
  Columns3,
  Compass,
  FileCheck2,
  Landmark,
  MapPin,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";

const categories = [
  "All",
  "Buying",
  "Legal",
  "Finance",
  "Location",
  "Planning",
];

const tools = [
  {
    title: "Property Comparison",
    href: "/tools/property-comparison",
    categories: ["Buying", "Planning"],
    icon: Columns3,
    description:
      "Bring your shortlisted homes together. Compare prices, space and amenities to see which one fits your life.",
    detail: "Price · Area · Amenities",
    preview: ["Compare your shortlist", "See the differences that matter"],
    tone: "bg-[#e8efe5]",
  },
  {
    title: "Document Checklist",
    href: "/tools/document-checklist",
    categories: ["Legal", "Planning"],
    icon: ClipboardCheck,
    description:
      "Keep track of the paperwork for your property purchase, from ownership records to the final agreement.",
    detail: "Ownership · Approvals · Agreements",
    preview: ["Sale deed & title records", "Approvals & certificates"],
    tone: "bg-[#f1eadc]",
  },
  {
    title: "Stamp Duty & Registration Lookup",
    href: "/tools/stamp-duty",
    categories: ["Finance", "Legal"],
    icon: FileCheck2,
    description:
      "Explore location-specific stamp duty and registration information to plan for costs beyond the property price.",
    detail: "Stamp duty · Registration charges",
    preview: ["Select your property location", "Understand purchase charges"],
    tone: "bg-[#e8eeeb]",
  },
  {
    title: "Home Loan Eligibility",
    href: "/tools/loan-eligibility",
    categories: ["Finance", "Buying"],
    icon: Landmark,
    description:
      "Understand your potential borrowing range based on your income, existing commitments and loan preferences.",
    detail: "Income · Commitments · Loan tenure",
    preview: [
      "Get a clearer borrowing picture",
      "Plan around your monthly budget",
    ],
    tone: "bg-[#ececdf]",
  },
  {
    title: "Locality Explorer",
    href: "/tools/locality-explorer",
    categories: ["Location", "Planning"],
    icon: MapPin,
    description:
      "Look beyond the address. Explore connectivity, nearby amenities and the everyday essentials of a neighbourhood.",
    detail: "Connectivity · Amenities · Lifestyle",
    preview: ["Explore the neighbourhood", "Discover everyday essentials"],
    tone: "bg-[#e5eee8]",
  },
  {
    title: "RERA Project Checker",
    href: "/tools/rera-checker",
    categories: ["Legal", "Buying"],
    icon: ShieldCheck,
    description:
      "Find your way to official RERA records to review a project’s registration details and published information.",
    detail: "Registration · Project information",
    preview: [
      "Start with the project details",
      "Review official registration records",
    ],
    tone: "bg-[#e7ebef]",
  },
];

export default function ToolsDirectory() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const search = query.trim().toLowerCase();
  const filteredTools = tools.filter(
    (tool) =>
      (category === "All" || tool.categories.includes(category)) &&
      `${tool.title} ${tool.description} ${tool.detail} ${tool.categories.join(" ")}`
        .toLowerCase()
        .includes(search),
  );

  function resetFilters() {
    setQuery("");
    setCategory("All");
  }

  return (
    <section
      id="explore-tools"
      aria-labelledby="directory-title"
      className="mx-auto max-w-[1360px] scroll-mt-28 px-5 py-12 lg:px-10 lg:py-16"
    >
      <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
        <div>
          <p className="eyebrow">MORE CLARITY, EVERY STEP</p>
          <h2
            id="directory-title"
            className="mt-3 font-serif text-4xl tracking-[-.03em] sm:text-5xl"
          >
            The right tools for your next move.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-ink/65">
            A thoughtful toolkit for the questions that come with finding a
            home.
          </p>
        </div>
        <div role="search" className="w-full lg:max-w-[350px]">
          <label htmlFor="tools-search" className="sr-only">
            Search tools
          </label>
          <div className="flex h-14 items-center gap-3 rounded-2xl border border-ink/15 bg-white px-4 shadow-sm transition focus-within:border-green focus-within:ring-2 focus-within:ring-green/15">
            <Search
              className="shrink-0 text-green"
              size={20}
              aria-hidden="true"
            />
            <input
              id="tools-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search tools, topics or keywords…"
              className="min-w-0 flex-1 bg-transparent py-3 text-sm text-ink placeholder:text-ink/45 focus-visible:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="rounded-full p-2 text-ink/60 hover:bg-sage/50"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div
        role="group"
        aria-label="Filter tools by category"
        className="mt-8 flex flex-wrap gap-2 border-b border-ink/10 pb-7"
      >
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={category === item}
            onClick={() => setCategory(item)}
            className={`min-h-11 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors ${category === item ? "border-green bg-green text-white shadow-sm" : "border-ink/10 bg-white/60 text-ink/65 hover:border-green/40 hover:bg-sage/40 hover:text-green"}`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="mb-5 mt-6 flex flex-wrap items-center justify-between gap-3">
        <p
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="text-sm text-ink/60"
        >
          Showing{" "}
          <span className="font-bold text-ink">{filteredTools.length}</span> of{" "}
          {tools.length} tools
        </p>
        <p className="text-xs text-ink/55">
          Explore a tool to learn more.
        </p>
      </div>

      {filteredTools.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.title}
                href={tool.href}
                aria-label={`Explore ${tool.title}`}
                className="group flex min-w-0 flex-col overflow-hidden rounded-[24px] border border-ink/10 bg-white transition duration-300 hover:border-green/30 hover:shadow-soft motion-safe:hover:-translate-y-1 motion-reduce:transition-none"
              >
                <div
                  className={`relative overflow-hidden border-b border-ink/5 px-6 py-5 ${tool.tone}`}
                >
                  <Icon
                    className="pointer-events-none absolute -right-3 top-3 h-28 w-28 -rotate-12 text-green/[.06]"
                    strokeWidth={1}
                    aria-hidden="true"
                  />
                  <div className="relative flex items-center justify-between gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/80 bg-white/85 text-green shadow-sm">
                      <Icon size={24} strokeWidth={1.6} aria-hidden="true" />
                    </span>
                  </div>
                  <div className="relative mt-4 space-y-2 rounded-xl border border-white/80 bg-white/60 p-3.5">
                    {tool.preview.map((line) => (
                      <p
                        key={line}
                        className="flex items-center gap-2 text-xs text-ink/65"
                      >
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-green/40" />
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-[10px] font-bold uppercase tracking-[.14em] text-green">
                    {tool.categories.join(" / ")}
                  </p>
                  <h3 className="mt-3 font-serif text-[27px] leading-tight tracking-[-.02em] text-ink">
                    {tool.title}
                  </h3>
                  <p className="mb-5 mt-3 text-sm leading-6 text-ink/65">
                    {tool.description}
                  </p>
                  <div className="mt-auto border-t border-ink/10 pt-4">
                    <p className="text-[11px] leading-5 text-ink/55">
                      {tool.detail}
                    </p>
                    <p className="mt-3 flex items-center justify-between text-xs font-semibold text-green">
                      Explore tool{" "}
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sage/50">
                        <ArrowUpRight size={15} aria-hidden="true" />
                      </span>
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-green/25 bg-white/60 px-6 py-16 text-center">
          <Search size={30} className="mx-auto text-green" aria-hidden="true" />
          <h3 className="mt-4 font-serif text-3xl">No tools found</h3>
          <p className="mt-3 text-sm leading-6 text-ink/60">
            Try a different keyword or category to find what you need.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="btn-dark mt-6"
          >
            Reset filters
          </button>
        </div>
      )}

      <div className="mt-12 grid gap-6 rounded-[24px] border border-green/10 bg-[#eaf0e7] p-6 sm:p-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-green">
            <Compass size={24} strokeWidth={1.5} aria-hidden="true" />
          </span>
          <div>
            <h3 className="font-serif text-2xl">
              A clearer path to your next home.
            </h3>
            <p className="mt-2 max-w-lg text-sm leading-6 text-ink/65">
              Compare your options, organise the details and get to know the
              place you could call home.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-green lg:justify-end">
          <span className="flex items-center gap-2">
            <Building2 size={16} aria-hidden="true" /> Property focused
          </span>
          <span className="flex items-center gap-2">
            <Check size={16} aria-hidden="true" /> Simple to explore
          </span>
          <span className="flex items-center gap-2">
            <Compass size={16} aria-hidden="true" /> Built for your journey
          </span>
        </div>
      </div>
    </section>
  );
}
