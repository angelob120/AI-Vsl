import React from 'react';

/**
 * TemplateGeneral - Universal Contractor Website Template
 * Features a dark, professional design that adapts to any contractor niche
 * Based on the Boston Electric / KDP Plumbing / Mitchell Construction style
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
  // Text color variables
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
          backgroundImage: imgs.hero 
            ? `url(${imgs.hero})`
            : `url(https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920)`
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
              <h3>Get A Free Quote</h3>
            </div>
            <form>
              <div className="tg-form-group">
                <label>Full Name *</label>
                <input type="text" placeholder="John Smith" />
              </div>
              <div className="tg-form-group">
                <label>Phone</label>
                <div className="tg-phone-input">
                  <span className="tg-phone-prefix">+1</span>
                  <input type="tel" placeholder="(555) 555-1234" />
                </div>
              </div>
              <div className="tg-form-group">
                <label>Short message about your needs *</label>
                <textarea placeholder="Tell us about your project..."></textarea>
              </div>
              <div className="tg-form-checkbox">
                <input type="checkbox" id="terms" />
                <label htmlFor="terms">I agree to <a href="#">terms and conditions</a> provided by the company.</label>
              </div>
              <button type="submit" className="tg-form-submit">Send</button>
            </form>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="tg-trust-badges">
        <div className="tg-badges-container">
          <div className="tg-badge">
            <span className="tg-badge-icon">◉</span>
            <span>100% Local</span>
          </div>
          <div className="tg-badge">
            <span className="tg-badge-icon">◉</span>
            <span>{data.yearsExperience || '10'}+ Years Experience</span>
          </div>
          <div className="tg-badge">
            <span className="tg-badge-icon">◉</span>
            <span>Insured</span>
          </div>
          <div className="tg-badge">
            <span className="tg-badge-icon">◉</span>
            <span>Licensed & Insured</span>
          </div>
          <div className="tg-badge">
            <span className="tg-badge-icon">◉</span>
            <span>5-Star Rated</span>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="tg-about">
        <div className="tg-about-container">
          <div className="tg-about-content">
            <h2 className="tg-section-title-lined">About Us</h2>
            <p className="tg-about-text">
              {data.aboutText || `${data.companyName || 'Our Company'} has been proudly serving the area with top-notch services since ${2025 - (parseInt(data.yearsExperience) || 10)}. Our team of dedicated professionals is committed to delivering exceptional results with transparent pricing and outstanding customer service. We take pride in every project we complete and treat your property as if it were our own.`}
            </p>
            <div className="tg-social-icons">
              <a href="#" className="tg-social-icon">
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </a>
              <a href="#" className="tg-social-icon tg-social-instagram">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" className="tg-social-icon tg-social-facebook">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
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
          <h2 className="tg-section-title-lined">Our Services</h2>
          <div className="tg-services-grid">
            {services.map((service, idx) => (
              <a key={idx} href="#" className="tg-service-card">
                <img src={getServiceImage(service, idx)} alt={service} />
                <div className="tg-service-overlay"></div>
                <div className="tg-service-label">
                  <span className="tg-service-name">{service}</span>
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
          <h2 className="tg-section-title-lined">Our Process</h2>
          <p className="tg-process-subtitle">Our process is simple and only contains a few simple steps</p>
          <div className="tg-process-steps">
            <div className="tg-process-line"></div>
            <div className="tg-process-step">
              <div className="tg-step-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <span className="tg-step-label">Free Consult</span>
            </div>
            <div className="tg-process-step">
              <div className="tg-step-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
              </div>
              <span className="tg-step-label">Estimation & Proposal</span>
            </div>
            <div className="tg-process-step">
              <div className="tg-step-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                </svg>
              </div>
              <span className="tg-step-label">We do the work</span>
            </div>
            <div className="tg-process-step">
              <div className="tg-step-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 11l3 3L22 4"/>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
              </div>
              <span className="tg-step-label">Final Inspection</span>
            </div>
            <div className="tg-process-step">
              <div className="tg-step-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <span className="tg-step-label">Payment</span>
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
                <h2 className="tg-section-title-lined">See Our Work</h2>
              </div>
              <a href="#" className="tg-btn tg-btn-outline">See All Photos</a>
            </div>
            <div className="tg-work-grid">
              {imgs.gallery.slice(0, 8).map((img, idx) => (
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
          backgroundImage: imgs.hero 
            ? `url(${imgs.hero})`
            : `url(https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920)`
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
              <p className="tg-section-label-box">Discover What Our Customers Have To Say About Us</p>
              <h2 className="tg-section-title-lined tg-section-title-white">Reviews</h2>
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
                  <span className="tg-faq-icon">+</span>
                  <span>Can you provide references from past clients?</span>
                </div>
                <div className="tg-faq-answer">
                  Absolutely, we can provide references from past clients. Additionally, you can read the reviews and testimonials from our satisfied customers on our website.
                </div>
              </div>
              <div className="tg-faq-item">
                <div className="tg-faq-question">
                  <span className="tg-faq-icon">+</span>
                  <span>What sets you apart from other contractors in the area?</span>
                </div>
                <div className="tg-faq-answer">
                  We distinguish ourselves through meticulous attention to detail, a dedication to quality, and a personalized approach. We prioritize client communication to seamlessly bring their vision to life.
                </div>
              </div>
              <div className="tg-faq-item">
                <div className="tg-faq-question">
                  <span className="tg-faq-icon">+</span>
                  <span>Is there a fee for a consultation or estimate/quote?</span>
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
          backgroundImage: imgs.hero 
            ? `url(${imgs.hero})`
            : `url(https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920)`
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
          <a href="#" className="tg-btn tg-btn-primary tg-btn-large">Get A Free Quote</a>
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
                <a href="#" className="tg-btn tg-btn-outline tg-btn-small">Contact</a>
                <a href="#" className="tg-btn tg-btn-primary tg-btn-small">Get Quote</a>
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
                {services.slice(0, 6).map((service, idx) => (
                  <a key={idx} href="#">{service}</a>
                ))}
              </div>
            </div>
            <div className="tg-footer-column">
              <h4>Service Areas</h4>
              <div className="tg-footer-links">
                {serviceAreas.slice(0, 6).map((area, idx) => (
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
            <a href="#" className="tg-btn tg-btn-primary tg-btn-small">Get Free Quote</a>
          </div>
        </div>
      </footer>

      {/* Chat Button */}
      <div className="tg-chat-btn">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/>
          <path d="M7 9h10v2H7zm0-3h10v2H7z"/>
        </svg>
      </div>
    </div>
  );
}

// ============================================
// STYLES - Matches KDP Plumbing / Mitchell Construction design
// ============================================
const templateGeneralStyles = (accentColor, primaryColor, textColor, accentTextColor) => `
  @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Roboto:wght@300;400;500;700&family=Playfair+Display:ital,wght@1,400;1,500&display=swap');
  
  .template-general {
    background: ${primaryColor};
    color: ${textColor};
    font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    line-height: 1.6;
    overflow-x: hidden;
  }
  
  .template-general * { box-sizing: border-box; }
  .template-general a { text-decoration: none; color: inherit; }
  .template-general img { max-width: 100%; height: auto; }
  
  /* ===== HEADER ===== */
  .tg-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: ${primaryColor};
    padding: 12px 0;
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }
  
  .tg-header-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .tg-logo { display: flex; align-items: center; }
  .tg-logo-img { height: 45px; object-fit: contain; }
  .tg-logo-text { 
    font-family: 'Oswald', sans-serif;
    font-size: 22px; 
    font-weight: 700; 
    color: ${textColor};
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  .tg-nav { display: flex; align-items: center; gap: 30px; }
  .tg-nav-link { 
    font-size: 12px; 
    font-weight: 500; 
    text-transform: uppercase; 
    letter-spacing: 1px; 
    color: ${textColor}; 
    cursor: pointer; 
    transition: color 0.3s;
    background: none;
    border: none;
    padding: 0;
  }
  .tg-nav-link:hover { color: ${accentColor}; }
  
  .tg-nav-dropdown { position: relative; }
  .tg-dropdown-menu { 
    position: absolute; 
    top: 100%; 
    left: 0; 
    background: ${primaryColor}; 
    border: 1px solid rgba(255,255,255,0.1); 
    border-radius: 4px; 
    min-width: 220px; 
    padding: 10px 0; 
    opacity: 0; 
    visibility: hidden; 
    transform: translateY(10px); 
    transition: all 0.3s;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  }
  .tg-nav-dropdown:hover .tg-dropdown-menu { opacity: 1; visibility: visible; transform: translateY(5px); }
  .tg-dropdown-menu a { 
    display: block; 
    padding: 10px 20px; 
    font-size: 13px; 
    text-transform: none; 
    color: ${accentTextColor};
    transition: all 0.2s;
  }
  .tg-dropdown-menu a:hover { color: ${textColor}; background: rgba(255,255,255,0.05); padding-left: 25px; }
  
  .tg-header-buttons { display: flex; align-items: center; gap: 12px; }
  
  /* ===== BUTTONS ===== */
  .tg-btn { 
    padding: 12px 24px; 
    border-radius: 4px; 
    font-size: 12px; 
    font-weight: 600; 
    text-transform: uppercase; 
    letter-spacing: 1px; 
    cursor: pointer; 
    transition: all 0.3s; 
    border: 2px solid transparent; 
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .tg-btn-primary { background: ${accentColor}; color: ${textColor}; border-color: ${accentColor}; }
  .tg-btn-primary:hover { background: transparent; color: ${accentColor}; }
  .tg-btn-outline { background: transparent; color: ${textColor}; border-color: ${textColor}; }
  .tg-btn-outline:hover { background: ${textColor}; color: ${primaryColor}; }
  .tg-btn-small { padding: 8px 16px; font-size: 11px; }
  .tg-btn-large { padding: 16px 32px; font-size: 14px; }
  .tg-phone-btn { border-color: ${accentColor}; color: ${accentColor}; }
  .tg-phone-btn:hover { background: ${accentColor}; color: ${textColor}; }
  
  /* ===== HERO ===== */
  .tg-hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    padding: 120px 40px 80px;
    position: relative;
    background-size: cover;
    background-position: center;
  }
  
  .tg-hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to right,
      ${primaryColor}f5 0%,
      ${primaryColor}e8 35%,
      ${primaryColor}99 60%,
      ${primaryColor}66 100%
    );
  }
  
  .tg-hero-container {
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 60px;
    align-items: center;
    position: relative;
    z-index: 1;
  }
  
  .tg-hero-content { max-width: 600px; }
  
  .tg-hero-title {
    font-family: 'Oswald', sans-serif;
    font-size: 56px;
    font-weight: 700;
    line-height: 1.1;
    text-transform: uppercase;
    margin-bottom: 20px;
    color: ${textColor};
  }
  
  .tg-hero-text {
    font-size: 16px;
    color: ${accentTextColor};
    line-height: 1.7;
    max-width: 500px;
  }
  
  /* ===== QUOTE FORM ===== */
  .tg-quote-form {
    background: #ffffff;
    border-radius: 8px;
    padding: 30px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  }
  
  .tg-form-header {
    text-align: center;
    margin-bottom: 25px;
  }
  
  .tg-form-header h3 {
    font-family: 'Oswald', sans-serif;
    font-size: 24px;
    font-weight: 700;
    color: #1a1a1a;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  .tg-form-group { margin-bottom: 16px; }
  .tg-form-group label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 6px;
    color: #333;
  }
  
  .tg-form-group input,
  .tg-form-group textarea {
    width: 100%;
    padding: 14px 16px;
    background: #f5f5f5;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    font-size: 14px;
    font-family: inherit;
    color: #333;
    transition: border-color 0.3s, box-shadow 0.3s;
  }
  
  .tg-form-group input:focus,
  .tg-form-group textarea:focus {
    outline: none;
    border-color: ${accentColor};
    box-shadow: 0 0 0 3px ${accentColor}20;
  }
  
  .tg-form-group input::placeholder,
  .tg-form-group textarea::placeholder { color: #999; }
  .tg-form-group textarea { min-height: 100px; resize: vertical; }
  
  .tg-phone-input {
    display: flex;
    align-items: stretch;
    background: #f5f5f5;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    overflow: hidden;
  }
  
  .tg-phone-prefix {
    padding: 14px 12px;
    background: #eee;
    border-right: 1px solid #e0e0e0;
    font-size: 14px;
    color: #666;
    display: flex;
    align-items: center;
  }
  
  .tg-phone-input input {
    border: none;
    background: transparent;
    flex: 1;
  }
  
  .tg-form-checkbox {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 12px;
    color: #666;
    margin-bottom: 20px;
    line-height: 1.5;
  }
  .tg-form-checkbox input { margin-top: 2px; }
  .tg-form-checkbox a { color: ${accentColor}; text-decoration: underline; }
  
  .tg-form-submit {
    width: 100%;
    padding: 16px;
    background: ${accentColor};
    border: none;
    border-radius: 4px;
    color: #fff;
    font-size: 16px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
    cursor: pointer;
    transition: background 0.3s, transform 0.2s;
  }
  .tg-form-submit:hover { background: ${accentColor}dd; transform: translateY(-2px); }
  
  /* ===== TRUST BADGES ===== */
  .tg-trust-badges {
    background: ${primaryColor};
    padding: 25px 40px;
    border-top: 1px solid rgba(255,255,255,0.1);
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }
  
  .tg-badges-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
  }
  
  .tg-badge {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    font-weight: 500;
    color: ${accentTextColor};
  }
  
  .tg-badge-icon { color: ${accentColor}; font-size: 10px; }
  
  /* ===== SECTION TITLES ===== */
  .tg-section-label {
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: ${accentTextColor};
    margin-bottom: 10px;
  }
  
  .tg-section-title-lined {
    font-family: 'Oswald', sans-serif;
    font-size: 36px;
    font-weight: 700;
    text-transform: uppercase;
    color: ${textColor};
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 30px;
  }
  
  .tg-section-title-lined::after {
    content: '';
    flex: 1;
    height: 3px;
    background: ${accentColor};
    max-width: 200px;
  }
  
  .tg-section-title-white { color: ${textColor}; }
  
  /* ===== ABOUT ===== */
  .tg-about {
    padding: 100px 40px;
    background: #f8f8f8;
  }
  
  .tg-about-container {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
  }
  
  .tg-about-content .tg-section-title-lined { color: #1a1a1a; }
  .tg-about-content .tg-section-title-lined::after { background: ${accentColor}; }
  
  .tg-about-text {
    font-size: 15px;
    color: #555;
    line-height: 1.8;
    margin-bottom: 30px;
  }
  
  .tg-social-icons {
    display: flex;
    gap: 15px;
  }
  
  .tg-social-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s;
  }
  
  .tg-social-icon:hover { transform: scale(1.1); }
  .tg-social-instagram { background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888); color: #fff; }
  .tg-social-facebook { background: #1877f2; color: #fff; }
  
  .tg-about-image img {
    width: 100%;
    border-radius: 8px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
  }
  
  /* ===== SERVICES ===== */
  .tg-services {
    padding: 100px 40px;
    background: ${primaryColor};
  }
  
  .tg-services-container { max-width: 1200px; margin: 0 auto; }
  
  .tg-services-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-top: 40px;
  }
  
  .tg-service-card {
    position: relative;
    aspect-ratio: 1.2;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
  }
  
  .tg-service-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s;
  }
  
  .tg-service-card:hover img { transform: scale(1.1); }
  
  .tg-service-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to top,
      rgba(0,0,0,0.8) 0%,
      rgba(0,0,0,0.4) 40%,
      rgba(0,0,0,0.1) 100%
    );
  }
  
  .tg-service-label {
    position: absolute;
    bottom: 15px;
    left: 15px;
    right: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }
  
  .tg-service-name {
    font-family: 'Oswald', sans-serif;
    font-size: 14px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: ${textColor};
  }
  
  .tg-service-arrow {
    width: 24px;
    height: 24px;
    background: ${accentColor};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: ${textColor};
    flex-shrink: 0;
  }
  
  /* ===== PROCESS ===== */
  .tg-process {
    padding: 100px 40px;
    background: ${primaryColor};
  }
  
  .tg-process-container { max-width: 1100px; margin: 0 auto; }
  
  .tg-process-subtitle {
    font-size: 15px;
    color: ${accentTextColor};
    margin-top: -20px;
    margin-bottom: 60px;
  }
  
  .tg-process-steps {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    position: relative;
  }
  
  .tg-process-line {
    position: absolute;
    top: 40px;
    left: 60px;
    right: 60px;
    height: 2px;
    background: repeating-linear-gradient(
      to right,
      rgba(255,255,255,0.3) 0px,
      rgba(255,255,255,0.3) 8px,
      transparent 8px,
      transparent 16px
    );
  }
  
  .tg-process-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    position: relative;
    z-index: 1;
    flex: 1;
    max-width: 120px;
  }
  
  .tg-step-icon {
    width: 80px;
    height: 80px;
    background: #ffffff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.2);
    color: #333;
  }
  
  .tg-step-icon svg { width: 32px; height: 32px; }
  
  .tg-step-label {
    font-size: 13px;
    font-weight: 500;
    color: ${accentTextColor};
    line-height: 1.4;
  }
  
  /* ===== WORK GALLERY ===== */
  .tg-work {
    padding: 100px 40px;
    background: ${primaryColor};
  }
  
  .tg-work-container { max-width: 1200px; margin: 0 auto; }
  
  .tg-work-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 40px;
  }
  
  .tg-work-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 15px;
  }
  
  .tg-work-item {
    position: relative;
    aspect-ratio: 1;
    border-radius: 8px;
    overflow: hidden;
  }
  
  .tg-work-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s;
  }
  
  .tg-work-item:hover img { transform: scale(1.1); }
  
  /* ===== REVIEWS ===== */
  .tg-reviews {
    padding: 140px 40px;
    position: relative;
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
  }
  
  .tg-reviews::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.6);
  }
  
  .tg-wave-top,
  .tg-wave-bottom {
    position: absolute;
    left: 0;
    width: 100%;
    overflow: hidden;
    line-height: 0;
    z-index: 2;
  }
  
  .tg-wave-top { top: 0; }
  .tg-wave-bottom { bottom: 0; transform: rotate(180deg); }
  
  .tg-wave-top svg,
  .tg-wave-bottom svg {
    position: relative;
    display: block;
    width: calc(100% + 1.3px);
    height: 80px;
  }
  
  .tg-shape-fill { fill: ${primaryColor}; }
  
  .tg-reviews-container {
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }
  
  .tg-reviews-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 40px;
  }
  
  .tg-section-label-box {
    background: ${primaryColor};
    display: inline-block;
    padding: 10px 20px;
    margin-bottom: 15px;
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: ${accentTextColor};
  }
  
  .tg-reviews-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 40px;
  }
  
  .tg-review-card {
    background: #ffffff;
    border-radius: 8px;
    padding: 25px;
    color: #333;
  }
  
  .tg-review-rating {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
  }
  
  .tg-review-number { font-weight: 700; font-size: 16px; color: #333; }
  .tg-review-stars { color: ${accentColor}; font-size: 16px; letter-spacing: 2px; }
  
  .tg-review-text {
    font-size: 14px;
    color: #555;
    line-height: 1.7;
    margin-bottom: 20px;
  }
  
  .tg-review-author {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 15px;
    border-top: 1px solid #eee;
  }
  
  .tg-review-author span { font-size: 13px; color: #888; font-weight: 500; }
  
  .tg-review-cta {
    text-align: center;
    padding: 50px 60px;
    background: ${primaryColor};
    border: 2px solid rgba(255,255,255,0.2);
    border-radius: 8px;
    max-width: 450px;
    margin: 0 auto;
  }
  
  .tg-review-cta h3 {
    font-family: 'Oswald', sans-serif;
    font-size: 28px;
    font-weight: 700;
    text-transform: uppercase;
    margin-bottom: 15px;
    color: ${textColor};
  }
  
  .tg-review-cta-stars {
    color: ${accentColor};
    font-size: 28px;
    margin-bottom: 25px;
    letter-spacing: 4px;
  }
  
  /* ===== FAQ ===== */
  .tg-faq {
    padding: 100px 40px;
    background: #f8f8f8;
  }
  
  .tg-faq-container {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: start;
  }
  
  .tg-faq-title {
    font-family: 'Playfair Display', serif;
    font-size: 38px;
    font-style: italic;
    font-weight: 400;
    margin-bottom: 40px;
    color: #1a1a1a;
  }
  
  .tg-faq-item {
    border-bottom: 1px solid #ddd;
    padding: 20px 0;
  }
  
  .tg-faq-question {
    display: flex;
    align-items: center;
    gap: 15px;
    cursor: pointer;
    font-size: 15px;
    font-weight: 500;
    color: #333;
    transition: color 0.3s;
  }
  
  .tg-faq-question:hover { color: ${accentColor}; }
  
  .tg-faq-icon {
    width: 24px;
    height: 24px;
    border: 2px solid ${accentColor};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 700;
    color: ${accentColor};
    flex-shrink: 0;
  }
  
  .tg-faq-answer {
    padding: 20px 0 0 40px;
    font-size: 14px;
    color: #666;
    line-height: 1.8;
    display: none;
  }
  
  .tg-faq-item.active .tg-faq-answer { display: block; }
  .tg-faq-item.active .tg-faq-icon { background: ${accentColor}; color: #fff; }
  
  .tg-faq-image img {
    width: 100%;
    border-radius: 8px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
  }
  
  /* ===== SERVICE AREAS ===== */
  .tg-service-areas {
    padding: 100px 40px;
    background: ${primaryColor};
  }
  
  .tg-areas-container {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: 60px;
    align-items: start;
  }
  
  .tg-map-container {
    border-radius: 8px;
    overflow: hidden;
    height: 350px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  }
  
  .tg-map-container iframe { width: 100%; height: 100%; border: 0; }
  
  .tg-areas-title {
    font-family: 'Oswald', sans-serif;
    font-size: 32px;
    font-weight: 700;
    text-transform: uppercase;
    margin-bottom: 30px;
    color: ${textColor};
  }
  
  .tg-areas-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  
  .tg-area-item {
    font-size: 15px;
    color: ${accentTextColor};
    padding: 8px 0;
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }
  
  /* ===== CTA ===== */
  .tg-cta {
    padding: 160px 40px;
    text-align: center;
    position: relative;
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
  }
  
  .tg-cta::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.5);
  }
  
  .tg-cta-container {
    max-width: 800px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }
  
  .tg-cta h2,
  .tg-cta h3 {
    font-family: 'Oswald', sans-serif;
    font-size: 48px;
    font-weight: 700;
    text-transform: uppercase;
    font-style: italic;
    color: ${textColor};
    line-height: 1.2;
  }
  
  .tg-cta h2 { margin-bottom: 5px; }
  .tg-cta h3 { margin-bottom: 35px; }
  
  /* ===== FOOTER ===== */
  .tg-footer {
    background: ${primaryColor};
    padding: 80px 40px 40px;
    border-top: 1px solid rgba(255,255,255,0.1);
  }
  
  .tg-footer-container { max-width: 1200px; margin: 0 auto; }
  
  .tg-footer-top {
    display: grid;
    grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr;
    gap: 40px;
    padding-bottom: 50px;
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }
  
  .tg-footer-brand img { height: 50px; margin-bottom: 20px; }
  .tg-footer-brand span {
    font-family: 'Oswald', sans-serif;
    font-size: 24px;
    font-weight: 700;
    color: ${textColor};
    display: block;
    margin-bottom: 20px;
  }
  
  .tg-footer-contact { margin-bottom: 25px; }
  .tg-footer-contact a,
  .tg-footer-address {
    display: block;
    color: ${accentTextColor};
    font-size: 14px;
    margin-bottom: 8px;
    transition: color 0.3s;
  }
  .tg-footer-contact a:hover { color: ${accentColor}; }
  
  .tg-footer-buttons { display: flex; gap: 10px; }
  
  .tg-footer-column h4 {
    font-family: 'Oswald', sans-serif;
    font-size: 14px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 25px;
    color: ${textColor};
  }
  
  .tg-footer-links a {
    display: block;
    color: ${accentTextColor};
    font-size: 14px;
    margin-bottom: 12px;
    transition: color 0.3s;
  }
  .tg-footer-links a:hover { color: ${accentColor}; }
  
  .tg-footer-hours p {
    color: ${accentTextColor};
    font-size: 13px;
    margin-bottom: 8px;
  }
  
  .tg-footer-bottom {
    padding-top: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .tg-footer-legal a {
    color: ${accentTextColor};
    font-size: 13px;
    margin-right: 30px;
    transition: color 0.3s;
  }
  .tg-footer-legal a:hover { color: ${accentColor}; }
  
  /* ===== CHAT BUTTON ===== */
  .tg-chat-btn {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 56px;
    height: 56px;
    background: ${accentColor};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 8px 30px ${accentColor}66;
    z-index: 999;
    transition: transform 0.3s, box-shadow 0.3s;
    color: ${textColor};
  }
  
  .tg-chat-btn:hover {
    transform: scale(1.1);
    box-shadow: 0 12px 40px ${accentColor}88;
  }
  
  .tg-chat-btn svg { width: 26px; height: 26px; }
  
  /* ===== RESPONSIVE ===== */
  @media (max-width: 1200px) {
    .tg-hero-container { grid-template-columns: 1fr; gap: 50px; }
    .tg-quote-form { max-width: 450px; }
    .tg-about-container,
    .tg-faq-container,
    .tg-areas-container { grid-template-columns: 1fr; }
    .tg-services-grid { grid-template-columns: repeat(2, 1fr); }
    .tg-work-grid { grid-template-columns: repeat(3, 1fr); }
    .tg-reviews-grid { grid-template-columns: repeat(2, 1fr); }
    .tg-footer-top { grid-template-columns: repeat(3, 1fr); }
  }
  
  @media (max-width: 768px) {
    .tg-header-container { padding: 0 20px; }
    .tg-nav { display: none; }
    .tg-hero { padding: 100px 20px 60px; }
    .tg-hero-title { font-size: 36px; }
    .tg-services-grid,
    .tg-work-grid { grid-template-columns: repeat(2, 1fr); }
    .tg-reviews-grid { grid-template-columns: 1fr; }
    .tg-process-steps { flex-wrap: wrap; gap: 30px; justify-content: center; }
    .tg-process-line { display: none; }
    .tg-footer-top { grid-template-columns: 1fr; }
    .tg-badges-container { justify-content: center; }
    .tg-cta h2,
    .tg-cta h3 { font-size: 32px; }
    .tg-section-title-lined { font-size: 28px; }
  }
  
  @media (max-width: 480px) {
    .tg-services-grid { grid-template-columns: 1fr; }
    .tg-work-grid { grid-template-columns: repeat(2, 1fr); }
    .tg-header-buttons .tg-phone-btn { display: none; }
  }
`;

export default TemplateGeneral;