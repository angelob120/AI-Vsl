import React from 'react';

/**
 * TemplateHVAC - HVAC Contractor Website Template
 * Features a clean, temperature-inspired design with cooling/heating elements
 */
export default function TemplateHVAC({ formData, images }) {
  const data = formData;
  const imgs = images;

  return (
    <div className="template-hvac">
      <style>{templateHVACStyles}</style>
      
      {/* Navigation Bar */}
      <nav className="th-navbar">
        <div className="th-navbar-logo">
          {imgs.logo ? (
            <img src={imgs.logo} alt="Logo" className="th-navbar-logo-img" />
          ) : (
            <span className="th-navbar-logo-text">
              <span className="th-logo-icon">❄️</span>
              {data.companyName || 'Company Name'}
            </span>
          )}
        </div>
        
        <div className="th-navbar-links">
          <button className="th-navbar-link">Home</button>
          <button className="th-navbar-link">Services</button>
          <button className="th-navbar-link">About</button>
          {imgs.gallery && imgs.gallery.length > 0 && <button className="th-navbar-link">Projects</button>}
          <button className="th-navbar-link">Contact</button>
        </div>
        
        <div className="th-navbar-cta">
          <div className="th-navbar-temp">
            <span className="th-temp-hot">🔥</span>
            <span className="th-temp-cold">❄️</span>
          </div>
          <button className="th-navbar-btn" style={{ background: data.primaryColor }}>
            📞 {data.phone || '(555) 123-4567'}
          </button>
        </div>
      </nav>
      
      {/* Hero Section with Form */}
      <div 
        className="th-hero" 
        style={{ 
          background: imgs.hero 
            ? `linear-gradient(180deg, ${data.primaryColor}f0 0%, ${data.primaryColor}dd 100%), url(${imgs.hero}) center/cover`
            : `linear-gradient(180deg, ${data.primaryColor} 0%, #1e3a5f 100%)`
        }}
      >
        <div className="th-hero-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="th-particle" style={{ 
              left: `${Math.random() * 100}%`, 
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}>❄️</div>
          ))}
        </div>
        
        <div className="th-hero-content">
          <div className="th-hero-text">
            <div className="th-hero-badge">
              <span className="th-badge-temp">
                <span>❄️</span>
                <span>🔥</span>
              </span>
              Certified HVAC Experts
            </div>
            
            <h1 className="th-hero-title">
              Your Comfort Is<br/>
              <span style={{ color: data.accentColor }}>Our Priority</span>
            </h1>
            <p className="th-hero-tagline">{data.tagline || 'Professional heating, ventilation, and air conditioning services. Keep your home comfortable year-round with our expert HVAC solutions.'}</p>
            
            <div className="th-hero-services">
              <div className="th-quick-service">
                <span className="th-qs-icon">❄️</span>
                <div>
                  <h4>AC Services</h4>
                  <p>Installation & Repair</p>
                </div>
              </div>
              <div className="th-quick-service">
                <span className="th-qs-icon">🔥</span>
                <div>
                  <h4>Heating</h4>
                  <p>Furnace & Heat Pumps</p>
                </div>
              </div>
              <div className="th-quick-service">
                <span className="th-qs-icon">🌬️</span>
                <div>
                  <h4>Air Quality</h4>
                  <p>Ventilation Systems</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Hero Contact Form */}
          <div className="th-hero-form">
            <div className="th-form-temp-bar">
              <div className="th-temp-gradient" style={{ background: `linear-gradient(90deg, #3b82f6, ${data.accentColor})` }} />
            </div>
            <div className="th-form-content">
              <div className="th-form-header">
                {imgs.logo ? (
                  <img src={imgs.logo} alt="Logo" className="th-form-logo" />
                ) : (
                  <div className="th-form-logo-placeholder">
                    <span>❄️</span>
                    <span>🔥</span>
                  </div>
                )}
                <h3 className="th-form-title">Schedule Service</h3>
                <p className="th-form-subtitle">Free estimates on new installations</p>
              </div>
              
              <form className="th-form" onSubmit={(e) => e.preventDefault()}>
                <div className="th-form-group">
                  <input type="text" placeholder="Your Name" className="th-form-input" />
                </div>
                <div className="th-form-group">
                  <input type="tel" placeholder="Phone Number" className="th-form-input" />
                </div>
                <div className="th-form-group">
                  <textarea placeholder="Describe your heating or cooling needs..." className="th-form-textarea" rows={3}></textarea>
                </div>
                <button type="submit" className="th-form-submit" style={{ background: data.accentColor }}>
                  Get Free Estimate
                </button>
              </form>
              
              <div className="th-form-features">
                <span>✓ 24/7 Emergency</span>
                <span>✓ Same Day Service</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="th-hero-stats">
          <div className="th-stat-item">
            <span className="th-stat-value" style={{ color: data.accentColor }}>{data.yearsExperience || '25'}+</span>
            <span className="th-stat-label">Years Experience</span>
          </div>
          <div className="th-stat-item">
            <span className="th-stat-value" style={{ color: data.accentColor }}>10,000+</span>
            <span className="th-stat-label">Systems Installed</span>
          </div>
          <div className="th-stat-item">
            <span className="th-stat-value" style={{ color: data.accentColor }}>98%</span>
            <span className="th-stat-label">Customer Satisfaction</span>
          </div>
          <div className="th-stat-item">
            <span className="th-stat-value" style={{ color: data.accentColor }}>24/7</span>
            <span className="th-stat-label">Emergency Service</span>
          </div>
        </div>
      </div>
      
      {/* Services Section */}
      <div className="th-section">
        <div className="th-section-header">
          <div className="th-section-icon">
            <span>❄️</span>
            <span>🔥</span>
          </div>
          <div className="th-section-label" style={{ color: data.accentColor }}>What We Offer</div>
          <h2 className="th-section-title">HVAC Services</h2>
        </div>
        
        <div className="th-services-grid">
          {(data.services || ['AC Installation', 'Heating Repair', 'Duct Cleaning', 'Maintenance']).map((service, index) => {
            const icons = ['❄️', '🔥', '🌬️', '🔧', '🏠', '📋', '⚡', '🛡️'];
            const isEven = index % 2 === 0;
            return (
              <div key={index} className="th-service-card" style={{ borderTopColor: isEven ? '#3b82f6' : data.accentColor }}>
                <div className="th-service-icon-wrap" style={{ background: isEven ? '#3b82f620' : `${data.accentColor}20` }}>
                  <span className="th-service-icon">{icons[index % icons.length]}</span>
                </div>
                <h3 className="th-service-title">{service}</h3>
                <p className="th-service-desc">Professional {service.toLowerCase()} services with expert technicians and quality parts.</p>
                <button className="th-service-btn" style={{ color: isEven ? '#3b82f6' : data.accentColor }}>
                  Learn More →
                </button>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Why Choose Us */}
      <div className="th-section th-why-section" style={{ background: 'linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 100%)' }}>
        <div className="th-why">
          <div className="th-why-content">
            <div className="th-section-label" style={{ color: data.accentColor }}>Why Choose Us</div>
            <h2 className="th-why-title">Trusted HVAC Professionals</h2>
            <p className="th-why-text">
              For over {data.yearsExperience || '25'} years, {data.companyName || 'we have'} been keeping 
              homes and businesses comfortable in all seasons. Our NATE-certified technicians provide 
              expert installation, maintenance, and repair services with a focus on energy efficiency.
            </p>
            
            <div className="th-why-grid">
              {[
                { icon: '🛡️', title: 'Licensed & Insured', desc: 'Fully licensed and insured for your protection' },
                { icon: '⭐', title: 'NATE Certified', desc: 'Industry certified HVAC technicians' },
                { icon: '💚', title: 'Energy Efficient', desc: 'Solutions that save you money' },
                { icon: '🔧', title: 'All Brands', desc: 'We service all makes and models' }
              ].map((item, i) => (
                <div key={i} className="th-why-item">
                  <span className="th-why-icon" style={{ background: `linear-gradient(135deg, ${data.primaryColor}, ${data.accentColor})` }}>{item.icon}</span>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="th-why-image">
            {imgs.about ? (
              <img src={imgs.about} alt="About" />
            ) : (
              <div className="th-why-placeholder">
                <div className="th-placeholder-icons">
                  <span>❄️</span>
                  <span>🔥</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Gallery Section */}
      {imgs.gallery && imgs.gallery.length > 0 && (
        <div className="th-section">
          <div className="th-section-header">
            <div className="th-section-label" style={{ color: data.accentColor }}>Our Work</div>
            <h2 className="th-section-title">Recent Installations</h2>
          </div>
          
          <div className="th-gallery-grid">
            {imgs.gallery.map((img, index) => (
              <div key={index} className="th-gallery-item">
                <img src={img} alt={`Project ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* CTA Section */}
      <div className="th-cta">
        <div className="th-cta-cold" style={{ background: '#3b82f6' }}>
          <span className="th-cta-icon">❄️</span>
          <h3>AC Not Cooling?</h3>
          <p>Get fast AC repair service</p>
        </div>
        <div className="th-cta-center" style={{ background: data.primaryColor }}>
          <h2>Need HVAC Service?</h2>
          <p>Call now for immediate assistance</p>
          <button className="th-cta-phone" style={{ background: data.accentColor }}>
            📞 {data.phone || '(555) 123-4567'}
          </button>
        </div>
        <div className="th-cta-hot" style={{ background: data.accentColor }}>
          <span className="th-cta-icon">🔥</span>
          <h3>Furnace Issues?</h3>
          <p>Expert heating repair</p>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="th-footer">
        <div className="th-footer-content">
          <div className="th-footer-main">
            <div className="th-footer-brand">
              <span>❄️</span> {data.companyName || 'Company Name'} <span>🔥</span>
            </div>
            <p className="th-footer-desc">
              Professional HVAC services for residential and commercial properties. 
              Keeping you comfortable year-round.
            </p>
          </div>
          
          <div className="th-footer-section">
            <h4>Services</h4>
            <ul>
              {(data.services || []).slice(0, 4).map((service, i) => (
                <li key={i}><span className="footer-service-link">{service}</span></li>
              ))}
            </ul>
          </div>
          
          <div className="th-footer-section">
            <h4>Contact</h4>
            <p>📞 {data.phone || '(555) 123-4567'}</p>
            <p>✉️ {data.email || 'info@company.com'}</p>
            <p>📍 {data.address || '123 Main St'}</p>
          </div>
        </div>
        
        <div className="th-footer-bottom">
          © 2025 {data.companyName || 'Company Name'}. NATE Certified HVAC Professionals.
        </div>
      </footer>
    </div>
  );
}

const templateHVACStyles = `
  .template-hvac {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0,0,0,0.12);
    min-height: calc(100vh - 48px);
  }
  
  /* Navbar */
  .th-navbar {
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
  
  .th-navbar-logo { display: flex; align-items: center; }
  .th-navbar-logo-img { height: 45px; object-fit: contain; }
  .th-navbar-logo-text { font-size: 20px; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 8px; }
  .th-logo-icon { font-size: 24px; }
  .th-navbar-links { display: flex; gap: 28px; }
  .th-navbar-link { font-size: 14px; font-weight: 500; color: #475569; background: none; border: none; cursor: pointer; transition: 0.2s; }
  .th-navbar-link:hover { color: #0f172a; }
  .th-navbar-cta { display: flex; align-items: center; gap: 16px; }
  .th-navbar-temp { display: flex; gap: 4px; font-size: 20px; }
  .th-navbar-btn { padding: 12px 24px; border-radius: 50px; font-size: 14px; font-weight: 700; color: white; border: none; cursor: pointer; transition: 0.2s; }
  .th-navbar-btn:hover { transform: scale(1.05); }
  
  /* Hero */
  .th-hero {
    position: relative;
    min-height: 750px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    padding: 60px;
  }
  
  .th-hero-particles {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
  }
  
  .th-particle {
    position: absolute;
    font-size: 16px;
    opacity: 0.3;
    animation: thFloat linear infinite;
  }
  
  @keyframes thFloat {
    0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
    10% { opacity: 0.3; }
    90% { opacity: 0.3; }
    100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
  }
  
  .th-hero-content {
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 60px;
    margin-bottom: 60px;
  }
  
  .th-hero-text { flex: 1; max-width: 560px; }
  
  .th-hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 10px 20px;
    background: rgba(255,255,255,0.1);
    border-radius: 50px;
    font-size: 14px;
    font-weight: 600;
    color: white;
    margin-bottom: 24px;
    backdrop-filter: blur(10px);
  }
  .th-badge-temp { display: flex; gap: 4px; }
  
  .th-hero-title {
    font-size: 54px;
    font-weight: 800;
    color: white;
    line-height: 1.1;
    margin-bottom: 20px;
  }
  
  .th-hero-tagline {
    font-size: 18px;
    color: rgba(255,255,255,0.85);
    line-height: 1.7;
    margin-bottom: 32px;
  }
  
  .th-hero-services { display: flex; gap: 20px; flex-wrap: wrap; }
  .th-quick-service {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    background: rgba(255,255,255,0.1);
    border-radius: 12px;
    backdrop-filter: blur(10px);
  }
  .th-qs-icon { font-size: 28px; }
  .th-quick-service h4 { font-size: 14px; font-weight: 700; color: white; margin-bottom: 2px; }
  .th-quick-service p { font-size: 12px; color: rgba(255,255,255,0.7); }
  
  /* Hero Form */
  .th-hero-form {
    background: white;
    border-radius: 20px;
    width: 400px;
    overflow: hidden;
    box-shadow: 0 30px 60px rgba(0,0,0,0.3);
  }
  
  .th-form-temp-bar { height: 8px; }
  .th-temp-gradient { height: 100%; }
  .th-form-content { padding: 32px; }
  
  .th-form-header { text-align: center; margin-bottom: 24px; }
  .th-form-logo { height: 50px; object-fit: contain; margin-bottom: 16px; }
  .th-form-logo-placeholder { display: flex; justify-content: center; gap: 8px; font-size: 28px; margin-bottom: 16px; }
  .th-form-title { font-size: 22px; font-weight: 700; color: #0f172a; margin-bottom: 6px; }
  .th-form-subtitle { font-size: 14px; color: #64748b; }
  
  .th-form-group { margin-bottom: 14px; }
  .th-form-input, .th-form-textarea {
    width: 100%;
    padding: 14px 16px;
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    font-size: 15px;
    font-family: inherit;
    transition: all 0.2s;
    box-sizing: border-box;
  }
  .th-form-input:focus, .th-form-textarea:focus { outline: none; border-color: #3b82f6; }
  .th-form-textarea { resize: none; }
  
  .th-form-submit {
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
  .th-form-submit:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(0,0,0,0.2); }
  
  .th-form-features { display: flex; justify-content: center; gap: 24px; margin-top: 16px; font-size: 13px; color: #64748b; }
  
  /* Hero Stats */
  .th-hero-stats {
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: center;
    gap: 60px;
    padding: 30px 0;
    border-top: 1px solid rgba(255,255,255,0.15);
  }
  .th-stat-item { text-align: center; }
  .th-stat-value { display: block; font-size: 32px; font-weight: 800; }
  .th-stat-label { font-size: 12px; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 1px; }
  
  /* Sections */
  .th-section { padding: 80px 60px; }
  .th-section-header { text-align: center; margin-bottom: 50px; }
  .th-section-icon { display: flex; justify-content: center; gap: 8px; font-size: 32px; margin-bottom: 16px; }
  .th-section-label { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px; }
  .th-section-title { font-size: 42px; font-weight: 800; color: #0f172a; }
  
  /* Services */
  .th-services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; }
  .th-service-card {
    padding: 32px;
    background: white;
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    border-top-width: 4px;
    transition: all 0.3s;
  }
  .th-service-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,0.08); }
  .th-service-icon-wrap { width: 70px; height: 70px; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
  .th-service-icon { font-size: 32px; }
  .th-service-title { font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 10px; }
  .th-service-desc { font-size: 14px; color: #64748b; line-height: 1.6; margin-bottom: 16px; }
  .th-service-btn { background: none; border: none; font-size: 14px; font-weight: 600; cursor: pointer; padding: 0; }
  
  /* Why Section */
  .th-why { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
  .th-why-title { font-size: 40px; font-weight: 800; color: #0f172a; margin-bottom: 20px; }
  .th-why-text { font-size: 16px; color: #64748b; line-height: 1.8; margin-bottom: 32px; }
  .th-why-grid { display: grid; gap: 20px; }
  .th-why-item { display: flex; gap: 16px; align-items: flex-start; }
  .th-why-icon { width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: white; flex-shrink: 0; }
  .th-why-item h4 { font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
  .th-why-item p { font-size: 13px; color: #64748b; }
  .th-why-image img { width: 100%; height: 450px; object-fit: cover; border-radius: 24px; }
  .th-why-placeholder { width: 100%; height: 450px; background: linear-gradient(135deg, #dbeafe, #fecaca); border-radius: 24px; display: flex; align-items: center; justify-content: center; }
  .th-placeholder-icons { font-size: 80px; display: flex; gap: 20px; opacity: 0.4; }
  
  /* Gallery */
  .th-gallery-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
  .th-gallery-item { aspect-ratio: 4/3; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
  .th-gallery-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
  .th-gallery-item:hover img { transform: scale(1.05); }
  
  /* CTA */
  .th-cta { display: grid; grid-template-columns: 1fr 2fr 1fr; min-height: 250px; }
  .th-cta-cold, .th-cta-hot { padding: 40px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; color: white; }
  .th-cta-icon { font-size: 48px; margin-bottom: 16px; }
  .th-cta-cold h3, .th-cta-hot h3 { font-size: 20px; font-weight: 700; margin-bottom: 8px; }
  .th-cta-cold p, .th-cta-hot p { font-size: 14px; opacity: 0.85; }
  .th-cta-center { padding: 40px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; color: white; }
  .th-cta-center h2 { font-size: 36px; font-weight: 800; margin-bottom: 12px; }
  .th-cta-center p { font-size: 16px; opacity: 0.85; margin-bottom: 24px; }
  .th-cta-phone { padding: 18px 40px; border-radius: 50px; font-size: 20px; font-weight: 700; color: white; border: none; cursor: pointer; transition: 0.2s; }
  .th-cta-phone:hover { transform: scale(1.05); }
  
  /* Footer */
  .th-footer { background: #0f172a; padding: 60px; color: white; }
  .th-footer-content { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 60px; }
  .th-footer-brand { font-size: 24px; font-weight: 700; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
  .th-footer-desc { font-size: 14px; color: rgba(255,255,255,0.6); line-height: 1.7; }
  .th-footer-section h4 { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; }
  .th-footer-section ul { list-style: none; padding: 0; margin: 0; }
  .th-footer-section li { margin-bottom: 10px; }
  .th-footer-section a { color: rgba(255,255,255,0.6); text-decoration: none; font-size: 14px; transition: 0.2s; }
  .th-footer-section a:hover { color: white; }
  .th-footer-section p { color: rgba(255,255,255,0.6); font-size: 14px; margin-bottom: 10px; }
  .th-footer-bottom { border-top: 1px solid rgba(255,255,255,0.1); margin-top: 40px; padding-top: 24px; text-align: center; font-size: 13px; color: rgba(255,255,255,0.4); }
`;
