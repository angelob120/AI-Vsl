// FILE: src/components/RepliqStudio/LandingPageViewer.jsx
// UPDATED: Simplified to play composed video (website scroll + overlay already baked in)
import React, { useState, useEffect, useRef } from 'react';
import { getFromIndexedDB, LANDING_PAGE_PREFIX } from './utils/storage';
import { getRepliqVideoById } from '../../api/repliqVideos';

export default function LandingPageViewer() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageData, setPageData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayOverlay, setShowPlayOverlay] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    const loadLandingPage = async () => {
      try {
        const hash = window.location.hash;
        
        // Check if this is a landing page or video-only view
        const isVideoOnly = hash.startsWith('#video-');
        const videoId = hash.replace('#landing-', '').replace('#video-', '');

        if (!videoId) {
          setError('No video ID provided');
          setLoading(false);
          return;
        }

        let data = null;

        // Try to load from API first (database)
        try {
          const apiData = await getRepliqVideoById(videoId);
          if (apiData) {
            data = {
              lead: apiData.leadData,
              settings: apiData.settings,
              composedVideoData: apiData.composedVideoData || apiData.videoData,
              videoType: apiData.videoType
            };
          }
        } catch (e) {
          console.log('API fetch failed, trying local storage:', e);
        }

        // Fallback to IndexedDB
        if (!data) {
          data = await getFromIndexedDB('landingPages', videoId);
        }

        // Fallback to localStorage
        if (!data) {
          const stored = localStorage.getItem(LANDING_PAGE_PREFIX + videoId);
          if (stored) {
            data = JSON.parse(stored);
            
            // If video data is in IndexedDB, try to fetch it
            if (data.composedVideoData === '[[STORED_IN_INDEXEDDB]]') {
              const fullData = await getFromIndexedDB('landingPages', videoId);
              if (fullData) {
                data = fullData;
              }
            }
          }
        }

        if (!data) {
          setError('Video not found. The link may be expired or invalid.');
          setLoading(false);
          return;
        }

        setPageData({
          ...data,
          isVideoOnly
        });
        setLoading(false);

      } catch (e) {
        console.error('Error loading landing page:', e);
        setError('Failed to load video. Please try again later.');
        setLoading(false);
      }
    };

    loadLandingPage();
  }, []);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
      setShowPlayOverlay(false);
    }
  };

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
        setShowPlayOverlay(false);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
        setShowPlayOverlay(true);
      }
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    setShowPlayOverlay(true);
  };

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

  const { lead, settings, composedVideoData, isVideoOnly } = pageData;
  const {
    videoTitle,
    buttonText,
    buttonLink,
    darkMode,
    backgroundColor,
    textColor,
    accentColor
  } = settings || {};

  // Determine the greeting name
  const greetingName = lead?.companyName || lead?.firstName || 'there';

  // Check if we have video data
  if (!composedVideoData || composedVideoData === '[[STORED_IN_INDEXEDDB]]') {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: darkMode 
          ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' 
          : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
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

  // Video-only view - just the video, nothing else
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
          <source src={composedVideoData} type="video/webm" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  // Full landing page view
  const bgColor = backgroundColor || (darkMode ? '#1a1a2e' : '#f5f7fa');
  const txtColor = textColor || (darkMode ? '#ffffff' : '#1a1a2e');
  const accent = accentColor || '#667eea';

  return (
    <div style={{
      minHeight: '100vh',
      background: darkMode 
        ? `linear-gradient(135deg, ${bgColor} 0%, #16213e 50%, #0f3460 100%)`
        : `linear-gradient(135deg, ${bgColor} 0%, #e8ecf1 100%)`,
      color: txtColor,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px'
    }}>
      {/* Greeting */}
      <h1 style={{ 
        fontSize: 'clamp(1.8rem, 5vw, 3rem)', 
        marginBottom: '12px',
        textAlign: 'center'
      }}>
        Hi <span style={{ color: accent }}>{greetingName}</span> 👋
      </h1>
      
      {/* Subtitle */}
      <p style={{ 
        fontSize: 'clamp(1rem, 2.5vw, 1.3rem)', 
        opacity: 0.8,
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        {videoTitle || 'A video for you'}
      </p>

      {/* Video Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '900px',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
        cursor: 'pointer'
      }}>
        <video
          ref={videoRef}
          onClick={handleVideoClick}
          onEnded={handleVideoEnded}
          playsInline
          style={{
            width: '100%',
            display: 'block'
          }}
        >
          <source src={composedVideoData} type="video/webm" />
          Your browser does not support the video tag.
        </video>

        {/* Play Overlay */}
        {showPlayOverlay && (
          <div 
            onClick={handlePlay}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0,0,0,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'opacity 0.3s'
            }}
          >
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: accent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              transition: 'transform 0.2s'
            }}>
              <div style={{
                width: 0,
                height: 0,
                borderTop: '15px solid transparent',
                borderBottom: '15px solid transparent',
                borderLeft: '25px solid white',
                marginLeft: '5px'
              }} />
            </div>
          </div>
        )}
      </div>

      {/* CTA Button */}
      {buttonLink && (
        <a
          href={buttonLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            marginTop: '30px',
            padding: '16px 48px',
            background: `linear-gradient(135deg, ${accent} 0%, #764ba2 100%)`,
            color: 'white',
            textDecoration: 'none',
            borderRadius: '50px',
            fontWeight: '600',
            fontSize: '1.1rem',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
          }}
        >
          {buttonText || 'Book a Call'}
        </a>
      )}

      {/* Powered By */}
      <p style={{
        marginTop: '40px',
        fontSize: '0.85rem',
        opacity: 0.5
      }}>
        Powered by <span style={{ color: accent, fontWeight: 600 }}>°RepliQ</span>
      </p>
    </div>
  );
}