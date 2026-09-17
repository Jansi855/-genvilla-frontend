"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, ChevronDown, SlidersHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { getProperties } from "@/services/properties";
import {
  buildPropertySearchUrl,
  getLocationLabel,
  getLocationSlug,
} from "@/utils/location";
import {
  normalizePropertySearchParams,
  propertySearchDefaults,
} from "@/utils/propertySearch";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertiesHeader from "./PropertiesHeader";
import PropertyFilters from "./PropertyFilters";
import PropertyGrid from "./PropertyGrid";
import PropertyGridSkeleton from "./PropertyGridSkeleton";
import PropertyEmptyState from "./PropertyEmptyState";

const defaults = propertySearchDefaults;

export default function PropertiesClient({
  location,
  initialData,
  marketCount = null,
  breadcrumbs,
  seoContent,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchKey = searchParams.toString();
  const urlFilters = useMemo(
    () => normalizePropertySearchParams(new URLSearchParams(searchKey), location),
    [location, searchKey],
  );
  const [draftFilters, setDraftFilters] = useState(urlFilters);
  const [appliedFilters, setAppliedFilters] = useState(urlFilters);
  const [shown, setShown] = useState(6);

  useEffect(() => {
    setDraftFilters(urlFilters);
    setAppliedFilters(urlFilters);
    setShown(6);
  }, [urlFilters]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["properties", appliedFilters],
    queryFn: ({ signal }) => getProperties({ signal, filters: appliedFilters }),
    initialData,
    placeholderData: undefined,
    staleTime: 5 * 60 * 1000,
  });
  const filteredProperties = data?.properties || [];
  const visible = filteredProperties.slice(0, shown);
  const locationLabel = getLocationLabel(appliedFilters);
  const listingTitle = locationLabel
    ? `Properties for ${appliedFilters.purpose === "Rent" ? "Rent" : "Sale"} in ${locationLabel}`
    : "Find a Property That Fits Your Life";

  const replaceUrl = (filters) => {
    const nextFilters = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (!["city", "locality", "query"].includes(key) && value && value !== defaults[key]) {
        nextFilters[key] = value;
      }
    });

    router.push(buildPropertySearchUrl(filters, nextFilters), {
      scroll: false,
    });
  };

  const apply = (filters) => {
    if (filters.query && !filters.city) return;
    setDraftFilters(filters);
    setAppliedFilters(filters);
    setShown(6);
    replaceUrl(filters);
  };

  const clear = () => apply({ ...defaults });
  const clearNonLocationFilters = () =>
    apply({
      ...defaults,
      purpose: appliedFilters.purpose,
      city: appliedFilters.city,
      locality: appliedFilters.locality,
    });
  const applySort = (sort) => apply({ ...appliedFilters, sort });
  const recommendationParams = new URLSearchParams();
  if (appliedFilters.city) recommendationParams.set("city", getLocationSlug(appliedFilters.city));
  if (appliedFilters.locality) recommendationParams.set("locality", getLocationSlug(appliedFilters.locality));
  const recommendationHref = `/smart-recommendation${recommendationParams.size ? `?${recommendationParams}` : ""}`;

  return (
    <>
      <Navbar />
      <main>
        {breadcrumbs}
        <PropertiesHeader title={listingTitle} />
        <section className="bg-cream px-5 py-8 md:py-10 lg:px-10">
          <div className="mx-auto max-w-[1360px]">
            <PropertyFilters
              filters={draftFilters}
              onChange={setDraftFilters}
              onClear={clear}
              onSearch={() => apply(draftFilters)}
            />
            <div className="mt-8 flex flex-col gap-4 border-y border-ink/10 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div aria-live="polite">
                <p className="font-serif text-2xl">
                  {isLoading
                    ? "Finding properties…"
                    : `${filteredProperties.length} ${
                        filteredProperties.length === 1
                          ? "property matches"
                          : "properties match"
                      } your current filters`}
                </p>
                {!isLoading && locationLabel && marketCount !== null && (
                  <p className="mt-1 text-sm text-ink/50">
                    {marketCount} {marketCount === 1 ? "property" : "properties"} available for {appliedFilters.purpose === "Rent" ? "rent" : "sale"} in {locationLabel}
                  </p>
                )}
              </div>
              <label className="flex items-center gap-2 text-sm text-ink/60">
                <span>Sort by</span>
                <span className="relative">
                  <select
                    aria-label="Sort properties"
                    className="appearance-none border-0 bg-transparent py-1 pr-6 font-bold text-ink outline-none"
                    value={appliedFilters.sort}
                    onChange={(event) => applySort(event.target.value)}
                  >
                    <option value="recommended">Recommended</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute right-0 top-1"
                    size={16}
                  />
                </span>
              </label>
            </div>
            {isLoading ? (
              <div className="mt-7">
                <PropertyGridSkeleton />
              </div>
            ) : isError ? (
              <ErrorState onRetry={refetch} />
            ) : visible.length ? (
              <>
                <div className="mt-7">
                  <PropertyGrid properties={visible} />
                </div>
                {shown < filteredProperties.length && (
                  <div className="mt-10 text-center">
                    <button
                      type="button"
                      className="btn-outline"
                      onClick={() => setShown((current) => current + 6)}
                    >
                      Load more properties
                    </button>
                  </div>
                )}
                <p className="mt-5 text-xs text-ink/40">
                  Listings are sourced from the live GenVilla property feed.
                  Availability and prices can change; risk and rental analysis
                  are not yet available for every listing.
                </p>
              </>
            ) : (
              <div className="mt-7">
                <PropertyEmptyState
                  locationLabel={locationLabel}
                  onClear={clearNonLocationFilters}
                  onChangeLocation={() => document.getElementById("property-location-search")?.focus()}
                />
              </div>
            )}
          </div>
        </section>
        {seoContent}
        <section className="bg-[#15352c] px-5 py-16 text-white md:py-20 lg:px-10">
          <div className="mx-auto flex max-w-[1360px] flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <p className="eyebrow !text-[#a6cbbd]">SMART DECISION MAKING</p>
              <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-[.98] md:text-6xl">
                Found Something You Like? Analyze It Before You Decide.
              </h2>
              <p className="mt-5 max-w-xl leading-7 text-white/60">
                Understand affordability, true cost, EMI, risk and rental
                potential before you move forward.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link className="btn-light" href="/calculators/affordability">
                Check affordability
              </Link>
              <Link
                className="btn-outline !border-white/30 !text-white"
                href={recommendationHref}
              >
                Smart recommendation <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function ErrorState({ onRetry }) {
  return (
    <div className="mt-7 rounded-[28px] border border-dashed border-ink/20 bg-white p-12 text-center">
      <SlidersHorizontal className="mx-auto text-green" />
      <h2 className="mt-4 font-serif text-3xl">
        We couldn’t load properties right now.
      </h2>
      <button className="btn-dark mt-6" onClick={onRetry}>
        Try again
      </button>
    </div>
  );
}
