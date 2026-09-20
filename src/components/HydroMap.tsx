import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Layers, Compass, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { HydroStation } from '../types';
import { calculateDistanceKm, calculateWellDepth, getStationRiskCategory } from '../data/tripuraData';
import { useLanguage } from '../context/LanguageContext';

interface HydroMapProps {
  stations: HydroStation[];
  selectedStation: HydroStation | null;
  onSelectStation: (station: HydroStation) => void;
  droppedPin: { lat: number; lng: number } | null;
  onDropPin: (coords: { lat: number; lng: number }) => void;
  selectedDistrict: string;
}

export const HydroMap: React.FC<HydroMapProps> = ({
  stations,
  selectedStation,
  onSelectStation,
  droppedPin,
  onDropPin,
  selectedDistrict,
}) => {
  const { t, formatNum } = useLanguage();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const droppedPinMarkerRef = useRef<L.Marker | null>(null);
  const distanceLineRef = useRef<L.Polyline | null>(null);
  const [basemap, setBasemap] = useState<'osm' | 'topo' | 'satellite'>('osm');
  const baseTileLayerRef = useRef<L.TileLayer | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Centered on Tripura
    const map = L.map(mapContainerRef.current, {
      center: [23.84, 91.60],
      zoom: 9,
      zoomControl: false,
      attributionControl: false,
    });

    // Default OpenStreetMap (100% free, fast, no API key required)
    const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      subdomains: 'abc',
    }).addTo(map);

    baseTileLayerRef.current = tileLayer;

    // Attribution
    L.control.attribution({ position: 'bottomright', prefix: 'CGWB & Tripura Water Resources' }).addTo(map);

    // Marker Layer Group
    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;

    // Map Click: Drop Pin
    map.on('click', (e: L.LeafletMouseEvent) => {
      onDropPin({ lat: e.latlng.lat, lng: e.latlng.lng });
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Basemap Layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (baseTileLayerRef.current) {
      map.removeLayer(baseTileLayerRef.current);
    }

    let url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    let subdomains = 'abc';

    if (basemap === 'topo') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}';
      subdomains = '';
    } else if (basemap === 'satellite') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      subdomains = '';
    }

    const newTileLayer = L.tileLayer(url, {
      maxZoom: 19,
      subdomains,
    }).addTo(map);

    baseTileLayerRef.current = newTileLayer;
  }, [basemap]);

  // Render Station Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    stations.forEach((station) => {
      const isSelected = selectedStation?.id === station.id;
      const isPiezometer = station.type === 'PZ';

      // Authentic cartographic color coding based on user vulnerability scale:
      // > 70: Low (Emerald), 40-70: Moderate (Amber), < 40: High (Rose)
      const riskInfo = getStationRiskCategory(station.risk);
      const wellDepth = calculateWellDepth(station.pre_depth);

      let pinColor = '#10b981'; // Low (> 70) - Emerald
      if (riskInfo.tier === 'high') pinColor = '#f43f5e'; // High (< 40) - Rose
      else if (riskInfo.tier === 'moderate') pinColor = '#f59e0b'; // Moderate (40-70) - Amber

      const size = isSelected ? 48 : 22;

      // Clean SVG Marker - Selected icon is significantly larger with target indicator
      let svgHtml = '';
      if (isPiezometer) {
        // Diamond for Piezometer
        if (isSelected) {
          svgHtml = `
            <div style="width:${size}px; height:${size}px; display:flex; align-items:center; justify-content:center; cursor:pointer;">
              <svg width="${size}" height="${size}" viewBox="0 0 48 48" style="overflow:visible;">
                <!-- Target Pulse Halo -->
                <polygon points="24,3 45,24 24,45 3,24" fill="rgba(2, 132, 199, 0.2)" stroke="#0284c7" stroke-width="2.5" stroke-dasharray="4,3" />
                <!-- Main Piezometer Diamond -->
                <polygon points="24,8 40,24 24,40 8,24" fill="${pinColor}" stroke="#ffffff" stroke-width="3" style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.35));" />
                <text x="24" y="29" fill="#ffffff" font-size="14" font-family="monospace" font-weight="900" text-anchor="middle">P</text>
              </svg>
            </div>
          `;
        } else {
          svgHtml = `
            <div style="width:${size}px; height:${size}px; display:flex; align-items:center; justify-content:center; cursor:pointer;">
              <svg width="${size}" height="${size}" viewBox="0 0 22 22">
                <polygon points="11,2 20,11 11,20 2,11" fill="${pinColor}" stroke="#ffffff" stroke-width="1.5" />
                <text x="11" y="14" fill="#ffffff" font-size="8" font-family="monospace" font-weight="bold" text-anchor="middle">P</text>
              </svg>
            </div>
          `;
        }
      } else {
        // Circle for Dug Well
        if (isSelected) {
          svgHtml = `
            <div style="width:${size}px; height:${size}px; display:flex; align-items:center; justify-content:center; cursor:pointer;">
              <svg width="${size}" height="${size}" viewBox="0 0 48 48" style="overflow:visible;">
                <!-- Target Pulse Halo -->
                <circle cx="24" cy="24" r="21" fill="rgba(2, 132, 199, 0.2)" stroke="#0284c7" stroke-width="2.5" stroke-dasharray="4,3" />
                <!-- Main Dug Well Circle -->
                <circle cx="24" cy="24" r="14" fill="${pinColor}" stroke="#ffffff" stroke-width="3" style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.35));" />
                <!-- Center Target Core -->
                <circle cx="24" cy="24" r="6" fill="#ffffff" />
                <circle cx="24" cy="24" r="2.5" fill="${pinColor}" />
              </svg>
            </div>
          `;
        } else {
          svgHtml = `
            <div style="width:${size}px; height:${size}px; display:flex; align-items:center; justify-content:center; cursor:pointer;">
              <svg width="${size}" height="${size}" viewBox="0 0 22 22">
                <circle cx="11" cy="11" r="8.5" fill="${pinColor}" stroke="#ffffff" stroke-width="1.5" />
                <circle cx="11" cy="11" r="3" fill="#ffffff" />
              </svg>
            </div>
          `;
        }
      }

      const icon = L.divIcon({
        html: svgHtml,
        className: 'custom-station-pin',
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      const marker = L.marker([station.lat, station.lng], { icon });
      if (isSelected) {
        marker.setZIndexOffset(1000);
      }

      // Clean tooltip on hover with Water Level, Well Depth, and Vulnerability
      const localizedRiskLabel = riskInfo.tier === 'low'
        ? t.lowVulnerability
        : riskInfo.tier === 'moderate'
        ? t.moderateVulnerability
        : t.highVulnerability;

      marker.bindTooltip(`
        <div style="font-family: -apple-system, sans-serif; font-size: 11px; line-height: 1.45; padding: 3px;">
          <div style="font-weight: 700; color: #0f172a;">${station.location}</div>
          <div style="color: #64748b;">${station.type === 'DUG' ? t.dugWell : t.piezometer} • PIN ${formatNum(station.pincode)}</div>
          <div style="margin-top: 4px; display: flex; flex-direction: column; gap: 2px;">
            <div style="color: #0369a1; font-weight: 600;">${t.waterLevel}: <strong>${formatNum(station.pre_depth)} ${t.meters}</strong></div>
            <div style="color: #059669; font-weight: 600;">${t.wellDepth}: <strong>${formatNum(wellDepth)} ${t.meters}</strong></div>
            <div style="font-weight: 600; color: ${riskInfo.tier === 'high' ? '#e11d48' : riskInfo.tier === 'moderate' ? '#d97706' : '#059669'};">
              ${t.vulnerability}: ${formatNum(riskInfo.score)}/100 (${localizedRiskLabel})
            </div>
          </div>
        </div>
      `, {
        direction: 'top',
        offset: [0, -size / 2],
        className: 'hydro-leaflet-tooltip',
      });

      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        onSelectStation(station);
      });

      markersLayer.addLayer(marker);
    });
  }, [stations, selectedStation]);

  // Handle Dropped Pin & Geodesic Distance Line
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (droppedPinMarkerRef.current) {
      map.removeLayer(droppedPinMarkerRef.current);
      droppedPinMarkerRef.current = null;
    }
    if (distanceLineRef.current) {
      map.removeLayer(distanceLineRef.current);
      distanceLineRef.current = null;
    }

    if (droppedPin) {
      const pinIcon = L.divIcon({
        html: `
          <div style="transform:translate(-50%, -100%); cursor:pointer;">
            <svg width="32" height="38" viewBox="0 0 32 38" fill="none">
              <path d="M16 0C7.16 0 0 7.16 0 16C0 27.5 16 38 16 38C16 38 32 27.5 32 16C32 7.16 24.84 0 16 0Z" fill="#0284c7" stroke="#ffffff" stroke-width="2"/>
              <circle cx="16" cy="15" r="5" fill="#ffffff"/>
            </svg>
          </div>
        `,
        className: 'dropped-pin-icon',
        iconSize: [32, 38],
      });

      const droppedMarker = L.marker([droppedPin.lat, droppedPin.lng], { icon: pinIcon })
        .addTo(map)
        .bindTooltip(`
          <div style="font-size: 11px; font-weight: 600;">${t.customPinTarget}</div>
          <div style="font-size: 10px; color: #64748b;">${formatNum(droppedPin.lat.toFixed(4))}°N, ${formatNum(droppedPin.lng.toFixed(4))}°E</div>
        `, { permanent: false, direction: 'top' });

      droppedPinMarkerRef.current = droppedMarker;

      // Draw line to selected station
      if (selectedStation) {
        const line = L.polyline(
          [[droppedPin.lat, droppedPin.lng], [selectedStation.lat, selectedStation.lng]],
          {
            color: '#0284c7',
            weight: 2,
            dashArray: '4, 6',
            opacity: 0.8,
          }
        ).addTo(map);

        distanceLineRef.current = line;
      }
    }
  }, [droppedPin, selectedStation]);

  // District zoom bounds or pan to selected station
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (selectedDistrict !== 'ALL' && stations.length > 0) {
      const bounds = L.latLngBounds(stations.map(s => [s.lat, s.lng]));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 11 });
    }
  }, [selectedDistrict]);

  // Center on selected station smoothly
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedStation) return;
    map.panTo([selectedStation.lat, selectedStation.lng], { animate: true, duration: 0.5 });
  }, [selectedStation]);

  const resetView = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.flyTo([23.84, 91.60], 9, { duration: 0.8 });
  };

  return (
    <div className="relative w-full h-full min-h-[450px] bg-slate-100 dark:bg-slate-950 overflow-hidden">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Map Layer Switcher & Controls */}
      <div className="absolute top-3 right-3 z-[500] flex flex-col gap-2 pointer-events-auto">
        {/* Basemap Switcher */}
        <div className="bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-md shadow-md p-1 flex gap-1 backdrop-blur">
          <button
            type="button"
            onClick={() => setBasemap('osm')}
            title={t.cleanMap}
            className={`px-2 py-1 text-[11px] font-medium rounded transition ${
              basemap === 'osm'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {t.cleanMap}
          </button>
          <button
            type="button"
            onClick={() => setBasemap('topo')}
            title={t.streetTopo}
            className={`px-2 py-1 text-[11px] font-medium rounded transition ${
              basemap === 'topo'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {t.streetTopo}
          </button>
          <button
            type="button"
            onClick={() => setBasemap('satellite')}
            title={t.satellite}
            className={`px-2 py-1 text-[11px] font-medium rounded transition ${
              basemap === 'satellite'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {t.satellite}
          </button>
        </div>

        {/* Map Zoom & Reload Toolbar in a Single Line */}
        <div className="flex flex-row items-center self-end bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-md shadow-md divide-x divide-slate-200 dark:divide-slate-800 backdrop-blur">
          <button
            type="button"
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-center"
            title={t.zoomIn}
            aria-label="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-center"
            title={t.zoomOut}
            aria-label="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={resetView}
            className="p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-center"
            title={t.resetTripura}
            aria-label="Reload Map Extent"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Cartographic Map Legend */}
      <div className="absolute bottom-3 left-3 z-[500] bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-md shadow-md p-2.5 backdrop-blur max-w-xs text-xs pointer-events-auto">
        <div className="font-semibold text-slate-900 dark:text-slate-100 text-[11px] mb-1.5 uppercase tracking-wider font-mono">
          {t.stationSymbology}
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full border border-slate-400 bg-emerald-600 inline-block shrink-0"></span>
            <span>{t.dugWellShallow}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rotate-45 border border-slate-400 bg-sky-600 inline-block shrink-0"></span>
            <span>{t.piezometerDeep}</span>
          </div>
        </div>
        <div className="border-t border-slate-100 dark:border-slate-800 mt-2 pt-1.5 flex items-center justify-between text-[10px] text-slate-500 font-mono gap-2">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> &gt;{formatNum(70)} {t.legendLow}</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> {formatNum(40)}–{formatNum(70)} {t.legendMod}</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span> &lt;{formatNum(40)} {t.legendHigh}</span>
        </div>
      </div>
    </div>
  );
};
