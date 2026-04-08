// src/components/StatCard.jsx
import React from 'react';

export default function StatCard({ label, value, sub, icon, accentColor = 'blue', trend }) {
  const colorMap = {
    red:   { bg: 'bg-red-50',   ring: 'ring-red-100',   text: 'text-red-500',   val: 'text-red-600' },
    green: { bg: 'bg-green-50', ring: 'ring-green-100', text: 'text-green-500', val: 'text-green-600' },
    blue:  { bg: 'bg-blue-50',  ring: 'ring-blue-100',  text: 'text-blue-500',  val: 'text-blue-600' },
    amber: { bg: 'bg-amber-50', ring: 'ring-amber-100', text: 'text-amber-500', val: 'text-amber-600' },
    gray:  { bg: 'bg-gray-50',  ring: 'ring-gray-100',  text: 'text-gray-500',  val: 'text-gray-700' },
  };
  const c = colorMap[accentColor] || colorMap.blue;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-start gap-4 hover:shadow-md transition-shadow animate-fade-in">
      <div className={`w-11 h-11 rounded-xl ${c.bg} ring-1 ${c.ring} flex items-center justify-center flex-shrink-0`}>
        <span className={c.text}>{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{label}</p>
        <p className={`text-2xl font-bold mt-1 ${c.val}`}>{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-1 truncate">{sub}</p>}
      </div>
      {trend && (
        <div className={`flex-shrink-0 text-xs font-semibold px-2 py-1 rounded-lg ${
          trend > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
        }`}>
          {trend > 0 ? `+${trend}` : trend}
        </div>
      )}
    </div>
  );
}
