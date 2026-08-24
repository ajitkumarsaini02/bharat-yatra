import React, { useState, useEffect } from 'react';
import { Train, Plane, Bus, Car, Compass, CheckCircle } from 'lucide-react';
import { api } from '../services/api';

export default function TransportGuide() {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransport = async () => {
      setLoading(true);
      const res = await api.getTransportGuide();
      if (res.data) {
        setGuides(res.data);
      }
      setLoading(false);
    };
    fetchTransport();
  }, []);

  const getModeIcon = (iconName) => {
    switch (iconName) {
      case 'Train': return <Train className="w-6 h-6 text-rose-600" />;
      case 'Plane': return <Plane className="w-6 h-6 text-blue-600" />;
      case 'Bus': return <Bus className="w-6 h-6 text-amber-600" />;
      case 'Car': return <Car className="w-6 h-6 text-emerald-600" />;
      default: return <Compass className="w-6 h-6 text-indigo-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-5xl font-black text-[#0A192F] dark:text-white tracking-tight">
          Comprehensive Transport Guide
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
          Everything you need to know about booking Indian Railways, Vande Bharat Express, domestic aviation, mountain buses, and last-mile electric rickshaws.
        </p>
      </div>

      {/* Guide Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {guides.map((item, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-amber-900/10 dark:border-slate-800 shadow-lg space-y-6 flex flex-col justify-between">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-50/70 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 flex items-center justify-center shadow-xs">
                  {getModeIcon(item.icon)}
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-500/30">
                  {item.badge}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#0A192F] dark:text-slate-100">{item.title}</h3>
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400">{item.mode}</span>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Train Classes if available */}
              {item.classes && (
                <div className="space-y-2 pt-2 border-t border-amber-100 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider block">Railway Coach Categories:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {item.classes.map((c, i) => (
                      <div key={i} className="p-2.5 bg-amber-50/40 dark:bg-slate-800 rounded-xl border border-amber-100 dark:border-slate-700">
                        <strong className="text-[#0A192F] dark:text-slate-100 block">{c.name}</strong>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">{c.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tips Checklist */}
              {item.tips && (
                <div className="space-y-2 pt-2 border-t border-amber-100 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider block">Essential Travel Tips:</span>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    {item.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
