// src/pages/CameraFeed.jsx
import React, { useEffect, useMemo, useState } from 'react';
import CameraCard from '../components/CameraCard.jsx';
import Modal from '../components/Modal.jsx';
import { getAlerts, normalizeAlert } from '../api/alerts.js';

export default function CameraFeed() {
  const [selectedFeed, setSelectedFeed] = useState(null);
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
        setError(err?.response?.data?.message || 'Failed to fetch camera feeds');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchAlerts();
    return () => {
      isMounted = false;
    };
  }, []);

  const cameraFeeds = useMemo(() => {
    const latestBySensor = new Map();

    alerts.forEach((alert, index) => {
      const sensorId = alert.sensor || `CAM-${index + 1}`;
      if (latestBySensor.has(sensorId)) return;

      latestBySensor.set(sensorId, {
        id: sensorId,
        location: alert.location,
        image: alert.image,
        detected: alert.detected,
        confidence: alert.confidence,
        lastUpdated: alert.timestamp,
      });
    });

    return Array.from(latestBySensor.values());
  }, [alerts]);

  const detections = cameraFeeds.filter(f => f.detected).length;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Camera Feed</h2>
          <p className="text-sm text-gray-500 mt-1">Live imagery from all track-mounted cameras</p>
        </div>
        {/* Status summary */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-3.5 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            {cameraFeeds.length - detections} Clear
          </div>
          {detections > 0 && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-3.5 py-1.5 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              {detections} Detection{detections > 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* Camera grid */}
      {loading && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 text-sm text-gray-500 mb-4">
          Loading camera feeds from backend...
        </div>
      )}
      {error && (
        <div className="bg-red-50 rounded-2xl border border-red-100 px-5 py-4 text-sm text-red-600 mb-4">
          {error}
        </div>
      )}
      <div className="grid grid-cols-2 gap-6">
        {cameraFeeds.map((feed) => (
          <CameraCard
            key={feed.id}
            feed={feed}
            onClick={setSelectedFeed}
          />
        ))}
      </div>

      {/* Empty state */}
      {!loading && cameraFeeds.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <svg className="w-12 h-12 mb-4 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <p className="text-sm font-medium">No camera feeds available</p>
        </div>
      )}

      {/* Modal */}
      {selectedFeed && (
        <Modal feed={selectedFeed} onClose={() => setSelectedFeed(null)} />
      )}
    </div>
  );
}
