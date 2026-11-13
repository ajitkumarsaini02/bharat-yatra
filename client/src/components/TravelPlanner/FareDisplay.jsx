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
        <span className="text-xs font-black text-[#718096]">
          Fare Unavailable
        </span>
        <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-[#F7F9FC] text-[#718096] border border-[#E5EAF0] mt-0.5 flex items-center gap-1">
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
        <span className={`${isLarge ? 'text-2xl' : 'text-lg sm:text-xl'} font-black text-[#123B5D] font-mono`}>
          ₹{fareObj.amount.toLocaleString('en-IN')}
        </span>
        <span className="text-[10px] text-[#718096] font-medium">/ traveler</span>
      </div>

      <div>
        {isLive ? (
          <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1 shadow-xs">
            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
            <span>LIVE PROVIDER FARE</span>
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-amber-50 text-amber-900 border border-amber-200 inline-flex items-center gap-1 shadow-xs">
            <Tag className="w-2.5 h-2.5 text-amber-600" />
            <span>{label && label !== 'ESTIMATED' ? label : 'VERIFIED TARIFF FARE'}</span>
          </span>
        )}
      </div>
    </div>
  );
}
