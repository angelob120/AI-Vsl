/**
 * App.jsx - FIXED VERSION
 * 
 * This properly integrates the LandingPageViewer to handle landing page URLs.
 * When someone visits a URL with #landing-{id} or #video-{id}, it renders
 * the personalized landing page instead of the main app.
 */

import React, { useState, useEffect } from 'react';
import ContractorBuilder from './components/ContractorBuilder';
import RepliqStudio from './components/RepliqStudio';
import LandingPageViewer from './components/RepliqStudio/LandingPageViewer';
import './App.css';

export default function App() {
  const [currentView, setCurrentView] = useState('builder');
  const [repliqCSVData, setRepliqCSVData] = useState(null);
  const [isLandingPage, setIsLandingPage] = useState(false);

  // Check for landing page URL hash on mount and hash changes
  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash;
      
      console.log('Checking hash:', hash);
      
      // CRITICAL: Check if this is a landing page or video-only link FIRST
      if (hash.startsWith('#landing-') || hash.startsWith('#video-')) {
        console.log('✅ Detected landing page URL');
        setIsLandingPage(true);
        return;
      }
      
      // Check if this is a site preview link (existing functionality)
      if (hash.startsWith('#site-')) {
        setCurrentView('site-preview');
        setIsLandingPage(false);
        return;
      }
      
      setIsLandingPage(false);
    };

    // Check on mount
    checkHash();

    // Listen for hash changes
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  // Handle navigation to RepliQ from ContractorBuilder
  const handleNavigateToRepliq = (csvData) => {
    setRepliqCSVData(csvData);
    setCurrentView('repliq');
  };

  // Handle navigation back to ContractorBuilder from RepliQ
  const handleNavigateToBuilder = () => {
    setCurrentView('builder');
    setRepliqCSVData(null);
  };

  // =====================================================
  // CRITICAL FIX: If this is a landing page URL, ONLY render LandingPageViewer
  // This must be checked BEFORE any other rendering logic
  // =====================================================
  if (isLandingPage) {
    console.log('Rendering LandingPageViewer');
    return <LandingPageViewer />;
  }

  // Render main application views
  return (
    <div className="app-container">
      {currentView === 'builder' && (
        <ContractorBuilder 
          onNavigateToRepliq={handleNavigateToRepliq}
        />
      )}
      
      {currentView === 'repliq' && (
        <RepliqStudio 
          onNavigateToBuilder={handleNavigateToBuilder}
          importedCSV={repliqCSVData}
        />
      )}
    </div>
  );
}