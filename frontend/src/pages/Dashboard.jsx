// src/pages/Dashboard.jsx
import React, { useEffect, useMemo, useState } from 'react';
import AlertCard from '../components/AlertCard.jsx';
import SensorStatus from '../components/SensorStatus.jsx';
import StatCard from '../components/StatCard.jsx';
import { getAlerts, normalizeAlert } from '../api/alerts.js';

function formatTime(ts) {
  if (!ts) return 'N/A';
  return new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
}

export default function Dashboard() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function fetchAlerts() {
      try {
        setLoading(true);
        setError('');
        const response = await getAlerts();
        if (!isMounted) return;
        setAlerts((response.data || []).map(normalizeAlert));
      } catch (err) {
        if (!isMounted) return;
        setError(err?.response?.data?.message || 'Failed to fetch dashboard alerts');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchAlerts();
    return () => {
      isMounted = false;
    };
  }, []);

  const latestAlert = useMemo(() => alerts.find((a) => a.detected), [alerts]);
  const latestCamera = useMemo(() => alerts[0] || null, [alerts]);

  const sensors = useMemo(() => {
    const sensorMap = new Map();

    alerts.forEach((alert) => {
      if (sensorMap.has(alert.sensor)) return;
      sensorMap.set(alert.sensor, {
        id: alert.sensor,
        location: alert.location,
        status: alert.detected ? 'active' : 'idle',
        batteryLevel: 100,
        lastPing: formatTime(alert.timestamp),
      });
    });

    return Array.from(sensorMap.values());
  }, [alerts]);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const alertsToday = alerts.filter((a) => new Date(a.timestamp) >= todayStart).length;
  const detectionAccuracy = alerts.length
    ? `${((alerts.filter((a) => a.detected).length / alerts.length) * 100).toFixed(1)}%`
    : 'N/A';

  const systemHealth = {
    uptime: 'Online',
    apiLatency: 'Live',
    lastUpdate: new Date(),
  };

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Railway Track Monitoring</h2>
        <p className="text-sm text-gray-500 mt-1">Real-time overview of all detection systems and sensor telemetry</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        <StatCard
          label="Alerts Today"
          value={alertsToday}
          sub="Active incidents"
          accentColor="red"
          trend={+2}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
        />
        <StatCard
          label="Total Alerts"
          value={alerts.length}
          sub="All-time records"
          accentColor="blue"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        />
        <StatCard
          label="Accuracy"
          value={detectionAccuracy}
          sub="Model confidence"
          accentColor="green"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="System Uptime"
          value={systemHealth.uptime}
          sub={`Latency: ${systemHealth.apiLatency}`}
          accentColor="gray"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          }
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left: Active Alert + System Health */}
        <div className="col-span-8 flex flex-col gap-6">
          {/* Latest Alert */}
          {latestAlert && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-sm font-semibold text-gray-900">Latest Alert</h3>
                <span className="text-xs text-red-500 font-medium bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">Live</span>
              </div>
              <AlertCard alert={latestAlert} priority={true} />
            </div>
          )}
          {!loading && !latestAlert && !error && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 text-sm text-gray-500">
              No active alerts from backend.
            </div>
          )}
          {loading && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 text-sm text-gray-500">
              Loading dashboard alerts from backend...
            </div>
          )}
          {error && (
            <div className="bg-red-50 rounded-2xl border border-red-100 px-5 py-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Latest Camera + System Health side by side */}
          <div className="grid grid-cols-2 gap-6">
            {/* Latest Camera Feed */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Verified Image</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{latestCamera?.location || 'No location yet'}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                  latestCamera?.detected
                    ? 'bg-red-50 text-red-600 border border-red-100'
                    : 'bg-green-50 text-green-600 border border-green-100'
                }`}>
                  {latestCamera?.detected ? 'Animal' : 'No Animal'}
                </span>
              </div>
              <div className="w-full h-48 bg-gray-100">
                {latestCamera ? (
                  <img
                    src={latestCamera.image}
                    alt="Latest camera feed"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
                    Waiting for first detection image
                  </div>
                )}
              </div>
              <div className="px-5 py-3 flex items-center justify-between">
                <span className="text-xs text-gray-400">Camera {latestCamera?.sensor || 'N/A'}</span>
                <span className="text-xs text-gray-400">
                  {formatTime(latestCamera?.timestamp)}
                </span>
              </div>
            </div>

            {/* System Health */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-5">System Health</h3>
              <div className="space-y-4">
                {[
                  {
                    label: 'Backend Connection',
                    value: error ? 'Disconnected' : 'Connected',
                    ok: !error,
                  },
                  { label: 'API Latency', value: systemHealth.apiLatency, ok: true },
                  { label: 'Last Sync', value: formatTime(systemHealth.lastUpdate), ok: true },
                  { label: 'System Uptime', value: systemHealth.uptime, ok: true },
                  {
                    label: 'Cameras Online',
                    value: `${sensors.length}/${sensors.length}`,
                    ok: sensors.length > 0,
                  },
                  {
                    label: 'Sensors Active',
                    value: `${sensors.filter(s => s.status === 'active').length}/${sensors.length || 0}`,
                    ok: sensors.length > 0,
                  },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between py-1">
                    <span className="text-xs text-gray-500">{row.label}</span>
                    <span className={`text-xs font-semibold flex items-center gap-1.5 ${row.ok ? 'text-green-600' : 'text-red-600'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${row.ok ? 'bg-green-500' : 'bg-red-500'}`} />
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Sensor Status */}
        <div className="col-span-4">
          <SensorStatus sensors={sensors} />
        </div>
      </div>
    </div>
  );
}
