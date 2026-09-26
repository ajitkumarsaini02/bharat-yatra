import React from 'react';
import { ShieldCheck, Clock, AlertTriangle, Users } from 'lucide-react';

/**
 * Reusable Availability Badge component
 */
export default function AvailabilityBadge({ availability, status }) {
  const text = availability || status || 'Available';
  const clean = text.toLowerCase();

  let bgClass = 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
  let Icon = ShieldCheck;

  if (clean.includes('wl') || clean.includes('waiting') || clean.includes('limited')) {
    bgClass = 'bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    Icon = Clock;
  } else if (clean.includes('unavailable') || clean.includes('cancelled') || clean.includes('full')) {
    bgClass = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700';
    Icon = AlertTriangle;
  } else if (clean.includes('seat') || clean.includes('available')) {
    bgClass = 'bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-800';
    Icon = Users;
  }

  return (
    <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border inline-flex items-center gap-1 ${bgClass}`}>
      <Icon className="w-3 h-3" />
      <span>{text}</span>
    </span>
  );
}
