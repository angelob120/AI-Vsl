import React, { useState, useRef, useEffect } from 'react';
import { parseCSV } from '../../utils/csv';
import { delay, readFileAsText } from '../../utils/helpers';
import { ColorPicker } from '../shared';
import './styles.css';

// Storage keys for generated videos and landing pages
const LANDING_PAGE_PREFIX = 'repliq_landing_';

// Convert file to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Generate unique ID for videos/pages
const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

export default function RepliqStudio({ onNavigateToBuilder, importedCSV }) {
  // Video uploads - now storing both URL and base64 data
  const [introVideo, setIntroVideo] = useState(null);
  const [introVideoData, setIntroVideoData] = useState(null); // base64 data
  const [secondVideo, setSecondVideo] = useState(null);
  const [secondVideoData, setSecondVideoData] = useState(null); // base64 data
  const [useSecondVideo, setUseSecondVideo] = useState(false);
  
  // CSV/Leads
  const [csvData, setCsvData] = useState([]);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [headerRowIndex, setHeaderRowIndex] = useState(0);
  const [columnMapping, setColumnMapping] = useState({
    websiteUrl: '',
    firstName: '',
    companyName: ''
  });
  
  // Video options
  const [transitionTime, setTransitionTime] = useState(10);
  const [videoMode, setVideoMode] = useState('small');
  const [videoPosition, setVideoPosition] = useState('bottom-left');
  const [videoShape, setVideoShape] = useState('circle');
  
  // Page options
  const [videoTitle, setVideoTitle] = useState('A video for you 👋');
  const [videoDescription, setVideoDescription] = useState('Intro');
  const [calendarUrl, setCalendarUrl] = useState('');
  const [buttonText, setButtonText] = useState('');
  const [buttonLink, setButtonLink] = useState('');
  const [textColor, setTextColor] = useState('#ffffff');
  const [bgColor, setBgColor] = useState('#04CFAF');
  const [darkMode, setDarkMode] = useState(true);
  const [scrollBehavior, setScrollBehavior] = useState('down');
  const [mouseDisplay, setMouseDisplay] = useState('moving');
  
  // Preview state
  const [isPlaying, setIsPlaying] = useState(false);
  const [phase, setPhase] = useState('intro');
  const [currentLeadIndex, setCurrentLeadIndex] = useState(0);
  
  // Video creation state
  const [isCreating, setIsCreating] = useState(false);
  const [creationProgress, setCreationProgress] = useState(0);
  const [currentProcessingLead, setCurrentProcessingLead] = useState(null);
  const [createdVideos, setCreatedVideos] = useState([]);
  const [showResults, setShowResults] = useState(false);
  
  // Refs
  const introVideoRef = useRef(null);
  const secondVideoRef = useRef(null);
  const timerRef = useRef(null);

  // Handle imported CSV data from ContractorBuilder
  useEffect(() => {
    if (importedCSV && Array.isArray(importedCSV) && importedCSV.length > 0) {
      setCsvData(importedCSV);
      const headers = importedCSV[0];
      setCsvHeaders(headers);
      setHeaderRowIndex(0);
      const headersLower = headers.map(h => (h || '').toLowerCase());
      setColumnMapping({
        websiteUrl: headers[headersLower.findIndex(h => h.includes('website') || h.includes('url') || h.includes('link'))] || '',
        firstName: headers[headersLower.findIndex(h => h.includes('first') || h.includes('name') || h.includes('owner'))] || '',
        companyName: headers[headersLower.findIndex(h => h.includes('company') || h.includes('business'))] || ''
      });
    }
  }, [importedCSV]);

  // Video handlers - now also save base64 data
  const handleIntroUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIntroVideo(URL.createObjectURL(file));
      try {
        const base64 = await fileToBase64(file);
        setIntroVideoData(base64);
      } catch (err) {
        console.error('Failed to convert video to base64:', err);
      }
    }
  };

  const handleSecondUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setSecondVideo(URL.createObjectURL(file));
      try {
        const base64 = await fileToBase64(file);
        setSecondVideoData(base64);
      } catch (err) {
        console.error('Failed to convert video to base64:', err);
      }
    }
  };

  // Parse and handle CSV upload
  const handleCSVUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const text = await readFileAsText(file);
      const parsed = parseCSV(text);
      setCsvData(parsed);
      
      if (parsed.length > 0) {
        setCsvHeaders(parsed[0]);
        setHeaderRowIndex(0);
        const headers = parsed[0].map(h => h.toLowerCase());
        setColumnMapping({
          websiteUrl: parsed[0][headers.findIndex(h => h.includes('website') || h.includes('url'))] || '',
          firstName: parsed[0][headers.findIndex(h => h.includes('first') || h.includes('name'))] || '',
          companyName: parsed[0][headers.findIndex(h => h.includes('company') || h.includes('last'))] || ''
        });
      }
    }
  };

  const getMappedLeads = () => {
    if (csvData.length <= headerRowIndex + 1) return [];
    return csvData.slice(headerRowIndex + 1).map((row, i) => ({
      id: i + 1,
      websiteUrl: row[csvHeaders.indexOf(columnMapping.websiteUrl)] || '',
      firstName: row[csvHeaders.indexOf(columnMapping.firstName)] || '',
      companyName: row[csvHeaders.indexOf(columnMapping.companyName)] || ''
    }));
  };

  const leads = getMappedLeads();
  const currentLead = leads[currentLeadIndex] || { firstName: 'FirstName', companyName: 'CompanyName', websiteUrl: 'https://example.com' };

  // Preview controls
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

  // ============================================
  // FIXED: Generate actual landing pages with video data
  // ============================================
  const generateLandingPageHTML = (lead, settings) => {
    const {
      introVideoData: vidData,
      secondVideoData: secVidData,
      useSecondVideo: useSecVid,
      transitionTime: transTime,
      videoMode: vidMode,
      videoPosition: vidPos,
      videoShape: vidShape,
      videoTitle: vidTitle,
      buttonText: btnText,
      buttonLink: btnLink,
      bgColor: bgClr,
      textColor: txtClr,
      darkMode: isDark
    } = settings;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${vidTitle} - ${lead.firstName || lead.companyName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: ${isDark ? '#1a1a2e' : '#f5f5f5'};
      overflow: hidden;
      height: 100vh;
    }
    
    .container {
      position: relative;
      width: 100%;
      height: 100vh;
      overflow: hidden;
    }
    
    .website-frame {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: none;
      z-index: 1;
    }
    
    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.15);
      z-index: 2;
      pointer-events: none;
    }
    
    .video-bubble {
      position: fixed;
      z-index: 100;
      transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      cursor: pointer;
      ${vidPos === 'bottom-left' ? 'bottom: 20px; left: 20px;' : ''}
      ${vidPos === 'bottom-right' ? 'bottom: 20px; right: 20px;' : ''}
      ${vidPos === 'top-left' ? 'top: 20px; left: 20px;' : ''}
      ${vidPos === 'top-right' ? 'top: 20px; right: 20px;' : ''}
      width: ${vidMode === 'small' ? '120px' : vidMode === 'big' ? '180px' : '180px'};
      height: ${vidMode === 'small' ? '120px' : vidMode === 'big' ? '180px' : '180px'};
      border-radius: ${vidShape === 'circle' ? '50%' : '16px'};
    }
    
    .video-bubble.expanded {
      ${vidMode === 'fullscreen' ? `
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        width: 100% !important;
        height: 100% !important;
        border-radius: 0 !important;
      ` : vidMode === 'big' ? `
        width: 320px !important;
        height: 320px !important;
      ` : ''}
    }
    
    .video-bubble video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .pulse-ring {
      position: absolute;
      top: -4px;
      left: -4px;
      right: -4px;
      bottom: -4px;
      border: 3px solid ${bgClr};
      border-radius: inherit;
      animation: pulse 2s ease-out infinite;
    }
    
    @keyframes pulse {
      0% { transform: scale(1); opacity: 1; }
      100% { transform: scale(1.3); opacity: 0; }
    }
    
    .info-card {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: ${isDark ? 'rgba(30,30,46,0.95)' : 'rgba(255,255,255,0.95)'};
      backdrop-filter: blur(10px);
      border-radius: 16px;
      padding: 16px 24px;
      display: flex;
      align-items: center;
      gap: 20px;
      z-index: 200;
      box-shadow: 0 4px 24px rgba(0,0,0,0.2);
    }
    
    .brand {
      font-size: 18px;
      font-weight: bold;
      color: ${bgClr};
    }
    
    .info-title {
      color: ${isDark ? '#fff' : '#333'};
      font-size: 14px;
      font-weight: 600;
    }
    
    .info-name {
      color: ${isDark ? 'rgba(255,255,255,0.7)' : '#666'};
      font-size: 13px;
    }
    
    .cta-button {
      background: ${bgClr};
      color: ${txtClr};
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s;
    }
    
    .cta-button:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
  </style>
</head>
<body>
  <div class="container">
    <iframe 
      class="website-frame" 
      src="${lead.websiteUrl}" 
      sandbox="allow-scripts allow-same-origin"
      loading="lazy"
    ></iframe>
    
    <div class="overlay"></div>
    
    <div class="video-bubble" id="videoBubble">
      <video id="introVideo" muted playsinline autoplay loop>
        <source src="${vidData}" type="video/mp4">
      </video>
      <div class="pulse-ring" id="pulseRing"></div>
    </div>
    
    ${useSecVid && secVidData ? `
    <video id="secondVideo" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; object-fit:cover; z-index:150;">
      <source src="${secVidData}" type="video/mp4">
    </video>
    ` : ''}
    
    <div class="info-card">
      <span class="brand">°RepliQ</span>
      <div>
        <p class="info-title">${vidTitle}</p>
        <p class="info-name">For ${lead.firstName || ''} ${lead.companyName ? '@ ' + lead.companyName : ''}</p>
      </div>
      ${btnText && btnLink ? `<a href="${btnLink}" class="cta-button" target="_blank">${btnText}</a>` : ''}
    </div>
  </div>
  
  <script>
    const bubble = document.getElementById('videoBubble');
    const pulseRing = document.getElementById('pulseRing');
    const introVideo = document.getElementById('introVideo');
    const secondVideo = document.getElementById('secondVideo');
    const transitionTime = ${transTime * 1000};
    const videoMode = '${vidMode}';
    const useSecondVideo = ${useSecVid && secVidData ? 'true' : 'false'};
    
    let hasExpanded = false;
    
    setTimeout(() => {
      if (!hasExpanded) {
        expandBubble();
      }
    }, transitionTime);
    
    bubble.addEventListener('click', () => {
      if (!hasExpanded) {
        expandBubble();
      }
    });
    
    function expandBubble() {
      hasExpanded = true;
      pulseRing.style.display = 'none';
      bubble.classList.add('expanded');
      
      if (useSecondVideo && secondVideo) {
        setTimeout(() => {
          bubble.style.display = 'none';
          secondVideo.style.display = 'block';
          secondVideo.play();
        }, 800);
      }
    }
    
    introVideo.play().catch(e => console.log('Autoplay blocked:', e));
  </script>
</body>
</html>`;
  };

  // Generate video-only page HTML
  const generateVideoOnlyHTML = (lead, settings) => {
    const { 
      introVideoData: vidData, 
      videoTitle: vidTitle, 
      bgColor: bgClr, 
      textColor: txtClr, 
      darkMode: isDark, 
      buttonText: btnText, 
      buttonLink: btnLink 
    } = settings;
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Video - ${lead.firstName || lead.companyName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: ${isDark ? '#1a1a2e' : '#f5f5f5'};
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
    }
    .video-container {
      max-width: 800px;
      width: 100%;
    }
    .video-wrapper {
      position: relative;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      background: #000;
    }
    video {
      width: 100%;
      display: block;
    }
    .info {
      margin-top: 24px;
      text-align: center;
    }
    .title {
      color: ${isDark ? '#fff' : '#333'};
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    .name {
      color: ${isDark ? 'rgba(255,255,255,0.7)' : '#666'};
      font-size: 16px;
      margin-bottom: 16px;
    }
    .cta-button {
      display: inline-block;
      background: ${bgClr};
      color: ${txtClr};
      border: none;
      padding: 12px 28px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s;
    }
    .cta-button:hover {
      transform: scale(1.05);
    }
    .brand {
      margin-top: 32px;
      font-size: 14px;
      color: ${isDark ? 'rgba(255,255,255,0.5)' : '#999'};
    }
    .brand span {
      color: ${bgClr};
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="video-container">
    <div class="video-wrapper">
      <video controls autoplay>
        <source src="${vidData}" type="video/mp4">
        Your browser does not support the video tag.
      </video>
    </div>
    <div class="info">
      <p class="title">${vidTitle}</p>
      <p class="name">For ${lead.firstName || ''} ${lead.companyName ? '@ ' + lead.companyName : ''}</p>
      ${btnText && btnLink ? `<a href="${btnLink}" class="cta-button" target="_blank">${btnText}</a>` : ''}
    </div>
    <p class="brand">Powered by <span>°RepliQ</span></p>
  </div>
</body>
</html>`;
  };

  // ============================================
  // FIXED: Start Video Creation - Actually generates and saves landing pages
  // ============================================
  const startVideoCreation = async () => {
    if (leads.length === 0) {
      alert('Please upload a CSV with leads first!');
      return;
    }
    if (!introVideo || !introVideoData) {
      alert('Please upload an intro video first!');
      return;
    }

    setIsCreating(true);
    setCreationProgress(0);
    setCreatedVideos([]);
    setShowResults(false);

    const baseUrl = window.location.origin + window.location.pathname;
    const generatedVideos = [];

    // Settings object to pass to HTML generators
    const settings = {
      introVideoData,
      secondVideoData,
      useSecondVideo,
      transitionTime,
      videoMode,
      videoPosition,
      videoShape,
      videoTitle,
      videoDescription,
      buttonText,
      buttonLink,
      bgColor,
      textColor,
      darkMode
    };

    for (let i = 0; i < leads.length; i++) {
      const lead = leads[i];
      setCurrentProcessingLead(lead);
      setCreationProgress(Math.round(((i) / leads.length) * 100));

      await delay(100);

      const videoId = generateUniqueId();
      
      // Generate landing page HTML
      const landingPageHTML = generateLandingPageHTML(lead, settings);
      const videoOnlyHTML = generateVideoOnlyHTML(lead, settings);
      
      // Store in localStorage for persistence
      try {
        const storageData = {
          id: videoId,
          lead,
          settings,
          landingPageHTML,
          videoOnlyHTML,
          createdAt: new Date().toISOString()
        };
        localStorage.setItem(LANDING_PAGE_PREFIX + videoId, JSON.stringify(storageData));
      } catch (e) {
        console.warn('Could not save to localStorage:', e);
      }

      // Create download links for the HTML files
      const landingPageLink = `${baseUrl}#landing-${videoId}`;
      const videoOnlyLink = `${baseUrl}#video-${videoId}`;

      generatedVideos.push({
        id: videoId,
        success: 'YES',
        originUrl: lead.websiteUrl,
        firstName: lead.firstName,
        lastName: lead.companyName,
        landingPageLink,
        videoOnlyLink,
        videoLink: landingPageLink,
        landingPageHTML,
        videoOnlyHTML
      });
    }

    setCreatedVideos(generatedVideos);
    setCreationProgress(100);
    
    await delay(500);
    setIsCreating(false);
    setShowResults(true);
  };

  // ============================================
  // FIXED: Export CSV with actual links
  // ============================================
  const handleExportCSV = () => {
    const headers = [
      'Id',
      'Success',
      'Website URL',
      'First Name', 
      'Company Name',
      'Landing Page Link',
      'Video Only Link'
    ];

    const rows = createdVideos.map(video => [
      video.id,
      video.success,
      video.originUrl,
      video.firstName,
      video.lastName,
      video.landingPageLink,
      video.videoOnlyLink
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => {
        const str = String(cell || '');
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      }).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `repliq_videos_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Download individual landing page HTML
  const downloadLandingPage = (video) => {
    const blob = new Blob([video.landingPageHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `landing-${video.firstName}-${video.id}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Download all landing pages as individual files
  const downloadAllLandingPages = () => {
    createdVideos.forEach((video, index) => {
      setTimeout(() => {
        downloadLandingPage(video);
      }, index * 500);
    });
  };

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  // Get bubble position styles
  const getPositionStyles = () => {
    const positions = {
      'bottom-left': { bottom: '20px', left: '20px' },
      'bottom-right': { bottom: '20px', right: '20px' },
      'top-left': { top: '20px', left: '20px' },
      'top-right': { top: '20px', right: '20px' },
    };
    return positions[videoPosition];
  };

  // Get bubble size based on mode and phase
  const getBubbleSize = () => {
    if (phase === 'expanded') {
      if (videoMode === 'fullscreen') return { width: '100%', height: '100%', inset: 0 };
      if (videoMode === 'big') return { width: '280px', height: '280px' };
    }
    if (phase === 'transitioning' && videoMode === 'fullscreen') {
      return { width: '60%', height: '60%', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }
    const sizes = { small: '100px', big: '140px', fullscreen: '140px' };
    return { width: sizes[videoMode], height: sizes[videoMode] };
  };

  const bubbleStyles = {
    position: 'absolute',
    ...getPositionStyles(),
    ...getBubbleSize(),
    borderRadius: phase === 'expanded' && videoMode === 'fullscreen' ? '0' : videoShape === 'circle' ? '50%' : '16px',
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
    zIndex: 100,
    cursor: 'pointer'
  };

  return (
    <div className="repliq-container">
      {/* Header */}
      <header className="repliq-header">
        <div className="repliq-logo">
          <span className="repliq-logo-icon">°</span>
          <span className="repliq-logo-text">RepliQ</span>
          <span className="repliq-tagline">Video Personalization Studio</span>
        </div>
        {onNavigateToBuilder && (
          <button className="back-to-builder-btn" onClick={onNavigateToBuilder}>
            ← Back to Website Builder
          </button>
        )}
      </header>

      <div className="repliq-main-layout">
        {/* Left Panel - All Settings */}
        <div className="repliq-settings-panel">
          
          {/* Section 1: Video Upload */}
          <div className="repliq-section">
            <h3 className="repliq-section-title">
              <span>🎥</span> 1. Upload Videos
            </h3>
            
            <label className={`upload-box ${introVideo ? 'has-file' : ''}`}>
              <input type="file" accept="video/*" onChange={handleIntroUpload} style={{ display: 'none' }} />
              <div className="upload-box-content">
                <span className="upload-box-icon">{introVideo ? '✓' : '👤'}</span>
                <div>
                  <p className="upload-box-label">Bubble Video (Intro)</p>
                  <p className="upload-box-description">Your face cam shown in bubble</p>
                </div>
              </div>
            </label>
            
            <div className="toggle-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={useSecondVideo}
                  onChange={(e) => setUseSecondVideo(e.target.checked)}
                  className="checkbox"
                />
                Add second video (fullscreen after intro)
              </label>
            </div>
            
            {useSecondVideo && (
              <label className={`upload-box ${secondVideo ? 'has-file' : ''}`}>
                <input type="file" accept="video/*" onChange={handleSecondUpload} style={{ display: 'none' }} />
                <div className="upload-box-content">
                  <span className="upload-box-icon">{secondVideo ? '✓' : '🖥️'}</span>
                  <div>
                    <p className="upload-box-label">Fullscreen Video</p>
                    <p className="upload-box-description">Screen share or presentation</p>
                  </div>
                </div>
              </label>
            )}
          </div>

          {/* Section 2: Leads Upload */}
          <div className="repliq-section">
            <h3 className="repliq-section-title">
              <span>📊</span> 2. Upload Leads
            </h3>
            
            <label className={`upload-box ${csvData.length > 0 ? 'has-file' : ''}`}>
              <input type="file" accept=".csv,.xlsx,.xls" onChange={handleCSVUpload} style={{ display: 'none' }} />
              <div className="upload-box-content">
                <span className="upload-box-icon">{csvData.length > 0 ? '✓' : '📋'}</span>
                <div>
                  <p className="upload-box-label">CSV / Excel File</p>
                  <p className="upload-box-description">
                    {csvData.length > 0 ? `${leads.length} leads loaded` : 'Columns: Website URL, First Name, Company'}
                  </p>
                </div>
              </div>
            </label>
            
            {csvData.length > 0 && (
              <>
                <div className="mapping-section">
                  <h4 className="sub-title">Map Columns</h4>
                  <div className="mapping-grid">
                    <div className="mapping-select-wrapper">
                      <label className="mapping-select-label">Website URL *</label>
                      <select
                        value={columnMapping.websiteUrl}
                        onChange={(e) => setColumnMapping({...columnMapping, websiteUrl: e.target.value})}
                        className="mapping-select"
                      >
                        <option value="">Select...</option>
                        {csvHeaders.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                    <div className="mapping-select-wrapper">
                      <label className="mapping-select-label">First Name</label>
                      <select
                        value={columnMapping.firstName}
                        onChange={(e) => setColumnMapping({...columnMapping, firstName: e.target.value})}
                        className="mapping-select"
                      >
                        <option value="">Select...</option>
                        {csvHeaders.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                    <div className="mapping-select-wrapper">
                      <label className="mapping-select-label">Company Name</label>
                      <select
                        value={columnMapping.companyName}
                        onChange={(e) => setColumnMapping({...columnMapping, companyName: e.target.value})}
                        className="mapping-select"
                      >
                        <option value="">Select...</option>
                        {csvHeaders.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
                
                {/* Leads Preview */}
                <div className="leads-preview">
                  <h4 className="sub-title">Leads Preview ({leads.length})</h4>
                  <div className="leads-list">
                    {leads.slice(0, 5).map((lead, i) => (
                      <div key={i} className="lead-item">
                        <span className="lead-name">{lead.firstName || 'N/A'}</span>
                        <span className="lead-company">{lead.companyName || 'N/A'}</span>
                        <span className="lead-url">{lead.websiteUrl ? '🌐' : '⚠️'}</span>
                      </div>
                    ))}
                    {leads.length > 5 && <p className="more-leads">+{leads.length - 5} more</p>}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Section 3: Video Settings */}
          <div className="repliq-section">
            <h3 className="repliq-section-title">
              <span>⚙️</span> 3. Video Settings
            </h3>
            
            <div className="setting-row">
              <label className="setting-label">Transition after</label>
              <div className="time-selector">
                <select value={transitionTime} onChange={(e) => setTransitionTime(Number(e.target.value))} className="select-small">
                  {[3, 5, 7, 10, 15, 20].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                <span className="time-unit">seconds</span>
              </div>
            </div>
            
            <div className="setting-row">
              <label className="setting-label">Video Mode</label>
              <div className="mode-buttons">
                {[
                  { mode: 'small', label: 'Small', icon: '○' },
                  { mode: 'big', label: 'Big', icon: '◯' },
                  { mode: 'fullscreen', label: 'Fullscreen', icon: '▢' },
                ].map(({ mode, label, icon }) => (
                  <button
                    key={mode}
                    onClick={() => setVideoMode(mode)}
                    className={`mode-btn ${videoMode === mode ? 'active' : ''}`}
                  >
                    <span className="mode-btn-icon">{icon}</span>
                    <span className="mode-btn-label">{label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="setting-row-double">
              <div className="setting-half">
                <label className="setting-label">Position</label>
                <select value={videoPosition} onChange={(e) => setVideoPosition(e.target.value)} className="repliq-select">
                  <option value="bottom-left">Bottom Left</option>
                  <option value="bottom-right">Bottom Right</option>
                  <option value="top-left">Top Left</option>
                  <option value="top-right">Top Right</option>
                </select>
              </div>
              <div className="setting-half">
                <label className="setting-label">Shape</label>
                <select value={videoShape} onChange={(e) => setVideoShape(e.target.value)} className="repliq-select">
                  <option value="circle">Circle</option>
                  <option value="rounded">Rounded</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Page Options */}
          <div className="repliq-section">
            <h3 className="repliq-section-title">
              <span>📝</span> 4. Page Options
            </h3>
            
            <div className="input-group">
              <label className="input-label">Video Title</label>
              <input
                type="text"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                className="repliq-input"
                placeholder="A video for you 👋"
              />
            </div>
            
            <div className="input-group">
              <label className="input-label">Description</label>
              <input
                type="text"
                value={videoDescription}
                onChange={(e) => setVideoDescription(e.target.value)}
                className="repliq-input"
                placeholder="Intro"
              />
            </div>
            
            <div className="input-group">
              <label className="input-label">Calendar URL</label>
              <input
                type="text"
                value={calendarUrl}
                onChange={(e) => setCalendarUrl(e.target.value)}
                className="repliq-input"
                placeholder="https://calendly.com/..."
              />
            </div>
            
            <div className="cta-section">
              <h4 className="sub-title">CTA Button</h4>
              <div className="input-row-double">
                <div className="input-half">
                  <label className="input-label">Button Text ({buttonText.length}/40)</label>
                  <input
                    type="text"
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value.slice(0, 40))}
                    className="repliq-input"
                    placeholder="Book a call"
                  />
                </div>
                <div className="input-half">
                  <label className="input-label">Button Link</label>
                  <input
                    type="text"
                    value={buttonLink}
                    onChange={(e) => setButtonLink(e.target.value)}
                    className="repliq-input"
                    placeholder="https://..."
                  />
                </div>
              </div>
              
              <div className="color-pickers">
                <div className="color-picker-group">
                  <label className="input-label">Background</label>
                  <ColorPicker color={bgColor} onChange={setBgColor} />
                </div>
                <div className="color-picker-group">
                  <label className="input-label">Text</label>
                  <ColorPicker color={textColor} onChange={setTextColor} />
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Display Options */}
          <div className="repliq-section">
            <h3 className="repliq-section-title">
              <span>🎨</span> 5. Display Options
            </h3>
            
            <div className="toggle-row">
              <label className="checkbox-label">
                <input type="checkbox" checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} className="checkbox" />
                Dark mode
              </label>
            </div>
            
            <div className="toggle-row">
              <label className="checkbox-label">
                <input type="checkbox" checked={scrollBehavior === 'down'} onChange={(e) => setScrollBehavior(e.target.checked ? 'down' : 'static')} className="checkbox" />
                <span>Scroll animation ↓</span>
              </label>
            </div>
            
            <div className="toggle-row">
              <label className="checkbox-label">
                <input type="checkbox" checked={mouseDisplay === 'moving'} onChange={(e) => setMouseDisplay(e.target.checked ? 'moving' : 'static')} className="checkbox" />
                <span>Moving mouse ↗</span>
              </label>
            </div>
          </div>

          {/* Create Button */}
          <button 
            onClick={startVideoCreation}
            disabled={isCreating}
            className="create-button"
          >
            {isCreating ? '⏳ Creating...' : '🚀 START VIDEO CREATION'}
          </button>
        </div>

        {/* Right Panel - Live Preview */}
        <div className="repliq-preview-panel">
          <div className="preview-header">
            <h3 className="preview-title">Live Preview</h3>
            {leads.length > 0 && (
              <div className="lead-selector">
                <button
                  onClick={() => setCurrentLeadIndex(Math.max(0, currentLeadIndex - 1))}
                  disabled={currentLeadIndex === 0}
                  className="lead-nav-btn"
                >
                  ←
                </button>
                <span className="lead-counter">Lead {currentLeadIndex + 1} of {leads.length}</span>
                <button
                  onClick={() => setCurrentLeadIndex(Math.min(leads.length - 1, currentLeadIndex + 1))}
                  disabled={currentLeadIndex >= leads.length - 1}
                  className="lead-nav-btn"
                >
                  →
                </button>
              </div>
            )}
          </div>

          {/* Browser Preview */}
          <div className="browser-window">
            <div className="browser-chrome">
              <div className="browser-dots">
                <span className="browser-dot red" />
                <span className="browser-dot yellow" />
                <span className="browser-dot green" />
              </div>
              <div className="url-bar">
                {currentLead.websiteUrl || 'https://yourprospect.com'}
              </div>
            </div>
            
            <div className={`browser-content ${darkMode ? 'dark' : ''}`}>
              {/* Website iframe preview */}
              {currentLead.websiteUrl && currentLead.websiteUrl.startsWith('http') ? (
                <iframe 
                  src={currentLead.websiteUrl}
                  className="website-preview-iframe"
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    position: 'absolute',
                    top: 0,
                    left: 0
                  }}
                  sandbox="allow-scripts allow-same-origin"
                  loading="lazy"
                  title="Website Preview"
                />
              ) : (
                <div className="mock-site">
                  <div className={`mock-header ${darkMode ? 'dark' : ''}`}>
                    <div className="mock-logo" />
                    <div className="mock-nav">
                      <div className="mock-nav-item" />
                      <div className="mock-nav-item" />
                      <div className="mock-nav-item" />
                    </div>
                  </div>
                  <div className="mock-hero">
                    <h2 className="mock-hero-title" style={{ color: darkMode ? '#fff' : '#333' }}>
                      {currentLead.companyName || 'Your Prospect'}
                    </h2>
                    <h1 className="mock-hero-subtitle">
                      Website Preview
                    </h1>
                    <p className="mock-hero-text" style={{ color: darkMode ? 'rgba(255,255,255,0.6)' : '#666' }}>
                      Upload CSV with website URLs to see actual websites
                    </p>
                    <button className="mock-cta">LEARN MORE</button>
                  </div>
                </div>
              )}
              
              <div 
                className={`video-bubble ${phase === 'expanded' && videoMode === 'fullscreen' ? 'fullscreen-expanded' : ''}`}
                style={bubbleStyles}
              >
                {introVideo ? (
                  <video
                    ref={introVideoRef}
                    src={introVideo}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    muted
                    playsInline
                  />
                ) : (
                  <div className="placeholder-bubble">
                    <span style={{ fontSize: phase === 'expanded' && videoMode === 'fullscreen' ? '80px' : '40px' }}>👤</span>
                  </div>
                )}
                
                {isPlaying && phase === 'intro' && (
                  <div className="pulse-ring" />
                )}
              </div>
              
              {useSecondVideo && secondVideo && phase === 'expanded' && videoMode === 'fullscreen' && (
                <video
                  ref={secondVideoRef}
                  src={secondVideo}
                  className="fullscreen-video"
                  muted
                  playsInline
                />
              )}
            </div>
          </div>

          {/* Video Info Card */}
          <div className="info-card">
            <div>
              <span className="repliq-brand">°RepliQ</span>
            </div>
            <div className="info-center">
              <p className="info-title">{videoTitle}</p>
              <p className="info-name">
                <span className="var-highlight">@{currentLead.firstName}</span>
                {' '}
                <span className="var-highlight">@{currentLead.companyName}</span>
              </p>
            </div>
            {buttonText && (
              <button className="cta-preview" style={{ background: bgColor, color: textColor }}>
                {buttonText}
              </button>
            )}
          </div>

          {/* Preview Controls */}
          <div className="preview-controls">
            {!isPlaying ? (
              <button onClick={startPreview} className="play-btn">
                ▶ Play Preview
              </button>
            ) : (
              <button onClick={resetPreview} className="stop-btn">
                ⏹ Reset
              </button>
            )}
            <div className="phase-indicator">
              <span className={`phase-dot ${phase === 'intro' ? 'active' : ''}`} />
              <span className={`phase-dot ${phase === 'transitioning' ? 'active' : ''}`} />
              <span className={`phase-dot ${phase === 'expanded' ? 'active' : ''}`} />
              <span className="phase-text">
                {phase === 'intro' ? 'Bubble' : phase === 'transitioning' ? 'Transitioning...' : videoMode === 'fullscreen' ? 'Fullscreen' : 'Expanded'}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="stats-row">
            <div className="stat-box">
              <span className="stat-value">{leads.length || 0}</span>
              <span className="stat-label">Leads</span>
            </div>
            <div className="stat-box">
              <span className="stat-value">{transitionTime}s</span>
              <span className="stat-label">Transition</span>
            </div>
            <div className="stat-box">
              <span className="stat-value">{videoMode}</span>
              <span className="stat-label">Mode</span>
            </div>
          </div>
        </div>
      </div>

      {/* Creation Progress Modal */}
      {isCreating && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-icon">🎬</div>
            <h2 className="modal-title">Creating Your Videos</h2>
            <p className="modal-subtitle">
              Processing: {currentProcessingLead?.firstName} {currentProcessingLead?.companyName}
            </p>
            
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${creationProgress}%` }} />
            </div>
            <p className="progress-text">{creationProgress}% Complete</p>
            
            <p className="modal-note">
              Generating landing pages with video overlays...
            </p>
          </div>
        </div>
      )}

      {/* Results Modal - FIXED with actual download options */}
      {showResults && (
        <div className="modal-overlay">
          <div className="results-modal">
            <button onClick={() => setShowResults(false)} className="close-btn">×</button>
            
            <div className="success-icon">✅</div>
            <h2 className="modal-title">Videos Created Successfully!</h2>
            <p className="modal-subtitle">
              {createdVideos.length} personalized landing pages are ready
            </p>
            
            {/* Sample Results */}
            <div className="results-preview">
              <p className="results-title">Generated Landing Pages</p>
              {createdVideos.slice(0, 5).map((video, i) => (
                <div key={i} className="result-item">
                  <span className="result-name">{video.firstName} - {video.lastName}</span>
                  <div className="result-actions">
                    <button 
                      onClick={() => downloadLandingPage(video)} 
                      className="result-download-btn"
                      title="Download Landing Page HTML"
                    >
                      📥 Download
                    </button>
                  </div>
                </div>
              ))}
              {createdVideos.length > 5 && (
                <p className="more-results">+{createdVideos.length - 5} more videos</p>
              )}
            </div>
            
            <div className="export-buttons">
              <button onClick={handleExportCSV} className="export-button">
                📥 Export CSV with Links
              </button>
              <button onClick={downloadAllLandingPages} className="export-button secondary">
                📦 Download All HTML Files
              </button>
            </div>
            <p className="export-note">
              CSV includes Landing Page links and Video-only links for each lead
            </p>
          </div>
        </div>
      )}
    </div>
  );
}