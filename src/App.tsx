import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProfileSelection from './pages/ProfileSelection';
import Dashboard from './pages/Dashboard';
import type { Professional } from './types';
import './App.css';

function App() {
  const [activeProfile, setActiveProfile] = useState<Professional | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('activeProfile') as Professional;
    if (saved) setActiveProfile(saved);
  }, []);

  const handleProfileSelect = (profile: Professional) => {
    setActiveProfile(profile);
    localStorage.setItem('activeProfile', profile);
  };

  const handleLogout = () => {
    setActiveProfile(null);
    localStorage.removeItem('activeProfile');
  };

  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route 
            path="/" 
            element={
              activeProfile ? 
              <Navigate to="/dashboard" replace /> : 
              <ProfileSelection onSelect={handleProfileSelect} />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              activeProfile ? 
              <Dashboard profile={activeProfile} onLogout={handleLogout} /> : 
              <Navigate to="/" replace />
            } 
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
