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
    </div>
  );
}
