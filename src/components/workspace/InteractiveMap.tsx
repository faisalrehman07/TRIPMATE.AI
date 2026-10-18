"use client";

import React, { useEffect, useRef, useState } from "react";
import { ItineraryDay, HotelOffer } from "@/lib/types/trip";
import { MapPin, Navigation, Compass, Layers } from "lucide-react";
import "leaflet/dist/leaflet.css";

interface InteractiveMapProps {
  days: ItineraryDay[];
  selectedHotel?: HotelOffer;
  destination: string;
}

export function InteractiveMap({ days, selectedHotel, destination }: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const polylinesLayerRef = useRef<any>(null);

  const [selectedDayFilter, setSelectedDayFilter] = useState<number | "ALL">("ALL");
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize Leaflet map on client
  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    let isMounted = true;

    import("leaflet").then((L) => {
      if (!isMounted) return;

      // Fix missing leaflet marker icons in webpack/Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      // Default center: Coorg (12.4244, 75.7382)
      const initialLat = selectedHotel?.coordinates[0] || 12.4244;
      const initialLng = selectedHotel?.coordinates[1] || 75.7382;

      if (!mapInstanceRef.current && mapContainerRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [initialLat, initialLng],
          zoom: 11,
          zoomControl: true,
        });

        // Crisp OpenStreetMap CartoDB Positron / Warm Tile layer
        L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
          attribution: '&copy; <a href="https://carto.com/">CARTO</a>, OpenStreetMap',
          maxZoom: 19,
        }).addTo(map);

        markersLayerRef.current = L.layerGroup().addTo(map);
        polylinesLayerRef.current = L.layerGroup().addTo(map);

        mapInstanceRef.current = map;
        setMapLoaded(true);
      }
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers and route lines when day filter or itinerary changes
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current) return;

    import("leaflet").then((L) => {
      const markersGroup = markersLayerRef.current;
      const polylinesGroup = polylinesLayerRef.current;
      const map = mapInstanceRef.current;

      if (!markersGroup || !polylinesGroup || !map) return;

      markersGroup.clearLayers();
      polylinesGroup.clearLayers();

      const allCoordinates: [number, number][] = [];

      // 1. Add Hotel marker if available
      if (selectedHotel && selectedHotel.coordinates) {
        allCoordinates.push(selectedHotel.coordinates);

        const hotelIcon = L.divIcon({
          className: "custom-hotel-marker",
          html: `
            <div style="background-color: #0f766e; color: white; width: 34px; height: 34px; border-radius: 9999px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.25); border: 2px solid white; font-weight: bold; font-size: 14px;">
              🏨
            </div>
          `,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
        });

        const hotelMarker = L.marker(selectedHotel.coordinates, { icon: hotelIcon });
        hotelMarker.bindPopup(`
          <div style="min-width: 180px;">
            <div style="font-size: 11px; text-transform: uppercase; color: #0f766e; font-weight: bold;">Selected Stay</div>
            <div style="font-weight: bold; font-size: 14px; margin-top: 2px;">${selectedHotel.name}</div>
            <div style="font-size: 12px; color: #57534e; margin-top: 4px;">₹${selectedHotel.pricePerNight}/night • ${selectedHotel.rating} ★</div>
            <div style="font-size: 11px; color: #78716c; margin-top: 4px;">${selectedHotel.requiredRooms} rooms allocated for ${selectedHotel.totalNights} nights</div>
          </div>
        `);
        markersGroup.addLayer(hotelMarker);
      }

      // 2. Add Activity markers & polylines
      const dayColors = ["#047857", "#d97706", "#4338ca", "#b91c1c"];

      days.forEach((day, dayIdx) => {
        if (selectedDayFilter !== "ALL" && selectedDayFilter !== day.dayNumber) {
          return;
        }

        const dayCoords: [number, number][] = [];
        const color = dayColors[dayIdx % dayColors.length];

        day.items.forEach((item, itemIdx) => {
          if (!item.coordinates || (item.coordinates[0] === 0 && item.coordinates[1] === 0)) return;

          dayCoords.push(item.coordinates);
          allCoordinates.push(item.coordinates);

          const itemIcon = L.divIcon({
            className: "custom-activity-marker",
            html: `
              <div style="background-color: ${color}; color: white; width: 28px; height: 28px; border-radius: 9999px; display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 8px rgba(0,0,0,0.2); border: 2px solid white; font-weight: bold; font-size: 11px;">
                D${day.dayNumber}.${itemIdx + 1}
              </div>
            `,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          });

          const marker = L.marker(item.coordinates, { icon: itemIcon });
          marker.bindPopup(`
            <div style="min-width: 200px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 10px; background: ${color}20; color: ${color}; padding: 2px 6px; border-radius: 4px; font-weight: bold;">
                  Day ${day.dayNumber} • ${item.timeSlot}
                </span>
                <span style="font-size: 11px; font-weight: 600; color: #1c1917;">${item.startTime}</span>
              </div>
              <div style="font-weight: bold; font-size: 13px; margin-top: 6px; color: #1c1917;">${item.name}</div>
              <p style="font-size: 11px; color: #57534e; margin-top: 4px; line-height: 1.3;">${item.description.slice(0, 90)}...</p>
              <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #e7e5e4; display: flex; justify-content: space-between; font-size: 11px;">
                <span style="color: #78716c;">Estimated Cost:</span>
                <span style="font-weight: 600; color: #047857;">${item.groupCost === 0 ? "Free / Included" : "₹" + item.groupCost}</span>
              </div>
            </div>
          `);
          markersGroup.addLayer(marker);
        });

        // Draw polyline connecting day's stops
        if (dayCoords.length > 1) {
          const polyline = L.polyline(dayCoords, {
            color,
            weight: 3,
            opacity: 0.75,
            dashArray: "6, 8",
          });
          polylinesGroup.addLayer(polyline);
        }
      });

      // Fit map bounds to encompass all points
      if (allCoordinates.length > 0) {
        const bounds = L.latLngBounds(allCoordinates);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
      }
    });
  }, [days, selectedHotel, selectedDayFilter, mapLoaded]);

  return (
    <div className="relative h-full w-full rounded-2xl border border-stone-200 bg-stone-100 overflow-hidden shadow-sm flex flex-col">
      {/* Top Filter Controls Overlay */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 rounded-xl bg-white/95 p-1.5 shadow-md backdrop-blur border border-stone-200">
        <button
          onClick={() => setSelectedDayFilter("ALL")}
          className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
            selectedDayFilter === "ALL"
              ? "bg-emerald-900 text-white"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          All Days
        </button>
        {days.map((d) => (
          <button
            key={d.dayNumber}
            onClick={() => setSelectedDayFilter(d.dayNumber)}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
              selectedDayFilter === d.dayNumber
                ? "bg-emerald-900 text-white"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            Day {d.dayNumber}
          </button>
        ))}
      </div>

      {/* Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-3 rounded-xl bg-white/95 px-3 py-2 text-[11px] font-medium shadow-md backdrop-blur border border-stone-200 text-stone-700">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-teal-700 inline-block"></span>
          <span>Stay</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-700 inline-block"></span>
          <span>Day 1</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-600 inline-block"></span>
          <span>Day 2</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-indigo-700 inline-block"></span>
          <span>Day 3</span>
        </div>
      </div>

      {/* Map DOM Container */}
      <div ref={mapContainerRef} className="h-full w-full min-h-[460px]" />
    </div>
  );
}
