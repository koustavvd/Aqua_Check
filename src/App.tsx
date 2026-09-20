import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { SearchFilter } from './components/SearchFilter';
import { HydroMap } from './components/HydroMap';
import { StationDossier } from './components/StationDossier';
import { PreDrillingAdvisory } from './components/PreDrillingAdvisory';
import { RegionalComparison } from './components/RegionalComparison';
import { LanguageModal } from './components/LanguageModal';
import { TRIPURA_STATIONS, calculateDistanceKm } from './data/tripuraData';
import { HydroStation } from './types';
import { MapPin } from 'lucide-react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

function ObservatoryDashboard() {
  const { t } = useLanguage();
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [selectedStation, setSelectedStation] = useState<HydroStation | null>(null); // No town selected by default
  const [droppedPin, setDroppedPin] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Ensure clean default theme
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  // Filter stations by district
  const filteredStations = useMemo(() => {
    if (selectedDistrict === 'ALL') return TRIPURA_STATIONS;
    return TRIPURA_STATIONS.filter((s) => s.district === selectedDistrict);
  }, [selectedDistrict]);

  // When district changes, if selected station is outside that district, clear selection
  useEffect(() => {
    if (selectedStation && selectedDistrict !== 'ALL' && selectedStation.district !== selectedDistrict) {
      setSelectedStation(null);
    }
  }, [selectedDistrict]);

  // Handle GPS locate
  const handleLocateGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;

        setDroppedPin({ lat: userLat, lng: userLng });

        // Find nearest station in Tripura
        let nearest = TRIPURA_STATIONS[0];
        let minDistance = Infinity;

        TRIPURA_STATIONS.forEach((st) => {
          const dist = calculateDistanceKm(userLat, userLng, st.lat, st.lng);
          if (dist < minDistance) {
            minDistance = dist;
            nearest = st;
          }
        });

        setSelectedStation(nearest);
        if (selectedDistrict !== 'ALL' && nearest.district !== selectedDistrict) {
          setSelectedDistrict('ALL');
        }
        setIsLocating(false);
      },
      (err) => {
        console.warn('GPS location failed:', err);
        setIsLocating(false);
        // Fallback to Agartala center
        setDroppedPin({ lat: 23.8315, lng: 91.2868 });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleDropPin = (coords: { lat: number; lng: number }) => {
    setDroppedPin(coords);
    // Find nearest station
    let nearest = TRIPURA_STATIONS[0];
    let minDistance = Infinity;
    TRIPURA_STATIONS.forEach((st) => {
      const dist = calculateDistanceKm(coords.lat, coords.lng, st.lat, st.lng);
      if (dist < minDistance) {
        minDistance = dist;
        nearest = st;
      }
    });

    setSelectedStation(nearest);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      {/* Institutional Top Navbar */}
      <Navbar
        selectedDistrict={selectedDistrict}
        onSelectDistrict={setSelectedDistrict}
        onLocateGps={handleLocateGps}
        isLocating={isLocating}
        onPrintReport={handlePrint}
        stationCount={filteredStations.length}
      />

      {/* Language Selection Modal at start / when triggered */}
      <LanguageModal />

      {/* Main Observatory Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 space-y-6">
        {/* Search & Location Hotspots */}
        <div className="rounded-lg shadow-xs relative z-30 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <SearchFilter
            stations={TRIPURA_STATIONS}
            selectedStation={selectedStation}
            onSelectStation={(st) => {
              setSelectedStation(st);
              if (selectedDistrict !== 'ALL' && st.district !== selectedDistrict) {
                setSelectedDistrict('ALL');
              }
            }}
            droppedPin={droppedPin}
            onClearPin={() => setDroppedPin(null)}
          />
        </div>

        {/* Dual-Pane Core: HydroMap & Station Telemetry Dossier */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative z-10">
          {/* Map Column */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-xs h-[480px] sm:h-[540px] flex flex-col">
            <div className="px-3.5 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 bg-slate-50/70 dark:bg-slate-850">
              <span className="font-mono font-medium flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                {t.spatialView}
              </span>
              <span className="font-mono text-[11px] text-slate-400">
                {t.clickToDropPin}
              </span>
            </div>
            <div className="flex-1 relative">
              <HydroMap
                stations={filteredStations}
                selectedStation={selectedStation}
                onSelectStation={setSelectedStation}
                droppedPin={droppedPin}
                onDropPin={handleDropPin}
                selectedDistrict={selectedDistrict}
              />
            </div>
          </div>

          {/* Dossier Column */}
          <div className="lg:col-span-5 space-y-6">
            <StationDossier station={selectedStation} />
          </div>
        </div>

        {/* Pre-Drilling Technical Advisory & Contractor Interrogation */}
        <PreDrillingAdvisory station={selectedStation} />

        {/* Regional District Comparison - only shown when a town is selected */}
        {selectedStation && (
          <RegionalComparison
            stations={TRIPURA_STATIONS}
            currentStation={selectedStation}
            onSelectStation={setSelectedStation}
          />
        )}
      </main>

      {/* Institutional Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <div className="font-semibold text-slate-700 dark:text-slate-300">
              {t.footerTitle}
            </div>
            <div className="text-[11px]">
              {t.footerAttribution}
            </div>
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span>{t.datumWgs}</span>
            <span>•</span>
            <span>{t.telemetryWells}</span>
            <span>•</span>
            <span>{t.districtsCount}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function App() {
  return (
    <LanguageProvider>
      <ObservatoryDashboard />
    </LanguageProvider>
  );
}

export default App;
