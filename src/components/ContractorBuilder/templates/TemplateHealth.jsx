import React from 'react';

/**
 * TemplateHealth - Universal Health & Medical Business Template
 * Features a dark, professional design that adapts to any health/medical niche
 * Works for: Dentists, Chiropractors, Med Spas, Physical Therapy, Dermatology, etc.
 */

// Smart image matching system - maps keywords to relevant health/medical images
const serviceImageMap = {
  // Dental
  'dental': 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600',
  'dentist': 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600',
  'teeth': 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600',
  'tooth': 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600',
  'cleaning': 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600',
  'whitening': 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600',
  'braces': 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600',
  'orthodon': 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600',
  'implant': 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600',
  'crown': 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600',
  'filling': 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600',
  'root canal': 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600',
  'veneer': 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600',
  'oral': 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600',
  
  // Chiropractic / Physical Therapy
  'chiropract': 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600',
  'spine': 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600',
  'spinal': 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600',
  'adjust': 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600',
  'back pain': 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600',
  'neck pain': 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600',
  'physical therapy': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600',
  'physiotherapy': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600',
  'rehab': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600',
  'mobility': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600',
  'sports medicine': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600',
  'injury': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600',
  
  // Med Spa / Aesthetics
  'med spa': 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600',
  'medspa': 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600',
  'botox': 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600',
  'filler': 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600',
  'injection': 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600',
  'laser': 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600',
  'facial': 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600',
  'skin': 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600',
  'anti-aging': 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600',
  'rejuven': 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600',
  'microneedling': 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600',
  'chemical peel': 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600',
  'hydrafacial': 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600',
  'coolsculpt': 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600',
  'body contour': 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600',
  
  // Dermatology
  'dermatolog': 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600',
  'acne': 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600',
  'eczema': 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600',
  'psoriasis': 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600',
  'mole': 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600',
  'rash': 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600',
  
  // Eye Care
  'eye': 'https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?w=600',
  'vision': 'https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?w=600',
  'optical': 'https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?w=600',
  'optometr': 'https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?w=600',
  'glasses': 'https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?w=600',
  'contact': 'https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?w=600',
  'lasik': 'https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?w=600',
  'cataract': 'https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?w=600',
  
  // Massage / Wellness
  'massage': 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600',
  'wellness': 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600',
  'relaxation': 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600',
  'therapeutic': 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600',
  'deep tissue': 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600',
  'swedish': 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600',
  'hot stone': 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600',
  'aromatherapy': 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600',
  
  // Mental Health
  'therapy': 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=600',
  'counseling': 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=600',
  'mental health': 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=600',
  'anxiety': 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=600',
  'depression': 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=600',
  'psychiatr': 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=600',
  'psycholog': 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=600',
  
  // Primary Care / General
  'primary care': 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600',
  'family medicine': 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600',
  'checkup': 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600',
  'check-up': 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600',
  'physical': 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600',
  'annual': 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600',
  'preventive': 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600',
  'vaccination': 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600',
  'vaccine': 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600',
  'immunization': 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600',
  
  // Pediatrics
  'pediatric': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600',
  'child': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600',
  'kids': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600',
  'infant': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600',
  'baby': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600',
  
  // Women's Health
  'obgyn': 'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=600',
  'ob-gyn': 'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=600',
  'gynecolog': 'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=600',
  'obstetric': 'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=600',
  'pregnan': 'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=600',
  'prenatal': 'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=600',
  'women': 'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=600',
  'fertility': 'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=600',
  
  // Cardiology
  'cardio': 'https://images.unsplash.com/photo-1628348070889-cb656235b4eb?w=600',
  'heart': 'https://images.unsplash.com/photo-1628348070889-cb656235b4eb?w=600',
  'blood pressure': 'https://images.unsplash.com/photo-1628348070889-cb656235b4eb?w=600',
  'ekg': 'https://images.unsplash.com/photo-1628348070889-cb656235b4eb?w=600',
  'ecg': 'https://images.unsplash.com/photo-1628348070889-cb656235b4eb?w=600',
  
  // Orthopedics
  'orthopedic': 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600',
  'joint': 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600',
  'knee': 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600',
  'hip': 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600',
  'shoulder': 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600',
  'bone': 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600',
  'fracture': 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600',
  
  // Urgent Care
  'urgent care': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600',
  'walk-in': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600',
  'emergency': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600',
  'x-ray': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600',
  'xray': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600',
  
  // Nutrition / Weight Loss
  'nutrition': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600',
  'diet': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600',
  'weight loss': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600',
  'weight management': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600',
  'dietitian': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600',
  
  // Acupuncture / Alternative
  'acupuncture': 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600',
  'holistic': 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600',
  'alternative': 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600',
  'natural': 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600',
  'integrative': 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600',
  
  // Lab / Testing
  'lab': 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600',
  'blood test': 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600',
  'diagnostic': 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600',
  'screening': 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600',
  'test': 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600',
  
  // Hair Restoration
  'hair': 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600',
  'hair loss': 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600',
  'hair restoration': 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600',
  'prp': 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600',
  
  // General/Misc
  'consultation': 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=600',
  'exam': 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=600',
  'treatment': 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=600',
  'procedure': 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=600',
  'care': 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=600',
  'health': 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=600',
  'medical': 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=600',
};

// Default fallback images for when no keyword matches
const defaultServiceImages = [
  'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600',
  'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=600',
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600',
  'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600',
  'https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?w=600',
  'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600',
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600',
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

function TemplateHealth({ formData, images }) {
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
    <div className="template-health">
      <style>{templateHealthStyles(accentColor, primaryColor)}</style>
      
      {/* Header */}
      <header className="th-header">
        <div className="th-header-container">
          <a href="#" className="th-logo">
            {imgs.logo ? (
              <img src={imgs.logo} alt="Logo" className="th-logo-img" />
            ) : (
              <span className="th-logo-text">{data.companyName || 'Practice Name'}</span>
            )}
          </a>
          <nav className="th-nav">
            <a href="#" className="th-nav-link">Home</a>
            <div className="th-nav-dropdown">
              <span className="th-nav-link">Services ▼</span>
              <div className="th-dropdown-menu">
                {services.slice(0, 8).map((service, idx) => (
                  <a key={idx} href="#">{service}</a>
                ))}
              </div>
            </div>
            <a href="#" className="th-nav-link">About</a>
            <a href="#" className="th-nav-link">Patient Info</a>
            <a href="#" className="th-nav-link">Contact</a>
          </nav>
          <div className="th-header-buttons">
            <a href="#" className="th-btn th-btn-primary">Book Appointment</a>
            <a href={`tel:${data.phone || '(555) 123-4567'}`} className="th-btn th-btn-outline th-phone-btn">
              {data.phone || '(555) 123-4567'}
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        className="th-hero"
        style={{
          background: imgs.hero 
            ? `linear-gradient(135deg, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.7) 50%, rgba(10,10,10,0.4) 100%), url(${imgs.hero}) center/cover`
            : `linear-gradient(135deg, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.7) 50%, rgba(10,10,10,0.4) 100%), url(https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1920) center/cover`
        }}
      >
        <div className="th-hero-overlay"></div>
        <div className="th-hero-container">
          <div className="th-hero-content">
            <h1 className="th-hero-title">
              {data.headline || `${data.companyName || 'Quality Healthcare'} You Can Trust`}
            </h1>
            <p className="th-hero-text">
              {data.tagline || `${data.companyName || 'Our Practice'} provides compassionate, personalized care to patients of all ages. Your health and wellness are our top priority.`}
            </p>
          </div>
          <div className="th-quote-form">
            <div className="th-form-header">
              {imgs.logo && (
                <div className="th-form-logo">
                  <img src={imgs.logo} alt="Logo" />
                </div>
              )}
              <h3>Request An Appointment</h3>
            </div>
            <form>
              <div className="th-form-group">
                <label>Full Name *</label>
                <input type="text" placeholder="John Smith" />
              </div>
              <div className="th-form-group">
                <label>Phone</label>
                <div className="th-phone-field">
                  <div className="th-flag">+1</div>
                  <input type="tel" placeholder="(555) 555-1234" />
                </div>
              </div>
              <div className="th-form-group">
                <label>How can we help you? *</label>
                <textarea placeholder="Tell us about your health concerns or the service you're interested in..."></textarea>
              </div>
              <div className="th-form-checkbox">
                <input type="checkbox" id="terms" />
                <label htmlFor="terms">I agree to terms and conditions provided by the practice.</label>
              </div>
              <button type="submit" className="th-form-submit">Request Appointment</button>
            </form>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="th-trust-badges">
        <div className="th-badges-container">
          <div className="th-badge"><span className="th-badge-icon">🏥</span> Board Certified</div>
          <div className="th-badge"><span className="th-badge-icon">🕐</span> {data.yearsExperience || '10'}+ Years Experience</div>
          <div className="th-badge"><span className="th-badge-icon">🛡️</span> Most Insurance Accepted</div>
          <div className="th-badge"><span className="th-badge-icon">✓</span> Same-Day Appointments</div>
          <div className="th-badge"><span className="th-badge-icon">⭐</span> 5-Star Patient Reviews</div>
        </div>
      </section>

      {/* About Section */}
      <section className="th-about">
        <div className="th-about-container">
          <div className="th-about-content">
            <h2 className="th-section-title">About Our Practice</h2>
            <p className="th-about-text">
              {data.aboutText || `${data.companyName || 'Our Practice'} has been proudly serving the community with exceptional healthcare since ${2025 - (parseInt(data.yearsExperience) || 10)}. Our team of dedicated professionals is committed to providing personalized, compassionate care in a comfortable environment. We believe in treating every patient like family and taking the time to understand your unique health needs.`}
            </p>
            <div className="th-google-badge">
              <svg viewBox="0 0 24 24" width="30" height="30">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </div>
          </div>
          <div className="th-about-image">
            {imgs.about ? (
              <img src={imgs.about} alt="About Us" />
            ) : imgs.hero ? (
              <img src={imgs.hero} alt="About Us" />
            ) : (
              <img src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600" alt="About Us" />
            )}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="th-services">
        <div className="th-services-container">
          <p className="th-section-label">Comprehensive Care For Your Health</p>
          <h2 className="th-section-title">Our Services</h2>
          <div className="th-services-grid">
            {services.map((service, idx) => (
              <a key={idx} href="#" className="th-service-card">
                <img src={getServiceImage(service, idx)} alt={service} />
                <div className="th-service-card-label">
                  <h3>{service}</h3>
                  <span className="th-service-arrow">→</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="th-process">
        <div className="th-process-container">
          <h2 className="th-section-title">Your Visit</h2>
          <p className="th-process-subtitle">We make your healthcare experience simple and stress-free</p>
          <div className="th-process-steps">
            <div className="th-process-step">
              <div className="th-step-icon">
                <svg viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/></svg>
              </div>
              <h4>Book Online</h4>
            </div>
            <div className="th-process-step">
              <div className="th-step-icon">
                <svg viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
              </div>
              <h4>Complete Forms</h4>
            </div>
            <div className="th-process-step">
              <div className="th-step-icon">
                <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
              </div>
              <h4>Meet Your Provider</h4>
            </div>
            <div className="th-process-step">
              <div className="th-step-icon">
                <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
              </div>
              <h4>Receive Care Plan</h4>
            </div>
            <div className="th-process-step">
              <div className="th-step-icon">
                <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
              </div>
              <h4>Follow Up</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Work Gallery */}
      {imgs.gallery && imgs.gallery.length > 0 && (
        <section className="th-work">
          <div className="th-work-container">
            <div className="th-work-header">
              <div>
                <p className="th-section-label">See Our Practice</p>
                <h2 className="th-section-title">Our Facility</h2>
              </div>
              <a href="#" className="th-btn th-btn-outline">See All Photos</a>
            </div>
            <div className="th-work-grid">
              {imgs.gallery.map((img, idx) => (
                <div key={idx} className="th-work-item">
                  <img src={img} alt={`Facility ${idx + 1}`} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reviews Section */}
      <section 
        className="th-reviews"
        style={{
          background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1920) center/cover fixed`
        }}
      >
        <div className="th-wave-top">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="th-shape-fill"></path>
          </svg>
        </div>
        <div className="th-wave-bottom">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="th-shape-fill"></path>
          </svg>
        </div>
        <div className="th-reviews-container">
          <div className="th-reviews-header">
            <div>
              <p className="th-section-label th-section-label-dark">Discover What Our Patients Have To Say About Us</p>
              <h2 className="th-section-title">Patient Reviews</h2>
            </div>
            <a href="#" className="th-btn th-btn-outline">Book Now</a>
          </div>
          <div className="th-reviews-grid">
            {[
              { name: 'Michael R.', text: 'The entire staff is wonderful and caring. They take time to listen and explain everything thoroughly. Best healthcare experience I\'ve ever had!' },
              { name: 'Sarah T.', text: 'I highly recommend this practice! They are professional, compassionate, and truly care about their patients. The facility is modern and clean.' },
              { name: 'James P.', text: 'Finally found a healthcare provider who listens! They answered all my questions and made me feel comfortable throughout my visit.' },
              { name: 'Emily K.', text: 'Scheduling was easy, wait times were minimal, and the care I received was exceptional. This is what healthcare should be like!' }
            ].map((review, idx) => (
              <div key={idx} className="th-review-card">
                <div className="th-review-rating">
                  <span className="th-review-number">5</span>
                  <span className="th-review-stars">★★★★★</span>
                </div>
                <p className="th-review-text">{review.text}</p>
                <div className="th-review-author">
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
          <div className="th-review-cta">
            <h3>Review Us On Google</h3>
            <div className="th-review-cta-stars">★★★★★</div>
            <a href="#" className="th-btn th-btn-primary">Leave Us A Review</a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="th-faq">
        <div className="th-faq-container">
          <div className="th-faq-content">
            <h2 className="th-faq-title">Frequently Asked Questions</h2>
            <div className="th-faq-list">
              <div className="th-faq-item">
                <div className="th-faq-question">
                  <span className="th-faq-icon">▼</span>
                  Do you accept my insurance?
                </div>
                <div className="th-faq-answer">
                  We accept most major insurance plans. Please contact our office to verify your specific coverage, or bring your insurance card to your appointment and we'll be happy to check for you.
                </div>
              </div>
              <div className="th-faq-item">
                <div className="th-faq-question">
                  <span className="th-faq-icon">▼</span>
                  How do I schedule an appointment?
                </div>
                <div className="th-faq-answer">
                  You can schedule an appointment by calling our office, using our online booking form, or through our patient portal. We offer same-day appointments for urgent needs.
                </div>
              </div>
              <div className="th-faq-item">
                <div className="th-faq-question">
                  <span className="th-faq-icon">▼</span>
                  Are new patients accepted?
                </div>
                <div className="th-faq-answer">
                  Yes! We are always welcoming new patients. Please arrive 15 minutes early for your first appointment to complete the necessary paperwork, or fill out our forms online beforehand.
                </div>
              </div>
            </div>
          </div>
          <div className="th-faq-image">
            {imgs.about ? (
              <img src={imgs.about} alt="FAQ" />
            ) : (
              <img src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600" alt="FAQ" />
            )}
          </div>
        </div>
      </section>

      {/* Service Areas Section */}
      {serviceAreas.length > 0 && (
        <section className="th-service-areas">
          <div className="th-areas-container">
            <div className="th-map-container">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.30596073366!2d-74.25986548248684!3d40.69714941932609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1234567890" 
                allowFullScreen="" 
                loading="lazy"
                title="Service Area Map"
              ></iframe>
            </div>
            <div className="th-areas-content">
              <h2 className="th-areas-title">Proudly Serving These Areas</h2>
              <div className="th-areas-list">
                {serviceAreas.map((area, idx) => (
                  <div key={idx} className="th-area-item">{area}</div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section 
        className="th-cta"
        style={{
          background: imgs.hero 
            ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${imgs.hero}) center/cover`
            : `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1920) center/cover`
        }}
      >
        <div className="th-wave-top">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="th-shape-fill"></path>
          </svg>
        </div>
        <div className="th-wave-bottom">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="th-shape-fill"></path>
          </svg>
        </div>
        <div className="th-cta-container">
          <h2>Ready To Prioritize Your Health?</h2>
          <h3>Book Your Appointment Today!</h3>
          <a href="#" className="th-btn th-btn-primary">Schedule Now</a>
        </div>
      </section>

      {/* Footer */}
      <footer className="th-footer">
        <div className="th-footer-container">
          <div className="th-footer-top">
            <div className="th-footer-brand-section">
              <div className="th-footer-brand">
                {imgs.logo ? (
                  <img src={imgs.logo} alt="Logo" />
                ) : (
                  <span>{data.companyName || 'Practice Name'}</span>
                )}
              </div>
              <div className="th-footer-contact">
                <a href={`mailto:${data.email || 'info@practice.com'}`}>{data.email || 'info@practice.com'}</a>
                <a href={`tel:${data.phone || '(555) 123-4567'}`}>{data.phone || '(555) 123-4567'}</a>
                {data.address && <span className="th-footer-address">{data.address}</span>}
              </div>
              <div className="th-footer-buttons">
                <a href="#" className="th-btn th-btn-outline">Contact</a>
                <a href="#" className="th-btn th-btn-primary">Book Now</a>
              </div>
            </div>
            <div className="th-footer-column">
              <h4>Quick Links</h4>
              <div className="th-footer-links">
                <a href="#">Home</a>
                <a href="#">About Us</a>
                <a href="#">Patient Forms</a>
                <a href="#">Contact</a>
                <a href="#">Review Us</a>
              </div>
            </div>
            <div className="th-footer-column">
              <h4>Our Services</h4>
              <div className="th-footer-links">
                {services.slice(0, 8).map((service, idx) => (
                  <a key={idx} href="#">{service}</a>
                ))}
              </div>
            </div>
            <div className="th-footer-column">
              <h4>Service Areas</h4>
              <div className="th-footer-links">
                {serviceAreas.slice(0, 8).map((area, idx) => (
                  <a key={idx} href="#">{area}</a>
                ))}
              </div>
            </div>
            <div className="th-footer-column">
              <h4>Office Hours</h4>
              <div className="th-footer-hours">
                <p>Mon: 8:00AM - 5:00PM</p>
                <p>Tue: 8:00AM - 5:00PM</p>
                <p>Wed: 8:00AM - 5:00PM</p>
                <p>Thu: 8:00AM - 5:00PM</p>
                <p>Fri: 8:00AM - 4:00PM</p>
                <p>Sat: By Appointment</p>
                <p>Sun: Closed</p>
              </div>
            </div>
          </div>
          <div className="th-footer-bottom">
            <div className="th-footer-legal">
              <a href="#">Terms & Conditions</a>
              <a href="#">Privacy Policy</a>
              <a href="#">HIPAA Notice</a>
            </div>
            <a href="#" className="th-btn th-btn-primary">Book Appointment</a>
          </div>
        </div>
      </footer>

      {/* Chat Button */}
      <div className="th-chat-btn">
        <svg viewBox="0 0 24 24"><path d="M12 3c5.5 0 10 3.58 10 8s-4.5 8-10 8c-1.24 0-2.43-.18-3.53-.5C5.55 21 2 21 2 21c2.33-2.33 2.7-3.9 2.75-4.5C3.05 15.07 2 13.13 2 11c0-4.42 4.5-8 10-8z"/></svg>
      </div>
    </div>
  );
}

// Dynamic styles function that uses accent and primary colors
const templateHealthStyles = (accentColor, primaryColor) => `
  .template-health {
    background: #0a0a0a;
    color: #ffffff;
    font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    line-height: 1.6;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0,0,0,0.12);
    min-height: calc(100vh - 48px);
  }
  .template-health a { text-decoration: none; color: inherit; }
  .th-header { position: sticky; top: 0; left: 0; right: 0; z-index: 1000; background: rgba(10, 10, 10, 0.95); backdrop-filter: blur(10px); padding: 10px 0; }
  .th-header-container { max-width: 1400px; margin: 0 auto; padding: 0 40px; display: flex; justify-content: space-between; align-items: center; }
  .th-logo { display: flex; align-items: center; gap: 10px; }
  .th-logo-img { height: 50px; object-fit: contain; }
  .th-logo-text { font-size: 20px; font-weight: 700; }
  .th-nav { display: flex; align-items: center; gap: 25px; }
  .th-nav-link { font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; color: #ffffff; cursor: pointer; transition: color 0.3s; background: none; border: none; }
  .th-nav-link:hover { color: ${accentColor}; }
  .th-nav-dropdown { position: relative; }
  .th-dropdown-menu { position: absolute; top: 100%; left: 0; background: #111111; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; min-width: 200px; padding: 10px 0; opacity: 0; visibility: hidden; transform: translateY(10px); transition: all 0.3s; }
  .th-nav-dropdown:hover .th-dropdown-menu { opacity: 1; visibility: visible; transform: translateY(5px); }
  .th-dropdown-menu a { display: block; padding: 8px 20px; font-size: 13px; text-transform: none; color: #888888; }
  .th-dropdown-menu a:hover { color: ${accentColor}; background: ${accentColor}15; }
  .th-header-buttons { display: flex; align-items: center; gap: 15px; }
  .th-btn { padding: 10px 20px; border-radius: 4px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; cursor: pointer; transition: all 0.3s; border: 2px solid transparent; display: inline-block; }
  .th-btn-primary { background: ${accentColor}; color: #ffffff; border-color: ${accentColor}; }
  .th-btn-primary:hover { background: ${accentColor}dd; border-color: ${accentColor}dd; }
  .th-btn-outline { background: transparent; color: ${accentColor}; border-color: ${accentColor}; }
  .th-btn-outline:hover { background: ${accentColor}; color: #ffffff; }
  .th-phone-btn { font-size: 12px; padding: 8px 15px; }
  .th-hero { min-height: 100vh; display: flex; align-items: center; padding: 100px 40px 60px; position: relative; }
  .th-hero-overlay { position: absolute; top: 0; right: 0; bottom: 0; width: 60%; background: linear-gradient(135deg, transparent 0%, ${accentColor}30 50%, ${accentColor}50 100%); clip-path: polygon(30% 0, 100% 0, 100% 100%, 0% 100%); }
  .th-hero-container { max-width: 1400px; margin: 0 auto; width: 100%; display: grid; grid-template-columns: 1fr 400px; gap: 80px; align-items: center; position: relative; z-index: 1; }
  .th-hero-title { font-family: 'Oswald', sans-serif; font-size: 52px; font-weight: 700; line-height: 1.1; text-transform: uppercase; margin-bottom: 20px; }
  .th-hero-text { font-size: 15px; color: #cccccc; max-width: 400px; line-height: 1.7; }
  .th-quote-form { background: #ffffff; border-radius: 8px; padding: 30px; color: #333; }
  .th-form-header { text-align: center; margin-bottom: 25px; }
  .th-form-logo { width: 60px; height: 60px; margin: 0 auto 15px; }
  .th-form-logo img { width: 100%; height: 100%; object-fit: contain; }
  .th-form-header h3 { font-family: 'Oswald', sans-serif; font-size: 22px; font-weight: 700; color: #1a1a1a; text-transform: uppercase; }
  .th-form-group { margin-bottom: 15px; }
  .th-form-group label { display: block; font-size: 12px; font-weight: 600; margin-bottom: 6px; color: #333; }
  .th-form-group input, .th-form-group textarea { width: 100%; padding: 12px 15px; background: #f5f5f5; border: 1px solid #e0e0e0; border-radius: 4px; font-size: 14px; font-family: inherit; color: #333; box-sizing: border-box; }
  .th-form-group input::placeholder, .th-form-group textarea::placeholder { color: #999; }
  .th-form-group textarea { min-height: 80px; resize: vertical; }
  .th-phone-field { display: flex; align-items: center; background: #f5f5f5; border: 1px solid #e0e0e0; border-radius: 4px; overflow: hidden; }
  .th-flag { padding: 12px; display: flex; align-items: center; gap: 5px; font-size: 14px; border-right: 1px solid #e0e0e0; }
  .th-phone-field input { border: none; background: transparent; }
  .th-form-checkbox { display: flex; align-items: flex-start; gap: 10px; font-size: 11px; color: #666; margin-bottom: 20px; line-height: 1.5; }
  .th-form-checkbox input { margin-top: 3px; }
  .th-form-submit { width: 100%; padding: 14px; background: ${accentColor}; border: none; border-radius: 4px; color: #ffffff; font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; cursor: pointer; transition: background 0.3s; }
  .th-form-submit:hover { background: ${accentColor}dd; }
  .th-trust-badges { background: #0a0a0a; padding: 20px 40px; border-top: 1px solid rgba(255,255,255,0.1); border-bottom: 1px solid rgba(255,255,255,0.1); }
  .th-badges-container { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; }
  .th-badge { display: flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; color: #cccccc; }
  .th-badge-icon { color: ${accentColor}; }
  .th-about { padding: 80px 40px; background: #0a0a0a; }
  .th-about-container { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
  .th-section-title { font-family: 'Oswald', sans-serif; font-size: 32px; font-weight: 700; text-transform: uppercase; margin-bottom: 20px; display: flex; align-items: center; gap: 15px; }
  .th-section-title::after { content: ''; flex: 1; height: 3px; background: ${accentColor}; max-width: 100px; }
  .th-about-text { font-size: 14px; color: #888888; line-height: 1.8; }
  .th-google-badge { margin-top: 30px; display: inline-block; }
  .th-about-image img { width: 100%; max-width: 500px; border-radius: 8px; }
  .th-services { padding: 80px 40px; background: #0a0a0a; }
  .th-services-container { max-width: 1200px; margin: 0 auto; }
  .th-section-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; color: #888888; margin-bottom: 10px; }
  .th-services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-top: 40px; }
  .th-service-card { position: relative; aspect-ratio: 1.1; border-radius: 8px; overflow: hidden; cursor: pointer; }
  .th-service-card img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
  .th-service-card:hover img { transform: scale(1.1); }
  .th-service-card::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 40%, transparent 70%); }
  .th-service-card-label { position: absolute; bottom: 15px; left: 15px; z-index: 1; display: flex; align-items: center; gap: 8px; }
  .th-service-card-label h3 { font-family: 'Oswald', sans-serif; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
  .th-service-arrow { width: 18px; height: 18px; background: ${accentColor}; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; }
  .th-process { padding: 80px 40px; background: #0a0a0a; }
  .th-process-container { max-width: 1200px; margin: 0 auto; }
  .th-process-subtitle { font-size: 14px; color: #888888; margin-top: 10px; }
  .th-process-steps { display: flex; justify-content: space-between; align-items: flex-start; margin-top: 60px; position: relative; }
  .th-process-steps::before { content: ''; position: absolute; top: 40px; left: 80px; right: 80px; height: 2px; background: rgba(255,255,255,0.1); }
  .th-process-step { display: flex; flex-direction: column; align-items: center; text-align: center; position: relative; z-index: 1; flex: 1; }
  .th-step-icon { width: 80px; height: 80px; background: #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; box-shadow: 0 5px 20px rgba(0,0,0,0.3); }
  .th-step-icon svg { width: 35px; height: 35px; fill: #333; }
  .th-process-step h4 { font-size: 13px; font-weight: 500; color: #cccccc; max-width: 90px; line-height: 1.4; }
  .th-work { padding: 80px 40px; background: #0a0a0a; }
  .th-work-container { max-width: 1200px; margin: 0 auto; }
  .th-work-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
  .th-work-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; }
  .th-work-item { position: relative; aspect-ratio: 1; border-radius: 8px; overflow: hidden; }
  .th-work-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
  .th-work-item:hover img { transform: scale(1.1); }
  .th-reviews { padding: 120px 40px; position: relative; }
  .th-wave-top, .th-wave-bottom { position: absolute; left: 0; width: 100%; overflow: hidden; line-height: 0; }
  .th-wave-top { top: 0; }
  .th-wave-bottom { bottom: 0; transform: rotate(180deg); }
  .th-wave-top svg, .th-wave-bottom svg { position: relative; display: block; width: calc(100% + 1.3px); height: 80px; }
  .th-shape-fill { fill: #0a0a0a; }
  .th-reviews-container { max-width: 1200px; margin: 0 auto; position: relative; z-index: 1; }
  .th-reviews-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
  .th-section-label-dark { background: #0a0a0a; display: inline-block; padding: 8px 15px; margin-bottom: 10px; }
  .th-reviews-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px; }
  .th-review-card { background: #ffffff; border-radius: 8px; padding: 20px; color: #333; }
  .th-review-rating { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
  .th-review-number { font-weight: 700; font-size: 14px; }
  .th-review-stars { color: ${accentColor}; font-size: 14px; }
  .th-review-text { font-size: 13px; color: #555; line-height: 1.6; margin-bottom: 15px; }
  .th-review-author { display: flex; justify-content: space-between; align-items: center; }
  .th-review-author span { font-size: 12px; color: #888; }
  .th-review-cta { text-align: center; padding: 50px 60px; background: #111111; border: 2px solid rgba(255,255,255,0.2); border-radius: 8px; max-width: 500px; margin: 40px auto 0; }
  .th-review-cta h3 { font-family: 'Oswald', sans-serif; font-size: 26px; font-weight: 700; text-transform: uppercase; margin-bottom: 15px; }
  .th-review-cta-stars { color: ${accentColor}; font-size: 26px; margin-bottom: 25px; }
  .th-faq { padding: 80px 40px; background: #0a0a0a; }
  .th-faq-container { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: start; }
  .th-faq-title { font-family: 'Playfair Display', serif; font-size: 34px; font-style: italic; font-weight: 400; margin-bottom: 30px; }
  .th-faq-item { border-bottom: 1px solid rgba(255,255,255,0.1); padding: 18px 0; }
  .th-faq-question { display: flex; align-items: center; gap: 12px; cursor: pointer; font-size: 14px; font-weight: 500; transition: color 0.3s; }
  .th-faq-question:hover { color: ${accentColor}; }
  .th-faq-icon { color: #888888; font-size: 10px; transition: transform 0.3s; }
  .th-faq-answer { padding: 15px 0 0 25px; font-size: 13px; color: #888888; line-height: 1.7; display: none; }
  .th-faq-item.active .th-faq-answer { display: block; }
  .th-faq-image img { width: 100%; border-radius: 8px; }
  .th-service-areas { padding: 80px 40px; background: #0a0a0a; }
  .th-areas-container { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1.5fr; gap: 60px; align-items: start; }
  .th-map-container { border-radius: 8px; overflow: hidden; height: 300px; }
  .th-map-container iframe { width: 100%; height: 100%; border: 0; }
  .th-areas-title { font-family: 'Oswald', sans-serif; font-size: 32px; font-weight: 700; text-transform: uppercase; margin-bottom: 30px; display: flex; align-items: center; gap: 15px; }
  .th-areas-title::after { content: ''; flex: 1; height: 3px; background: ${accentColor}; max-width: 150px; }
  .th-areas-list { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .th-area-item { font-size: 14px; color: #888888; }
  .th-cta { padding: 120px 40px; text-align: center; position: relative; }
  .th-cta-container { max-width: 800px; margin: 0 auto; position: relative; z-index: 1; }
  .th-cta h2, .th-cta h3 { font-family: 'Oswald', sans-serif; font-size: 42px; font-weight: 700; text-transform: uppercase; font-style: italic; }
  .th-cta h2 { margin-bottom: 5px; }
  .th-cta h3 { margin-bottom: 30px; }
  .th-footer { background: #0f0f0f; padding: 60px 40px 30px; }
  .th-footer-container { max-width: 1200px; margin: 0 auto; }
  .th-footer-top { display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr; gap: 40px; padding-bottom: 40px; border-bottom: 1px solid rgba(255,255,255,0.1); }
  .th-footer-brand img { height: 50px; margin-bottom: 20px; }
  .th-footer-contact { margin-bottom: 20px; }
  .th-footer-contact a, .th-footer-address { display: block; color: #888888; font-size: 14px; margin-bottom: 5px; transition: color 0.3s; }
  .th-footer-contact a:hover { color: ${accentColor}; }
  .th-footer-buttons { display: flex; gap: 10px; }
  .th-footer-buttons .th-btn { padding: 8px 15px; font-size: 10px; }
  .th-footer-column h4 { font-family: 'Oswald', sans-serif; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; }
  .th-footer-links a { display: block; color: #888888; font-size: 13px; margin-bottom: 8px; transition: color 0.3s; }
  .th-footer-links a:hover { color: ${accentColor}; }
  .th-footer-hours p { color: #888888; font-size: 12px; margin-bottom: 5px; }
  .th-footer-bottom { padding-top: 30px; display: flex; justify-content: space-between; align-items: center; }
  .th-footer-legal a { color: #888888; font-size: 13px; margin-right: 30px; transition: color 0.3s; }
  .th-footer-legal a:hover { color: ${accentColor}; }
  .th-chat-btn { position: fixed; bottom: 30px; right: 30px; width: 50px; height: 50px; background: ${accentColor}; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 5px 20px ${accentColor}66; z-index: 999; transition: transform 0.3s; }
  .th-chat-btn:hover { transform: scale(1.1); }
  .th-chat-btn svg { width: 24px; height: 24px; fill: #ffffff; }
  @media (max-width: 1200px) {
    .th-hero-container { grid-template-columns: 1fr; gap: 40px; }
    .th-quote-form { max-width: 450px; }
    .th-about-container, .th-faq-container, .th-areas-container { grid-template-columns: 1fr; }
    .th-services-grid { grid-template-columns: repeat(2, 1fr); }
    .th-work-grid { grid-template-columns: repeat(3, 1fr); }
    .th-reviews-grid { grid-template-columns: repeat(2, 1fr); }
    .th-footer-top { grid-template-columns: repeat(3, 1fr); }
  }
  @media (max-width: 768px) {
    .th-nav { display: none; }
    .th-hero-title { font-size: 36px; }
    .th-services-grid, .th-work-grid { grid-template-columns: repeat(2, 1fr); }
    .th-reviews-grid { grid-template-columns: 1fr; }
    .th-process-steps { flex-direction: column; gap: 30px; align-items: center; }
    .th-process-steps::before { display: none; }
    .th-footer-top { grid-template-columns: 1fr; }
    .th-badges-container { justify-content: center; }
  }
`;

export default TemplateHealth;