import React, { useState, useEffect } from 'react';
import ContractorBuilder from './components/ContractorBuilder';
import RepliqStudio from './components/RepliqStudio';
import './styles/global.css';

/**
 * Main App Component
 * Handles navigation between ContractorBuilder and RepliqStudio
 */
export default function App() {
  const [currentTool, setCurrentTool] = useState('builder'); // 'builder' or 'repliq'
  const [exportedCSV, setExportedCSV] = useState(null);

  // Check URL hash on mount for direct links
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#site-')) {
      setCurrentTool('builder');
    } else if (hash === '#repliq') {
      setCurrentTool('repliq');
    }

    // Listen for hash changes
    const handleHashChange = () => {
      const newHash = window.location.hash;
      if (newHash.startsWith('#site-')) {
        setCurrentTool('builder');
      } else if (newHash === '#repliq') {
        setCurrentTool('repliq');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Handle navigation to RepliQ with exported data
  const handleGoToRepliQ = (csvData) => {
    setExportedCSV(csvData);
    setCurrentTool('repliq');
    window.location.hash = '#repliq';
  };

  // Handle navigation back to Builder
  const handleGoToBuilder = () => {
    setCurrentTool('builder');
    window.location.hash = '';
  };

  return (
    <div className="app-container">
      {/* Navigation Header */}
      <nav className="app-nav">
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
            className={`app-nav-tab ${currentTool === 'repliq' ? 'active' : ''}`}
            onClick={() => handleGoToRepliQ(null)}
          >
            <span className="tab-icon">🎬</span>
            RepliQ Studio
          </button>
        </div>

        <div className="app-nav-actions">
          {currentTool === 'builder' && (
            <button 
              className="app-nav-cta"
              onClick={() => handleGoToRepliQ(null)}
            >
              Go to RepliQ →
            </button>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="app-main">
        {currentTool === 'builder' ? (
          <ContractorBuilder 
            onGoToRepliQ={handleGoToRepliQ}
          />
        ) : (
          <RepliqStudio 
            importedCSV={exportedCSV}
            onGoToBuilder={handleGoToBuilder}
          />
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
        }

        .app-nav-cta {
          padding: 10px 20px;
          background: linear-gradient(135deg, #04CFAF 0%, #00a896 100%);
          color: #000;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .app-nav-cta:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(4, 207, 175, 0.3);
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
