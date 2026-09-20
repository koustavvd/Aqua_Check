import React, { useState, useRef, useEffect } from 'react';
import { Search, X, MapPin, Navigation, Building2, Hash } from 'lucide-react';
import { HydroStation, PincodeEntry } from '../types';
import { TRIPURA_PINCODES, calculateDistanceKm } from '../data/tripuraData';
import { useLanguage } from '../context/LanguageContext';

interface SearchFilterProps {
  stations: HydroStation[];
  selectedStation: HydroStation | null;
  onSelectStation: (station: HydroStation) => void;
  droppedPin: { lat: number; lng: number } | null;
  onClearPin: () => void;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  stations,
  selectedStation,
  onSelectStation,
  droppedPin,
  onClearPin,
}) => {
  const { t, formatNum, getDistrictName } = useLanguage();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const cleanQuery = query.trim().toLowerCase();

  // Search through stations and pincode directory
  const matchedStations = query.trim().length > 0
    ? stations.filter((st) => {
        return (
          st.location.toLowerCase().includes(cleanQuery) ||
          st.village.toLowerCase().includes(cleanQuery) ||
          st.pincode.includes(cleanQuery) ||
          st.block.toLowerCase().includes(cleanQuery) ||
          st.district.toLowerCase().includes(cleanQuery) ||
          st.post_office.toLowerCase().includes(cleanQuery) ||
          `#${st.id}`.includes(cleanQuery)
        );
      }).slice(0, 10)
    : [];

  const matchedPincodes = query.trim().length > 0
    ? TRIPURA_PINCODES.filter((p) => {
        return (
          p.pincode.includes(cleanQuery) ||
          p.post_office.toLowerCase().includes(cleanQuery) ||
          p.district.toLowerCase().includes(cleanQuery) ||
          p.block.toLowerCase().includes(cleanQuery) ||
          p.villages.some(v => v.toLowerCase().includes(cleanQuery))
        );
      }).slice(0, 5)
    : [];

  const handleSelectStation = (station: HydroStation) => {
    onSelectStation(station);
    setQuery(`${station.location} (${station.pincode})`);
    setIsOpen(false);
  };

  const handleSelectPincode = (p: PincodeEntry) => {
    // Find nearest station to this pincode centroid
    let nearest: HydroStation | null = null;
    let minDistance = Infinity;

    for (const st of stations) {
      const dist = calculateDistanceKm(p.lat, p.lng, st.lat, st.lng);
      if (dist < minDistance) {
        minDistance = dist;
        nearest = st;
      }
    }

    if (nearest) {
      onSelectStation(nearest);
      setQuery(`${p.post_office} (${p.pincode})`);
      setIsOpen(false);
    }
  };

  const nearestDistance = (droppedPin && selectedStation)
    ? calculateDistanceKm(droppedPin.lat, droppedPin.lng, selectedStation.lat, selectedStation.lng)
    : null;

  const quickPicks = [
    { label: 'Agartala (799003)', id: 15 },
    { label: 'Mohanpur (799012)', id: 6 },
    { label: 'Udaipur (799114)', id: 53 },
    { label: 'Bishalgarh (799102)', id: 32 },
    { label: 'Dharmanagar (799250)', id: 38 },
    { label: 'Khowai (799201)', id: 3 },
    { label: 'Ambassa (799289)', id: 58 },
    { label: 'Sabroom (799145)', id: 25 },
  ];

  return (
    <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 transition-colors rounded-lg" ref={dropdownRef}>
      {/* Search Input Bar */}
      <div className="relative z-50">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={t.searchPlaceholder}
          className="w-full pl-9 pr-8 py-2 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 focus:border-sky-500 focus:bg-sky-50/40 dark:focus:bg-sky-950/20 focus:ring-1 focus:ring-sky-400/40 rounded-md text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none transition"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Live Autocomplete Results - Light Blue Themed */}
        {isOpen && (matchedStations.length > 0 || matchedPincodes.length > 0) && (
          <div className="absolute left-0 right-0 top-full mt-1.5 bg-sky-50 dark:bg-slate-900 border-2 border-sky-300 dark:border-sky-700 rounded-lg shadow-2xl z-[9999] max-h-80 overflow-y-auto divide-y divide-sky-100 dark:divide-sky-900/50 backdrop-blur">
            {matchedStations.length > 0 && (
              <div className="p-1.5 bg-sky-50/90 dark:bg-slate-900/90">
                <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-sky-700 dark:text-sky-400 font-bold bg-sky-100/80 dark:bg-sky-950/60 rounded mb-1">
                  {t.cgwbStationsHeader}
                </div>
                {matchedStations.map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => handleSelectStation(st)}
                    className="w-full text-left px-2.5 py-2 hover:bg-sky-100/80 dark:hover:bg-sky-950/80 rounded-md flex items-center justify-between text-xs transition border border-transparent hover:border-sky-200 dark:hover:border-sky-800/60"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        <span>{st.location}</span>
                        <span className="text-[10px] font-mono px-1 rounded bg-sky-100 dark:bg-sky-900/70 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                          {st.type === 'DUG' ? t.dugWell : t.piezometer}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-300">
                        PIN: <span className="font-mono font-semibold text-sky-800 dark:text-sky-300 bg-sky-100/80 dark:bg-sky-900/50 px-1 py-0.5 rounded">{st.pincode}</span> • {st.block} {t.blockSuffix}, {getDistrictName(st.district)}
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <div className="font-mono text-xs font-semibold text-sky-900 dark:text-sky-200">
                        WL: {formatNum(st.pre_depth)} {t.meters}
                      </div>
                      <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono font-semibold">
                        Well: {formatNum((st.pre_depth + 3.5 + 0.8).toFixed(2))} {t.meters}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {matchedPincodes.length > 0 && (
              <div className="p-1.5 bg-sky-50 dark:bg-slate-900">
                <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-sky-800 dark:text-sky-300 font-bold bg-sky-100 dark:bg-sky-950/80 rounded mb-1 flex items-center justify-between">
                  <span>{t.postalIndexHeader}</span>
                  <span className="text-[9px] font-normal normal-case opacity-80">{t.clickToLocateNearest}</span>
                </div>
                {matchedPincodes.map((p) => (
                  <button
                    key={p.pincode}
                    type="button"
                    onClick={() => handleSelectPincode(p)}
                    className="w-full text-left px-2.5 py-2 hover:bg-sky-100/90 dark:hover:bg-sky-950/80 rounded-md flex items-center justify-between text-xs transition border border-transparent hover:border-sky-200 dark:hover:border-sky-800/60"
                  >
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                        <span className="truncate">{p.post_office}</span>
                        <span className="font-mono text-sky-800 dark:text-sky-300 font-bold bg-sky-100 dark:bg-sky-900/60 px-1.5 py-0.5 rounded border border-sky-200 dark:border-sky-700/70">{p.pincode}</span>
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-300 truncate mt-0.5">
                        {p.block} {t.blockSuffix} • <span className="text-slate-500 dark:text-slate-400">Villages:</span> {p.villages.slice(0, 3).join(', ')}...
                      </div>
                    </div>
                    <span className="text-[10px] text-sky-800 dark:text-sky-300 shrink-0 ml-2 font-mono font-medium bg-sky-100/60 dark:bg-sky-900/40 px-1.5 py-0.5 rounded">
                      {getDistrictName(p.district)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Proximity / Dropped Pin Banner */}
      {droppedPin && (
        <div className="mt-2 px-3 py-1.5 rounded bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 text-xs text-sky-800 dark:text-sky-300 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
            <span>
              {t.pinnedCoordinates}: <strong className="font-mono">{droppedPin.lat.toFixed(3)}°N, {droppedPin.lng.toFixed(3)}°E</strong>
              {nearestDistance !== null && (
                <span className="ml-1.5 text-slate-600 dark:text-slate-300">
                  {t.nearestTelemetry(nearestDistance)}
                </span>
              )}
            </span>
          </div>
          <button
            type="button"
            onClick={onClearPin}
            className="text-[10px] uppercase font-mono font-semibold text-sky-700 dark:text-sky-400 hover:underline shrink-0 ml-2"
          >
            {t.clearPin}
          </button>
        </div>
      )}

      {/* Quick Location Chips */}
      <div className="flex items-center gap-1 mt-2.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
        <span className="text-slate-400 font-mono uppercase text-[10px] shrink-0 mr-1 flex items-center gap-0.5">
          <Hash className="w-3 h-3" /> {t.keyAreas}:
        </span>
        {quickPicks.map((pick) => {
          const station = stations.find(s => s.id === pick.id);
          const isSelected = selectedStation?.id === pick.id;
          return (
            <button
              key={pick.id}
              type="button"
              onClick={() => station && handleSelectStation(station)}
              className={`px-2 py-1 rounded text-xs shrink-0 transition font-medium ${
                isSelected
                  ? 'bg-sky-700 text-white dark:bg-sky-600'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {pick.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
