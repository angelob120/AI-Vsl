// FILE: src/components/RepliqStudio/components/PreviewPanel.jsx
// UPDATED: Added navigation arrows to cycle through all CSV leads for preview
import React, { useRef, useState, useEffect } from 'react';

export default function PreviewPanel({
  introVideo,
  secondVideo,
  useSecondVideo,
  transitionTime,
  videoTitle,
  buttonText,
  buttonLink,
  darkMode,
  leads = [], // Now accepts full leads array
  currentLeadIndex = 0, // Current lead index
  onLeadIndexChange // Callback to change lead index
}) {
  const introVideoRef = useRef(null);
  const secondVideoRef = useRef(null);
  const timerRef = useRef(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [phase, setPhase] = useState('intro');

  // Get current lead data
  const currentLead = leads[currentLeadIndex] || {};
  const companyName = currentLead.companyName || 'Company';
  const hasMultipleLeads = leads.length > 1;

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Reset playback when lead changes
  useEffect(() => {
    resetPreview();
  }, [currentLeadIndex]);

  const goToPreviousLead = () => {
    if (onLeadIndexChange && leads.length > 0) {
      const newIndex = currentLeadIndex === 0 ? leads.length - 1 : currentLeadIndex - 1;
      onLeadIndexChange(newIndex);
    }
  };

  const goToNextLead = () => {
    if (onLeadIndexChange && leads.length > 0) {
      const newIndex = currentLeadIndex === leads.length - 1 ? 0 : currentLeadIndex + 1;
      onLeadIndexChange(newIndex);
    }
  };

  const startPreview = () => {
    setIsPlaying(true);
    setPhase('intro');
    
    if (introVideoRef.current) {
      introVideoRef.current.currentTime = 0;
      introVideoRef.current.play();
    }
    
    timerRef.current = setTimeout(() => {
      setPhase('transitioning');
      setTimeout(() => {
        setPhase('expanded');
        if (secondVideoRef.current && secondVideo && useSecondVideo) {
          secondVideoRef.current.currentTime = 0;
          secondVideoRef.current.play();
        }
      }, 800);
    }, transitionTime * 1000);
  };

  const resetPreview = () => {
    setIsPlaying(false);
    setPhase('intro');
    
    if (timerRef.current) clearTimeout(timerRef.current);
    
    if (introVideoRef.current) {
      introVideoRef.current.pause();
      introVideoRef.current.currentTime = 0;
    }
    if (secondVideoRef.current) {
      secondVideoRef.current.pause();
      secondVideoRef.current.currentTime = 0;
    }
  };

  // Arrow button styles
  const arrowButtonStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: 'none',
    background: darkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)',
    color: darkMode ? '#fff' : '#1a1a2e',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    transition: 'all 0.2s ease',
    flexShrink: 0
  };

  const arrowButtonHoverStyle = {
    background: darkMode ? 'rgba(102, 126, 234, 0.5)' : 'rgba(102, 126, 234, 0.2)',
    transform: 'scale(1.05)'
  };

  if (!introVideo) {
    return (
      <div className="preview-panel">
        <h3>Preview</h3>
        <div className={`preview-placeholder ${darkMode ? '' : 'light'}`}>
          <p>Upload an intro video to see preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className="preview-panel">
      {/* Header with navigation */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '16px'
      }}>
        <h3 style={{ margin: 0 }}>Preview</h3>
        
        {/* Lead navigation */}
        {hasMultipleLeads && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <button
              onClick={goToPreviousLead}
              style={arrowButtonStyle}
              onMouseEnter={(e) => Object.assign(e.target.style, arrowButtonHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.target.style, arrowButtonStyle)}
              title="Previous lead"
            >
              ←
            </button>
            
            <span style={{
              fontSize: '0.85rem',
              color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
              minWidth: '60px',
              textAlign: 'center',
              fontWeight: '500'
            }}>
              {currentLeadIndex + 1} / {leads.length}
            </span>
            
            <button
              onClick={goToNextLead}
              style={arrowButtonStyle}
              onMouseEnter={(e) => Object.assign(e.target.style, arrowButtonHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.target.style, arrowButtonStyle)}
              title="Next lead"
            >
              →
            </button>
          </div>
        )}
      </div>
      
      <div className="preview-container">
        <div 
          className="preview-frame" 
          style={{ background: darkMode ? '#1a1a2e' : '#f5f5f5' }}
        >
          {/* Preview greeting */}
          <div 
            className="preview-greeting" 
            style={{ color: darkMode ? '#fff' : '#000' }}
          >
            <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>
              Hi <span style={{ color: '#667eea' }}>
                {companyName}
              </span> 👋
            </h2>
            <p style={{ opacity: 0.8 }}>{videoTitle}</p>
            
            {/* Show additional lead info */}
            {currentLead.firstName && (
              <p style={{ 
                fontSize: '0.85rem', 
                opacity: 0.6, 
                marginTop: '8px' 
              }}>
                Contact: {currentLead.firstName}
              </p>
            )}
            {currentLead.websiteUrl && (
              <p style={{ 
                fontSize: '0.75rem', 
                opacity: 0.5, 
                marginTop: '4px',
                wordBreak: 'break-all'
              }}>
                {currentLead.websiteUrl}
              </p>
            )}
          </div>
          
          {/* Video preview */}
          <div className="preview-video-container">
            <video
              ref={introVideoRef}
              src={introVideo}
              className="preview-video"
              muted
              playsInline
            />
          </div>
          
          {/* Second video (hidden, for transition) */}
          {useSecondVideo && secondVideo && (
            <video
              ref={secondVideoRef}
              src={secondVideo}
              style={{ display: 'none' }}
              muted
              playsInline
            />
          )}
          
          {/* Preview CTA */}
          {buttonLink && (
            <button className="preview-cta" style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff'
            }}>
              {buttonText || 'Book a Call'}
            </button>
          )}
        </div>
        
        <div className="preview-controls" style={{
          marginTop: '16px',
          display: 'flex',
          justifyContent: 'center',
          gap: '12px'
        }}>
          {!isPlaying ? (
            <button onClick={startPreview} style={{
              padding: '10px 24px',
              borderRadius: '8px',
              border: 'none',
              background: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
              color: darkMode ? '#fff' : '#1a1a2e',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}>
              ▶ Play Preview
            </button>
          ) : (
            <button onClick={resetPreview} style={{
              padding: '10px 24px',
              borderRadius: '8px',
              border: 'none',
              background: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
              color: darkMode ? '#fff' : '#1a1a2e',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}>
              ⏹ Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}