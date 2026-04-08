// src/App.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Navbar from './components/Navbar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import LiveAlerts from './pages/LiveAlerts.jsx';
import CameraFeed from './pages/CameraFeed.jsx';
import HistoryLogs from './pages/HistoryLogs.jsx';
import Settings from './pages/Settings.jsx';

const pageTitles = {
  dashboard: 'Railway Track Monitoring System',
  alerts: 'Live Detection Alerts',
  camera: 'Camera Feed Monitor',
  history: 'History & Event Logs',
  settings: 'System Settings',
};

// Simulate a "last updated" ticker
function useCurrentTime() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [systemStatus] = useState('active');
  const currentTime = useCurrentTime();

  const PageComponent = {
    dashboard: Dashboard,
    alerts: LiveAlerts,
    camera: CameraFeed,
    history: HistoryLogs,
    settings: Settings,
  }[activePage];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar activePage={activePage} onNavigate={setActivePage} />

      {/* Main area */}
      <div className="ml-60">
        {/* Navbar */}
        <Navbar
          pageTitle={pageTitles[activePage]}
          systemStatus={systemStatus}
          currentTime={currentTime}
        />

        {/* Page content */}
        <main className="pt-16 min-h-screen">
          <div className="px-8 py-8">
            <PageComponent key={activePage} />
          </div>
        </main>
      </div>

      {/* Live update ticker – simulates real-time */}
      <LiveUpdateTicker />
    </div>
  );
}

// Small floating ticker at bottom-right
function LiveUpdateTicker() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 4000);
    return () => clearInterval(id);
  }, []);

  const messages = [
    'All sensors reporting normally',
    'PIR-01 heartbeat received',
    'CAM-01 frame captured',
    'PIR-02 heartbeat received',
    'System health check: OK',
    'CAM-02 frame captured',
    'Model inference: 28ms',
    'PIR-03 heartbeat received',
  ];

  return (
    <div className="fixed bottom-6 right-6 flex items-center gap-2.5 bg-white border border-gray-100 rounded-2xl px-4 py-2.5 shadow-sm z-10">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
      </span>
      <p className="text-xs font-medium text-gray-500 animate-fade-in" key={tick}>
        {messages[tick % messages.length]}
      </p>
    </div>
  );
}
