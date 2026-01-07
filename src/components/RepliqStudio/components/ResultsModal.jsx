// FILE: src/components/RepliqStudio/components/ResultsModal.jsx
import React from 'react';
import { downloadHTML, downloadCSV } from '../utils/fileHelpers';
import { generateExportCSV } from '../utils/htmlGenerators';

export default function ResultsModal({ 
  videos, 
  onClose 
}) {
  const downloadLandingPage = (video) => {
    downloadHTML(
      video.landingPageHTML, 
      `landing_${video.companyName || video.firstName}_${video.id}.html`
    );
  };

  const downloadAllLandingPages = () => {
    videos.forEach((video, index) => {
      setTimeout(() => {
        downloadLandingPage(video);
      }, index * 200);
    });
  };

  const handleExportCSV = () => {
    const csvContent = generateExportCSV(videos);
    downloadCSV(
      csvContent, 
      `repliq_videos_${new Date().toISOString().split('T')[0]}.csv`
    );
  };

  return (
    <div className="results-modal">
      <div className="results-content">
        <button onClick={onClose} className="close-button">×</button>
        
        <h2>✅ Landing Pages Created!</h2>
        <p>{videos.length} personalized landing pages generated</p>
        
        <div className="results-list">
          {videos.slice(0, 5).map(video => (
            <div key={video.id} className="result-item">
              <span className="result-name">
                Hi <strong>{video.companyName || video.firstName}</strong>
              </span>
              <div className="result-actions">
                <a 
                  href={video.landingPageLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  🔗 View
                </a>
                <button onClick={() => downloadLandingPage(video)}>
                  📥 Download
                </button>
              </div>
            </div>
          ))}
          {videos.length > 5 && (
            <p className="more-results">
              +{videos.length - 5} more landing pages
            </p>
          )}
        </div>
        
        <div className="export-buttons">
          <button onClick={handleExportCSV} className="export-button">
            📥 Export CSV with Links
          </button>
          <button 
            onClick={downloadAllLandingPages} 
            className="export-button secondary"
          >
            📦 Download All HTML Files
          </button>
        </div>
        <p className="export-note">
          CSV includes Landing Page links and Video-only links for each lead
        </p>
      </div>
    </div>
  );
}