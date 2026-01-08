// FILE: src/components/RepliqStudio/LandingPageViewer.jsx
// Renders landing pages fetched from PostgreSQL database
import React, { useState, useEffect, useRef } from 'react';
import { getRepliqVideoById } from '../../api/repliqVideos';

export default function LandingPageViewer() {
  const [pageData, setPageData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    const loadLandingPage = async () => {
      const hash = window.location.hash;
      
      if (!hash.startsWith('#landing-') && !hash.startsWith('#video-')) {
        setError('Invalid URL');
        setLoading(false);
        return;
      }

      const videoId = hash.replace('#landing-', '').replace('#video-', '');
      const isVideoOnly = hash.startsWith('#video-');
      
      console.log(`Loading landing page: ${videoId}, isVideoOnly: ${isVideoOnly}`);

      try {
        // Fetch from PostgreSQL via API
        const data = await getRepliqVideoById(videoId);
        
        if (data) {
          console.log('✅ Found data in PostgreSQL');
          setPageData({ ...data, isVideoOnly });
          setLoading(false);
          return;
        }

        // No data found
        setError('Landing page not found. The link may be expired or invalid.');
        setLoading(false);

      } catch (e) {
        console.error('Error loading landing page:', e);
        setError('Failed to load landing page. Please try again later.');
        setLoading(false);
      }
    };

    loadLandingPage();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        color: '#fff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            border: '3px solid rgba(255,255,255,0.3)',
            borderTopColor: '#667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p>Loading your personalized video...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        color: '#fff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        padding: '40px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>😕</div>
        <h1 style={{ marginBottom: '12px', fontSize: '2rem' }}>Page Not Found</h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '400px' }}>{error}</p>
        <a 
          href="/"
          style={{
            marginTop: '30px',
            padding: '12px 32px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '50px',
            fontWeight: '600'
          }}
        >
          Go Home
        </a>
      </div>
    );
  }

  if (!pageData) {
    return null;
  }

  const { leadData, settings, videoData, isVideoOnly, websiteUrl } = pageData;
  const {
    videoTitle,
    buttonText,
    buttonLink,
    darkMode,
    displayMode,
    transitionTime,
    videoPosition,
    videoShape,
    backgroundColor,
    textColor
  } = settings || {};

  // Determine the greeting name
  const greetingName = leadData?.companyName || leadData?.firstName || 'there';

  // Check if we have video data
  if (!videoData) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: darkMode ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        color: darkMode ? '#fff' : '#000',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        padding: '40px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎬</div>
        <h1 style={{ marginBottom: '12px', fontSize: '2rem' }}>Video Unavailable</h1>
        <p style={{ opacity: 0.7, maxWidth: '400px' }}>
          The video for this landing page couldn't be loaded.
        </p>
      </div>
    );
  }

  // Video-only view
  if (isVideoOnly) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: darkMode ? '#1a1a2e' : '#f5f5f5'
      }}>
        <video
          ref={videoRef}
          controls
          autoPlay
          playsInline
          style={{
            maxWidth: '100%',
            maxHeight: '100vh'
          }}
        >
          <source src={videoData} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  // Video bubble position styles
  const positionStyles = {
    'bottom-left': { bottom: '20px', left: '20px' },
    'bottom-right': { bottom: '20px', right: '20px' },
    'top-left': { top: '100px', left: '20px' },
    'top-right': { top: '100px', right: '20px' }
  };

  // Video bubble size based on display mode
  const bubbleSizes = {
    'small-bubble': { initial: 120, expanded: 200 },
    'big-bubble': { initial: 200, expanded: 350 },
    'full-screen': { initial: 120, expanded: '100%' }
  };

  // Video shape styles
  const shapeStyles = {
    'circle': '50%',
    'square': '8px',
    'rounded': '16px'
  };

  const position = positionStyles[videoPosition] || positionStyles['bottom-left'];
  const bubbleSize = bubbleSizes[displayMode] || bubbleSizes['small-bubble'];
  const shape = shapeStyles[videoShape] || shapeStyles['circle'];

  // Full landing page view with website background and video bubble
  return (
    <LandingPageWithBubble
      greetingName={greetingName}
      websiteUrl={websiteUrl}
      videoData={videoData}
      videoTitle={videoTitle}
      buttonText={buttonText}
      buttonLink={buttonLink}
      darkMode={darkMode}
      displayMode={displayMode}
      transitionTime={transitionTime}
      position={position}
      bubbleSize={bubbleSize}
      shape={shape}
      backgroundColor={backgroundColor}
      textColor={textColor}
    />
  );
}

// Separate component for the landing page with video bubble
function LandingPageWithBubble({
  greetingName,
  websiteUrl,
  videoData,
  videoTitle,
  buttonText,
  buttonLink,
  darkMode,
  displayMode,
  transitionTime,
  position,
  bubbleSize,
  shape,
  backgroundColor,
  textColor
}) {
  const videoRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPlayOverlay, setShowPlayOverlay] = useState(true);
  const [iframeError, setIframeError] = useState(false);

  // Process websiteUrl to add embed parameter for internal site previews
  const getEmbedUrl = (url) => {
    if (!url) return null;
    
    // Check if this is an internal site preview URL (contains #site-)
    if (url.includes('#site-')) {
      // Add ?embed=true before the hash to signal standalone mode
      const [baseUrl, hash] = url.split('#');
      const separator = baseUrl.includes('?') ? '&' : '?';
      return `${baseUrl}${separator}embed=true#${hash}`;
    }
    
    return url;
  };

  const embedUrl = getEmbedUrl(websiteUrl);

  useEffect(() => {
    // Auto-play after 2 seconds
    const timer = setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.muted = false;
        videoRef.current.play().catch(() => {
          // Autoplay blocked, keep overlay visible
        });
        setShowPlayOverlay(false);

        // Set transition timer
        setTimeout(() => {
          setIsExpanded(true);
        }, (transitionTime || 10) * 1000);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [transitionTime]);

  const playVideo = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play().catch(() => {
        // Autoplay blocked, keep overlay visible
      });
      setShowPlayOverlay(false);

      // Set transition timer
      setTimeout(() => {
        setIsExpanded(true);
      }, (transitionTime || 10) * 1000);
    }
  };

  const minimizeVideo = () => {
    if (displayMode !== 'full-screen') {
      setIsExpanded(false);
    }
  };

  const handleVideoClick = () => {
    if (videoRef.current?.paused) {
      playVideo();
    } else if (!isExpanded) {
      setIsExpanded(true);
    }
  };

  // Calculate bubble styles
  const getBubbleStyles = () => {
    const base = {
      position: 'fixed',
      zIndex: 1000,
      cursor: 'pointer',
      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      ...position
    };

    if (isExpanded && displayMode === 'full-screen') {
      return {
        ...base,
        width: '100vw',
        height: '100vh',
        top: 0,
        left: 0,
        bottom: 'auto',
        right: 'auto',
        borderRadius: 0
      };
    }

    return {
      ...base,
      width: isExpanded ? bubbleSize.expanded : bubbleSize.initial,
      height: isExpanded ? bubbleSize.expanded : bubbleSize.initial
    };
  };

  const getVideoStyles = () => {
    const base = {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
      transition: 'border-radius 0.5s ease'
    };

    if (isExpanded && displayMode === 'full-screen') {
      return { ...base, borderRadius: 0, objectFit: 'contain', background: '#000' };
    }

    return { ...base, borderRadius: shape };
  };

  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Website Background (iframe) or Fallback */}
      {embedUrl && !iframeError ? (
        <iframe
          src={embedUrl}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none',
            zIndex: 1
          }}
          sandbox="allow-same-origin allow-scripts"
          loading="lazy"
          onError={() => setIframeError(true)}
          title="Website Background"
        />
      ) : (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: darkMode 
            ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' 
            : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
          color: darkMode ? '#fff' : '#1a1a2e',
          animation: 'fadeIn 0.8s ease-out'
        }}>
          <h1 style={{
            fontSize: 'clamp(2rem, 8vw, 3.5rem)',
            fontWeight: 800,
            marginBottom: '12px',
            textAlign: 'center'
          }}>
            Hi{' '}
            <span style={{
              background: `linear-gradient(135deg, ${backgroundColor || '#667eea'} 0%, #764ba2 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {greetingName}
            </span>
            {' '}👋
          </h1>
          <p style={{
            fontSize: 'clamp(1rem, 4vw, 1.4rem)',
            opacity: 0.8
          }}>
            {videoTitle || 'A video for you'}
          </p>
        </div>
      )}

      {/* Video Bubble (like Loom) */}
      <div style={getBubbleStyles()} onClick={handleVideoClick}>
        {/* Greeting Overlay */}
        {!isExpanded && (
          <div style={{
            position: 'absolute',
            top: '-50px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: backgroundColor || '#667eea',
            color: textColor || '#fff',
            padding: '10px 20px',
            borderRadius: '30px',
            fontWeight: 600,
            fontSize: '14px',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            opacity: showPlayOverlay ? 0 : 1,
            transition: 'opacity 0.3s'
          }}>
            Hi {greetingName}! 👋
          </div>
        )}

        {/* Video */}
        <video
          ref={videoRef}
          style={getVideoStyles()}
          playsInline
          preload="auto"
          muted
        >
          <source src={videoData} type="video/mp4" />
        </video>

        {/* Play Overlay */}
        {showPlayOverlay && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: isExpanded && displayMode === 'full-screen' ? 0 : shape,
            cursor: 'pointer'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'rgba(255,255,255,0.95)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                width: 0,
                height: 0,
                borderLeft: '16px solid #1a1a2e',
                borderTop: '10px solid transparent',
                borderBottom: '10px solid transparent',
                marginLeft: '4px'
              }} />
            </div>
          </div>
        )}

        {/* Minimize Button */}
        {isExpanded && displayMode !== 'full-screen' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              minimizeVideo();
            }}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              width: '32px',
              height: '32px',
              background: 'rgba(255,255,255,0.9)',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              zIndex: 10
            }}
          >
            −
          </button>
        )}
      </div>

      {/* CTA Button */}
      {buttonLink && (
        <>
          <a
            href={buttonLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              position: 'fixed',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              padding: '16px 40px',
              background: backgroundColor || '#667eea',
              color: textColor || '#fff',
              textDecoration: 'none',
              borderRadius: '50px',
              fontSize: '1.1rem',
              fontWeight: 600,
              boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
              zIndex: 999,
              transition: 'all 0.3s'
            }}
          >
            {buttonText || 'Book a Call'}
          </a>
          <p style={{
            position: 'fixed',
            bottom: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '0.85rem',
            color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)',
            zIndex: 998
          }}>
            Powered by <span style={{ color: '#667eea', fontWeight: 600 }}>°RepliQ</span>
          </p>
        </>
      )}
    </div>
  );
}