import React, { useState, useEffect } from 'react';
import { templates, getTemplateById } from './templates';
import { Button } from '../shared';
import { exportWebsitesCSV, downloadCSV } from '../../utils/csv';
import { saveWebsite, getAllWebsites, getWebsiteById, deleteWebsite, deleteAllWebsites } from '../../api/websites';
import { getAllWebhookLeads, deleteWebhookLead, deleteAllWebhookLeads, mapLeadToFormData } from '../../api/webhookLeads';
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
    services: ['Kitchen Remodels', 'Bathroom Renovations', 'Home Additions', 'Deck Building'],
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

  const handleDownloadCSV = () => {
    if (savedWebsites.length === 0) {
      alert('No websites saved yet. Generate some links first!');
      return;
    }
    exportWebsitesCSV(savedWebsites);
  };

  // Download CSV function
  const handleDownloadLeadsCSV = () => {
    if (savedWebsites.length === 0) {
      alert('No websites saved yet. Generate some links first!');
      return;
    }

    // Create CSV with Website Link, First Name, Company Name
    const headers = ['Website Link', 'First Name', 'Company Name'];
    const rows = savedWebsites.map(site => [
      site.link,
      site.formData?.ownerName || site.formData?.companyName || '',
      site.formData?.companyName || ''
    ]);

    const filename = `contractor-leads-${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(headers, rows, filename);
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
    
    setFormData(defaultContractorFormData);
    setImages(defaultContractorImages);
    setSelectedTemplate('general');
    setGeneratedLink(null);
    setSelectedLeadId(null);
  };

  const duplicateWebsite = (website) => {
    setFormData({ ...website.formData });
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
      alert('No websites to delete.');
      return;
    }
    
    const confirmed = window.confirm(
      `⚠️ WARNING: This will permanently delete ALL ${savedWebsites.length} saved websites.\n\nThis action cannot be undone!`
    );
    
    if (confirmed) {
      try {
        const success = await deleteAllWebsites();
        if (success) {
          setSavedWebsites([]);
        } else {
          alert('Failed to delete websites.');
        }
      } catch (error) {
        console.error('Delete all error:', error);
        alert('Failed to delete websites. Please try again.');
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
          
          <div className="form-group">
            <label className="form-label">Tagline</label>
            <input
              type="text"
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
              className={`form-input ${isDarkMode ? 'dark' : ''}`}
              placeholder="Your company tagline"
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
            <button className="add-service-btn" onClick={addService}>+</button>
          </div>
          
          <div className="services-list">
            {formData.services.map((service, index) => (
              <div key={index} className={`service-tag ${isDarkMode ? 'dark' : ''}`}>
                <span>{service}</span>
                <button className="service-remove" onClick={() => removeService(index)}>×</button>
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
                  <button className="image-remove-btn" onClick={() => removeImage('logo')}>×</button>
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
                  <button className="image-remove-btn" onClick={() => removeImage('hero')}>×</button>
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
                  <button className="image-remove-btn" onClick={() => removeImage('about')}>×</button>
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
                  <button className="gallery-remove-btn" onClick={() => removeGalleryImage(index)}>×</button>
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

        {/* Brand Colors */}
        <div className="form-section">
          <h2 className="form-section-title">Brand Colors</h2>
          
          <div className="color-presets">
            {colorPresets.map((preset, index) => (
              <button
                key={index}
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
            <div className="form-group">
              <label className="form-label">Primary Color</label>
              <div className="color-input-row">
                <input
                  type="color"
                  name="primaryColor"
                  value={formData.primaryColor}
                  onChange={handleChange}
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
            
            <div className="form-group">
              <label className="form-label">Accent Color</label>
              <div className="color-input-row">
                <input
                  type="color"
                  name="accentColor"
                  value={formData.accentColor}
                  onChange={handleChange}
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
          </div>
        </div>

        {/* Saved Websites */}
        <div className="form-section">
          <div className="section-header-row">
            <h2 className="form-section-title">Saved Websites</h2>
            <div className="section-actions">
              <button 
                className={`section-action-btn ${isDarkMode ? 'dark' : ''}`}
                onClick={handleDownloadCSV}
                title="Export as CSV"
              >
                📥
              </button>
              <button 
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
                        className={`saved-action-btn ${isDarkMode ? 'dark' : ''}`}
                        title="Copy Link"
                        onClick={() => handleCopyLink(site.link)}
                      >
                        🔗
                      </button>
                      <button 
                        className={`saved-action-btn ${isDarkMode ? 'dark' : ''}`}
                        title="Duplicate"
                        onClick={() => duplicateWebsite(site)}
                      >
                        📋
                      </button>
                      <button 
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
            <button 
              className="export-to-repliq-btn"
              onClick={handleDownloadLeadsCSV}
            >
              📥 Download CSV
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