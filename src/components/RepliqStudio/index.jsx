// FILE: src/components/RepliqStudio/index.jsx
// MAIN REPLIQSTUDIO COMPONENT - Single page layout with video bubble over website background
import React, { useState, useRef, useEffect } from 'react';
import { saveRepliqVideo, getAllRepliqVideos, deleteRepliqVideo, deleteAllRepliqVideos } from '../../api/repliqVideos';
import { exportVideosCSV } from '../../utils/csv';
import './styles.css';

// Generate unique ID
const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

// File to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Delay helper
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Simple CSV parser
const parseCSV = (text) => {
  const lines = text.split('\n');
  return lines.map(line => {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  }).filter(row => row.some(cell => cell));
};

export default function RepliqStudio({ onNavigateToBuilder, importedCSV }) {
  // Video upload state
  const [introVideoUrl, setIntroVideoUrl] = useState(null);
  const [introVideoData, setIntroVideoData] = useState(null);
  const [secondVideoUrl, setSecondVideoUrl] = useState(null);
  const [secondVideoData, setSecondVideoData] = useState(null);
  const introInputRef = useRef(null);
  const secondInputRef = useRef(null);

  // CSV state
  const [csvData, setCsvData] = useState([]);
  const [leads, setLeads] = useState([]);
  const [mapping, setMapping] = useState({ websiteUrl: '', firstName: '', companyName: '' });
  const csvInputRef = useRef(null);

  // Settings
  const [settings, setSettings] = useState({
    displayMode: 'small-bubble', // 'small-bubble', 'big-bubble', 'full-screen'
    transitionTime: 10,
    useSecondVideo: false,
    videoTitle: 'A video for you 👋',
    videoPosition: 'bottom-left', // 'bottom-left', 'bottom-right', 'top-left', 'top-right'
    videoShape: 'circle', // 'circle', 'square', 'rounded'
    buttonText: 'Book a Call',
    buttonLink: '',
    textColor: '#ffffff',
    backgroundColor: '#667eea',
    darkMode: true,
    displayTab: true
  });

  // Creation state
  const [isCreating, setIsCreating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [createdVideos, setCreatedVideos] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // Saved videos from database
  const [savedVideos, setSavedVideos] = useState([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);

  // Load saved videos on mount
  useEffect(() => {
    loadSavedVideos();
  }, []);

  const loadSavedVideos = async () => {
    setIsLoadingVideos(true);
    try {
      const videos = await getAllRepliqVideos();
      setSavedVideos(videos);
    } catch (error) {
      console.error('Failed to load videos:', error);
    }
    setIsLoadingVideos(false);
  };

  // Handle video uploads
  const handleIntroUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const url = URL.createObjectURL(file);
    setIntroVideoUrl(url);
    
    const base64 = await fileToBase64(file);
    setIntroVideoData(base64);
  };

  const handleSecondUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const url = URL.createObjectURL(file);
    setSecondVideoUrl(url);
    
    const base64 = await fileToBase64(file);
    setSecondVideoData(base64);
  };

  // Handle CSV upload
  const handleCSVUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const rows = parseCSV(text);
      setCsvData(rows);
    };
    reader.readAsText(file);
  };

  // Handle imported CSV from props
  useEffect(() => {
    if (importedCSV && importedCSV.length > 0) {
      setCsvData(importedCSV);
    }
  }, [importedCSV]);

  // Update leads when CSV or mapping changes
  useEffect(() => {
    if (csvData.length > 1 && mapping.companyName) {
      const headers = csvData[0];
      const newLeads = [];
      for (let i = 1; i < csvData.length; i++) {
        const row = csvData[i];
        if (row && row.length > 0) {
          newLeads.push({
            websiteUrl: mapping.websiteUrl ? row[headers.indexOf(mapping.websiteUrl)] : '',
            firstName: mapping.firstName ? row[headers.indexOf(mapping.firstName)] : '',
            companyName: mapping.companyName ? row[headers.indexOf(mapping.companyName)] : ''
          });
        }
      }
      setLeads(newLeads.filter(l => l.companyName || l.firstName));
    }
  }, [csvData, mapping]);

  const update = (key, value) => setSettings(prev => ({ ...prev, [key]: value }));

  // Generate landing page HTML with video bubble over website background
  const generateLandingPageHTML = (lead, videoId) => {
    const greetingName = lead.companyName || lead.firstName || 'there';
    const websiteUrl = lead.websiteUrl || '';
    
    // Video bubble position styles
    const positionStyles = {
      'bottom-left': 'bottom: 20px; left: 20px;',
      'bottom-right': 'bottom: 20px; right: 20px;',
      'top-left': 'top: 20px; left: 20px;',
      'top-right': 'top: 20px; right: 20px;'
    };
    
    // Video bubble size based on display mode
    const bubbleSizes = {
      'small-bubble': { initial: '120px', expanded: '200px' },
      'big-bubble': { initial: '200px', expanded: '350px' },
      'full-screen': { initial: '120px', expanded: '100%' }
    };
    
    // Video shape styles
    const shapeStyles = {
      'circle': 'border-radius: 50%;',
      'square': 'border-radius: 8px;',
      'rounded': 'border-radius: 16px;'
    };

    const bubbleSize = bubbleSizes[settings.displayMode] || bubbleSizes['small-bubble'];
    const position = positionStyles[settings.videoPosition] || positionStyles['bottom-left'];
    const shape = shapeStyles[settings.videoShape] || shapeStyles['circle'];

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hi ${greetingName} - ${settings.videoTitle}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      overflow: hidden;
      height: 100vh;
      width: 100vw;
    }
    
    /* Website Background - Full Screen iframe */
    .website-background {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: none;
      z-index: 1;
    }
    
    .website-fallback {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: ${settings.darkMode ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'};
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 1;
      color: ${settings.darkMode ? '#fff' : '#1a1a2e'};
    }
    
    .fallback-greeting {
      font-size: 3rem;
      font-weight: 800;
      margin-bottom: 20px;
      text-align: center;
    }
    
    .fallback-greeting .name {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .fallback-subtitle {
      font-size: 1.2rem;
      opacity: 0.8;
      margin-bottom: 40px;
    }
    
    /* Video Bubble Container */
    .video-bubble {
      position: fixed;
      ${position}
      z-index: 1000;
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
    }
    
    .video-bubble.initial {
      width: ${bubbleSize.initial};
      height: ${bubbleSize.initial};
    }
    
    .video-bubble.expanded {
      ${settings.displayMode === 'full-screen' ? `
        width: 100vw;
        height: 100vh;
        top: 0 !important;
        left: 0 !important;
        bottom: auto !important;
        right: auto !important;
        border-radius: 0 !important;
      ` : `
        width: ${bubbleSize.expanded};
        height: ${bubbleSize.expanded};
      `}
    }
    
    .video-bubble video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      ${settings.displayMode !== 'full-screen' ? shape : ''}
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
      transition: border-radius 0.5s ease;
    }
    
    .video-bubble.expanded video {
      ${settings.displayMode === 'full-screen' ? 'border-radius: 0; object-fit: contain; background: #000;' : ''}
    }
    
    /* Play overlay on bubble */
    .bubble-play-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      ${settings.displayMode !== 'full-screen' ? shape : ''}
      cursor: pointer;
      transition: opacity 0.3s;
    }
    
    .bubble-play-overlay.hidden {
      opacity: 0;
      pointer-events: none;
    }
    
    .bubble-play-btn {
      width: 50px;
      height: 50px;
      background: rgba(255,255,255,0.95);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .bubble-play-icon {
      width: 0;
      height: 0;
      border-left: 16px solid #1a1a2e;
      border-top: 10px solid transparent;
      border-bottom: 10px solid transparent;
      margin-left: 4px;
    }
    
    /* Greeting overlay on video */
    .greeting-overlay {
      position: absolute;
      top: -60px;
      left: 50%;
      transform: translateX(-50%);
      background: ${settings.backgroundColor};
      color: ${settings.textColor};
      padding: 12px 24px;
      border-radius: 30px;
      font-weight: 600;
      font-size: 14px;
      white-space: nowrap;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      opacity: 1;
      transition: opacity 0.3s;
    }
    
    .greeting-overlay.hidden {
      opacity: 0;
    }
    
    /* CTA Button */
    .cta-button {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      padding: 16px 40px;
      background: ${settings.backgroundColor};
      color: ${settings.textColor};
      text-decoration: none;
      border-radius: 50px;
      font-size: 1.1rem;
      font-weight: 600;
      box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
      z-index: 999;
      transition: all 0.3s;
    }
    
    .cta-button:hover {
      transform: translateX(-50%) translateY(-2px);
      box-shadow: 0 6px 30px rgba(102, 126, 234, 0.6);
    }
    
    /* Minimize button for expanded state */
    .minimize-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 32px;
      height: 32px;
      background: rgba(255,255,255,0.9);
      border: none;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      opacity: 0;
      transition: opacity 0.3s;
      z-index: 10;
    }
    
    .video-bubble.expanded .minimize-btn {
      opacity: 1;
    }
    
    /* Powered by */
    .powered-by {
      position: fixed;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 0.85rem;
      color: ${settings.darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)'};
      z-index: 998;
    }
    
    .powered-by span {
      color: #667eea;
      font-weight: 600;
    }
    
    @media (max-width: 768px) {
      .video-bubble.initial {
        width: 100px;
        height: 100px;
      }
      .video-bubble.expanded {
        width: ${settings.displayMode === 'full-screen' ? '100vw' : '280px'};
        height: ${settings.displayMode === 'full-screen' ? '100vh' : '280px'};
      }
      .greeting-overlay {
        font-size: 12px;
        padding: 8px 16px;
      }
      .cta-button {
        padding: 12px 28px;
        font-size: 1rem;
      }
    }
  </style>
</head>
<body>
  <!-- Website Background -->
  ${websiteUrl ? `
  <iframe 
    src="${websiteUrl}" 
    class="website-background" 
    id="websiteFrame"
    sandbox="allow-same-origin allow-scripts"
    loading="lazy"
  ></iframe>
  ` : `
  <div class="website-fallback">
    <h1 class="fallback-greeting">Hi <span class="name">${greetingName}</span> 👋</h1>
    <p class="fallback-subtitle">${settings.videoTitle}</p>
  </div>
  `}
  
  <!-- Video Bubble (like Loom) -->
  <div class="video-bubble initial" id="videoBubble">
    <div class="greeting-overlay" id="greetingOverlay">
      Hi ${greetingName}! 👋
    </div>
    
    <video id="mainVideo" playsinline preload="auto" muted>
      <source src="VIDEO_DATA_PLACEHOLDER" type="video/mp4">
    </video>
    
    <div class="bubble-play-overlay" id="playOverlay">
      <div class="bubble-play-btn">
        <div class="bubble-play-icon"></div>
      </div>
    </div>
    
    <button class="minimize-btn" id="minimizeBtn" title="Minimize">−</button>
  </div>
  
  ${settings.buttonLink ? `
  <a href="${settings.buttonLink}" class="cta-button" target="_blank">
    ${settings.buttonText || 'Book a Call'}
  </a>
  <p class="powered-by">Powered by <span>°RepliQ</span></p>
  ` : ''}
  
  <script>
    const video = document.getElementById('mainVideo');
    const bubble = document.getElementById('videoBubble');
    const playOverlay = document.getElementById('playOverlay');
    const greetingOverlay = document.getElementById('greetingOverlay');
    const minimizeBtn = document.getElementById('minimizeBtn');
    
    let isExpanded = false;
    let transitionTimer = null;
    const transitionTime = ${settings.transitionTime} * 1000;
    const displayMode = '${settings.displayMode}';
    
    // Handle iframe load errors
    const iframe = document.getElementById('websiteFrame');
    if (iframe) {
      iframe.onerror = function() {
        iframe.style.display = 'none';
        document.body.innerHTML += '<div class="website-fallback"><h1 class="fallback-greeting">Hi <span class="name">${greetingName}</span> 👋</h1><p class="fallback-subtitle">${settings.videoTitle}</p></div>' + document.body.innerHTML;
      };
    }
    
    function playVideo() {
      video.muted = false;
      video.play();
      playOverlay.classList.add('hidden');
      
      // Start transition timer
      transitionTimer = setTimeout(() => {
        expandVideo();
      }, transitionTime);
    }
    
    function expandVideo() {
      if (!isExpanded) {
        isExpanded = true;
        bubble.classList.remove('initial');
        bubble.classList.add('expanded');
        greetingOverlay.classList.add('hidden');
      }
    }
    
    function minimizeVideo() {
      if (isExpanded && displayMode !== 'full-screen') {
        isExpanded = false;
        bubble.classList.remove('expanded');
        bubble.classList.add('initial');
        greetingOverlay.classList.remove('hidden');
      }
    }
    
    // Click on bubble to play
    bubble.addEventListener('click', function(e) {
      if (e.target === minimizeBtn || e.target.closest('.minimize-btn')) return;
      
      if (video.paused) {
        playVideo();
      } else if (!isExpanded) {
        expandVideo();
      }
    });
    
    // Minimize button
    minimizeBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      minimizeVideo();
    });
    
    // Video ended
    video.addEventListener('ended', function() {
      playOverlay.classList.remove('hidden');
      if (transitionTimer) clearTimeout(transitionTimer);
    });
    
    // Auto-play after 2 seconds
    setTimeout(() => {
      playVideo();
    }, 2000);
  </script>
</body>
</html>`;
  };

  // Generate video-only HTML
  const generateVideoOnlyHTML = (lead) => {
    const greetingName = lead.companyName || lead.firstName || 'there';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Video for ${greetingName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: ${settings.darkMode ? '#1a1a2e' : '#f5f5f5'};
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    video {
      max-width: 100%;
      max-height: 100vh;
    }
  </style>
</head>
<body>
  <video controls autoplay playsinline>
    <source src="VIDEO_DATA_PLACEHOLDER" type="video/mp4">
  </video>
</body>
</html>`;
  };

  // Main create function - saves to PostgreSQL
  const handleCreate = async () => {
    if (!introVideoData) {
      alert('Please upload an intro video first!');
      return;
    }
    if (leads.length === 0) {
      alert('Please upload a CSV with leads and map the columns!');
      return;
    }

    setIsCreating(true);
    setProgress(0);
    setCreatedVideos([]);
    setShowResults(false);

    const baseUrl = window.location.origin + window.location.pathname;
    const generatedVideos = [];

    for (let i = 0; i < leads.length; i++) {
      const lead = leads[i];
      setProgress(Math.round(((i + 1) / leads.length) * 100));

      const videoId = generateUniqueId();
      
      // Generate HTML with placeholder for video
      let landingPageHtml = generateLandingPageHTML(lead, videoId);
      let videoOnlyHtml = generateVideoOnlyHTML(lead);
      
      // Replace placeholder with actual video data
      landingPageHtml = landingPageHtml.replace('VIDEO_DATA_PLACEHOLDER', introVideoData);
      videoOnlyHtml = videoOnlyHtml.replace('VIDEO_DATA_PLACEHOLDER', introVideoData);
      
      const landingPageLink = `${baseUrl}#landing-${videoId}`;
      const videoOnlyLink = `${baseUrl}#video-${videoId}`;

      // Save to PostgreSQL
      try {
        const videoData = {
          id: videoId,
          leadData: lead,
          settings: {
            ...settings,
            videoTitle: settings.videoTitle,
            buttonText: settings.buttonText,
            buttonLink: settings.buttonLink
          },
          videoData: introVideoData,
          secondVideoData: settings.useSecondVideo ? secondVideoData : null,
          landingPageHtml,
          videoOnlyHtml,
          landingPageLink,
          videoOnlyLink,
          websiteUrl: lead.websiteUrl,
          companyName: lead.companyName,
          firstName: lead.firstName
        };

        const result = await saveRepliqVideo(videoData);
        
        if (result.success) {
          generatedVideos.push({
            id: videoId,
            success: 'YES',
            originUrl: lead.websiteUrl,
            firstName: lead.firstName,
            companyName: lead.companyName,
            landingPageLink,
            videoOnlyLink
          });
        } else {
          generatedVideos.push({
            id: videoId,
            success: 'FAILED',
            originUrl: lead.websiteUrl,
            firstName: lead.firstName,
            companyName: lead.companyName,
            landingPageLink: '',
            videoOnlyLink: ''
          });
        }
      } catch (error) {
        console.error('Failed to save video:', error);
        generatedVideos.push({
          id: videoId,
          success: 'ERROR',
          originUrl: lead.websiteUrl,
          firstName: lead.firstName,
          companyName: lead.companyName,
          landingPageLink: '',
          videoOnlyLink: ''
        });
      }

      // Small delay between saves
      await delay(100);
    }

    setCreatedVideos(generatedVideos);
    setIsCreating(false);
    setShowResults(true);
    
    // Reload saved videos list
    loadSavedVideos();
  };

  // Export CSV
  const handleExportCSV = () => {
    if (createdVideos.length === 0) {
      alert('No videos to export. Create some first!');
      return;
    }
    exportVideosCSV(createdVideos);
  };

  // Delete video
  const handleDeleteVideo = async (videoId) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await deleteRepliqVideo(videoId);
        setSavedVideos(prev => prev.filter(v => v.id !== videoId));
      } catch (error) {
        console.error('Failed to delete video:', error);
        alert('Failed to delete video.');
      }
    }
  };

  // Delete all videos
  const handleDeleteAllVideos = async () => {
    if (savedVideos.length === 0) {
      alert('No videos to delete.');
      return;
    }
    
    if (window.confirm(`Delete ALL ${savedVideos.length} videos? This cannot be undone!`)) {
      try {
        await deleteAllRepliqVideos();
        setSavedVideos([]);
      } catch (error) {
        console.error('Failed to delete all videos:', error);
        alert('Failed to delete videos.');
      }
    }
  };

  // Copy link to clipboard
  const copyLink = (link) => {
    navigator.clipboard.writeText(link);
  };

  const csvHeaders = csvData[0] || [];

  return (
    <div className="repliq-studio">
      {/* Header */}
      <header className="studio-header">
        <button onClick={onNavigateToBuilder} className="back-button">← Back to Builder</button>
        <h1>°RepliQ Studio</h1>
        <p>Create personalized video landing pages with website backgrounds</p>
      </header>

      {/* Two Column Layout */}
      <div className="studio-grid">
        {/* LEFT COLUMN - All Controls */}
        <div className="studio-column studio-controls">
          {/* Video Upload */}
          <section className="studio-card">
            <h3>📹 Video Upload</h3>
            <input ref={introInputRef} type="file" accept="video/*" onChange={handleIntroUpload} style={{display:'none'}} />
            <button onClick={() => introInputRef.current?.click()} className={`upload-btn ${introVideoUrl ? 'active' : ''}`}>
              {introVideoUrl ? '✓ Intro Video Uploaded' : 'Upload Intro Video'}
            </button>
            
            <label className="checkbox-label">
              <input type="checkbox" checked={settings.useSecondVideo} onChange={e => update('useSecondVideo', e.target.checked)} />
              Use second video after transition
            </label>
            
            {settings.useSecondVideo && (
              <>
                <input ref={secondInputRef} type="file" accept="video/*" onChange={handleSecondUpload} style={{display:'none'}} />
                <button onClick={() => secondInputRef.current?.click()} className={`upload-btn ${secondVideoUrl ? 'active' : ''}`}>
                  {secondVideoUrl ? '✓ Second Video Uploaded' : 'Upload Second Video'}
                </button>
              </>
            )}
          </section>

          {/* CSV Upload */}
          <section className="studio-card">
            <h3>📊 Lead Data (CSV)</h3>
            <input ref={csvInputRef} type="file" accept=".csv" onChange={handleCSVUpload} style={{display:'none'}} />
            <button onClick={() => csvInputRef.current?.click()} className={`upload-btn ${csvData.length > 0 ? 'active' : ''}`}>
              {csvData.length > 0 ? `✓ ${leads.length} Leads Loaded` : 'Upload CSV'}
            </button>
            
            {csvHeaders.length > 0 && (
              <div className="csv-mapping">
                <h4>Map Columns:</h4>
                <div className="mapping-row">
                  <label>Company Name *</label>
                  <select value={mapping.companyName} onChange={e => setMapping(prev => ({...prev, companyName: e.target.value}))}>
                    <option value="">Select...</option>
                    {csvHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
                <div className="mapping-row">
                  <label>First Name</label>
                  <select value={mapping.firstName} onChange={e => setMapping(prev => ({...prev, firstName: e.target.value}))}>
                    <option value="">Select...</option>
                    {csvHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
                <div className="mapping-row">
                  <label>Website URL (Background) *</label>
                  <select value={mapping.websiteUrl} onChange={e => setMapping(prev => ({...prev, websiteUrl: e.target.value}))}>
                    <option value="">Select...</option>
                    {csvHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
              </div>
            )}
          </section>

          {/* Display Mode */}
          <section className="studio-card">
            <h3>🎬 Video Display</h3>
            <div className="display-selector">
              <label>After</label>
              <select value={settings.transitionTime} onChange={e => update('transitionTime', Number(e.target.value))}>
                {[5,10,15,20,30,45,60].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <span>seconds transition to:</span>
            </div>
            <div className="display-modes">
              {[
                {id:'small-bubble', label:'Small bubble', icon:'○'},
                {id:'big-bubble', label:'Big bubble', icon:'◉'},
                {id:'full-screen', label:'Full screen', icon:'▭'}
              ].map(mode => (
                <button
                  key={mode.id}
                  className={`mode-btn ${settings.displayMode === mode.id ? 'active' : ''}`}
                  onClick={() => update('displayMode', mode.id)}
                >
                  <div className="mode-icon">{mode.icon}</div>
                  <div className="mode-label">{mode.label}</div>
                </button>
              ))}
            </div>
            
            <div className="settings-grid" style={{marginTop: '16px'}}>
              <div className="setting-field">
                <label>Video Position</label>
                <select value={settings.videoPosition} onChange={e => update('videoPosition', e.target.value)}>
                  {['bottom-left','bottom-right','top-left','top-right'].map(p => <option key={p} value={p}>{p.replace('-', ' ')}</option>)}
                </select>
              </div>
              <div className="setting-field">
                <label>Video Shape</label>
                <select value={settings.videoShape} onChange={e => update('videoShape', e.target.value)}>
                  {['circle','square','rounded'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </section>

          {/* Page Customization */}
          <section className="studio-card">
            <h3>⚙️ Page Customization</h3>
            <div className="settings-grid">
              <div className="setting-field full">
                <label>Video Title / Message</label>
                <input type="text" value={settings.videoTitle} onChange={e => update('videoTitle', e.target.value)} placeholder="A video for you 👋" />
              </div>
              <div className="setting-field">
                <label>Button Text</label>
                <input type="text" value={settings.buttonText} onChange={e => update('buttonText', e.target.value)} maxLength={40} />
              </div>
              <div className="setting-field">
                <label>Button Link</label>
                <input type="text" value={settings.buttonLink} onChange={e => update('buttonLink', e.target.value)} placeholder="https://calendly.com/..." />
              </div>
              <div className="color-grid">
                <div className="color-field">
                  <label>Text</label>
                  <input type="color" value={settings.textColor} onChange={e => update('textColor', e.target.value)} />
                </div>
                <div className="color-field">
                  <label>Background</label>
                  <input type="color" value={settings.backgroundColor} onChange={e => update('backgroundColor', e.target.value)} />
                </div>
              </div>
              <div className="checkbox-grid">
                <label className="checkbox-label">
                  <input type="checkbox" checked={settings.darkMode} onChange={e => update('darkMode', e.target.checked)} />
                  Dark mode (fallback)
                </label>
              </div>
            </div>
          </section>

          {/* Create Button */}
          <button
            onClick={handleCreate}
            disabled={isCreating || !introVideoData || leads.length === 0}
            className="create-btn"
          >
            {isCreating ? `Creating... ${progress}%` : `🚀 Create ${leads.length || 0} Video Landing Pages`}
          </button>
        </div>

        {/* RIGHT COLUMN - Preview & Results */}
        <div className="studio-column studio-preview">
          {/* Preview */}
          <section className="studio-card preview-card">
            <h3>Preview</h3>
            {introVideoUrl ? (
              <div className="preview-frame" style={{background: settings.darkMode ? '#1a1a2e' : '#f5f5f5', position: 'relative', minHeight: '400px'}}>
                {/* Simulated website background */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(135deg, ${settings.darkMode ? '#1a1a2e' : '#f5f5f5'} 0%, ${settings.darkMode ? '#16213e' : '#e2e8f0'} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{textAlign: 'center', color: settings.darkMode ? '#fff' : '#1a1a2e'}}>
                    <h2 style={{fontSize: '1.5rem', marginBottom: '8px'}}>
                      Hi <span style={{color: settings.backgroundColor}}>{leads[0]?.companyName || 'Company'}</span> 👋
                    </h2>
                    <p style={{opacity: 0.7}}>{settings.videoTitle}</p>
                    <p style={{fontSize: '0.8rem', marginTop: '20px', opacity: 0.5}}>
                      Website URL will appear as background
                    </p>
                  </div>
                </div>
                
                {/* Video bubble preview */}
                <div style={{
                  position: 'absolute',
                  [settings.videoPosition.includes('bottom') ? 'bottom' : 'top']: '20px',
                  [settings.videoPosition.includes('left') ? 'left' : 'right']: '20px',
                  width: settings.displayMode === 'small-bubble' ? '80px' : settings.displayMode === 'big-bubble' ? '120px' : '80px',
                  height: settings.displayMode === 'small-bubble' ? '80px' : settings.displayMode === 'big-bubble' ? '120px' : '80px',
                  borderRadius: settings.videoShape === 'circle' ? '50%' : settings.videoShape === 'rounded' ? '12px' : '8px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                }}>
                  <video src={introVideoUrl} style={{width: '100%', height: '100%', objectFit: 'cover'}} muted />
                  <div style={{
                    position: 'absolute',
                    top: '-40px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: settings.backgroundColor,
                    color: settings.textColor,
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '10px',
                    whiteSpace: 'nowrap'
                  }}>
                    Hi {leads[0]?.companyName || 'Company'}! 👋
                  </div>
                </div>
                
                {/* CTA button preview */}
                {settings.buttonLink && (
                  <button style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    padding: '10px 24px',
                    background: settings.backgroundColor,
                    color: settings.textColor,
                    border: 'none',
                    borderRadius: '50px',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                  }}>
                    {settings.buttonText}
                  </button>
                )}
              </div>
            ) : (
              <div className="preview-placeholder">
                <p>Upload a video to see preview</p>
              </div>
            )}
          </section>

          {/* Results Modal */}
          {showResults && createdVideos.length > 0 && (
            <section className="studio-card results-card">
              <h3>✅ Videos Created!</h3>
              <p style={{marginBottom: '16px', color: 'rgba(255,255,255,0.7)'}}>
                {createdVideos.filter(v => v.success === 'YES').length} of {createdVideos.length} landing pages saved
              </p>
              
              <div className="results-list">
                {createdVideos.slice(0, 5).map(video => (
                  <div key={video.id} className="result-item">
                    <span className="result-name">
                      <strong>{video.companyName || video.firstName}</strong>
                      <span className={`result-status ${video.success === 'YES' ? 'success' : 'failed'}`}>
                        {video.success}
                      </span>
                    </span>
                    {video.success === 'YES' && (
                      <div className="result-actions">
                        <a href={video.landingPageLink} target="_blank" rel="noopener noreferrer">🔗 View</a>
                        <button onClick={() => copyLink(video.landingPageLink)}>📋 Copy</button>
                      </div>
                    )}
                  </div>
                ))}
                {createdVideos.length > 5 && (
                  <p style={{textAlign: 'center', opacity: 0.7, marginTop: '12px'}}>
                    +{createdVideos.length - 5} more
                  </p>
                )}
              </div>
              
              <button onClick={handleExportCSV} className="export-btn">
                📥 Export CSV with Links
              </button>
              
              <button onClick={() => setShowResults(false)} className="close-results-btn">
                Close
              </button>
            </section>
          )}

          {/* Saved Videos */}
          <section className="studio-card">
            <div className="saved-header">
              <h3>💾 Saved Videos ({savedVideos.length})</h3>
              {savedVideos.length > 0 && (
                <button onClick={handleDeleteAllVideos} className="delete-all-btn">🗑️ Delete All</button>
              )}
            </div>
            
            {isLoadingVideos ? (
              <p style={{color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '20px'}}>Loading...</p>
            ) : savedVideos.length === 0 ? (
              <p style={{color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '20px'}}>
                No videos saved yet. Create some landing pages!
              </p>
            ) : (
              <div className="saved-list">
                {savedVideos.slice(0, 10).map(video => (
                  <div key={video.id} className="saved-item">
                    <div className="saved-info">
                      <span className="saved-name">{video.companyName || video.firstName || 'Unknown'}</span>
                      <span className="saved-date">{new Date(video.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="saved-actions">
                      <a href={video.landingPageLink} target="_blank" rel="noopener noreferrer" title="View">🔗</a>
                      <button onClick={() => copyLink(video.landingPageLink)} title="Copy Link">📋</button>
                      <button onClick={() => handleDeleteVideo(video.id)} title="Delete">🗑️</button>
                    </div>
                  </div>
                ))}
                {savedVideos.length > 10 && (
                  <p style={{textAlign: 'center', opacity: 0.7, marginTop: '12px'}}>
                    +{savedVideos.length - 10} more saved
                  </p>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}