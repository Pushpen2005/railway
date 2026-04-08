// src/pages/Settings.jsx
import React, { useState } from 'react';

function Toggle({ id, checked, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between py-4">
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
          checked ? 'bg-red-500' : 'bg-gray-200'
        }`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`} />
      </button>
    </div>
  );
}

function SettingsSection({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
      <div className="divide-y divide-gray-100">{children}</div>
    </div>
  );
}

export default function Settings() {
  const [settings, setSettings] = useState({
    realTimeAlerts: true,
    soundAlerts: true,
    emailNotifications: false,
    autoCapture: true,
    nightMode: false,
    highConfidenceOnly: false,
    dataRetention: '30',
    confidenceThreshold: '80',
    location: 'Junction Alpha',
    deviceId: 'RG-UNIT-042',
  });

  const set = (key, val) => setSettings(s => ({ ...s, [key]: val }));

  return (
    <div className="animate-fade-in max-w-2xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Settings</h2>
        <p className="text-sm text-gray-500 mt-1">Configure detection thresholds and system preferences</p>
      </div>

      <SettingsSection title="Notifications">
        <Toggle id="toggle-real-time" label="Real-time Alerts" description="Receive alerts as events are detected" checked={settings.realTimeAlerts} onChange={v => set('realTimeAlerts', v)} />
        <Toggle id="toggle-sound" label="Sound Alerts" description="Play audio for high-priority detections" checked={settings.soundAlerts} onChange={v => set('soundAlerts', v)} />
        <Toggle id="toggle-email" label="Email Notifications" description="Send detection summaries to email" checked={settings.emailNotifications} onChange={v => set('emailNotifications', v)} />
      </SettingsSection>

      <SettingsSection title="Detection">
        <Toggle id="toggle-capture" label="Auto Capture on Detection" description="Automatically save image when animal is detected" checked={settings.autoCapture} onChange={v => set('autoCapture', v)} />
        <Toggle id="toggle-high-conf" label="High Confidence Only" description="Only alert when confidence exceeds threshold" checked={settings.highConfidenceOnly} onChange={v => set('highConfidenceOnly', v)} />
        <div className="py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-gray-900">Confidence Threshold</p>
              <p className="text-xs text-gray-400 mt-0.5">Minimum confidence to trigger an alert</p>
            </div>
            <span className="text-sm font-bold text-red-600">{settings.confidenceThreshold}%</span>
          </div>
          <input
            id="slider-confidence"
            type="range"
            min="50"
            max="99"
            value={settings.confidenceThreshold}
            onChange={e => set('confidenceThreshold', e.target.value)}
            className="w-full accent-red-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>50%</span>
            <span>99%</span>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection title="System">
        <Toggle id="toggle-night" label="Night Vision Mode" description="Enhanced low-light capture settings" checked={settings.nightMode} onChange={v => set('nightMode', v)} />
        <div className="py-4">
          <p className="text-sm font-medium text-gray-900 mb-1">Data Retention</p>
          <p className="text-xs text-gray-400 mb-3">How long to keep detection records</p>
          <select
            id="select-retention"
            value={settings.dataRetention}
            onChange={e => set('dataRetention', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-200 bg-white"
          >
            <option value="7">7 days</option>
            <option value="14">14 days</option>
            <option value="30">30 days</option>
            <option value="90">90 days</option>
          </select>
        </div>
        <div className="py-4">
          <p className="text-sm font-medium text-gray-900 mb-3">Device Info</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Device ID', value: settings.deviceId },
              { label: 'Location', value: settings.location },
              { label: 'Firmware', value: 'v2.4.1' },
              { label: 'Model', value: 'YOLOv8-nano' },
            ].map(item => (
              <div key={item.label} className="bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100">
                <p className="text-xs text-gray-400">{item.label}</p>
                <p className="text-sm font-medium text-gray-800 mt-0.5 font-mono">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </SettingsSection>

      {/* Save button */}
      <button
        id="btn-save-settings"
        className="w-full py-3 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-2xl transition-colors shadow-sm hover:shadow-md"
      >
        Save Settings
      </button>
    </div>
  );
}
