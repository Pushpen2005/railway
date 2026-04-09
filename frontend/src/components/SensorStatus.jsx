// src/components/SensorStatus.jsx
import React from 'react';

const statusConfig = {
  active: { dot: 'bg-green-500', ping: 'bg-green-400', badge: 'text-green-700 bg-green-50 border-green-200', label: 'Active' },
  idle:   { dot: 'bg-amber-500', ping: 'bg-amber-400', badge: 'text-amber-700 bg-amber-50 border-amber-200', label: 'Idle' },
  offline:{ dot: 'bg-gray-400',  ping: 'bg-gray-300',  badge: 'text-gray-500 bg-gray-50 border-gray-200',   label: 'Offline' },
};

function BatteryBar({ level }) {
  const color = level > 60 ? 'bg-green-500' : level > 30 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${level}%` }} />
      </div>
      <span className="text-xs text-gray-400 w-8 text-right">{level}%</span>
    </div>
  );
}

export default function SensorStatus({ sensors }) {
  const activeCount = sensors.filter(s => s.status === 'active').length;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Sensor Status</h3>
          <p className="text-xs text-gray-400 mt-0.5">Live sensor telemetry</p>
        </div>
        <span className="text-xs font-medium text-gray-400 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg">
          {activeCount}/{sensors.length} Online
        </span>
      </div>

      {sensors.length === 0 && (
        <div className="text-sm text-gray-500 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
          No sensor telemetry available yet.
        </div>
      )}

      <div className="divide-y divide-gray-50">
        {sensors.map((sensor) => {
          const cfg = statusConfig[sensor.status] || statusConfig.offline;
          return (
            <div key={sensor.id} className="py-3.5 first:pt-0 last:pb-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2 w-2">
                    {sensor.status === 'active' && (
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${cfg.ping} opacity-60`}></span>
                    )}
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${cfg.dot}`}></span>
                  </span>
                  <span className="text-sm font-semibold text-gray-900 font-mono">{sensor.id}</span>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${cfg.badge}`}>
                  {cfg.label}
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-2 pl-4.5 ml-0.5">{sensor.location}</p>
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
                <span>Battery</span>
                <span>Ping: {sensor.lastPing}</span>
              </div>
              <BatteryBar level={sensor.batteryLevel} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
