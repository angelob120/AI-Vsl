import React from 'react';

/**
 * TemplateProfessional - Universal Professional Services Business Template
 * Features a dark, professional design that adapts to any professional service niche
 * Works for: Accountants, Financial Advisors, Consultants, Real Estate, Insurance, IT Services, etc.
 * (Excludes legal services)
 */

// Smart image matching system - maps keywords to relevant professional services images
const serviceImageMap = {
  // Accounting & Tax
  'account': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600',
  'accounting': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600',
  'bookkeep': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600',
  'cpa': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600',
  'tax': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600',
  'audit': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600',
  'payroll': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600',
  'financial statement': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600',
  'quickbooks': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600',
  
  // Financial Planning & Advisory
  'financial': 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=600',
  'wealth': 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=600',
  'investment': 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=600',
  'retire': 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=600',
  'portfolio': 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=600',
  'estate plan': 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=600',
  'fiduciary': 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=600',
  'advisor': 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=600',
  '401k': 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=600',
  'ira': 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=600',
  
  // Insurance
  'insurance': 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600',
  'life insurance': 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600',
  'health insurance': 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600',
  'auto insurance': 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600',
  'home insurance': 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600',
  'coverage': 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600',
  'policy': 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600',
  'claim': 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600',
  
  // Real Estate
  'real estate': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600',
  'realtor': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600',
  'property': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600',
  'home': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600',
  'house': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600',
  'buying': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600',
  'selling': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600',
  'listing': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600',
  'mortgage': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600',
  'refinance': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600',
  'loan': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600',
  
  // Business Consulting
  'consult': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600',
  'strategy': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600',
  'business': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600',
  'management': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600',
  'operations': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600',
  'growth': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600',
  'planning': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600',
  'coaching': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600',
  'mentor': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600',
  
  // Marketing & Advertising
  'marketing': 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=600',
  'advertising': 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=600',
  'digital': 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=600',
  'social media': 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=600',
  'seo': 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=600',
  'ppc': 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=600',
  'branding': 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=600',
  'content': 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=600',
  'campaign': 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=600',
  
  // IT & Technology
  'it ': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600',
  'tech': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600',
  'computer': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600',
  'software': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600',
  'network': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600',
  'cyber': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600',
  'security': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600',
  'cloud': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600',
  'data': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600',
  'support': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600',
  'helpdesk': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600',
  'managed service': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600',
  
  // Web & Design
  'web': 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=600',
  'website': 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=600',
  'design': 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=600',
  'graphic': 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=600',
  'logo': 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=600',
  'creative': 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=600',
  'ui': 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=600',
  'ux': 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=600',
  
  // Photography & Video
  'photo': 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600',
  'portrait': 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600',
  'headshot': 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600',
  'event': 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600',
  'wedding': 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600',
  'video': 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600',
  'production': 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600',
  
  // HR & Recruiting
  'hr': 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600',
  'human resource': 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600',
  'recruit': 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600',
  'staffing': 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600',
  'hiring': 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600',
  'talent': 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600',
  'employee': 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600',
  'workforce': 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600',
  
  // Architecture & Engineering
  'architect': 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600',
  'engineer': 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600',
  'blueprint': 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600',
  'draft': 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600',
  'cad': 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600',
  'structural': 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600',
  
  // Training & Education
  'train': 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600',
  'workshop': 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600',
  'seminar': 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600',
  'course': 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600',
  'education': 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600',
  'tutor': 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600',
  'learning': 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600',
  
  // Notary & Admin
  'notary': 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600',
  'document': 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600',
  'admin': 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600',
  'virtual assistant': 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600',
  'office': 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600',
  
  // Translation & Writing
  'translat': 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600',
  'interpret': 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600',
  'writing': 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600',
  'copywriting': 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600',
  'editor': 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600',
  'proofread': 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600',
  
  // Project Management
  'project': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600',
  'agile': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600',
  'scrum': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600',
  
  // General/Misc
  'consult': 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600',
  'meeting': 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600',
  'analysis': 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600',
  'report': 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600',
  'review': 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600',
  'assessment': 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600',
  'service': 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600',
  'professional': 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600',
};

// Default fallback images for when no keyword matches
const defaultServiceImages = [
  'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600',
  'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600',
  'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600',
  'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=600',
  'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=600',
  'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600',
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600',
];

// Function to find the best matching image for a service
const getServiceImage = (serviceName, index) => {
  const lowerName = serviceName.toLowerCase();
  
  // Check each keyword in our map
  for (const [keyword, imageUrl] of Object.entries(serviceImageMap)) {
    if (lowerName.includes(keyword)) {
      return imageUrl;
    }
  }
  
  // Fallback to default images if no match
  return defaultServiceImages[index % defaultServiceImages.length];
};

function TemplateProfessional({ formData, images }) {
  const data = formData;
  const imgs = images;

  // Get services from formData or use defaults
  const services = data.services && data.services.length > 0 
    ? data.services 
    : ['Service 1', 'Service 2', 'Service 3', 'Service 4'];

  // Get service areas from formData or use defaults
  const serviceAreas = data.serviceAreas && data.serviceAreas.length > 0 
    ? data.serviceAreas 
    : ['Local Area', 'Surrounding Cities', 'Metro Region'];

  // Dynamic accent color with fallback
  const accentColor = data.accentColor || '#ff4d00';
  const primaryColor = data.primaryColor || '#0a0a0a';

  return (
    <div className="template-professional">
      <style>{templateProfessionalStyles(accentColor, primaryColor)}</style>
      
      {/* Header */}
      <header className="tp-header">
        <div className="tp-header-container">
          <a href="#" className="tp-logo">
            {imgs.logo ? (
              <img src={imgs.logo} alt="Logo" className="tp-logo-img" />
            ) : (
              <span className="tp-logo-text">{data.companyName || 'Company Name'}</span>
            )}
          </a>
          <nav className="tp-nav">
            <a href="#" className="tp-nav-link">Home</a>
            <div className="tp-nav-dropdown">
              <span className="tp-nav-link">Services ▼</span>
              <div className="tp-dropdown-menu">
                {services.slice(0, 8).map((service, idx) => (
                  <a key={idx} href="#">{service}</a>
                ))}
              </div>
            </div>
            <a href="#" className="tp-nav-link">About</a>
            <a href="#" className="tp-nav-link">Resources</a>
            <a href="#" className="tp-nav-link">Contact</a>
          </nav>
          <div className="tp-header-buttons">
            <a href="#" className="tp-btn tp-btn-primary">Free Consultation</a>
            <a href={`tel:${data.phone || '(555) 123-4567'}`} className="tp-btn tp-btn-outline tp-phone-btn">
              {data.phone || '(555) 123-4567'}
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        className="tp-hero"
        style={{
          background: imgs.hero 
            ? `linear-gradient(135deg, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.7) 50%, rgba(10,10,10,0.4) 100%), url(${imgs.hero}) center/cover`
            : `linear-gradient(135deg, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.7) 50%, rgba(10,10,10,0.4) 100%), url(https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920) center/cover`
        }}
      >
        <div className="tp-hero-overlay"></div>
        <div className="tp-hero-container">
          <div className="tp-hero-content">
            <h1 className="tp-hero-title">
              {data.headline || `${data.companyName || 'Expert Solutions'} For Your Success`}
            </h1>
            <p className="tp-hero-text">
              {data.tagline || `${data.companyName || 'Our Firm'} delivers personalized professional services with expertise you can trust. Let us help you achieve your goals and grow your success.`}
            </p>
          </div>
          <div className="tp-quote-form">
            <div className="tp-form-header">
              {imgs.logo && (
                <div className="tp-form-logo">
                  <img src={imgs.logo} alt="Logo" />
                </div>
              )}
              <h3>Schedule A Consultation</h3>
            </div>
            <form>
              <div className="tp-form-group">
                <label>Full Name *</label>
                <input type="text" placeholder="John Smith" />
              </div>
              <div className="tp-form-group">
                <label>Phone</label>
                <div className="tp-phone-field">
                  <div className="tp-flag">+1</div>
                  <input type="tel" placeholder="(555) 555-1234" />
                </div>
              </div>
              <div className="tp-form-group">
                <label>How can we help you? *</label>
                <textarea placeholder="Tell us about your needs and goals..."></textarea>
              </div>
              <div className="tp-form-checkbox">
                <input type="checkbox" id="terms" />
                <label htmlFor="terms">I agree to terms and conditions provided by the company.</label>
              </div>
              <button type="submit" className="tp-form-submit">Request Consultation</button>
            </form>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="tp-trust-badges">
        <div className="tp-badges-container">
          <div className="tp-badge"><span className="tp-badge-icon">🎓</span> Certified Experts</div>
          <div className="tp-badge"><span className="tp-badge-icon">🕐</span> {data.yearsExperience || '10'}+ Years Experience</div>
          <div className="tp-badge"><span className="tp-badge-icon">🤝</span> Trusted Partner</div>
          <div className="tp-badge"><span className="tp-badge-icon">✓</span> Results Driven</div>
          <div className="tp-badge"><span className="tp-badge-icon">⭐</span> 5-Star Rated</div>
        </div>
      </section>

      {/* About Section */}
      <section className="tp-about">
        <div className="tp-about-container">
          <div className="tp-about-content">
            <h2 className="tp-section-title">About Our Firm</h2>
            <p className="tp-about-text">
              {data.aboutText || `${data.companyName || 'Our Firm'} has been delivering exceptional professional services since ${2025 - (parseInt(data.yearsExperience) || 10)}. Our team of certified experts is dedicated to providing personalized solutions that drive real results. We take pride in building lasting relationships with our clients through transparency, integrity, and a commitment to excellence in everything we do.`}
            </p>
            <div className="tp-google-badge">
              <svg viewBox="0 0 24 24" width="30" height="30">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </div>
          </div>
          <div className="tp-about-image">
            {imgs.about ? (
              <img src={imgs.about} alt="About Us" />
            ) : imgs.hero ? (
              <img src={imgs.hero} alt="About Us" />
            ) : (
              <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600" alt="About Us" />
            )}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="tp-services">
        <div className="tp-services-container">
          <p className="tp-section-label">Solutions Tailored To Your Needs</p>
          <h2 className="tp-section-title">Our Services</h2>
          <div className="tp-services-grid">
            {services.map((service, idx) => (
              <a key={idx} href="#" className="tp-service-card">
                <img src={getServiceImage(service, idx)} alt={service} />
                <div className="tp-service-card-label">
                  <h3>{service}</h3>
                  <span className="tp-service-arrow">→</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="tp-process">
        <div className="tp-process-container">
          <h2 className="tp-section-title">How We Work</h2>
          <p className="tp-process-subtitle">Our proven process ensures you get the results you need</p>
          <div className="tp-process-steps">
            <div className="tp-process-step">
              <div className="tp-step-icon">
                <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>
              </div>
              <h4>Discovery Call</h4>
            </div>
            <div className="tp-process-step">
              <div className="tp-step-icon">
                <svg viewBox="0 0 24 24"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM10 17l-3.5-3.5 1.41-1.41L10 14.17l4.59-4.59L16 11l-6 6z"/></svg>
              </div>
              <h4>Assessment</h4>
            </div>
            <div className="tp-process-step">
              <div className="tp-step-icon">
                <svg viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
              </div>
              <h4>Custom Plan</h4>
            </div>
            <div className="tp-process-step">
              <div className="tp-step-icon">
                <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
              </div>
              <h4>Implementation</h4>
            </div>
            <div className="tp-process-step">
              <div className="tp-step-icon">
                <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>
              </div>
              <h4>Ongoing Support</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Work Gallery */}
      {imgs.gallery && imgs.gallery.length > 0 && (
        <section className="tp-work">
          <div className="tp-work-container">
            <div className="tp-work-header">
              <div>
                <p className="tp-section-label">See Our Success Stories</p>
                <h2 className="tp-section-title">Our Work</h2>
              </div>
              <a href="#" className="tp-btn tp-btn-outline">View Case Studies</a>
            </div>
            <div className="tp-work-grid">
              {imgs.gallery.map((img, idx) => (
                <div key={idx} className="tp-work-item">
                  <img src={img} alt={`Work ${idx + 1}`} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reviews Section */}
      <section 
        className="tp-reviews"
        style={{
          background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920) center/cover fixed`
        }}
      >
        <div className="tp-wave-top">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="tp-shape-fill"></path>
          </svg>
        </div>
        <div className="tp-wave-bottom">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="tp-shape-fill"></path>
          </svg>
        </div>
        <div className="tp-reviews-container">
          <div className="tp-reviews-header">
            <div>
              <p className="tp-section-label tp-section-label-dark">Discover What Our Clients Have To Say About Us</p>
              <h2 className="tp-section-title">Client Testimonials</h2>
            </div>
            <a href="#" className="tp-btn tp-btn-outline">Get Started</a>
          </div>
          <div className="tp-reviews-grid">
            {[
              { name: 'David M.', text: 'Outstanding service and expertise! They took the time to understand our needs and delivered results beyond our expectations. Highly recommend!' },
              { name: 'Jennifer L.', text: 'Professional, knowledgeable, and responsive. They\'ve been instrumental in helping our business grow. A true partner in every sense.' },
              { name: 'Robert K.', text: 'I\'ve worked with many firms over the years, but none compare to the level of service and attention to detail I\'ve received here.' },
              { name: 'Susan T.', text: 'They made a complex process simple and stress-free. Their expertise and guidance have been invaluable. Couldn\'t ask for better!' }
            ].map((review, idx) => (
              <div key={idx} className="tp-review-card">
                <div className="tp-review-rating">
                  <span className="tp-review-number">5</span>
                  <span className="tp-review-stars">★★★★★</span>
                </div>
                <p className="tp-review-text">{review.text}</p>
                <div className="tp-review-author">
                  <span>{review.name}</span>
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
          <div className="tp-review-cta">
            <h3>Review Us On Google</h3>
            <div className="tp-review-cta-stars">★★★★★</div>
            <a href="#" className="tp-btn tp-btn-primary">Leave Us A Review</a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="tp-faq">
        <div className="tp-faq-container">
          <div className="tp-faq-content">
            <h2 className="tp-faq-title">Frequently Asked Questions</h2>
            <div className="tp-faq-list">
              <div className="tp-faq-item">
                <div className="tp-faq-question">
                  <span className="tp-faq-icon">▼</span>
                  What industries do you work with?
                </div>
                <div className="tp-faq-answer">
                  We work with clients across a wide range of industries including small businesses, startups, established companies, and individuals. Our expertise allows us to adapt our services to meet the unique needs of each client.
                </div>
              </div>
              <div className="tp-faq-item">
                <div className="tp-faq-question">
                  <span className="tp-faq-icon">▼</span>
                  How do you charge for your services?
                </div>
                <div className="tp-faq-answer">
                  We offer flexible pricing options including project-based fees, hourly rates, and retainer arrangements. During your initial consultation, we'll discuss your needs and recommend the most cost-effective approach for your situation.
                </div>
              </div>
              <div className="tp-faq-item">
                <div className="tp-faq-question">
                  <span className="tp-faq-icon">▼</span>
                  Do you offer free consultations?
                </div>
                <div className="tp-faq-answer">
                  Yes! We offer a complimentary initial consultation to discuss your needs, understand your goals, and determine how we can best help you. There's no obligation, and it's a great opportunity to see if we're the right fit.
                </div>
              </div>
            </div>
          </div>
          <div className="tp-faq-image">
            {imgs.about ? (
              <img src={imgs.about} alt="FAQ" />
            ) : (
              <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600" alt="FAQ" />
            )}
          </div>
        </div>
      </section>

      {/* Service Areas Section */}
      {serviceAreas.length > 0 && (
        <section className="tp-service-areas">
          <div className="tp-areas-container">
            <div className="tp-map-container">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.30596073366!2d-74.25986548248684!3d40.69714941932609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1234567890" 
                allowFullScreen="" 
                loading="lazy"
                title="Service Area Map"
              ></iframe>
            </div>
            <div className="tp-areas-content">
              <h2 className="tp-areas-title">Proudly Serving These Areas</h2>
              <div className="tp-areas-list">
                {serviceAreas.map((area, idx) => (
                  <div key={idx} className="tp-area-item">{area}</div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section 
        className="tp-cta"
        style={{
          background: imgs.hero 
            ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${imgs.hero}) center/cover`
            : `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920) center/cover`
        }}
      >
        <div className="tp-wave-top">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="tp-shape-fill"></path>
          </svg>
        </div>
        <div className="tp-wave-bottom">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="tp-shape-fill"></path>
          </svg>
        </div>
        <div className="tp-cta-container">
          <h2>Ready To Take The Next Step?</h2>
          <h3>Schedule Your Free Consultation!</h3>
          <a href="#" className="tp-btn tp-btn-primary">Get Started Today</a>
        </div>
      </section>

      {/* Footer */}
      <footer className="tp-footer">
        <div className="tp-footer-container">
          <div className="tp-footer-top">
            <div className="tp-footer-brand-section">
              <div className="tp-footer-brand">
                {imgs.logo ? (
                  <img src={imgs.logo} alt="Logo" />
                ) : (
                  <span>{data.companyName || 'Company Name'}</span>
                )}
              </div>
              <div className="tp-footer-contact">
                <a href={`mailto:${data.email || 'info@company.com'}`}>{data.email || 'info@company.com'}</a>
                <a href={`tel:${data.phone || '(555) 123-4567'}`}>{data.phone || '(555) 123-4567'}</a>
                {data.address && <span className="tp-footer-address">{data.address}</span>}
              </div>
              <div className="tp-footer-buttons">
                <a href="#" className="tp-btn tp-btn-outline">Contact</a>
                <a href="#" className="tp-btn tp-btn-primary">Get Started</a>
              </div>
            </div>
            <div className="tp-footer-column">
              <h4>Quick Links</h4>
              <div className="tp-footer-links">
                <a href="#">Home</a>
                <a href="#">About Us</a>
                <a href="#">Resources</a>
                <a href="#">Contact</a>
                <a href="#">Review Us</a>
              </div>
            </div>
            <div className="tp-footer-column">
              <h4>Our Services</h4>
              <div className="tp-footer-links">
                {services.slice(0, 8).map((service, idx) => (
                  <a key={idx} href="#">{service}</a>
                ))}
              </div>
            </div>
            <div className="tp-footer-column">
              <h4>Service Areas</h4>
              <div className="tp-footer-links">
                {serviceAreas.slice(0, 8).map((area, idx) => (
                  <a key={idx} href="#">{area}</a>
                ))}
              </div>
            </div>
            <div className="tp-footer-column">
              <h4>Office Hours</h4>
              <div className="tp-footer-hours">
                <p>Mon: 9:00AM - 5:00PM</p>
                <p>Tue: 9:00AM - 5:00PM</p>
                <p>Wed: 9:00AM - 5:00PM</p>
                <p>Thu: 9:00AM - 5:00PM</p>
                <p>Fri: 9:00AM - 5:00PM</p>
                <p>Sat: By Appointment</p>
                <p>Sun: Closed</p>
              </div>
            </div>
          </div>
          <div className="tp-footer-bottom">
            <div className="tp-footer-legal">
              <a href="#">Terms & Conditions</a>
              <a href="#">Privacy Policy</a>
            </div>
            <a href="#" className="tp-btn tp-btn-primary">Free Consultation</a>
          </div>
        </div>
      </footer>

      {/* Chat Button */}
      <div className="tp-chat-btn">
        <svg viewBox="0 0 24 24"><path d="M12 3c5.5 0 10 3.58 10 8s-4.5 8-10 8c-1.24 0-2.43-.18-3.53-.5C5.55 21 2 21 2 21c2.33-2.33 2.7-3.9 2.75-4.5C3.05 15.07 2 13.13 2 11c0-4.42 4.5-8 10-8z"/></svg>
      </div>
    </div>
  );
}

// Dynamic styles function that uses accent and primary colors
const templateProfessionalStyles = (accentColor, primaryColor) => `
  .template-professional {
    background: #0a0a0a;
    color: #ffffff;
    font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    line-height: 1.6;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0,0,0,0.12);
    min-height: calc(100vh - 48px);
  }
  .template-professional a { text-decoration: none; color: inherit; }
  .tp-header { position: sticky; top: 0; left: 0; right: 0; z-index: 1000; background: rgba(10, 10, 10, 0.95); backdrop-filter: blur(10px); padding: 10px 0; }
  .tp-header-container { max-width: 1400px; margin: 0 auto; padding: 0 40px; display: flex; justify-content: space-between; align-items: center; }
  .tp-logo { display: flex; align-items: center; gap: 10px; }
  .tp-logo-img { height: 50px; object-fit: contain; }
  .tp-logo-text { font-size: 20px; font-weight: 700; }
  .tp-nav { display: flex; align-items: center; gap: 25px; }
  .tp-nav-link { font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; color: #ffffff; cursor: pointer; transition: color 0.3s; background: none; border: none; }
  .tp-nav-link:hover { color: ${accentColor}; }
  .tp-nav-dropdown { position: relative; }
  .tp-dropdown-menu { position: absolute; top: 100%; left: 0; background: #111111; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; min-width: 200px; padding: 10px 0; opacity: 0; visibility: hidden; transform: translateY(10px); transition: all 0.3s; }
  .tp-nav-dropdown:hover .tp-dropdown-menu { opacity: 1; visibility: visible; transform: translateY(5px); }
  .tp-dropdown-menu a { display: block; padding: 8px 20px; font-size: 13px; text-transform: none; color: #888888; }
  .tp-dropdown-menu a:hover { color: ${accentColor}; background: ${accentColor}15; }
  .tp-header-buttons { display: flex; align-items: center; gap: 15px; }
  .tp-btn { padding: 10px 20px; border-radius: 4px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; cursor: pointer; transition: all 0.3s; border: 2px solid transparent; display: inline-block; }
  .tp-btn-primary { background: ${accentColor}; color: #ffffff; border-color: ${accentColor}; }
  .tp-btn-primary:hover { background: ${accentColor}dd; border-color: ${accentColor}dd; }
  .tp-btn-outline { background: transparent; color: ${accentColor}; border-color: ${accentColor}; }
  .tp-btn-outline:hover { background: ${accentColor}; color: #ffffff; }
  .tp-phone-btn { font-size: 12px; padding: 8px 15px; }
  .tp-hero { min-height: 100vh; display: flex; align-items: center; padding: 100px 40px 60px; position: relative; }
  .tp-hero-overlay { position: absolute; top: 0; right: 0; bottom: 0; width: 60%; background: linear-gradient(135deg, transparent 0%, ${accentColor}30 50%, ${accentColor}50 100%); clip-path: polygon(30% 0, 100% 0, 100% 100%, 0% 100%); }
  .tp-hero-container { max-width: 1400px; margin: 0 auto; width: 100%; display: grid; grid-template-columns: 1fr 400px; gap: 80px; align-items: center; position: relative; z-index: 1; }
  .tp-hero-title { font-family: 'Oswald', sans-serif; font-size: 52px; font-weight: 700; line-height: 1.1; text-transform: uppercase; margin-bottom: 20px; }
  .tp-hero-text { font-size: 15px; color: #cccccc; max-width: 400px; line-height: 1.7; }
  .tp-quote-form { background: #ffffff; border-radius: 8px; padding: 30px; color: #333; }
  .tp-form-header { text-align: center; margin-bottom: 25px; }
  .tp-form-logo { width: 60px; height: 60px; margin: 0 auto 15px; }
  .tp-form-logo img { width: 100%; height: 100%; object-fit: contain; }
  .tp-form-header h3 { font-family: 'Oswald', sans-serif; font-size: 22px; font-weight: 700; color: #1a1a1a; text-transform: uppercase; }
  .tp-form-group { margin-bottom: 15px; }
  .tp-form-group label { display: block; font-size: 12px; font-weight: 600; margin-bottom: 6px; color: #333; }
  .tp-form-group input, .tp-form-group textarea { width: 100%; padding: 12px 15px; background: #f5f5f5; border: 1px solid #e0e0e0; border-radius: 4px; font-size: 14px; font-family: inherit; color: #333; box-sizing: border-box; }
  .tp-form-group input::placeholder, .tp-form-group textarea::placeholder { color: #999; }
  .tp-form-group textarea { min-height: 80px; resize: vertical; }
  .tp-phone-field { display: flex; align-items: center; background: #f5f5f5; border: 1px solid #e0e0e0; border-radius: 4px; overflow: hidden; }
  .tp-flag { padding: 12px; display: flex; align-items: center; gap: 5px; font-size: 14px; border-right: 1px solid #e0e0e0; }
  .tp-phone-field input { border: none; background: transparent; }
  .tp-form-checkbox { display: flex; align-items: flex-start; gap: 10px; font-size: 11px; color: #666; margin-bottom: 20px; line-height: 1.5; }
  .tp-form-checkbox input { margin-top: 3px; }
  .tp-form-submit { width: 100%; padding: 14px; background: ${accentColor}; border: none; border-radius: 4px; color: #ffffff; font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; cursor: pointer; transition: background 0.3s; }
  .tp-form-submit:hover { background: ${accentColor}dd; }
  .tp-trust-badges { background: #0a0a0a; padding: 20px 40px; border-top: 1px solid rgba(255,255,255,0.1); border-bottom: 1px solid rgba(255,255,255,0.1); }
  .tp-badges-container { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; }
  .tp-badge { display: flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; color: #cccccc; }
  .tp-badge-icon { color: ${accentColor}; }
  .tp-about { padding: 80px 40px; background: #0a0a0a; }
  .tp-about-container { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
  .tp-section-title { font-family: 'Oswald', sans-serif; font-size: 32px; font-weight: 700; text-transform: uppercase; margin-bottom: 20px; display: flex; align-items: center; gap: 15px; }
  .tp-section-title::after { content: ''; flex: 1; height: 3px; background: ${accentColor}; max-width: 100px; }
  .tp-about-text { font-size: 14px; color: #888888; line-height: 1.8; }
  .tp-google-badge { margin-top: 30px; display: inline-block; }
  .tp-about-image img { width: 100%; max-width: 500px; border-radius: 8px; }
  .tp-services { padding: 80px 40px; background: #0a0a0a; }
  .tp-services-container { max-width: 1200px; margin: 0 auto; }
  .tp-section-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; color: #888888; margin-bottom: 10px; }
  .tp-services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-top: 40px; }
  .tp-service-card { position: relative; aspect-ratio: 1.1; border-radius: 8px; overflow: hidden; cursor: pointer; }
  .tp-service-card img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
  .tp-service-card:hover img { transform: scale(1.1); }
  .tp-service-card::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 40%, transparent 70%); }
  .tp-service-card-label { position: absolute; bottom: 15px; left: 15px; z-index: 1; display: flex; align-items: center; gap: 8px; }
  .tp-service-card-label h3 { font-family: 'Oswald', sans-serif; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
  .tp-service-arrow { width: 18px; height: 18px; background: ${accentColor}; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; }
  .tp-process { padding: 80px 40px; background: #0a0a0a; }
  .tp-process-container { max-width: 1200px; margin: 0 auto; }
  .tp-process-subtitle { font-size: 14px; color: #888888; margin-top: 10px; }
  .tp-process-steps { display: flex; justify-content: space-between; align-items: flex-start; margin-top: 60px; position: relative; }
  .tp-process-steps::before { content: ''; position: absolute; top: 40px; left: 80px; right: 80px; height: 2px; background: rgba(255,255,255,0.1); }
  .tp-process-step { display: flex; flex-direction: column; align-items: center; text-align: center; position: relative; z-index: 1; flex: 1; }
  .tp-step-icon { width: 80px; height: 80px; background: #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; box-shadow: 0 5px 20px rgba(0,0,0,0.3); }
  .tp-step-icon svg { width: 35px; height: 35px; fill: #333; }
  .tp-process-step h4 { font-size: 13px; font-weight: 500; color: #cccccc; max-width: 90px; line-height: 1.4; }
  .tp-work { padding: 80px 40px; background: #0a0a0a; }
  .tp-work-container { max-width: 1200px; margin: 0 auto; }
  .tp-work-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
  .tp-work-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; }
  .tp-work-item { position: relative; aspect-ratio: 1; border-radius: 8px; overflow: hidden; }
  .tp-work-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
  .tp-work-item:hover img { transform: scale(1.1); }
  .tp-reviews { padding: 120px 40px; position: relative; }
  .tp-wave-top, .tp-wave-bottom { position: absolute; left: 0; width: 100%; overflow: hidden; line-height: 0; }
  .tp-wave-top { top: 0; }
  .tp-wave-bottom { bottom: 0; transform: rotate(180deg); }
  .tp-wave-top svg, .tp-wave-bottom svg { position: relative; display: block; width: calc(100% + 1.3px); height: 80px; }
  .tp-shape-fill { fill: #0a0a0a; }
  .tp-reviews-container { max-width: 1200px; margin: 0 auto; position: relative; z-index: 1; }
  .tp-reviews-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
  .tp-section-label-dark { background: #0a0a0a; display: inline-block; padding: 8px 15px; margin-bottom: 10px; }
  .tp-reviews-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px; }
  .tp-review-card { background: #ffffff; border-radius: 8px; padding: 20px; color: #333; }
  .tp-review-rating { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
  .tp-review-number { font-weight: 700; font-size: 14px; }
  .tp-review-stars { color: ${accentColor}; font-size: 14px; }
  .tp-review-text { font-size: 13px; color: #555; line-height: 1.6; margin-bottom: 15px; }
  .tp-review-author { display: flex; justify-content: space-between; align-items: center; }
  .tp-review-author span { font-size: 12px; color: #888; }
  .tp-review-cta { text-align: center; padding: 50px 60px; background: #111111; border: 2px solid rgba(255,255,255,0.2); border-radius: 8px; max-width: 500px; margin: 40px auto 0; }
  .tp-review-cta h3 { font-family: 'Oswald', sans-serif; font-size: 26px; font-weight: 700; text-transform: uppercase; margin-bottom: 15px; }
  .tp-review-cta-stars { color: ${accentColor}; font-size: 26px; margin-bottom: 25px; }
  .tp-faq { padding: 80px 40px; background: #0a0a0a; }
  .tp-faq-container { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: start; }
  .tp-faq-title { font-family: 'Playfair Display', serif; font-size: 34px; font-style: italic; font-weight: 400; margin-bottom: 30px; }
  .tp-faq-item { border-bottom: 1px solid rgba(255,255,255,0.1); padding: 18px 0; }
  .tp-faq-question { display: flex; align-items: center; gap: 12px; cursor: pointer; font-size: 14px; font-weight: 500; transition: color 0.3s; }
  .tp-faq-question:hover { color: ${accentColor}; }
  .tp-faq-icon { color: #888888; font-size: 10px; transition: transform 0.3s; }
  .tp-faq-answer { padding: 15px 0 0 25px; font-size: 13px; color: #888888; line-height: 1.7; display: none; }
  .tp-faq-item.active .tp-faq-answer { display: block; }
  .tp-faq-image img { width: 100%; border-radius: 8px; }
  .tp-service-areas { padding: 80px 40px; background: #0a0a0a; }
  .tp-areas-container { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1.5fr; gap: 60px; align-items: start; }
  .tp-map-container { border-radius: 8px; overflow: hidden; height: 300px; }
  .tp-map-container iframe { width: 100%; height: 100%; border: 0; }
  .tp-areas-title { font-family: 'Oswald', sans-serif; font-size: 32px; font-weight: 700; text-transform: uppercase; margin-bottom: 30px; display: flex; align-items: center; gap: 15px; }
  .tp-areas-title::after { content: ''; flex: 1; height: 3px; background: ${accentColor}; max-width: 150px; }
  .tp-areas-list { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .tp-area-item { font-size: 14px; color: #888888; }
  .tp-cta { padding: 120px 40px; text-align: center; position: relative; }
  .tp-cta-container { max-width: 800px; margin: 0 auto; position: relative; z-index: 1; }
  .tp-cta h2, .tp-cta h3 { font-family: 'Oswald', sans-serif; font-size: 42px; font-weight: 700; text-transform: uppercase; font-style: italic; }
  .tp-cta h2 { margin-bottom: 5px; }
  .tp-cta h3 { margin-bottom: 30px; }
  .tp-footer { background: #0f0f0f; padding: 60px 40px 30px; }
  .tp-footer-container { max-width: 1200px; margin: 0 auto; }
  .tp-footer-top { display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr; gap: 40px; padding-bottom: 40px; border-bottom: 1px solid rgba(255,255,255,0.1); }
  .tp-footer-brand img { height: 50px; margin-bottom: 20px; }
  .tp-footer-contact { margin-bottom: 20px; }
  .tp-footer-contact a, .tp-footer-address { display: block; color: #888888; font-size: 14px; margin-bottom: 5px; transition: color 0.3s; }
  .tp-footer-contact a:hover { color: ${accentColor}; }
  .tp-footer-buttons { display: flex; gap: 10px; }
  .tp-footer-buttons .tp-btn { padding: 8px 15px; font-size: 10px; }
  .tp-footer-column h4 { font-family: 'Oswald', sans-serif; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; }
  .tp-footer-links a { display: block; color: #888888; font-size: 13px; margin-bottom: 8px; transition: color 0.3s; }
  .tp-footer-links a:hover { color: ${accentColor}; }
  .tp-footer-hours p { color: #888888; font-size: 12px; margin-bottom: 5px; }
  .tp-footer-bottom { padding-top: 30px; display: flex; justify-content: space-between; align-items: center; }
  .tp-footer-legal a { color: #888888; font-size: 13px; margin-right: 30px; transition: color 0.3s; }
  .tp-footer-legal a:hover { color: ${accentColor}; }
  .tp-chat-btn { position: fixed; bottom: 30px; right: 30px; width: 50px; height: 50px; background: ${accentColor}; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 5px 20px ${accentColor}66; z-index: 999; transition: transform 0.3s; }
  .tp-chat-btn:hover { transform: scale(1.1); }
  .tp-chat-btn svg { width: 24px; height: 24px; fill: #ffffff; }
  @media (max-width: 1200px) {
    .tp-hero-container { grid-template-columns: 1fr; gap: 40px; }
    .tp-quote-form { max-width: 450px; }
    .tp-about-container, .tp-faq-container, .tp-areas-container { grid-template-columns: 1fr; }
    .tp-services-grid { grid-template-columns: repeat(2, 1fr); }
    .tp-work-grid { grid-template-columns: repeat(3, 1fr); }
    .tp-reviews-grid { grid-template-columns: repeat(2, 1fr); }
    .tp-footer-top { grid-template-columns: repeat(3, 1fr); }
  }
  @media (max-width: 768px) {
    .tp-nav { display: none; }
    .tp-hero-title { font-size: 36px; }
    .tp-services-grid, .tp-work-grid { grid-template-columns: repeat(2, 1fr); }
    .tp-reviews-grid { grid-template-columns: 1fr; }
    .tp-process-steps { flex-direction: column; gap: 30px; align-items: center; }
    .tp-process-steps::before { display: none; }
    .tp-footer-top { grid-template-columns: 1fr; }
    .tp-badges-container { justify-content: center; }
  }
`;

export default TemplateProfessional;