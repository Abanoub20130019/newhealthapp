import React, { useState } from 'react';
import { Settings as SettingsIcon, Download, Upload, Moon, Sun, Bell, Database, Target } from 'lucide-react';
import { useApp } from '../hooks/useApp.jsx';

export const Settings = () => {
  const { exportData, importData, settings } = useApp();
  const [darkMode, setDarkMode] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showImport, setShowImport] = useState(false);
  const [importStatus, setImportStatus] = useState('');

  const handleExport = async () => {
    try {
      const data = await exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `solo-health-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const success = await importData(text);
      setImportStatus(success ? '✅ Import successful!' : '❌ Import failed');
      setTimeout(() => setImportStatus(''), 3000);
    } catch (error) {
      setImportStatus('❌ Invalid file format');
      setTimeout(() => setImportStatus(''), 3000);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('light-mode', !darkMode);
  };

  return (
    <div className="settings-view">
      <h1>Settings</h1>

      {/* Appearance */}
      <section className="settings-section">
        <h2>Appearance</h2>
        <div className="setting-item">
          <div className="setting-info">
            {darkMode ? <Moon size={24} /> : <Sun size={24} />}
            <div>
              <h3>Dark Mode</h3>
              <p>Toggle dark/light theme</p>
            </div>
          </div>
          <button 
            className={`toggle-btn ${darkMode ? 'active' : ''}`}
            onClick={toggleDarkMode}
          >
            <span className="toggle-slider"></span>
          </button>
        </div>
      </section>

      {/* Notifications */}
      <section className="settings-section">
        <h2>Notifications</h2>
        <div className="setting-item">
          <div className="setting-info">
            <Bell size={24} />
            <div>
              <h3>Enable Notifications</h3>
              <p>Get reminders for habits and streaks</p>
            </div>
          </div>
          <button 
            className={`toggle-btn ${notificationsEnabled ? 'active' : ''}`}
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
          >
            <span className="toggle-slider"></span>
          </button>
        </div>
        
        {notificationsEnabled && (
          <div className="notification-options">
            <div className="setting-subitem">
              <label>Daily Check-in Reminder</label>
              <input type="time" defaultValue="20:00" />
            </div>
            <div className="setting-subitem">
              <label>Streak Warning Time</label>
              <input type="time" defaultValue="18:00" />
            </div>
          </div>
        )}
      </section>

      {/* Weekly Focus */}
      <section className="settings-section">
        <h2>Weekly Focus</h2>
        <div className="setting-item">
          <div className="setting-info">
            <Target size={24} />
            <div>
              <h3>Select Focus Habit</h3>
              <p>Choose one habit to prioritize this week</p>
            </div>
          </div>
        </div>
        <p className="setting-note">
          Visit the Today tab to set your weekly focus habit
        </p>
      </section>

      {/* Data Management */}
      <section className="settings-section">
        <h2>Data & Privacy</h2>
        <p className="setting-description">
          All your data is stored locally on your device. No accounts, no cloud, no tracking.
        </p>
        
        <div className="data-actions">
          <button className="action-btn" onClick={handleExport}>
            <Download size={20} />
            Export Data (JSON)
          </button>
          
          <label className="action-btn">
            <Upload size={20} />
            Import Data
            <input 
              type="file" 
              accept=".json" 
              onChange={handleImport}
              style={{ display: 'none' }}
            />
          </label>
        </div>

        {importStatus && <p className="import-status">{importStatus}</p>}

        <div className="privacy-info">
          <Database size={20} />
          <div>
            <h4>Your Data</h4>
            <p>Stored in browser's IndexedDB • Never leaves your device</p>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="settings-section">
        <h2>About</h2>
        <div className="about-info">
          <h3>Solo Health Tracker</h3>
          <p>Version 1.0.0</p>
          <p className="tagline">Private, offline-first habit tracking</p>
          <ul className="features-list">
            <li>✅ 100% Private - Data stays on device</li>
            <li>✅ No accounts or login required</li>
            <li>✅ Works completely offline</li>
            <li>✅ PWA installable on any device</li>
          </ul>
        </div>
      </section>
    </div>
  );
};
