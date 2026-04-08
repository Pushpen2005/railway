// src/pages/HistoryLogs.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { getAlertHistory, normalizeAlert } from '../api/alerts.js';

const colHeader = 'px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider';

export default function HistoryLogs() {
  const [sort, setSort] = useState('newest');
  const [search, setSearch] = useState('');
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function fetchHistory() {
      try {
        setLoading(true);
        setError('');
        const response = await getAlertHistory();
        if (!isMounted) return;
        setAlerts((response.data || []).map(normalizeAlert));
      } catch (err) {
        if (!isMounted) return;
        setError(err?.response?.data?.message || 'Failed to fetch alert history');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchHistory();
    return () => {
      isMounted = false;
    };
  }, []);

  const sorted = useMemo(() => [...alerts]
    .filter(a =>
      a.location?.toLowerCase().includes(search.toLowerCase()) ||
      a.sensor?.toLowerCase().includes(search.toLowerCase()) ||
      a.action?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === 'newest') return new Date(b.timestamp) - new Date(a.timestamp);
      if (sort === 'oldest') return new Date(a.timestamp) - new Date(b.timestamp);
      if (sort === 'confidence') return b.confidence - a.confidence;
      return 0;
    }), [alerts, search, sort]);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">History Logs</h2>
          <p className="text-sm text-gray-500 mt-1">Complete detection event history with sensor data</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              id="search-logs"
              type="text"
              placeholder="Search logs…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300 w-56 transition-all"
            />
          </div>
          {/* Sort */}
          <select
            id="sort-logs"
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-200 bg-white cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="confidence">Confidence</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading && (
          <div className="px-5 py-4 text-sm text-gray-500 border-b border-gray-100 bg-gray-50/60">Loading logs from backend...</div>
        )}
        {error && (
          <div className="px-5 py-4 text-sm text-red-600 border-b border-red-100 bg-red-50">{error}</div>
        )}
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60">
              <th className={colHeader}>#</th>
              <th className={colHeader}>Time</th>
              <th className={colHeader}>Detection Result</th>
              <th className={colHeader}>Location</th>
              <th className={colHeader}>Sensor Data</th>
              <th className={colHeader}>Confidence</th>
              <th className={colHeader}>Action Taken</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sorted.map((alert, idx) => (
              <tr key={alert.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-5 py-4 text-xs text-gray-400 font-mono w-10">{idx + 1}</td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <p className="text-sm font-medium text-gray-800">
                    {new Date(alert.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(alert.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border ${
                    alert.detected
                      ? 'text-red-600 bg-red-50 border-red-100'
                      : 'text-green-600 bg-green-50 border-green-100'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${alert.detected ? 'bg-red-500' : 'bg-green-500'}`} />
                    {alert.detected ? 'Animal Detected' : 'Track Clear'}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-gray-600 max-w-[200px] truncate">
                  {alert.location}
                </td>
                <td className="px-5 py-4">
                  <span className="text-xs font-mono text-gray-500 bg-gray-50 border border-gray-100 px-2 py-1 rounded">
                    {alert.sensor}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${alert.detected ? 'bg-red-500' : 'bg-green-500'}`}
                        style={{ width: `${(alert.confidence * 100).toFixed(0)}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-gray-600">{(alert.confidence * 100).toFixed(0)}%</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className={`text-xs font-medium ${
                    alert.action === 'Emergency Stop' ? 'text-red-600' :
                    alert.action === 'Signal Triggered' ? 'text-amber-600' :
                    alert.action === 'Alert Sent' ? 'text-blue-600' :
                    'text-green-600'
                  }`}>
                    {alert.action}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sorted.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <svg className="w-10 h-10 mx-auto mb-3 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm font-medium">No matching records</p>
          </div>
        )}

        {/* Table footer */}
        <div className="px-5 py-3.5 border-t border-gray-100 bg-gray-50/60 flex items-center justify-between">
          <p className="text-xs text-gray-400">Showing {sorted.length} of {alerts.length} records</p>
          <p className="text-xs text-gray-400">RailGuard AI · Detection Log</p>
        </div>
      </div>
    </div>
  );
}
