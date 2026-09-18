"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
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


export default function HomePropertySearch({ onPurposeChange }) {
  const [propertyPurpose, setPropertyPurpose] = useState("Buy");
  const router = useRouter();

  const [filters, setFilters] = useState(defaults);
  const [locationQuery, setLocationQuery] = useState("");
  const [locationError, setLocationError] = useState("");

  const update = (key, value) => {
  setFilters((current) => ({ ...current, [key]: value }));

  if (key === "purpose") {
    onPurposeChange?.(value);
  }
};

  const clearAll = () => {
    setFilters({ ...defaults });
    setLocationQuery("");
    setLocationError("");
  };

  const submit = (event) => {
    event.preventDefault();

    if (locationQuery && !filters.city) {
      setLocationError(
        "Choose a supported city, sector or locality from the suggestions."
      );
      return;
    }

    const extraFilters = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (
        !["city", "locality"].includes(key) &&
        value &&
        value !== defaults[key]
      ) {
        extraFilters[key] = value;
      }
    });

    router.push(buildPropertySearchUrl(filters, extraFilters));
  };

  return (
    <section
      id="hero-property-search"
      aria-label="Find a property"
      className="relative min-w-0 scroll-mt-24"
    >
      <div className="w-full min-w-0">
        <form
          onSubmit={submit}
          className="
            rounded-[18px]
            border border-white/20
            bg-[#072f26]/90
            p-3
            shadow-[0_16px_45px_rgba(0,0,0,0.22)]
            backdrop-blur-xl
          "
        >
          {/* BUY / RENT / CLEAR */}
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-pressed={filters.purpose === "Buy"}
                onClick={() => update("purpose", "Buy")}
                className={`flex h-10 shrink-0 items-center justify-center gap-2 rounded-[12px] px-4 text-sm font-bold transition-colors ${
                  filters.purpose === "Buy"
                    ? "bg-[#08785a] text-white"
                    : "bg-white/10 text-white/75 hover:bg-white/15"
                }`}
              >
                <Icons.House size={16} />
                Buy
              </button>

              <button
                type="button"
                aria-pressed={filters.purpose === "Rent"}
                onClick={() => update("purpose", "Rent")}
                className={`flex h-10 shrink-0 items-center justify-center gap-2 rounded-[12px] px-4 text-sm font-bold transition-colors ${
                  filters.purpose === "Rent"
                    ? "bg-[#08785a] text-white"
                    : "bg-white/10 text-white/75 hover:bg-white/15"
                }`}
              >
                <Icons.KeyRound size={16} />
                Rent
              </button>
            </div>

            <button
              type="button"
              onClick={clearAll}
              className="flex min-h-10 shrink-0 items-center gap-1.5 text-[10px] font-semibold text-white/60 transition-colors hover:text-white"
            >
              <Icons.RotateCcw size={12} />
              Clear all
            </button>
          </div>

          {/* SEARCH ROW */}
          <div
            className="
              grid min-w-0 gap-2
              sm:grid-cols-2
              lg:grid-cols-[minmax(230px,1.5fr)_minmax(150px,1fr)_minmax(110px,.7fr)_minmax(140px,.9fr)_auto]
            "
          >
            {/* LOCATION */}
            <div className="min-w-0 [&_input]:h-10 [&_input]:text-xs [&_label>span:first-child]:sr-only [&_[role=listbox]]:top-[44px]">
              <LocationAutocomplete
                inputId="hero-location"
                label="Location"
                value={locationQuery}
                placeholder="City, sector or locality"
                onQueryChange={(query) => {
                  setLocationQuery(query);
                  setLocationError("");

                  setFilters((current) => ({
                    ...current,
                    city: "",
                    locality: "",
                  }));
                }}
                onSelect={(location) => {
                  writeContext(LOCATION_KEY, {
                    city: location.city,
                  });

                  setLocationQuery(location.label);
                  setLocationError("");

                  setFilters((current) => ({
                    ...current,
                    city: location.city,
                    locality: location.locality || "",
                  }));
                }}
              />
            </div>

            {/* PROPERTY TYPE */}
            <div className="relative min-w-0">
              <Icons.Building2
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[#08785a]"
              />

              <select
                id="hero-type"
                aria-label="Property type"
                value={filters.type}
                onChange={(event) => update("type", event.target.value)}
                className="
                  h-10 w-full appearance-none rounded-[10px]
                  border border-[#173c30]/10 bg-white
                  pl-9 pr-8 text-xs text-[#173c30]
                  outline-none transition
                  focus:border-[#08785a]
                "
              >
                <option value="">All Property Types</option>
                <option value="Apartment">Apartment</option>
                <option value="Builder Floor">Builder Floor</option>
                <option value="Villa">Villa</option>
                <option value="Plot">Plot</option>
              </select>

              <Icons.ChevronDown
                size={13}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#173c30]"
              />
            </div>

            {/* BHK */}
            <div className="relative min-w-0">
              <Icons.House
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[#08785a]"
              />

              <select
                id="hero-bhk"
                aria-label="BHK"
                value={filters.bhk}
                onChange={(event) => update("bhk", event.target.value)}
                className="
                  h-10 w-full appearance-none rounded-[10px]
                  border border-[#173c30]/10 bg-white
                  pl-9 pr-8 text-xs text-[#173c30]
                  outline-none transition
                  focus:border-[#08785a]
                "
              >
                <option value="">Any BHK</option>
                <option value="1 BHK">1 BHK</option>
                <option value="2 BHK">2 BHK</option>
                <option value="3 BHK">3 BHK</option>
                <option value="4 BHK">4 BHK</option>
                <option value="4+ BHK">4+ BHK</option>
              </select>

              <Icons.ChevronDown
                size={13}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#173c30]"
              />
            </div>

            {/* BUDGET */}
            <div className="relative min-w-0">
              <Icons.IndianRupee
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[#08785a]"
              />

              <select
                id="hero-budget"
                aria-label="Budget"
                value={filters.budget}
                onChange={(event) => update("budget", event.target.value)}
                className="
                  h-10 w-full appearance-none rounded-[10px]
                  border border-[#173c30]/10 bg-white
                  pl-9 pr-8 text-xs text-[#173c30]
                  outline-none transition
                  focus:border-[#08785a]
                "
              >
                <option value="">Any Budget</option>
                <option value="under-1">Under ₹1 Cr</option>
                <option value="1-2">₹1–2 Cr</option>
                <option value="2-4">₹2–4 Cr</option>
                <option value="4-6">₹4–6 Cr</option>
                <option value="6-plus">₹6 Cr+</option>
              </select>

              <Icons.ChevronDown
                size={13}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#173c30]"
              />
            </div>

            {/* SEARCH BUTTON */}
            <button
              type="submit"
              className="
                flex h-10 items-center justify-center gap-2
                whitespace-nowrap rounded-[10px]
                bg-[#08785a] px-5
                text-[11px] font-bold text-white
                transition
                hover:bg-[#066b50]
                sm:col-span-2
                lg:col-span-1
              "
            >
              <Icons.Search size={14} />
              Search Properties
              <Icons.ArrowRight size={13} />
            </button>
          </div>

          {/* LOCATION ERROR */}
          {locationError && (
            <p
              role="alert"
              className="mt-2 text-[10px] font-semibold text-red-200"
            >
              {locationError}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
