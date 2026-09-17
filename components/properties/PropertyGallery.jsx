"use client";

import { useEffect, useRef, useState } from "react";
import { Building2, ChevronLeft, ChevronRight, Expand, Images, X } from "lucide-react";

export function PropertyImage({ src, alt, className = "", priority = false }) {
  const [failedSource, setFailedSource] = useState(null);
  const imageRef = useRef(null);
  useEffect(() => {
    // A server-rendered image can fail before React attaches onError.
    if (imageRef.current?.complete && imageRef.current.naturalWidth === 0) {
      setFailedSource(src);
    }
  }, [src]);
  // The old placeholder URL has no asset in public/. Render a branded neutral
  // fallback instead of another remote image or a broken-image icon.
  if (!src || failedSource === src) {
    return <div role="img" aria-label={`${alt}: photo unavailable`} className={`flex flex-col items-center justify-center gap-3 bg-sage text-green ${className}`}>
      <Building2 size={38} aria-hidden="true" />
      <span className="text-xs font-semibold">Photo unavailable</span>
    </div>;
  }
  return <img ref={imageRef} src={src} alt={alt} className={className} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} decoding="async" onError={() => setFailedSource(src)} />;
}

export default function PropertyGallery({ images = [], title, collection = false }) {
  const [current, setCurrent] = useState(0);
  const [open, setOpen] = useState(false);
  const dialogRef = useRef(null);
  const active = current < images.length ? current : 0;
  const move = (direction) => setCurrent((index) => (index + direction + images.length) % images.length);

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const show = (index) => { setCurrent(index); setOpen(true); };
  const arrows = (fullscreen = false) => images.length > 1 && <>
    <button type="button" aria-label="Previous property image" onClick={() => move(-1)} className={`absolute left-3 top-1/2 -translate-y-1/2 rounded-full p-3 shadow ${fullscreen ? "bg-white text-ink" : "bg-white/95 text-ink"}`}><ChevronLeft size={20} /></button>
    <button type="button" aria-label="Next property image" onClick={() => move(1)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/95 p-3 text-ink shadow"><ChevronRight size={20} /></button>
  </>;

  return <>
    {collection ? <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
      {images.map((src, index) => <button type="button" key={src} onClick={() => show(index)} aria-label={`View property photo ${index + 1}`} className="aspect-[4/3] overflow-hidden rounded-2xl bg-sage">
        <PropertyImage src={src} alt={`${title}, photo ${index + 1}`} className="h-full w-full object-cover" />
      </button>)}
    </div> : <div className="min-w-0">
      <div className="relative overflow-hidden rounded-[24px] bg-sage">
        <button type="button" disabled={!images.length} onClick={() => show(active)} aria-label="Open property photo gallery" className="block h-[300px] w-full sm:h-[380px] xl:h-[400px] disabled:cursor-default">
          <PropertyImage key={images[active]} src={images[active]} alt={`${title}, photo ${active + 1}`} priority className="h-full w-full object-contain" />
        </button>
        {arrows()}
        {images.length > 0 && <div className="pointer-events-none absolute inset-x-4 bottom-4 flex justify-between text-xs text-white">
          <span aria-live="polite" className="rounded-full bg-black/65 px-3 py-2">{active + 1} / {images.length}</span>
          <span className="flex items-center gap-2 rounded-full bg-black/65 px-3 py-2"><Expand size={14} /> View photos</span>
        </div>}
      </div>
      {images.length > 1 && <div className="mt-3 flex gap-2">
        {images.slice(0, 4).map((src, index) => <button type="button" key={src} aria-label={`Show property image ${index + 1}`} aria-pressed={active === index} onClick={() => setCurrent(index)} className={`h-16 min-w-0 flex-1 overflow-hidden rounded-xl border-2 ${active === index ? "border-green" : "border-transparent"}`}>
          <PropertyImage src={src} alt={`${title}, thumbnail ${index + 1}`} className="h-full w-full object-cover" />
        </button>)}
        {images.length > 4 && <button type="button" onClick={() => show(4)} className="flex min-w-16 flex-col items-center justify-center gap-1 rounded-xl bg-green px-2 text-xs font-bold text-white"><Images size={18} />+{images.length - 4} Photos</button>}
      </div>}
    </div>}
    <dialog ref={dialogRef} aria-label={`${title} photo gallery`} onClose={() => setOpen(false)} onClick={(event) => { if (event.target === event.currentTarget) setOpen(false); }} onKeyDown={(event) => {
      if (images.length > 1 && ["ArrowLeft", "ArrowRight"].includes(event.key)) { event.preventDefault(); move(event.key === "ArrowLeft" ? -1 : 1); }
    }} className="fixed inset-0 m-auto max-h-[92dvh] w-[calc(100%-24px)] max-w-6xl overflow-y-auto rounded-2xl bg-ink p-4 text-white backdrop:bg-black/80 sm:p-6">
      {open && <>
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="min-w-0 truncate font-semibold">{title}</p>
          <button type="button" autoFocus onClick={() => setOpen(false)} aria-label="Close photo gallery" className="rounded-full p-3 text-white focus-visible:outline-white"><X size={22} /></button>
        </div>
        <div className="relative">
          <PropertyImage src={images[active]} alt={`${title}, photo ${active + 1}`} priority className="h-[50dvh] w-full rounded-xl object-contain" />
          {arrows(true)}
        </div>
        <p className="my-4 text-center text-sm" aria-live="polite">{active + 1} / {images.length}</p>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-8">
          {images.map((src, index) => <button type="button" key={src} aria-label={`Show full photo ${index + 1}`} aria-pressed={active === index} onClick={() => setCurrent(index)} className={`aspect-[4/3] overflow-hidden rounded-lg border-2 ${active === index ? "border-white" : "border-transparent"}`}>
            <PropertyImage src={src} alt={`${title}, thumbnail ${index + 1}`} className="h-full w-full object-cover" />
          </button>)}
        </div>
      </>}
    </dialog>
  </>;
}
