"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import * as Icons from "lucide-react";
import LocationAutocomplete from "@/components/location/LocationAutocomplete";
import { buildPropertySearchUrl } from "@/utils/location";
import { LOCATION_KEY, writeContext } from "@/utils/latestAnalysis";

const defaults = {
  purpose: "Buy",
  city: "",
  locality: "",
  type: "",
  bhk: "",
  budget: "",
};

const popularSearches = [
  { label: 'Flats in Noida', city: 'Noida', filters: { type: 'Apartment' } },
  { label: '3 BHK in Gurugram', city: 'Gurugram', filters: { bhk: '3 BHK' } },
  { label: 'Apartments in New Delhi', city: 'New Delhi', filters: { type: 'Apartment' } },
  { label: 'Plots in Sonipat', city: 'Sonipat', filters: { type: 'Plot' } },
  { label: 'Flats in Ghaziabad', city: 'Ghaziabad', filters: { type: 'Apartment' } },
];

export default function HomePropertySearch() {
  const router = useRouter();
  const [filters, setFilters] = useState(defaults);
  const [locationQuery, setLocationQuery] = useState("");
  const [locationError, setLocationError] = useState("");
  const update = (key, value) =>
    setFilters((current) => ({ ...current, [key]: value }));
  const submit = (event) => {
    event.preventDefault();
    if (locationQuery && !filters.city) {
      setLocationError("Choose a supported city, sector or locality from the suggestions.");
      return;
    }
    const extraFilters = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (!["city", "locality"].includes(key) && value && value !== defaults[key]) {
        extraFilters[key] = value;
      }
    });
    router.push(buildPropertySearchUrl(filters, extraFilters));
  };

  return (
    <section id="hero-property-search" aria-label="Find a property" className="relative min-w-0 scroll-mt-24">
      <div className="min-w-0">
        <form
          className="rounded-[24px] border border-white/20 bg-[#072f26]/85 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:p-6"
          onSubmit={submit}
        >
          {/* Buy / Rent + Clear */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/15 pb-4">
            <div className="flex gap-2">
              <button
                type="button"
                aria-pressed={filters.purpose === 'Buy'}
                onClick={() => update("purpose", "Buy")}
                className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold transition-all ${
                  filters.purpose === "Buy"
                    ? "bg-[#08785a] text-white shadow-md"
                    : "bg-white/10 text-white/80 hover:bg-white/20"
                }`}
              >
                <Icons.House size={16} />
                Buy
              </button>

              <button
                type="button"
                aria-pressed={filters.purpose === 'Rent'}
                onClick={() => update("purpose", "Rent")}
                className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold transition-all ${
                  filters.purpose === "Rent"
                    ? "bg-[#08785a] text-white shadow-md"
                    : "bg-white/10 text-white/80 hover:bg-white/20"
                }`}
              >
                <Icons.KeyRound size={16} />
                Rent
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setFilters({ ...defaults });
                setLocationQuery("");
                setLocationError("");
              }}
              className="flex min-h-10 items-center gap-2 text-xs font-semibold text-white/70 transition hover:text-white"
            >
              <Icons.RotateCcw size={14} />
              Clear all
            </button>
          </div>

          {/* Search Fields */}
          <div className="mt-5 grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,.8fr)_minmax(0,1fr)_auto] [&_select]:min-w-0 [&_input]:h-12">
            {/* Location */}
            <div>
              <label htmlFor="hero-location" className="mb-2 block text-xs font-semibold text-white/85">
                Location
              </label>

              <LocationAutocomplete
                inputId="hero-location"
                label=""
                value={locationQuery}
                placeholder="City, sector or locality"
                onQueryChange={(query) => {
                  setLocationQuery(query);
                  setLocationError("");
                  setFilters((current) => ({ ...current, city: "", locality: "" }));
                }}
                onSelect={(location) => {
                  writeContext(LOCATION_KEY, { city: location.city });
                  setLocationQuery(location.label);
                  setLocationError("");
                  setFilters((current) => ({
                    ...current,
                    city: location.city,
                    locality: location.locality || "",
                  }));
                }}
              />
              {locationError && <p className="mt-2 text-xs font-semibold text-red-200" role="alert">{locationError}</p>}
            </div>

            {/* Property Type */}
            <div>
              <label htmlFor="hero-type" className="mb-2 block text-xs font-semibold text-white/85">
                Property Type
              </label>

              <select
                id="hero-type"
                className="h-12 w-full rounded-[14px] border border-[#173c30]/15 bg-white px-4 text-sm text-[#173c30] outline-none focus:border-[#08785a]"
                value={filters.type}
                onChange={(event) => update("type", event.target.value)}
              >
                <option value="">All Property Types</option>
                <option value="Apartment">Apartment</option>
                <option value="Builder Floor">Builder Floor</option>
                <option value="Villa">Villa</option>
                <option value="Plot">Plot</option>
              </select>
            </div>

            {/* BHK */}
            <div>
              <label htmlFor="hero-bhk" className="mb-2 block text-xs font-semibold text-white/85">
                BHK
              </label>

              <select
                id="hero-bhk"
                className="h-12 w-full rounded-[14px] border border-[#173c30]/15 bg-white px-4 text-sm text-[#173c30] outline-none focus:border-[#08785a]"
                value={filters.bhk}
                onChange={(event) => update("bhk", event.target.value)}
              >
                <option value="">Any BHK</option>
                <option value="1 BHK">1 BHK</option>
                <option value="2 BHK">2 BHK</option>
                <option value="3 BHK">3 BHK</option>
                <option value="4 BHK">4 BHK</option>
                <option value="4+ BHK">4+ BHK</option>
              </select>
            </div>

            {/* Budget */}
            <div>
              <label htmlFor="hero-budget" className="mb-2 block text-xs font-semibold text-white/85">
                Budget
              </label>

              <select
                id="hero-budget"
                className="h-12 w-full rounded-[14px] border border-[#173c30]/15 bg-white px-4 text-sm text-[#173c30] outline-none focus:border-[#08785a]"
                value={filters.budget}
                onChange={(event) => update("budget", event.target.value)}
              >
                <option value="">Any Budget</option>
                <option value="under-1">Under ₹1 Cr</option>
                <option value="1-2">₹1–2 Cr</option>
                <option value="2-4">₹2–4 Cr</option>
                <option value="4-6">₹4–6 Cr</option>
                <option value="6-plus">₹6 Cr+</option>
              </select>
            </div>

            {/* Search */}
            <div className="flex items-end sm:col-span-2 lg:col-span-1">
              <button
                type="submit"
                className="flex h-12 w-full items-center justify-center gap-2 rounded-[14px] bg-[#08785a] px-6 text-sm font-bold text-white shadow-[0_8px_20px_rgba(8,120,90,0.20)] transition-all hover:-translate-y-0.5 hover:bg-[#066b50] lg:w-auto"
              >
                <Icons.Search size={17} />
                Search
              </button>
            </div>
          </div>
          <div className="mt-5 min-w-0 border-t border-white/15 pt-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-white/60">Popular searches</p>
            <div className="mt-3 flex max-w-full gap-2 overflow-x-auto pb-2 lg:flex-wrap">
              {popularSearches.map(({ label, city, filters: preset }) => (
                <Link key={label} href={buildPropertySearchUrl({ city }, { ...preset, ...(filters.purpose === 'Rent' ? { purpose: 'Rent' } : {}) })} className="shrink-0 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-medium text-white/85 transition hover:border-[#73e4b7]/60 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#73e4b7]">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
