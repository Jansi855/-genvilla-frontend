"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as Icons from "lucide-react";
import LocationAutocomplete from "@/components/location/LocationAutocomplete";
import { buildPropertySearchUrl } from "@/utils/location";

const defaults = {
  purpose: "Buy",
  city: "",
  locality: "",
  type: "",
  bhk: "",
  budget: "",
};

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
    <section className="relative z-20 bg-[#fbfcf9] px-5 py-8 lg:px-10">
      <div className="mx-auto max-w-[1280px]">
        <form
          className="rounded-[28px] border border-[#173c30]/10 bg-white p-5 shadow-[0_18px_50px_rgba(18,55,43,0.10)] md:p-6"
          onSubmit={submit}
        >
          {/* Buy / Rent + Clear */}
          <div className="flex items-center justify-between border-b border-[#173c30]/10 pb-5">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => update("purpose", "Buy")}
                className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold transition-all ${
                  filters.purpose === "Buy"
                    ? "bg-[#0c2b23] text-white shadow-md"
                    : "bg-[#f4f1e9] text-[#173c30]/70"
                }`}
              >
                <Icons.House size={16} />
                Buy
              </button>

              <button
                type="button"
                onClick={() => update("purpose", "Rent")}
                className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold transition-all ${
                  filters.purpose === "Rent"
                    ? "bg-[#0c2b23] text-white shadow-md"
                    : "bg-[#f4f1e9] text-[#173c30]/70"
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
              className="flex items-center gap-2 text-xs font-semibold text-[#173c30]/50 transition hover:text-[#08785a]"
            >
              <Icons.RotateCcw size={14} />
              Clear all
            </button>
          </div>

          {/* Search Fields */}
          <div className="mt-5 grid gap-4 lg:grid-cols-[1.6fr_1fr_.8fr_1fr_auto]">
            {/* Location */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-[#173c30]">
                Location
              </label>

              <LocationAutocomplete
                label=""
                value={locationQuery}
                placeholder="City, sector or locality"
                onQueryChange={(query) => {
                  setLocationQuery(query);
                  setLocationError("");
                  setFilters((current) => ({ ...current, city: "", locality: "" }));
                }}
                onSelect={(location) => {
                  setLocationQuery(location.label);
                  setLocationError("");
                  setFilters((current) => ({
                    ...current,
                    city: location.city,
                    locality: location.locality || "",
                  }));
                }}
              />
              {locationError && <p className="mt-2 text-xs font-semibold text-red-600" role="alert">{locationError}</p>}
            </div>

            {/* Property Type */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-[#173c30]">
                Property Type
              </label>

              <select
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
              <label className="mb-2 block text-xs font-semibold text-[#173c30]">
                BHK
              </label>

              <select
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
              <label className="mb-2 block text-xs font-semibold text-[#173c30]">
                Budget
              </label>

              <select
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
            <div className="flex items-end">
              <button
                type="submit"
                className="flex h-12 w-full items-center justify-center gap-2 rounded-[14px] bg-[#08785a] px-6 text-sm font-bold text-white shadow-[0_8px_20px_rgba(8,120,90,0.20)] transition-all hover:-translate-y-0.5 hover:bg-[#066b50] lg:w-auto"
              >
                <Icons.Search size={17} />
                Search
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
