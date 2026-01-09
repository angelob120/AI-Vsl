import React, { useState, useEffect } from 'react';
import ContractorBuilder from './components/ContractorBuilder';
import './styles/global.css';

/**
 * Main App Component
 * Handles navigation between ContractorBuilder and RepliqStudio
 * Also handles direct site preview links and landing page links
 */
export default function App() {
  const [currentTool, setCurrentTool] = useState('builder'); // 'builder' or 'repliq'
  const [isSitePreview, setIsSitePreview] = useState(false);
  const [isEmbedMode, setIsEmbedMode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);



  
  // Check URL hash on mount for direct links
  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash;
      const urlParams = new URLSearchParams(window.location.search);
      const embedParam = urlParams.get('embed') === 'true';
      
      // Set embed mode from URL parameter
      setIsEmbedMode(embedParam);
      
      // Check if this is a site preview link
      if (hash.startsWith('#site-')) {
        setCurrentTool('builder');
        setIsSitePreview(true);
        setIsLandingPage(false);

      } else {
        setIsSitePreview(false);
        setIsLandingPage(false);
      }
    };

    checkHash();

    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  // Load dark mode preference from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Handle navigation back to Builder
  const handleGoToBuilder = () => {
    setCurrentTool('builder');
    setIsSitePreview(false);
    setIsLandingPage(false);
    window.location.hash = '';
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  // =====================================================
  // LANDING PAGE VIEW - No menu, just the landing page
  // =====================================================

  // =====================================================
  // SITE PREVIEW VIEW (standalone or embedded) - No menu
  // =====================================================
  if (isSitePreview || isEmbedMode) {
    return (
      <ContractorBuilder 
        onNavigateToRepliq={handleGoToRepliQ}
        isStandaloneSitePreview={true}
        isDarkMode={false}
      />
    );
  }

  // =====================================================
  // NORMAL APP VIEW - With navigation menu
  // =====================================================
  return (
    <div className={`app-container ${isDarkMode ? 'dark-mode' : ''}`}>
      {/* Navigation Header - Only shows in builder/repliq mode */}
      <nav className={`app-nav ${isDarkMode ? 'dark' : ''}`}>
        <div className="app-nav-brand">
          <span className="app-nav-icon">⚡</span>
          <span className="app-nav-title">Lead Tools Suite</span>
        </div>
        
        <div className="app-nav-tabs">
          <button
            className={`app-nav-tab ${currentTool === 'builder' ? 'active' : ''}`}
            onClick={handleGoToBuilder}
          >
            <span className="tab-icon">🏗️</span>
            Website Builder
          </button>
          <button
            className={`app-nav-tab ${currentTool === 'page2' ? 'active' : ''}`}
            onClick={() => setCurrentTool('page2')}
          >
            <span className="tab-icon">📄</span>
            Page 2
          </button>
        </div>

        <div className="app-nav-actions">
          <button 
            className={`dark-mode-toggle ${isDarkMode ? 'active' : ''}`}
            onClick={toggleDarkMode}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <span className="toggle-icon">{isDarkMode ? '☀️' : '🌙'}</span>
            <span className="toggle-text">{isDarkMode ? 'Light' : 'Dark'}</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="app-main">
        {currentTool === 'builder' ? (
          <ContractorBuilder 
            onNavigateToRepliq={handleGoToRepliQ}
            isStandaloneSitePreview={false}
            isDarkMode={isDarkMode}
          />
        ) : (
          <div className={`blank-page ${isDarkMode ? 'dark' : ''}`}>
            {/* Your new content goes here */}
          </div>
        )}
      </main>

      <style>{`
        .app-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .app-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 24px;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .app-nav-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .app-nav-icon {
          font-size: 24px;
        }

        .app-nav-title {
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.5px;
        }

        .app-nav-tabs {
          display: flex;
          gap: 4px;
          background: rgba(255, 255, 255, 0.05);
          padding: 4px;
          border-radius: 12px;
        }

        .app-nav-tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: transparent;
          border: none;
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .app-nav-tab:hover {
          color: rgba(255, 255, 255, 0.9);
          background: rgba(255, 255, 255, 0.05);
        }

        .app-nav-tab.active {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }

        .tab-icon {
          font-size: 16px;
        }

        .app-nav-actions {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .dark-mode-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.8);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .dark-mode-toggle:hover {
          background: rgba(255, 255, 255, 0.15);
          color: #fff;
        }

        .dark-mode-toggle.active {
          background: rgba(255, 193, 7, 0.2);
          border-color: rgba(255, 193, 7, 0.4);
          color: #ffc107;
        }

        .toggle-icon {
          font-size: 16px;
        }

        .toggle-text {
          font-size: 12px;
          font-weight: 600;
        }

        .app-main {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </div>
  );
}