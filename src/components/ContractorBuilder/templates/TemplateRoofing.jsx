import React from 'react';

/**
 * TemplateRoofing - Roofing Contractor Website Template
 * Features a bold, modern design with angular elements and a contact form in the hero
 */
export default function TemplateRoofing({ formData, images }) {
  const data = formData;
  const imgs = images;

  return (
    <div className="template-roofing">
      <style>{templateRoofingStyles}</style>
      
      {/* Navigation Bar */}
      <nav className="tr-navbar">
        <div className="tr-navbar-logo">
          {imgs.logo ? (
            <img src={imgs.logo} alt="Logo" className="tr-navbar-logo-img" />
          ) : (
            <span className="tr-navbar-logo-text" style={{ color: data.primaryColor }}>
              🏠 {data.companyName || 'Company Name'}
            </span>
          )}
        </div>
        
        <div className="tr-navbar-links">
          <button className="tr-navbar-link">Home</button>
          <button className="tr-navbar-link">Services</button>
          <button className="tr-navbar-link">About</button>
          {imgs.gallery && imgs.gallery.length > 0 && <button className="tr-navbar-link">Projects</button>}
          <button className="tr-navbar-link">Contact</button>
        </div>
        
        <div className="tr-navbar-cta">
          <button className="tr-navbar-btn" style={{ background: data.accentColor }}>
            🚨 Emergency Service
          </button>
        </div>
      </nav>
      
      {/* Hero Section with Form */}
      <div 
        className="tr-hero" 
        style={{ 
          background: imgs.hero 
            ? `linear-gradient(160deg, ${data.primaryColor}f0 0%, ${data.primaryColor}99 100%), url(${imgs.hero}) center/cover`
            : `linear-gradient(160deg, ${data.primaryColor} 0%, #1a1a2e 100%)`
        }}
      >
        <div className="tr-hero-overlay" />
        <div className="tr-hero-angle" style={{ background: data.accentColor }} />
        
        <div className="tr-hero-content">
          <div className="tr-hero-text">
            <div className="tr-hero-badge" style={{ background: data.accentColor }}>
              ⭐ Top Rated Roofing Experts
            </div>
            
            <h1 className="tr-hero-title">
              Protecting Your Home<br/>
              <span style={{ color: data.accentColor }}>From the Top Down</span>
            </h1>
            <p className="tr-hero-tagline">{data.tagline || 'Professional roofing services for residential and commercial properties. Quality materials, expert installation, lasting protection.'}</p>
            
            <div className="tr-hero-features">
              <div className="tr-hero-feature">
                <span className="tr-feature-icon" style={{ background: data.accentColor }}>✓</span>
                Free Inspections
              </div>
              <div className="tr-hero-feature">
                <span className="tr-feature-icon" style={{ background: data.accentColor }}>✓</span>
                Storm Damage Repair
              </div>
              <div className="tr-hero-feature">
                <span className="tr-feature-icon" style={{ background: data.accentColor }}>✓</span>
                25+ Year Warranty
              </div>
            </div>
            
            <div className="tr-hero-phone">
              <span className="tr-phone-icon" style={{ background: data.accentColor }}>📞</span>
              <div>
                <div className="tr-phone-label">Call Now - 24/7</div>
                <div className="tr-phone-number">{data.phone || '(555) 123-4567'}</div>
              </div>
            </div>
          </div>
          
          {/* Hero Contact Form */}
          <div className="tr-hero-form">
            <div className="tr-form-header">
              {imgs.logo ? (
                <img src={imgs.logo} alt="Logo" className="tr-form-logo" />
              ) : (
                <div className="tr-form-logo-placeholder" style={{ background: data.accentColor }}>
                  🏠
                </div>
              )}
              <h3 className="tr-form-title">Free Roof Inspection</h3>
              <p className="tr-form-subtitle">Schedule your free inspection today</p>
            </div>
            
            <form className="tr-form" onSubmit={(e) => e.preventDefault()}>
              <div className="tr-form-group">
                <input type="text" placeholder="Your Name" className="tr-form-input" />
              </div>
              <div className="tr-form-group">
                <input type="tel" placeholder="Phone Number" className="tr-form-input" />
              </div>
              <div className="tr-form-group">
                <textarea placeholder="Describe your roofing needs..." className="tr-form-textarea" rows={3}></textarea>
              </div>
              <button type="submit" className="tr-form-submit" style={{ background: data.accentColor }}>
                Get Free Inspection →
              </button>
              <p className="tr-form-note">✓ No obligation · Same day response</p>
            </form>
          </div>
        </div>
      </div>
      
      {/* Trust Bar */}
      <div className="tr-trust-bar" style={{ background: data.primaryColor }}>
        <div className="tr-trust-item">
          <span className="tr-trust-value" style={{ color: data.accentColor }}>{data.yearsExperience || '15'}+</span>
          <span className="tr-trust-label">Years Experience</span>
        </div>
        <div className="tr-trust-item">
          <span className="tr-trust-value" style={{ color: data.accentColor }}>2,500+</span>
          <span className="tr-trust-label">Roofs Installed</span>
        </div>
        <div className="tr-trust-item">
          <span className="tr-trust-value" style={{ color: data.accentColor }}>100%</span>
          <span className="tr-trust-label">Satisfaction</span>
        </div>
        <div className="tr-trust-item">
          <span className="tr-trust-value" style={{ color: data.accentColor }}>A+</span>
          <span className="tr-trust-label">BBB Rating</span>
        </div>
      </div>
      
      {/* Services Section */}
      <div className="tr-section">
        <div className="tr-section-header">
          <div className="tr-section-label" style={{ color: data.accentColor }}>Our Expertise</div>
          <h2 className="tr-section-title">Roofing Services</h2>
          <p className="tr-section-subtitle">Complete roofing solutions for every need</p>
        </div>
        
        <div className="tr-services-grid">
          {(data.services || ['Roof Installation', 'Roof Repair', 'Storm Damage', 'Inspections']).map((service, index) => {
            const icons = ['🏠', '🔧', '⛈️', '🔍', '🛡️', '✨', '📋', '🔨'];
            const descriptions = [
              'Complete roof installation with premium materials',
              'Expert repairs for leaks and damage',
              'Emergency storm damage restoration',
              'Comprehensive roof inspections',
              'Protective coatings and treatments',
              'Roof cleaning and maintenance',
              'Insurance claim assistance',
              'Gutter installation and repair'
            ];
            return (
              <div key={index} className="tr-service-card" style={{ borderColor: data.accentColor }}>
                <div className="tr-service-icon" style={{ background: `${data.accentColor}20`, color: data.accentColor }}>
                  {icons[index % icons.length]}
                </div>
                <h3 className="tr-service-title">{service}</h3>
                <p className="tr-service-desc">{descriptions[index % descriptions.length]}</p>
                <button className="tr-service-btn" style={{ color: data.accentColor }}>
                  Learn More →
                </button>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* About Section */}
      <div className="tr-section tr-about-section" style={{ background: '#f8fafc' }}>
        <div className="tr-about">
          <div className="tr-about-content">
            <div className="tr-section-label" style={{ color: data.accentColor }}>Why Choose Us</div>
            <h2 className="tr-about-title">{data.companyName || 'Your Trusted Roofer'}</h2>
            <p className="tr-about-text">
              With over {data.yearsExperience || '15'} years of experience protecting homes and businesses, 
              we've built a reputation for quality workmanship, honest pricing, and exceptional customer service. 
              Our team of certified professionals uses only the highest-quality materials to ensure your roof 
              stands the test of time.
            </p>
            
            <div className="tr-about-grid">
              {['Licensed & Insured', 'Certified Installers', 'Premium Materials', 'Warranty Included'].map((item, i) => (
                <div key={i} className="tr-about-item">
                  <div className="tr-about-icon" style={{ background: data.accentColor }}>✓</div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="tr-about-image">
            {imgs.about ? (
              <img src={imgs.about} alt="About" />
            ) : (
              <div className="tr-about-placeholder">
                <span>👷</span>
                <p>Expert Roofing Team</p>
              </div>
            )}
            <div className="tr-about-badge" style={{ background: data.accentColor }}>
              <span className="tr-badge-number">{data.yearsExperience || '15'}+</span>
              <span className="tr-badge-text">Years of Excellence</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Gallery Section */}
      {imgs.gallery && imgs.gallery.length > 0 && (
        <div className="tr-section">
          <div className="tr-section-header">
            <div className="tr-section-label" style={{ color: data.accentColor }}>Our Portfolio</div>
            <h2 className="tr-section-title">Recent Projects</h2>
          </div>
          
          <div className="tr-gallery-grid">
            {imgs.gallery.map((img, index) => (
              <div key={index} className="tr-gallery-item">
                <img src={img} alt={`Project ${index + 1}`} />
                <div className="tr-gallery-overlay" style={{ background: `linear-gradient(to top, ${data.primaryColor}, transparent)` }}>
                  <span>View Project</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* CTA Section */}
      <div className="tr-cta" style={{ background: `linear-gradient(135deg, ${data.primaryColor}, #1a1a2e)` }}>
        <div className="tr-cta-content">
          <h2 className="tr-cta-title">Need a New Roof?</h2>
          <p className="tr-cta-text">Get a free inspection and estimate today. No obligation, no pressure.</p>
          <div className="tr-cta-buttons">
            <button className="tr-cta-btn-primary" style={{ background: data.accentColor }}>
              📞 {data.phone || '(555) 123-4567'}
            </button>
            <button className="tr-cta-btn-secondary">
              Schedule Inspection
            </button>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="tr-footer">
        <div className="tr-footer-content">
          <div className="tr-footer-main">
            <div className="tr-footer-brand" style={{ color: data.accentColor }}>
              🏠 {data.companyName || 'Company Name'}
            </div>
            <p className="tr-footer-desc">
              Professional roofing services you can trust. Protecting homes and businesses 
              for over {data.yearsExperience || '15'} years.
            </p>
          </div>
          
          <div className="tr-footer-section">
            <h4 className="tr-footer-title">Services</h4>
            <ul className="tr-footer-links">
              {(data.services || []).slice(0, 4).map((service, i) => (
                <li key={i}><a href="#">{service}</a></li>
              ))}
            </ul>
          </div>
          
          <div className="tr-footer-section">
            <h4 className="tr-footer-title">Contact Us</h4>
            <div className="tr-footer-contact">
              <p>📞 {data.phone || '(555) 123-4567'}</p>
              <p>✉️ {data.email || 'info@company.com'}</p>
              <p>📍 {data.address || '123 Main St'}</p>
            </div>
          </div>
        </div>
        
        <div className="tr-footer-bottom">
          © 2025 {data.companyName || 'Company Name'}. All rights reserved. | Licensed & Insured
        </div>
      </footer>
    </div>
  );
}

const templateRoofingStyles = `
  .template-roofing {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0,0,0,0.12);
    min-height: calc(100vh - 48px);
  }
  
  /* Navbar */
  .tr-navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 40px;
    background: white;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 2px 20px rgba(0,0,0,0.08);
  }
  
  .tr-navbar-logo { display: flex; align-items: center; gap: 8px; }
  .tr-navbar-logo-img { height: 45px; object-fit: contain; }
  .tr-navbar-logo-text { font-size: 20px; font-weight: 800; }
  .tr-navbar-links { display: flex; gap: 28px; }
  .tr-navbar-link { font-size: 14px; font-weight: 600; color: #374151; background: none; border: none; cursor: pointer; transition: 0.2s; }
  .tr-navbar-link:hover { color: #000; }
  .tr-navbar-btn { padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 700; color: white; border: none; cursor: pointer; transition: 0.2s; }
  .tr-navbar-btn:hover { transform: scale(1.05); }
  
  /* Hero */
  .tr-hero {
    position: relative;
    min-height: 700px;
    display: flex;
    align-items: center;
    overflow: hidden;
    padding: 80px 60px;
  }
  
  .tr-hero-overlay {
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
  
  .tr-hero-angle {
    position: absolute;
    bottom: -50px;
    right: -50px;
    width: 400px;
    height: 400px;
    transform: rotate(45deg);
    opacity: 0.1;
  }
  
  .tr-hero-content {
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: 60px;
  }
  
  .tr-hero-text { flex: 1; max-width: 580px; }
  
  .tr-hero-badge {
    display: inline-block;
    padding: 10px 20px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 700;
    color: white;
    margin-bottom: 24px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  .tr-hero-title {
    font-size: 54px;
    font-weight: 800;
    color: white;
    line-height: 1.15;
    margin-bottom: 20px;
  }
  
  .tr-hero-tagline {
    font-size: 18px;
    color: rgba(255,255,255,0.85);
    line-height: 1.7;
    margin-bottom: 28px;
  }
  
  .tr-hero-features { display: flex; flex-wrap: wrap; gap: 16px; margin-bottom: 32px; }
  .tr-hero-feature { display: flex; align-items: center; gap: 10px; font-size: 15px; color: white; font-weight: 500; }
  .tr-feature-icon { width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; color: white; }
  
  .tr-hero-phone {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px 24px;
    background: rgba(255,255,255,0.1);
    border-radius: 12px;
    backdrop-filter: blur(10px);
  }
  .tr-phone-icon { width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: white; }
  .tr-phone-label { font-size: 12px; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 1px; }
  .tr-phone-number { font-size: 22px; font-weight: 800; color: white; }
  
  /* Hero Form */
  .tr-hero-form {
    background: white;
    border-radius: 16px;
    padding: 32px;
    width: 400px;
    box-shadow: 0 30px 60px rgba(0,0,0,0.3);
  }
  
  .tr-form-header { text-align: center; margin-bottom: 24px; }
  .tr-form-logo { height: 50px; object-fit: contain; margin-bottom: 16px; }
  .tr-form-logo-placeholder { width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; margin: 0 auto 16px; color: white; }
  .tr-form-title { font-size: 22px; font-weight: 800; color: #1a1a2e; margin-bottom: 8px; }
  .tr-form-subtitle { font-size: 14px; color: #6b7280; }
  
  .tr-form-group { margin-bottom: 14px; }
  .tr-form-input, .tr-form-textarea {
    width: 100%;
    padding: 14px 16px;
    border: 2px solid #e5e7eb;
    border-radius: 10px;
    font-size: 15px;
    font-family: inherit;
    transition: all 0.2s;
    box-sizing: border-box;
  }
  .tr-form-input:focus, .tr-form-textarea:focus { outline: none; border-color: #3b82f6; }
  .tr-form-textarea { resize: none; }
  
  .tr-form-submit {
    width: 100%;
    padding: 16px;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 700;
    color: white;
    cursor: pointer;
    transition: all 0.2s;
  }
  .tr-form-submit:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.2); }
  
  .tr-form-note { text-align: center; font-size: 12px; color: #6b7280; margin-top: 12px; }
  
  /* Trust Bar */
  .tr-trust-bar {
    display: flex;
    justify-content: space-around;
    padding: 30px 60px;
  }
  .tr-trust-item { text-align: center; }
  .tr-trust-value { display: block; font-size: 36px; font-weight: 800; }
  .tr-trust-label { font-size: 13px; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 1px; }
  
  /* Sections */
  .tr-section { padding: 80px 60px; }
  .tr-section-header { text-align: center; margin-bottom: 50px; }
  .tr-section-label { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px; }
  .tr-section-title { font-size: 42px; font-weight: 800; color: #1a1a2e; margin-bottom: 12px; }
  .tr-section-subtitle { font-size: 16px; color: #6b7280; }
  
  /* Services */
  .tr-services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; }
  .tr-service-card {
    padding: 32px;
    background: white;
    border-radius: 16px;
    border: 2px solid #e5e7eb;
    border-top-width: 4px;
    transition: all 0.3s;
  }
  .tr-service-card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
  .tr-service-icon { width: 60px; height: 60px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; font-size: 28px; }
  .tr-service-title { font-size: 20px; font-weight: 700; color: #1a1a2e; margin-bottom: 12px; }
  .tr-service-desc { font-size: 14px; color: #6b7280; line-height: 1.6; margin-bottom: 16px; }
  .tr-service-btn { background: none; border: none; font-size: 14px; font-weight: 600; cursor: pointer; padding: 0; }
  
  /* About */
  .tr-about { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
  .tr-about-title { font-size: 40px; font-weight: 800; color: #1a1a2e; margin-bottom: 20px; }
  .tr-about-text { font-size: 16px; color: #6b7280; line-height: 1.8; margin-bottom: 28px; }
  .tr-about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .tr-about-item { display: flex; align-items: center; gap: 12px; font-size: 15px; font-weight: 600; color: #374151; }
  .tr-about-icon { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; color: white; }
  
  .tr-about-image { position: relative; }
  .tr-about-image img { width: 100%; height: 450px; object-fit: cover; border-radius: 16px; }
  .tr-about-placeholder { width: 100%; height: 450px; background: linear-gradient(135deg, #f8fafc, #e2e8f0); border-radius: 16px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .tr-about-placeholder span { font-size: 80px; opacity: 0.3; }
  .tr-about-placeholder p { color: #9ca3af; margin-top: 16px; }
  .tr-about-badge { position: absolute; bottom: -20px; left: 30px; padding: 20px 24px; border-radius: 12px; color: white; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
  .tr-badge-number { display: block; font-size: 32px; font-weight: 800; }
  .tr-badge-text { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
  
  /* Gallery */
  .tr-gallery-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
  .tr-gallery-item { position: relative; aspect-ratio: 4/3; border-radius: 12px; overflow: hidden; cursor: pointer; }
  .tr-gallery-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
  .tr-gallery-item:hover img { transform: scale(1.05); }
  .tr-gallery-overlay { position: absolute; inset: 0; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 20px; opacity: 0; transition: opacity 0.3s; }
  .tr-gallery-item:hover .tr-gallery-overlay { opacity: 1; }
  .tr-gallery-overlay span { color: white; font-weight: 600; }
  
  /* CTA */
  .tr-cta { padding: 80px 60px; text-align: center; }
  .tr-cta-title { font-size: 44px; font-weight: 800; color: white; margin-bottom: 16px; }
  .tr-cta-text { font-size: 18px; color: rgba(255,255,255,0.8); margin-bottom: 32px; }
  .tr-cta-buttons { display: flex; justify-content: center; gap: 16px; }
  .tr-cta-btn-primary { padding: 18px 36px; border-radius: 10px; font-size: 16px; font-weight: 700; color: white; border: none; cursor: pointer; transition: 0.2s; }
  .tr-cta-btn-primary:hover { transform: scale(1.05); }
  .tr-cta-btn-secondary { padding: 18px 36px; border-radius: 10px; font-size: 16px; font-weight: 700; color: white; background: rgba(255,255,255,0.2); border: 2px solid rgba(255,255,255,0.3); cursor: pointer; transition: 0.2s; }
  .tr-cta-btn-secondary:hover { background: rgba(255,255,255,0.3); }
  
  /* Footer */
  .tr-footer { background: #0f172a; padding: 60px; color: white; }
  .tr-footer-content { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 60px; }
  .tr-footer-brand { font-size: 24px; font-weight: 800; margin-bottom: 16px; }
  .tr-footer-desc { font-size: 14px; color: rgba(255,255,255,0.6); line-height: 1.7; }
  .tr-footer-title { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; }
  .tr-footer-links { list-style: none; padding: 0; margin: 0; }
  .tr-footer-links li { margin-bottom: 10px; }
  .tr-footer-links a { color: rgba(255,255,255,0.6); text-decoration: none; font-size: 14px; transition: 0.2s; }
  .tr-footer-links a:hover { color: white; }
  .tr-footer-contact p { color: rgba(255,255,255,0.6); font-size: 14px; margin-bottom: 10px; }
  .tr-footer-bottom { border-top: 1px solid rgba(255,255,255,0.1); margin-top: 40px; padding-top: 24px; text-align: center; font-size: 13px; color: rgba(255,255,255,0.4); }
`;
