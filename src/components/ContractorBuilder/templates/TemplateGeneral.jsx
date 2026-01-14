import React from 'react';

/**
 * TemplateGeneral - Universal Contractor Website Template
 * Features a dark, professional design that adapts to any contractor niche
 * Based on the Boston Electric style but flexible for all industries
 * UPDATED: Now supports textColor and accentTextColor from formData
 */

// Smart image matching system - maps keywords to relevant images
const serviceImageMap = {
  // Electrical
  'electrical': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600',
  'electric': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600',
  'wiring': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
  'panel': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
  'outlet': 'https://images.unsplash.com/photo-1558002038-1055907df827?w=600',
  'lighting': 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=600',
  'light': 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=600',
  'led': 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=600',
  'ev charger': 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600',
  'charger': 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600',
  'generator': 'https://images.unsplash.com/photo-1548872607-a5765e18263d?w=600',
  'surge': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
  'smoke detector': 'https://images.unsplash.com/photo-1558002038-1055907df827?w=600',
  'ceiling fan': 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=600',
  
  // Plumbing
  'plumbing': 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600',
  'plumber': 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600',
  'pipe': 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600',
  'drain': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600',
  'water heater': 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600',
  'faucet': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600',
  'toilet': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600',
  'sewer': 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600',
  'leak': 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600',
  'water': 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600',
  'garbage disposal': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600',
  'sump pump': 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600',
  
  // HVAC
  'hvac': 'https://images.unsplash.com/photo-1631545806609-c8bff4a1a0f5?w=600',
  'air conditioning': 'https://images.unsplash.com/photo-1631545806609-c8bff4a1a0f5?w=600',
  'ac ': 'https://images.unsplash.com/photo-1631545806609-c8bff4a1a0f5?w=600',
  'heating': 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600',
  'furnace': 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600',
  'duct': 'https://images.unsplash.com/photo-1631545806609-c8bff4a1a0f5?w=600',
  'ventilation': 'https://images.unsplash.com/photo-1631545806609-c8bff4a1a0f5?w=600',
  'thermostat': 'https://images.unsplash.com/photo-1567315219301-cb047f3b1c1f?w=600',
  'heat pump': 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600',
  'boiler': 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600',
  
  // Roofing
  'roof': 'https://images.unsplash.com/photo-1632759145351-1d592919f522?w=600',
  'roofing': 'https://images.unsplash.com/photo-1632759145351-1d592919f522?w=600',
  'shingle': 'https://images.unsplash.com/photo-1632759145351-1d592919f522?w=600',
  'gutter': 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600',
  'siding': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
  'chimney': 'https://images.unsplash.com/photo-1632759145351-1d592919f522?w=600',
  'skylight': 'https://images.unsplash.com/photo-1632759145351-1d592919f522?w=600',
  
  // Landscaping
  'landscap': 'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=600',
  'lawn': 'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=600',
  'garden': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600',
  'tree': 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600',
  'shrub': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600',
  'irrigation': 'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=600',
  'sprinkler': 'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=600',
  'sod': 'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=600',
  'mulch': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600',
  'paver': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600',
  'retaining wall': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600',
  'outdoor': 'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=600',
  
  // Kitchen
  'kitchen': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600',
  'cabinet': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600',
  'countertop': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600',
  'granite': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600',
  'quartz': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600',
  'backsplash': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600',
  'appliance': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600',
  
  // Bathroom
  'bathroom': 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600',
  'bath': 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600',
  'shower': 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600',
  'tub': 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600',
  'vanity': 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600',
  'tile': 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600',
  
  // Flooring
  'floor': 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=600',
  'hardwood': 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=600',
  'carpet': 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=600',
  'laminate': 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=600',
  'vinyl': 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=600',
  
  // Painting
  'paint': 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600',
  'painting': 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600',
  'stain': 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600',
  'wallpaper': 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600',
  'drywall': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600',
  
  // Windows and Doors
  'window': 'https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?w=600',
  'door': 'https://images.unsplash.com/photo-1506377295352-e3154d43ea9e?w=600',
  'glass': 'https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?w=600',
  
  // Concrete and Masonry
  'concrete': 'https://images.unsplash.com/photo-1590682680695-43b964a3ae17?w=600',
  'masonry': 'https://images.unsplash.com/photo-1590682680695-43b964a3ae17?w=600',
  'brick': 'https://images.unsplash.com/photo-1590682680695-43b964a3ae17?w=600',
  'stone': 'https://images.unsplash.com/photo-1590682680695-43b964a3ae17?w=600',
  'foundation': 'https://images.unsplash.com/photo-1590682680695-43b964a3ae17?w=600',
  'driveway': 'https://images.unsplash.com/photo-1590682680695-43b964a3ae17?w=600',
  'sidewalk': 'https://images.unsplash.com/photo-1590682680695-43b964a3ae17?w=600',
  'patio': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600',
  
  // Fencing and Decks
  'fence': 'https://images.unsplash.com/photo-1578869236155-11a1a00e7d50?w=600',
  'fencing': 'https://images.unsplash.com/photo-1578869236155-11a1a00e7d50?w=600',
  'deck': 'https://images.unsplash.com/photo-1591825729269-caeb344f6df2?w=600',
  'pergola': 'https://images.unsplash.com/photo-1591825729269-caeb344f6df2?w=600',
  'gazebo': 'https://images.unsplash.com/photo-1591825729269-caeb344f6df2?w=600',
  
  // Pool and Spa
  'pool': 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=600',
  'spa': 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=600',
  'hot tub': 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=600',
  
  // Solar and Green
  'solar': 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600',
  'energy': 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600',
  'insulation': 'https://images.unsplash.com/photo-1607400201889-565b1ee75f8e?w=600',
  
  // General Construction
  'remodel': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600',
  'renovation': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600',
  'addition': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600',
  'construction': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600',
  'build': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600',
  'framing': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600',
  'basement': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600',
  'attic': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600',
  'home': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600',
  'house': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600',
  'commercial': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600',
  'office': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600',
  
  // Specialty
  'pressure wash': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
  'cleaning': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
  'mold': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
  'pest': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
  'security': 'https://images.unsplash.com/photo-1558002038-1055907df827?w=600',
  'camera': 'https://images.unsplash.com/photo-1558002038-1055907df827?w=600',
  'alarm': 'https://images.unsplash.com/photo-1558002038-1055907df827?w=600',
  'smart home': 'https://images.unsplash.com/photo-1558002038-1055907df827?w=600',
  'automation': 'https://images.unsplash.com/photo-1558002038-1055907df827?w=600',
  
  // Misc
  'repair': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600',
  'maintenance': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600',
  'install': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600',
  'replace': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600',
  'upgrade': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600',
  'inspect': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600',
  'emergency': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600',
  '24/7': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600',
};

// Default fallback images for when no keyword matches
const defaultServiceImages = [
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600',
  'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600',
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600',
  'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
  'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=600',
  'https://images.unsplash.com/photo-1558002038-1055907df827?w=600',
  'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=600',
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

function TemplateGeneral({ formData, images }) {
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

  // Dynamic colors with fallbacks
  const accentColor = data.accentColor || '#ff4d00';
  const primaryColor = data.primaryColor || '#0a0a0a';
  // NEW: Text color variables
  const textColor = data.textColor || '#ffffff';
  const accentTextColor = data.accentTextColor || '#cccccc';

  return (
    <div className="template-general">
      <style>{templateGeneralStyles(accentColor, primaryColor, textColor, accentTextColor)}</style>
      
      {/* Header */}
      <header className="tg-header">
        <div className="tg-header-container">
          <a href="#" className="tg-logo">
            {imgs.logo ? (
              <img src={imgs.logo} alt="Logo" className="tg-logo-img" />
            ) : (
              <span className="tg-logo-text">{data.companyName || 'Company Name'}</span>
            )}
          </a>
          <nav className="tg-nav">
            <a href="#" className="tg-nav-link">Home</a>
            <div className="tg-nav-dropdown">
              <span className="tg-nav-link">Services ▼</span>
              <div className="tg-dropdown-menu">
                {services.slice(0, 8).map((service, idx) => (
                  <a key={idx} href="#">{service}</a>
                ))}
              </div>
            </div>
            <a href="#" className="tg-nav-link">Projects</a>
            <a href="#" className="tg-nav-link">About</a>
            <a href="#" className="tg-nav-link">Contact</a>
          </nav>
          <div className="tg-header-buttons">
            <a href="#" className="tg-btn tg-btn-primary">Get Free Quote</a>
            <a href={`tel:${data.phone || '(555) 123-4567'}`} className="tg-btn tg-btn-outline tg-phone-btn">
              {data.phone || '(555) 123-4567'}
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        className="tg-hero"
        style={{
          background: imgs.hero 
            ? `linear-gradient(135deg, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.7) 50%, rgba(10,10,10,0.4) 100%), url(${imgs.hero}) center/cover`
            : `linear-gradient(135deg, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.7) 50%, rgba(10,10,10,0.4) 100%), url(https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920) center/cover`
        }}
      >
        <div className="tg-hero-overlay"></div>
        <div className="tg-hero-container">
          <div className="tg-hero-content">
            <h1 className="tg-hero-title">
              {data.headline || `${data.companyName || 'Professional'} Services You Can Rely On`}
            </h1>
            <p className="tg-hero-text">
              {data.tagline || `${data.companyName || 'Our Company'} provides high-quality, reliable services to homeowners and businesses across the area.`}
            </p>
          </div>
          <div className="tg-quote-form">
            <div className="tg-form-header">
              {imgs.logo && (
                <div className="tg-form-logo">
                  <img src={imgs.logo} alt="Logo" />
                </div>
              )}
              <h3>Get A Free Quote</h3>
            </div>
            <form>
              <div className="tg-form-group">
                <label>Full Name *</label>
                <input type="text" placeholder="John Smith" />
              </div>
              <div className="tg-form-group">
                <label>Phone</label>
                <div className="tg-phone-field">
                  <div className="tg-flag">+1</div>
                  <input type="tel" placeholder="(555) 555-1234" />
                </div>
              </div>
              <div className="tg-form-group">
                <label>Short message about your needs *</label>
                <textarea placeholder="Tell us about your project..."></textarea>
              </div>
              <div className="tg-form-checkbox">
                <input type="checkbox" id="terms" />
                <label htmlFor="terms">I agree to terms and conditions provided by the company.</label>
              </div>
              <button type="submit" className="tg-form-submit">Send</button>
            </form>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="tg-trust-badges">
        <div className="tg-badges-container">
          <div className="tg-badge"><span className="tg-badge-icon">📍</span> 100% Local</div>
          <div className="tg-badge"><span className="tg-badge-icon">🕐</span> {data.yearsExperience || '10'}+ Years Experience</div>
          <div className="tg-badge"><span className="tg-badge-icon">🏆</span> High Quality</div>
          <div className="tg-badge"><span className="tg-badge-icon">✓</span> Licensed & Insured</div>
          <div className="tg-badge"><span className="tg-badge-icon">⭐</span> 5-Star Rated</div>
        </div>
      </section>

      {/* About Section */}
      <section className="tg-about">
        <div className="tg-about-container">
          <div className="tg-about-content">
            <h2 className="tg-section-title">About Us</h2>
            <p className="tg-about-text">
              {data.aboutText || `${data.companyName || 'Our Company'} has been proudly serving the area with top-notch services since ${2025 - (parseInt(data.yearsExperience) || 10)}. Our team of dedicated professionals is committed to delivering exceptional results with transparent pricing and outstanding customer service. We take pride in every project we complete and treat your property as if it were our own.`}
            </p>
            <div className="tg-google-badge">
              <svg viewBox="0 0 24 24" width="30" height="30">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </div>
          </div>
          <div className="tg-about-image">
            {imgs.about ? (
              <img src={imgs.about} alt="About Us" />
            ) : imgs.hero ? (
              <img src={imgs.hero} alt="About Us" />
            ) : (
              <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600" alt="About Us" />
            )}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="tg-services">
        <div className="tg-services-container">
          <p className="tg-section-label">What We Are Best At</p>
          <h2 className="tg-section-title">Our Services</h2>
          <div className="tg-services-grid">
            {services.map((service, idx) => (
              <a key={idx} href="#" className="tg-service-card">
                <img src={getServiceImage(service, idx)} alt={service} />
                <div className="tg-service-card-label">
                  <h3>{service}</h3>
                  <span className="tg-service-arrow">→</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="tg-process">
        <div className="tg-process-container">
          <h2 className="tg-section-title">Our Process</h2>
          <p className="tg-process-subtitle">Our process is simple and only contains a few simple steps</p>
          <div className="tg-process-steps">
            <div className="tg-process-step">
              <div className="tg-step-icon">
                <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
              </div>
              <h4>Free Consult</h4>
            </div>
            <div className="tg-process-step">
              <div className="tg-step-icon">
                <svg viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
              </div>
              <h4>Estimation</h4>
            </div>
            <div className="tg-process-step">
              <div className="tg-step-icon">
                <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
              </div>
              <h4>We Do The Work</h4>
            </div>
            <div className="tg-process-step">
              <div className="tg-step-icon">
                <svg viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm-3.06 16L7.4 14.46l1.41-1.41 2.12 2.12 4.24-4.24 1.41 1.41L10.94 18zM13 9V3.5L18.5 9H13z"/></svg>
              </div>
              <h4>Final Inspection</h4>
            </div>
            <div className="tg-process-step">
              <div className="tg-step-icon">
                <svg viewBox="0 0 24 24"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>
              </div>
              <h4>Payment</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Work Gallery */}
      {imgs.gallery && imgs.gallery.length > 0 && (
        <section className="tg-work">
          <div className="tg-work-container">
            <div className="tg-work-header">
              <div>
                <p className="tg-section-label">See Why Our Customers Love Us</p>
                <h2 className="tg-section-title">See Our Work</h2>
              </div>
              <a href="#" className="tg-btn tg-btn-outline">See All Photos</a>
            </div>
            <div className="tg-work-grid">
              {imgs.gallery.map((img, idx) => (
                <div key={idx} className="tg-work-item">
                  <img src={img} alt={`Work ${idx + 1}`} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reviews Section */}
      <section 
        className="tg-reviews"
        style={{
          background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920) center/cover fixed`
        }}
      >
        <div className="tg-wave-top">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="tg-shape-fill"></path>
          </svg>
        </div>
        <div className="tg-wave-bottom">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="tg-shape-fill"></path>
          </svg>
        </div>
        <div className="tg-reviews-container">
          <div className="tg-reviews-header">
            <div>
              <p className="tg-section-label tg-section-label-dark">Discover What Our Customers Have To Say About Us</p>
              <h2 className="tg-section-title">Reviews</h2>
            </div>
            <a href="#" className="tg-btn tg-btn-outline">Contact Us Now</a>
          </div>
          <div className="tg-reviews-grid">
            {[
              { name: 'Michael R.', text: 'Excellent work! Professional, on time, and the quality exceeded my expectations. Highly recommend!' },
              { name: 'Sarah T.', text: 'I highly recommend this company for any work you may need. They are very professional and courteous throughout the entire process.' },
              { name: 'James P.', text: 'Very thorough and knowledgeable. Explained everything clearly and completed the job perfectly.' },
              { name: 'Emily K.', text: 'Fast, efficient, and professional service. My project was completed in no time and looks amazing.' }
            ].map((review, idx) => (
              <div key={idx} className="tg-review-card">
                <div className="tg-review-rating">
                  <span className="tg-review-number">5</span>
                  <span className="tg-review-stars">★★★★★</span>
                </div>
                <p className="tg-review-text">{review.text}</p>
                <div className="tg-review-author">
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
          <div className="tg-review-cta">
            <h3>Review Us On Google</h3>
            <div className="tg-review-cta-stars">★★★★★</div>
            <a href="#" className="tg-btn tg-btn-primary">Leave Us A Review</a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="tg-faq">
        <div className="tg-faq-container">
          <div className="tg-faq-content">
            <h2 className="tg-faq-title">Frequently Asked Questions</h2>
            <div className="tg-faq-list">
              <div className="tg-faq-item">
                <div className="tg-faq-question">
                  <span className="tg-faq-icon">▼</span>
                  Can you provide references from past clients?
                </div>
                <div className="tg-faq-answer">
                  Absolutely, we can provide references from past clients. Additionally, you can read the reviews and testimonials from our satisfied customers on our website.
                </div>
              </div>
              <div className="tg-faq-item">
                <div className="tg-faq-question">
                  <span className="tg-faq-icon">▼</span>
                  What sets you apart from other contractors?
                </div>
                <div className="tg-faq-answer">
                  We distinguish ourselves through meticulous attention to detail, a dedication to quality, and a personalized approach. We prioritize client communication to seamlessly bring their vision to life.
                </div>
              </div>
              <div className="tg-faq-item">
                <div className="tg-faq-question">
                  <span className="tg-faq-icon">▼</span>
                  Is there a fee for a consultation or estimate?
                </div>
                <div className="tg-faq-answer">
                  No, we offer complimentary estimates to all prospective clients.
                </div>
              </div>
            </div>
          </div>
          <div className="tg-faq-image">
            {imgs.about ? (
              <img src={imgs.about} alt="FAQ" />
            ) : (
              <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600" alt="FAQ" />
            )}
          </div>
        </div>
      </section>

      {/* Service Areas Section */}
      {serviceAreas.length > 0 && (
        <section className="tg-service-areas">
          <div className="tg-areas-container">
            <div className="tg-map-container">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.30596073366!2d-74.25986548248684!3d40.69714941932609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1234567890" 
                allowFullScreen="" 
                loading="lazy"
                title="Service Area Map"
              ></iframe>
            </div>
            <div className="tg-areas-content">
              <h2 className="tg-areas-title">Proudly Serving These Areas</h2>
              <div className="tg-areas-list">
                {serviceAreas.map((area, idx) => (
                  <div key={idx} className="tg-area-item">{area}</div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section 
        className="tg-cta"
        style={{
          background: imgs.hero 
            ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${imgs.hero}) center/cover`
            : `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920) center/cover`
        }}
      >
        <div className="tg-wave-top">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="tg-shape-fill"></path>
          </svg>
        </div>
        <div className="tg-wave-bottom">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="tg-shape-fill"></path>
          </svg>
        </div>
        <div className="tg-cta-container">
          <h2>Ready To Take The Next Step?</h2>
          <h3>Get A Free Quote Today!</h3>
          <a href="#" className="tg-btn tg-btn-primary">Get A Free Quote</a>
        </div>
      </section>

      {/* Footer */}
      <footer className="tg-footer">
        <div className="tg-footer-container">
          <div className="tg-footer-top">
            <div className="tg-footer-brand-section">
              <div className="tg-footer-brand">
                {imgs.logo ? (
                  <img src={imgs.logo} alt="Logo" />
                ) : (
                  <span>{data.companyName || 'Company Name'}</span>
                )}
              </div>
              <div className="tg-footer-contact">
                <a href={`mailto:${data.email || 'info@company.com'}`}>{data.email || 'info@company.com'}</a>
                <a href={`tel:${data.phone || '(555) 123-4567'}`}>{data.phone || '(555) 123-4567'}</a>
                {data.address && <span className="tg-footer-address">{data.address}</span>}
              </div>
              <div className="tg-footer-buttons">
                <a href="#" className="tg-btn tg-btn-outline">Contact</a>
                <a href="#" className="tg-btn tg-btn-primary">Get Quote</a>
              </div>
            </div>
            <div className="tg-footer-column">
              <h4>Business</h4>
              <div className="tg-footer-links">
                <a href="#">Home</a>
                <a href="#">Projects</a>
                <a href="#">About</a>
                <a href="#">Contact</a>
                <a href="#">Review Us</a>
              </div>
            </div>
            <div className="tg-footer-column">
              <h4>Our Services</h4>
              <div className="tg-footer-links">
                {services.slice(0, 8).map((service, idx) => (
                  <a key={idx} href="#">{service}</a>
                ))}
              </div>
            </div>
            <div className="tg-footer-column">
              <h4>Service Areas</h4>
              <div className="tg-footer-links">
                {serviceAreas.slice(0, 8).map((area, idx) => (
                  <a key={idx} href="#">{area}</a>
                ))}
              </div>
            </div>
            <div className="tg-footer-column">
              <h4>Operating Hours</h4>
              <div className="tg-footer-hours">
                <p>Mon: 7:00AM - 5:00PM</p>
                <p>Tue: 7:00AM - 5:00PM</p>
                <p>Wed: 7:00AM - 5:00PM</p>
                <p>Thu: 7:00AM - 5:00PM</p>
                <p>Fri: 7:00AM - 5:00PM</p>
                <p>Sat: By Appointment</p>
                <p>Sun: Closed</p>
              </div>
            </div>
          </div>
          <div className="tg-footer-bottom">
            <div className="tg-footer-legal">
              <a href="#">Terms & Conditions</a>
              <a href="#">Privacy Policy</a>
            </div>
            <a href="#" className="tg-btn tg-btn-primary">Get Free Quote</a>
          </div>
        </div>
      </footer>

      {/* Chat Button */}
      <div className="tg-chat-btn">
        <svg viewBox="0 0 24 24"><path d="M12 3c5.5 0 10 3.58 10 8s-4.5 8-10 8c-1.24 0-2.43-.18-3.53-.5C5.55 21 2 21 2 21c2.33-2.33 2.7-3.9 2.75-4.5C3.05 15.07 2 13.13 2 11c0-4.42 4.5-8 10-8z"/></svg>
      </div>
    </div>
  );
}

// ============================================
// UPDATED: Dynamic styles function now accepts textColor and accentTextColor
// All hardcoded #ffffff replaced with ${textColor}
// All hardcoded #cccccc/#888888 replaced with ${accentTextColor}
// ============================================
const templateGeneralStyles = (accentColor, primaryColor, textColor, accentTextColor) => `
  .template-general {
    background: ${primaryColor};
    color: ${textColor};
    font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    line-height: 1.6;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0,0,0,0.12);
    min-height: calc(100vh - 48px);
  }
  .template-general a { text-decoration: none; color: inherit; }
  .tg-header { position: sticky; top: 0; left: 0; right: 0; z-index: 1000; background: ${primaryColor}f2; backdrop-filter: blur(10px); padding: 10px 0; }
  .tg-header-container { max-width: 1400px; margin: 0 auto; padding: 0 40px; display: flex; justify-content: space-between; align-items: center; }
  .tg-logo { display: flex; align-items: center; gap: 10px; }
  .tg-logo-img { height: 50px; object-fit: contain; }
  .tg-logo-text { font-size: 20px; font-weight: 700; color: ${textColor}; }
  .tg-nav { display: flex; align-items: center; gap: 25px; }
  .tg-nav-link { font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; color: ${textColor}; cursor: pointer; transition: color 0.3s; background: none; border: none; }
  .tg-nav-link:hover { color: ${accentColor}; }
  .tg-nav-dropdown { position: relative; }
  .tg-dropdown-menu { position: absolute; top: 100%; left: 0; background: ${primaryColor}; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; min-width: 200px; padding: 10px 0; opacity: 0; visibility: hidden; transform: translateY(10px); transition: all 0.3s; }
  .tg-nav-dropdown:hover .tg-dropdown-menu { opacity: 1; visibility: visible; transform: translateY(5px); }
  .tg-dropdown-menu a { display: block; padding: 8px 20px; font-size: 13px; text-transform: none; color: ${accentTextColor}; }
  .tg-dropdown-menu a:hover { color: ${accentColor}; background: ${accentColor}15; }
  .tg-header-buttons { display: flex; align-items: center; gap: 15px; }
  .tg-btn { padding: 10px 20px; border-radius: 4px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; cursor: pointer; transition: all 0.3s; border: 2px solid transparent; display: inline-block; }
  .tg-btn-primary { background: ${accentColor}; color: ${textColor}; border-color: ${accentColor}; }
  .tg-btn-primary:hover { background: ${accentColor}dd; border-color: ${accentColor}dd; }
  .tg-btn-outline { background: transparent; color: ${accentColor}; border-color: ${accentColor}; }
  .tg-btn-outline:hover { background: ${accentColor}; color: ${textColor}; }
  .tg-phone-btn { font-size: 12px; padding: 8px 15px; }
  .tg-hero { min-height: 100vh; display: flex; align-items: center; padding: 100px 40px 60px; position: relative; }
  .tg-hero-overlay { position: absolute; top: 0; right: 0; bottom: 0; width: 60%; background: linear-gradient(135deg, transparent 0%, ${accentColor}30 50%, ${accentColor}50 100%); clip-path: polygon(30% 0, 100% 0, 100% 100%, 0% 100%); }
  .tg-hero-container { max-width: 1400px; margin: 0 auto; width: 100%; display: grid; grid-template-columns: 1fr 400px; gap: 80px; align-items: center; position: relative; z-index: 1; }
  .tg-hero-title { font-family: 'Oswald', sans-serif; font-size: 52px; font-weight: 700; line-height: 1.1; text-transform: uppercase; margin-bottom: 20px; color: ${textColor}; }
  .tg-hero-text { font-size: 15px; color: ${accentTextColor}; max-width: 400px; line-height: 1.7; }
  .tg-quote-form { background: #ffffff; border-radius: 8px; padding: 30px; color: #333; }
  .tg-form-header { text-align: center; margin-bottom: 25px; }
  .tg-form-logo { width: 60px; height: 60px; margin: 0 auto 15px; }
  .tg-form-logo img { width: 100%; height: 100%; object-fit: contain; }
  .tg-form-header h3 { font-family: 'Oswald', sans-serif; font-size: 22px; font-weight: 700; color: #1a1a1a; text-transform: uppercase; }
  .tg-form-group { margin-bottom: 15px; }
  .tg-form-group label { display: block; font-size: 12px; font-weight: 600; margin-bottom: 6px; color: #333; }
  .tg-form-group input, .tg-form-group textarea { width: 100%; padding: 12px 15px; background: #f5f5f5; border: 1px solid #e0e0e0; border-radius: 4px; font-size: 14px; font-family: inherit; color: #333; box-sizing: border-box; }
  .tg-form-group input::placeholder, .tg-form-group textarea::placeholder { color: #999; }
  .tg-form-group textarea { min-height: 80px; resize: vertical; }
  .tg-phone-field { display: flex; align-items: center; background: #f5f5f5; border: 1px solid #e0e0e0; border-radius: 4px; overflow: hidden; }
  .tg-flag { padding: 12px; display: flex; align-items: center; gap: 5px; font-size: 14px; border-right: 1px solid #e0e0e0; }
  .tg-phone-field input { border: none; background: transparent; }
  .tg-form-checkbox { display: flex; align-items: flex-start; gap: 10px; font-size: 11px; color: #666; margin-bottom: 20px; line-height: 1.5; }
  .tg-form-checkbox input { margin-top: 3px; }
  .tg-form-submit { width: 100%; padding: 14px; background: ${accentColor}; border: none; border-radius: 4px; color: ${textColor}; font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; cursor: pointer; transition: background 0.3s; }
  .tg-form-submit:hover { background: ${accentColor}dd; }
  .tg-trust-badges { background: ${primaryColor}; padding: 20px 40px; border-top: 1px solid rgba(255,255,255,0.1); border-bottom: 1px solid rgba(255,255,255,0.1); }
  .tg-badges-container { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; }
  .tg-badge { display: flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; color: ${accentTextColor}; }
  .tg-badge-icon { color: ${accentColor}; }
  .tg-about { padding: 80px 40px; background: ${primaryColor}; }
  .tg-about-container { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
  .tg-section-title { font-family: 'Oswald', sans-serif; font-size: 32px; font-weight: 700; text-transform: uppercase; margin-bottom: 20px; display: flex; align-items: center; gap: 15px; color: ${textColor}; }
  .tg-section-title::after { content: ''; flex: 1; height: 3px; background: ${accentColor}; max-width: 100px; }
  .tg-about-text { font-size: 14px; color: ${accentTextColor}; line-height: 1.8; }
  .tg-google-badge { margin-top: 30px; display: inline-block; }
  .tg-about-image img { width: 100%; max-width: 500px; border-radius: 8px; }
  .tg-services { padding: 80px 40px; background: ${primaryColor}; }
  .tg-services-container { max-width: 1200px; margin: 0 auto; }
  .tg-section-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; color: ${accentTextColor}; margin-bottom: 10px; }
  .tg-services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-top: 40px; }
  .tg-service-card { position: relative; aspect-ratio: 1.1; border-radius: 8px; overflow: hidden; cursor: pointer; }
  .tg-service-card img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
  .tg-service-card:hover img { transform: scale(1.1); }
  .tg-service-card::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 40%, transparent 70%); }
  .tg-service-card-label { position: absolute; bottom: 15px; left: 15px; z-index: 1; display: flex; align-items: center; gap: 8px; }
  .tg-service-card-label h3 { font-family: 'Oswald', sans-serif; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: ${textColor}; }
  .tg-service-arrow { width: 18px; height: 18px; background: ${accentColor}; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; color: ${textColor}; }
  .tg-process { padding: 80px 40px; background: ${primaryColor}; }
  .tg-process-container { max-width: 1200px; margin: 0 auto; }
  .tg-process-subtitle { font-size: 14px; color: ${accentTextColor}; margin-top: 10px; }
  .tg-process-steps { display: flex; justify-content: space-between; align-items: flex-start; margin-top: 60px; position: relative; }
  .tg-process-steps::before { content: ''; position: absolute; top: 40px; left: 80px; right: 80px; height: 2px; background: rgba(255,255,255,0.1); }
  .tg-process-step { display: flex; flex-direction: column; align-items: center; text-align: center; position: relative; z-index: 1; flex: 1; }
  .tg-step-icon { width: 80px; height: 80px; background: #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; box-shadow: 0 5px 20px rgba(0,0,0,0.3); }
  .tg-step-icon svg { width: 35px; height: 35px; fill: #333; }
  .tg-process-step h4 { font-size: 13px; font-weight: 500; color: ${accentTextColor}; max-width: 90px; line-height: 1.4; }
  .tg-work { padding: 80px 40px; background: ${primaryColor}; }
  .tg-work-container { max-width: 1200px; margin: 0 auto; }
  .tg-work-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
  .tg-work-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; }
  .tg-work-item { position: relative; aspect-ratio: 1; border-radius: 8px; overflow: hidden; }
  .tg-work-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
  .tg-work-item:hover img { transform: scale(1.1); }
  .tg-reviews { padding: 120px 40px; position: relative; }
  .tg-wave-top, .tg-wave-bottom { position: absolute; left: 0; width: 100%; overflow: hidden; line-height: 0; }
  .tg-wave-top { top: 0; }
  .tg-wave-bottom { bottom: 0; transform: rotate(180deg); }
  .tg-wave-top svg, .tg-wave-bottom svg { position: relative; display: block; width: calc(100% + 1.3px); height: 80px; }
  .tg-shape-fill { fill: ${primaryColor}; }
  .tg-reviews-container { max-width: 1200px; margin: 0 auto; position: relative; z-index: 1; }
  .tg-reviews-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
  .tg-section-label-dark { background: ${primaryColor}; display: inline-block; padding: 8px 15px; margin-bottom: 10px; color: ${accentTextColor}; }
  .tg-reviews-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px; }
  .tg-review-card { background: #ffffff; border-radius: 8px; padding: 20px; color: #333; }
  .tg-review-rating { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
  .tg-review-number { font-weight: 700; font-size: 14px; }
  .tg-review-stars { color: ${accentColor}; font-size: 14px; }
  .tg-review-text { font-size: 13px; color: #555; line-height: 1.6; margin-bottom: 15px; }
  .tg-review-author { display: flex; justify-content: space-between; align-items: center; }
  .tg-review-author span { font-size: 12px; color: #888; }
  .tg-review-cta { text-align: center; padding: 50px 60px; background: ${primaryColor}; border: 2px solid rgba(255,255,255,0.2); border-radius: 8px; max-width: 500px; margin: 40px auto 0; }
  .tg-review-cta h3 { font-family: 'Oswald', sans-serif; font-size: 26px; font-weight: 700; text-transform: uppercase; margin-bottom: 15px; color: ${textColor}; }
  .tg-review-cta-stars { color: ${accentColor}; font-size: 26px; margin-bottom: 25px; }
  .tg-faq { padding: 80px 40px; background: ${primaryColor}; }
  .tg-faq-container { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: start; }
  .tg-faq-title { font-family: 'Playfair Display', serif; font-size: 34px; font-style: italic; font-weight: 400; margin-bottom: 30px; color: ${textColor}; }
  .tg-faq-item { border-bottom: 1px solid rgba(255,255,255,0.1); padding: 18px 0; }
  .tg-faq-question { display: flex; align-items: center; gap: 12px; cursor: pointer; font-size: 14px; font-weight: 500; transition: color 0.3s; color: ${textColor}; }
  .tg-faq-question:hover { color: ${accentColor}; }
  .tg-faq-icon { color: ${accentTextColor}; font-size: 10px; transition: transform 0.3s; }
  .tg-faq-answer { padding: 15px 0 0 25px; font-size: 13px; color: ${accentTextColor}; line-height: 1.7; display: none; }
  .tg-faq-item.active .tg-faq-answer { display: block; }
  .tg-faq-image img { width: 100%; border-radius: 8px; }
  .tg-service-areas { padding: 80px 40px; background: ${primaryColor}; }
  .tg-areas-container { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1.5fr; gap: 60px; align-items: start; }
  .tg-map-container { border-radius: 8px; overflow: hidden; height: 300px; }
  .tg-map-container iframe { width: 100%; height: 100%; border: 0; }
  .tg-areas-title { font-family: 'Oswald', sans-serif; font-size: 32px; font-weight: 700; text-transform: uppercase; margin-bottom: 30px; display: flex; align-items: center; gap: 15px; color: ${textColor}; }
  .tg-areas-title::after { content: ''; flex: 1; height: 3px; background: ${accentColor}; max-width: 150px; }
  .tg-areas-list { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .tg-area-item { font-size: 14px; color: ${accentTextColor}; }
  .tg-cta { padding: 120px 40px; text-align: center; position: relative; }
  .tg-cta-container { max-width: 800px; margin: 0 auto; position: relative; z-index: 1; }
  .tg-cta h2, .tg-cta h3 { font-family: 'Oswald', sans-serif; font-size: 42px; font-weight: 700; text-transform: uppercase; font-style: italic; color: ${textColor}; }
  .tg-cta h2 { margin-bottom: 5px; }
  .tg-cta h3 { margin-bottom: 30px; }
  .tg-footer { background: ${primaryColor}; padding: 60px 40px 30px; }
  .tg-footer-container { max-width: 1200px; margin: 0 auto; }
  .tg-footer-top { display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr; gap: 40px; padding-bottom: 40px; border-bottom: 1px solid rgba(255,255,255,0.1); }
  .tg-footer-brand img { height: 50px; margin-bottom: 20px; }
  .tg-footer-brand span { font-family: 'Oswald', sans-serif; font-size: 24px; font-weight: 700; color: ${textColor}; }
  .tg-footer-contact { margin-bottom: 20px; }
  .tg-footer-contact a, .tg-footer-address { display: block; color: ${accentTextColor}; font-size: 14px; margin-bottom: 5px; transition: color 0.3s; }
  .tg-footer-contact a:hover { color: ${accentColor}; }
  .tg-footer-buttons { display: flex; gap: 10px; }
  .tg-footer-buttons .tg-btn { padding: 8px 15px; font-size: 10px; }
  .tg-footer-column h4 { font-family: 'Oswald', sans-serif; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; color: ${textColor}; }
  .tg-footer-links a { display: block; color: ${accentTextColor}; font-size: 13px; margin-bottom: 8px; transition: color 0.3s; }
  .tg-footer-links a:hover { color: ${accentColor}; }
  .tg-footer-hours p { color: ${accentTextColor}; font-size: 12px; margin-bottom: 5px; }
  .tg-footer-bottom { padding-top: 30px; display: flex; justify-content: space-between; align-items: center; }
  .tg-footer-legal a { color: ${accentTextColor}; font-size: 13px; margin-right: 30px; transition: color 0.3s; }
  .tg-footer-legal a:hover { color: ${accentColor}; }
  .tg-chat-btn { position: fixed; bottom: 30px; right: 30px; width: 50px; height: 50px; background: ${accentColor}; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 5px 20px ${accentColor}66; z-index: 999; transition: transform 0.3s; }
  .tg-chat-btn:hover { transform: scale(1.1); }
  .tg-chat-btn svg { width: 24px; height: 24px; fill: ${textColor}; }
  @media (max-width: 1200px) {
    .tg-hero-container { grid-template-columns: 1fr; gap: 40px; }
    .tg-quote-form { max-width: 450px; }
    .tg-about-container, .tg-faq-container, .tg-areas-container { grid-template-columns: 1fr; }
    .tg-services-grid { grid-template-columns: repeat(2, 1fr); }
    .tg-work-grid { grid-template-columns: repeat(3, 1fr); }
    .tg-reviews-grid { grid-template-columns: repeat(2, 1fr); }
    .tg-footer-top { grid-template-columns: repeat(3, 1fr); }
  }
  @media (max-width: 768px) {
    .tg-nav { display: none; }
    .tg-hero-title { font-size: 50px; }
    .tg-services-grid, .tg-work-grid { grid-template-columns: repeat(2, 1fr); }
    .tg-reviews-grid { grid-template-columns: 1fr; }
    .tg-process-steps { flex-direction: column; gap: 30px; align-items: center; }
    .tg-process-steps::before { display: none; }
    .tg-footer-top { grid-template-columns: 1fr; }
    .tg-badges-container { justify-content: center; }
  }
`;

export default TemplateGeneral;