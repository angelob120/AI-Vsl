import React from 'react';

/**
 * TemplateGeneral - General Contractor Website Template
 * Features a clean, professional design with a contact form in the hero
 */
export default function TemplateGeneral({ formData, images }) {
  const data = formData;
  const imgs = images;

  return (
    <div className="template-general">
      <style>{templateGeneralStyles}</style>
      
      {/* Navigation Bar */}
      <nav className="tg-navbar">
        <div className="tg-navbar-logo">
          {imgs.logo ? (
            <img src={imgs.logo} alt="Logo" className="tg-navbar-logo-img" />
          ) : (
            <span className="tg-navbar-logo-text" style={{ color: data.primaryColor }}>
              {data.companyName || 'Company Name'}
            </span>
          )}
        </div>
        
        <div className="tg-navbar-links">
          <button className="tg-navbar-link">Home</button>
          <button className="tg-navbar-link">Services</button>
          <button className="tg-navbar-link">About</button>
          {imgs.gallery && imgs.gallery.length > 0 && <button className="tg-navbar-link">Gallery</button>}
          <button className="tg-navbar-link">Contact</button>
        </div>
        
        <div className="tg-navbar-cta">
          <div className="tg-navbar-phone">
            <span className="tg-navbar-phone-icon" style={{ background: `${data.accentColor}20`, color: data.accentColor }}>📞</span>
            {data.phone || '(555) 123-4567'}
          </div>
          <button className="tg-navbar-btn" style={{ background: data.primaryColor }}>
            Free Quote
          </button>
        </div>
      </nav>
      
      {/* Hero Section with Form */}
      <div 
        className="tg-hero" 
        style={{ 
          background: imgs.hero 
            ? `linear-gradient(135deg, ${data.primaryColor}ee 0%, ${data.primaryColor}cc 100%), url(${imgs.hero}) center/cover`
            : `linear-gradient(135deg, ${data.primaryColor} 0%, ${data.primaryColor}dd 100%)`
        }}
      >
        <div className="tg-hero-pattern" style={{ color: data.accentColor }} />
        
        <div className="tg-hero-content">
          <div className="tg-hero-text">
            <div className="tg-hero-badge">
              <span className="tg-hero-badge-dot" style={{ background: data.accentColor }} />
              Licensed &amp; Insured Contractor
            </div>
            
            <h1 className="tg-hero-title">{data.companyName || 'Your Company'}</h1>
            <p className="tg-hero-tagline">{data.tagline || 'Building Dreams, One Project at a Time'}</p>
            
            <div className="tg-hero-stats">
              <div className="tg-hero-stat">
                <div className="tg-hero-stat-value" style={{ color: data.accentColor }}>{data.yearsExperience || '10'}+</div>
                <div className="tg-hero-stat-label">Years Experience</div>
              </div>
              <div className="tg-hero-stat">
                <div className="tg-hero-stat-value" style={{ color: data.accentColor }}>500+</div>
                <div className="tg-hero-stat-label">Projects Done</div>
              </div>
              <div className="tg-hero-stat">
                <div className="tg-hero-stat-value" style={{ color: data.accentColor }}>100%</div>
                <div className="tg-hero-stat-label">Satisfaction</div>
              </div>
            </div>
          </div>
          
          {/* Hero Contact Form */}
          <div className="tg-hero-form">
            <div className="tg-form-header">
              {imgs.logo ? (
                <img src={imgs.logo} alt="Logo" className="tg-form-logo" />
              ) : (
                <div className="tg-form-logo-placeholder" style={{ background: data.primaryColor }}>
                  {(data.companyName || 'C').charAt(0)}
                </div>
              )}
              <h3 className="tg-form-title">Get Your Free Quote</h3>
              <p className="tg-form-subtitle">Fill out the form below and we'll get back to you within 24 hours</p>
            </div>
            
            <form className="tg-form" onSubmit={(e) => e.preventDefault()}>
              <div className="tg-form-group">
                <input type="text" placeholder="Your Name" className="tg-form-input" />
              </div>
              <div className="tg-form-group">
                <input type="tel" placeholder="Phone Number" className="tg-form-input" />
              </div>
              <div className="tg-form-group">
                <textarea placeholder="Tell us about your project..." className="tg-form-textarea" rows={4}></textarea>
              </div>
              <button type="submit" className="tg-form-submit" style={{ background: data.primaryColor }}>
                Get Free Estimate →
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Services Section */}
      <div className="tg-section" style={{ background: '#f8fafc' }}>
        <div className="tg-section-header">
          <div className="tg-section-label" style={{ color: data.accentColor }}>What We Do</div>
          <h2 className="tg-section-title">Our Services</h2>
        </div>
        
        <div className="tg-services-grid">
          {(data.services || []).map((service, index) => {
            const icons = ['🔨', '🏠', '🛁', '🪵', '⚡', '🎨', '🚿', '🪟'];
            return (
              <div key={index} className="tg-service-card">
                <div className="tg-service-icon" style={{ background: `${data.accentColor}20` }}>
                  {icons[index % icons.length]}
                </div>
                <h3 className="tg-service-title">{service}</h3>
                <p className="tg-service-desc">
                  Professional {service.toLowerCase()} services with attention to detail and quality craftsmanship.
                </p>
                <div className="tg-service-bar" style={{ background: data.accentColor }} />
              </div>
            );
          })}
        </div>
      </div>
      
      {/* About Section */}
      <div className="tg-section">
        <div className="tg-about">
          <div className="tg-about-image-wrapper">
            <div className="tg-about-image-bg" style={{ background: data.primaryColor }} />
            <div className="tg-about-image">
              {imgs.about ? (
                <img src={imgs.about} alt="About" />
              ) : (
                <span className="tg-about-placeholder">👷</span>
              )}
            </div>
          </div>
          
          <div className="tg-about-content">
            <div className="tg-section-label" style={{ color: data.accentColor }}>About Us</div>
            <h2 className="tg-about-title">Meet {data.ownerName || 'the Owner'}</h2>
            <p className="tg-about-text">
              With over {data.yearsExperience || '10'} years of experience in the construction industry, 
              {data.companyName || 'our company'} has built a reputation for excellence, reliability, and 
              exceptional craftsmanship. We take pride in transforming our clients' visions into reality.
            </p>
            
            <div className="tg-about-features">
              {['Licensed & Insured', 'Free Estimates', 'Quality Materials', 'On-Time Delivery'].map((feature, i) => (
                <div key={i} className="tg-about-feature">
                  <div className="tg-about-feature-icon" style={{ background: data.accentColor }}>✓</div>
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Gallery Section */}
      {imgs.gallery && imgs.gallery.length > 0 && (
        <div className="tg-section tg-gallery-section">
          <div className="tg-section-header">
            <div className="tg-section-label" style={{ color: data.accentColor }}>Our Work</div>
            <h2 className="tg-section-title">Recent Projects</h2>
          </div>
          
          <div className="tg-gallery-grid">
            {imgs.gallery.map((img, index) => (
              <div key={index} className="tg-gallery-item">
                <img src={img} alt={`Project ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* CTA Section */}
      <div className="tg-cta" style={{ background: data.primaryColor }}>
        <div className="tg-cta-pattern" style={{ color: data.accentColor }} />
        <div className="tg-cta-content">
          <h2 className="tg-cta-title">Ready to Start Your Project?</h2>
          <p className="tg-cta-text">
            Contact us today for a free consultation and estimate. Let's bring your vision to life.
          </p>
          <button className="tg-cta-btn" style={{ color: data.primaryColor }}>
            📞 {data.phone || '(555) 123-4567'}
          </button>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="tg-footer">
        <div className="tg-footer-content">
          <div>
            <div className="tg-footer-brand" style={{ color: data.accentColor }}>
              {data.companyName || 'Company Name'}
            </div>
            <p className="tg-footer-desc">
              Professional contracting services you can trust. 
              Serving the community with quality craftsmanship for over {data.yearsExperience || '10'} years.
            </p>
          </div>
          
          <div>
            <h4 className="tg-footer-title">Services</h4>
            <ul className="tg-footer-links">
              {(data.services || []).slice(0, 4).map((service, i) => (
                <li key={i}><span className="footer-service-link">{service}</span></li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="tg-footer-title">Contact</h4>
            <div className="tg-footer-contact">
              <div className="tg-footer-contact-item">
                <span style={{ background: `${data.accentColor}30`, color: data.accentColor }}>📞</span>
                {data.phone || '(555) 123-4567'}
              </div>
              <div className="tg-footer-contact-item">
                <span style={{ background: `${data.accentColor}30`, color: data.accentColor }}>✉️</span>
                {data.email || 'info@company.com'}
              </div>
              <div className="tg-footer-contact-item">
                <span style={{ background: `${data.accentColor}30`, color: data.accentColor }}>📍</span>
                {data.address || '123 Main St'}
              </div>
            </div>
          </div>
        </div>
        
        <div className="tg-footer-bottom">
          © 2025 {data.companyName || 'Company Name'}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

const templateGeneralStyles = `
  .template-general {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0,0,0,0.12);
    min-height: calc(100vh - 48px);
  }
  
  /* Navbar */
  .tg-navbar {
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
  
  .tg-navbar-logo { display: flex; align-items: center; gap: 12px; }
  .tg-navbar-logo-img { height: 40px; object-fit: contain; }
  .tg-navbar-logo-text { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; }
  .tg-navbar-links { display: flex; align-items: center; gap: 32px; }
  .tg-navbar-link { font-size: 14px; font-weight: 500; color: #4b5563; background: none; border: none; cursor: pointer; transition: color 0.2s; }
  .tg-navbar-link:hover { color: #1a1a2e; }
  .tg-navbar-cta { display: flex; align-items: center; gap: 16px; }
  .tg-navbar-phone { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: #374151; }
  .tg-navbar-phone-icon { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; }
  .tg-navbar-btn { padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; color: white; border: none; cursor: pointer; transition: all 0.2s; }
  .tg-navbar-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
  
  /* Hero */
  .tg-hero {
    position: relative;
    min-height: 700px;
    display: flex;
    align-items: center;
    overflow: hidden;
    padding: 60px;
  }
  
  .tg-hero-pattern {
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
  
  .tg-hero-content {
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: 60px;
  }
  
  .tg-hero-text { flex: 1; max-width: 550px; }
  
  .tg-hero-badge {
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
  
  .tg-hero-badge-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    animation: tgPulse 2s infinite;
  }
  
  @keyframes tgPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  .tg-hero-title {
    font-family: 'Playfair Display', serif;
    font-size: 52px;
    font-weight: 700;
    color: white;
    line-height: 1.1;
    margin-bottom: 20px;
    letter-spacing: -1px;
  }
  
  .tg-hero-tagline {
    font-size: 20px;
    color: rgba(255,255,255,0.9);
    line-height: 1.6;
    margin-bottom: 36px;
  }
  
  .tg-hero-stats {
    display: flex;
    gap: 32px;
  }
  
  .tg-hero-stat { text-align: center; }
  .tg-hero-stat-value { font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 700; }
  .tg-hero-stat-label { font-size: 12px; color: rgba(255,255,255,0.8); text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }
  
  /* Hero Form */
  .tg-hero-form {
    background: white;
    border-radius: 20px;
    padding: 32px;
    width: 380px;
    box-shadow: 0 25px 60px rgba(0,0,0,0.3);
  }
  
  .tg-form-header { text-align: center; margin-bottom: 24px; }
  .tg-form-logo { height: 50px; object-fit: contain; margin-bottom: 16px; }
  .tg-form-logo-placeholder {
    width: 50px;
    height: 50px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 24px;
    font-weight: 700;
    margin: 0 auto 16px;
  }
  .tg-form-title { font-size: 20px; font-weight: 700; color: #1a1a2e; margin-bottom: 8px; }
  .tg-form-subtitle { font-size: 13px; color: #6b7280; }
  
  .tg-form-group { margin-bottom: 16px; }
  .tg-form-input, .tg-form-textarea {
    width: 100%;
    padding: 14px 16px;
    border: 2px solid #e5e7eb;
    border-radius: 10px;
    font-size: 14px;
    font-family: inherit;
    transition: all 0.2s;
    box-sizing: border-box;
  }
  .tg-form-input:focus, .tg-form-textarea:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  .tg-form-textarea { resize: none; }
  
  .tg-form-submit {
    width: 100%;
    padding: 16px;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 600;
    color: white;
    cursor: pointer;
    transition: all 0.2s;
  }
  .tg-form-submit:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.2); }
  
  /* Sections */
  .tg-section { padding: 80px 60px; }
  .tg-section-header { text-align: center; margin-bottom: 50px; }
  .tg-section-label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px; }
  .tg-section-title { font-family: 'Playfair Display', serif; font-size: 42px; font-weight: 700; color: #1a1a2e; }
  
  /* Services */
  .tg-services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; }
  .tg-service-card {
    padding: 36px 28px;
    background: white;
    border-radius: 20px;
    border: 1px solid #e5e7eb;
    transition: all 0.3s;
    position: relative;
    overflow: hidden;
  }
  .tg-service-card:hover { transform: translateY(-4px); box-shadow: 0 20px 50px rgba(0,0,0,0.08); }
  .tg-service-icon { width: 56px; height: 56px; border-radius: 14px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; font-size: 24px; }
  .tg-service-title { font-size: 18px; font-weight: 700; color: #1a1a2e; margin-bottom: 10px; }
  .tg-service-desc { font-size: 14px; color: #6b7280; line-height: 1.6; }
  .tg-service-bar { position: absolute; top: 0; left: 0; right: 0; height: 4px; }
  
  /* About */
  .tg-about { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
  .tg-about-image-wrapper { position: relative; }
  .tg-about-image-bg { position: absolute; inset: 20px -20px -20px 20px; border-radius: 24px; opacity: 0.15; }
  .tg-about-image {
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
  .tg-about-image img { width: 100%; height: 100%; object-fit: cover; }
  .tg-about-placeholder { font-size: 80px; opacity: 0.3; }
  .tg-about-content { padding: 20px 0; }
  .tg-about-title { font-family: 'Playfair Display', serif; font-size: 38px; font-weight: 700; color: #1a1a2e; margin-bottom: 20px; line-height: 1.2; }
  .tg-about-text { font-size: 16px; color: #6b7280; line-height: 1.8; margin-bottom: 28px; }
  .tg-about-features { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .tg-about-feature { display: flex; align-items: center; gap: 12px; font-size: 14px; color: #374151; font-weight: 500; }
  .tg-about-feature-icon { width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; color: white; }
  
  /* Gallery */
  .tg-gallery-section { background: #f8fafc; }
  .tg-gallery-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
  .tg-gallery-item { aspect-ratio: 4/3; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); transition: all 0.3s; }
  .tg-gallery-item:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.15); }
  .tg-gallery-item img { width: 100%; height: 100%; object-fit: cover; }
  
  /* CTA */
  .tg-cta {
    text-align: center;
    border-radius: 32px;
    margin: 0 40px 40px;
    padding: 70px 60px;
    position: relative;
    overflow: hidden;
  }
  .tg-cta-pattern {
    position: absolute;
    inset: 0;
    opacity: 0.1;
    background-image: radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0);
    background-size: 24px 24px;
  }
  .tg-cta-content { position: relative; z-index: 2; }
  .tg-cta-title { font-family: 'Playfair Display', serif; font-size: 44px; font-weight: 700; color: white; margin-bottom: 16px; }
  .tg-cta-text { font-size: 18px; color: rgba(255,255,255,0.85); margin-bottom: 32px; max-width: 500px; margin-left: auto; margin-right: auto; }
  .tg-cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 16px 36px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    background: white;
    border: none;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  }
  .tg-cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.25); }
  
  /* Footer */
  .tg-footer { background: #0f172a; padding: 60px; color: white; }
  .tg-footer-content { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 60px; }
  .tg-footer-brand { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; margin-bottom: 16px; }
  .tg-footer-desc { font-size: 14px; color: rgba(255,255,255,0.6); line-height: 1.7; max-width: 300px; }
  .tg-footer-title { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; color: rgba(255,255,255,0.9); }
  .tg-footer-links { list-style: none; padding: 0; margin: 0; }
  .tg-footer-links li { margin-bottom: 12px; }
  .tg-footer-links a { color: rgba(255,255,255,0.6); text-decoration: none; font-size: 14px; transition: color 0.2s; }
  .tg-footer-links a:hover { color: white; }
  .tg-footer-contact-item { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; color: rgba(255,255,255,0.6); font-size: 14px; }
  .tg-footer-contact-item span { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 16px; }
  .tg-footer-bottom { border-top: 1px solid rgba(255,255,255,0.1); margin-top: 40px; padding-top: 24px; text-align: center; font-size: 13px; color: rgba(255,255,255,0.4); }
`;
