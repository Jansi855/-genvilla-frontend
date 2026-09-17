'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import { findLocation, searchLocations } from '@/data/locations';
import LocationMap from './LocationMap';

export default function LocationAutocomplete({
  value = '',
  onSelect,
  onQueryChange,
  label = 'Location',
  placeholder = 'Type a city, sector or locality',
  showMap = false,
  mapClassName = 'h-48',
  inputId,
}) {
  const [query, setQuery] = useState(value);
  const [selected, setSelected] = useState(() => findLocation(value));
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);
  const generatedId = useId();
  const controlId = inputId || `location-${generatedId}`;
  const listboxId = `${controlId}-suggestions`;
  const suggestions = useMemo(() => searchLocations(query), [query]);

  useEffect(() => {
    setQuery(value || '');
    setSelected(findLocation(value));
  }, [value]);

  const choose = (location) => {
    setQuery(location.label);
    setSelected(location);
    setOpen(false);
    setActiveIndex(-1);
    onSelect?.(location);
  };

  const change = (event) => {
    const next = event.target.value;
    setQuery(next);
    setSelected(null);
    setOpen(true);
    setActiveIndex(-1);
    onQueryChange?.(next);
  };

  return <div className="relative">
    <label className="block" htmlFor={controlId}>
      <span className="mb-2 block text-xs font-bold text-ink">{label}</span>
      <span className="relative block">
        <Search className="pointer-events-none absolute left-3 top-3.5 text-ink/40" size={17}/>
        <input
          ref={inputRef}
          id={controlId}
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-activedescendant={activeIndex >= 0 ? `${controlId}-option-${activeIndex}` : undefined}
          aria-autocomplete="list"
          className="h-11 w-full rounded-xl border border-ink/15 bg-white pl-10 pr-10 text-sm text-ink outline-none focus:border-green"
          value={query}
          placeholder={placeholder}
          onChange={change}
          onFocus={() => setOpen(true)}
          onBlur={() => window.setTimeout(() => setOpen(false), 120)}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown' && suggestions.length) {
              event.preventDefault();
              setOpen(true);
              setActiveIndex((current) => Math.min(current + 1, suggestions.length - 1));
            }
            if (event.key === 'ArrowUp' && suggestions.length) {
              event.preventDefault();
              setActiveIndex((current) => Math.max(current - 1, 0));
            }
            if (event.key === 'Enter' && open && suggestions.length) {
              event.preventDefault();
              choose(suggestions[activeIndex >= 0 ? activeIndex : 0]);
            }
            if (event.key === 'Escape') {
              setOpen(false);
              setActiveIndex(-1);
            }
          }}
        />
        <MapPin className="pointer-events-none absolute right-3 top-3.5 text-green" size={17}/>
      </span>
    </label>

    {open && <div id={listboxId} role="listbox" className="absolute left-0 right-0 top-[70px] z-40 max-h-80 overflow-y-auto rounded-2xl border border-ink/10 bg-white p-1.5 shadow-[0_18px_45px_rgba(19,32,29,.16)]">
      {suggestions.length ? suggestions.map((location, index) => <button
        type="button"
        role="option"
        id={`${controlId}-option-${index}`}
        aria-selected={selected?.id === location.id}
        key={location.id}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => choose(location)}
        onMouseEnter={() => setActiveIndex(index)}
        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${activeIndex === index ? 'bg-[#eef4ef]' : 'hover:bg-[#eef4ef]'}`}
      >
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#dce7df] text-green"><MapPin size={15}/></span>
        <span><b className="block text-sm text-ink">{location.locality || location.city}</b><small className="text-ink/45">{location.locality ? `${location.city} · ${location.state}` : `${location.state} · all localities`}</small></span>
      </button>) : <p className="px-3 py-4 text-sm text-ink/50">GenVilla currently supports Gurugram, Ghaziabad, Sonipat, Noida and New Delhi.</p>}
    </div>}

    {showMap && selected && <div className="mt-3 overflow-hidden rounded-2xl border border-ink/10 bg-white"><LocationMap location={selected} className={mapClassName}/><p className="flex items-center gap-2 border-t border-ink/10 px-3 py-2 text-xs font-bold text-ink/60"><MapPin className="text-green" size={14}/> Located: {selected.label}</p></div>}
  </div>;
}
