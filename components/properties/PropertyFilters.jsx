"use client";

import { Home, KeyRound, Search, RotateCcw } from "lucide-react";

import { propertyTypes } from "@/data/properties";
import LocationAutocomplete from "@/components/location/LocationAutocomplete";

const selectClass =
  "h-12 w-full rounded-[14px] border border-ink/15 bg-white px-4 text-sm text-ink outline-none transition focus:border-green focus:ring-2 focus:ring-green/10";

export default function PropertyFilters({
  filters,
  onChange,
  onClear,
  onSearch,
}) {
  const locationLabel = filters.locality
    ? `${filters.locality}, ${filters.city}`
    : filters.city || filters.query;
  const update = (key, value) =>
    onChange({
      ...filters,
      [key]: value,
    });

  return (
    <form
      className="rounded-[28px] border border-ink/10 bg-white p-6 shadow-[0_18px_45px_rgba(18,55,43,0.08)]"
      onSubmit={(event) => {
        event.preventDefault();
        onSearch();
      }}
    >
      {/* TOP ROW */}
      <div className="flex items-center justify-between border-b border-ink/10 pb-5">
        <div className="flex gap-2">
          <Mode
            icon={Home}
            label="Buy"
            active={filters.purpose === "Buy"}
            onClick={() => update("purpose", "Buy")}
          />

          <Mode
            icon={KeyRound}
            label="Rent"
            active={filters.purpose === "Rent"}
            onClick={() => update("purpose", "Rent")}
          />
        </div>

        <button
          type="button"
          onClick={onClear}
          className="flex items-center gap-2 text-sm font-semibold text-ink/45 transition hover:text-green"
        >
          <RotateCcw size={14} />
          Clear all
        </button>
      </div>

      {/* SEARCH ROW */}
      <div className="mt-5 grid items-end gap-4 lg:grid-cols-[1.45fr_.95fr_.7fr_.9fr_auto]">
        {/* LOCATION */}
        <div>
          <LocationAutocomplete
            inputId="property-location-search"
            label="Location"
            value={locationLabel}
            onQueryChange={(query) =>
              onChange({
                ...filters,
                query,
                city: "",
                locality: "",
              })
            }
            onSelect={(location) =>
              onChange({
                ...filters,
                city: location.city,
                locality: location.locality || "",
                query: "",
              })
            }
          />
          {filters.query && !filters.city && (
            <p className="mt-2 text-xs font-semibold text-red-600" role="alert">
              Choose a supported location from the suggestions.
            </p>
          )}
        </div>

        {/* PROPERTY TYPE */}
        <Select
          label="Property Type"
          value={filters.type}
          onChange={(e) => update("type", e.target.value)}
        >
          <option value="">All Property Types</option>
          {propertyTypes.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </Select>

        {/* BHK */}
        <Select
          label="BHK"
          value={filters.bhk}
          onChange={(e) => update("bhk", e.target.value)}
        >
          <option value="">Any BHK</option>
          <option>1 BHK</option>
          <option>2 BHK</option>
          <option>3 BHK</option>
          <option>4 BHK</option>
          <option>4+ BHK</option>
        </Select>

        {/* BUDGET */}
        <Select
          label="Budget"
          value={filters.budget}
          onChange={(e) => update("budget", e.target.value)}
        >
          <option value="">Any Budget</option>
          <option value="under-1">Under ₹1 Cr</option>
          <option value="1-2">₹1–2 Cr</option>
          <option value="2-4">₹2–4 Cr</option>
          <option value="4-6">₹4–6 Cr</option>
          <option value="6-plus">₹6 Cr+</option>
        </Select>

        {/* SEARCH BUTTON */}
        <button
          type="submit"
          className="flex h-12 items-center justify-center gap-2 rounded-[14px] bg-[#08785a] px-7 text-sm font-bold text-white shadow-[0_8px_20px_rgba(8,120,90,0.18)] transition hover:bg-[#066b50]"
        >
          <Search size={17} />
          Search
        </button>
      </div>
    </form>
  );
}

function Mode({ icon: Icon, label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold transition ${
        active
          ? "bg-[#0c2b23] text-white shadow-md"
          : "bg-[#f3f0e8] text-ink/60"
      }`}
    >
      <Icon size={15} />
      {label}
    </button>
  );
}

function Select({ label, children, ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold text-ink">{label}</span>

      <select className={selectClass} {...props}>
        {children}
      </select>
    </label>
  );
}
