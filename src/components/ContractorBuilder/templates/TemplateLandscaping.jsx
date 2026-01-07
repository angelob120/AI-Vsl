import React from 'react';

/**
 * TemplateLandscaping - Landscaping Contractor Website Template
 * Features a natural, organic design with earthy elements
 */
export default function TemplateLandscaping({ formData, images }) {
  const data = formData;
  const imgs = images;

  return (
    <div className="template-landscaping">
      <style>{templateLandscapingStyles}</style>
      
      {/* Navigation Bar */}
      <nav className="tl-navbar">
        <div className="tl-navbar-logo">
          {imgs.logo ? (
            <img src={imgs.logo} alt="Logo" className="tl-navbar-logo-img" />
          ) : (
            <span className="tl-navbar-logo-text">
              <span className="tl-logo-icon">🌿</span>
              {data.companyName || 'Company Name'}
            </span>
          )}
        </div>
        
        <div className="tl-navbar-links">
          <button className="tl-navbar-link">Home</button>
          <button className="tl-navbar-link">Services</button>
          <button className="tl-navbar-link">About</button>
          {imgs.gallery && imgs.gallery.length > 0 && <button className="tl-navbar-link">Portfolio</button>}
          <button className="tl-navbar-link">Contact</button>
        </div>
        
        <button className="tl-navbar-btn" style={{ background: data.accentColor }}>
          Free Consultation
        </button>
      </nav>
      
      {/* Hero Section with Form */}
      <div 
        className="tl-hero" 
        style={{ 
          background: imgs.hero 
            ? `linear-gradient(to right, ${data.primaryColor}f5 0%, ${data.primaryColor}88 50%, transparent 100%), url(${imgs.hero}) center/cover`
            : `linear-gradient(135deg, ${data.primaryColor} 0%, #2d5a27 100%)`
        }}
      >
        <div className="tl-hero-leaves">
          <span className="tl-leaf tl-leaf-1">🍃</span>
          <span className="tl-leaf tl-leaf-2">🌿</span>
          <span className="tl-leaf tl-leaf-3">🍃</span>
        </div>
        
        <div className="tl-hero-content">
          <div className="tl-hero-text">
            <div className="tl-hero-badge" style={{ background: `${data.accentColor}` }}>
              🌱 Professional Landscaping
            </div>
            
            <h1 className="tl-hero-title">
              Transform Your<br/>
              <span style={{ color: data.accentColor }}>Outdoor Space</span>
            </h1>
            <p className="tl-hero-tagline">{data.tagline || 'Beautiful landscapes designed and maintained by experts. From lawn care to complete outdoor transformations, we bring your vision to life.'}</p>
            
            <div className="tl-hero-features">
              {['Design & Planning', 'Installation', 'Maintenance', 'Hardscaping'].map((item, i) => (
                <div key={i} className="tl-hero-feature">
                  <span className="tl-feature-icon" style={{ background: data.accentColor }}>✓</span>
                  {item}
                </div>
              ))}
            </div>
            
            <div className="tl-hero-stats">
              <div className="tl-stat">
                <span className="tl-stat-value">{data.yearsExperience || '15'}+</span>
                <span className="tl-stat-label">Years</span>
              </div>
              <div className="tl-stat">
                <span className="tl-stat-value">2000+</span>
                <span className="tl-stat-label">Gardens</span>
              </div>
              <div className="tl-stat">
                <span className="tl-stat-value">100%</span>
                <span className="tl-stat-label">Organic</span>
              </div>
            </div>
          </div>
          
          {/* Hero Contact Form */}
          <div className="tl-hero-form">
            <div className="tl-form-header">
              {imgs.logo ? (
                <img src={imgs.logo} alt="Logo" className="tl-form-logo" />
              ) : (
                <div className="tl-form-logo-placeholder" style={{ background: data.primaryColor }}>
                  🌿
                </div>
              )}
              <h3 className="tl-form-title">Free Consultation</h3>
              <p className="tl-form-subtitle">Let's design your dream landscape</p>
            </div>
            
            <form className="tl-form" onSubmit={(e) => e.preventDefault()}>
              <div className="tl-form-group">
                <input type="text" placeholder="Your Name" className="tl-form-input" />
              </div>
              <div className="tl-form-group">
                <input type="tel" placeholder="Phone Number" className="tl-form-input" />
              </div>
              <div className="tl-form-group">
                <textarea placeholder="Tell us about your project..." className="tl-form-textarea" rows={3}></textarea>
              </div>
              <button type="submit" className="tl-form-submit" style={{ background: data.accentColor }}>
                🌱 Get Free Quote
              </button>
            </form>
            
            <div className="tl-form-trust">
              <span>🌿 Eco-Friendly</span>
              <span>⭐ 5-Star Rated</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Services Section */}
      <div className="tl-section">
        <div className="tl-section-header">
          <span className="tl-section-icon">🌿</span>
          <div className="tl-section-label" style={{ color: data.accentColor }}>Our Services</div>
          <h2 className="tl-section-title">Landscaping Solutions</h2>
        </div>
        
        <div className="tl-services-grid">
          {(data.services || ['Lawn Care', 'Garden Design', 'Tree Service', 'Hardscaping']).map((service, index) => {
            const icons = ['🌱', '🌸', '🌳', '🧱', '💧', '🌺', '✂️', '🏡'];
            return (
              <div key={index} className="tl-service-card">
                <div className="tl-service-image" style={{ background: `linear-gradient(135deg, ${data.primaryColor}20, ${data.accentColor}20)` }}>
                  <span className="tl-service-icon">{icons[index % icons.length]}</span>
                </div>
                <div className="tl-service-content">
                  <h3 className="tl-service-title">{service}</h3>
                  <p className="tl-service-desc">Professional {service.toLowerCase()} services to enhance your outdoor living space.</p>
                  <button className="tl-service-btn" style={{ color: data.accentColor }}>
                    Learn More →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* About Section */}
      <div className="tl-section tl-about-section" style={{ background: '#f0fdf4' }}>
        <div className="tl-about">
          <div className="tl-about-image">
            {imgs.about ? (
              <img src={imgs.about} alt="About" />
            ) : (
              <div className="tl-about-placeholder">
                <span>👨‍🌾</span>
              </div>
            )}
            <div className="tl-about-badge" style={{ background: data.accentColor }}>
              <span className="tl-badge-value">{data.yearsExperience || '15'}+</span>
              <span className="tl-badge-label">Years of Excellence</span>
            </div>
          </div>
          
          <div className="tl-about-content">
            <div className="tl-section-label" style={{ color: data.accentColor }}>About Us</div>
            <h2 className="tl-about-title">Passionate About Landscapes</h2>
            <p className="tl-about-text">
              {data.companyName || 'Our company'} has been creating beautiful outdoor spaces for 
              over {data.yearsExperience || '15'} years. Our team of certified landscapers combines 
              creativity with expertise to transform your property into a stunning oasis.
            </p>
            
            <div className="tl-about-features">
              {[
                { icon: '🌱', text: 'Eco-Friendly Practices' },
                { icon: '🎨', text: 'Custom Designs' },
                { icon: '👨‍🌾', text: 'Expert Team' },
                { icon: '💯', text: 'Satisfaction Guaranteed' }
              ].map((item, i) => (
                <div key={i} className="tl-about-feature">
                  <span className="tl-af-icon" style={{ background: `${data.primaryColor}15` }}>{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Gallery Section */}
      {imgs.gallery && imgs.gallery.length > 0 && (
        <div className="tl-section">
          <div className="tl-section-header">
            <span className="tl-section-icon">📸</span>
            <div className="tl-section-label" style={{ color: data.accentColor }}>Our Portfolio</div>
            <h2 className="tl-section-title">Recent Projects</h2>
          </div>
          
          <div className="tl-gallery-grid">
            {imgs.gallery.map((img, index) => (
              <div key={index} className="tl-gallery-item">
                <img src={img} alt={`Project ${index + 1}`} />
                <div className="tl-gallery-overlay" style={{ background: `linear-gradient(to top, ${data.primaryColor}, transparent)` }}>
                  <span>View Project</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* CTA Section */}
      <div className="tl-cta" style={{ background: `linear-gradient(135deg, ${data.primaryColor}, #1a4314)` }}>
        <div className="tl-cta-decor">
          <span>🌿</span>
          <span>🌱</span>
          <span>🍃</span>
        </div>
        <div className="tl-cta-content">
          <h2 className="tl-cta-title">Ready to Transform Your Yard?</h2>
          <p className="tl-cta-text">Contact us today for a free consultation and estimate.</p>
          <button className="tl-cta-btn" style={{ background: data.accentColor }}>
            📞 {data.phone || '(555) 123-4567'}
          </button>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="tl-footer">
        <div className="tl-footer-content">
          <div className="tl-footer-main">
            <div className="tl-footer-brand">
              🌿 {data.companyName || 'Company Name'}
            </div>
            <p className="tl-footer-desc">
              Creating beautiful outdoor spaces for homes and businesses. 
              Sustainable landscaping solutions since {2025 - (parseInt(data.yearsExperience) || 15)}.
            </p>
          </div>
          
          <div className="tl-footer-section">
            <h4>Services</h4>
            <ul>
              {(data.services || []).slice(0, 4).map((service, i) => (
                <li key={i}><a href="#">{service}</a></li>
              ))}
            </ul>
          </div>
          
          <div className="tl-footer-section">
            <h4>Contact</h4>
            <p>📞 {data.phone || '(555) 123-4567'}</p>
            <p>✉️ {data.email || 'info@company.com'}</p>
            <p>📍 {data.address || '123 Main St'}</p>
          </div>
        </div>
        
        <div className="tl-footer-bottom">
          © 2025 {data.companyName || 'Company Name'}. Professional Landscaping Services.
        </div>
      </footer>
    </div>
  );
}

const templateLandscapingStyles = `
  .template-landscaping {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0,0,0,0.12);
    min-height: calc(100vh - 48px);
  }
  
  /* Navbar */
  .tl-navbar {
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
  
  .tl-navbar-logo { display: flex; align-items: center; }
  .tl-navbar-logo-img { height: 45px; object-fit: contain; }
  .tl-navbar-logo-text { font-size: 20px; font-weight: 700; color: #1a4314; display: flex; align-items: center; gap: 8px; }
  .tl-logo-icon { font-size: 24px; }
  .tl-navbar-links { display: flex; gap: 28px; }
  .tl-navbar-link { font-size: 14px; font-weight: 500; color: #475569; background: none; border: none; cursor: pointer; transition: 0.2s; }
  .tl-navbar-link:hover { color: #1a4314; }
  .tl-navbar-btn { padding: 12px 24px; border-radius: 50px; font-size: 14px; font-weight: 600; color: white; border: none; cursor: pointer; transition: 0.2s; }
  .tl-navbar-btn:hover { transform: scale(1.05); }
  
  /* Hero */
  .tl-hero {
    position: relative;
    min-height: 700px;
    display: flex;
    align-items: center;
    overflow: hidden;
    padding: 60px;
  }
  
  .tl-hero-leaves {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  
  .tl-leaf {
    position: absolute;
    font-size: 40px;
    opacity: 0.2;
    animation: tlFloat 6s ease-in-out infinite;
  }
  .tl-leaf-1 { top: 10%; right: 10%; animation-delay: 0s; }
  .tl-leaf-2 { top: 60%; right: 25%; animation-delay: 2s; }
  .tl-leaf-3 { bottom: 20%; right: 5%; animation-delay: 4s; }
  
  @keyframes tlFloat {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(10deg); }
  }
  
  .tl-hero-content {
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: 60px;
  }
  
  .tl-hero-text { flex: 1; max-width: 560px; }
  
  .tl-hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    border-radius: 50px;
    font-size: 14px;
    font-weight: 600;
    color: white;
    margin-bottom: 24px;
  }
  
  .tl-hero-title {
    font-size: 56px;
    font-weight: 800;
    color: white;
    line-height: 1.1;
    margin-bottom: 20px;
  }
  
  .tl-hero-tagline {
    font-size: 18px;
    color: rgba(255,255,255,0.9);
    line-height: 1.7;
    margin-bottom: 28px;
  }
  
  .tl-hero-features { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 32px; }
  .tl-hero-feature { display: flex; align-items: center; gap: 8px; font-size: 14px; color: white; font-weight: 500; }
  .tl-feature-icon { width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; color: white; }
  
  .tl-hero-stats { display: flex; gap: 32px; }
  .tl-stat { text-align: center; padding: 16px 24px; background: rgba(255,255,255,0.15); border-radius: 12px; backdrop-filter: blur(10px); }
  .tl-stat-value { display: block; font-size: 28px; font-weight: 800; color: white; }
  .tl-stat-label { font-size: 12px; color: rgba(255,255,255,0.8); text-transform: uppercase; }
  
  /* Hero Form */
  .tl-hero-form {
    background: white;
    border-radius: 24px;
    padding: 32px;
    width: 380px;
    box-shadow: 0 30px 60px rgba(0,0,0,0.25);
  }
  
  .tl-form-header { text-align: center; margin-bottom: 24px; }
  .tl-form-logo { height: 50px; object-fit: contain; margin-bottom: 16px; }
  .tl-form-logo-placeholder { width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; margin: 0 auto 16px; color: white; }
  .tl-form-title { font-size: 22px; font-weight: 700; color: #1a4314; margin-bottom: 6px; }
  .tl-form-subtitle { font-size: 14px; color: #64748b; }
  
  .tl-form-group { margin-bottom: 14px; }
  .tl-form-input, .tl-form-textarea {
    width: 100%;
    padding: 14px 16px;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    font-size: 15px;
    font-family: inherit;
    transition: all 0.2s;
    box-sizing: border-box;
  }
  .tl-form-input:focus, .tl-form-textarea:focus { outline: none; border-color: #22c55e; }
  .tl-form-textarea { resize: none; }
  
  .tl-form-submit {
    width: 100%;
    padding: 16px;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 700;
    color: white;
    cursor: pointer;
    transition: all 0.2s;
  }
  .tl-form-submit:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(0,0,0,0.2); }
  
  .tl-form-trust { display: flex; justify-content: center; gap: 20px; margin-top: 16px; font-size: 12px; color: #64748b; }
  
  /* Sections */
  .tl-section { padding: 80px 60px; }
  .tl-section-header { text-align: center; margin-bottom: 50px; }
  .tl-section-icon { font-size: 40px; display: block; margin-bottom: 12px; }
  .tl-section-label { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px; }
  .tl-section-title { font-size: 42px; font-weight: 800; color: #1a4314; }
  
  /* Services */
  .tl-services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }
  .tl-service-card {
    background: white;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    transition: all 0.3s;
  }
  .tl-service-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
  .tl-service-image { height: 160px; display: flex; align-items: center; justify-content: center; }
  .tl-service-icon { font-size: 60px; }
  .tl-service-content { padding: 24px; }
  .tl-service-title { font-size: 20px; font-weight: 700; color: #1a4314; margin-bottom: 10px; }
  .tl-service-desc { font-size: 14px; color: #64748b; line-height: 1.6; margin-bottom: 16px; }
  .tl-service-btn { background: none; border: none; font-size: 14px; font-weight: 600; cursor: pointer; padding: 0; }
  
  /* About */
  .tl-about { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
  .tl-about-image { position: relative; }
  .tl-about-image img { width: 100%; height: 450px; object-fit: cover; border-radius: 24px; }
  .tl-about-placeholder { width: 100%; height: 450px; background: linear-gradient(135deg, #dcfce7, #bbf7d0); border-radius: 24px; display: flex; align-items: center; justify-content: center; font-size: 100px; opacity: 0.6; }
  .tl-about-badge { position: absolute; bottom: -20px; left: 30px; padding: 20px 28px; border-radius: 16px; color: white; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
  .tl-badge-value { display: block; font-size: 32px; font-weight: 800; }
  .tl-badge-label { font-size: 12px; text-transform: uppercase; opacity: 0.9; }
  
  .tl-about-title { font-size: 40px; font-weight: 800; color: #1a4314; margin-bottom: 20px; }
  .tl-about-text { font-size: 16px; color: #64748b; line-height: 1.8; margin-bottom: 28px; }
  .tl-about-features { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .tl-about-feature { display: flex; align-items: center; gap: 12px; font-size: 14px; font-weight: 600; color: #374151; }
  .tl-af-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
  
  /* Gallery */
  .tl-gallery-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
  .tl-gallery-item { position: relative; aspect-ratio: 4/3; border-radius: 16px; overflow: hidden; cursor: pointer; }
  .tl-gallery-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
  .tl-gallery-item:hover img { transform: scale(1.05); }
  .tl-gallery-overlay { position: absolute; inset: 0; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 20px; opacity: 0; transition: opacity 0.3s; }
  .tl-gallery-item:hover .tl-gallery-overlay { opacity: 1; }
  .tl-gallery-overlay span { color: white; font-weight: 600; }
  
  /* CTA */
  .tl-cta { padding: 100px 60px; text-align: center; position: relative; overflow: hidden; }
  .tl-cta-decor { position: absolute; inset: 0; display: flex; justify-content: space-around; align-items: center; pointer-events: none; }
  .tl-cta-decor span { font-size: 120px; opacity: 0.1; }
  .tl-cta-content { position: relative; z-index: 2; }
  .tl-cta-title { font-size: 44px; font-weight: 800; color: white; margin-bottom: 16px; }
  .tl-cta-text { font-size: 18px; color: rgba(255,255,255,0.85); margin-bottom: 32px; }
  .tl-cta-btn { padding: 18px 40px; border-radius: 50px; font-size: 18px; font-weight: 700; color: white; border: none; cursor: pointer; transition: 0.2s; }
  .tl-cta-btn:hover { transform: scale(1.05); }
  
  /* Footer */
  .tl-footer { background: #0f172a; padding: 60px; color: white; }
  .tl-footer-content { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 60px; }
  .tl-footer-brand { font-size: 24px; font-weight: 700; margin-bottom: 16px; }
  .tl-footer-desc { font-size: 14px; color: rgba(255,255,255,0.6); line-height: 1.7; }
  .tl-footer-section h4 { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; }
  .tl-footer-section ul { list-style: none; padding: 0; margin: 0; }
  .tl-footer-section li { margin-bottom: 10px; }
  .tl-footer-section a { color: rgba(255,255,255,0.6); text-decoration: none; font-size: 14px; transition: 0.2s; }
  .tl-footer-section a:hover { color: white; }
  .tl-footer-section p { color: rgba(255,255,255,0.6); font-size: 14px; margin-bottom: 10px; }
  .tl-footer-bottom { border-top: 1px solid rgba(255,255,255,0.1); margin-top: 40px; padding-top: 24px; text-align: center; font-size: 13px; color: rgba(255,255,255,0.4); }
`;
