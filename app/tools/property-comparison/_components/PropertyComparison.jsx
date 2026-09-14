"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowLeftRight,
  Building2,
  Check,
  Columns3,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { money } from "@/utils/currency";
import {
  comparisonHighlights,
  getComparisonProperties,
  unavailable,
} from "../_lib/comparison";

const number = (value) =>
  value.toLocaleString("en-IN", { maximumFractionDigits: 2 });
const price = (property) =>
  property.price ? money(property.price) : unavailable;
const rows = [
  { label: "Location", value: (p) => p.location },
  { label: "Listing transaction", value: (p) => p.transaction },
  { label: "Price", value: price, metric: "price", badge: "Lowest price" },
  { label: "Property type", value: (p) => p.type },
  {
    label: "Area",
    value: (p) => (p.area ? `${number(p.area)} sq.ft. (${p.areaBasis})` : null),
    metric: "area",
    badge: "Largest area",
  },
  {
    label: "Listed price per sq.ft.",
    value: (p) => p.listedPricePerSqft ? `${money(p.listedPricePerSqft)} / sq.ft.` : null,
  },
  {
    label: "Calculated price per sq.ft.",
    value: (p) =>
      p.pricePerSqft ? `${money(p.pricePerSqft)} / sq.ft. (calculated)` : null,
    metric: "pricePerSqft",
    badge: "Lowest price per sq.ft.",
  },
  {
    label: "Bedrooms / BHK",
    value: (p) =>
      p.bedrooms !== null
        ? `${p.bedrooms} bedroom${p.bedrooms === 1 ? "" : "s"}`
        : p.bhk,
  },
  { label: "Amenities", value: (p) => p.amenities },
  { label: "Status / possession", value: (p) => p.status },
  { label: "RERA registration number", value: (p) => p.rera },
];

function PropertyImage({ property, className = "h-36 w-full" }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [property?.image]);
  return property?.image && !failed ? (
    <img
      src={property.image}
      alt={property.title || "Property listing"}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`${className} bg-sage/40 object-cover`}
    />
  ) : (
    <div
      className={`${className} flex flex-col items-center justify-center gap-2 bg-sage/40 text-ink/55`}
    >
      <Building2 size={24} aria-hidden="true" />
      <span className="text-xs">{unavailable}</span>
    </div>
  );
}

export default function PropertyComparison() {
  const {
    data: properties = [],
    isPending,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["properties", "comparison"],
    queryFn: ({ signal }) => getComparisonProperties({ signal }),
    staleTime: 5 * 60 * 1000,
  });
  const [slots, setSlots] = useState([null, null]);
  const [activeSlot, setActiveSlot] = useState(null);
  const [query, setQuery] = useState("");
  const [shown, setShown] = useState(8);
  const [announcement, setAnnouncement] = useState("");
  const searchRef = useRef(null);
  const slotButtons = useRef([]);
  const selected = slots.map(
    (id) => properties.find((property) => property.id === id) || null,
  );
  const chosen = selected.filter(Boolean);
  const highlights = comparisonHighlights(chosen);
  const matches = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return properties.filter((p) => {
      const text = [
        p.title,
        p.location,
        p.type,
        p.transaction,
        p.bhk,
        p.bedrooms !== null ? `${p.bedrooms} bedrooms` : "",
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return terms.every((term) => text.includes(term));
    });
  }, [properties, query]);

  useEffect(() => {
    if (activeSlot !== null) searchRef.current?.focus();
  }, [activeSlot]);

  function openPicker(index) {
    setActiveSlot(index);
    setQuery("");
    setShown(8);
  }

  function closePicker() {
    const previous = activeSlot;
    setActiveSlot(null);
    slotButtons.current[previous]?.focus();
  }

  function choose(property) {
    if (activeSlot === null || slots.includes(property.id)) return;
    setSlots((current) =>
      current.map((id, index) => (index === activeSlot ? property.id : id)),
    );
    setAnnouncement(
      `${property.title || "Property"} selected in position ${activeSlot + 1}.`,
    );
    closePicker();
  }

  function clear() {
    setSlots([null, null]);
    setActiveSlot(null);
    setQuery("");
    setAnnouncement("Comparison cleared.");
  }

  return (
    <main className="min-h-[65vh] bg-cream pb-16">
      <section className="border-b border-ink/10 bg-[#eaf0e7]">
        <div className="mx-auto max-w-[1360px] px-5 py-8 lg:px-10 lg:py-12">
          <Link
            href="/tools"
            className="inline-flex min-h-11 items-center gap-2 rounded text-sm font-semibold text-green"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to Tools
          </Link>
          <p className="eyebrow mt-6">YOUR SHORTLIST, SIDE BY SIDE</p>
          <h1 className="mt-3 font-serif text-4xl tracking-[-.035em] sm:text-5xl lg:text-6xl">
            Property Comparison
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-ink/65 sm:text-base">
            See how your options stack up. Choose two GenVilla properties, or
            add a third, to compare the details that matter to you.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1360px] px-5 pt-9 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-2xl">Build your comparison</h2>
            <p className="mt-1 text-sm text-ink/60">
              {chosen.length} of 3 properties selected · Select at least 2
            </p>
          </div>
          <button
            type="button"
            onClick={clear}
            disabled={!slots.some((id) => id !== null) && slots.length === 2}
            className="btn-outline gap-2 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Trash2 size={15} aria-hidden="true" />
            Clear comparison
          </button>
        </div>
        <p role="status" className="sr-only">
          {announcement}
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {selected.map((property, index) => (
            <div
              key={index}
              className={`flex min-w-0 flex-col overflow-hidden rounded-[22px] border bg-white ${activeSlot === index ? "border-green ring-2 ring-green/15" : "border-ink/15"}`}
            >
              <div className="flex items-center justify-between border-b border-ink/10 px-5 py-3">
                <span className="text-xs font-bold uppercase tracking-wider text-green">
                  Property {index + 1}
                </span>
                {(property || index === 2) && (
                  <button
                    type="button"
                    aria-label={`Remove property ${index + 1}${property?.title ? `: ${property.title}` : ""}`}
                    onClick={() => {
                      setSlots((current) =>
                        index === 2
                          ? current.slice(0, 2)
                          : current.map((id, i) => (i === index ? null : id)),
                      );
                      if (activeSlot === index) setActiveSlot(null);
                      setAnnouncement(`Property ${index + 1} removed.`);
                    }}
                    className="rounded-full p-2 text-ink/60 hover:bg-sage/50"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              {property ? (
                <>
                  <PropertyImage property={property} />
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="break-words font-serif text-xl">
                      {property.title || unavailable}
                    </h3>
                    <p className="mt-2 break-words text-xs leading-5 text-ink/60">
                      {property.location || unavailable}
                    </p>
                    <p className="mt-3 font-semibold text-green">
                      {price(property)}
                    </p>
                    <p className="mt-1 text-xs text-ink/55">
                      {property.transaction || unavailable}
                    </p>
                    <button
                      ref={(el) => {
                        slotButtons.current[index] = el;
                      }}
                      type="button"
                      onClick={() => openPicker(index)}
                      aria-expanded={activeSlot === index}
                      aria-controls="property-picker"
                      className="btn-outline mt-5 w-full"
                    >
                      <ArrowLeftRight size={15} aria-hidden="true" />
                      Replace property {index + 1}
                    </button>
                  </div>
                </>
              ) : (
                <button
                  ref={(el) => {
                    slotButtons.current[index] = el;
                  }}
                  type="button"
                  onClick={() => openPicker(index)}
                  aria-expanded={activeSlot === index}
                  aria-controls="property-picker"
                  className="flex min-h-64 flex-1 flex-col items-center justify-center gap-3 p-6 text-green transition-colors hover:bg-sage/20"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sage/60">
                    <Plus size={24} aria-hidden="true" />
                  </span>
                  <span className="font-semibold">
                    Select property {index + 1}
                  </span>
                  <span className="text-xs text-ink/55">
                    Search existing GenVilla listings
                  </span>
                </button>
              )}
            </div>
          ))}
          {slots.length === 2 && (
            <button
              type="button"
              onClick={() => {
                setSlots((current) => [...current, null]);
                openPicker(2);
              }}
              className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-[22px] border border-dashed border-green/30 bg-white/40 p-6 text-green transition-colors hover:bg-white md:col-span-2 lg:col-span-1"
            >
              <Plus size={26} aria-hidden="true" />
              <span className="font-semibold">Add a third property</span>
              <span className="text-xs text-ink/55">
                Optional · Compare up to three
              </span>
            </button>
          )}
        </div>

        <section
          id="property-picker"
          hidden={activeSlot === null}
          aria-labelledby="picker-title"
          onKeyDown={(event) => {
            if (event.key === "Escape") closePicker();
          }}
          className="mt-7 rounded-[24px] border border-green/20 bg-white p-5 sm:p-7"
        >
          <div className="flex items-center justify-between gap-4">
            <h2 id="picker-title" className="font-serif text-2xl">
              Select property {(activeSlot ?? 0) + 1}
            </h2>
            <button
              type="button"
              onClick={closePicker}
              aria-label="Close property search"
              className="rounded-full p-3 hover:bg-sage/40"
            >
              <X size={18} />
            </button>
          </div>
          <label
            htmlFor="property-search"
            className="mt-5 block text-xs font-semibold text-ink/70"
          >
            Search by property name, location or type
          </label>
          <div className="mt-2 flex items-center gap-3 rounded-xl border border-ink/20 px-4 focus-within:border-green focus-within:ring-2 focus-within:ring-green/15">
            <Search
              size={18}
              className="shrink-0 text-green"
              aria-hidden="true"
            />
            <input
              ref={searchRef}
              id="property-search"
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setShown(8);
              }}
              placeholder="Search GenVilla properties…"
              className="h-12 min-w-0 flex-1 bg-transparent text-sm focus-visible:outline-none"
            />
          </div>
          {isPending ? (
            <p role="status" className="py-10 text-center text-sm text-ink/60">
              Loading GenVilla properties…
            </p>
          ) : isError ? (
            <div role="alert" className="py-8 text-center">
              <p className="text-sm text-ink/65">
                We couldn’t load the property listings. Please try again.
              </p>
              <button
                type="button"
                disabled={isFetching}
                onClick={() => refetch()}
                className="btn-dark mt-4 disabled:opacity-50"
              >
                {isFetching ? "Retrying…" : "Try again"}
              </button>
            </div>
          ) : !matches.length ? (
            <div className="py-10 text-center">
              <p role="status" className="text-sm text-ink/65">
                {properties.length
                  ? "No properties match your search."
                  : "No properties are available from the GenVilla feed right now."}
              </p>
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="btn-outline mt-4"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <>
              <p role="status" className="mt-4 text-xs text-ink/55">
                {matches.length} matching{" "}
                {matches.length === 1 ? "property" : "properties"} · Showing{" "}
                {Math.min(shown, matches.length)}
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {matches.slice(0, shown).map((property) => {
                  const alreadySelected = slots.includes(property.id);
                  return (
                    <button
                      key={property.id}
                      type="button"
                      disabled={alreadySelected}
                      onClick={() => choose(property)}
                      className="flex min-w-0 items-center gap-3 rounded-2xl border border-ink/10 p-3 text-left transition-colors hover:border-green/40 hover:bg-sage/15 disabled:cursor-not-allowed disabled:bg-sage/20 disabled:opacity-65"
                    >
                      <PropertyImage
                        property={property}
                        className="h-20 w-20 shrink-0 overflow-hidden rounded-lg"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block break-words text-sm font-semibold">
                          {property.title || unavailable}
                        </span>
                        <span className="mt-1 block break-words text-xs text-ink/60">
                          {property.location || unavailable}
                        </span>
                        <span className="mt-2 block text-xs font-semibold text-green">
                          {price(property)} ·{" "}
                          {property.transaction || unavailable}
                        </span>
                        <span className="mt-2 flex items-center gap-1 text-xs text-green">
                          {alreadySelected ? (
                            <>
                              <Check size={13} aria-hidden="true" />
                              Selected
                            </>
                          ) : (
                            <>
                              <Plus size={13} aria-hidden="true" />
                              Select property
                            </>
                          )}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
              {shown < matches.length && (
                <button
                  type="button"
                  onClick={() => setShown((current) => current + 8)}
                  className="btn-outline mt-5"
                >
                  Show more properties
                </button>
              )}
            </>
          )}
        </section>

        {chosen.length >= 2 ? (
          <section aria-labelledby="comparison-title" className="mt-12">
            <h2 id="comparison-title" className="font-serif text-3xl">
              The details, side by side
            </h2>
            <p
              id="comparison-help"
              className="mt-3 text-sm leading-6 text-ink/60"
            >
              On smaller screens, swipe across the table to see every property.
              Missing details are shown as “Not available”.
            </p>
            <div
              role="region"
              aria-label="Property comparison table"
              aria-describedby="comparison-help"
              tabIndex={0}
              className="mt-5 max-w-full overflow-x-auto rounded-[22px] border border-ink/15 bg-white focus-visible:outline-green"
            >
              <table
                className="w-full table-fixed border-collapse text-left text-sm"
                style={{ minWidth: chosen.length === 3 ? 900 : 680 }}
              >
                <caption className="sr-only">
                  Factual comparison of {chosen.length} selected GenVilla
                  properties
                </caption>
                <thead>
                  <tr className="bg-[#eaf0e7]">
                    <th
                      scope="col"
                      className="w-40 p-5 text-xs uppercase tracking-wider text-green"
                    >
                      Property details
                    </th>
                    {chosen.map((property) => (
                      <th
                        scope="col"
                        key={property.id}
                        className="border-l border-ink/10 p-5 align-top"
                      >
                        <span className="block break-words font-serif text-xl font-normal">
                          {property.title || unavailable}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.label} className="border-t border-ink/10">
                      <th
                        scope="row"
                        className="bg-cream/60 p-5 align-top text-xs font-semibold leading-5 text-ink/65"
                      >
                        {row.label}
                      </th>
                      {chosen.map((property) => {
                        const highlighted =
                          row.metric &&
                          highlights[row.metric].includes(property.id);
                        return (
                          <td
                            key={property.id}
                            className={`break-words border-l border-ink/10 p-5 align-top leading-6 ${highlighted ? "bg-sage/40 text-green" : "text-ink/75"}`}
                          >
                            <span>{row.value(property) || unavailable}</span>
                            {highlighted && (
                              <span className="mt-2 flex w-fit items-center gap-1 rounded-full bg-green px-2.5 py-1 text-[10px] font-bold leading-4 text-white">
                                <Check size={12} aria-hidden="true" />
                                {row.badge}
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-5 space-y-2 text-xs leading-6 text-ink/60">
              <p>
                Highlights compare the selected properties only, require a value
                for every property, and include tied values. Price highlights
                apply to sale listings only. Area and price-per-sq.ft.
                highlights require the same area basis; equal values are not
                highlighted.
              </p>
              <p>
                Price per sq.ft. is calculated from the listed price and the
                displayed area, rounded to the nearest rupee. Rental payment
                periods are not supplied here. RERA identifiers, when supplied,
                are displayed as listed and are not independently verified.
              </p>
            </div>
          </section>
        ) : (
          <div className="mt-10 rounded-[24px] border border-dashed border-green/25 bg-white/50 px-6 py-12 text-center">
            <Columns3
              size={30}
              className="mx-auto text-green"
              aria-hidden="true"
            />
            <h2 className="mt-4 font-serif text-2xl">
              A clearer view starts with two properties.
            </h2>
            <p className="mt-3 text-sm leading-6 text-ink/60">
              {chosen.length === 1
                ? "Select one more property to see your comparison."
                : "Select your first two properties above to compare their details."}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
