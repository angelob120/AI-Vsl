// FILE: src/components/RepliqStudio/index.jsx
// MAIN REPLIQSTUDIO COMPONENT - Single page layout with video bubble over website background
// UPDATED: Saves to database only - NO localStorage
import React, { useState, useRef, useEffect } from 'react';
import { saveRepliqVideo, getAllRepliqVideos, deleteRepliqVideo, deleteAllRepliqVideos } from '../../api/repliqVideos';
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

export default function RepliqStudio({ onNavigateToBuilder, importedCSV, isDarkMode = true }) {
  // REMOVED: Local theme state - now using isDarkMode prop from App.jsx

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
    buttonText: 'Book a Call',
    buttonLink: '',
    videoPosition: 'bottom-right',
    videoShape: 'circle',
    accentColor: '#667eea',
    textColor: '#ffffff',
    backgroundColor: '#667eea',
    darkMode: true
  });

  // Creation state
  const [isCreating, setIsCreating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [createdVideos, setCreatedVideos] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [savedVideos, setSavedVideos] = useState([]);

  // Load saved videos on mount
  useEffect(() => {
    loadSavedVideos();
  }, []);

  // Handle imported CSV from ContractorBuilder
  useEffect(() => {
    if (importedCSV && importedCSV.length > 0) {
      setCsvData(importedCSV);
      
      // Auto-detect column mapping from imported data
      const headers = importedCSV[0] || [];
      const newMapping = { websiteUrl: '', firstName: '', companyName: '' };
      
      headers.forEach((header, index) => {
        const h = header.toLowerCase();
        if (h.includes('website') || h.includes('link') || h.includes('url')) {
          newMapping.websiteUrl = header;
        } else if (h.includes('first') || h.includes('name') || h.includes('owner')) {
          newMapping.firstName = header;
        } else if (h.includes('company') || h.includes('business')) {
          newMapping.companyName = header;
        }
      });
      
      setMapping(newMapping);
      
      // Process leads from imported CSV
      const dataRows = importedCSV.slice(1);
      const processedLeads = dataRows.map(row => {
        const headerRow = importedCSV[0];
        const lead = {};
        headerRow.forEach((header, index) => {
          lead[header] = row[index] || '';
        });
        return lead;
      }).filter(lead => Object.values(lead).some(v => v));
      
      setLeads(processedLeads);
    }
  }, [importedCSV]);

  const loadSavedVideos = async () => {
    try {
      const videos = await getAllRepliqVideos();
      setSavedVideos(videos || []);
    } catch (error) {
      console.error('Failed to load saved videos:', error);
    }
  };

  // Update settings helper
  const update = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Handle video uploads
  const handleIntroUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const base64 = await fileToBase64(file);
      setIntroVideoUrl(url);
      setIntroVideoData(base64);
    }
  };

  const handleSecondUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const base64 = await fileToBase64(file);
      setSecondVideoUrl(url);
      setSecondVideoData(base64);
    }
  };

  // Handle CSV upload
  const handleCSVUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        const parsed = parseCSV(text);
        setCsvData(parsed);
        
        // Auto-detect mapping
        if (parsed.length > 0) {
          const headers = parsed[0];
          const newMapping = { websiteUrl: '', firstName: '', companyName: '' };
          
          headers.forEach(header => {
            const h = header.toLowerCase();
            if (h.includes('website') || h.includes('link') || h.includes('url')) {
              newMapping.websiteUrl = header;
            } else if (h.includes('first') || h.includes('name')) {
              newMapping.firstName = header;
            } else if (h.includes('company') || h.includes('business')) {
              newMapping.companyName = header;
            }
          });
          
          setMapping(newMapping);
        }
      };
      reader.readAsText(file);
    }
  };

  // Process leads when mapping changes
  useEffect(() => {
    if (csvData.length > 1 && mapping.companyName) {
      const headers = csvData[0];
      const dataRows = csvData.slice(1);
      
      const processed = dataRows.map(row => {
        const lead = {};
        headers.forEach((header, index) => {
          if (header === mapping.companyName) lead.companyName = row[index];
          if (header === mapping.firstName) lead.firstName = row[index];
          if (header === mapping.websiteUrl) lead.websiteUrl = row[index];
        });
        return lead;
      }).filter(lead => lead.companyName);
      
      setLeads(processed);
    }
  }, [csvData, mapping]);

  // Create videos - UPDATED: Database only, NO localStorage
  const handleCreate = async () => {
    if (!introVideoData) {
      alert('Please upload an intro video first!');
      return;
    }
    if (leads.length === 0) {
      alert('Please upload a CSV with leads first!');
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
      setProgress(Math.round((i / leads.length) * 100));
      
      await delay(100);

      const videoId = generateUniqueId();
      
      const landingPageLink = `${baseUrl}#landing-${videoId}`;
      const videoOnlyLink = `${baseUrl}#video-${videoId}`;

      // Prepare full data for database storage
      const dbData = {
        id: videoId,
        leadData: lead,
        settings: {
          ...settings,
          // Don't duplicate video data in settings - it's stored separately
          introVideoData: null,
          secondVideoData: null
        },
        videoData: introVideoData,
        secondVideoData: settings.useSecondVideo ? secondVideoData : null,
        landingPageLink,
        videoOnlyLink,
        websiteUrl: lead.websiteUrl,
        companyName: lead.companyName,
        firstName: lead.firstName
      };

      // Save directly to database (NO localStorage)
      let success = false;
      try {
        await saveRepliqVideo(dbData);
        success = true;
      } catch (e) {
        console.warn('Database save failed:', e);
      }

      const videoInfo = {
        id: videoId,
        success: success ? 'YES' : 'NO',
        companyName: lead.companyName,
        firstName: lead.firstName,
        websiteUrl: lead.websiteUrl,
        landingPageLink,
        videoOnlyLink,
        createdAt: new Date().toISOString()
      };

      generatedVideos.push(videoInfo);
    }

    setProgress(100);
    setCreatedVideos(generatedVideos);
    setShowResults(true);
    setIsCreating(false);
    
    // Refresh saved videos list
    await loadSavedVideos();
  };

  // Export results to CSV
  const handleExportResults = () => {
    if (createdVideos.length === 0) return;
    
    const csvContent = [
      ['Company Name', 'First Name', 'Website URL', 'Landing Page Link', 'Video Only Link', 'Success', 'Created At'],
      ...createdVideos.map(v => [
        v.companyName || '',
        v.firstName || '',
        v.websiteUrl || '',
        v.landingPageLink || '',
        v.videoOnlyLink || '',
        v.success || '',
        v.createdAt || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `repliq-videos-${Date.now()}.csv`;
    a.click();
  };

  // Export ALL saved videos to CSV
  const handleExportAllSaved = () => {
    if (savedVideos.length === 0) return;
    
    const csvContent = [
      ['Company Name', 'First Name', 'Website URL', 'Landing Page Link', 'Video Only Link', 'Created At'],
      ...savedVideos.map(v => [
        v.companyName || '',
        v.firstName || '',
        v.websiteUrl || '',
        v.landingPageLink || '',
        v.videoOnlyLink || '',
        v.createdAt || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `repliq-all-saved-videos-${Date.now()}.csv`;
    a.click();
  };

  // Delete a video - UPDATED: Database only, NO localStorage
  const handleDeleteVideo = async (videoId) => {
    if (window.confirm('Delete this video?')) {
      try {
        await deleteRepliqVideo(videoId);
        setSavedVideos(prev => prev.filter(v => v.id !== videoId));
        // REMOVED: localStorage.removeItem(`landing-page-${videoId}`);
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
    <div className={`repliq-studio ${isDarkMode ? 'dark' : 'light'}`}>
      {/* Header - REMOVED theme toggle button */}
      <header className={`studio-header ${isDarkMode ? 'dark' : 'light'}`}>
        <button onClick={onNavigateToBuilder} className={`back-button ${isDarkMode ? 'dark' : 'light'}`}>← Back to Builder</button>
        <h1>°RepliQ Studio</h1>
        <p>Create personalized video landing pages with website backgrounds</p>
        
        {/* REMOVED: Theme Toggle Button - now controlled by navbar in App.jsx */}
      </header>

      {/* Two Column Layout */}
      <div className="studio-grid">
        {/* LEFT COLUMN - All Controls */}
        <div className={`studio-column studio-controls ${isDarkMode ? 'dark' : 'light'}`}>
          {/* Video Upload */}
          <section className={`studio-card ${isDarkMode ? 'dark' : 'light'}`}>
            <h3>📹 Video Upload</h3>
            <input ref={introInputRef} type="file" accept="video/*" onChange={handleIntroUpload} style={{display:'none'}} />
            <button onClick={() => introInputRef.current?.click()} className={`upload-btn ${introVideoUrl ? 'active' : ''} ${isDarkMode ? 'dark' : 'light'}`}>
              {introVideoUrl ? '✓ Intro Video Uploaded' : 'Upload Intro Video'}
            </button>
            
            <label className={`checkbox-label ${isDarkMode ? 'dark' : 'light'}`}>
              <input type="checkbox" checked={settings.useSecondVideo} onChange={e => update('useSecondVideo', e.target.checked)} />
              Use second video after transition
            </label>
            
            {settings.useSecondVideo && (
              <>
                <input ref={secondInputRef} type="file" accept="video/*" onChange={handleSecondUpload} style={{display:'none'}} />
                <button onClick={() => secondInputRef.current?.click()} className={`upload-btn ${secondVideoUrl ? 'active' : ''} ${isDarkMode ? 'dark' : 'light'}`}>
                  {secondVideoUrl ? '✓ Second Video Uploaded' : 'Upload Second Video'}
                </button>
              </>
            )}
          </section>

          {/* CSV Upload */}
          <section className={`studio-card ${isDarkMode ? 'dark' : 'light'}`}>
            <h3>📊 Lead Data (CSV)</h3>
            <input ref={csvInputRef} type="file" accept=".csv" onChange={handleCSVUpload} style={{display:'none'}} />
            <button onClick={() => csvInputRef.current?.click()} className={`upload-btn ${csvData.length > 0 ? 'active' : ''} ${isDarkMode ? 'dark' : 'light'}`}>
              {csvData.length > 0 ? `✓ ${leads.length} Leads Loaded` : 'Upload CSV'}
            </button>
            
            {csvHeaders.length > 0 && (
              <div className={`csv-mapping ${isDarkMode ? 'dark' : 'light'}`}>
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
          <section className={`studio-card ${isDarkMode ? 'dark' : 'light'}`}>
            <h3>🎬 Video Display</h3>
            <div className={`display-selector ${isDarkMode ? 'dark' : 'light'}`}>
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
                  className={`mode-btn ${settings.displayMode === mode.id ? 'active' : ''} ${isDarkMode ? 'dark' : 'light'}`}
                  onClick={() => update('displayMode', mode.id)}
                >
                  <span className="mode-icon">{mode.icon}</span>
                  <span>{mode.label}</span>
                </button>
              ))}
            </div>
            
            {/* Position & Shape */}
            <div className="position-shape-row">
              <div className="setting-field">
                <label>Position</label>
                <select value={settings.videoPosition} onChange={e => update('videoPosition', e.target.value)}>
                  <option value="bottom-right">Bottom Right</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="top-right">Top Right</option>
                  <option value="top-left">Top Left</option>
                </select>
              </div>
              <div className="setting-field">
                <label>Shape</label>
                <select value={settings.videoShape} onChange={e => update('videoShape', e.target.value)}>
                  <option value="circle">Circle</option>
                  <option value="rounded">Rounded</option>
                  <option value="square">Square</option>
                </select>
              </div>
            </div>
          </section>

          {/* Page Customization */}
          <section className={`studio-card ${isDarkMode ? 'dark' : 'light'}`}>
            <h3>⚙️ Page Customization</h3>
            <div className={`settings-grid ${isDarkMode ? 'dark' : 'light'}`}>
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
                  <label>Accent</label>
                  <input type="color" value={settings.accentColor} onChange={e => update('accentColor', e.target.value)} />
                </div>
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
                <label className={`checkbox-label ${isDarkMode ? 'dark' : 'light'}`}>
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
            className={`create-btn ${isDarkMode ? 'dark' : 'light'}`}
          >
            {isCreating ? `Creating... ${progress}%` : `🚀 Create ${leads.length || 0} Video Landing Pages`}
          </button>
        </div>

        {/* RIGHT COLUMN - Preview & Results */}
        <div className={`studio-column studio-preview ${isDarkMode ? 'dark' : 'light'}`}>
          {/* Preview */}
          <section className={`studio-card preview-card ${isDarkMode ? 'dark' : 'light'}`}>
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
                  width: settings.displayMode === 'small-bubble' ? '120px' : settings.displayMode === 'big-bubble' ? '200px' : '100%',
                  height: settings.displayMode === 'small-bubble' ? '120px' : settings.displayMode === 'big-bubble' ? '200px' : '100%',
                  borderRadius: settings.videoShape === 'circle' ? '50%' : settings.videoShape === 'rounded' ? '16px' : '0',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                  ...(settings.displayMode === 'full-screen' && { top: 0, left: 0, right: 0, bottom: 0, borderRadius: 0 })
                }}>
                  <video 
                    src={introVideoUrl} 
                    style={{width: '100%', height: '100%', objectFit: 'cover'}}
                    muted
                    loop
                    autoPlay
                  />
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
              <div className={`preview-placeholder ${isDarkMode ? 'dark' : 'light'}`}>
                <p>Upload a video to see preview</p>
              </div>
            )}
          </section>

          {/* Results Modal */}
          {showResults && createdVideos.length > 0 && (
            <section className={`studio-card results-card ${isDarkMode ? 'dark' : 'light'}`}>
              <h3>✅ Videos Created!</h3>
              <p style={{marginBottom: '16px', color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'}}>
                {createdVideos.filter(v => v.success === 'YES').length} of {createdVideos.length} landing pages saved
              </p>
              
              <div className="results-list">
                {createdVideos.slice(0, 5).map(video => (
                  <div key={video.id} className={`result-item ${isDarkMode ? 'dark' : 'light'}`}>
                    <span className="result-name">
                      <strong>{video.companyName || video.firstName}</strong>
                      <span className={`result-status ${video.success === 'YES' ? 'success' : 'failed'}`}>
                        {video.success === 'YES' ? 'Saved' : 'Failed'}
                      </span>
                    </span>
                    <div className="result-actions">
                      <a href={video.landingPageLink} target="_blank" rel="noopener noreferrer">View</a>
                      <button onClick={() => copyLink(video.landingPageLink)}>📋</button>
                    </div>
                  </div>
                ))}
              </div>
              
              <button onClick={handleExportResults} className={`export-btn ${isDarkMode ? 'dark' : 'light'}`}>
                📥 Export All Links (CSV)
              </button>
              <button onClick={() => setShowResults(false)} className={`close-results-btn ${isDarkMode ? 'dark' : 'light'}`}>
                Close Results
              </button>
            </section>
          )}

          {/* Saved Videos */}
          {savedVideos.length > 0 && (
            <section className={`studio-card ${isDarkMode ? 'dark' : 'light'}`}>
              <div className="saved-header">
                <h3>📁 Saved Videos ({savedVideos.length})</h3>
                <div className="saved-header-actions">
                  <button onClick={handleExportAllSaved} className={`export-all-btn ${isDarkMode ? 'dark' : 'light'}`}>
                    Export All
                  </button>
                  <button onClick={handleDeleteAllVideos} className={`delete-all-btn ${isDarkMode ? 'dark' : 'light'}`}>
                    Delete All
                  </button>
                </div>
              </div>
              
              <div className="saved-list">
                {savedVideos.slice(0, 10).map(video => (
                  <div key={video.id} className={`saved-item ${isDarkMode ? 'dark' : 'light'}`}>
                    <div className="saved-info">
                      <span className="saved-name">{video.companyName || video.firstName || 'Unnamed'}</span>
                      <span className="saved-date">{new Date(video.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="saved-actions">
                      <a href={video.landingPageLink} target="_blank" rel="noopener noreferrer" title="View">👁️</a>
                      <button onClick={() => copyLink(video.landingPageLink)} title="Copy Link">📋</button>
                      <button onClick={() => handleDeleteVideo(video.id)} title="Delete">🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}