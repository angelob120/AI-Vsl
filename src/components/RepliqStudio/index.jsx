// FILE: src/components/RepliqStudio/index.jsx
// MAIN REPLIQSTUDIO COMPONENT - Single page layout with video bubble over website background
// UPDATED: Now composes actual video files with scrolling website + overlay
// UPDATED: Added preview navigation to cycle through all CSV leads
// UPDATED: Added lead entries table with remove functionality
// Saves to database only - NO localStorage
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { saveRepliqVideo, getAllRepliqVideos, deleteRepliqVideo, deleteAllRepliqVideos } from '../../api/repliqVideos';
import { composeVideoOnServer } from '../../api/videoComposer';
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
  // Video upload state
  const [introVideoUrl, setIntroVideoUrl] = useState(null);
  const [introVideoData, setIntroVideoData] = useState(null);
  // Second video state - used in handleSecondUpload and UI conditionals
  // eslint-disable-next-line no-unused-vars
  const [secondVideoUrl, setSecondVideoUrl] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [secondVideoData, setSecondVideoData] = useState(null);
  const introInputRef = useRef(null);
  const secondInputRef = useRef(null);

  // CSV state
  const [csvData, setCsvData] = useState([]);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [leads, setLeads] = useState([]);
  const [mapping, setMapping] = useState({ websiteUrl: '', firstName: '', companyName: '' });
  const csvInputRef = useRef(null);

  // Lead table filter state
  const [leadTableFilter, setLeadTableFilter] = useState('all');

  // Preview navigation state
  const [previewLeadIndex, setPreviewLeadIndex] = useState(0);

  // Settings
  const [settings, setSettings] = useState({
    displayMode: 'small-bubble',
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
  const [currentLead, setCurrentLead] = useState(null); // Track current lead being processed
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
      setCsvHeaders(importedCSV[0] || []);
    }
  }, [importedCSV]);

  // Preview navigation
  const goToPreviousLead = useCallback(() => {
    if (leads.length === 0) return;
    setPreviewLeadIndex(prev => prev === 0 ? leads.length - 1 : prev - 1);
  }, [leads.length]);

  const goToNextLead = useCallback(() => {
    if (leads.length === 0) return;
    setPreviewLeadIndex(prev => prev === leads.length - 1 ? 0 : prev + 1);
  }, [leads.length]);

  // Keyboard navigation for preview
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (leads.length <= 1) return;
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPreviousLead();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNextLead();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [leads.length, goToPreviousLead, goToNextLead]);

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
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const parsed = parseCSV(text);
      
      if (parsed && parsed.length > 0) {
        setCsvData(parsed);
        setCsvHeaders(parsed[0] || []);
        setPreviewLeadIndex(0);
      }
    };
    reader.readAsText(file);
  };

  // Update leads when mapping changes
  useEffect(() => {
    if (csvData.length <= 1 || !mapping.companyName) {
      setLeads([]);
      return;
    }
    
    const headers = csvData[0];
    const newLeads = [];
    
    for (let i = 1; i < csvData.length; i++) {
      const row = csvData[i];
      const lead = {
        websiteUrl: mapping.websiteUrl ? row[headers.indexOf(mapping.websiteUrl)] : '',
        firstName: mapping.firstName ? row[headers.indexOf(mapping.firstName)] : '',
        companyName: mapping.companyName ? row[headers.indexOf(mapping.companyName)] : ''
      };
      
      if (lead.companyName || lead.firstName) {
        newLeads.push(lead);
      }
    }
    
    setLeads(newLeads);
  }, [csvData, mapping]);

  // Remove a lead from the list
  const handleRemoveLead = (indexToRemove) => {
    setLeads(prev => prev.filter((_, index) => index !== indexToRemove));
    if (previewLeadIndex >= leads.length - 1 && previewLeadIndex > 0) {
      setPreviewLeadIndex(prev => prev - 1);
    }
  };

  // Add a new empty lead
  const handleAddLead = () => {
    setLeads(prev => [...prev, { websiteUrl: '', firstName: '', companyName: '' }]);
  };

  // Check if a lead is valid
  const isLeadValid = (lead) => {
    return lead.websiteUrl && lead.companyName;
  };

  // Get filtered leads based on current filter
  const getFilteredLeads = () => {
    if (leadTableFilter === 'invalid') {
      return leads.map((lead, index) => ({ lead, originalIndex: index }))
        .filter(({ lead }) => !isLeadValid(lead));
    }
    return leads.map((lead, index) => ({ lead, originalIndex: index }));
  };

  // Count invalid leads
  const invalidLeadsCount = leads.filter(lead => !isLeadValid(lead)).length;

  // ============================================
  // Handle creation - composes video on SERVER using FFmpeg
  // ============================================
  const handleCreate = async () => {
    if (leads.length === 0) {
      alert('Please upload a CSV with leads first!');
      return;
    }
    if (!introVideoData) {
      alert('Please upload an intro video first!');
      return;
    }

    setIsCreating(true);
    setProgress(0);
    setCreatedVideos([]);
    setCurrentLead(null);

    const baseUrl = window.location.origin + window.location.pathname;
    const results = [];

    for (let i = 0; i < leads.length; i++) {
      const lead = leads[i];
      setCurrentLead(lead);

      const videoId = generateUniqueId();
      const landingPageLink = `${baseUrl}#landing-${videoId}`;
      const videoOnlyLink = `${baseUrl}#video-${videoId}`;

      try {
        // Compose video on server using FFmpeg
        const composedVideoData = await composeVideoOnServer({
          introVideoData: introVideoData,
          websiteUrl: lead.websiteUrl,
          displayMode: settings.displayMode,
          videoPosition: settings.videoPosition,
          videoShape: settings.videoShape,
          onProgress: (p) => {
            const leadProgress = (i + (p / 100)) / leads.length;
            setProgress(Math.round(leadProgress * 100));
          }
        });

        // Save to database with composed video
        await saveRepliqVideo({
          id: videoId,
          leadData: lead,
          settings: settings,
          videoData: composedVideoData, // The composed video
          secondVideoData: null,
          landingPageLink: landingPageLink,
          videoOnlyLink: videoOnlyLink,
          websiteUrl: lead.websiteUrl || null,
          companyName: lead.companyName || null,
          firstName: lead.firstName || null
        });

        results.push({
          id: videoId,
          companyName: lead.companyName,
          firstName: lead.firstName,
          websiteUrl: lead.websiteUrl,
          link: landingPageLink,
          videoOnlyLink: videoOnlyLink,
          createdAt: new Date().toISOString(),
          success: true
        });
      } catch (err) {
        console.error('Failed to create video:', err);
        results.push({
          id: videoId,
          companyName: lead.companyName,
          firstName: lead.firstName,
          websiteUrl: lead.websiteUrl,
          link: landingPageLink,
          createdAt: new Date().toISOString(),
          success: false,
          error: err.message
        });
      }
    }

    setCreatedVideos(results);
    setShowResults(true);
    setIsCreating(false);
    setCurrentLead(null);
    
    // Add successful videos to state
    const successfulVideos = results
      .filter(r => r.success)
      .map(r => ({
        id: r.id,
        companyName: r.companyName,
        link: r.link,
        createdAt: new Date().toISOString()
      }));
    
    setSavedVideos(prev => [...successfulVideos, ...prev]);
    
    // Refresh from database
    try {
      await delay(500);
      await loadSavedVideos();
    } catch (e) {
      console.log('Could not refresh from DB, using local state');
    }
  };

  // Export results to CSV
  const handleExportResults = () => {
    if (createdVideos.length === 0) return;
    
    const csvContent = [
      ['Company Name', 'First Name', 'Website URL', 'Landing Page Link', 'Created At'],
      ...createdVideos.map(v => [
        v.companyName || '',
        v.firstName || '',
        v.websiteUrl || '',
        v.link || '',
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
      ['Company Name', 'First Name', 'Website URL', 'Landing Page Link', 'Created At'],
      ...savedVideos.map(v => [
        v.companyName || v.lead?.companyName || '',
        v.firstName || v.lead?.firstName || '',
        v.websiteUrl || v.lead?.websiteUrl || '',
        v.link || v.landingPageLink || '',
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

  // Delete a video
  const handleDeleteVideo = async (videoId) => {
    if (window.confirm('Delete this video?')) {
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

  // Get current preview lead
  const currentPreviewLead = leads[previewLeadIndex] || { companyName: 'Company', firstName: '', websiteUrl: '' };
  const hasMultipleLeads = leads.length > 1;

  return (
    <div className={`repliq-studio ${isDarkMode ? 'dark' : 'light'}`}>
      {/* Header */}

      <div className="studio-grid">
        {/* LEFT COLUMN - Controls */}
        <div className={`studio-column studio-controls ${isDarkMode ? 'dark' : 'light'}`}>
          {/* Video Upload */}
          <section className={`studio-card ${isDarkMode ? 'dark' : 'light'}`}>
            <h3>📹 Video Upload</h3>
            <input ref={introInputRef} type="file" accept="video/*" onChange={handleIntroUpload} style={{display:'none'}} />
            <button onClick={() => introInputRef.current?.click()} className={`upload-btn ${introVideoUrl ? 'active' : ''} ${isDarkMode ? 'dark' : 'light'}`}>
              {introVideoUrl ? '✓ Intro Video Uploaded' : 'Upload Intro Video'}
            </button>
            
            {introVideoUrl && (
              <>
                <label className={`checkbox-label ${isDarkMode ? 'dark' : 'light'}`}>
                  <input type="checkbox" checked={settings.useSecondVideo} onChange={e => update('useSecondVideo', e.target.checked)} />
                  Use second video (transition)
                </label>
                
                {settings.useSecondVideo && (
                  <>
                    <input ref={secondInputRef} type="file" accept="video/*" onChange={handleSecondUpload} style={{display:'none'}} />
                    <button onClick={() => secondInputRef.current?.click()} className={`upload-btn ${secondVideoUrl ? 'active' : ''} ${isDarkMode ? 'dark' : 'light'}`}>
                      {secondVideoUrl ? '✓ Second Video Uploaded' : 'Upload Second Video'}
                    </button>
                  </>
                )}
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
                <div className="mapping-field">
                  <label>Website URL Column:</label>
                  <select value={mapping.websiteUrl} onChange={e => setMapping(prev => ({ ...prev, websiteUrl: e.target.value }))}>
                    <option value="">-- Select --</option>
                    {csvHeaders.map((h, i) => <option key={i} value={h}>{h}</option>)}
                  </select>
                </div>
                <div className="mapping-field">
                  <label>First Name Column:</label>
                  <select value={mapping.firstName} onChange={e => setMapping(prev => ({ ...prev, firstName: e.target.value }))}>
                    <option value="">-- Select --</option>
                    {csvHeaders.map((h, i) => <option key={i} value={h}>{h}</option>)}
                  </select>
                </div>
                <div className="mapping-field">
                  <label>Company Name Column:</label>
                  <select value={mapping.companyName} onChange={e => setMapping(prev => ({ ...prev, companyName: e.target.value }))}>
                    <option value="">-- Select --</option>
                    {csvHeaders.map((h, i) => <option key={i} value={h}>{h}</option>)}
                  </select>
                </div>
              </div>
            )}

            {/* Lead Entries Table */}
            {leads.length > 0 && (
              <div className={`lead-entries-section ${isDarkMode ? 'dark' : 'light'}`}>
                {/* Filter Tabs */}
                <div className="lead-entries-tabs">
                  <button 
                    className={`lead-tab ${leadTableFilter === 'all' ? 'active' : ''} ${isDarkMode ? 'dark' : 'light'}`}
                    onClick={() => setLeadTableFilter('all')}
                  >
                    All <span className="tab-count">{leads.length}</span>
                  </button>
                  <button 
                    className={`lead-tab ${leadTableFilter === 'invalid' ? 'active' : ''} ${isDarkMode ? 'dark' : 'light'}`}
                    onClick={() => setLeadTableFilter('invalid')}
                  >
                    <span className="invalid-text">Invalid</span> <span className="tab-count invalid">{invalidLeadsCount}</span>
                  </button>
                </div>

                {/* Lead Entries Table */}
                <div className="lead-entries-table-wrapper">
                  <table className={`lead-entries-table ${isDarkMode ? 'dark' : 'light'}`}>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Websites Urls</th>
                        <th>First name</th>
                        <th>Last name or<br/>company name</th>
                        <th>Remove</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredLeads().map(({ lead, originalIndex }) => (
                        <tr key={originalIndex} className={!isLeadValid(lead) ? 'invalid-row' : ''}>
                          <td>{originalIndex + 1}</td>
                          <td className="url-cell">{lead.websiteUrl || ''}</td>
                          <td>{lead.firstName || ''}</td>
                          <td>{lead.companyName || ''}</td>
                          <td>
                            <button 
                              className="remove-lead-btn"
                              onClick={() => handleRemoveLead(originalIndex)}
                              title="Remove this lead"
                            >
                              X
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Add Button */}
                <div className="lead-entries-footer">
                  <button 
                    className={`add-lead-btn ${isDarkMode ? 'dark' : 'light'}`}
                    onClick={handleAddLead}
                  >
                    Add
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* Display Mode */}
          <section className={`studio-card ${isDarkMode ? 'dark' : 'light'}`}>
            <h3>🎬 Video Display</h3>
            <div className={`display-selector ${isDarkMode ? 'dark' : 'light'}`}>
              <label>Display Mode:</label>
              <select value={settings.displayMode} onChange={e => update('displayMode', e.target.value)}>
                <option value="small-bubble">Small Bubble</option>
                <option value="big-bubble">Big Bubble</option>
                <option value="full-screen">Full Screen</option>
              </select>
            </div>
            <div className={`display-selector ${isDarkMode ? 'dark' : 'light'}`}>
              <label>Position:</label>
              <select value={settings.videoPosition} onChange={e => update('videoPosition', e.target.value)}>
                <option value="bottom-right">Bottom Right</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="top-right">Top Right</option>
                <option value="top-left">Top Left</option>
              </select>
            </div>
            <div className={`display-selector ${isDarkMode ? 'dark' : 'light'}`}>
              <label>Shape:</label>
              <select value={settings.videoShape} onChange={e => update('videoShape', e.target.value)}>
                <option value="circle">Circle</option>
                <option value="rounded">Rounded</option>
                <option value="square">Square</option>
              </select>
            </div>
          </section>

          {/* Page Settings */}
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
            {isCreating 
              ? `⏳ Composing ${Math.floor(progress / (100 / Math.max(leads.length, 1))) + 1}/${leads.length} (${progress}%)` 
              : `🚀 Create ${leads.length || 0} Video Landing Pages`
            }
          </button>

          {/* Current Lead Progress Indicator */}
          {isCreating && currentLead && (
            <div className="creating-status" style={{
              marginTop: '12px',
              padding: '12px',
              background: isDarkMode ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.05)',
              borderRadius: '8px',
              fontSize: '0.85rem',
              color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'
            }}>
              <div>📹 Processing: {currentLead.companyName || currentLead.firstName || 'Lead'}</div>
              <div style={{ marginTop: '4px' }}>🌐 {currentLead.websiteUrl || 'No URL'}</div>
              <div style={{ 
                marginTop: '8px',
                height: '4px',
                background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                borderRadius: '2px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #667eea, #764ba2)',
                  transition: 'width 0.3s'
                }} />
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN - Preview & Results */}
        <div className={`studio-column studio-preview ${isDarkMode ? 'dark' : 'light'}`}>
          {/* Preview */}
          <section className={`studio-card preview-card ${isDarkMode ? 'dark' : 'light'}`}>
            {/* Preview Header with Navigation */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px'
            }}>
              <h3 style={{ margin: 0 }}>Preview</h3>
              
              {/* Lead Navigation Arrows */}
              {hasMultipleLeads && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <button
                    onClick={goToPreviousLead}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      border: 'none',
                      background: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)',
                      color: isDarkMode ? '#fff' : '#1a1a2e',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      transition: 'all 0.2s ease'
                    }}
                    title="Previous lead (←)"
                  >
                    ←
                  </button>
                  
                  <span style={{
                    fontSize: '0.85rem',
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                    minWidth: '70px',
                    textAlign: 'center',
                    fontWeight: '500'
                  }}>
                    {previewLeadIndex + 1} / {leads.length}
                  </span>
                  
                  <button
                    onClick={goToNextLead}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      border: 'none',
                      background: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)',
                      color: isDarkMode ? '#fff' : '#1a1a2e',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      transition: 'all 0.2s ease'
                    }}
                    title="Next lead (→)"
                  >
                    →
                  </button>
                </div>
              )}
            </div>
            
            {/* Current Lead Info */}
            {leads.length > 0 && (
              <div style={{
                padding: '8px 12px',
                background: isDarkMode ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.05)',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '0.85rem'
              }}>
                <div style={{ fontWeight: '600', color: '#667eea' }}>
                  {currentPreviewLead.companyName || currentPreviewLead.firstName || 'Unnamed Lead'}
                </div>
                <div style={{ 
                  color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)',
                  fontSize: '0.75rem',
                  marginTop: '4px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {currentPreviewLead.websiteUrl || 'No website URL'}
                </div>
              </div>
            )}

            {introVideoUrl ? (
              <div className="preview-frame" style={{
                position: 'relative',
                width: '100%',
                height: '400px',
                background: settings.darkMode ? '#1a1a2e' : '#f5f5f5',
                borderRadius: '12px',
                overflow: 'hidden'
              }}>
                {/* Website URL placeholder */}
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  color: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)',
                  fontSize: '0.85rem'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🌐</div>
                  <div>{currentPreviewLead.websiteUrl || 'Website will appear here'}</div>
                  <div style={{ fontSize: '0.7rem', marginTop: '8px', opacity: 0.6 }}>
                    (Scrolling website background)
                  </div>
                </div>
                
                {/* Video overlay preview */}
                <div style={{
                  position: 'absolute',
                  [settings.videoPosition.includes('bottom') ? 'bottom' : 'top']: '20px',
                  [settings.videoPosition.includes('left') ? 'left' : 'right']: '20px',
                  width: settings.displayMode === 'small-bubble' ? '120px' : settings.displayMode === 'big-bubble' ? '200px' : '100%',
                  height: settings.displayMode === 'small-bubble' ? '120px' : settings.displayMode === 'big-bubble' ? '200px' : '100%',
                  borderRadius: settings.videoShape === 'circle' ? '50%' : settings.videoShape === 'rounded' ? '16px' : '0',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                }}>
                  <video 
                    src={introVideoUrl} 
                    style={{width: '100%', height: '100%', objectFit: 'cover'}}
                    muted
                    playsInline
                    loop
                  />
                </div>
              </div>
            ) : (
              <div className={`preview-placeholder ${isDarkMode ? '' : 'light'}`}>
                Upload a video to see preview
              </div>
            )}
            
            {/* Keyboard hint */}
            {hasMultipleLeads && (
              <p style={{
                fontSize: '0.7rem',
                color: isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.3)',
                textAlign: 'center',
                marginTop: '12px'
              }}>
                💡 Use ← → arrow keys to navigate leads
              </p>
            )}
          </section>

          {/* Results */}
          {showResults && createdVideos.length > 0 && (
            <section className={`studio-card results-card ${isDarkMode ? 'dark' : 'light'}`}>
              <h3>✅ Created Videos</h3>
              <div className="results-list">
                {createdVideos.map(video => (
                  <div key={video.id} className={`result-item ${isDarkMode ? 'dark' : 'light'}`}>
                    <div className="result-name">
                      <span>{video.success ? '✓' : '✗'}</span>
                      <span>{video.companyName}</span>
                    </div>
                    <div className="result-actions">
                      {video.success && (
                        <>
                          <a href={video.link} target="_blank" rel="noopener noreferrer">👁️</a>
                          <button onClick={() => copyLink(video.link)}>📋</button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={handleExportResults} className={`export-btn ${isDarkMode ? 'dark' : 'light'}`}>
                📥 Export All Links (CSV)
              </button>
              <button 
                onClick={() => setShowResults(false)}
                className={`close-results-btn ${isDarkMode ? 'dark' : 'light'}`}
              >
                Close
              </button>
            </section>
          )}

          {/* Saved Videos */}
          <section className={`studio-card ${isDarkMode ? 'dark' : 'light'}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ margin: 0 }}>📁 Saved Videos ({savedVideos.length})</h3>
              {savedVideos.length > 0 && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={handleExportAllSaved} className={`small-btn ${isDarkMode ? 'dark' : 'light'}`}>
                    📥 Export
                  </button>
                  <button onClick={handleDeleteAllVideos} className={`small-btn danger ${isDarkMode ? 'dark' : 'light'}`}>
                    🗑️ Delete All
                  </button>
                </div>
              )}
            </div>
            
            {savedVideos.length === 0 ? (
              <p style={{ color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)', fontSize: '0.9rem' }}>
                No saved videos yet
              </p>
            ) : (
              <div className="saved-videos-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {savedVideos.slice(0, 20).map(video => (
                  <div key={video.id} className={`saved-video-item ${isDarkMode ? 'dark' : 'light'}`}>
                    <div className="video-info">
                      <span className="video-name">{video.companyName || video.firstName || 'Unnamed'}</span>
                      <span className="video-date">{new Date(video.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="video-actions">
                      <a href={video.link || video.landingPageLink} target="_blank" rel="noopener noreferrer">👁️</a>
                      <button onClick={() => copyLink(video.link || video.landingPageLink)}>📋</button>
                      <button onClick={() => handleDeleteVideo(video.id)} className="delete-btn">🗑️</button>
                    </div>
                  </div>
                ))}
                {savedVideos.length > 20 && (
                  <p style={{ textAlign: 'center', fontSize: '0.8rem', opacity: 0.6 }}>
                    Showing first 20 of {savedVideos.length} videos
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