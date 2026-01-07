import React from 'react';

/**
 * TemplatePlumbing - Plumbing Contractor Website Template
 * Features a clean, water-inspired design with flowing elements
 */
export default function TemplatePlumbing({ formData, images }) {
  const data = formData;
  const imgs = images;

  return (
    <div className="template-plumbing">
      <style>{templatePlumbingStyles}</style>
      
      {/* Navigation Bar */}
      <nav className="tp-navbar">
        <div className="tp-navbar-logo">
          {imgs.logo ? (
            <img src={imgs.logo} alt="Logo" className="tp-navbar-logo-img" />
          ) : (
            <span className="tp-navbar-logo-text" style={{ color: data.primaryColor }}>
              🔧 {data.companyName || 'Company Name'}
            </span>
          )}
        </div>
        
        <div className="tp-navbar-links">
          <button className="tp-navbar-link">Home</button>
          <button className="tp-navbar-link">Services</button>
          <button className="tp-navbar-link">About</button>
          {imgs.gallery && imgs.gallery.length > 0 && <button className="tp-navbar-link">Gallery</button>}
          <button className="tp-navbar-link">Contact</button>
        </div>
        
        <div className="tp-navbar-emergency" style={{ background: data.accentColor }}>
          <span>🚨</span> 24/7 Emergency: {data.phone || '(555) 123-4567'}
        </div>
      </nav>
      
      {/* Hero Section with Form */}
      <div 
        className="tp-hero" 
        style={{ 
          background: imgs.hero 
            ? `linear-gradient(170deg, ${data.primaryColor}f5 0%, ${data.primaryColor}dd 100%), url(${imgs.hero}) center/cover`
            : `linear-gradient(170deg, ${data.primaryColor} 0%, #0c4a6e 100%)`
        }}
      >
        <div className="tp-hero-wave">
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="rgba(255,255,255,0.1)" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
        
        <div className="tp-hero-content">
          <div className="tp-hero-text">
            <div className="tp-hero-badge">
              <span className="tp-badge-icon">💧</span>
              Licensed Master Plumbers
            </div>
            
            <h1 className="tp-hero-title">
              Expert Plumbing<br/>
              <span style={{ color: data.accentColor }}>Solutions</span>
            </h1>
            <p className="tp-hero-tagline">{data.tagline || 'Professional plumbing services for your home and business. Fast, reliable, and affordable solutions for all your plumbing needs.'}</p>
            
            <div className="tp-hero-services">
              <div className="tp-mini-service">
                <span style={{ background: data.accentColor }}>🚿</span>
                Drain Cleaning
              </div>
              <div className="tp-mini-service">
                <span style={{ background: data.accentColor }}>🔧</span>
                Pipe Repair
              </div>
              <div className="tp-mini-service">
                <span style={{ background: data.accentColor }}>🚰</span>
                Water Heaters
              </div>
            </div>
            
            <div className="tp-trust-badges">
              <div className="tp-trust-badge">
                <span className="tp-trust-number" style={{ color: data.accentColor }}>{data.yearsExperience || '20'}+</span>
                <span className="tp-trust-text">Years Exp.</span>
              </div>
              <div className="tp-trust-badge">
                <span className="tp-trust-number" style={{ color: data.accentColor }}>10K+</span>
                <span className="tp-trust-text">Jobs Done</span>
              </div>
              <div className="tp-trust-badge">
                <span className="tp-trust-number" style={{ color: data.accentColor }}>5★</span>
                <span className="tp-trust-text">Rated</span>
              </div>
            </div>
          </div>
          
          {/* Hero Contact Form */}
          <div className="tp-hero-form">
            <div className="tp-form-header">
              {imgs.logo ? (
                <img src={imgs.logo} alt="Logo" className="tp-form-logo" />
              ) : (
                <div className="tp-form-logo-placeholder" style={{ background: `linear-gradient(135deg, ${data.primaryColor}, ${data.accentColor})` }}>
                  🔧
                </div>
              )}
              <h3 className="tp-form-title">Request Service</h3>
              <p className="tp-form-subtitle">Get a free quote within 30 minutes</p>
            </div>
            
            <form className="tp-form" onSubmit={(e) => e.preventDefault()}>
              <div className="tp-form-group">
                <label className="tp-form-label">Name</label>
                <input type="text" placeholder="Your full name" className="tp-form-input" />
              </div>
              <div className="tp-form-group">
                <label className="tp-form-label">Phone</label>
                <input type="tel" placeholder="Your phone number" className="tp-form-input" />
              </div>
              <div className="tp-form-group">
                <label className="tp-form-label">Message</label>
                <textarea placeholder="Describe your plumbing issue..." className="tp-form-textarea" rows={3}></textarea>
              </div>
              <button type="submit" className="tp-form-submit" style={{ background: `linear-gradient(135deg, ${data.primaryColor}, ${data.accentColor})` }}>
                Get Free Quote 💧
              </button>
            </form>
            
            <div className="tp-form-footer">
              <span>✓ Same Day Service</span>
              <span>✓ Upfront Pricing</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Services Section */}
      <div className="tp-section">
        <div className="tp-section-header">
          <span className="tp-section-icon" style={{ background: `${data.accentColor}20`, color: data.accentColor }}>🔧</span>
          <div className="tp-section-label" style={{ color: data.accentColor }}>What We Offer</div>
          <h2 className="tp-section-title">Our Plumbing Services</h2>
        </div>
        
        <div className="tp-services-grid">
          {(data.services || ['Drain Cleaning', 'Pipe Repair', 'Water Heater', 'Leak Detection']).map((service, index) => {
            const icons = ['🚿', '🔧', '🔥', '💧', '🚰', '🛁', '⚡', '🏠'];
            return (
              <div key={index} className="tp-service-card">
                <div className="tp-service-icon-wrap" style={{ background: `linear-gradient(135deg, ${data.primaryColor}15, ${data.accentColor}15)` }}>
                  <span className="tp-service-icon">{icons[index % icons.length]}</span>
                </div>
                <h3 className="tp-service-title">{service}</h3>
                <p className="tp-service-desc">Professional {service.toLowerCase()} services with guaranteed satisfaction.</p>
                <div className="tp-service-line" style={{ background: `linear-gradient(90deg, ${data.primaryColor}, ${data.accentColor})` }} />
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Why Choose Us */}
      <div className="tp-section tp-why-section" style={{ background: '#f0f9ff' }}>
        <div className="tp-why-content">
          <div className="tp-why-text">
            <div className="tp-section-label" style={{ color: data.accentColor }}>Why Choose Us</div>
            <h2 className="tp-why-title">Your Trusted Local Plumber</h2>
            <p className="tp-why-desc">
              For over {data.yearsExperience || '20'} years, {data.companyName || 'we'} has been providing 
              top-quality plumbing services to homeowners and businesses. Our team of licensed master plumbers 
              is committed to delivering exceptional service with transparent pricing.
            </p>
            
            <div className="tp-why-features">
              {[
                { icon: '⏰', title: '24/7 Emergency', desc: 'Available around the clock' },
                { icon: '💰', title: 'Upfront Pricing', desc: 'No hidden fees or surprises' },
                { icon: '✅', title: '100% Guarantee', desc: 'Satisfaction guaranteed' },
                { icon: '🔧', title: 'Licensed Pros', desc: 'Certified master plumbers' }
              ].map((item, i) => (
                <div key={i} className="tp-why-feature">
                  <span className="tp-why-icon" style={{ background: data.accentColor }}>{item.icon}</span>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="tp-why-image">
            {imgs.about ? (
              <img src={imgs.about} alt="About" />
            ) : (
              <div className="tp-why-placeholder">
                <span>👨‍🔧</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Gallery Section */}
      {imgs.gallery && imgs.gallery.length > 0 && (
        <div className="tp-section">
          <div className="tp-section-header">
            <span className="tp-section-icon" style={{ background: `${data.accentColor}20`, color: data.accentColor }}>📸</span>
            <div className="tp-section-label" style={{ color: data.accentColor }}>Our Work</div>
            <h2 className="tp-section-title">Recent Projects</h2>
          </div>
          
          <div className="tp-gallery-grid">
            {imgs.gallery.map((img, index) => (
              <div key={index} className="tp-gallery-item">
                <img src={img} alt={`Project ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* CTA Section */}
      <div className="tp-cta" style={{ background: `linear-gradient(135deg, ${data.primaryColor}, #0c4a6e)` }}>
        <div className="tp-cta-wave">
          <svg viewBox="0 0 1440 200" preserveAspectRatio="none">
            <path fill="rgba(255,255,255,0.08)" d="M0,128L60,117.3C120,107,240,85,360,90.7C480,96,600,128,720,138.7C840,149,960,139,1080,122.7C1200,107,1320,85,1380,74.7L1440,64L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path>
          </svg>
        </div>
        <div className="tp-cta-content">
          <h2 className="tp-cta-title">Plumbing Emergency?</h2>
          <p className="tp-cta-text">Don't wait! Call us now for fast, reliable emergency plumbing service.</p>
          <div className="tp-cta-phone" style={{ background: data.accentColor }}>
            📞 {data.phone || '(555) 123-4567'}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="tp-footer">
        <div className="tp-footer-content">
          <div className="tp-footer-main">
            <div className="tp-footer-brand">
              🔧 {data.companyName || 'Company Name'}
            </div>
            <p className="tp-footer-desc">
              Professional plumbing services for residential and commercial properties. 
              Available 24/7 for emergencies.
            </p>
          </div>
          
          <div className="tp-footer-section">
            <h4>Services</h4>
            <ul>
              {(data.services || []).slice(0, 4).map((service, i) => (
                <li key={i}><a href="#">{service}</a></li>
              ))}
            </ul>
          </div>
          
          <div className="tp-footer-section">
            <h4>Contact</h4>
            <p>📞 {data.phone || '(555) 123-4567'}</p>
            <p>✉️ {data.email || 'info@company.com'}</p>
            <p>📍 {data.address || '123 Main St'}</p>
          </div>
        </div>
        
        <div className="tp-footer-bottom">
          © 2025 {data.companyName || 'Company Name'}. Licensed & Insured Plumbers.
        </div>
      </footer>
    </div>
  );
}

const templatePlumbingStyles = `
  .template-plumbing {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0,0,0,0.12);
    min-height: calc(100vh - 48px);
  }
  
  /* Navbar */
  .tp-navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 40px;
    background: white;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 2px 20px rgba(0,0,0,0.06);
  }
  
  .tp-navbar-logo { display: flex; align-items: center; gap: 8px; }
  .tp-navbar-logo-img { height: 45px; object-fit: contain; }
  .tp-navbar-logo-text { font-size: 20px; font-weight: 700; }
  .tp-navbar-links { display: flex; gap: 28px; }
  .tp-navbar-link { font-size: 14px; font-weight: 500; color: #475569; background: none; border: none; cursor: pointer; transition: 0.2s; }
  .tp-navbar-link:hover { color: #0369a1; }
  .tp-navbar-emergency { display: flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 50px; font-size: 14px; font-weight: 700; color: white; }
  
  /* Hero */
  .tp-hero {
    position: relative;
    min-height: 700px;
    display: flex;
    align-items: center;
    overflow: hidden;
    padding: 60px;
  }
  
  .tp-hero-wave {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 200px;
  }
  .tp-hero-wave svg { width: 100%; height: 100%; }
  
  .tp-hero-content {
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: 60px;
  }
  
  .tp-hero-text { flex: 1; max-width: 560px; }
  
  .tp-hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: rgba(255,255,255,0.15);
    border-radius: 50px;
    font-size: 14px;
    font-weight: 600;
    color: white;
    margin-bottom: 24px;
    backdrop-filter: blur(10px);
  }
  .tp-badge-icon { font-size: 18px; }
  
  .tp-hero-title {
    font-size: 56px;
    font-weight: 800;
    color: white;
    line-height: 1.1;
    margin-bottom: 20px;
  }
  
  .tp-hero-tagline {
    font-size: 18px;
    color: rgba(255,255,255,0.9);
    line-height: 1.7;
    margin-bottom: 28px;
  }
  
  .tp-hero-services { display: flex; gap: 16px; margin-bottom: 32px; flex-wrap: wrap; }
  .tp-mini-service {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    background: rgba(255,255,255,0.1);
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    color: white;
    backdrop-filter: blur(10px);
  }
  .tp-mini-service span { width: 28px; height: 28px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 14px; }
  
  .tp-trust-badges { display: flex; gap: 24px; }
  .tp-trust-badge { text-align: center; }
  .tp-trust-number { display: block; font-size: 28px; font-weight: 800; }
  .tp-trust-text { font-size: 12px; color: rgba(255,255,255,0.7); text-transform: uppercase; }
  
  /* Hero Form */
  .tp-hero-form {
    background: white;
    border-radius: 24px;
    padding: 32px;
    width: 380px;
    box-shadow: 0 30px 60px rgba(0,0,0,0.25);
  }
  
  .tp-form-header { text-align: center; margin-bottom: 24px; }
  .tp-form-logo { height: 50px; object-fit: contain; margin-bottom: 16px; }
  .tp-form-logo-placeholder { width: 60px; height: 60px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 28px; margin: 0 auto 16px; color: white; }
  .tp-form-title { font-size: 22px; font-weight: 700; color: #0f172a; margin-bottom: 6px; }
  .tp-form-subtitle { font-size: 14px; color: #64748b; }
  
  .tp-form-group { margin-bottom: 16px; }
  .tp-form-label { display: block; font-size: 12px; font-weight: 600; color: #475569; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
  .tp-form-input, .tp-form-textarea {
    width: 100%;
    padding: 14px 16px;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    font-size: 15px;
    font-family: inherit;
    transition: all 0.2s;
    box-sizing: border-box;
  }
  .tp-form-input:focus, .tp-form-textarea:focus { outline: none; border-color: #0ea5e9; box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1); }
  .tp-form-textarea { resize: none; }
  
  .tp-form-submit {
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
  .tp-form-submit:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(0,0,0,0.2); }
  
  .tp-form-footer { display: flex; justify-content: center; gap: 20px; margin-top: 16px; font-size: 12px; color: #64748b; }
  
  /* Sections */
  .tp-section { padding: 80px 60px; }
  .tp-section-header { text-align: center; margin-bottom: 50px; }
  .tp-section-icon { display: inline-flex; width: 60px; height: 60px; border-radius: 16px; align-items: center; justify-content: center; font-size: 28px; margin-bottom: 16px; }
  .tp-section-label { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px; }
  .tp-section-title { font-size: 42px; font-weight: 800; color: #0f172a; }
  
  /* Services */
  .tp-services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; }
  .tp-service-card {
    padding: 32px;
    background: white;
    border-radius: 20px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    transition: all 0.3s;
    position: relative;
    overflow: hidden;
  }
  .tp-service-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
  .tp-service-icon-wrap { width: 70px; height: 70px; border-radius: 20px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
  .tp-service-icon { font-size: 32px; }
  .tp-service-title { font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 10px; }
  .tp-service-desc { font-size: 14px; color: #64748b; line-height: 1.6; }
  .tp-service-line { position: absolute; bottom: 0; left: 0; right: 0; height: 4px; }
  
  /* Why Section */
  .tp-why-content { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
  .tp-why-title { font-size: 40px; font-weight: 800; color: #0f172a; margin-bottom: 20px; }
  .tp-why-desc { font-size: 16px; color: #64748b; line-height: 1.8; margin-bottom: 32px; }
  .tp-why-features { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .tp-why-feature { display: flex; gap: 16px; }
  .tp-why-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; color: white; flex-shrink: 0; }
  .tp-why-feature h4 { font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
  .tp-why-feature p { font-size: 13px; color: #64748b; }
  .tp-why-image img { width: 100%; height: 450px; object-fit: cover; border-radius: 24px; }
  .tp-why-placeholder { width: 100%; height: 450px; background: linear-gradient(135deg, #e0f2fe, #bae6fd); border-radius: 24px; display: flex; align-items: center; justify-content: center; font-size: 100px; opacity: 0.5; }
  
  /* Gallery */
  .tp-gallery-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
  .tp-gallery-item { aspect-ratio: 4/3; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
  .tp-gallery-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
  .tp-gallery-item:hover img { transform: scale(1.05); }
  
  /* CTA */
  .tp-cta { padding: 100px 60px; text-align: center; position: relative; overflow: hidden; }
  .tp-cta-wave { position: absolute; top: 0; left: 0; right: 0; height: 100px; }
  .tp-cta-wave svg { width: 100%; height: 100%; }
  .tp-cta-content { position: relative; z-index: 2; }
  .tp-cta-title { font-size: 48px; font-weight: 800; color: white; margin-bottom: 16px; }
  .tp-cta-text { font-size: 18px; color: rgba(255,255,255,0.85); margin-bottom: 32px; }
  .tp-cta-phone { display: inline-flex; padding: 20px 40px; border-radius: 60px; font-size: 24px; font-weight: 800; color: white; }
  
  /* Footer */
  .tp-footer { background: #0f172a; padding: 60px; color: white; }
  .tp-footer-content { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 60px; }
  .tp-footer-brand { font-size: 24px; font-weight: 700; margin-bottom: 16px; }
  .tp-footer-desc { font-size: 14px; color: rgba(255,255,255,0.6); line-height: 1.7; }
  .tp-footer-section h4 { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; }
  .tp-footer-section ul { list-style: none; padding: 0; margin: 0; }
  .tp-footer-section li { margin-bottom: 10px; }
  .tp-footer-section a { color: rgba(255,255,255,0.6); text-decoration: none; font-size: 14px; transition: 0.2s; }
  .tp-footer-section a:hover { color: white; }
  .tp-footer-section p { color: rgba(255,255,255,0.6); font-size: 14px; margin-bottom: 10px; }
  .tp-footer-bottom { border-top: 1px solid rgba(255,255,255,0.1); margin-top: 40px; padding-top: 24px; text-align: center; font-size: 13px; color: rgba(255,255,255,0.4); }
`;
