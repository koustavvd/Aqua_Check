import React, { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../types';
import { Globe, Check, X, Droplets } from 'lucide-react';

interface LanguageOption {
  code: Language;
  label: string;
  nativeLabel: string;
  badge: string;
  description: string;
}

const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    code: 'en',
    label: 'English',
    nativeLabel: 'English',
    badge: 'Institutional Default',
    description: 'Groundwater telemetry, well depth metrics & CGWB observation logs in English.',
  },
  {
    code: 'bn',
    label: 'Bengali',
    nativeLabel: 'বাংলা',
    badge: 'ত্রিপুরা রাজ্য সরকারি ভাষা',
    description: 'ত্রিপুরা ভূগর্ভস্থ জলস্তর, কুয়োর গভীরতা এবং ড্রিলিং পূর্ববর্তী পরামর্শ বাংলায়।',
  },
  {
    code: 'hi',
    label: 'Hindi',
    nativeLabel: 'हिन्दी',
    badge: 'राष्ट्रीय राजभाषा',
    description: 'त्रिपुरा भूजल टेलीमेट्री, कुएं की गहराई एवं बोरिंग-पूर्व तकनीकी मार्गदर्शन हिन्दी में।',
  },
];

export const LanguageModal: React.FC = () => {
  const {
    language,
    setLanguage,
    isLanguageModalOpen,
    closeLanguageModal,
    selectLanguageAndClose,
    t,
  } = useLanguage();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLanguageModalOpen) {
        closeLanguageModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLanguageModalOpen, closeLanguageModal]);

  if (!isLanguageModalOpen) return null;

  return (
    <div
      id="language-selection-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="language-modal-title"
    >
      <div
        id="language-selection-modal"
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden p-6 sm:p-7 space-y-6 animate-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          id="close-language-modal-btn"
          type="button"
          onClick={closeLanguageModal}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title="Close modal"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-3.5 pr-8">
          <div className="w-11 h-11 rounded-lg bg-sky-50 dark:bg-sky-950/70 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-700 dark:text-sky-400 shrink-0">
            <Globe className="w-6 h-6" />
          </div>
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-sky-700 dark:text-sky-400">
                Tripura Hydrogeological Observatory
              </span>
            </div>
            <h2
              id="language-modal-title"
              className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight"
            >
              {t.selectLanguageModalTitle}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.selectLanguageModalSubtitle}
            </p>
          </div>
        </div>

        {/* Language Options Grid */}
        <div className="space-y-2.5">
          {LANGUAGE_OPTIONS.map((opt) => {
            const isSelected = language === opt.code;
            return (
              <div
                key={opt.code}
                id={`lang-card-${opt.code}`}
                onClick={() => setLanguage(opt.code)}
                className={`w-full text-left p-3.5 sm:p-4 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'border-sky-600 dark:border-sky-500 bg-sky-50/70 dark:bg-sky-950/40 ring-1 ring-sky-600 dark:ring-sky-500 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50'
                }`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setLanguage(opt.code);
                  }
                }}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`w-5 h-5 rounded-full border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'border-sky-600 bg-sky-600 text-white dark:border-sky-500 dark:bg-sky-500'
                        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {opt.nativeLabel}
                      </span>
                      {opt.code !== 'en' && (
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          ({opt.label})
                        </span>
                      )}
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {opt.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-snug">
                      {opt.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer / Action */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 text-center sm:text-left">
            {t.selectLanguageModalPrompt}
          </span>
          <button
            id="confirm-language-btn"
            type="button"
            onClick={() => selectLanguageAndClose(language)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-sm transition flex items-center justify-center gap-2"
          >
            <Droplets className="w-4 h-4" />
            <span>{t.continueButton}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
