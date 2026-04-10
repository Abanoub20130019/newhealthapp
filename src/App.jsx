import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, BarChart3, Sprout, Settings as SettingsIcon, PlusCircle } from 'lucide-react';
import { AppProvider } from './hooks/useApp';
import { HabitTracker } from './components/HabitTracker';
import { Stats } from './components/Stats';
import { HabitGarden } from './components/HabitGarden';
import { Settings } from './components/Settings';
import './styles.css';

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: Home, label: 'Today' },
    { path: '/stats', icon: BarChart3, label: 'Stats' },
    { path: '/garden', icon: Sprout, label: 'Garden' },
    { path: '/settings', icon: SettingsIcon, label: 'Settings' },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map(item => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        
        return (
          <Link 
            key={item.path} 
            to={item.path} 
            className={`nav-item ${isActive ? 'active' : ''}`}
          >
            <Icon size={24} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

const AppContent = () => {
  return (
    <div className="app-container">
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HabitTracker />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/garden" element={<HabitGarden />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
      <Navigation />
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}

export default App;
