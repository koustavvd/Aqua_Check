import React from 'react';
import { MapPin, Crosshair, Printer, Droplets, Languages } from 'lucide-react';
import { DISTRICTS } from '../data/tripuraData';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  selectedDistrict: string;
  onSelectDistrict: (district: string) => void;
  onLocateGps: () => void;
  isLocating: boolean;
  onPrintReport: () => void;
  stationCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedDistrict,
  onSelectDistrict,
  onLocateGps,
  isLocating,
  onPrintReport,
  stationCount,
}) => {
  const { language, setLanguage, openLanguageModal, t, getDistrictName } = useLanguage();

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 backdrop-blur transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Left: Branding & Attribution */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800/80 flex items-center justify-center text-sky-700 dark:text-sky-400 shrink-0">
            <Droplets className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                {t.govTripura}
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {t.stationsCount(stationCount)}
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight truncate">
              {t.appTitle}
            </h1>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Language Switcher (English / বাংলা / हिन्दी) */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-md border border-slate-200 dark:border-slate-700 shadow-2xs">
            <button
              type="button"
              onClick={openLanguageModal}
              title={t.chooseLanguage}
              className="p-1 text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition"
              aria-label={t.chooseLanguage}
            >
              <Languages className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded text-xs font-semibold transition ${
                language === 'en'
                  ? 'bg-white dark:bg-slate-700 text-sky-700 dark:text-sky-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="Switch to English"
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLanguage('bn')}
              className={`px-2 py-1 rounded text-xs font-semibold transition ${
                language === 'bn'
                  ? 'bg-white dark:bg-slate-700 text-sky-700 dark:text-sky-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="বাংলায় দেখুন"
            >
              বাংলা
            </button>
            <button
              type="button"
              onClick={() => setLanguage('hi')}
              className={`px-2 py-1 rounded text-xs font-semibold transition ${
                language === 'hi'
                  ? 'bg-white dark:bg-slate-700 text-sky-700 dark:text-sky-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="हिन्दी में देखें"
            >
              हिन्दी
            </button>
          </div>

          {/* District Dropdown */}
          <div className="relative">
            <label htmlFor="district-select" className="sr-only">{t.selectDistrict}</label>
            <div className="flex items-center bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-md px-2.5 py-1.5 focus-within:ring-2 focus-within:ring-sky-500/30 focus-within:border-sky-600 transition">
              <MapPin className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 mr-1.5 shrink-0" />
              <select
                id="district-select"
                value={selectedDistrict}
                onChange={(e) => onSelectDistrict(e.target.value)}
                className="bg-transparent text-xs font-medium text-slate-800 dark:text-slate-200 outline-none cursor-pointer pr-1"
              >
                {DISTRICTS.map((district) => (
                  <option key={district} value={district} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                    {getDistrictName(district)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* GPS Locate Button */}
          <button
            type="button"
            onClick={onLocateGps}
            disabled={isLocating}
            title={t.gpsLocate}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition"
          >
            <Crosshair className={`w-3.5 h-3.5 text-sky-600 dark:text-sky-400 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? t.acquiringGps : t.gpsLocate}</span>
          </button>

          {/* Print/Export */}
          <button
            type="button"
            onClick={onPrintReport}
            title={t.printReport}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>{t.printReport}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
