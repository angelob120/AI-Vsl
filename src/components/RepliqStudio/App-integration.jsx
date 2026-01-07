/**
 * App.jsx Integration Example
 * 
 * This shows how to integrate the LandingPageViewer with your existing App component
 * to handle the landing page and video-only URL hashes.
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
      
      // Check if this is a landing page or video-only link
      if (hash.startsWith('#landing-') || hash.startsWith('#video-')) {
        setIsLandingPage(true);
        return;
      }
      
      // Check if this is a site preview link (existing functionality)
      if (hash.startsWith('#site-')) {
        setCurrentView('site-preview');
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

  // If this is a landing page URL, render the landing page viewer
  if (isLandingPage) {
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
      
      {currentView === 'site-preview' && (
        <ContractorBuilder 
          isStandaloneSitePreview={true}
          onNavigateToRepliq={handleNavigateToRepliq}
        />
      )}
    </div>
  );
}


/**
 * Alternative: Router-based Integration
 * 
 * If you're using React Router, you can set up routes like this:
 * 
 * import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
 * 
 * function App() {
 *   return (
 *     <BrowserRouter>
 *       <Routes>
 *         <Route path="/" element={<ContractorBuilder />} />
 *         <Route path="/repliq" element={<RepliqStudio />} />
 *         <Route path="/landing/:videoId" element={<LandingPageViewerWithParams />} />
 *         <Route path="/video/:videoId" element={<VideoOnlyViewerWithParams />} />
 *       </Routes>
 *     </BrowserRouter>
 *   );
 * }
 * 
 * function LandingPageViewerWithParams() {
 *   const { videoId } = useParams();
 *   // Pass videoId to LandingPageViewer
 *   return <LandingPageViewer videoId={videoId} mode="landing" />;
 * }
 */