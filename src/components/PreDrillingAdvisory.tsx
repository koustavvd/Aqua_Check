import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  HelpCircle, 
  Droplet, 
  RefreshCw, 
  Sparkles, 
  FileCheck,
  Wrench,
  Layers,
} from 'lucide-react';
import { HydroStation, AdvisoryResponse } from '../types';
import { calculateWellDepth } from '../data/tripuraData';
import { useLanguage } from '../context/LanguageContext';
import { generateHydrogeologicalAdvisory } from '../utils/advisoryGenerator';

interface PreDrillingAdvisoryProps {
  station: HydroStation | null;
}

export const PreDrillingAdvisory: React.FC<PreDrillingAdvisoryProps> = ({ station }) => {
  const { t, language, formatNum } = useLanguage();
  const [advisory, setAdvisory] = useState<AdvisoryResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch advisory whenever selected station or language changes
  useEffect(() => {
    if (!station) return;

    let isMounted = true;
    async function fetchAdvisory() {
      setLoading(true);
      try {
        const response = await fetch('/api/advisory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ station, lang: language }),
        });

        if (response.ok) {
          const data: AdvisoryResponse = await response.json();
          if (isMounted) {
            setAdvisory(data);
            setLoading(false);
            return;
          }
        }
      } catch {
        // Fallback smoothly without alerting user on static hosts
      }

      // Seamless fallback to deterministic CGWB hydrogeological calculations
      if (isMounted) {
        const localAdvisory = generateHydrogeologicalAdvisory(station, language);
        setAdvisory(localAdvisory);
        setLoading(false);
      }
    }

    fetchAdvisory();

    return () => {
      isMounted = false;
    };
  }, [station?.id, language]);

  const handleRefresh = async () => {
    if (!station) return;
    setLoading(true);
    try {
      const response = await fetch('/api/advisory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ station, lang: language }),
      });
      if (response.ok) {
        const data = await response.json();
        setAdvisory(data);
        setLoading(false);
        return;
      }
    } catch {
      // ignore
    }
    const localAdvisory = generateHydrogeologicalAdvisory(station, language);
    setAdvisory(localAdvisory);
    setLoading(false);
  };

  if (!station) return null;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 sm:p-6 transition-colors shadow-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <FileCheck className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            {t.advisoryHeading}
            {advisory && (
              advisory.isLiveAi ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 ml-2">
                  <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  {t.liveAnalysis}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800/60 ml-2">
                  <ShieldCheck className="w-3 h-3 text-sky-600 dark:text-sky-400" />
                  {t.cgwbEngine}
                </span>
              )
            )}
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">
            {t.preDrillingFor(station.location)}
          </h3>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? t.analyzing : t.reRunAnalysis}</span>
        </button>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-4 animate-pulse">
          <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-3/4"></div>
          <div className="h-16 bg-slate-100 dark:bg-slate-800 rounded"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="h-28 bg-slate-100 dark:bg-slate-800 rounded"></div>
            <div className="h-28 bg-slate-100 dark:bg-slate-800 rounded"></div>
          </div>
          <div className="h-12 bg-slate-100 dark:bg-slate-800 rounded"></div>
        </div>
      )}

      {/* Advisory Content */}
      {advisory && !loading && (
        <div className="space-y-5 text-xs">
          {/* Stratigraphic Formation Analysis */}
          <div className="p-3.5 rounded-md bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80">
            <div className="font-semibold text-slate-900 dark:text-slate-100 mb-1 flex items-center gap-1.5 text-xs">
              <Layers className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              {t.regionalStratigraphy}
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {advisory.formationAnalysis}
            </p>
            <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
              <span className="text-slate-500">
                {t.staticWaterLevel}: <strong className="text-sky-700 dark:text-sky-400 font-bold">{formatNum(station.pre_depth)} {t.meters}</strong>
              </span>
              <span className="text-slate-500">
                {t.calculatedWellDepth}: <strong className="text-emerald-700 dark:text-emerald-400 font-bold">{formatNum(calculateWellDepth(station.pre_depth))} {t.meters}</strong> ({t.wellDepthFormulaBadge})
              </span>
              {advisory.riskAssessment && (
                <span className="text-slate-500">
                  {t.targetAquifer}: <strong className="text-slate-800 dark:text-slate-200 font-bold">{advisory.riskAssessment.recommendedDepth}</strong>
                </span>
              )}
            </div>
          </div>

          {/* Pre-Drilling Technical Specifications */}
          <div>
            <div className="font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-1.5 text-xs">
              <Wrench className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              {t.preDrillingDirectives}
            </div>
            <div className="space-y-2">
              {advisory.preDrillingAdvice.map((item, index) => (
                <div 
                  key={index}
                  className="p-3 rounded-md bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 flex items-start gap-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800/60 flex items-center justify-center font-mono text-[10px] font-bold shrink-0 mt-0.5">
                    {formatNum(index + 1)}
                  </span>
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Contractor Interrogation Checksheet */}
          <div>
            <div className="font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-1.5 text-xs">
              <HelpCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              {t.contractorQuestionsTitle}
            </div>
            <div className="space-y-2">
              {advisory.contractorQuestions.map((q, index) => (
                <div 
                  key={index}
                  className="p-3 rounded-md bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-800/40 flex items-start gap-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 flex items-center justify-center font-mono text-[10px] font-bold shrink-0 mt-0.5">
                    Q{formatNum(index + 1)}
                  </span>
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                    {q}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Water Quality & Dissolved Iron Advice */}
          <div className="p-3 rounded-md bg-sky-50/60 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/50 flex items-start gap-2.5">
            <Droplet className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-sky-900 dark:text-sky-200 text-xs">
                {t.hydrochemistryNote}
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-xs mt-0.5 leading-relaxed">
                {advisory.waterQualityNotes}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
