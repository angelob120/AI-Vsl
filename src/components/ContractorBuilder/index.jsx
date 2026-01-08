import React, { useState, useEffect } from 'react';
import { templates, getTemplateById } from './templates';
import { Button } from '../shared';
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
    primaryColor: '#1a3a5c',
    accentColor: '#c9a227',
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

  // Load saved websites
  const loadSavedWebsites = async () => {
    try {
      const websites = await getAllWebsites();
      setSavedWebsites(websites || []);
    } catch (error) {
      console.error('Failed to load websites:', error);
    }
  };

  // Load webhook leads
  const loadWebhookLeads = async () => {
    setIsLoadingLeads(true);
    try {
      const leads = await getAllWebhookLeads();
      setWebhookLeads(leads || []);
    } catch (error) {
      console.error('Failed to load webhook leads:', error);
    }
    setIsLoadingLeads(false);
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

  useEffect(() => {
    const hash = window.location.hash;
    
    // Check if this is a site preview link
    if (hash.startsWith('#site-')) {
      const siteId = hash.replace('#site-', '');
      loadWebsiteById(siteId);
    } else {
      // Normal builder mode - load saved data
      loadSavedWebsites();
      loadWebhookLeads();
      setIsLoading(false);
    }
  }, []);

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

  const removeGalleryImage = (index) => {
    setImages(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
  };

  const handleCopyLink = async (link) => {
    await copyToClipboard(link);
  };

  const getCurrentTemplate = () => {
    const template = getTemplateById(selectedTemplate);
    return template.component;
  };

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

  const handleExportToRepliQ = async () => {
    if (savedWebsites.length === 0) {
      alert('No websites saved yet. Generate some links first!');
      return;
    }

    const confirmed = window.confirm(
      `⚠️ Export ${savedWebsites.length} website(s) to RepliQ Studio?\n\nThis will:\n• Send all saved websites to RepliQ as leads\n• Delete all saved websites from this list\n\nThis action cannot be undone!`
    );

    if (confirmed) {
      const csvData = [
        ['Website Link', 'First Name', 'Company Name'],
        ...savedWebsites.map(site => [
          site.link,
          site.formData?.ownerName || site.formData?.companyName || '',
          site.formData?.companyName || ''
        ])
      ];

      try {
        const success = await deleteAllWebsites();
        if (success) {
          setSavedWebsites([]);
        }
      } catch (error) {
        console.error('Delete all error:', error);
      }

      if (onNavigateToRepliq) {
        onNavigateToRepliq(csvData);
      }
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

  // Select a lead and populate form
  const handleSelectLead = (lead) => {
    if (selectedLeadId === lead.id) {
      setSelectedLeadId(null);
      return;
    }
    
    setSelectedLeadId(lead.id);
    const mappedData = mapLeadToFormData(lead);
    setFormData(prev => ({ ...prev, ...mappedData }));
  };

  // Delete a single lead
  const handleDeleteLead = async (leadId, e) => {
    e.stopPropagation();
    if (window.confirm('Delete this lead?')) {
      try {
        const result = await deleteWebhookLead(leadId);
        if (result.success) {
          setWebhookLeads(prev => prev.filter(l => l.id !== leadId));
          if (selectedLeadId === leadId) {
            setSelectedLeadId(null);
          }
        }
      } catch (error) {
        console.error('Failed to delete lead:', error);
        alert('Failed to delete lead. Please try again.');
      }
    }
  };

  // Delete all leads
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

  // Get display name for a lead
  const getLeadDisplayName = (lead) => {
    if (lead.companyName) return lead.companyName;
    if (lead.firstName || lead.lastName) return `${lead.firstName || ''} ${lead.lastName || ''}`.trim();
    if (lead.email) return lead.email;
    return `Lead ${lead.id.substring(0, 8)}`;
  };

  // ============================================
  // LOADING SCREEN
  // ============================================
  if (isLoading) {
    return (
      <div className={`loading-screen ${isDarkMode ? 'dark' : ''}`}>
        <div className="loading-spinner"></div>
        Loading...
      </div>
    );
  }

  // ============================================
  // STANDALONE SITE PREVIEW MODE - WEBSITE ONLY, NO MENU
  // This is for shared/generated links (#site-xxx)
  // ============================================
  if (isStandaloneSitePreview && viewMode === 'preview' && previewData) {
    return (
      <div className="standalone-site-preview">
        <style>{`
          .standalone-site-preview {
            min-height: 100vh;
            background: white;
          }
          .standalone-site-preview .template-general,
          .standalone-site-preview .template-roofing,
          .standalone-site-preview .template-plumbing,
          .standalone-site-preview .template-electrical,
          .standalone-site-preview .template-hvac,
          .standalone-site-preview .template-landscaping {
            border-radius: 0;
            box-shadow: none;
            min-height: 100vh;
          }
        `}</style>
        {renderPreview(previewData.formData, previewData.images, previewData.template)}
      </div>
    );
  }

  // ============================================
  // STANDALONE MODE BUT STILL LOADING/NO DATA
  // Show loading or error, NOT the builder
  // ============================================
  if (isStandaloneSitePreview) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#f8f9fa',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>😕</div>
          <h1 style={{ marginBottom: '12px', fontSize: '1.5rem', color: '#1a1a2e' }}>Website Not Found</h1>
          <p style={{ color: '#6b7280' }}>This link may be expired or invalid.</p>
        </div>
      </div>
    );
  }

  // ============================================
  // REGULAR PREVIEW MODE (in-builder preview with Back button)
  // ============================================
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

  // ============================================
  // NORMAL BUILDER MODE - WITH FORM PANEL
  // ============================================
  const SelectedTemplateComponent = getCurrentTemplate();

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
            <div className="webhook-leads-list">
              {webhookLeads.map(lead => (
                <div 
                  key={lead.id}
                  className={`webhook-lead-item ${selectedLeadId === lead.id ? 'selected' : ''} ${isDarkMode ? 'dark' : ''}`}
                  onClick={() => handleSelectLead(lead)}
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
                    🗑️
                  </button>
                </div>
              ))}
              
              {webhookLeads.length > 1 && (
                <button 
                  className={`delete-all-leads-btn ${isDarkMode ? 'dark' : ''}`}
                  onClick={() => setShowDeleteAllWarning(true)}
                >
                  🗑️ Delete All Leads
                </button>
              )}
            </div>
          )}
          
          {showDeleteAllWarning && (
            <div className="delete-warning-modal">
              <div className="delete-warning-content">
                <p>Delete all {webhookLeads.length} leads?</p>
                <div className="delete-warning-actions">
                  <button onClick={handleDeleteAllLeads}>Yes, Delete All</button>
                  <button onClick={() => setShowDeleteAllWarning(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Template Selection */}
        <div className="form-section">
          <h2 className="form-section-title">Choose Template</h2>
          <div className="template-grid">
            {templates.map(template => (
              <div
                key={template.id}
                className={`template-card ${selectedTemplate === template.id ? 'selected' : ''} ${isDarkMode ? 'dark' : ''}`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <span className="template-icon">{template.icon}</span>
                <span className="template-name">{template.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Business Information */}
        <div className="form-section">
          <h2 className="form-section-title">Business Information</h2>
          
          <div className="form-group">
            <label>Company Name</label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
              className={isDarkMode ? 'dark' : ''}
            />
          </div>

          <div className="form-group">
            <label>Owner Name</label>
            <input
              type="text"
              value={formData.ownerName}
              onChange={(e) => setFormData(prev => ({ ...prev, ownerName: e.target.value }))}
              className={isDarkMode ? 'dark' : ''}
            />
          </div>

          <div className="form-group">
            <label>Tagline</label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
              className={isDarkMode ? 'dark' : ''}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className={isDarkMode ? 'dark' : ''}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className={isDarkMode ? 'dark' : ''}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              className={isDarkMode ? 'dark' : ''}
            />
          </div>

          <div className="form-group">
            <label>Years of Experience</label>
            <input
              type="text"
              value={formData.yearsExperience}
              onChange={(e) => setFormData(prev => ({ ...prev, yearsExperience: e.target.value }))}
              className={isDarkMode ? 'dark' : ''}
            />
          </div>
        </div>

        {/* Brand Colors */}
        <div className="form-section">
          <h2 className="form-section-title">Brand Colors</h2>
          
          <div className="color-presets">
            {colorPresets.map((preset, idx) => (
              <button
                key={idx}
                className={`color-preset ${isDarkMode ? 'dark' : ''}`}
                style={{ background: `linear-gradient(135deg, ${preset.primary} 50%, ${preset.accent} 50%)` }}
                onClick={() => setFormData(prev => ({ ...prev, primaryColor: preset.primary, accentColor: preset.accent }))}
                title={preset.name}
              />
            ))}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Primary Color</label>
              <div className="color-input-wrapper">
                <input
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                />
                <input
                  type="text"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                  className={isDarkMode ? 'dark' : ''}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Accent Color</label>
              <div className="color-input-wrapper">
                <input
                  type="color"
                  value={formData.accentColor}
                  onChange={(e) => setFormData(prev => ({ ...prev, accentColor: e.target.value }))}
                />
                <input
                  type="text"
                  value={formData.accentColor}
                  onChange={(e) => setFormData(prev => ({ ...prev, accentColor: e.target.value }))}
                  className={isDarkMode ? 'dark' : ''}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="form-section">
          <h2 className="form-section-title">Services</h2>
          
          <div className="services-list">
            {formData.services.map((service, idx) => (
              <div key={idx} className={`service-tag ${isDarkMode ? 'dark' : ''}`}>
                {service}
                <button onClick={() => setFormData(prev => ({
                  ...prev,
                  services: prev.services.filter((_, i) => i !== idx)
                }))}>×</button>
              </div>
            ))}
          </div>
          
          <div className="add-service-row">
            <input
              type="text"
              placeholder="Add a service..."
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && newService.trim()) {
                  setFormData(prev => ({
                    ...prev,
                    services: [...prev.services, newService.trim()]
                  }));
                  setNewService('');
                }
              }}
              className={isDarkMode ? 'dark' : ''}
            />
            <button 
              onClick={() => {
                if (newService.trim()) {
                  setFormData(prev => ({
                    ...prev,
                    services: [...prev.services, newService.trim()]
                  }));
                  setNewService('');
                }
              }}
              className={isDarkMode ? 'dark' : ''}
            >
              Add
            </button>
          </div>
        </div>

        {/* Images */}
        <div className="form-section">
          <h2 className="form-section-title">Images</h2>
          
          <div className="form-group">
            <label>Logo</label>
            <div 
              className={`image-upload-box ${isDarkMode ? 'dark' : ''}`}
              onPaste={(e) => handlePaste('logo', e)}
            >
              {images.logo ? (
                <div className="image-preview">
                  <img src={images.logo} alt="Logo" />
                  <button onClick={() => setImages(prev => ({ ...prev, logo: null }))}>×</button>
                </div>
              ) : (
                <label className="upload-label">
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload('logo', e)} />
                  <span>Click or paste image</span>
                </label>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Hero Image</label>
            <div 
              className={`image-upload-box ${isDarkMode ? 'dark' : ''}`}
              onPaste={(e) => handlePaste('hero', e)}
            >
              {images.hero ? (
                <div className="image-preview">
                  <img src={images.hero} alt="Hero" />
                  <button onClick={() => setImages(prev => ({ ...prev, hero: null }))}>×</button>
                </div>
              ) : (
                <label className="upload-label">
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload('hero', e)} />
                  <span>Click or paste image</span>
                </label>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>About Image</label>
            <div 
              className={`image-upload-box ${isDarkMode ? 'dark' : ''}`}
              onPaste={(e) => handlePaste('about', e)}
            >
              {images.about ? (
                <div className="image-preview">
                  <img src={images.about} alt="About" />
                  <button onClick={() => setImages(prev => ({ ...prev, about: null }))}>×</button>
                </div>
              ) : (
                <label className="upload-label">
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload('about', e)} />
                  <span>Click or paste image</span>
                </label>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Gallery Images</label>
            <div className="gallery-grid">
              {images.gallery.map((img, idx) => (
                <div key={idx} className="gallery-item">
                  <img src={img} alt={`Gallery ${idx + 1}`} />
                  <button onClick={() => removeGalleryImage(idx)}>×</button>
                </div>
              ))}
              <div 
                className={`image-upload-box gallery-add ${isDarkMode ? 'dark' : ''}`}
                onPaste={(e) => handlePaste('gallery', e)}
              >
                <label className="upload-label">
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload('gallery', e)} />
                  <span>+ Add</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Saved Websites */}
        <div className="form-section">
          <div className="section-header-row">
            <h2 className="form-section-title">💾 Saved Websites</h2>
            {savedWebsites.length > 0 && (
              <button 
                className={`clear-all-btn ${isDarkMode ? 'dark' : ''}`}
                onClick={handleClearAllWebsites}
                title="Delete all saved websites"
              >
                🗑️ Clear All
              </button>
            )}
          </div>
          
          {savedWebsites.length === 0 ? (
            <p className={`no-saved-text ${isDarkMode ? 'dark' : ''}`}>
              No websites saved yet. Generate a link to save your first website.
            </p>
          ) : (
            <div className="saved-websites-list">
              {savedWebsites.map(site => {
                const template = getTemplateById(site.template || 'general');
                return (
                  <div key={site.id} className={`saved-website-item ${isDarkMode ? 'dark' : ''}`}>
                    <div className="saved-website-info">
                      <span className="saved-website-name">{site.formData?.companyName || 'Unnamed'}</span>
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
          
          {savedWebsites.length > 0 && (
            <button 
              className="export-to-repliq-btn"
              onClick={handleExportToRepliQ}
            >
              🚀 Export to RepliQ Studio
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