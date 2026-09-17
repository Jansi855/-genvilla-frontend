"use client";

import { useEffect, useState } from "react";
import { Heart, Share2 } from "lucide-react";

const savedKey = "genvilla-saved-properties";
function readSaved() {
  try {
    const saved = JSON.parse(localStorage.getItem(savedKey) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch { return []; }
}

export function FavoritePropertyButton({ property, compact = false }) {
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const sync = () => setSaved(readSaved().some((item) => String(item?.id) === String(property.id)));
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("genvilla-saved-properties-changed", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("genvilla-saved-properties-changed", sync);
    };
  }, [property.id]);

  function toggle() {
    try {
      const entries = readSaved();
      const exists = entries.some((item) => String(item?.id) === String(property.id));
      const next = entries.filter((item) => String(item?.id) !== String(property.id));
      if (!exists) {
        // Retain the existing saved-list format, without storing seller data.
        const { id, title, location, city, locality, type, purpose, bhk, price, priceValue, image, area, areaValue } = property;
        next.push({ id, title, location, city, locality, type, purpose, bhk, price, priceValue, image, area, areaValue });
      }
      localStorage.setItem(savedKey, JSON.stringify(next));
      window.dispatchEvent(new Event("genvilla-saved-properties-changed"));
      setError("");
    } catch { setError("Couldn’t save. Please allow browser storage and try again."); }
  }

  return <span className="relative inline-flex">
    <button type="button" onClick={toggle} aria-label={saved ? "Remove saved property" : "Save property"} aria-pressed={saved} className={compact ? "flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-green shadow" : "btn-outline gap-2"}>
      <Heart size={18} className={saved ? "fill-green text-green" : ""} />{!compact && (saved ? "Saved" : "Save")}
    </button>
    {error && <span role="status" className="absolute right-0 top-full z-10 mt-2 w-48 rounded-xl bg-white p-3 text-xs text-ink shadow-soft">{error}</span>}
  </span>;
}

export function SharePropertyButton({ title }) {
  const [message, setMessage] = useState("");
  async function share() {
    try {
      if (navigator.share) await navigator.share({ title, url: window.location.href });
      else { await navigator.clipboard.writeText(window.location.href); setMessage("Link copied"); }
    } catch (error) {
      if (error.name !== "AbortError") setMessage("Copy the page address to share this property.");
    }
  }
  return <span><button type="button" onClick={share} className="btn-outline"><Share2 size={16} />Share</button><span role="status" className="ml-2 text-xs">{message}</span></span>;
}

export function PropertyDescription({ description }) {
  const [expanded, setExpanded] = useState(false);
  const long = description.length > 650;
  return <>
    <p id="property-description" className="whitespace-pre-line break-words text-sm leading-7 text-ink/70">{long && !expanded ? `${description.slice(0, 650).trimEnd()}…` : description}</p>
    {long && <button type="button" aria-expanded={expanded} aria-controls="property-description" onClick={() => setExpanded(!expanded)} className="mt-3 min-h-11 text-sm font-bold text-green">{expanded ? "Read less" : "Read more"}</button>}
  </>;
}
