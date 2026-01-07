import React, { useState, useEffect } from 'react';
import WebsitePreview from './WebsitePreview';
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

export default function ContractorBuilder({ onNavigateToRepliq }) {
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
      // Sort by createdAt descending
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
          setSavedWebsites(prev => [savedSite, ...prev]);
        }
      } catch (error) {
        console.error('Auto-save error:', error);
      }
    }
    
    setFormData(defaultContractorFormData);
    setImages(defaultContractorImages);
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

  const backToBuilder = () => {
    setViewMode('builder');
    setPreviewData(null);
    window.location.hash = '';
  };

  const handleImageUpload = async (type, e) => {
    const file = e.target.files[0];
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

  // Handle paste for images (supports Ctrl+V and right-click paste)
  const handlePaste = async (type, e) => {
    const clipboardData = e.clipboardData || window.clipboardData;
    const items = clipboardData?.items;
    
    if (!items) return;
    
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        const file = items[i].getAsFile();
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
          return;
        }
      }
    }
  };

  // Handle right-click paste from context menu
  const handleContextPaste = async (type) => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      for (const item of clipboardItems) {
        const imageType = item.types.find(t => t.startsWith('image/'));
        if (imageType) {
          const blob = await item.getType(imageType);
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
    const success = await copyToClipboard(link);
    if (success) {
      alert('Link copied to clipboard!');
    }
  };

  const handleClearAllWebsites = async () => {
    if (savedWebsites.length === 0) {
      alert('No websites to delete.');
      return;
    }
    
    const confirmed = window.confirm(
      `⚠️ WARNING: This will permanently delete ALL ${savedWebsites.length} saved websites.\n\nThis action cannot be undone!\n\nAre you sure you want to continue?`
    );
    
    if (confirmed) {
      const doubleConfirmed = window.confirm(
        '🚨 FINAL WARNING: You are about to delete ALL saved websites.\n\nClick OK to permanently delete everything.'
      );
      
      if (doubleConfirmed) {
        try {
          const success = await deleteAllWebsites();
          if (success) {
            setSavedWebsites([]);
            alert('All websites have been deleted.');
          } else {
            alert('Failed to delete websites.');
          }
        } catch (error) {
          console.error('Clear all error:', error);
          alert('Failed to delete websites. Please try again.');
        }
      }
    }
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
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        Loading...
      </div>
    );
  }

  if (viewMode === 'preview' && previewData) {
    return (
      <div style={{ background: '#e5e7eb', minHeight: '100vh' }}>
        <button className="preview-back-btn" onClick={backToBuilder}>
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
    <div className="contractor-builder">
      {/* Form Panel */}
      <div className="form-panel">
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
          {onNavigateToRepliq && (
            <Button variant="accent" onClick={onNavigateToRepliq}>
              🎥 RepliQ
            </Button>
          )}
        </div>
        
        {generatedLink && (
          <div className="generated-link-box">
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
                className={`template-option ${selectedTemplate === template.id ? 'active' : ''}`}
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
              className="form-input"
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
              className="form-input"
              placeholder="John Smith"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Tagline</label>
            <input
              type="text"
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
              className="form-input"
              placeholder="Your company tagline"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="form-input"
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
              className="form-input"
              placeholder="info@company.com"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="form-input"
              placeholder="123 Main St, City, ST 12345"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Years in Business</label>
            <input
              type="text"
              name="yearsExperience"
              value={formData.yearsExperience}
              onChange={handleChange}
              className="form-input"
              placeholder="10"
            />
          </div>
        </div>
        
        {/* Images - WITH PASTE SUPPORT */}
        <div className="form-section">
          <h2 className="form-section-title">Images</h2>
          
          {/* Company Logo */}
          <div className="image-upload-section">
            <label className="image-upload-label">Company Logo</label>
            <div 
              className={`image-upload-area ${images.logo ? 'has-image' : ''}`}
              tabIndex={0}
              onPaste={(e) => handlePaste('logo', e)}
              onContextMenu={(e) => {
                e.preventDefault();
                handleContextPaste('logo');
              }}
            >
              {images.logo ? (
                <>
                  <img src={images.logo} alt="Logo" className="uploaded-image-preview logo" />
                  <button className="image-remove-btn" onClick={(e) => { e.stopPropagation(); removeImage('logo'); }}>×</button>
                </>
              ) : (
                <>
                  <div className="image-upload-icon">🏢</div>
                  <div className="image-upload-text">Click to upload or right-click to paste</div>
                  <div className="image-upload-hint">PNG or SVG recommended</div>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="image-upload-input"
                onChange={(e) => handleImageUpload('logo', e)}
              />
            </div>
          </div>
          
          {/* Hero Background */}
          <div className="image-upload-section">
            <label className="image-upload-label">Hero Background</label>
            <div 
              className={`image-upload-area ${images.hero ? 'has-image' : ''}`}
              tabIndex={0}
              onPaste={(e) => handlePaste('hero', e)}
              onContextMenu={(e) => {
                e.preventDefault();
                handleContextPaste('hero');
              }}
            >
              {images.hero ? (
                <>
                  <img src={images.hero} alt="Hero" className="uploaded-image-preview" />
                  <button className="image-remove-btn" onClick={(e) => { e.stopPropagation(); removeImage('hero'); }}>×</button>
                </>
              ) : (
                <>
                  <div className="image-upload-icon">🖼️</div>
                  <div className="image-upload-text">Click to upload or right-click to paste</div>
                  <div className="image-upload-hint">Recommended: 1920x800px</div>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="image-upload-input"
                onChange={(e) => handleImageUpload('hero', e)}
              />
            </div>
          </div>
          
          {/* About / Team Photo */}
          <div className="image-upload-section">
            <label className="image-upload-label">About / Team Photo</label>
            <div 
              className={`image-upload-area ${images.about ? 'has-image' : ''}`}
              tabIndex={0}
              onPaste={(e) => handlePaste('about', e)}
              onContextMenu={(e) => {
                e.preventDefault();
                handleContextPaste('about');
              }}
            >
              {images.about ? (
                <>
                  <img src={images.about} alt="About" className="uploaded-image-preview" />
                  <button className="image-remove-btn" onClick={(e) => { e.stopPropagation(); removeImage('about'); }}>×</button>
                </>
              ) : (
                <>
                  <div className="image-upload-icon">👷</div>
                  <div className="image-upload-text">Click to upload or right-click to paste</div>
                  <div className="image-upload-hint">Show your team at work</div>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="image-upload-input"
                onChange={(e) => handleImageUpload('about', e)}
              />
            </div>
          </div>
          
          {/* Project Gallery */}
          <div className="image-upload-section">
            <label className="image-upload-label">Project Gallery</label>
            <div className="gallery-grid">
              {images.gallery.map((img, index) => (
                <div key={index} className="gallery-item">
                  <img src={img} alt={`Project ${index + 1}`} />
                  <button className="image-remove-btn" onClick={() => removeGalleryImage(index)}>×</button>
                </div>
              ))}
              {images.gallery.length < 6 && (
                <div 
                  className="gallery-add"
                  tabIndex={0}
                  onPaste={(e) => handlePaste('gallery', e)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    handleContextPaste('gallery');
                  }}
                >
                  <span>+</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="image-upload-input"
                    onChange={(e) => handleImageUpload('gallery', e)}
                  />
                </div>
              )}
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
                className={`color-preset ${formData.primaryColor === preset.primary ? 'active' : ''}`}
                onClick={() => setFormData(prev => ({ 
                  ...prev, 
                  primaryColor: preset.primary, 
                  accentColor: preset.accent 
                }))}
              >
                <div className="color-preset-dots">
                  <div className="color-dot" style={{ background: preset.primary }} />
                  <div className="color-dot" style={{ background: preset.accent }} />
                </div>
                <div className="color-preset-name">{preset.name}</div>
              </button>
            ))}
          </div>
          
          <div className="color-picker-row">
            <div className="color-picker-group">
              <label className="form-label">Primary Color</label>
              <input
                type="color"
                value={formData.primaryColor}
                onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                className="form-input"
                style={{ height: 40, padding: 4 }}
              />
            </div>
            <div className="color-picker-group">
              <label className="form-label">Accent Color</label>
              <input
                type="color"
                value={formData.accentColor}
                onChange={(e) => setFormData(prev => ({ ...prev, accentColor: e.target.value }))}
                className="form-input"
                style={{ height: 40, padding: 4 }}
              />
            </div>
          </div>
        </div>
        
        {/* Services */}
        <div className="form-section">
          <h2 className="form-section-title">Services</h2>
          
          <div className="services-list">
            {formData.services.map((service, index) => (
              <div key={index} className="service-tag">
                {service}
                <button className="service-remove" onClick={() => removeService(index)}>×</button>
              </div>
            ))}
          </div>
          
          <div className="add-service-row">
            <input
              type="text"
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
              className="form-input"
              placeholder="Add a service..."
              onKeyPress={(e) => e.key === 'Enter' && addService()}
            />
            <button className="add-service-btn" onClick={addService}>
              Add
            </button>
          </div>
        </div>
        
        {/* Saved Websites */}
        <div className="saved-websites-section">
          <div className="saved-websites-header">
            <div className="saved-websites-title">
              <span className="saved-count">{savedWebsites.length}</span>
              Saved Websites
            </div>
            {savedWebsites.length > 0 && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="download-csv-btn" onClick={handleDownloadCSV}>
                  📥 Export CSV
                </button>
                <button 
                  className="download-csv-btn" 
                  onClick={handleClearAllWebsites}
                  style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}
                >
                  🗑️ Clear All
                </button>
              </div>
            )}
          </div>
          
          {savedWebsites.length === 0 ? (
            <p style={{ fontSize: 13, color: '#9ca3af', textAlign: 'center', padding: '20px 0' }}>
              No websites saved yet. Click "Generate Link" to create one.
            </p>
          ) : (
            <div className="saved-websites-list">
              {savedWebsites.map((site) => (
                <div key={site.id} className="saved-website-item">
                  <div 
                    className="saved-website-color" 
                    style={{ background: `linear-gradient(135deg, ${site.formData.primaryColor}, ${site.formData.accentColor})` }}
                  />
                  <div className="saved-website-info">
                    <div className="saved-website-name">{site.formData.companyName}</div>
                    <div className="saved-website-date">
                      {new Date(site.createdAt).toLocaleDateString()}
                      {site.template && <span className="saved-website-template"> • {getTemplateById(site.template).icon}</span>}
                    </div>
                  </div>
                  <div className="saved-website-actions">
                    <button 
                      className="saved-action-btn" 
                      title="Copy Link"
                      onClick={() => handleCopyLink(site.link)}
                    >
                      🔗
                    </button>
                    <button 
                      className="saved-action-btn" 
                      title="Duplicate"
                      onClick={() => duplicateWebsite(site)}
                    >
                      📋
                    </button>
                    <button 
                      className="saved-action-btn delete" 
                      title="Delete"
                      onClick={() => handleDeleteWebsite(site.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Preview Panel */}
      <div className="preview-panel">
        <SelectedTemplateComponent formData={formData} images={images} />
      </div>
    </div>
  );
}