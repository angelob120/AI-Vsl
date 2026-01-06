import React from 'react';

/**
 * WebsitePreview - Renders the full contractor website preview
 */
export default function WebsitePreview({ formData, images }) {
  const data = formData;
  const imgs = images;

  return (
    <div className="preview-container">
      <style>{websitePreviewStyles}</style>
      
      {/* Navigation Bar */}
      <nav className="website-navbar">
        <div className="navbar-logo">
          {imgs.logo ? (
            <img src={imgs.logo} alt="Logo" className="navbar-logo-img" />
          ) : (
            <span className="navbar-logo-text" style={{ color: data.primaryColor }}>
              {data.companyName || 'Company Name'}
            </span>
          )}
        </div>
        
        <div className="navbar-links">
          <a className="navbar-link">Home</a>
          <a className="navbar-link">Services</a>
          <a className="navbar-link">About</a>
          {imgs.gallery && imgs.gallery.length > 0 && <a className="navbar-link">Gallery</a>}
          <a className="navbar-link">Contact</a>
        </div>
        
        <div className="navbar-cta">
          <div className="navbar-phone">
            <span className="navbar-phone-icon" style={{ background: `${data.accentColor}20`, color: data.accentColor }}>📞</span>
            {data.phone || '(555) 123-4567'}
          </div>
          <button className="navbar-btn" style={{ background: data.primaryColor }}>
            Free Quote
          </button>
        </div>
      </nav>
      
      {/* Hero Section */}
      <div 
        className="website-hero" 
        style={{ 
          background: imgs.hero 
            ? `linear-gradient(135deg, ${data.primaryColor}ee 0%, ${data.primaryColor}cc 100%), url(${imgs.hero}) center/cover`
            : `linear-gradient(135deg, ${data.primaryColor} 0%, ${data.primaryColor}dd 100%)`
        }}
      >
        <div className="hero-bg-pattern" style={{ color: data.accentColor, opacity: imgs.hero ? 0.03 : 0.06 }} />
        
        <div className="hero-content">
          {imgs.logo ? (
            <img src={imgs.logo} alt="Logo" style={{ height: 60, marginBottom: 24, objectFit: 'contain' }} />
          ) : (
            <div className="hero-badge">
              <span className="hero-badge-dot" style={{ background: data.accentColor }} />
              Licensed &amp; Insured Contractor
            </div>
          )}
          
          <h1 className="hero-title">{data.companyName || 'Your Company'}</h1>
          <p className="hero-tagline">{data.tagline || 'Your tagline here'}</p>
          
          <div className="hero-cta-row">
            <button className="hero-cta hero-cta-primary" style={{ color: data.primaryColor }}>
              <span>📞</span>
              {data.phone || 'Call Us'}
            </button>
            <button className="hero-cta hero-cta-secondary">
              <span>✉️</span>
              Get Free Estimate
            </button>
          </div>
        </div>
        
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-value" style={{ color: data.primaryColor }}>{data.yearsExperience || '10'}+</div>
            <div className="hero-stat-label">Years Experience</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value" style={{ color: data.primaryColor }}>500+</div>
            <div className="hero-stat-label">Projects Completed</div>
          </div>
        </div>
      </div>
      
      {/* Services Section */}
      <div className="section" style={{ background: '#f8fafc' }}>
        <div className="section-header">
          <div className="section-label" style={{ color: data.accentColor }}>What We Do</div>
          <h2 className="section-title">Our Services</h2>
        </div>
        
        <div className="services-grid">
          {(data.services || []).map((service, index) => {
            const icons = ['🔨', '🏠', '🛁', '🪵', '⚡', '🎨', '🚿', '🪟'];
            return (
              <div key={index} className="service-card">
                <div 
                  className="service-icon" 
                  style={{ background: `${data.accentColor}20` }}
                >
                  {icons[index % icons.length]}
                </div>
                <h3 className="service-card-title">{service}</h3>
                <p className="service-card-desc">
                  Professional {service.toLowerCase()} services with attention to detail and quality craftsmanship.
                </p>
                <div style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  right: 0, 
                  height: 4, 
                  background: data.accentColor 
                }} className="service-card-bar" />
              </div>
            );
          })}
        </div>
      </div>
      
      {/* About Section */}
      <div className="section">
        <div className="about-section">
          <div className="about-image-wrapper">
            <div className="about-image-bg" style={{ background: data.primaryColor }} />
            <div className="about-image" style={imgs.about ? { background: 'none' } : {}}>
              {imgs.about ? (
                <img src={imgs.about} alt="About" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 24 }} />
              ) : (
                <span className="about-image-placeholder">👷</span>
              )}
            </div>
          </div>
          
          <div className="about-content">
            <div className="about-label" style={{ color: data.accentColor }}>About Us</div>
            <h2 className="about-title">Meet {data.ownerName || 'the Owner'}</h2>
            <p className="about-text">
              With over {data.yearsExperience || '10'} years of experience in the construction industry, 
              {data.companyName || 'our company'} has built a reputation for excellence, reliability, and 
              exceptional craftsmanship. We take pride in transforming our clients' visions into reality.
            </p>
            
            <div className="about-features">
              {['Licensed & Insured', 'Free Estimates', 'Quality Materials', 'On-Time Delivery'].map((feature, i) => (
                <div key={i} className="about-feature">
                  <div className="about-feature-icon" style={{ background: data.accentColor }}>✓</div>
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Gallery Section */}
      {imgs.gallery && imgs.gallery.length > 0 && (
        <div className="section gallery-section">
          <div className="section-header">
            <div className="section-label" style={{ color: data.accentColor }}>Our Work</div>
            <h2 className="section-title">Recent Projects</h2>
          </div>
          
          <div className="gallery-preview-grid">
            {imgs.gallery.map((img, index) => (
              <div key={index} className="gallery-preview-item">
                <img src={img} alt={`Project ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* CTA Section */}
      <div className="cta-section" style={{ background: data.primaryColor }}>
        <div className="cta-pattern" style={{ color: data.accentColor }} />
        <div className="cta-content">
          <h2 className="cta-title">Ready to Start Your Project?</h2>
          <p className="cta-text">
            Contact us today for a free consultation and estimate. Let's bring your vision to life.
          </p>
          <div className="cta-buttons">
            <button className="cta-btn cta-btn-primary" style={{ color: data.primaryColor }}>
              📞 {data.phone || '(555) 123-4567'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="footer">
        <div className="footer-content">
          <div>
            <div className="footer-brand" style={{ color: data.accentColor }}>
              {data.companyName || 'Company Name'}
            </div>
            <p className="footer-desc">
              Professional contracting services you can trust. 
              Serving the community with quality craftsmanship for over {data.yearsExperience || '10'} years.
            </p>
          </div>
          
          <div>
            <h4 className="footer-title">Services</h4>
            <ul className="footer-links">
              {(data.services || []).slice(0, 4).map((service, i) => (
                <li key={i} className="footer-link">
                  <a href="#">{service}</a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="footer-title">Contact</h4>
            <div className="footer-contact-item">
              <div className="footer-contact-icon" style={{ background: `${data.accentColor}30`, color: data.accentColor }}>📞</div>
              {data.phone || '(555) 123-4567'}
            </div>
            <div className="footer-contact-item">
              <div className="footer-contact-icon" style={{ background: `${data.accentColor}30`, color: data.accentColor }}>✉️</div>
              {data.email || 'info@company.com'}
            </div>
            <div className="footer-contact-item">
              <div className="footer-contact-icon" style={{ background: `${data.accentColor}30`, color: data.accentColor }}>📍</div>
              {data.address || '123 Main St'}
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          © 2025 {data.companyName || 'Company Name'}. All rights reserved.
        </div>
      </div>
    </div>
  );
}

const websitePreviewStyles = `
  .preview-container {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0,0,0,0.12);
    min-height: calc(100vh - 48px);
  }
  
  .website-navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 40px;
    background: white;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 2px 20px rgba(0,0,0,0.06);
  }
  
  .navbar-logo {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .navbar-logo-img {
    height: 40px;
    object-fit: contain;
  }
  
  .navbar-logo-text {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    font-weight: 700;
  }
  
  .navbar-links {
    display: flex;
    align-items: center;
    gap: 32px;
  }
  
  .navbar-link {
    font-size: 14px;
    font-weight: 500;
    color: #4b5563;
    text-decoration: none;
    transition: color 0.2s ease;
    cursor: pointer;
  }
  
  .navbar-link:hover {
    color: #1a1a2e;
  }
  
  .navbar-cta {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  
  .navbar-phone {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #374151;
  }
  
  .navbar-phone-icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
  }
  
  .navbar-btn {
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    color: white;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .navbar-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }
  
  .website-hero {
    position: relative;
    min-height: 600px;
    display: flex;
    align-items: center;
    overflow: hidden;
  }
  
  .hero-bg-pattern {
    position: absolute;
    inset: 0;
    opacity: 0.06;
    background-image: 
      linear-gradient(45deg, currentColor 25%, transparent 25%),
      linear-gradient(-45deg, currentColor 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, currentColor 75%),
      linear-gradient(-45deg, transparent 75%, currentColor 75%);
    background-size: 60px 60px;
    background-position: 0 0, 0 30px, 30px -30px, -30px 0px;
  }
  
  .hero-content {
    position: relative;
    z-index: 2;
    padding: 80px 60px;
    max-width: 650px;
  }
  
  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: rgba(255,255,255,0.15);
    border-radius: 30px;
    font-size: 13px;
    font-weight: 600;
    color: white;
    margin-bottom: 24px;
    backdrop-filter: blur(4px);
  }
  
  .hero-badge-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  .hero-title {
    font-family: 'Playfair Display', serif;
    font-size: 56px;
    font-weight: 700;
    color: white;
    line-height: 1.1;
    margin-bottom: 20px;
    letter-spacing: -1px;
  }
  
  .hero-tagline {
    font-size: 20px;
    color: rgba(255,255,255,0.9);
    line-height: 1.6;
    margin-bottom: 36px;
    font-weight: 400;
  }
  
  .hero-cta-row {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }
  
  .hero-cta {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 16px 32px;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
    cursor: pointer;
    border: none;
  }
  
  .hero-cta-primary {
    background: white;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  }
  
  .hero-cta-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0,0,0,0.2);
  }
  
  .hero-cta-secondary {
    background: rgba(255,255,255,0.15);
    color: white;
    backdrop-filter: blur(4px);
    border: 2px solid rgba(255,255,255,0.3);
  }
  
  .hero-cta-secondary:hover {
    background: rgba(255,255,255,0.25);
  }
  
  .hero-stats {
    position: absolute;
    bottom: 40px;
    right: 40px;
    display: flex;
    gap: 24px;
  }
  
  .hero-stat {
    text-align: center;
    padding: 20px 28px;
    background: rgba(255,255,255,0.95);
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.15);
  }
  
  .hero-stat-value {
    font-family: 'Playfair Display', serif;
    font-size: 36px;
    font-weight: 700;
    line-height: 1;
    margin-bottom: 4px;
  }
  
  .hero-stat-label {
    font-size: 12px;
    color: #6b7280;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .section {
    padding: 80px 60px;
  }
  
  .section-header {
    text-align: center;
    margin-bottom: 50px;
  }
  
  .section-label {
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 12px;
  }
  
  .section-title {
    font-family: 'Playfair Display', serif;
    font-size: 42px;
    font-weight: 700;
    color: #1a1a2e;
    letter-spacing: -0.5px;
  }
  
  .services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 24px;
  }
  
  .service-card {
    padding: 36px 28px;
    background: white;
    border-radius: 20px;
    border: 1px solid #e5e7eb;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  
  .service-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 50px rgba(0,0,0,0.08);
    border-color: transparent;
  }
  
  .service-icon {
    width: 56px;
    height: 56px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    font-size: 24px;
  }
  
  .service-card-title {
    font-size: 18px;
    font-weight: 700;
    color: #1a1a2e;
    margin-bottom: 10px;
  }
  
  .service-card-desc {
    font-size: 14px;
    color: #6b7280;
    line-height: 1.6;
  }
  
  .about-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
  }
  
  .about-image-wrapper {
    position: relative;
  }
  
  .about-image-bg {
    position: absolute;
    inset: 20px -20px -20px 20px;
    border-radius: 24px;
    opacity: 0.15;
  }
  
  .about-image {
    position: relative;
    width: 100%;
    height: 400px;
    border-radius: 24px;
    background: linear-gradient(135deg, #f8fafc, #e2e8f0);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  
  .about-image-placeholder {
    font-size: 80px;
    opacity: 0.3;
  }
  
  .about-content {
    padding: 20px 0;
  }
  
  .about-label {
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 16px;
  }
  
  .about-title {
    font-family: 'Playfair Display', serif;
    font-size: 38px;
    font-weight: 700;
    color: #1a1a2e;
    margin-bottom: 20px;
    line-height: 1.2;
  }
  
  .about-text {
    font-size: 16px;
    color: #6b7280;
    line-height: 1.8;
    margin-bottom: 28px;
  }
  
  .about-features {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  
  .about-feature {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    color: #374151;
    font-weight: 500;
  }
  
  .about-feature-icon {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: white;
  }
  
  .gallery-section {
    background: #f8fafc;
  }
  
  .gallery-preview-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  
  .gallery-preview-item {
    aspect-ratio: 4/3;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    transition: all 0.3s ease;
  }
  
  .gallery-preview-item:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.15);
  }
  
  .gallery-preview-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .cta-section {
    text-align: center;
    border-radius: 32px;
    margin: 0 40px 40px;
    padding: 70px 60px;
    position: relative;
    overflow: hidden;
  }
  
  .cta-pattern {
    position: absolute;
    inset: 0;
    opacity: 0.1;
    background-image: radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0);
    background-size: 24px 24px;
  }
  
  .cta-content {
    position: relative;
    z-index: 2;
  }
  
  .cta-title {
    font-family: 'Playfair Display', serif;
    font-size: 44px;
    font-weight: 700;
    color: white;
    margin-bottom: 16px;
  }
  
  .cta-text {
    font-size: 18px;
    color: rgba(255,255,255,0.85);
    margin-bottom: 32px;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .cta-buttons {
    display: flex;
    justify-content: center;
    gap: 16px;
    flex-wrap: wrap;
  }
  
  .cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 16px 36px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
    cursor: pointer;
    border: none;
  }
  
  .cta-btn-primary {
    background: white;
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  }
  
  .cta-btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0,0,0,0.25);
  }
  
  .footer {
    background: #0f172a;
    padding: 60px;
    color: white;
  }
  
  .footer-content {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    gap: 60px;
  }
  
  .footer-brand {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 16px;
  }
  
  .footer-desc {
    font-size: 14px;
    color: rgba(255,255,255,0.6);
    line-height: 1.7;
    max-width: 300px;
  }
  
  .footer-title {
    font-size: 14px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 20px;
    color: rgba(255,255,255,0.9);
  }
  
  .footer-links {
    list-style: none;
  }
  
  .footer-link {
    margin-bottom: 12px;
  }
  
  .footer-link a {
    color: rgba(255,255,255,0.6);
    text-decoration: none;
    font-size: 14px;
    transition: color 0.2s ease;
  }
  
  .footer-link a:hover {
    color: white;
  }
  
  .footer-contact-item {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 14px;
    color: rgba(255,255,255,0.6);
    font-size: 14px;
  }
  
  .footer-contact-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  }
  
  .footer-bottom {
    border-top: 1px solid rgba(255,255,255,0.1);
    margin-top: 40px;
    padding-top: 24px;
    text-align: center;
    font-size: 13px;
    color: rgba(255,255,255,0.4);
  }
`;
