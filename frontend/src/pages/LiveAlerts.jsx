// src/pages/LiveAlerts.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { getActiveAlerts, normalizeAlert, updateAlertAction } from '../api/alerts.js';

function formatTs(ts) {
  const d = new Date(ts);
  return {
    date: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
    time: d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
  };
}

export default function LiveAlerts() {
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState('all');
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [resolvingId, setResolvingId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchLiveAlerts() {
      try {
        setLoading(true);
        setError('');
        const response = await getActiveAlerts();
        if (!isMounted) return;
        setAlerts((response.data || []).map(normalizeAlert));
      } catch (err) {
        if (!isMounted) return;
        setError(err?.response?.data?.message || 'Failed to fetch live alerts');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchLiveAlerts();
    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'all') return alerts;
    if (filter === 'detected') return alerts.filter(a => a.detected);
    return alerts.filter(a => !a.detected);
  }, [alerts, filter]);

  async function handleResolveAlert(id, actionTaken) {
    try {
      setResolvingId(id);
      setError('');
      await updateAlertAction(id, actionTaken);
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
      setExpanded((prev) => (prev === id ? null : prev));
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to resolve alert');
    } finally {
      setResolvingId(null);
    }
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Live Alerts</h2>
          <p className="text-sm text-gray-500 mt-1">All detection events across the track network</p>
        </div>
        {/* Filter tabs */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
          {[
            { key: 'all', label: 'All Events' },
            { key: 'detected', label: 'Detections' },
            { key: 'clear', label: 'Clear' },
          ].map((tab) => (
            <button
              key={tab.key}
              id={`filter-${tab.key}`}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === tab.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts */}
      <div className="space-y-3">
        {loading && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 text-sm text-gray-500">
            Loading live alerts from backend...
          </div>
        )}
        {error && (
          <div className="bg-red-50 rounded-2xl border border-red-100 px-6 py-4 text-sm text-red-600">
            {error}
          </div>
        )}
        {filtered.map((alert) => {
          const { date, time } = formatTs(alert.timestamp);
          const isExpanded = expanded === alert.id;
          return (
            <div
              key={alert.id}
              className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
                alert.detected ? 'border-red-100' : 'border-gray-100'
              }`}
            >
              {/* Main row */}
              <button
                id={`alert-row-${alert.id}`}
                className="w-full flex items-center gap-5 px-6 py-4 text-left hover:bg-gray-50/50 transition-colors"
                onClick={() => setExpanded(isExpanded ? null : alert.id)}
              >
                {/* Thumbnail */}
                <div className="flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
                  <img src={alert.image} alt="Event" className="w-full h-full object-cover" />
                </div>

                {/* Status dot */}
                <div className={`flex-shrink-0 w-2.5 h-2.5 rounded-full ${
                  alert.detected ? 'bg-red-500' : 'bg-green-500'
                }`} />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900">
                      {alert.detected ? 'Animal Detected' : 'Track Clear'}
                    </p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${
                      alert.detected
                        ? 'text-red-600 bg-red-50 border-red-100'
                        : 'text-green-600 bg-green-50 border-green-100'
                    }`}>
                      {alert.detected ? `${(alert.confidence * 100).toFixed(0)}%` : 'Clear'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{alert.location}</p>
                </div>

                {/* Time */}
                <div className="flex-shrink-0 text-right">
                  <p className="text-xs font-medium text-gray-700">{time}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{date}</p>
                </div>

                {/* Sensor */}
                <div className="flex-shrink-0 w-20 text-right">
                  <span className="text-xs font-mono text-gray-500 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded">
                    {alert.sensor}
                  </span>
                </div>

                {/* Expand chevron */}
                <svg
                  className={`flex-shrink-0 w-4 h-4 text-gray-300 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Expanded details */}
              {isExpanded && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 animate-fade-in">
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Full Timestamp</p>
                      <p className="text-sm font-medium text-gray-700">{new Date(alert.timestamp).toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Action Taken</p>
                      <p className="text-sm font-medium text-gray-700">{alert.action}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Confidence Score</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${alert.detected ? 'bg-red-500' : 'bg-green-500'}`}
                            style={{ width: `${(alert.confidence * 100).toFixed(0)}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-gray-600">{(alert.confidence * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <img src={alert.image} alt="Full snapshot" className="w-48 h-32 object-cover rounded-xl border border-gray-200" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 mb-1">Location</p>
                      <p className="text-sm font-medium text-gray-700">{alert.location}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleResolveAlert(alert.id, 'Signal Triggered')}
                      disabled={resolvingId === alert.id}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      Signal Triggered
                    </button>
                    <button
                      type="button"
                      onClick={() => handleResolveAlert(alert.id, 'Alert Sent')}
                      disabled={resolvingId === alert.id}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      Alert Sent
                    </button>
                    <button
                      type="button"
                      onClick={() => handleResolveAlert(alert.id, 'Emergency Stop')}
                      disabled={resolvingId === alert.id}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      Emergency Stop
                    </button>
                    {resolvingId === alert.id && (
                      <span className="text-xs text-gray-500">Resolving...</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
