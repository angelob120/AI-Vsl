import React, { useState, useEffect } from 'react';
import { templates, getTemplateById } from './templates';
import { Button } from '../shared';
import { exportWebsitesCSV } from '../../utils/csv';
import { saveWebsite, getAllWebsites, getWebsiteById, deleteWebsite, deleteAllWebsites } from '../../api/websites';
import { 
  colorPresets, 
  defaultContractorFormData, 
  defaultContractorImages,
  readFileAsDataURL,
  copyToClipboard 
} from '../../utils/helpers';
import './styles.css';
import './templates/template-styles.css';

// Generate unique ID (moved here since we're not importing from storage)
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

  // Template state - default to 'general'
  const [selectedTemplate, setSelectedTemplate] = useState('general');

  const [savedWebsites, setSavedWebsites] = useState([]);
  const [generatedLink, setGeneratedLink] = useState(null);
  const [viewMode, setViewMode] = useState('builder');
  const [previewData, setPreviewData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newService, setNewService] = useState('');

  useEffect(() => {
    loadSavedWebsites();
    
    const hash = window.location.hash;
    if (hash && hash.startsWith('#site-')) {
      const siteId = hash.substring(6);
      loadWebsiteById(siteId);
    } else {
      setIsLoading(false);
    }
  }, []);

  // Load all saved websites from PostgreSQL via API
  const loadSavedWebsites = async () => {
    try {
      const websites = await getAllWebsites();
      console.log('Loaded websites from API:', websites);
      websites.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setSavedWebsites(websites);
    } catch (e) {
      console.log('Failed to load websites:', e);
    }
    setIsLoading(false);
  };

  // Load a specific website by ID from PostgreSQL via API
  const loadWebsiteById = async (siteId) => {
    try {
      const website = await getWebsiteById(siteId);
      console.log('Loaded website by ID:', website);
      if (website) {
        setPreviewData({
          formData: website.formData,
          images: website.images,
          template: website.template || 'general'
        });
        setViewMode('preview');
      }
    } catch (e) {
      console.log('Failed to load website:', e);
    }
    setIsLoading(false);
  };

  const saveAndGenerateLink = async () => {
    if (!formData.companyName || formData.companyName.trim() === '') {
      alert('Please enter a company name first!');
      return;
    }
    
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

    console.log('Saving website with template:', selectedTemplate);
    console.log('Full websiteData:', websiteData);

    try {
      const result = await saveWebsite(websiteData);
      console.log('Save result:', result);
      
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
        
        console.log('Saved site with template:', savedSite.template);
        setSavedWebsites(prev => [savedSite, ...prev]);
        setGeneratedLink(link);
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
  };

  const duplicateWebsite = (website) => {
    setFormData({ ...website.formData });
    setImages({ ...website.images });
    setSelectedTemplate(website.template || 'general');
    setGeneratedLink(null);
    setViewMode('builder');
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
        console.error('Clear all error:', error);
        alert('Failed to delete websites. Please try again.');
      }
    }
  };

  const backToBuilder = () => {
    setViewMode('builder');
    setPreviewData(null);
    window.location.hash = '';
  };

  // Handle image uploads
  const handleImageUpload = async (type, e) => {
    const file = e.target.files?.[0];
    if (file) {
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
    }
  };

  // Handle paste for images
  const handlePaste = async (type, e) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
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
          e.preventDefault();
          return;
        }
      }
    }
  };

  // Handle right-click paste
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
  // When isStandaloneSitePreview is true, render ONLY the website
  // with NO builder UI, NO navigation, NO "Back to Builder" button
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

        {/* Template Selection */}
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
              placeholder="Owner's Name"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
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
              placeholder="email@email.com"
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

          <div className="form-group">
            <label className="form-label">Years of Experience</label>
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
            <label className="image-upload-label">Project Gallery</label>
            <div className="gallery-grid">
              {images.gallery.map((img, index) => (
                <div key={index} className="gallery-item">
                  <img src={img} alt={`Gallery ${index + 1}`} />
                  <button className="image-remove-btn" onClick={() => removeGalleryImage(index)}>×</button>
                </div>
              ))}
              <div 
                className={`gallery-add ${isDarkMode ? 'dark' : ''}`}
                tabIndex={0}
                onPaste={(e) => handlePaste('gallery', e)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  handleContextPaste('gallery');
                }}
              >
                <label style={{ cursor: 'pointer', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  +
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
        </div>
        
        {/* Colors */}
        <div className="form-section">
          <h2 className="form-section-title">Brand Colors</h2>
          
          <div className="color-presets">
            {colorPresets.map((preset) => (
              <button
                key={preset.name}
                className={`color-preset ${formData.primaryColor === preset.primary && formData.accentColor === preset.accent ? 'active' : ''} ${isDarkMode ? 'dark' : ''}`}
                onClick={() => setFormData(prev => ({
                  ...prev,
                  primaryColor: preset.primary,
                  accentColor: preset.accent
                }))}
                title={preset.name}
              >
                <div 
                  className="color-preset-swatch"
                  style={{ background: `linear-gradient(135deg, ${preset.primary} 50%, ${preset.accent} 50%)` }}
                />
              </button>
            ))}
          </div>
          
          <div className="color-pickers">
            <div className="form-group">
              <label className="form-label">Primary Color</label>
              <div className={`color-input-wrapper ${isDarkMode ? 'dark' : ''}`}>
                <input
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                  className="color-input"
                />
                <span className="color-value">{formData.primaryColor}</span>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Accent Color</label>
              <div className={`color-input-wrapper ${isDarkMode ? 'dark' : ''}`}>
                <input
                  type="color"
                  value={formData.accentColor}
                  onChange={(e) => setFormData(prev => ({ ...prev, accentColor: e.target.value }))}
                  className="color-input"
                />
                <span className="color-value">{formData.accentColor}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Saved Websites */}
        <div className="form-section">
          <div className="saved-websites-header">
            <h2 className="form-section-title" style={{ marginBottom: 0, borderBottom: 'none', paddingBottom: 0 }}>
              Saved Websites ({savedWebsites.length})
            </h2>
            <div className="saved-websites-actions">
              <button 
                className={`saved-header-btn ${isDarkMode ? 'dark' : ''}`}
                onClick={handleDownloadCSV}
                title="Download CSV"
              >
                📥 CSV
              </button>
              <button 
                className={`saved-header-btn danger ${isDarkMode ? 'dark' : ''}`}
                onClick={handleClearAllWebsites}
                title="Clear All"
              >
                🗑️ Clear All
              </button>
            </div>
          </div>
          
          {savedWebsites.length === 0 ? (
            <p style={{ fontSize: 13, color: isDarkMode ? 'rgba(255,255,255,0.5)' : '#9ca3af', textAlign: 'center', padding: '20px 0' }}>
              No websites saved yet. Click "Generate Link" to create one.
            </p>
          ) : (
            <div className="saved-websites-list">
              {savedWebsites.map((site) => {
                const siteTemplate = getTemplateById(site.template || 'general');
                return (
                  <div key={site.id} className={`saved-website-item ${isDarkMode ? 'dark' : ''}`}>
                    <div 
                      className="saved-website-color" 
                      style={{ background: `linear-gradient(135deg, ${site.formData?.primaryColor || '#1a3a5c'}, ${site.formData?.accentColor || '#c9a227'})` }}
                    />
                    <div className="saved-website-info">
                      <div className="saved-website-name">{site.formData?.companyName || 'Unnamed'}</div>
                      <div className="saved-website-date">
                        {new Date(site.createdAt).toLocaleDateString()}
                        <span className="saved-website-template"> • {siteTemplate.icon} {siteTemplate.name}</span>
                      </div>
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
        </div>
      </div>
      
      {/* Preview Panel */}
      <div className={`preview-panel ${isDarkMode ? 'dark' : ''}`}>
        <SelectedTemplateComponent formData={formData} images={images} />
      </div>
    </div>
  );
}