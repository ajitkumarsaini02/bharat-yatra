import React from 'react';
import { Tag, CheckCircle2, HelpCircle, AlertCircle } from 'lucide-react';

/**
 * Reusable FareDisplay component
 * Clearly distinguishes LIVE / PROVIDER DATA vs ESTIMATED vs UNAVAILABLE
 */
export default function FareDisplay({ fare, label, size = 'normal' }) {
  const fareObj = typeof fare === 'object' && fare !== null ? fare : {
    amount: typeof fare === 'number' ? fare : null,
    currency: 'INR',
    type: label === 'LIVE / PROVIDER DATA' ? 'live' : label === 'ESTIMATED' ? 'estimated' : 'unavailable'
  };

  const isLive = fareObj.type === 'live' || label === 'LIVE / PROVIDER DATA';
  const isEstimated = fareObj.type === 'estimated' || label === 'ESTIMATED';
  const isUnavailable = !fareObj.amount || fareObj.type === 'unavailable' || label === 'UNAVAILABLE';

  if (isUnavailable) {
    return (
      <div className="inline-flex flex-col items-start">
        <span className="text-xs font-black text-slate-500 dark:text-slate-400">
          Fare Unavailable
        </span>
        <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-700 mt-0.5 flex items-center gap-1">
          <AlertCircle className="w-2.5 h-2.5" />
          <span>Provider fare not provided</span>
        </span>
      </div>
    );
  }

  const isLarge = size === 'large';

  return (
    <div className="space-y-0.5">
      <div className="flex items-baseline gap-1">
        <span className={`${isLarge ? 'text-2xl' : 'text-lg sm:text-xl'} font-black text-slate-900 dark:text-slate-100 font-mono`}>
          ₹{fareObj.amount.toLocaleString('en-IN')}
        </span>
        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">/ traveler</span>
      </div>

      <div>
        {isLive ? (
          <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60 inline-flex items-center gap-1 shadow-xs">
            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
            <span>LIVE / PROVIDER DATA</span>
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 inline-flex items-center gap-1 shadow-xs">
            <Tag className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400" />
            <span>ESTIMATED</span>
          </span>
        )}
      </div>
    </div>
  );
}
