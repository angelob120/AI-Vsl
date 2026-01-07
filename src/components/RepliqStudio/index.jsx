import React, { useState, useRef, useEffect } from 'react';
import { parseCSV, exportVideosCSV } from '../../utils/csv';
import { generateVideoId, delay, readFileAsText } from '../../utils/helpers';
import { ColorPicker } from '../shared';
import './styles.css';

export default function RepliqStudio({ onNavigateToBuilder, importedCSV }) {
  // Video uploads
  const [introVideo, setIntroVideo] = useState(null);
  const [secondVideo, setSecondVideo] = useState(null);
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
  const [textHoverColor, setTextHoverColor] = useState('#818cf8');
  const [bgHoverColor, setBgHoverColor] = useState('#60f5dc');
  const [displayTab, setDisplayTab] = useState(true);
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

  // ============================================
  // NEW: Handle imported CSV data from ContractorBuilder
  // ============================================
  useEffect(() => {
    if (importedCSV && Array.isArray(importedCSV) && importedCSV.length > 0) {
      setCsvData(importedCSV);
      
      // Set headers from first row
      const headers = importedCSV[0];
      setCsvHeaders(headers);
      setHeaderRowIndex(0);
      
      // Auto-map columns based on header names
      const headersLower = headers.map(h => (h || '').toLowerCase());
      setColumnMapping({
        websiteUrl: headers[headersLower.findIndex(h => h.includes('website') || h.includes('url') || h.includes('link'))] || '',
        firstName: headers[headersLower.findIndex(h => h.includes('first') || h.includes('name') || h.includes('owner'))] || '',
        companyName: headers[headersLower.findIndex(h => h.includes('company') || h.includes('business'))] || ''
      });
    }
  }, [importedCSV]);

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

  // Video handlers
  const handleIntroUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIntroVideo(URL.createObjectURL(file));
    }
  };

  const handleSecondUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setSecondVideo(URL.createObjectURL(file));
    }
  };

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

  // Start Video Creation
  const startVideoCreation = async () => {
    if (leads.length === 0) {
      alert('Please upload a CSV with leads first!');
      return;
    }
    if (!introVideo) {
      alert('Please upload an intro video first!');
      return;
    }

    setIsCreating(true);
    setCreationProgress(0);
    setCreatedVideos([]);
    setShowResults(false);

    const baseUrl = 'https://app.repliq.co';
    const generatedVideos = [];

    for (let i = 0; i < leads.length; i++) {
      const lead = leads[i];
      setCurrentProcessingLead(lead);
      setCreationProgress(Math.round(((i) / leads.length) * 100));

      // Simulate processing time
      await delay(300 + Math.random() * 500);

      const videoId = generateVideoId();
      const videoLink = `${baseUrl}/videos/${videoId}`;
      const mediaLink = `${baseUrl}/medias/${videoId}`;
      const backgroundLink = `${baseUrl}/background/${videoId}`;

      const videoHtmlEmail = `<a style="text-decoration:none;color:inherit;max-width:100%;" href="${videoLink}"><div style="display:block;"><img alt="" height="250" width="460" style="max-width:100%;background:url('${baseUrl}/loading/fekozf') no-repeat;display:block;background-position:center;" src="${mediaLink}" /></div><span style="display:inline-block;font-weight:bold;">Video for  <span style="text-decoration:underline;color:blue;">${lead.firstName} ${lead.companyName} - Watch Video</span></span></a>`;
      
      const shortVideoHtml = `<a href="${videoLink}"><img alt="" height="250" width="460" style="max-width: 100%;" src="${mediaLink}" /></a><br />`;
      
      const imgHtmlEmail = `<img alt="" height="250" width="460" style="max-width: 100%;" src="${mediaLink}" /><br />`;

      generatedVideos.push({
        id: i,
        success: 'YES',
        originUrl: lead.websiteUrl,
        firstName: lead.firstName,
        lastName: lead.companyName,
        videoLink,
        videoHtmlEmail,
        shortVideoHtml,
        videoPreview: mediaLink,
        backgroundImageLink: backgroundLink,
        imgHtmlEmail
      });
    }

    setCreatedVideos(generatedVideos);
    setCreationProgress(100);
    
    await delay(500);
    setIsCreating(false);
    setShowResults(true);
  };

  // Export CSV
  const handleExportCSV = () => {
    exportVideosCSV(createdVideos);
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
  };

  // Remove lead
  const removeLead = (id) => {
    const newData = csvData.filter((_, i) => i === 0 || csvData.slice(headerRowIndex + 1).findIndex((_, j) => j + 1 === id) !== i - headerRowIndex - 1);
    setCsvData(newData);
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
                
                <div className="leads-table">
                  <div className="leads-table-header">
                    <span>#</span>
                    <span>Website</span>
                    <span>Name</span>
                    <span>Company</span>
                    <span></span>
                  </div>
                  <div>
                    {leads.slice(0, 5).map((lead) => (
                      <div key={lead.id} className="leads-table-row">
                        <span className="leads-table-cell">{lead.id}</span>
                        <span className="leads-table-cell url">{lead.websiteUrl.slice(0, 20)}...</span>
                        <span className="leads-table-cell">{lead.firstName}</span>
                        <span className="leads-table-cell">{lead.companyName}</span>
                        <button onClick={() => removeLead(lead.id)} className="remove-btn">×</button>
                      </div>
                    ))}
                  </div>
                  {leads.length > 5 && (
                    <p className="more-leads">+{leads.length - 5} more leads...</p>
                  )}
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
              
              <div className="color-row">
                <ColorPicker label="Text" value={textColor} onChange={setTextColor} />
                <ColorPicker label="BG" value={bgColor} onChange={setBgColor} />
                <ColorPicker label="Hover Text" value={textHoverColor} onChange={setTextHoverColor} />
                <ColorPicker label="Hover BG" value={bgHoverColor} onChange={setBgHoverColor} />
              </div>
            </div>
            
            <div className="toggles-grid">
              <label className="toggle-item">
                <input type="checkbox" checked={displayTab} onChange={() => setDisplayTab(!displayTab)} className="checkbox" />
                <span>Display tab</span>
              </label>
              <label className="toggle-item">
                <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} className="checkbox" />
                <span>Dark mode</span>
              </label>
              <label className="toggle-item">
                <input type="checkbox" checked={scrollBehavior === 'down'} onChange={() => setScrollBehavior(scrollBehavior === 'down' ? 'none' : 'down')} className="checkbox" />
                <span>Scroll down ↓</span>
              </label>
              <label className="toggle-item">
                <input type="checkbox" checked={mouseDisplay === 'moving'} onChange={() => setMouseDisplay(mouseDisplay === 'moving' ? 'static' : 'moving')} className="checkbox" />
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
                    Find, Contact & Close
                  </h2>
                  <h1 className="mock-hero-subtitle">
                    Your Ideal Clients.
                  </h1>
                  <p className="mock-hero-text" style={{ color: darkMode ? 'rgba(255,255,255,0.6)' : '#666' }}>
                    Instantly turn leads into clients with Automated Outreach
                  </p>
                  <button className="mock-cta">START FOR FREE</button>
                </div>
              </div>
              
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
              {Math.round((leads.length * 0.5) - (creationProgress / 100 * leads.length * 0.5))}s remaining...
            </p>
          </div>
        </div>
      )}

      {/* Results Modal */}
      {showResults && (
        <div className="modal-overlay">
          <div className="results-modal">
            <button onClick={() => setShowResults(false)} className="close-btn">×</button>
            
            <div className="success-icon">✅</div>
            <h2 className="modal-title">Videos Created Successfully!</h2>
            <p className="modal-subtitle">
              {createdVideos.length} personalized videos are ready
            </p>
            
            {/* Sample Results */}
            <div className="results-preview">
              <p className="results-title">Sample Results</p>
              {createdVideos.slice(0, 3).map((video, i) => (
                <div key={i} className="result-item">
                  <span className="result-name">{video.firstName} - {video.lastName}</span>
                  <a href={video.videoLink} className="result-link" target="_blank" rel="noopener noreferrer">
                    View Video →
                  </a>
                </div>
              ))}
              {createdVideos.length > 3 && (
                <p className="more-results">+{createdVideos.length - 3} more videos</p>
              )}
            </div>
            
            <button onClick={handleExportCSV} className="export-button">
              📥 Export All to CSV
            </button>
            <p className="export-note">Download all video links and embed codes</p>
          </div>
        </div>
      )}
    </div>
  );
}