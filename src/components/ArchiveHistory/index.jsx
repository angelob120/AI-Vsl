import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import { getArchivedWebsites, getExportHistory, getExportById, getArchiveStats, updateArchivedWebsite } from '../../api/archive';
import { getTemplateById, templates } from '../ContractorBuilder/templates';
import { downloadCSV } from '../../utils/csv';
import { colorPresets, readFileAsDataURL } from '../../utils/helpers';
import './styles.css';

/**
 * Archive History Component - "Search & Export History" Page
 * 
 * Top Panel: Website Archive - All websites ever created (searchable, permanent)
 * Bottom Panel: CSV Export History - All past exports with re-download capability
 */
export default function ArchiveHistory({ isDarkMode = false }) {
  // Stats
  const [stats, setStats] = useState({
    totalArchivedWebsites: 0,
    totalExports: 0,
    totalWebsitesExported: 0
  });

  // Archived websites
  const [archivedWebsites, setArchivedWebsites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatchFilter, setSelectedBatchFilter] = useState('');
  const [isLoadingWebsites, setIsLoadingWebsites] = useState(true);

  // Export history
  const [exports, setExports] = useState([]);
  const [isLoadingExports, setIsLoadingExports] = useState(true);
  const [downloadingExportId, setDownloadingExportId] = useState(null);

  // Edit modal state
  const [editingSite, setEditingSite] = useState(null);
  const [editFormData, setEditFormData] = useState(null);
  const [editImages, setEditImages] = useState(null);
  const [editTemplate, setEditTemplate] = useState('general');
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [isCapturingPng, setIsCapturingPng] = useState(null);
  const [newService, setNewService] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const previewRef = useRef(null);

  // VSL Upload state
  const [vslMappings, setVslMappings] = useState({});
  const [isUploadingVsl, setIsUploadingVsl] = useState(false);
  const [vslUploadStats, setVslUploadStats] = useState(null);
  const vslFileInputRef = useRef(null);

  // Load data on mount
  useEffect(() => {
    loadStats();
    loadArchivedWebsites();
    loadExportHistory();
    loadVslMappings();
  }, []);

  // Reload archived websites when search or filter changes
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      loadArchivedWebsites();
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, selectedBatchFilter]);

  const loadStats = async () => {
    const statsData = await getArchiveStats();
    setStats(statsData);
  };

  const loadArchivedWebsites = async () => {
    setIsLoadingWebsites(true);
    const websites = await getArchivedWebsites(searchTerm, selectedBatchFilter);
    setArchivedWebsites(websites);
    setIsLoadingWebsites(false);
  };

  const loadExportHistory = async () => {
    setIsLoadingExports(true);
    const exportsData = await getExportHistory();
    setExports(exportsData);
    setIsLoadingExports(false);
  };

  // Load VSL mappings from backend
  const loadVslMappings = async () => {
    try {
      const response = await fetch('/api/vsl/mappings');
      if (response.ok) {
        const data = await response.json();
        if (data.mappings) {
          setVslMappings(data.mappings);
          setVslUploadStats(data.stats || null);
        }
      }
    } catch (error) {
      console.error('Error loading VSL mappings:', error);
    }
  };

  // Handle VSL CSV file upload
  const handleVslUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploadingVsl(true);
    
    try {
      // Dynamically import PapaParse for robust CSV parsing
      const Papa = await import('papaparse');
      const text = await file.text();
      
      // Parse CSV with PapaParse - handles quoted fields, commas in values, etc.
      const parseResult = Papa.default.parse(text, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim()
      });

      if (parseResult.errors.length > 0) {
        console.warn('CSV parse warnings:', parseResult.errors);
      }

      if (!parseResult.data || parseResult.data.length === 0) {
        alert('CSV file appears to be empty or has no data rows');
        setIsUploadingVsl(false);
        return;
      }

      // Find the correct column names (case-insensitive)
      const headers = parseResult.meta.fields || [];
      const originUrlCol = headers.find(h => h.toLowerCase().includes('originurl'));
      const videoLinkCol = headers.find(h => h.toLowerCase().includes('videolink'));
      const firstNameCol = headers.find(h => h.toLowerCase().includes('firstname'));
      const lastNameCol = headers.find(h => h.toLowerCase().includes('lastname'));

      if (!originUrlCol || !videoLinkCol) {
        alert(`CSV must contain "OriginUrls" and "VideoLink" columns.\n\nFound columns: ${headers.join(', ')}`);
        setIsUploadingVsl(false);
        return;
      }

      // Create mappings from parsed data
      const mappings = {};
      let matchedCount = 0;
      
      for (const row of parseResult.data) {
        const originUrl = row[originUrlCol]?.trim();
        const videoLink = row[videoLinkCol]?.trim();
        const firstName = firstNameCol ? row[firstNameCol]?.trim() : '';
        const lastName = lastNameCol ? row[lastNameCol]?.trim() : '';
        
        if (originUrl && videoLink) {
          mappings[originUrl] = {
            videoLink,
            firstName,
            lastName,
            uploadedAt: new Date().toISOString()
          };
          matchedCount++;
        }
      }

      if (matchedCount === 0) {
        alert('No valid VSL mappings found in CSV. Make sure OriginUrls and VideoLink columns have data.');
        setIsUploadingVsl(false);
        return;
      }

      // Save to backend
      const response = await fetch('/api/vsl/mappings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mappings })
      });

      if (response.ok) {
        setVslMappings(prev => ({ ...prev, ...mappings }));
        setVslUploadStats({
          totalUploaded: matchedCount,
          lastUpload: new Date().toISOString(),
          filename: file.name
        });
        alert(`Successfully uploaded ${matchedCount} VSL mappings!`);
      } else {
        throw new Error('Failed to save VSL mappings');
      }
    } catch (error) {
      console.error('VSL upload error:', error);
      alert('Failed to upload VSL CSV. Please check the file format.\n\nError: ' + error.message);
    }
    
    setIsUploadingVsl(false);
    // Reset file input
    if (vslFileInputRef.current) {
      vslFileInputRef.current.value = '';
    }
  };

  // Get VSL link for a website
  const getVslLink = (site) => {
    const mapping = vslMappings[site.link];
    return mapping?.videoLink || null;
  };

  // Clear all VSL mappings
  const clearVslMappings = async () => {
    if (!confirm('Are you sure you want to clear all VSL mappings?')) return;
    
    try {
      const response = await fetch('/api/vsl/mappings', {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setVslMappings({});
        setVslUploadStats(null);
        alert('VSL mappings cleared successfully');
      }
    } catch (error) {
      console.error('Error clearing VSL mappings:', error);
      alert('Failed to clear VSL mappings');
    }
  };

  // Re-download a past CSV export (produces identical CSV from original batch)
  const handleRedownload = async (exportRecord) => {
    setDownloadingExportId(exportRecord.id);
    try {
      const fullExport = await getExportById(exportRecord.id);
      if (fullExport && fullExport.websitesData) {
        const websites = fullExport.websitesData;
        
        // Generate CSV with same format as original
        const headers = ['Business Name', 'Website Link', 'Created Date', 'Phone', 'Email'];
        const rows = websites.map(site => [
          site.formData?.companyName || '',
          site.link || '',
          new Date(site.createdAt).toLocaleDateString(),
          site.formData?.phone || '',
          site.formData?.email || ''
        ]);

        // Use original export date in filename for traceability
        const exportDate = new Date(fullExport.exportedAt).toISOString().split('T')[0];
        const filename = `contractor-websites-${exportDate}-${exportRecord.batchId.slice(-6)}.csv`;
        
        downloadCSV(headers, rows, filename);
      }
    } catch (error) {
      console.error('Re-download failed:', error);
      alert('Failed to re-download CSV. Please try again.');
    }
    setDownloadingExportId(null);
  };

  // Copy link to clipboard with feedback
  const copyLink = async (link, siteId) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedId(siteId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  // Format date nicely
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // ============ EDIT MODE ============
  const handleEdit = (site) => {
    setEditingSite(site);
    setEditFormData({ ...site.formData });
    // Ensure gallery array is initialized even if site.images.gallery is undefined
    setEditImages({ 
      ...site.images,
      gallery: site.images?.gallery || []
    });
    setEditTemplate(site.template || 'general');
  };

  const closeEdit = () => {
    setEditingSite(null);
    setEditFormData(null);
    setEditImages(null);
    setEditTemplate('general');
    setNewService('');
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditImageUpload = async (type, e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const dataUrl = await readFileAsDataURL(file);
        if (type === 'gallery') {
          setEditImages(prev => ({
            ...prev,
            gallery: [...(prev.gallery || []), dataUrl]
          }));
        } else {
          setEditImages(prev => ({
            ...prev,
            [type]: dataUrl
          }));
        }
      } catch (error) {
        console.error('Failed to read file:', error);
      }
    }
  };

  // Handle paste event (Ctrl+V) for edit images
  const handleEditPaste = async (type, e) => {
    const clipboardItems = e.clipboardData?.items;
    if (clipboardItems) {
      for (let item of clipboardItems) {
        if (item.type.startsWith('image/')) {
          e.preventDefault();
          const blob = item.getAsFile();
          const dataUrl = await readFileAsDataURL(blob);
          if (type === 'gallery') {
            setEditImages(prev => ({
              ...prev,
              gallery: [...(prev.gallery || []), dataUrl]
            }));
          } else {
            setEditImages(prev => ({
              ...prev,
              [type]: dataUrl
            }));
          }
          break;
        }
      }
    }
  };

  // Handle right-click paste for edit images
  const handleEditContextPaste = async (type) => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      for (const item of clipboardItems) {
        for (const mimeType of item.types) {
          if (mimeType.startsWith('image/')) {
            const blob = await item.getType(mimeType);
            const dataUrl = await readFileAsDataURL(blob);
            if (type === 'gallery') {
              setEditImages(prev => ({
                ...prev,
                gallery: [...(prev.gallery || []), dataUrl]
              }));
            } else {
              setEditImages(prev => ({
                ...prev,
                [type]: dataUrl
              }));
            }
            return;
          }
        }
      }
    } catch (error) {
      console.error('Failed to paste from clipboard:', error);
    }
  };

  const removeEditImage = (type) => {
    setEditImages(prev => ({
      ...prev,
      [type]: null
    }));
  };

  const removeEditGalleryImage = (index) => {
    setEditImages(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
  };

  const addEditService = () => {
    if (newService.trim()) {
      setEditFormData(prev => ({
        ...prev,
        services: [...(prev.services || []), newService.trim()]
      }));
      setNewService('');
    }
  };

  const removeEditService = (index) => {
    setEditFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const saveEdit = async () => {
    if (!editingSite) return;
    
    setIsSavingEdit(true);
    try {
      const result = await updateArchivedWebsite(editingSite.id, {
        formData: editFormData,
        images: editImages,
        template: editTemplate
      });
      
      if (result && result.success) {
        // Update local state
        setArchivedWebsites(prev => prev.map(site => 
          site.id === editingSite.id 
            ? { ...site, formData: editFormData, images: editImages, template: editTemplate }
            : site
        ));
        closeEdit();
      } else {
        alert('Failed to save changes. Please try again.');
      }
    } catch (error) {
      console.error('Save edit error:', error);
      alert('Failed to save changes. Please try again.');
    }
    setIsSavingEdit(false);
  };

  // ============ EXPORT PNG ============
  const handleExportPng = async (site) => {
    setIsCapturingPng(site.id);
    
    try {
      // Create a temporary container to render the template
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'fixed';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '1400px';
      tempContainer.style.background = '#ffffff';
      tempContainer.style.zIndex = '-1';
      document.body.appendChild(tempContainer);

      // Get the template component
      const template = getTemplateById(site.template || 'general');
      const TemplateComponent = template.component;

      // Render the template to the temp container
      const { createRoot } = await import('react-dom/client');
      const root = createRoot(tempContainer);
      
      await new Promise((resolve) => {
        root.render(
          <div className="png-export-container" style={{ background: '#ffffff' }}>
            <TemplateComponent formData={site.formData} images={site.images} />
          </div>
        );
        setTimeout(resolve, 500); // Wait for render
      });

      // Capture the screenshot
      const canvas = await html2canvas(tempContainer, {
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: tempContainer.scrollWidth,
        height: tempContainer.scrollHeight
      });

      // Cleanup
      root.unmount();
      document.body.removeChild(tempContainer);

      // Convert to blob
      const maxSize = 1.5 * 1024 * 1024;
      let blob = await new Promise((resolve) => {
        canvas.toBlob((b) => resolve(b), 'image/png');
      });

      // Compress if needed
      if (blob && blob.size > maxSize) {
        let quality = 0.85;
        while (blob.size > maxSize && quality > 0.3) {
          blob = await new Promise((resolve) => {
            canvas.toBlob((b) => resolve(b), 'image/jpeg', quality);
          });
          quality -= 0.1;
        }
      }

      if (!blob) throw new Error('Failed to generate image');

      // Download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const extension = blob.type === 'image/jpeg' ? 'jpg' : 'png';
      const companyName = site.formData?.companyName?.replace(/[^a-z0-9]/gi, '-') || 'website';
      link.href = url;
      link.download = `${companyName}-website.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('PNG export error:', error);
      alert('Failed to export PNG. Please try again.');
    }
    
    setIsCapturingPng(null);
  };

  // Render template for view/edit
  const renderTemplate = (formData, images, templateId) => {
    const template = getTemplateById(templateId || 'general');
    const TemplateComponent = template.component;
    return <TemplateComponent formData={formData} images={images} />;
  };

  return (
    <div className={`archive-history ${isDarkMode ? 'dark' : ''}`}>
      {/* Stats Banner */}
      <div className="archive-stats-banner">
        <div className="stat-card">
          <span className="stat-icon">📦</span>
          <div className="stat-content">
            <span className="stat-value">{stats.totalArchivedWebsites}</span>
            <span className="stat-label">Archived Websites</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">📥</span>
          <div className="stat-content">
            <span className="stat-value">{stats.totalExports}</span>
            <span className="stat-label">CSV Exports</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🔄</span>
          <div className="stat-content">
            <span className="stat-value">{stats.totalWebsitesExported}</span>
            <span className="stat-label">Total Exported</span>
          </div>
        </div>
      </div>

      {/* Top Panel: Website Archive */}
      <div className="archive-panel">
        <div className="panel-header">
          <h2 className="panel-title">
            <span className="panel-icon">🏛️</span>
            Website Archive
          </h2>
          <p className="panel-subtitle">
            All websites ever created. This is your permanent study record.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="archive-toolbar">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by company name, owner, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`search-input ${isDarkMode ? 'dark' : ''}`}
            />
            {searchTerm && (
              <button className="search-clear" onClick={() => setSearchTerm('')}>×</button>
            )}
          </div>

          <div className="filter-box">
            <select
              value={selectedBatchFilter}
              onChange={(e) => setSelectedBatchFilter(e.target.value)}
              className={`filter-select ${isDarkMode ? 'dark' : ''}`}
            >
              <option value="">All Batches</option>
              {exports.map(exp => (
                <option key={exp.batchId} value={exp.batchId}>
                  {formatDate(exp.exportedAt)} ({exp.websiteCount} sites)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Archived Websites List */}
        <div className="archive-list">
          {isLoadingWebsites ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <span>Loading archived websites...</span>
            </div>
          ) : archivedWebsites.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📭</span>
              <span className="empty-text">
                {searchTerm || selectedBatchFilter 
                  ? 'No websites match your search criteria.'
                  : 'No archived websites yet. Download a CSV to archive websites.'}
              </span>
            </div>
          ) : (
            <div className="website-grid">
              {archivedWebsites.map(site => {
                const template = getTemplateById(site.template || 'general');
                return (
                  <div key={site.id} className={`archived-website-card ${isDarkMode ? 'dark' : ''}`}>
                    <div 
                      className="website-color-bar"
                      style={{ 
                        background: `linear-gradient(135deg, ${site.formData?.primaryColor || '#1a3a5c'}, ${site.formData?.accentColor || '#c9a227'})` 
                      }}
                    />
                    <div className="website-card-content">
                      <div className="website-card-header">
                        <div className="website-name-row">
                          <h3 className="website-name">{site.formData?.companyName || 'Unnamed'}</h3>
                          <button 
                            className={`website-link-icon ${copiedId === site.id ? 'copied' : ''}`}
                            onClick={() => copyLink(site.link, site.id)}
                            title={copiedId === site.id ? 'Copied!' : 'Copy link to clipboard'}
                          >
                            {copiedId === site.id ? '✓' : '🔗'}
                          </button>
                        </div>
                        <span className="website-template">{template.icon} {template.name}</span>
                      </div>
                      <div className="website-meta">
                        <span className="meta-item">📅 {new Date(site.createdAt).toLocaleDateString()}</span>
                        {site.formData?.phone && <span className="meta-item">📞 {site.formData.phone}</span>}
                      </div>
                      <div className="website-batch">
                        <span className="batch-label">Batch:</span>
                        <span className="batch-id">{site.batchId?.slice(-8)}</span>
                      </div>
                      <div className="website-card-actions">
                        <a 
                          href={site.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="card-action-btn view-btn"
                          title="Open website in new tab"
                        >
                          👁️ View
                        </a>
                        <button 
                          className="card-action-btn edit-btn"
                          onClick={() => handleEdit(site)}
                          title="Edit Website"
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          className={`card-action-btn export-btn ${isCapturingPng === site.id ? 'loading' : ''}`}
                          onClick={() => handleExportPng(site)}
                          disabled={isCapturingPng === site.id}
                          title="Export as PNG"
                        >
                          {isCapturingPng === site.id ? '⏳' : '📸'} PNG
                        </button>
                        {getVslLink(site) && (
                          <a
                            href={getVslLink(site)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="card-action-btn vsl-btn"
                            title="Open VSL Video"
                          >
                            🎬 VSL
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {archivedWebsites.length > 0 && (
          <div className="archive-count">
            Showing {archivedWebsites.length} website{archivedWebsites.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* VSL Upload Panel */}
      <div className="archive-panel vsl-panel">
        <div className="panel-header">
          <h2 className="panel-title">
            <span className="panel-icon">🎬</span>
            VSL Video Links
          </h2>
          <p className="panel-subtitle">
            Upload a CSV with VSL video links to add quick-access buttons to your website cards.
          </p>
        </div>

        <div className="vsl-upload-area">
          <div className="vsl-upload-box">
            <div className="vsl-upload-content">
              <span className="vsl-upload-icon">📤</span>
              <div className="vsl-upload-text">
                <h3>Upload VSL CSV</h3>
                <p>CSV must contain "OriginUrls" and "VideoLink" columns</p>
              </div>
              <label className={`vsl-upload-btn ${isUploadingVsl ? 'loading' : ''}`}>
                {isUploadingVsl ? '⏳ Uploading...' : '📁 Select CSV File'}
                <input
                  ref={vslFileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleVslUpload}
                  disabled={isUploadingVsl}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>

          <div className="vsl-stats-box">
            <h3>VSL Status</h3>
            {Object.keys(vslMappings).length > 0 ? (
              <div className="vsl-stats-content">
                <div className="vsl-stat">
                  <span className="vsl-stat-value">{Object.keys(vslMappings).length}</span>
                  <span className="vsl-stat-label">VSL Links Loaded</span>
                </div>
                <div className="vsl-stat">
                  <span className="vsl-stat-value">
                    {archivedWebsites.filter(site => getVslLink(site)).length}
                  </span>
                  <span className="vsl-stat-label">Matched to Archive</span>
                </div>
                {vslUploadStats?.lastUpload && (
                  <div className="vsl-last-upload">
                    <span>Last upload: {formatDate(vslUploadStats.lastUpload)}</span>
                    {vslUploadStats.filename && <span>File: {vslUploadStats.filename}</span>}
                  </div>
                )}
                <button 
                  className="vsl-clear-btn"
                  onClick={clearVslMappings}
                >
                  🗑️ Clear All VSL Data
                </button>
              </div>
            ) : (
              <div className="vsl-empty-state">
                <span>No VSL data uploaded yet</span>
                <span className="vsl-hint">Upload a CSV to link videos to your websites</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Panel: CSV Export History */}
      <div className="archive-panel exports-panel">
        <div className="panel-header">
          <h2 className="panel-title">
            <span className="panel-icon">📥</span>
            CSV Export History
          </h2>
          <p className="panel-subtitle">
            All past CSV downloads. Re-download any export to get the exact same CSV.
          </p>
        </div>

        <div className="exports-list">
          {isLoadingExports ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <span>Loading export history...</span>
            </div>
          ) : exports.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📄</span>
              <span className="empty-text">
                No exports yet. Download a CSV from the Website Builder to create your first export.
              </span>
            </div>
          ) : (
            <table className={`exports-table ${isDarkMode ? 'dark' : ''}`}>
              <thead>
                <tr>
                  <th>Export Date</th>
                  <th>Websites</th>
                  <th>Batch ID</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {exports.map(exp => (
                  <tr key={exp.id}>
                    <td className="export-date">{formatDate(exp.exportedAt)}</td>
                    <td className="export-count">
                      <span className="count-badge">{exp.websiteCount}</span>
                    </td>
                    <td className="export-batch">{exp.batchId.slice(-12)}</td>
                    <td className="export-actions">
                      <button
                        className={`redownload-btn ${downloadingExportId === exp.id ? 'loading' : ''}`}
                        onClick={() => handleRedownload(exp)}
                        disabled={downloadingExportId === exp.id}
                      >
                        {downloadingExportId === exp.id ? (
                          <>⏳ Downloading...</>
                        ) : (
                          <>📥 Re-download CSV</>
                        )}
                      </button>
                      <button
                        className="view-batch-btn"
                        onClick={() => setSelectedBatchFilter(exp.batchId)}
                        title="View websites in this batch"
                      >
                        👁️ View Batch
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* EDIT MODAL - Builder with left panel */}
      {editingSite && editFormData && (
        <div className="edit-modal-overlay">
          <div className="edit-modal-container">
            {/* Edit Form Panel (Left) */}
            <div className={`edit-form-panel ${isDarkMode ? 'dark' : ''}`}>
              <div className="edit-form-header">
                <h2>Edit Website</h2>
                <div className="edit-header-actions">
                  <button 
                    className="edit-save-btn"
                    onClick={saveEdit}
                    disabled={isSavingEdit}
                  >
                    {isSavingEdit ? '⏳ Saving...' : '💾 Save'}
                  </button>
                  <button className="edit-cancel-btn" onClick={closeEdit}>
                    ✕
                  </button>
                </div>
              </div>

              <div className="edit-form-body">
                {/* Template Selection */}
                <div className="edit-section">
                  <h3 className="edit-section-title">Template</h3>
                  <div className="template-grid-edit">
                    {templates.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        className={`template-option ${editTemplate === t.id ? 'selected' : ''}`}
                        onClick={() => setEditTemplate(t.id)}
                      >
                        <span className="template-icon">{t.icon}</span>
                        <span className="template-name">{t.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Business Info */}
                <div className="edit-section">
                  <h3 className="edit-section-title">Business Info</h3>
                  <div className="edit-field">
                    <label>Company Name</label>
                    <input
                      type="text"
                      name="companyName"
                      value={editFormData.companyName || ''}
                      onChange={handleEditChange}
                      className={isDarkMode ? 'dark' : ''}
                    />
                  </div>
                  <div className="edit-field">
                    <label>Owner Name</label>
                    <input
                      type="text"
                      name="ownerName"
                      value={editFormData.ownerName || ''}
                      onChange={handleEditChange}
                      className={isDarkMode ? 'dark' : ''}
                    />
                  </div>
                  <div className="edit-field">
                    <label>Tagline</label>
                    <input
                      type="text"
                      name="tagline"
                      value={editFormData.tagline || ''}
                      onChange={handleEditChange}
                      className={isDarkMode ? 'dark' : ''}
                    />
                  </div>
                  <div className="edit-row">
                    <div className="edit-field">
                      <label>Phone</label>
                      <input
                        type="text"
                        name="phone"
                        value={editFormData.phone || ''}
                        onChange={handleEditChange}
                        className={isDarkMode ? 'dark' : ''}
                      />
                    </div>
                    <div className="edit-field">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={editFormData.email || ''}
                        onChange={handleEditChange}
                        className={isDarkMode ? 'dark' : ''}
                      />
                    </div>
                  </div>
                  <div className="edit-row">
                    <div className="edit-field">
                      <label>Address</label>
                      <input
                        type="text"
                        name="address"
                        value={editFormData.address || ''}
                        onChange={handleEditChange}
                        className={isDarkMode ? 'dark' : ''}
                      />
                    </div>
                    <div className="edit-field">
                      <label>Years Experience</label>
                      <input
                        type="text"
                        name="yearsExperience"
                        value={editFormData.yearsExperience || ''}
                        onChange={handleEditChange}
                        className={isDarkMode ? 'dark' : ''}
                      />
                    </div>
                  </div>
                </div>

                {/* Services */}
                <div className="edit-section">
                  <h3 className="edit-section-title">Services</h3>
                  <div className="services-list">
                    {(editFormData.services || []).map((service, index) => (
                      <div key={index} className="service-tag">
                        <span>{service}</span>
                        <button type="button" onClick={() => removeEditService(index)}>×</button>
                      </div>
                    ))}
                  </div>
                  <div className="add-service-row">
                    <input
                      type="text"
                      placeholder="Add service..."
                      value={newService}
                      onChange={(e) => setNewService(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEditService())}
                      className={isDarkMode ? 'dark' : ''}
                    />
                    <button type="button" onClick={addEditService}>+</button>
                  </div>
                </div>

                {/* Brand Colors */}
                <div className="edit-section">
                  <h3 className="edit-section-title">Brand Colors</h3>
                  <div className="color-presets-edit">
                    {colorPresets.map((preset, index) => (
                      <button
                        key={index}
                        type="button"
                        className="color-preset-btn"
                        onClick={() => setEditFormData(prev => ({
                          ...prev,
                          primaryColor: preset.primary,
                          accentColor: preset.accent
                        }))}
                        title={preset.name}
                      >
                        <div 
                          className="color-preview" 
                          style={{ background: `linear-gradient(135deg, ${preset.primary} 50%, ${preset.accent} 50%)` }}
                        />
                      </button>
                    ))}
                  </div>
                  <div className="edit-row">
                    <div className="edit-field">
                      <label>Primary Color</label>
                      <div className="color-input-group">
                        <input
                          type="color"
                          value={editFormData.primaryColor || '#0a0a0a'}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                        />
                        <input
                          type="text"
                          name="primaryColor"
                          value={editFormData.primaryColor || '#0a0a0a'}
                          onChange={handleEditChange}
                          className={isDarkMode ? 'dark' : ''}
                        />
                      </div>
                    </div>
                    <div className="edit-field">
                      <label>Accent Color</label>
                      <div className="color-input-group">
                        <input
                          type="color"
                          value={editFormData.accentColor || '#ff4d00'}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, accentColor: e.target.value }))}
                        />
                        <input
                          type="text"
                          name="accentColor"
                          value={editFormData.accentColor || '#ff4d00'}
                          onChange={handleEditChange}
                          className={isDarkMode ? 'dark' : ''}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="edit-row">
                    <div className="edit-field">
                      <label>Text Color</label>
                      <div className="color-input-group">
                        <input
                          type="color"
                          value={editFormData.textColor || '#ffffff'}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, textColor: e.target.value }))}
                        />
                        <input
                          type="text"
                          name="textColor"
                          value={editFormData.textColor || '#ffffff'}
                          onChange={handleEditChange}
                          className={isDarkMode ? 'dark' : ''}
                        />
                      </div>
                    </div>
                    <div className="edit-field">
                      <label>Secondary Text</label>
                      <div className="color-input-group">
                        <input
                          type="color"
                          value={editFormData.accentTextColor || '#cccccc'}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, accentTextColor: e.target.value }))}
                        />
                        <input
                          type="text"
                          name="accentTextColor"
                          value={editFormData.accentTextColor || '#cccccc'}
                          onChange={handleEditChange}
                          className={isDarkMode ? 'dark' : ''}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Images */}
                <div className="edit-section">
                  <h3 className="edit-section-title">Images</h3>
                  <div className="edit-images-grid">
                    {/* Logo */}
                    <div className="edit-image-item">
                      <label>Logo</label>
                      <div 
                        className={`edit-image-upload-area ${editImages?.logo ? 'has-image' : ''}`}
                        tabIndex={0}
                        onPaste={(e) => handleEditPaste('logo', e)}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          handleEditContextPaste('logo');
                        }}
                      >
                        {editImages?.logo ? (
                          <div className="image-preview">
                            <img src={editImages.logo} alt="Logo" />
                            <button type="button" onClick={() => removeEditImage('logo')}>×</button>
                          </div>
                        ) : (
                          <label className="image-upload-btn">
                            <span>+ Upload or Paste</span>
                            <input type="file" accept="image/*" onChange={(e) => handleEditImageUpload('logo', e)} />
                          </label>
                        )}
                      </div>
                    </div>
                    {/* Hero */}
                    <div className="edit-image-item">
                      <label>Hero</label>
                      <div 
                        className={`edit-image-upload-area ${editImages?.hero ? 'has-image' : ''}`}
                        tabIndex={0}
                        onPaste={(e) => handleEditPaste('hero', e)}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          handleEditContextPaste('hero');
                        }}
                      >
                        {editImages?.hero ? (
                          <div className="image-preview">
                            <img src={editImages.hero} alt="Hero" />
                            <button type="button" onClick={() => removeEditImage('hero')}>×</button>
                          </div>
                        ) : (
                          <label className="image-upload-btn">
                            <span>+ Upload or Paste</span>
                            <input type="file" accept="image/*" onChange={(e) => handleEditImageUpload('hero', e)} />
                          </label>
                        )}
                      </div>
                    </div>
                    {/* About */}
                    <div className="edit-image-item">
                      <label>About</label>
                      <div 
                        className={`edit-image-upload-area ${editImages?.about ? 'has-image' : ''}`}
                        tabIndex={0}
                        onPaste={(e) => handleEditPaste('about', e)}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          handleEditContextPaste('about');
                        }}
                      >
                        {editImages?.about ? (
                          <div className="image-preview">
                            <img src={editImages.about} alt="About" />
                            <button type="button" onClick={() => removeEditImage('about')}>×</button>
                          </div>
                        ) : (
                          <label className="image-upload-btn">
                            <span>+ Upload or Paste</span>
                            <input type="file" accept="image/*" onChange={(e) => handleEditImageUpload('about', e)} />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Gallery Images */}
                  <div className="edit-gallery-section">
                    <label className="gallery-label">Gallery Images</label>
                    <div 
                      className="edit-gallery-grid"
                      tabIndex={0}
                      onPaste={(e) => handleEditPaste('gallery', e)}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        handleEditContextPaste('gallery');
                      }}
                    >
                      {/* Existing gallery images */}
                      {(editImages?.gallery || []).map((img, index) => (
                        <div key={index} className="gallery-image-item">
                          <img src={img} alt={`Gallery ${index + 1}`} />
                          <button 
                            type="button" 
                            className="gallery-remove-btn"
                            onClick={() => removeEditGalleryImage(index)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      {/* Add new gallery image button */}
                      <label className="gallery-upload-btn">
                        <span>+ Add or Paste</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleEditImageUpload('gallery', e)} 
                        />
                      </label>
                    </div>
                    <p className="gallery-hint">Add images to showcase your work - click to upload or right-click to paste</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Preview Panel (Right) */}
            <div className="edit-preview-panel" ref={previewRef}>
              {renderTemplate(editFormData, editImages, editTemplate)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}