import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function TravelErrorState({ message, onRetry }) {
  return (
    <div className="bg-rose-50 rounded-3xl p-8 text-center border border-rose-200 space-y-4 max-w-xl mx-auto shadow-md">
      <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
        <AlertCircle className="w-6 h-6" />
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-bold text-rose-900">
          Travel Search Notice
        </h3>
        <p className="text-xs text-rose-700">
          {message || 'Unable to retrieve live transportation options for this query.'}
        </p>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Search Again</span>
        </button>
      )}
    </div>
  );
}
