'use client';

import { useEffect, useRef } from 'react';

export default function LocationMap({ location, className = 'h-48' }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const leafletRef = useRef(null);

  useEffect(() => {
    let active = true;
    let map;
    async function createMap() {
      const leafletModule = await import('leaflet');
      if (!active || !containerRef.current) return;
      const L = leafletModule.default;
      leafletRef.current = L;
      map = L.map(containerRef.current, { scrollWheelZoom: false }).setView([location.latitude, location.longitude], location.locality ? 14 : 11);
      mapRef.current = map;
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
      markerRef.current = L.circleMarker([location.latitude, location.longitude], {
        radius: 8,
        color: '#ffffff',
        weight: 3,
        fillColor: '#155f4b',
        fillOpacity: 1,
      }).addTo(map).bindTooltip(location.label, { permanent: false });
    }
    createMap();
    return () => {
      active = false;
      if (map) map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;
    const coordinates = [location.latitude, location.longitude];
    markerRef.current.setLatLng(coordinates).setTooltipContent(location.label);
    mapRef.current.setView(coordinates, location.locality ? 14 : 11, { animate: true });
  }, [location]);

  return <div ref={containerRef} className={`${className} w-full rounded-2xl`} aria-label={`Map showing ${location.label}`}/>;
}
