import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import { templates, getTemplateById } from './templates';
import { Button } from '../shared';
import { exportWebsitesCSV, downloadCSV } from '../../utils/csv';
import { saveWebsite, getAllWebsites, getWebsiteById, deleteWebsite, deleteAllWebsites } from '../../api/websites';
import { getAllWebhookLeads, deleteWebhookLead, deleteAllWebhookLeads, mapLeadToFormData } from '../../api/webhookLeads';
import { archiveAndExport } from '../../api/archive';
import { 
  colorPresets, 
  defaultContractorFormData, 
  defaultContractorImages,
  readFileAsDataURL,
  copyToClipboard 
} from '../../utils/helpers';
import './styles.css';
import './webhook-leads-styles.css';
import './templates/template-styles.css';

// Generate unique ID
const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

export default function ContractorBuilder({ onNavigateToRepliq, isStandaloneSitePreview = false, isDarkMode = false }) {
  const [formData, setFormData] = useState({
    ownerName: 'John Mitchell',
    companyName: 'Mitchell Construction',
    phone: '(555) 123-4567',
    email: 'email@email.com',
    tagline: 'Building Dreams, One Project at a Time',
    primaryColor: '#0a0a0a',
    accentColor: '#ff4d00',
    // NEW: Text color customization
    textColor: '#ffffff',
    accentTextColor: '#cccccc',
    services: [], // CHANGED: Empty array - user must add their own services
    yearsExperience: '25',
    address: '123 Main Street'
  });

  const [images, setImages] = useState({
    logo: null,
    hero: null,
    about: null,
    gallery: []
  });

  // Template state - default to 'general'
  const [selectedTemplate, setSelectedTemplate] = useState('general');

  const [savedWebsites, setSavedWebsites] = useState([]);
  const [generatedLink, setGeneratedLink] = useState(null);
  const [viewMode, setViewMode] = useState('builder');
  const [previewData, setPreviewData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newService, setNewService] = useState('');

  // Webhook leads state
  const [webhookLeads, setWebhookLeads] = useState([]);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  const [showDeleteAllWarning, setShowDeleteAllWarning] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    loadSavedWebsites();
    loadWebhookLeads();
    
    const hash = window.location.hash;
    if (hash.startsWith('#site-')) {
      const siteId = hash.replace('#site-', '');
      loadWebsiteById(siteId);
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadSavedWebsites = async () => {
    try {
      const websites = await getAllWebsites();
      setSavedWebsites(websites);
    } catch (error) {
      console.error('Failed to load websites:', error);
    }
  };

  const loadWebhookLeads = async () => {
    setIsLoadingLeads(true);
    try {
      const leads = await getAllWebhookLeads();
      setWebhookLeads(leads);
    } catch (error) {
      console.error('Failed to load webhook leads:', error);
    }
    setIsLoadingLeads(false);
  };

  // Select a lead and populate the form
  const selectLead = (lead) => {
    setSelectedLeadId(lead.id);
    const mappedData = mapLeadToFormData(lead);
    setFormData(prev => ({
      ...prev,
      ...mappedData
    }));
  };

  // Delete a single lead
  const handleDeleteLead = async (leadId, e) => {
    e.stopPropagation();
    try {
      const result = await deleteWebhookLead(leadId);
      if (result.success) {
        setWebhookLeads(prev => prev.filter(lead => lead.id !== leadId));
        if (selectedLeadId === leadId) {
          setSelectedLeadId(null);
        }
      }
    } catch (error) {
      console.error('Failed to delete lead:', error);
      alert('Failed to delete lead. Please try again.');
    }
  };

  // Delete all leads with single warning
  const handleDeleteAllLeads = async () => {
    try {
      const result = await deleteAllWebhookLeads();
      if (result.success) {
        setWebhookLeads([]);
        setSelectedLeadId(null);
        setShowDeleteAllWarning(false);
      }
    } catch (error) {
      console.error('Failed to delete all leads:', error);
      alert('Failed to delete leads. Please try again.');
    }
  };

  // Load website by ID for preview
  const loadWebsiteById = async (siteId) => {
    try {
      const website = await getWebsiteById(siteId);
      if (website) {
        setPreviewData({
          formData: website.formData,
          images: website.images,
          template: website.template || 'general'
        });
        setViewMode('preview');
      }
    } catch (error) {
      console.error('Failed to load website:', error);
    }
    setIsLoading(false);
  };

  const backToBuilder = () => {
    setViewMode('builder');
    setPreviewData(null);
    window.location.hash = '';
  };

  const handleImageUpload = async (type, e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const dataUrl = await readFileAsDataURL(file);
        if (type === 'gallery') {
          setImages(prev => ({
            ...prev,
            gallery: [...prev.gallery, dataUrl]
          }));
        } else {
          setImages(prev => ({
            ...prev,
            [type]: dataUrl
          }));
        }
      } catch (error) {
        console.error('Failed to read file:', error);
      }
    }
  };

  const handlePaste = async (type, e) => {
    const clipboardItems = e.clipboardData?.items;
    if (clipboardItems) {
      for (let item of clipboardItems) {
        if (item.type.startsWith('image/')) {
          e.preventDefault();
          const blob = item.getAsFile();
          const dataUrl = await readFileAsDataURL(blob);
          if (type === 'gallery') {
            setImages(prev => ({
              ...prev,
              gallery: [...prev.gallery, dataUrl]
            }));
          } else {
            setImages(prev => ({
              ...prev,
              [type]: dataUrl
            }));
          }
          break;
        }
      }
    }
  };

  const handleContextPaste = async (type) => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      for (const item of clipboardItems) {
        for (const mimeType of item.types) {
          if (mimeType.startsWith('image/')) {
            const blob = await item.getType(mimeType);
            const dataUrl = await readFileAsDataURL(blob);
            if (type === 'gallery') {
              setImages(prev => ({
                ...prev,
                gallery: [...prev.gallery, dataUrl]
              }));
            } else {
              setImages(prev => ({
                ...prev,
                [type]: dataUrl
              }));
            }
            return;
          }
        }
      }
    } catch (err) {
      console.log('Clipboard access denied or no image found');
    }
  };

  const removeGalleryImage = (index) => {
    setImages(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
  };

  const removeImage = (type) => {
    setImages(prev => ({
      ...prev,
      [type]: null
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addService = () => {
    if (newService.trim()) {
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, newService.trim()]
      }));
      setNewService('');
    }
  };

  const removeService = (index) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const handleCopyLink = async (link) => {
    await copyToClipboard(link);
  };

  // Get the currently selected template component
  const getCurrentTemplate = () => {
    const template = getTemplateById(selectedTemplate);
    return template.component;
  };

  // Render the preview with the selected template
  const renderPreview = (data, imgs, templateId) => {
    const template = getTemplateById(templateId || selectedTemplate);
    const TemplateComponent = template.component;
    return <TemplateComponent formData={data} images={imgs} />;
  };

  // Save and generate link
  const saveAndGenerateLink = async () => {
    setIsSaving(true);
    
    const siteId = generateUniqueId();
    const link = `${window.location.origin}${window.location.pathname}#site-${siteId}`;
    
    const websiteData = {
      id: siteId,
      formData: { ...formData },
      images: { ...images },
      template: selectedTemplate,
      link: link
    };

    try {
      const result = await saveWebsite(websiteData);
      
      if (result && (result.success || result.website)) {
        setGeneratedLink(link);
        
        const savedSite = result.website || {
          id: siteId,
          formData: { ...formData },
          images: { ...images },
          template: selectedTemplate,
          createdAt: new Date().toISOString(),
          link: link
        };
        
        if (!savedSite.template) {
          savedSite.template = selectedTemplate;
        }
        
        setSavedWebsites(prev => [savedSite, ...prev]);
        
        // Clear lead selection after generating website
        setSelectedLeadId(null);
      } else {
        alert('Failed to save website. Please try again.');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save website. Please check your connection and try again.');
    }
    
    setIsSaving(false);
  };

  // Download CSV with archive flow:
  // 1. Archive all websites to permanent storage
  // 2. Create export record for re-download capability
  // 3. Download the CSV
  // 4. Clear the active workspace (savedWebsites list)
  const handleDownloadCSV = async () => {
    if (savedWebsites.length === 0) {
      alert('No websites saved yet. Generate some links first!');
      return;
    }

    const confirmed = window.confirm(
      `📥 Download CSV with ${savedWebsites.length} website(s)?\n\nThis will:\n• Archive all websites permanently (viewable in Archive & History)\n• Create an export record for future re-downloads\n• Clear this list after download\n\nYou can always re-download this exact CSV from the Archive & History page.`
    );

    if (!confirmed) return;

    try {
      // 1. Archive websites and create export record
      const result = await archiveAndExport(savedWebsites);
      
      if (result.success) {
        // 2. Generate and download CSV
        const headers = ['Business Name', 'Website Link', 'Created Date', 'Phone', 'Email'];
        const rows = savedWebsites.map(site => [
          site.formData?.companyName || '',
          site.link || '',
          new Date(site.createdAt).toLocaleDateString(),
          site.formData?.phone || '',
          site.formData?.email || ''
        ]);
        
        const filename = `contractor-websites-${new Date().toISOString().split('T')[0]}.csv`;
        downloadCSV(headers, rows, filename);

        // 3. Clear the local savedWebsites state (API already cleared the DB)
        setSavedWebsites([]);
        
        console.log(`✅ Archived ${result.archivedCount} websites with batch ID: ${result.batchId}`);
      } else {
        throw new Error('Archive failed');
      }
    } catch (error) {
      console.error('Download/archive error:', error);
      alert('Failed to archive and download. Please try again.');
    }
  };

  // Download Leads CSV with archive flow
  const handleDownloadLeadsCSV = async () => {
    if (savedWebsites.length === 0) {
      alert('No websites saved yet. Generate some links first!');
      return;
    }

    const confirmed = window.confirm(
      `📥 Download Leads CSV with ${savedWebsites.length} website(s)?\n\nThis will archive all websites and clear this list.`
    );

    if (!confirmed) return;

    try {
      // Archive websites
      const result = await archiveAndExport(savedWebsites);
      
      if (result.success) {
        // Create CSV with Website Link, First Name, Company Name, Email, Phone
        const headers = ['Website Link', 'First Name', 'Company Name', 'Email', 'Phone'];
        const rows = savedWebsites.map(site => [
          site.link,
          site.formData?.ownerName || site.formData?.companyName || '',
          site.formData?.companyName || '',
          site.formData?.email || '',
          site.formData?.phone || ''
        ]);

        const filename = `contractor-leads-${new Date().toISOString().split('T')[0]}.csv`;
        downloadCSV(headers, rows, filename);

        // Clear local state
        setSavedWebsites([]);
      }
    } catch (error) {
      console.error('Download/archive error:', error);
      alert('Failed to archive and download. Please try again.');
    }
  };

  // Download PNG screenshot of the current website preview
  const handleDownloadPNG = async () => {
    setIsCapturing(true);
    
    try {
      // Create a temporary container to render the template (same approach as ArchiveHistory)
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'fixed';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '1400px';
      tempContainer.style.background = '#ffffff';
      tempContainer.style.zIndex = '-1';
      document.body.appendChild(tempContainer);

      // Get the currently selected template component
      const template = getTemplateById(selectedTemplate);
      const TemplateComponent = template.component;

      // Render the template to the temp container
      const { createRoot } = await import('react-dom/client');
      const root = createRoot(tempContainer);
      
      await new Promise((resolve) => {
        root.render(
          <div className="png-export-container" style={{ background: '#ffffff' }}>
            <TemplateComponent formData={formData} images={images} />
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

      // Convert to blob and check size
      const maxSize = 1.5 * 1024 * 1024; // 1.5MB
      
      // Start with PNG
      let blob = await new Promise((resolve) => {
        canvas.toBlob((b) => resolve(b), 'image/png');
      });

      // If PNG is too large, use JPEG with compression
      if (blob && blob.size > maxSize) {
        let quality = 0.85;
        while (blob.size > maxSize && quality > 0.3) {
          blob = await new Promise((resolve) => {
            canvas.toBlob((b) => resolve(b), 'image/jpeg', quality);
          });
          quality -= 0.1;
        }
      }

      if (!blob) {
        throw new Error('Failed to generate image');
      }

      // Download the image
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const extension = blob.type === 'image/jpeg' ? 'jpg' : 'png';
      const companyName = formData.companyName?.replace(/[^a-z0-9]/gi, '-') || 'website';
      link.href = url;
      link.download = `${companyName}-website.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log(`✅ Screenshot saved: ${(blob.size / 1024 / 1024).toFixed(2)}MB`);
    } catch (error) {
      console.error('Screenshot error:', error);
      alert('Failed to capture screenshot. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  const clearForm = async () => {
    const hasContent = formData.companyName && formData.companyName.trim() !== '';
    
    if (hasContent) {
      const siteId = generateUniqueId();
      const link = `${window.location.origin}${window.location.pathname}#site-${siteId}`;
      
      const websiteData = {
        id: siteId,
        formData: { ...formData },
        images: { ...images },
        template: selectedTemplate,
        link: link
      };

      try {
        const result = await saveWebsite(websiteData);
        
        if (result && (result.success || result.website)) {
          const savedSite = result.website || {
            id: siteId,
            formData: { ...formData },
            images: { ...images },
            template: selectedTemplate,
            createdAt: new Date().toISOString(),
            link: link
          };
          
          if (!savedSite.template) {
            savedSite.template = selectedTemplate;
          }
          
          setSavedWebsites(prev => [savedSite, ...prev]);
        }
      } catch (error) {
        console.error('Auto-save error:', error);
      }
    }
    
    // Reset form with default values including new text colors and EMPTY services array
    setFormData({
      ...defaultContractorFormData,
      textColor: '#ffffff',
      accentTextColor: '#cccccc',
      services: [] // CHANGED: Empty services array
    });
    setImages(defaultContractorImages);
    setSelectedTemplate('general');
    setGeneratedLink(null);
    setSelectedLeadId(null);
  };

  const duplicateWebsite = (website) => {
    setFormData({ 
      ...website.formData,
      // Ensure text colors have defaults if not present in saved data
      textColor: website.formData?.textColor || '#ffffff',
      accentTextColor: website.formData?.accentTextColor || '#cccccc'
    });
    setImages({ ...website.images });
    setSelectedTemplate(website.template || 'general');
    setGeneratedLink(null);
    setViewMode('builder');
    setSelectedLeadId(null);
  };

  const handleDeleteWebsite = async (siteId) => {
    if (window.confirm('Are you sure you want to delete this?')) {
      try {
        const success = await deleteWebsite(siteId);
        if (success) {
          setSavedWebsites(prev => prev.filter(site => site.id !== siteId));
        } else {
          alert('Failed to delete website.');
        }
      } catch (error) {
        console.error('Delete error:', error);
        alert('Failed to delete website. Please try again.');
      }
    }
  };

  const handleClearAllWebsites = async () => {
    if (savedWebsites.length === 0) {
      alert('No websites to clear.');
      return;
    }
    
    const confirmed = window.confirm(
      `🗑️ Clear all ${savedWebsites.length} saved websites?\n\nThis will:\n• Archive all websites permanently (viewable in Archive & History)\n• Clear this list\n\nWebsites are never truly deleted - they're moved to the archive.`
    );
    
    if (confirmed) {
      try {
        // Archive websites before clearing
        await archiveAndExport(savedWebsites);
        setSavedWebsites([]);
      } catch (error) {
        console.error('Clear all error:', error);
        alert('Failed to clear websites. Please try again.');
      }
    }
  };

  // Loading screen
  if (isLoading) {
    return (
      <div className={`loading-screen ${isDarkMode ? 'dark' : ''}`}>
        <div className="loading-spinner"></div>
        Loading...
      </div>
    );
  }

  // ============================================
  // STANDALONE SITE PREVIEW MODE (Generated Link View)
  // ============================================
  if (isStandaloneSitePreview && viewMode === 'preview' && previewData) {
    return (
      <div className="standalone-site-preview">
        <style>{`
          .standalone-site-preview {
            min-height: 100vh;
            background: white;
          }
          .standalone-site-preview .template-general {
            border-radius: 0;
            box-shadow: none;
            min-height: 100vh;
          }
        `}</style>
        {renderPreview(previewData.formData, previewData.images, previewData.template)}
      </div>
    );
  }

  // Regular preview mode (in-builder preview with Back button)
  if (viewMode === 'preview' && previewData) {
    return (
      <div style={{ background: isDarkMode ? '#1a1a2e' : '#e5e7eb', minHeight: '100vh' }}>
        <button className={`preview-back-btn ${isDarkMode ? 'dark' : ''}`} onClick={backToBuilder}>
          ← Back to Builder
        </button>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: 24 }}>
          {renderPreview(previewData.formData, previewData.images, previewData.template)}
        </div>
      </div>
    );
  }

  const SelectedTemplateComponent = getCurrentTemplate();

  // Get display name for a lead
  const getLeadDisplayName = (lead) => {
    if (lead.companyName) return lead.companyName;
    if (lead.firstName || lead.lastName) return `${lead.firstName || ''} ${lead.lastName || ''}`.trim();
    if (lead.email) return lead.email;
    return `Lead ${lead.id.substring(0, 8)}`;
  };

  return (
    <div className={`contractor-builder ${isDarkMode ? 'dark' : ''}`}>
      <style>{`
        .template-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr) !important;
          grid-template-rows: repeat(2, 1fr);
          gap: 1rem;
          max-width: 500px;
        }
      `}</style>
      {/* Form Panel */}
      <div className={`form-panel ${isDarkMode ? 'dark' : ''}`}>
        <h1 className="form-title">Website Builder</h1>
        <p className="form-subtitle">
          Customize your contractor website with your business information and brand colors.
        </p>
        
        <div className="top-actions">
          <Button variant="primary" onClick={saveAndGenerateLink} disabled={isSaving}>
            {isSaving ? '⏳ Saving...' : '🔗 Generate Link'}
          </Button>
          <Button variant="secondary" onClick={clearForm}>
            🔄 New
          </Button>
        </div>
        
        {generatedLink && (
          <div className={`generated-link-box ${isDarkMode ? 'dark' : ''}`}>
            <div className="generated-link-label">
              ✅ Website Link Generated!
            </div>
            <div className="generated-link-url">
              <input 
                type="text" 
                value={generatedLink} 
                readOnly 
                className="generated-link-input"
                onClick={(e) => e.target.select()}
              />
              <button 
                className="copy-btn"
                onClick={() => handleCopyLink(generatedLink)}
              >
                Copy
              </button>
            </div>
          </div>
        )}

        {/* Webhook Leads Section */}
        <div className="form-section">
          <div className="section-header-row">
            <h2 className="form-section-title">📥 Incoming Leads</h2>
            <button 
              className={`refresh-leads-btn ${isDarkMode ? 'dark' : ''}`}
              onClick={loadWebhookLeads}
              disabled={isLoadingLeads}
              title="Refresh leads"
            >
              {isLoadingLeads ? '⏳' : '🔄'}
            </button>
          </div>
          
          {webhookLeads.length === 0 ? (
            <p className={`no-leads-text ${isDarkMode ? 'dark' : ''}`}>
              No leads received yet. Send data to the webhook endpoint to see leads here.
            </p>
          ) : (
            <>
              <div className="webhook-leads-list">
                {webhookLeads.map((lead) => (
                  <div 
                    key={lead.id} 
                    className={`webhook-lead-item ${selectedLeadId === lead.id ? 'selected' : ''} ${isDarkMode ? 'dark' : ''}`}
                    onClick={() => selectLead(lead)}
                  >
                    <div className="lead-info">
                      <span className="lead-name">{getLeadDisplayName(lead)}</span>
                      {lead.phone && <span className="lead-detail">{lead.phone}</span>}
                    </div>
                    <button 
                      className="lead-delete-btn"
                      onClick={(e) => handleDeleteLead(lead.id, e)}
                      title="Delete lead"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="leads-actions">
                {!showDeleteAllWarning ? (
                  <button 
                    className={`delete-all-leads-btn ${isDarkMode ? 'dark' : ''}`}
                    onClick={() => setShowDeleteAllWarning(true)}
                  >
                    🗑️ Remove All Leads
                  </button>
                ) : (
                  <div className={`delete-all-warning ${isDarkMode ? 'dark' : ''}`}>
                    <p>⚠️ Delete all {webhookLeads.length} leads?</p>
                    <div className="warning-actions">
                      <button 
                        className="warning-confirm-btn"
                        onClick={handleDeleteAllLeads}
                      >
                        Yes, Delete All
                      </button>
                      <button 
                        className="warning-cancel-btn"
                        onClick={() => setShowDeleteAllWarning(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Template Selection - Only show if more than one template */}
        {templates.length > 1 && (
          <div className="form-section">
            <h2 className="form-section-title">Choose Template</h2>
            <div className="template-grid">
              {templates.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  className={`template-option ${selectedTemplate === template.id ? 'active' : ''} ${isDarkMode ? 'dark' : ''}`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <span className="template-icon">{template.icon}</span>
                  <span className="template-name">{template.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Business Information */}
        <div className="form-section">
          <h2 className="form-section-title">Business Information</h2>
          
          <div className="form-group">
            <label className="form-label">Company Name</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className={`form-input ${isDarkMode ? 'dark' : ''}`}
              placeholder="Your Company Name"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Owner Name</label>
            <input
              type="text"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              className={`form-input ${isDarkMode ? 'dark' : ''}`}
              placeholder="Owner/Contact Name"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`form-input ${isDarkMode ? 'dark' : ''}`}
                placeholder="(555) 123-4567"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${isDarkMode ? 'dark' : ''}`}
                placeholder="email@company.com"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Years Experience</label>
              <input
                type="text"
                name="yearsExperience"
                value={formData.yearsExperience}
                onChange={handleChange}
                className={`form-input ${isDarkMode ? 'dark' : ''}`}
                placeholder="25"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`form-input ${isDarkMode ? 'dark' : ''}`}
                placeholder="123 Main Street"
              />
            </div>
          </div>
        </div>
        
        {/* Services */}
        <div className="form-section">
          <h2 className="form-section-title">Services</h2>
          
          <div className="services-input-row">
            <input
              type="text"
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
              className={`form-input ${isDarkMode ? 'dark' : ''}`}
              placeholder="Add a service..."
              onKeyPress={(e) => e.key === 'Enter' && addService()}
            />
            <button type="button" className="add-service-btn" onClick={addService}>+</button>
          </div>
          
          <div className="services-list">
            {formData.services.map((service, index) => (
              <div key={index} className={`service-tag ${isDarkMode ? 'dark' : ''}`}>
                <span>{service}</span>
                <button type="button" className="service-remove" onClick={() => removeService(index)}>×</button>
              </div>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="form-section">
          <h2 className="form-section-title">Images</h2>
          
          {/* Logo */}
          <div className="image-upload-section">
            <label className="image-upload-label">Logo</label>
            <div 
              className={`image-upload-area ${images.logo ? 'has-image' : ''} ${isDarkMode ? 'dark' : ''}`}
              tabIndex={0}
              onPaste={(e) => handlePaste('logo', e)}
              onContextMenu={(e) => {
                e.preventDefault();
                handleContextPaste('logo');
              }}
            >
              {images.logo ? (
                <>
                  <img src={images.logo} alt="Logo" className="uploaded-image" />
                  <button type="button" className="image-remove-btn" onClick={() => removeImage('logo')}>×</button>
                </>
              ) : (
                <label className="image-upload-placeholder">
                  <span className="upload-icon">📷</span>
                  <span className="upload-text">Click to upload or paste image</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => handleImageUpload('logo', e)}
                    style={{ display: 'none' }}
                  />
                </label>
              )}
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="image-upload-section">
            <label className="image-upload-label">Hero Background</label>
            <div 
              className={`image-upload-area ${images.hero ? 'has-image' : ''} ${isDarkMode ? 'dark' : ''}`}
              tabIndex={0}
              onPaste={(e) => handlePaste('hero', e)}
              onContextMenu={(e) => {
                e.preventDefault();
                handleContextPaste('hero');
              }}
            >
              {images.hero ? (
                <>
                  <img src={images.hero} alt="Hero" className="uploaded-image" />
                  <button type="button" className="image-remove-btn" onClick={() => removeImage('hero')}>×</button>
                </>
              ) : (
                <label className="image-upload-placeholder">
                  <span className="upload-icon">🖼️</span>
                  <span className="upload-text">Click to upload or paste image</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => handleImageUpload('hero', e)}
                    style={{ display: 'none' }}
                  />
                </label>
              )}
            </div>
          </div>
          
          {/* About Image */}
          <div className="image-upload-section">
            <label className="image-upload-label">About Section Image</label>
            <div 
              className={`image-upload-area ${images.about ? 'has-image' : ''} ${isDarkMode ? 'dark' : ''}`}
              tabIndex={0}
              onPaste={(e) => handlePaste('about', e)}
              onContextMenu={(e) => {
                e.preventDefault();
                handleContextPaste('about');
              }}
            >
              {images.about ? (
                <>
                  <img src={images.about} alt="About" className="uploaded-image" />
                  <button type="button" className="image-remove-btn" onClick={() => removeImage('about')}>×</button>
                </>
              ) : (
                <label className="image-upload-placeholder">
                  <span className="upload-icon">👷</span>
                  <span className="upload-text">Click to upload or paste image</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => handleImageUpload('about', e)}
                    style={{ display: 'none' }}
                  />
                </label>
              )}
            </div>
          </div>
          
          {/* Gallery */}
          <div className="image-upload-section">
            <label className="image-upload-label">Gallery Images</label>
            <div 
              className="gallery-grid"
              tabIndex={0}
              onPaste={(e) => handlePaste('gallery', e)}
              onContextMenu={(e) => {
                e.preventDefault();
                handleContextPaste('gallery');
              }}
            >
              {images.gallery.map((img, index) => (
                <div key={index} className={`gallery-item ${isDarkMode ? 'dark' : ''}`}>
                  <img src={img} alt={`Gallery ${index + 1}`} className="gallery-image" />
                  <button type="button" className="gallery-remove-btn" onClick={() => removeGalleryImage(index)}>×</button>
                </div>
              ))}
              <label className={`gallery-add ${isDarkMode ? 'dark' : ''}`}>
                <span className="gallery-add-icon">+</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => handleImageUpload('gallery', e)}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Brand Colors - UPDATED with Text Colors */}
        <div className="form-section">
          <h2 className="form-section-title">Brand Colors</h2>
          
          <div className="color-presets">
            {colorPresets.map((preset, index) => (
              <button
                key={index}
                type="button"
                className={`color-preset ${isDarkMode ? 'dark' : ''}`}
                onClick={() => setFormData(prev => ({
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
          
          <div className="color-pickers">
            {/* Primary Color */}
            <div className="form-group">
              <label className="form-label">Primary Color (Background)</label>
              <div className="color-input-row">
                <input
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                  className="color-picker"
                />
                <input
                  type="text"
                  name="primaryColor"
                  value={formData.primaryColor}
                  onChange={handleChange}
                  className={`form-input color-text ${isDarkMode ? 'dark' : ''}`}
                />
              </div>
            </div>
            
            {/* Accent Color */}
            <div className="form-group">
              <label className="form-label">Accent Color (Buttons/Highlights)</label>
              <div className="color-input-row">
                <input
                  type="color"
                  value={formData.accentColor}
                  onChange={(e) => setFormData(prev => ({ ...prev, accentColor: e.target.value }))}
                  className="color-picker"
                />
                <input
                  type="text"
                  name="accentColor"
                  value={formData.accentColor}
                  onChange={handleChange}
                  className={`form-input color-text ${isDarkMode ? 'dark' : ''}`}
                />
              </div>
            </div>
            
            {/* NEW: Text Color */}
            <div className="form-group">
              <label className="form-label">Text Color (Main Body Text)</label>
              <div className="color-input-row">
                <input
                  type="color"
                  value={formData.textColor || '#ffffff'}
                  onChange={(e) => setFormData(prev => ({ ...prev, textColor: e.target.value }))}
                  className="color-picker"
                />
                <input
                  type="text"
                  name="textColor"
                  value={formData.textColor || '#ffffff'}
                  onChange={handleChange}
                  className={`form-input color-text ${isDarkMode ? 'dark' : ''}`}
                />
              </div>
            </div>
            
            {/* NEW: Accent Text Color */}
            <div className="form-group">
              <label className="form-label">Secondary Text Color (Labels/Descriptions)</label>
              <div className="color-input-row">
                <input
                  type="color"
                  value={formData.accentTextColor || '#cccccc'}
                  onChange={(e) => setFormData(prev => ({ ...prev, accentTextColor: e.target.value }))}
                  className="color-picker"
                />
                <input
                  type="text"
                  name="accentTextColor"
                  value={formData.accentTextColor || '#cccccc'}
                  onChange={handleChange}
                  className={`form-input color-text ${isDarkMode ? 'dark' : ''}`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Saved Websites */}
        <div className="form-section">
          <div className="section-header-row">
            <h2 className="form-section-title">Saved Websites</h2>
            <div className="section-actions">
              <button 
                type="button"
                className={`section-action-btn ${isDarkMode ? 'dark' : ''}`}
                onClick={handleDownloadCSV}
                title="Export as CSV"
              >
                📥
              </button>
              <button 
                type="button"
                className={`section-action-btn danger ${isDarkMode ? 'dark' : ''}`}
                onClick={handleClearAllWebsites}
                title="Delete all websites"
              >
                🗑️
              </button>
            </div>
          </div>
          
          {savedWebsites.length === 0 ? (
            <p style={{ fontSize: 13, color: isDarkMode ? 'rgba(255,255,255,0.5)' : '#6b7280' }}>
              No saved websites yet. Generate a link to save your first website!
            </p>
          ) : (
            <div className="saved-websites-list">
              {savedWebsites.map((site) => {
                const displayName = site.formData?.companyName || 'Untitled Site';
                const template = getTemplateById(site.template || 'general');
                
                return (
                  <div key={site.id} className={`saved-website-item ${isDarkMode ? 'dark' : ''}`}>
                    <div className="saved-website-info">
                      <span className="saved-website-name">{displayName}</span>
                      <span className="saved-website-template">{template.icon} {template.name}</span>
                    </div>
                    <div className="saved-website-actions">
                      <button 
                        type="button"
                        className={`saved-action-btn ${isDarkMode ? 'dark' : ''}`}
                        title="Copy Link"
                        onClick={() => handleCopyLink(site.link)}
                      >
                        🔗
                      </button>
                      <button 
                        type="button"
                        className={`saved-action-btn ${isDarkMode ? 'dark' : ''}`}
                        title="Duplicate"
                        onClick={() => duplicateWebsite(site)}
                      >
                        📋
                      </button>
                      <button 
                        type="button"
                        className={`saved-action-btn delete ${isDarkMode ? 'dark' : ''}`}
                        title="Delete"
                        onClick={() => handleDeleteWebsite(site.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {/* Download CSV Button */}
          {savedWebsites.length > 0 && (
            <div className="download-buttons-row" style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              <button 
                type="button"
                className="export-to-repliq-btn"
                onClick={handleDownloadLeadsCSV}
              >
                📥 Download CSV
              </button>
              <button 
                type="button"
                className="export-to-repliq-btn screenshot-btn"
                onClick={handleDownloadPNG}
                disabled={isCapturing}
                style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', opacity: isCapturing ? 0.7 : 1 }}
              >
                {isCapturing ? '⏳ Capturing...' : '📸 Download PNG'}
              </button>
            </div>
          )}
          
          {/* PNG Screenshot Button - Always visible for current preview */}
          {savedWebsites.length === 0 && (
            <button 
              type="button"
              className="export-to-repliq-btn screenshot-btn"
              onClick={handleDownloadPNG}
              disabled={isCapturing}
              style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', marginTop: '15px', opacity: isCapturing ? 0.7 : 1 }}
            >
              {isCapturing ? '⏳ Capturing...' : '📸 Download PNG Screenshot'}
            </button>
          )}
        </div>
      </div>
      
      {/* Preview Panel */}
      <div className={`preview-panel ${isDarkMode ? 'dark' : ''}`}>
        <SelectedTemplateComponent formData={formData} images={images} />
      </div>
    </div>
  );
}