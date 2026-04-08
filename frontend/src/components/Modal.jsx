// src/components/Modal.jsx
import React, { useEffect } from 'react';

export default function Modal({ feed, onClose }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!feed) return null;

  const { id, location, image, detected, confidence, lastUpdated } = feed;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-sm"
      onClick={onClose}
      id="modal-overlay"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <p className="font-semibold text-gray-900">{id} – Full View</p>
            <p className="text-xs text-gray-400 mt-0.5">{location}</p>
          </div>
          <button
            id="modal-close"
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Image */}
        <div className="relative w-full h-80 bg-gray-100">
          <img
            src={image.replace('w=600', 'w=900')}
            alt={`Full view ${id}`}
            className="w-full h-full object-cover"
          />
          {/* Detection overlay */}
          <div className={`absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold shadow-sm ${
            detected ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
          }`}>
            <span className={`w-2 h-2 rounded-full ${detected ? 'bg-red-200 animate-pulse' : 'bg-green-200'}`} />
            {detected ? 'Animal Detected' : 'Track Clear'}
          </div>
        </div>

        {/* Details */}
        <div className="px-6 py-4 grid grid-cols-3 gap-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-400 mb-1">Camera ID</p>
            <p className="text-sm font-semibold text-gray-900 font-mono">{id}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Confidence</p>
            <p className={`text-sm font-semibold ${detected ? 'text-red-600' : 'text-green-600'}`}>
              {(confidence * 100).toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Last Updated</p>
            <p className="text-sm font-semibold text-gray-900">
              {new Date(lastUpdated).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
