import React, { useState } from 'react';
import { 
  Layers, 
  TrendingDown, 
  TrendingUp, 
  Copy, 
  Check, 
  FileText, 
  MapPin,
  Droplets,
  ArrowDown
} from 'lucide-react';
import { HydroStation } from '../types';
import { getStationRiskCategory, calculateWellDepth } from '../data/tripuraData';
import { VulnerabilitySpeedometer } from './VulnerabilitySpeedometer';
import { useLanguage } from '../context/LanguageContext';

interface StationDossierProps {
  station: HydroStation | null;
}

export const StationDossier: React.FC<StationDossierProps> = ({ station }) => {
  const { t, formatNum, getDistrictName, language } = useLanguage();
  const [copiedPin, setCopiedPin] = useState(false);

  if (!station) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 sm:p-8 text-center transition-colors shadow-xs">
        <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400">
          <Droplets className="w-7 h-7 stroke-[1.8]" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
          {t.noTownSelectedTitle}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed mb-6">
          {t.noTownSelectedDesc}
        </p>

        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/70 rounded-lg p-4 text-left space-y-2.5 max-w-md mx-auto text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 font-mono font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
            <span>{t.howToSelectHint1}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 font-mono font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
            <span>{t.howToSelectHint2}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 font-mono font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
            <span>{t.howToSelectHint3}</span>
          </div>
        </div>
      </div>
    );
  }

  const riskInfo = getStationRiskCategory(station.risk);
  const isDeclining = station.trend_fall > 0;
  const isPiezometer = station.type === 'PZ';

  // Well depth calculation: water level + 3.5m + 0.8m
  const wellDepth = calculateWellDepth(station.pre_depth);

  const copyPinCode = () => {
    navigator.clipboard.writeText(station.pincode);
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2000);
  };

  // Subsurface cross-section visualization calculations
  const maxDepthVisual = Math.max(30, Math.ceil((wellDepth + 6) / 5) * 5);
  const waterLevelPercent = Math.min(80, Math.max(15, (station.pre_depth / maxDepthVisual) * 100));

  const localizedRiskDesc = (language === 'bn' || language === 'hi')
    ? (riskInfo.tier === 'low' ? t.vulnerabilityLowDesc : riskInfo.tier === 'moderate' ? t.vulnerabilityModDesc : t.vulnerabilityHighDesc)
    : riskInfo.desc;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 sm:p-6 transition-colors shadow-xs space-y-5">
      {/* Dossier Header */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {t.stationIdPrefix}{formatNum(station.id)}
            </span>
            <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800/60">
              {isPiezometer ? t.piezometerDeep : t.dugWellShallow}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
            <span>{station.lat.toFixed(4)}° N, {station.lng.toFixed(4)}° E</span>
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2 tracking-tight">
          {station.location}
        </h2>
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
          <span>{station.village}</span>
          <span>•</span>
          <span>{station.block} {t.blockSuffix}</span>
          <span>•</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">{getDistrictName(station.district)} {t.districtSuffix}</span>
        </div>
      </div>

      {/* Paired Water Level & Well Depth */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Water Level */}
        <div className="p-3.5 rounded-lg bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/60 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono uppercase tracking-wider text-sky-800 dark:text-sky-300 font-semibold flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              {t.waterLevel}
            </div>
            <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-200">
              {t.staticHead}
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-slate-100">
              {formatNum(station.pre_depth)}
            </span>
            <span className="text-sm font-semibold font-mono text-sky-700 dark:text-sky-400">
              {t.meters}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {t.preMonsoonSub}
          </div>
        </div>

        {/* Well Depth */}
        <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5">
              <ArrowDown className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              {t.wellDepth}
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              {t.wellDepthFormulaBadge}
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-700 dark:text-emerald-400">
              {formatNum(wellDepth)}
            </span>
            <span className="text-sm font-semibold font-mono text-slate-600 dark:text-slate-300">
              {t.meters}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
            {t.wellDepthFormulaDesc(station.pre_depth)}
          </div>
        </div>
      </div>

      {/* Speedometer Vulnerability Gauge */}
      <VulnerabilitySpeedometer score={riskInfo.score} showLegend={true} />

      {/* Secondary Telemetry: Annual Trend & Postal Code */}
      <div className="grid grid-cols-2 gap-3">
        {/* Trend */}
        <div className="p-3 rounded-md bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {t.annualTrend}
          </div>
          <div className={`text-lg font-bold font-mono mt-1 flex items-center gap-1 ${
            isDeclining ? 'text-amber-700 dark:text-amber-400' : 'text-emerald-700 dark:text-emerald-400'
          }`}>
            {isDeclining ? (
              <>
                <TrendingDown className="w-4 h-4" />
                <span>-{formatNum(station.trend_fall)}</span>
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4" />
                <span>+{formatNum(station.trend_rise)}</span>
              </>
            )}
            <span className="text-xs font-normal text-slate-500">m/yr</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {isDeclining ? t.drawdownDecline : t.monsoonRecharge}
          </div>
        </div>

        {/* Postal Index & PO */}
        <div className="p-3 rounded-md bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {t.pincodeLabel}
          </div>
          <div className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100 mt-1 flex items-center justify-between">
            <span>{station.pincode}</span>
            <button
              type="button"
              onClick={copyPinCode}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              title={t.copyPincode}
            >
              {copiedPin ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <div className="text-[10px] text-slate-500 truncate mt-0.5" title={station.post_office}>
            {station.post_office}
          </div>
        </div>
      </div>

      {/* Subsurface Stratigraphic Cross-Section Profile */}
      <div className="p-4 rounded-md bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            {t.subsurfaceTitle}
          </span>
          <span className="text-[11px] font-mono text-slate-500">
            {t.formation}: <strong className="text-slate-700 dark:text-slate-300">{station.terrain}</strong>
          </span>
        </div>

        {/* Cross-section bar */}
        <div className="relative w-full h-10 rounded bg-amber-100/60 dark:bg-amber-950/30 border border-amber-300/60 dark:border-amber-900/60 overflow-hidden flex">
          {/* Vadose Zone (Dry / Aerated topsoil) */}
          <div
            style={{ width: `${waterLevelPercent}%` }}
            className="h-full bg-amber-100/80 dark:bg-amber-900/30 border-r-2 border-dashed border-sky-600 flex items-center justify-center relative group"
          >
            <span className="text-[10px] font-mono text-amber-900 dark:text-amber-200 px-1 truncate">
              {t.vadoseZone(station.pre_depth)}
            </span>
          </div>

          {/* Saturated Aquifer Zone */}
          <div
            style={{ width: `${100 - waterLevelPercent}%` }}
            className="h-full bg-sky-200/80 dark:bg-sky-900/50 flex items-center justify-center relative"
          >
            <span className="text-[10px] font-mono text-sky-900 dark:text-sky-200 px-1 truncate">
              {t.saturatedAquifer}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mt-1.5 px-0.5">
          <span>{t.groundLevelZero}</span>
          <span className="text-sky-700 dark:text-sky-400 font-bold">
            {t.markerWaterLevel(station.pre_depth)}
          </span>
          <span className="text-emerald-700 dark:text-emerald-400 font-bold">
            {t.markerWellDepth(wellDepth)}
          </span>
        </div>
      </div>

      {/* Field Notes & Lithological Details */}
      <div className="p-3.5 rounded-md bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
        <FileText className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div>
            <strong className="text-slate-900 dark:text-slate-100">{t.lithologyHorizon}</strong>
            {station.terrain}
          </div>
          <div>
            <strong className="text-slate-900 dark:text-slate-100">{t.cgwbObserverNote}</strong>
            {station.note}
          </div>
          <div className="text-[11px] text-slate-500 pt-0.5">
            {localizedRiskDesc}
          </div>
        </div>
      </div>
    </div>
  );
};
