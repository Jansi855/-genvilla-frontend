"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  AlertTriangle,
  House,
  Clock3,
  X,
  IndianRupee,
  Gauge,
  TrendingUp,
} from "lucide-react";
import {
  ANALYSIS_EVENT,
  ANALYSIS_KEY,
  parseAnalysis,
} from "@/utils/latestAnalysis";
import { money, percent } from "@/utils/currency";

const linkClass =
  "group/link inline-flex min-h-9 items-center gap-1.5 rounded text-xs font-semibold text-[#086448] hover:text-[#054b36] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#08785a]";
const outcomes = [
  {
    label: "BUY",
    icon: Check,
    tone: "border-[#d8e8df] bg-[#f0f7f2] text-[#34765a]",
    active:
      "!border-[#48896a] !bg-[#dceee1] !text-[#185337] ring-1 ring-[#48896a]/20",
  },
  {
    label: "WAIT",
    icon: Clock3,
    tone: "border-[#eee2c9] bg-[#fcf8ed] text-[#886323]",
    active:
      "!border-[#ba8a32] !bg-[#fff0cb] !text-[#79500d] ring-1 ring-[#ba8a32]/20",
  },
  {
    label: "AVOID",
    icon: X,
    tone: "border-[#eddcd8] bg-[#fcf3f1] text-[#a15b50]",
    active:
      "!border-[#b76c60] !bg-[#f9e1db] !text-[#8f392e] ring-1 ring-[#b76c60]/20",
  },
];
// Presentation only: all amounts below are existing engine outputs.
const compactMoney = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  notation: "compact",
  maximumFractionDigits: 2,
});
const asText = (value) => (typeof value === "string" ? value : "");
const hasNumber = (value) =>
  typeof value === "number" && Number.isFinite(value);

export default function RecommendationPreview({
  properties = [],
  isLoading = false,
  isError = false,
  onRetry,
}) {
  const [recent, setRecent] = useState({ status: "loading", analysis: null });
  const read = useCallback(() => {
    try {
      const raw = window.localStorage.getItem(ANALYSIS_KEY);
      const analysis = parseAnalysis(raw);
      setRecent({
        status: raw !== null && !analysis ? "error" : "ready",
        analysis,
      });
    } catch {
      setRecent({ status: "error", analysis: null });
    }
  }, []);

  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === ANALYSIS_KEY || event.key === null) read();
    };
    read();
    window.addEventListener("storage", onStorage);
    window.addEventListener(ANALYSIS_EVENT, read);
    window.addEventListener("pageshow", read);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(ANALYSIS_EVENT, read);
      window.removeEventListener("pageshow", read);
    };
  }, [read]);

  const { analysis } = recent;
  const preview = analysis?.preview;
  // Match by identity only: another listing in the same city is not this analysis.
  const matched = analysis?.property.id
    ? properties.find((item) => String(item.id) === analysis.property.id)
    : null;
  const property = analysis
    ? {
        ...matched,
        ...analysis.property,
        image: analysis.property.image || matched?.image,
      }
    : properties[0];
  const title =
    asText(property?.title) || (analysis ? "Analyzed property" : "");
  const bhk = asText(property?.bhk);
  const location = [
    asText(property?.locality),
    asText(property?.city),
    bhk ? (/bhk/i.test(bhk) ? bhk : `${bhk} BHK`) : "",
  ]
    .filter(Boolean)
    .join(" · ");
  const query = new URLSearchParams();
  if (property?.id) query.set("property", String(property.id));
  else {
    if (asText(property?.city)) query.set("city", property.city);
    if (asText(property?.locality)) query.set("locality", property.locality);
  }
  const href = `/smart-recommendation${query.size ? `?${query}` : ""}`;
  const loading = recent.status === "loading" || (!analysis && isLoading);
  const error = recent.status === "error";
  const score = preview ? preview.score : analysis?.metrics.investment;
  const result = preview?.decision;
  const rentalYield = preview
    ? preview.rentalYield
    : analysis?.metrics.rentalYield;
  const metrics = [
    {
      label: "True Cost",
      icon: IndianRupee,
      value: preview?.trueCost,
      detail: hasNumber(preview?.trueCost)
        ? analysis.source === "smart-recommendation"
          ? "Includes loan interest"
          : "Provided acquisition cost"
        : null,
    },
    {
      label: "Est. EMI",
      icon: Gauge,
      value: analysis?.metrics.emi,
      detail: hasNumber(analysis?.metrics.emi) ? "Per month" : null,
    },
    {
      label: "Rental ROI",
      icon: TrendingUp,
      value: rentalYield,
      detail: hasNumber(rentalYield) ? "Net annual yield" : null,
      isPercent: true,
    },
  ];
  const insights = [
    ...(preview?.positive ? [{ text: preview.positive, positive: true }] : []),
    ...(preview?.warning ? [{ text: preview.warning, positive: false }] : []),
  ];
  const propertyError = !analysis && isError;
  const neutralMessage = error
    ? "Your saved analysis couldn’t be loaded."
    : propertyError
      ? "Property details are unavailable. You can still start an analysis."
      : analysis
        ? "No additional insights were saved with this analysis."
        : "Complete an analysis to unlock your personalized property decision.";

  return (
    <div className="grid min-w-0 items-center gap-5 text-[#102721] md:grid-cols-[minmax(0,34fr)_minmax(0,66fr)] lg:grid-cols-[minmax(0,28fr)_minmax(0,72fr)] lg:gap-7">
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#14684f]">
          DECIDE WITH CONTEXT
        </p>
        <h2 className="mt-2 font-serif text-[30px] leading-[1.06] tracking-tight lg:text-[34px]">
          Your property.
          <br />
          Your finances.
          <br />
          <em className="text-[#14684f]">Your decision.</em>
        </h2>
        <p className="mt-3 max-w-sm text-[12px] leading-[1.65] text-[#5b6962]">
          We bring the price, total cost, EMI, rental potential and risk into
          one clear view—then explain what points toward buy, wait or avoid.
        </p>
        <ul
          aria-label="Recommendation outcomes"
          className="mt-3 flex flex-wrap gap-1.5"
        >
          {outcomes.map(({ label, icon: Icon, tone, active }) => (
            <li
              key={label}
              className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1.5 text-[10px] font-bold tracking-wider motion-safe:transition-colors ${tone} ${result === label ? active : ""}`}
            >
              <Icon
                size={12}
                strokeWidth={result === label ? 3 : 1.8}
                aria-hidden="true"
              />
              <span
                aria-hidden="true"
                className="h-3 w-px bg-current opacity-25"
              />
              {result === label && (
                <span className="sr-only">Current recommendation: </span>
              )}
              {label}
              {result === label && <Check size={10} aria-hidden="true" />}
            </li>
          ))}
        </ul>
        <Link
          href="/properties"
          className="group/explore mt-3 flex h-[76px] min-w-0 items-center gap-3 overflow-hidden rounded-[17px] border border-[#dce5da] bg-white/80 pr-3 shadow-[0_2px_8px_rgba(24,45,38,0.03)] motion-safe:transition-shadow hover:shadow-[0_4px_14px_rgba(24,45,38,0.07)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#08785a]"
        >
          <PropertyVisual
            key={asText(property?.image)}
            src={asText(property?.image)}
            title={title}
          />
          <span className="min-w-0 flex-1">
            <span className="block text-[9px] font-bold uppercase tracking-[0.1em] text-[#14684f]">
              Explore Properties
            </span>
            <span className="mt-1 block text-[12px] leading-4 text-[#3f5448]">
              Find homes that
              <br />
              match your goals.
            </span>
          </span>
          <ArrowRight
            size={16}
            aria-hidden="true"
            className="shrink-0 text-[#14684f] motion-safe:transition-transform motion-safe:group-hover/explore:translate-x-0.5"
          />
        </Link>
      </div>

      <div
        className="min-w-0 overflow-hidden rounded-[22px] border border-[#dce3db] bg-white shadow-[0_4px_20px_rgba(24,45,38,0.05)] motion-safe:transition-shadow hover:shadow-[0_6px_24px_rgba(24,45,38,0.08)]"
        aria-busy={loading}
      >
        <div className="px-4 pt-4 sm:px-5">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#14684f]">
            SMART RECOMMENDATION PREVIEW
          </h3>
          <div className="mt-2 grid min-h-[62px] items-center gap-3 md:grid-cols-[minmax(0,1fr)_150px_auto]">
            <div className="min-w-0 flex-1 basis-40" aria-live="polite">
              <h4 className="font-serif text-[19px] leading-6">
                {loading ? (
                  <>
                    <span className="sr-only">Loading recommendation</span>
                    <Skeleton className="h-5 w-40 max-w-full" />
                  </>
                ) : (
                  <span
                    className="block truncate"
                    title={analysis ? title : undefined}
                  >
                    {analysis
                      ? title
                      : error
                        ? "Recommendation unavailable"
                        : "No recommendation yet"}
                  </span>
                )}
              </h4>
              {!loading && !analysis && !error && (
                <p className="mt-1 text-[11px] leading-4 text-[#65746b]">
                  Analyze a property to unlock personalized cost, EMI, ROI and
                  risk insights.
                </p>
              )}
              <div className="mt-1 min-h-4 text-[11px] leading-4 text-[#65746b]">
                {loading ? (
                  <Skeleton className="h-3 w-48 max-w-full" />
                ) : analysis ? (
                  <p
                    className="truncate"
                    title={[
                      location,
                      hasNumber(property?.priceValue) && property.priceValue > 0
                        ? money(property.priceValue)
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  >
                    {location}
                    {hasNumber(property?.priceValue) &&
                      property.priceValue > 0 && (
                        <>
                          {location ? " · " : ""}
                          <span className="font-medium text-[#435b4d]">
                            {compactMoney.format(property.priceValue)}
                          </span>
                        </>
                      )}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="relative hidden h-[105px] w-[190px] -translate-x-6 md:block">
              <div className="absolute left-1/2 top-1/2 h-[70px] w-[150px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#dff3e8]/70 blur-2xl" />

              <Image
                src="/home/journey/recommendation/property-recommendation.png"
                alt=""
                fill
                sizes="190px"
                className="relative z-10 object-contain"
                aria-hidden="true"
              />
            </div>
            {analysis && !error && (
              <PreviewLink href={href} pill>
                Get full recommendation
              </PreviewLink>
            )}
          </div>
        </div>

        <dl className="grid grid-cols-2 border-y border-[#e7ece5] sm:grid-cols-4">
          <div className="flex min-h-[90px] min-w-0 flex-col items-start justify-center border-r border-[#e7ece5] px-4 py-3 text-left">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#e7f5ed] text-[#08785a]">
              <Gauge size={16} strokeWidth={1.8} aria-hidden="true" />
            </div>
            <dt className="mb-1 text-[10px] text-[#627468]">
              {hasNumber(score) ? "Overall fit" : "Score / status"}
            </dt>
            <dd className="flex min-h-[28px] w-full items-center justify-start">
              {loading ? (
                <Skeleton className="h-[68px] w-[68px] rounded-full" />
              ) : hasNumber(score) ? (
                <div className="relative flex h-[68px] w-[68px] items-center justify-center">
                  <svg
                    viewBox="0 0 68 68"
                    className="absolute inset-0 h-full w-full -rotate-90"
                    aria-hidden="true"
                  >
                    <circle
                      cx="34"
                      cy="34"
                      r="29"
                      fill="none"
                      stroke="#e8eee5"
                      strokeWidth="4"
                    />
                    <circle
                      cx="34"
                      cy="34"
                      r="29"
                      fill="none"
                      stroke="#277a57"
                      strokeWidth="4"
                      pathLength="100"
                      strokeDasharray={`${score} 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="text-[22px] font-semibold tabular-nums text-[#164b37]">
                    {score}
                    <span className="sr-only">/100</span>
                  </span>
                </div>
              ) : (
                <span
                  className={`max-w-full break-words text-[18px] font-semibold leading-5 ${result === "AVOID" ? "text-[#933b30]" : result === "WAIT" ? "text-[#80520c]" : "text-[#164b37]"}`}
                >
                  {analysis
                    ? result || preview?.status || "Analysis complete"
                    : "—"}
                </span>
              )}
            </dd>
            <dd className="mt-1 min-h-4 text-[10px] leading-4 text-[#5b6962]">
              {loading ? (
                <Skeleton className="h-3 w-16" />
              ) : hasNumber(score) || result ? (
                asText(preview?.status)
              ) : (
                ""
              )}
            </dd>
          </div>
          {metrics.map(
            ({ label, icon: Icon, value, detail, isPercent }, index) => (
              <div
                key={label}
                className={`flex min-h-[90px] min-w-0 flex-col justify-center px-3 py-3 sm:px-4 ${index < 2 ? "sm:border-r sm:border-[#e7ece5]" : ""} ${index > 0 ? "border-t border-[#e7ece5] sm:border-t-0" : ""} ${index === 1 ? "border-r border-[#e7ece5]" : ""}`}
              >
                <dt className="text-[11px] text-[#596d60]">
                  <span className="mb-2 flex h-7 w-7 items-center justify-center rounded-lg bg-[#eef5ed] text-[#3c7959]">
                    <Icon size={15} strokeWidth={1.7} aria-hidden="true" />
                  </span>
                  {label}
                </dt>
                <dd
                  className="mt-0.5 text-[19px] font-semibold leading-6 tabular-nums text-[#193c2a]"
                  title={
                    hasNumber(value) && !isPercent ? money(value) : undefined
                  }
                >
                  {loading ? (
                    <Skeleton className="h-6 w-20 max-w-full" />
                  ) : hasNumber(value) ? (
                    isPercent ? (
                      percent(value)
                    ) : (
                      compactMoney.format(value)
                    )
                  ) : (
                    "—"
                  )}
                </dd>
                <dd className="mt-1 min-h-4 text-[10px] leading-4 text-[#65746b]">
                  {loading ? (
                    <Skeleton className="h-3 w-16 max-w-full" />
                  ) : (
                    detail
                  )}
                </dd>
              </div>
            ),
          )}
        </dl>

        <div
          className="flex min-h-[58px] flex-col justify-center gap-2 bg-[#fcfdfb] px-4 py-2 sm:px-5 lg:flex-row lg:items-center"
          aria-live="polite"
        >
          <div className="min-w-0 flex-1">
            {loading ? (
              <div className="grid grid-cols-2 gap-3" aria-hidden="true">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : insights.length ? (
              <ul className="grid gap-2 sm:grid-cols-2">
                {insights.map(({ text, positive }) => {
                  const Icon = positive ? CheckCircle2 : AlertTriangle;
                  return (
                    <li
                      key={positive ? "positive" : "warning"}
                      className={`flex min-w-0 items-start gap-2 rounded-lg border px-2.5 py-2 text-[11px] leading-4 ${positive ? "border-[#e0ebdd] bg-[#f1f7ed] text-[#3e6747]" : "border-[#eee5d0] bg-[#fdf8eb] text-[#806323]"}`}
                    >
                      <Icon
                        size={14}
                        className="mt-0.5 shrink-0"
                        aria-hidden="true"
                      />
                      <span>
                        <span className="sr-only">
                          {positive ? "Supporting insight: " : "Attention: "}
                        </span>
                        {text}
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] leading-5 text-[#627065]">
                <p className="max-w-sm">{neutralMessage}</p>
                {(error || propertyError) && (
                  <button
                    type="button"
                    onClick={error ? read : onRetry}
                    className={linkClass}
                  >
                    {error ? "Retry" : "Retry properties"}
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="shrink-0 self-start lg:self-center lg:border-l lg:border-[#e0e7dc] lg:pl-3">
            <PreviewLink href={href}>
              {analysis ? "View full analysis" : "Analyze a Property"}
            </PreviewLink>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewLink({ href, children, pill = false }) {
  return (
    <Link
      href={href}
      className={`${linkClass} ${pill ? "!min-h-8 shrink-0 !rounded-full border border-[#d4e8d6] bg-[#eaf5e9] px-3 py-1 text-[10px] hover:bg-[#dfeedd]" : "text-[11px]"}`}
    >
      {children}
      <ArrowRight
        size={13}
        aria-hidden="true"
        className="shrink-0 motion-safe:transition-transform motion-safe:group-hover/link:translate-x-0.5"
      />
    </Link>
  );
}

function PropertyVisual({ src, title }) {
  const sources = [
    ...new Set([
      "/home/journey/recommendation/explore-properties.webp",
      src,
      "/properties/properties-hero.webp",
      "/hero/property-amenities.jpg",
    ]),
  ];
  const [index, setIndex] = useState(0);
  return (
    <span className="flex h-full w-[86px] shrink-0 items-center justify-center overflow-hidden bg-[#f3f7f3] p-1.5 md:w-[78px] xl:w-[86px]">
      {index < sources.length ? (
        <img
          src={sources[index]}
          alt={
            index === 0 && src
              ? title || "Property under consideration"
              : "Residential property illustration"
          }
          onError={() => setIndex((current) => current + 1)}
          className="h-full w-full object-contain motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover/explore:scale-[1.02]"
        />
      ) : (
        <span
          role="img"
          aria-label="Property image unavailable"
          className="flex h-full items-center justify-center text-[#52755d]"
        >
          <House size={24} aria-hidden="true" />
        </span>
      )}
    </span>
  );
}

function Skeleton({ className = "" }) {
  return (
    <span
      aria-hidden="true"
      className={`block rounded bg-[#eaf0e7] motion-safe:animate-pulse ${className}`}
    />
  );
}
