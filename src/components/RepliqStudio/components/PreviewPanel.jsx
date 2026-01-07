// FILE: src/components/RepliqStudio/components/PreviewPanel.jsx
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
  sampleCompanyName
}) {
  const introVideoRef = useRef(null);
  const secondVideoRef = useRef(null);
  const timerRef = useRef(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [phase, setPhase] = useState('intro');

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

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

  if (!introVideo) {
    return (
      <div className="preview-panel">
        <h3>Preview</h3>
        <div className="preview-placeholder">
          <p>Upload an intro video to see preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className="preview-panel">
      <h3>Preview</h3>
      
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
                {sampleCompanyName || 'Company'}
              </span> 👋
            </h2>
            <p style={{ opacity: 0.8 }}>{videoTitle}</p>
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
            <button className="preview-cta">
              {buttonText || 'Book a Call'}
            </button>
          )}
        </div>
        
        <div className="preview-controls">
          {!isPlaying ? (
            <button onClick={startPreview}>▶ Play Preview</button>
          ) : (
            <button onClick={resetPreview}>⏹ Reset</button>
          )}
        </div>
      </div>
    </div>
  );
}