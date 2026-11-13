import React from 'react';
import { ShieldCheck, Clock, AlertTriangle, Users } from 'lucide-react';

/**
 * Reusable Availability Badge component
 */
export default function AvailabilityBadge({ availability, status }) {
  const text = availability || status || 'Available';
  const clean = text.toLowerCase();

  let bgClass = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  let Icon = ShieldCheck;

  if (clean.includes('wl') || clean.includes('waiting') || clean.includes('limited')) {
    bgClass = 'bg-amber-50 text-amber-900 border-amber-200';
    Icon = Clock;
  } else if (clean.includes('unavailable') || clean.includes('cancelled') || clean.includes('full')) {
    bgClass = 'bg-slate-100 text-slate-700 border-slate-300';
    Icon = AlertTriangle;
  } else if (clean.includes('seat') || clean.includes('available')) {
    bgClass = 'bg-[#EAF4FA] text-[#123B5D] border-[#123B5D]/20';
    Icon = Users;
  }

  return (
    <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border inline-flex items-center gap-1 ${bgClass}`}>
      <Icon className="w-3 h-3" />
      <span>{text}</span>
    </span>
  );
}
