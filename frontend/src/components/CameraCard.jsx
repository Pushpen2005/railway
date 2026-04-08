// src/components/CameraCard.jsx
import React from 'react';

function timeSince(ts) {
  const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

export default function CameraCard({ feed, onClick }) {
  const { id, location, image, detected, confidence, lastUpdated } = feed;

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer group hover:shadow-md hover:border-gray-200 transition-all duration-200 animate-fade-in"
      onClick={() => onClick(feed)}
      id={`camera-card-${id}`}
    >
      {/* Image */}
      <div className="relative w-full h-44 overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={`Camera ${id}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/400x176?text=No+Feed'; }}
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm">
            View Full
          </div>
        </div>
        {/* Detection badge */}
        <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold shadow-sm ${
          detected ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${detected ? 'bg-red-200 animate-pulse' : 'bg-green-200'}`} />
          {detected ? 'Animal Detected' : 'Track Clear'}
        </div>
        {/* Camera ID badge */}
        <div className="absolute top-3 right-3 bg-gray-900/70 text-white text-xs font-mono font-medium px-2 py-1 rounded-lg">
          {id}
        </div>
      </div>

      {/* Info */}
      <div className="px-4 py-3.5">
        <p className="text-sm font-semibold text-gray-900 truncate">{location}</p>
        <div className="flex items-center justify-between mt-1.5">
          <p className="text-xs text-gray-400">Updated {timeSince(lastUpdated)}</p>
          {detected && (
            <p className="text-xs text-red-500 font-semibold">{(confidence * 100).toFixed(0)}% conf</p>
          )}
        </div>
      </div>
    </div>
  );
}
