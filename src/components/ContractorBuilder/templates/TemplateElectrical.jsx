import React from 'react';

/**
 * TemplateElectrical - Electrical Contractor Website Template
 * Features a bold, energy-inspired design with dynamic elements
 */
export default function TemplateElectrical({ formData, images }) {
  const data = formData;
  const imgs = images;

  return (
    <div className="template-electrical">
      <style>{templateElectricalStyles}</style>
      
      {/* Navigation Bar */}
      <nav className="te-navbar">
        <div className="te-navbar-logo">
          {imgs.logo ? (
            <img src={imgs.logo} alt="Logo" className="te-navbar-logo-img" />
          ) : (
            <span className="te-navbar-logo-text">
              <span className="te-logo-icon" style={{ color: data.accentColor }}>⚡</span>
              {data.companyName || 'Company Name'}
            </span>
          )}
        </div>
        
        <div className="te-navbar-links">
          <button className="te-navbar-link">Home</button>
          <button className="te-navbar-link">Services</button>
          <button className="te-navbar-link">About</button>
          {imgs.gallery && imgs.gallery.length > 0 && <button className="te-navbar-link">Projects</button>}
          <button className="te-navbar-link">Contact</button>
        </div>
        
        <div className="te-navbar-cta">
          <span className="te-navbar-phone">📞 {data.phone || '(555) 123-4567'}</span>
          <button className="te-navbar-btn" style={{ background: data.accentColor }}>
            Get Quote
          </button>
        </div>
      </nav>
      
      {/* Hero Section with Form */}
      <div 
        className="te-hero" 
        style={{ 
          background: imgs.hero 
            ? `linear-gradient(135deg, ${data.primaryColor}f5 0%, #000 100%), url(${imgs.hero}) center/cover`
            : `linear-gradient(135deg, ${data.primaryColor} 0%, #0a0a0a 100%)`
        }}
      >
        <div className="te-hero-grid" />
        <div className="te-hero-glow" style={{ background: `radial-gradient(circle at 30% 50%, ${data.accentColor}40, transparent 50%)` }} />
        
        <div className="te-hero-content">
          <div className="te-hero-text">
            <div className="te-hero-badge" style={{ borderColor: data.accentColor }}>
              <span style={{ color: data.accentColor }}>⚡</span>
              Licensed Electricians
            </div>
            
            <h1 className="te-hero-title">
              Powering Your
              <span className="te-title-highlight" style={{ color: data.accentColor }}> Future</span>
            </h1>
            <p className="te-hero-tagline">{data.tagline || 'Expert electrical services for homes and businesses. Safe, reliable, and up to code. Available 24/7 for emergencies.'}</p>
            
            <div className="te-hero-features">
              {['24/7 Service', 'Licensed & Bonded', 'Free Estimates', 'Code Compliant'].map((feature, i) => (
                <div key={i} className="te-hero-feature">
                  <span className="te-feature-check" style={{ background: data.accentColor }}>✓</span>
                  {feature}
                </div>
              ))}
            </div>
            
            <div className="te-hero-stats">
              <div className="te-stat">
                <span className="te-stat-value" style={{ color: data.accentColor }}>{data.yearsExperience || '20'}+</span>
                <span className="te-stat-label">Years Experience</span>
              </div>
              <div className="te-stat">
                <span className="te-stat-value" style={{ color: data.accentColor }}>5000+</span>
                <span className="te-stat-label">Homes Wired</span>
              </div>
              <div className="te-stat">
                <span className="te-stat-value" style={{ color: data.accentColor }}>100%</span>
                <span className="te-stat-label">Safe & Certified</span>
              </div>
            </div>
          </div>
          
          {/* Hero Contact Form */}
          <div className="te-hero-form">
            <div className="te-form-accent" style={{ background: data.accentColor }} />
            <div className="te-form-content">
              <div className="te-form-header">
                {imgs.logo ? (
                  <img src={imgs.logo} alt="Logo" className="te-form-logo" />
                ) : (
                  <div className="te-form-logo-placeholder" style={{ background: data.primaryColor }}>
                    ⚡
                  </div>
                )}
                <h3 className="te-form-title">Request Service</h3>
                <p className="te-form-subtitle">Get a free estimate today</p>
              </div>
              
              <form className="te-form" onSubmit={(e) => e.preventDefault()}>
                <div className="te-form-group">
                  <input type="text" placeholder="Your Name" className="te-form-input" />
                </div>
                <div className="te-form-group">
                  <input type="tel" placeholder="Phone Number" className="te-form-input" />
                </div>
                <div className="te-form-group">
                  <textarea placeholder="Describe your electrical needs..." className="te-form-textarea" rows={3}></textarea>
                </div>
                <button type="submit" className="te-form-submit" style={{ background: data.accentColor }}>
                  ⚡ Get Free Quote
                </button>
              </form>
              
              <p className="te-form-note">✓ Same day service available</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Services Section */}
      <div className="te-section">
        <div className="te-section-header">
          <div className="te-section-badge" style={{ color: data.accentColor }}>⚡ Our Services</div>
          <h2 className="te-section-title">Electrical Solutions</h2>
          <p className="te-section-subtitle">Complete electrical services for residential and commercial properties</p>
        </div>
        
        <div className="te-services-grid">
          {(data.services || ['Panel Upgrades', 'Rewiring', 'Lighting', 'EV Charging']).map((service, index) => {
            const icons = ['⚡', '🔌', '💡', '🚗', '🏠', '🔧', '📱', '🛡️'];
            return (
              <div key={index} className="te-service-card">
                <div className="te-service-glow" style={{ background: data.accentColor }} />
                <div className="te-service-icon" style={{ color: data.accentColor }}>
                  {icons[index % icons.length]}
                </div>
                <h3 className="te-service-title">{service}</h3>
                <p className="te-service-desc">Professional {service.toLowerCase()} services by certified electricians.</p>
                <div className="te-service-arrow" style={{ color: data.accentColor }}>→</div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* About Section */}
      <div className="te-section te-about-section" style={{ background: '#f8fafc' }}>
        <div className="te-about">
          <div className="te-about-image">
            {imgs.about ? (
              <img src={imgs.about} alt="About" />
            ) : (
              <div className="te-about-placeholder">
                <span>👷‍♂️</span>
              </div>
            )}
            <div className="te-about-badge" style={{ background: data.primaryColor }}>
              <span className="te-badge-icon" style={{ color: data.accentColor }}>⚡</span>
              <div>
                <span className="te-badge-value">{data.yearsExperience || '20'}+</span>
                <span className="te-badge-label">Years</span>
              </div>
            </div>
          </div>
          
          <div className="te-about-content">
            <div className="te-section-badge" style={{ color: data.accentColor }}>⚡ About Us</div>
            <h2 className="te-about-title">Trusted Electrical Experts</h2>
            <p className="te-about-text">
              {data.companyName || 'Our company'} has been providing safe, reliable electrical services 
              for over {data.yearsExperience || '20'} years. Our team of licensed master electricians 
              is committed to quality workmanship and customer satisfaction.
            </p>
            
            <div className="te-about-grid">
              {[
                { icon: '🛡️', label: 'Licensed & Insured' },
                { icon: '⚡', label: 'Master Electricians' },
                { icon: '📋', label: 'Code Compliant' },
                { icon: '💯', label: 'Satisfaction Guaranteed' }
              ].map((item, i) => (
                <div key={i} className="te-about-item">
                  <span className="te-about-icon" style={{ background: `${data.accentColor}20`, color: data.accentColor }}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Gallery Section */}
      {imgs.gallery && imgs.gallery.length > 0 && (
        <div className="te-section">
          <div className="te-section-header">
            <div className="te-section-badge" style={{ color: data.accentColor }}>⚡ Our Work</div>
            <h2 className="te-section-title">Recent Projects</h2>
          </div>
          
          <div className="te-gallery-grid">
            {imgs.gallery.map((img, index) => (
              <div key={index} className="te-gallery-item">
                <img src={img} alt={`Project ${index + 1}`} />
                <div className="te-gallery-overlay">
                  <span style={{ color: data.accentColor }}>⚡</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* CTA Section */}
      <div className="te-cta" style={{ background: data.primaryColor }}>
        <div className="te-cta-pattern" style={{ color: data.accentColor }} />
        <div className="te-cta-content">
          <span className="te-cta-icon" style={{ color: data.accentColor }}>⚡</span>
          <h2 className="te-cta-title">Need an Electrician?</h2>
          <p className="te-cta-text">Don't risk DIY electrical work. Call the experts for safe, professional service.</p>
          <button className="te-cta-btn" style={{ background: data.accentColor }}>
            📞 {data.phone || '(555) 123-4567'}
          </button>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="te-footer">
        <div className="te-footer-content">
          <div className="te-footer-main">
            <div className="te-footer-brand">
              <span style={{ color: data.accentColor }}>⚡</span> {data.companyName || 'Company Name'}
            </div>
            <p className="te-footer-desc">
              Professional electrical services for residential and commercial properties. 
              Licensed, bonded, and insured for your protection.
            </p>
          </div>
          
          <div className="te-footer-section">
            <h4>Services</h4>
            <ul>
              {(data.services || []).slice(0, 4).map((service, i) => (
                <li key={i}><a href="#">{service}</a></li>
              ))}
            </ul>
          </div>
          
          <div className="te-footer-section">
            <h4>Contact</h4>
            <p>📞 {data.phone || '(555) 123-4567'}</p>
            <p>✉️ {data.email || 'info@company.com'}</p>
            <p>📍 {data.address || '123 Main St'}</p>
          </div>
        </div>
        
        <div className="te-footer-bottom">
          © 2025 {data.companyName || 'Company Name'}. Licensed Master Electricians.
        </div>
      </footer>
    </div>
  );
}

const templateElectricalStyles = `
  .template-electrical {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0,0,0,0.12);
    min-height: calc(100vh - 48px);
  }
  
  /* Navbar */
  .te-navbar {
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
  
  .te-navbar-logo { display: flex; align-items: center; }
  .te-navbar-logo-img { height: 45px; object-fit: contain; }
  .te-navbar-logo-text { font-size: 22px; font-weight: 800; color: #0f172a; display: flex; align-items: center; gap: 8px; }
  .te-logo-icon { font-size: 28px; }
  .te-navbar-links { display: flex; gap: 28px; }
  .te-navbar-link { font-size: 14px; font-weight: 600; color: #475569; background: none; border: none; cursor: pointer; transition: 0.2s; }
  .te-navbar-link:hover { color: #0f172a; }
  .te-navbar-cta { display: flex; align-items: center; gap: 16px; }
  .te-navbar-phone { font-size: 14px; font-weight: 600; color: #0f172a; }
  .te-navbar-btn { padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 700; color: #0f172a; border: none; cursor: pointer; transition: 0.2s; }
  .te-navbar-btn:hover { transform: scale(1.05); }
  
  /* Hero */
  .te-hero {
    position: relative;
    min-height: 720px;
    display: flex;
    align-items: center;
    overflow: hidden;
    padding: 80px 60px;
  }
  
  .te-hero-grid {
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 50px 50px;
  }
  
  .te-hero-glow {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  
  .te-hero-content {
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: 60px;
  }
  
  .te-hero-text { flex: 1; max-width: 580px; }
  
  .te-hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: rgba(255,255,255,0.05);
    border: 1px solid;
    border-radius: 50px;
    font-size: 13px;
    font-weight: 600;
    color: white;
    margin-bottom: 24px;
  }
  
  .te-hero-title {
    font-size: 58px;
    font-weight: 800;
    color: white;
    line-height: 1.1;
    margin-bottom: 20px;
  }
  
  .te-title-highlight { display: inline; }
  
  .te-hero-tagline {
    font-size: 18px;
    color: rgba(255,255,255,0.8);
    line-height: 1.7;
    margin-bottom: 28px;
  }
  
  .te-hero-features { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 32px; }
  .te-hero-feature { display: flex; align-items: center; gap: 8px; font-size: 14px; color: white; font-weight: 500; padding: 8px 16px; background: rgba(255,255,255,0.08); border-radius: 8px; }
  .te-feature-check { width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #0f172a; }
  
  .te-hero-stats { display: flex; gap: 40px; }
  .te-stat { text-align: center; }
  .te-stat-value { display: block; font-size: 32px; font-weight: 800; }
  .te-stat-label { font-size: 12px; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 1px; }
  
  /* Hero Form */
  .te-hero-form {
    background: white;
    border-radius: 20px;
    width: 400px;
    overflow: hidden;
    box-shadow: 0 30px 60px rgba(0,0,0,0.4);
  }
  
  .te-form-accent { height: 6px; }
  .te-form-content { padding: 32px; }
  
  .te-form-header { text-align: center; margin-bottom: 24px; }
  .te-form-logo { height: 50px; object-fit: contain; margin-bottom: 16px; }
  .te-form-logo-placeholder { width: 60px; height: 60px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 28px; margin: 0 auto 16px; color: white; }
  .te-form-title { font-size: 22px; font-weight: 800; color: #0f172a; margin-bottom: 6px; }
  .te-form-subtitle { font-size: 14px; color: #64748b; }
  
  .te-form-group { margin-bottom: 14px; }
  .te-form-input, .te-form-textarea {
    width: 100%;
    padding: 14px 16px;
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    font-size: 15px;
    font-family: inherit;
    transition: all 0.2s;
    box-sizing: border-box;
    background: #f8fafc;
  }
  .te-form-input:focus, .te-form-textarea:focus { outline: none; border-color: #3b82f6; background: white; }
  .te-form-textarea { resize: none; }
  
  .te-form-submit {
    width: 100%;
    padding: 16px;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 700;
    color: #0f172a;
    cursor: pointer;
    transition: all 0.2s;
  }
  .te-form-submit:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(0,0,0,0.2); }
  
  .te-form-note { text-align: center; font-size: 12px; color: #64748b; margin-top: 14px; }
  
  /* Sections */
  .te-section { padding: 80px 60px; }
  .te-section-header { text-align: center; margin-bottom: 50px; }
  .te-section-badge { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px; }
  .te-section-title { font-size: 44px; font-weight: 800; color: #0f172a; margin-bottom: 12px; }
  .te-section-subtitle { font-size: 16px; color: #64748b; }
  
  /* Services */
  .te-services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; }
  .te-service-card {
    padding: 32px;
    background: white;
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    transition: all 0.3s;
    position: relative;
    overflow: hidden;
  }
  .te-service-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,0.08); border-color: transparent; }
  .te-service-glow { position: absolute; top: -50px; right: -50px; width: 100px; height: 100px; border-radius: 50%; opacity: 0; filter: blur(40px); transition: opacity 0.3s; }
  .te-service-card:hover .te-service-glow { opacity: 0.3; }
  .te-service-icon { font-size: 40px; margin-bottom: 20px; }
  .te-service-title { font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 10px; }
  .te-service-desc { font-size: 14px; color: #64748b; line-height: 1.6; margin-bottom: 16px; }
  .te-service-arrow { font-size: 20px; font-weight: 700; }
  
  /* About */
  .te-about { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
  .te-about-image { position: relative; }
  .te-about-image img { width: 100%; height: 450px; object-fit: cover; border-radius: 20px; }
  .te-about-placeholder { width: 100%; height: 450px; background: linear-gradient(135deg, #f1f5f9, #e2e8f0); border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 100px; opacity: 0.4; }
  .te-about-badge { position: absolute; bottom: -20px; right: 30px; display: flex; align-items: center; gap: 12px; padding: 16px 24px; border-radius: 12px; color: white; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
  .te-badge-icon { font-size: 28px; }
  .te-badge-value { display: block; font-size: 28px; font-weight: 800; }
  .te-badge-label { font-size: 12px; text-transform: uppercase; opacity: 0.8; }
  
  .te-about-title { font-size: 40px; font-weight: 800; color: #0f172a; margin-bottom: 20px; }
  .te-about-text { font-size: 16px; color: #64748b; line-height: 1.8; margin-bottom: 28px; }
  .te-about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .te-about-item { display: flex; align-items: center; gap: 12px; font-size: 14px; font-weight: 600; color: #374151; }
  .te-about-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
  
  /* Gallery */
  .te-gallery-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
  .te-gallery-item { position: relative; aspect-ratio: 4/3; border-radius: 14px; overflow: hidden; }
  .te-gallery-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
  .te-gallery-item:hover img { transform: scale(1.05); }
  .te-gallery-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s; }
  .te-gallery-item:hover .te-gallery-overlay { opacity: 1; }
  .te-gallery-overlay span { font-size: 40px; }
  
  /* CTA */
  .te-cta { padding: 80px 60px; text-align: center; position: relative; overflow: hidden; }
  .te-cta-pattern {
    position: absolute;
    inset: 0;
    opacity: 0.1;
    background-image: 
      linear-gradient(45deg, currentColor 25%, transparent 25%),
      linear-gradient(-45deg, currentColor 25%, transparent 25%);
    background-size: 30px 30px;
  }
  .te-cta-content { position: relative; z-index: 2; }
  .te-cta-icon { font-size: 60px; display: block; margin-bottom: 16px; }
  .te-cta-title { font-size: 44px; font-weight: 800; color: white; margin-bottom: 16px; }
  .te-cta-text { font-size: 18px; color: rgba(255,255,255,0.8); margin-bottom: 32px; max-width: 500px; margin-left: auto; margin-right: auto; }
  .te-cta-btn { padding: 18px 40px; border-radius: 12px; font-size: 18px; font-weight: 700; color: #0f172a; border: none; cursor: pointer; transition: 0.2s; }
  .te-cta-btn:hover { transform: scale(1.05); }
  
  /* Footer */
  .te-footer { background: #0f172a; padding: 60px; color: white; }
  .te-footer-content { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 60px; }
  .te-footer-brand { font-size: 24px; font-weight: 800; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
  .te-footer-desc { font-size: 14px; color: rgba(255,255,255,0.6); line-height: 1.7; }
  .te-footer-section h4 { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; }
  .te-footer-section ul { list-style: none; padding: 0; margin: 0; }
  .te-footer-section li { margin-bottom: 10px; }
  .te-footer-section a { color: rgba(255,255,255,0.6); text-decoration: none; font-size: 14px; transition: 0.2s; }
  .te-footer-section a:hover { color: white; }
  .te-footer-section p { color: rgba(255,255,255,0.6); font-size: 14px; margin-bottom: 10px; }
  .te-footer-bottom { border-top: 1px solid rgba(255,255,255,0.1); margin-top: 40px; padding-top: 24px; text-align: center; font-size: 13px; color: rgba(255,255,255,0.4); }
`;
