// src/pages/LiveAlerts.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
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
  const [resolvingId, setResolvingId] = useState('');
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const addToast = (message, type = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3500);
  };

  useEffect(() => {
    let isMounted = true;
    const socket = io(import.meta.env.VITE_API_BASE_URL || 'http://localhost:3005', {
      transports: ['websocket'],
      withCredentials: true,
    });

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

    socket.on('alert:created', (payload) => {
      if (!isMounted) return;
      const incoming = normalizeAlert(payload);
      setAlerts((prev) => {
        const exists = prev.some((a) => a.id === incoming.id);
        if (exists || !incoming.detected) return prev;
        return [incoming, ...prev];
      });
      addToast(`Detection happened at ${incoming.location}`, 'detection');
    });

    socket.on('alert:resolved', (payload) => {
      if (!isMounted) return;
      const resolved = normalizeAlert(payload);
      setAlerts((prev) => prev.filter((a) => a.id !== resolved.id));
      setExpanded((prev) => (prev === resolved.id ? null : prev));
      addToast(`Alert resolved for ${resolved.location}`, 'resolved');
    });

    return () => {
      isMounted = false;
      socket.disconnect();
    };
  }, []);

  async function handleResolve(alertId) {
    try {
      setResolvingId(alertId);
      await updateAlertAction(alertId, 'Resolved by operator');
      setAlerts((prev) => prev.filter((a) => a.id !== alertId));
      setExpanded((prev) => (prev === alertId ? null : prev));
    } catch (err) {
      addToast(err?.response?.data?.message || 'Failed to resolve alert', 'error');
    } finally {
      setResolvingId('');
    }
  }

  const filtered = useMemo(() => {
    if (filter === 'all') return alerts;
    return alerts.filter((a) => a.confidence >= 0.8);
  }, [alerts, filter]);

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
            { key: 'critical', label: 'Critical (>=80%)' },
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
                        {alert.detected ? `${alert.animal} Detected` : 'Track Clear'}
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
                    <button
                      id={`resolve-alert-${alert.id}`}
                      onClick={() => handleResolve(alert.id)}
                      disabled={resolvingId === alert.id}
                      className="h-fit px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white text-xs font-semibold rounded-lg transition-colors"
                    >
                      {resolvingId === alert.id ? 'Resolving...' : 'Resolve'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {!loading && !error && filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 text-sm text-gray-500">
            No active detections right now.
          </div>
        )}
      </div>

      {/* Popup notifications */}
      <div className="fixed top-20 right-6 z-50 space-y-2 w-80">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-xl border px-4 py-3 shadow-md text-sm animate-fade-in ${
              toast.type === 'detection'
                ? 'bg-red-50 border-red-200 text-red-700'
                : toast.type === 'resolved'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : toast.type === 'error'
                ? 'bg-amber-50 border-amber-200 text-amber-700'
                : 'bg-white border-gray-200 text-gray-700'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}
