import React, { useState, useEffect, useRef } from 'react';

const LANDING_PAGE_PREFIX = 'repliq_landing_';

export default function LandingPageViewer() {
  const [pageData, setPageData] = useState(null);
  const [error, setError] = useState(null);
  const [phase, setPhase] = useState('intro');
  const containerRef = useRef(null);
  const introVideoRef = useRef(null);
  const secondVideoRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const hash = window.location.hash;
    
    if (hash.startsWith('#landing-') || hash.startsWith('#video-')) {
      const videoId = hash.replace('#landing-', '').replace('#video-', '');
      const isVideoOnly = hash.startsWith('#video-');
      
      try {
        const storedData = localStorage.getItem(LANDING_PAGE_PREFIX + videoId);
        if (storedData) {
          const data = JSON.parse(storedData);
          setPageData({ ...data, isVideoOnly });
        } else {
          setError('Landing page not found. It may have been deleted or never created.');
        }
      } catch (e) {
        setError('Failed to load landing page data.');
      }
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (pageData && !pageData.isVideoOnly) {
      // Start the transition timer
      timerRef.current = setTimeout(() => {
        setPhase('transitioning');
        setTimeout(() => {
          setPhase('expanded');
          if (secondVideoRef.current && pageData.settings.useSecondVideo && pageData.settings.secondVideoData) {
            secondVideoRef.current.play();
          }
        }, 800);
      }, (pageData.settings?.transitionTime || 10) * 1000);

      // Auto-play intro video
      if (introVideoRef.current) {
        introVideoRef.current.play().catch(e => console.log('Autoplay blocked:', e));
      }
    }
  }, [pageData]);

  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#1a1a2e',
        color: '#fff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        padding: '40px'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
        <h1 style={{ marginBottom: '12px' }}>Page Not Found</h1>
        <p style={{ color: 'rgba(255,255,255,0.7)' }}>{error}</p>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#1a1a2e',
        color: '#fff'
      }}>
        <div style={{ fontSize: '24px' }}>Loading...</div>
      </div>
    );
  }

  const { lead, settings, isVideoOnly } = pageData;
  const {
    introVideoData,
    secondVideoData,
    useSecondVideo,
    videoMode,
    videoPosition,
    videoShape,
    videoTitle,
    buttonText,
    buttonLink,
    bgColor,
    textColor,
    darkMode
  } = settings;

  // Video-only view
  if (isVideoOnly) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '40px 20px',
        background: darkMode ? '#1a1a2e' : '#f5f5f5',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{
          maxWidth: '800px',
          width: '100%'
        }}>
          <div style={{
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            background: '#000'
          }}>
            <video 
              controls 
              autoPlay
              style={{ width: '100%', display: 'block' }}
            >
              <source src={introVideoData} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <p style={{
              color: darkMode ? '#fff' : '#333',
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              {videoTitle}
            </p>
            <p style={{
              color: darkMode ? 'rgba(255,255,255,0.7)' : '#666',
              fontSize: '16px',
              marginBottom: '16px'
            }}>
              For {lead.firstName || ''} {lead.companyName ? '@ ' + lead.companyName : ''}
            </p>
            {buttonText && buttonLink && (
              <a 
                href={buttonLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  background: bgColor,
                  color: textColor,
                  padding: '12px 28px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  transition: 'transform 0.2s'
                }}
              >
                {buttonText}
              </a>
            )}
          </div>
          <p style={{
            marginTop: '32px',
            textAlign: 'center',
            fontSize: '14px',
            color: darkMode ? 'rgba(255,255,255,0.5)' : '#999'
          }}>
            Powered by <span style={{ color: bgColor, fontWeight: 'bold' }}>°RepliQ</span>
          </p>
        </div>
      </div>
    );
  }

  // Get position styles for video bubble
  const getPositionStyles = () => {
    const positions = {
      'bottom-left': { bottom: '20px', left: '20px' },
      'bottom-right': { bottom: '20px', right: '20px' },
      'top-left': { top: '20px', left: '20px' },
      'top-right': { top: '20px', right: '20px' },
    };
    return positions[videoPosition] || positions['bottom-left'];
  };

  // Get bubble size
  const getBubbleSize = () => {
    if (phase === 'expanded' && videoMode === 'fullscreen') {
      return { width: '100%', height: '100%', top: 0, left: 0, right: 0, bottom: 0 };
    }
    if (phase === 'expanded' && videoMode === 'big') {
      return { width: '320px', height: '320px' };
    }
    const sizes = { small: '120px', big: '180px', fullscreen: '180px' };
    return { width: sizes[videoMode], height: sizes[videoMode] };
  };

  const bubbleStyles = {
    position: 'fixed',
    zIndex: 100,
    transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    cursor: 'pointer',
    ...getPositionStyles(),
    ...getBubbleSize(),
    borderRadius: phase === 'expanded' && videoMode === 'fullscreen' ? '0' : videoShape === 'circle' ? '50%' : '16px'
  };

  const handleBubbleClick = () => {
    if (phase === 'intro') {
      if (timerRef.current) clearTimeout(timerRef.current);
      setPhase('transitioning');
      setTimeout(() => {
        setPhase('expanded');
        if (secondVideoRef.current && useSecondVideo && secondVideoData) {
          secondVideoRef.current.play();
        }
      }, 800);
    }
  };

  return (
    <div ref={containerRef} style={{
      position: 'relative',
      width: '100%',
      height: '100vh',
      overflow: 'hidden',
      background: darkMode ? '#1a1a2e' : '#f5f5f5',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Website Background */}
      <iframe
        src={lead.websiteUrl}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 'none',
          zIndex: 1
        }}
        sandbox="allow-scripts allow-same-origin"
        loading="lazy"
        title="Background Website"
      />

      {/* Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.15)',
        zIndex: 2,
        pointerEvents: 'none'
      }} />

      {/* Video Bubble */}
      <div style={bubbleStyles} onClick={handleBubbleClick}>
        <video
          ref={introVideoRef}
          src={introVideoData}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          muted
          playsInline
          autoPlay
          loop
        />
        {phase === 'intro' && (
          <div style={{
            position: 'absolute',
            top: '-4px',
            left: '-4px',
            right: '-4px',
            bottom: '-4px',
            border: `3px solid ${bgColor}`,
            borderRadius: 'inherit',
            animation: 'pulse 2s ease-out infinite'
          }} />
        )}
      </div>

      {/* Second Video (fullscreen) */}
      {useSecondVideo && secondVideoData && phase === 'expanded' && videoMode === 'fullscreen' && (
        <video
          ref={secondVideoRef}
          src={secondVideoData}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 150
          }}
          muted
          playsInline
        />
      )}

      {/* Info Card */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: darkMode ? 'rgba(30,30,46,0.95)' : 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        zIndex: 200,
        boxShadow: '0 4px 24px rgba(0,0,0,0.2)'
      }}>
        <span style={{ fontSize: '18px', fontWeight: 'bold', color: bgColor }}>°RepliQ</span>
        <div>
          <p style={{ color: darkMode ? '#fff' : '#333', fontSize: '14px', fontWeight: '600' }}>
            {videoTitle}
          </p>
          <p style={{ color: darkMode ? 'rgba(255,255,255,0.7)' : '#666', fontSize: '13px' }}>
            For {lead.firstName || ''} {lead.companyName ? '@ ' + lead.companyName : ''}
          </p>
        </div>
        {buttonText && buttonLink && (
          <a 
            href={buttonLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: bgColor,
              color: textColor,
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: '600',
              textDecoration: 'none',
              transition: 'all 0.2s'
            }}
          >
            {buttonText}
          </a>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.3); opacity: 0; }
        }
      `}</style>
    </div>
  );
}