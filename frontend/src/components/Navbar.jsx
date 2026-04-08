// src/components/Navbar.jsx
import React, { useState } from 'react';

export default function Navbar({ pageTitle, systemStatus }) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="fixed top-0 right-0 left-60 h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 z-20">
      {/* Page title */}
      <div>
        <h1 className="text-base font-semibold text-gray-900 tracking-tight">{pageTitle}</h1>
        <p className="text-xs text-gray-400 font-medium mt-0.5">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-4">
        {/* System Status badge */}
        <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border ${
          systemStatus === 'active'
            ? 'bg-green-50 border-green-200 text-green-700'
            : 'bg-amber-50 border-amber-200 text-amber-700'
        }`}>
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              systemStatus === 'active' ? 'bg-green-400' : 'bg-amber-400'
            }`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${
              systemStatus === 'active' ? 'bg-green-500' : 'bg-amber-500'
            }`}></span>
          </span>
          {systemStatus === 'active' ? 'Active – Monitoring' : 'Standby Mode'}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-100" />

        {/* Notification Bell */}
        <div className="relative">
          <button
            id="btn-notifications"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 animate-fade-in z-50">
              <div className="px-3 py-2 border-b border-gray-100 mb-1">
                <p className="font-semibold text-sm text-gray-900">Recent Alerts</p>
              </div>
              {[
                { label: 'Animal on Track – Km 42.3', time: '2 min ago', type: 'danger' },
                { label: 'Animal on Track – Km 55.1', time: '19 min ago', type: 'danger' },
                { label: 'Track Clear – Km 42.3', time: '37 min ago', type: 'success' },
              ].map((n, i) => (
                <div key={i} className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                  <span className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${n.type === 'danger' ? 'bg-red-500' : 'bg-green-500'}`} />
                  <div>
                    <p className="text-sm text-gray-800 font-medium leading-tight">{n.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className="flex items-center gap-2.5 pl-1 cursor-pointer group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm shadow-sm group-hover:shadow-md transition-shadow">
            OP
          </div>
          <div className="hidden xl:block">
            <p className="text-sm font-semibold text-gray-900 leading-tight">Operator</p>
            <p className="text-xs text-gray-400">Control Room</p>
          </div>
        </div>
      </div>
    </header>
  );
}
