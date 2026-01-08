// FILE: src/components/RepliqStudio/index.jsx
// MAIN REPLIQSTUDIO COMPONENT - Single page three-column layout like RepliQ
import React, { useState, useRef } from 'react';
import './styles.css';

// Inline lightweight hooks since we're keeping it simple
function useVideoUpload(videoId) {
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoData, setVideoData] = useState(null);
  const inputRef = useRef(null);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    
    const reader = new FileReader();
    reader.onload = () => setVideoData(reader.result);
    reader.readAsDataURL(file);
  };

  return { videoUrl, videoData, inputRef, handleUpload };
}

function useCSVData(importedCSV) {
  const [csvData, setCsvData] = useState([]);
  const [leads, setLeads] = useState([]);
  const [mapping, setMapping] = useState({ websiteUrl: '', firstName: '', companyName: '' });
  const inputRef = useRef(null);

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const rows = text.split('\n').map(line => line.split(','));
      setCsvData(rows);
    };
    reader.readAsText(file);
  };

  React.useEffect(() => {
    if (importedCSV && importedCSV.length > 0) {
      setCsvData(importedCSV);
    }
  }, [importedCSV]);

  React.useEffect(() => {
    if (csvData.length > 1 && mapping.companyName) {
      const headers = csvData[0];
      const newLeads = [];
      for (let i = 1; i < csvData.length; i++) {
        const row = csvData[i];
        newLeads.push({
          websiteUrl: mapping.websiteUrl ? row[headers.indexOf(mapping.websiteUrl)] : '',
          firstName: mapping.firstName ? row[headers.indexOf(mapping.firstName)] : '',
          companyName: mapping.companyName ? row[headers.indexOf(mapping.companyName)] : ''
        });
      }
      setLeads(newLeads);
    }
  }, [csvData, mapping]);

  return {
    hasData: csvData.length > 0,
    csvHeaders: csvData[0] || [],
    leads,
    mapping,
    updateMapping: (field, value) => setMapping(prev => ({ ...prev, [field]: value })),
    inputRef,
    handleUpload
  };
}

export default function RepliqStudio({ onNavigateToBuilder, importedCSV }) {
  const introVideo = useVideoUpload('intro');
  const secondVideo = useVideoUpload('second');
  const csvData = useCSVData(importedCSV);
  
  const [settings, setSettings] = useState({
    displayMode: 'small-bubble',
    transitionTime: 10,
    useSecondVideo: false,
    videoTitle: 'A video for you 👋',
    videoDescription: 'Intro',
    videoPosition: 'bottom-left',
    videoShape: 'circle',
    buttonText: 'Book a Call',
    buttonLink: '',
    calendarUrl: '',
    textColor: '#ffffff',
    backgroundColor: '#667eea',
    textHoverColor: '#ffffff',
    backgroundHoverColor: '#764ba2',
    displayTab: true,
    darkMode: true,
    scrollBackUp: true,
    displayMouse: true,
    voiceName: '',
    voiceLanguage: 'English'
  });

  const [isCreating, setIsCreating] = useState(false);
  const [createdCount, setCreatedCount] = useState(0);

  const update = (key, value) => setSettings(prev => ({ ...prev, [key]: value }));

  const handleCreate = () => {
    if (!introVideo.videoData) {
      alert('Please upload an intro video first!');
      return;
    }
    if (csvData.leads.length === 0) {
      alert('Please upload a CSV with leads!');
      return;
    }
    
    setIsCreating(true);
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setCreatedCount(count);
      if (count >= csvData.leads.length) {
        clearInterval(interval);
        setIsCreating(false);
        alert(`✅ Created ${count} personalized landing pages!`);
      }
    }, 200);
  };

  return (
    <div className="repliq-studio">
      {/* Header */}
      <header className="studio-header">
        <button onClick={onNavigateToBuilder} className="back-button">← Back to Builder</button>
        <h1>°RepliQ Studio</h1>
        <p>Create personalized video landing pages at scale</p>
      </header>

      {/* Three Column Layout */}
      <div className="studio-grid">
        {/* LEFT COLUMN - Uploads */}
        <div className="studio-column">
          {/* Video Upload */}
          <section className="studio-card">
            <h3>📹 Video Upload</h3>
            <input ref={introVideo.inputRef} type="file" accept="video/*" onChange={introVideo.handleUpload} style={{display:'none'}} />
            <button onClick={() => introVideo.inputRef.current?.click()} className={`upload-btn ${introVideo.videoUrl ? 'active' : ''}`}>
              {introVideo.videoUrl ? '✓ Intro Video Uploaded' : 'Upload Intro Video'}
            </button>
            
            <label className="checkbox-label">
              <input type="checkbox" checked={settings.useSecondVideo} onChange={e => update('useSecondVideo', e.target.checked)} />
              Use second video after transition
            </label>
            
            {settings.useSecondVideo && (
              <>
                <input ref={secondVideo.inputRef} type="file" accept="video/*" onChange={secondVideo.handleUpload} style={{display:'none'}} />
                <button onClick={() => secondVideo.inputRef.current?.click()} className={`upload-btn ${secondVideo.videoUrl ? 'active' : ''}`}>
                  {secondVideo.videoUrl ? '✓ Second Video Uploaded' : 'Upload Second Video'}
                </button>
              </>
            )}
          </section>

          {/* CSV Upload */}
          <section className="studio-card">
            <h3>📊 Lead Data (CSV)</h3>
            <input ref={csvData.inputRef} type="file" accept=".csv" onChange={csvData.handleUpload} style={{display:'none'}} />
            <button onClick={() => csvData.inputRef.current?.click()} className={`upload-btn ${csvData.hasData ? 'active' : ''}`}>
              {csvData.hasData ? `✓ ${csvData.leads.length} Leads Loaded` : 'Upload CSV'}
            </button>
            
            {csvData.csvHeaders.length > 0 && (
              <div className="csv-mapping">
                <h4>Map Columns:</h4>
                <div className="mapping-row">
                  <label>Company Name *</label>
                  <select value={csvData.mapping.companyName} onChange={e => csvData.updateMapping('companyName', e.target.value)}>
                    <option value="">Select...</option>
                    {csvData.csvHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
                <div className="mapping-row">
                  <label>First Name</label>
                  <select value={csvData.mapping.firstName} onChange={e => csvData.updateMapping('firstName', e.target.value)}>
                    <option value="">Select...</option>
                    {csvData.csvHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
                <div className="mapping-row">
                  <label>Website URL</label>
                  <select value={csvData.mapping.websiteUrl} onChange={e => csvData.updateMapping('websiteUrl', e.target.value)}>
                    <option value="">Select...</option>
                    {csvData.csvHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* CENTER COLUMN - Settings */}
        <div className="studio-column">
          {/* Display Mode */}
          <section className="studio-card">
            <h3>🎬 Video Display</h3>
            <div className="display-selector">
              <label>After</label>
              <select value={settings.transitionTime} onChange={e => update('transitionTime', Number(e.target.value))}>
                {[5,10,15,20,30].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <span>seconds choose option:</span>
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
          </section>

          {/* Page Customization */}
          <section className="studio-card">
            <h3>⚙️ Page Customization</h3>
            <div className="settings-grid">
              <div className="setting-field">
                <label>Video Title</label>
                <input type="text" value={settings.videoTitle} onChange={e => update('videoTitle', e.target.value)} />
              </div>
              <div className="setting-field">
                <label>Video Position</label>
                <select value={settings.videoPosition} onChange={e => update('videoPosition', e.target.value)}>
                  {['bottom-left','bottom-right','top-left','top-right','center'].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="setting-field">
                <label>Video Shape</label>
                <select value={settings.videoShape} onChange={e => update('videoShape', e.target.value)}>
                  {['circle','square','rounded'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="setting-field full">
                <label>Button Text</label>
                <input type="text" value={settings.buttonText} onChange={e => update('buttonText', e.target.value)} maxLength={40} />
              </div>
              <div className="setting-field full">
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
                  Dark mode
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" checked={settings.displayTab} onChange={e => update('displayTab', e.target.checked)} />
                  Display tab
                </label>
              </div>
            </div>
          </section>

          {/* Create Button */}
          <button
            onClick={handleCreate}
            disabled={isCreating || !introVideo.videoData || csvData.leads.length === 0}
            className="create-btn"
          >
            {isCreating ? `Creating... ${createdCount}/${csvData.leads.length}` : `🚀 Create ${csvData.leads.length || 0} Landing Pages`}
          </button>
        </div>

        {/* RIGHT COLUMN - Preview */}
        <div className="studio-column">
          <section className="studio-card preview-card">
            <h3>Preview</h3>
            {introVideo.videoUrl ? (
              <div className="preview-frame" style={{background: settings.darkMode ? '#1a1a2e' : '#f5f5f5'}}>
                <div className="preview-greeting" style={{color: settings.darkMode ? '#fff' : '#000'}}>
                  <h2>Hi <span style={{color: settings.backgroundColor}}>{csvData.leads[0]?.companyName || 'Company'}</span> 👋</h2>
                  <p>{settings.videoTitle}</p>
                </div>
                <video src={introVideo.videoUrl} controls className="preview-video" />
                {settings.buttonLink && (
                  <button className="preview-cta" style={{background: settings.backgroundColor, color: settings.textColor}}>
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
        </div>
      </div>
    </div>
  );
}