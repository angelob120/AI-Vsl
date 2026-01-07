import React, { useState, useEffect, useRef } from 'react';
import { getFromIndexedDB, LANDING_PAGE_PREFIX } from './utils/storage';

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
        // First try IndexedDB (has full video data)
        let data = await getFromIndexedDB('landingPages', videoId);
        
        if (data) {
          console.log('✅ Found data in IndexedDB');
          setPageData({ ...data, isVideoOnly });
          setLoading(false);
          return;
        }

        // Fallback to localStorage
        const storedData = localStorage.getItem(LANDING_PAGE_PREFIX + videoId);
        if (storedData) {
          console.log('✅ Found data in localStorage');
          data = JSON.parse(storedData);
          
          // If video data was stored separately in IndexedDB, retrieve it
          if (data.settings?.introVideoData === '[[STORED_IN_INDEXEDDB]]') {
            const introVideo = await getFromIndexedDB('videos', 'intro_video');
            if (introVideo) {
              data.settings.introVideoData = introVideo.data;
            }
            
            if (data.settings.secondVideoData === '[[STORED_IN_INDEXEDDB]]') {
              const secondVideo = await getFromIndexedDB('videos', 'second_video');
              if (secondVideo) {
                data.settings.secondVideoData = secondVideo.data;
              }
            }
          }
          
          setPageData({ ...data, isVideoOnly });
          setLoading(false);
          return;
        }

        // No data found
        setError('Landing page not found. It may have been deleted or created in a different browser session.');
        setLoading(false);

      } catch (e) {
        console.error('Error loading landing page:', e);
        setError('Failed to load landing page data.');
        setLoading(false);
      }
    };

    loadLandingPage();
  }, []);

  // Auto-play video when data loads
  useEffect(() => {
    if (pageData && videoRef.current) {
      // Small delay to ensure video is ready
      setTimeout(() => {
        videoRef.current.play().catch(e => console.log('Autoplay blocked:', e));
      }, 500);
    }
  }, [pageData]);

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

  const { lead, settings, isVideoOnly } = pageData;
  const {
    introVideoData,
    videoTitle,
    buttonText,
    buttonLink,
    darkMode
  } = settings || {};

  // Determine the greeting name
  const greetingName = lead?.companyName || lead?.firstName || 'there';

  // Check if we have video data
  if (!introVideoData || introVideoData === '[[STORED_IN_INDEXEDDB]]') {
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
          The video for this landing page couldn't be loaded. It may have been created in a different browser session.
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
          <source src={introVideoData} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  // Full landing page view with "Hi COMPANY NAME"
  return (
    <div style={{
      minHeight: '100vh',
      background: darkMode 
        ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' 
        : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
        width: '100%',
        textAlign: 'center',
        animation: 'fadeIn 0.8s ease-out'
      }}>
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
        
        {/* PROMINENT GREETING - "Hi COMPANY NAME" */}
        <h1 style={{
          fontSize: 'clamp(2rem, 8vw, 3.5rem)',
          fontWeight: 800,
          color: darkMode ? '#fff' : '#1a1a2e',
          marginBottom: '12px',
          textShadow: darkMode ? '0 2px 20px rgba(0,0,0,0.3)' : 'none',
          lineHeight: 1.2
        }}>
          Hi{' '}
          <span style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            {greetingName}
          </span>
          {' '}👋
        </h1>
        
        {/* Subtitle */}
        <p style={{
          fontSize: 'clamp(1rem, 4vw, 1.4rem)',
          color: darkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
          marginBottom: '40px',
          fontWeight: 400
        }}>
          {videoTitle || 'A video for you'}
        </p>
        
        {/* VIDEO */}
        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: '640px',
          margin: '0 auto 40px',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          background: '#000'
        }}>
          <video
            ref={videoRef}
            controls
            playsInline
            style={{
              width: '100%',
              height: 'auto',
              display: 'block'
            }}
          >
            <source src={introVideoData} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        
        {/* CTA BUTTON */}
        {buttonLink && (
          <a
            href={buttonLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '18px 48px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '50px',
              fontSize: 'clamp(1rem, 3vw, 1.2rem)',
              fontWeight: 600,
              boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 30px rgba(102, 126, 234, 0.6)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 20px rgba(102, 126, 234, 0.4)';
            }}
          >
            {buttonText || 'Book a Call'}
          </a>
        )}
        
        {/* Powered by */}
        <p style={{
          marginTop: '60px',
          fontSize: '0.9rem',
          color: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'
        }}>
          Powered by <span style={{ color: '#667eea', fontWeight: 600 }}>°RepliQ</span>
        </p>
      </div>
    </div>
  );
}