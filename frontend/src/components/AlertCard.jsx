// src/components/AlertCard.jsx
import React from 'react';

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}
function formatDate(ts) {
  return new Date(ts).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function AlertCard({ alert, priority = false }) {
  const { detected, timestamp, image, confidence, sensor, location, action } = alert;

  if (!detected) return null; // Only show active alerts

  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden animate-fade-in transition-shadow hover:shadow-md ${
      priority ? 'border-red-200 alert-pulse' : 'border-red-100'
    }`}>
      {/* Header bar */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-red-50 border-b border-red-100">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
          <span className="text-xs font-bold text-red-700 uppercase tracking-widest">
            {priority ? '⚠ HIGH PRIORITY – Animal Detected' : 'Animal Detected'}
          </span>
        </div>
        <span className="text-xs font-medium text-red-400">{sensor}</span>
      </div>

      <div className="flex gap-4 p-5">
        {/* Image thumbnail */}
        <div className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
          <img
            src={image}
            alt="Detection snapshot"
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/96x96?text=No+Image'; }}
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-gray-900 text-sm leading-tight">Animal on Track</p>
              <p className="text-xs text-gray-500 mt-0.5 truncate">{location}</p>
            </div>
            <span className="flex-shrink-0 text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-lg border border-red-100">
              {(confidence * 100).toFixed(0)}% conf
            </span>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatDate(timestamp)} · {formatTime(timestamp)}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-amber-600 font-medium">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {action}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
