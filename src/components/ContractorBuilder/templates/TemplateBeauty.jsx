import React from 'react';
import {
  beautyServiceImageMap,
  beautyDefaultServiceImages,
  getServiceImage as getServiceImageHelper
} from '/serviceImages.js';

/**
 * TemplateBeauty - Beauty & Salon Website Template
 * Features a modern, elegant design perfect for beauty services
 * UPDATED: Now supports textColor and accentTextColor from formData
 */

// Local wrapper for the shared getServiceImage helper
const getServiceImage = (serviceName, index) => 
  getServiceImageHelper(serviceName, index, beautyServiceImageMap, beautyDefaultServiceImages);

function TemplateBeauty({ formData, images }) {
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
    <div className="template-beauty">
      <style>{templateBeautyStyles(accentColor, primaryColor, textColor, accentTextColor)}</style>
      
      {/* Header */}
      <header className="tb-header">
        <div className="tb-header-container">
          <a href="#" className="tb-logo">
            {imgs.logo ? (
              <img src={imgs.logo} alt="Logo" className="tb-logo-img" />
            ) : (
              <span className="tb-logo-text">{data.companyName || 'Salon Name'}</span>
            )}
          </a>
          <nav className="tb-nav">
            <a href="#" className="tb-nav-link">Home</a>
            <div className="tb-nav-dropdown">
              <span className="tb-nav-link">Services ▼</span>
              <div className="tb-dropdown-menu">
                {services.slice(0, 8).map((service, idx) => (
                  <a key={idx} href="#">{service}</a>
                ))}
              </div>
            </div>
            <a href="#" className="tb-nav-link">Gallery</a>
            <a href="#" className="tb-nav-link">About</a>
            <a href="#" className="tb-nav-link">Contact</a>
          </nav>
          <div className="tb-header-buttons">
            <a href="#" className="tb-btn tb-btn-primary">Book Now</a>
            <a href={`tel:${data.phone || '(555) 123-4567'}`} className="tb-btn tb-btn-outline tb-phone-btn">
              {data.phone || '(555) 123-4567'}
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        className="tb-hero"
        style={{
          background: imgs.hero 
            ? `linear-gradient(135deg, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.7) 50%, rgba(10,10,10,0.4) 100%), url(${imgs.hero}) center/cover`
            : `linear-gradient(135deg, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.7) 50%, rgba(10,10,10,0.4) 100%), url(https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920) center/cover`
        }}
      >
        <div className="tb-hero-overlay"></div>
        <div className="tb-hero-container">
          <div className="tb-hero-content">
            <h1 className="tb-hero-title">
              {data.headline || `${data.companyName || 'Where Beauty'} Meets Excellence`}
            </h1>
            <p className="tb-hero-text">
              {data.tagline || `${data.companyName || 'Our Studio'} provides exceptional beauty services in a relaxing atmosphere. Let our talented team help you look and feel your absolute best.`}
            </p>
          </div>
          <div className="tb-quote-form">
            <div className="tb-form-header">
              {imgs.logo && (
                <div className="tb-form-logo">
                  <img src={imgs.logo} alt="Logo" />
                </div>
              )}
              <h3>Book Your Appointment</h3>
            </div>
            <form>
              <div className="tb-form-group">
                <label>Full Name *</label>
                <input type="text" placeholder="Jane Smith" />
              </div>
              <div className="tb-form-group">
                <label>Phone</label>
                <div className="tb-phone-field">
                  <div className="tb-flag">+1</div>
                  <input type="tel" placeholder="(555) 555-1234" />
                </div>
              </div>
              <div className="tb-form-group">
                <label>What service are you interested in? *</label>
                <textarea placeholder="Tell us what you're looking for..."></textarea>
              </div>
              <div className="tb-form-checkbox">
                <input type="checkbox" id="terms" />
                <label htmlFor="terms">I agree to terms and conditions provided by the business.</label>
              </div>
              <button type="submit" className="tb-form-submit">Request Appointment</button>
            </form>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="tb-trust-badges">
        <div className="tb-badges-container">
          <div className="tb-badge"><span className="tb-badge-icon">✨</span> Licensed Professionals</div>
          <div className="tb-badge"><span className="tb-badge-icon">🕐</span> {data.yearsExperience || '10'}+ Years Experience</div>
          <div className="tb-badge"><span className="tb-badge-icon">💎</span> Premium Products</div>
          <div className="tb-badge"><span className="tb-badge-icon">✓</span> Satisfaction Guaranteed</div>
          <div className="tb-badge"><span className="tb-badge-icon">⭐</span> 5-Star Rated</div>
        </div>
      </section>

      {/* About Section */}
      <section className="tb-about">
        <div className="tb-about-container">
          <div className="tb-about-content">
            <h2 className="tb-section-title">About Us</h2>
            <p className="tb-about-text">
              {data.aboutText || `${data.companyName || 'Our Studio'} has been helping clients look and feel their best since ${2025 - (parseInt(data.yearsExperience) || 10)}. Our team of talented, licensed professionals is passionate about their craft and dedicated to providing exceptional service in a warm, welcoming environment. We use only premium products and stay current with the latest trends and techniques to ensure you always leave feeling beautiful.`}
            </p>
            <div className="tb-google-badge">
              <svg viewBox="0 0 24 24" width="30" height="30">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </div>
          </div>
          <div className="tb-about-image">
            {imgs.about ? (
              <img src={imgs.about} alt="About Us" />
            ) : imgs.hero ? (
              <img src={imgs.hero} alt="About Us" />
            ) : (
              <img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600" alt="About Us" />
            )}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="tb-services">
        <div className="tb-services-container">
          <p className="tb-section-label">Treatments Tailored For You</p>
          <h2 className="tb-section-title">Our Services</h2>
          <div className="tb-services-grid">
            {services.map((service, idx) => (
              <a key={idx} href="#" className="tb-service-card">
                <img src={getServiceImage(service, idx)} alt={service} />
                <div className="tb-service-card-label">
                  <h3>{service}</h3>
                  <span className="tb-service-arrow">→</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="tb-process">
        <div className="tb-process-container">
          <h2 className="tb-section-title">Your Experience</h2>
          <p className="tb-process-subtitle">We make your visit relaxing and enjoyable from start to finish</p>
          <div className="tb-process-steps">
            <div className="tb-process-step">
              <div className="tb-step-icon">
                <svg viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/></svg>
              </div>
              <h4>Book Online</h4>
            </div>
            <div className="tb-process-step">
              <div className="tb-step-icon">
                <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
              </div>
              <h4>Consultation</h4>
            </div>
            <div className="tb-process-step">
              <div className="tb-step-icon">
                <svg viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
              </div>
              <h4>Your Service</h4>
            </div>
            <div className="tb-process-step">
              <div className="tb-step-icon">
                <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              </div>
              <h4>Look Amazing</h4>
            </div>
            <div className="tb-process-step">
              <div className="tb-step-icon">
                <svg viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>
              </div>
              <h4>Book Again</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Work Gallery */}
      {imgs.gallery && imgs.gallery.length > 0 && (
        <section className="tb-work">
          <div className="tb-work-container">
            <div className="tb-work-header">
              <div>
                <p className="tb-section-label">See Our Transformations</p>
                <h2 className="tb-section-title">Our Work</h2>
              </div>
              <a href="#" className="tb-btn tb-btn-outline">See All Photos</a>
            </div>
            <div className="tb-work-grid">
              {imgs.gallery.map((img, idx) => (
                <div key={idx} className="tb-work-item">
                  <img src={img} alt={`Work ${idx + 1}`} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reviews Section */}
      <section 
        className="tb-reviews"
        style={{
          background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920) center/cover fixed`
        }}
      >
        <div className="tb-wave-top">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="tb-shape-fill"></path>
          </svg>
        </div>
        <div className="tb-wave-bottom">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="tb-shape-fill"></path>
          </svg>
        </div>
        <div className="tb-reviews-container">
          <div className="tb-reviews-header">
            <div>
              <p className="tb-section-label tb-section-label-dark">Discover What Our Clients Have To Say About Us</p>
              <h2 className="tb-section-title">Client Reviews</h2>
            </div>
            <a href="#" className="tb-btn tb-btn-outline">Book Now</a>
          </div>
          <div className="tb-reviews-grid">
            {[
              { name: 'Jessica M.', text: 'Absolutely love this place! The stylists are so talented and really listen to what you want. I always leave feeling beautiful!' },
              { name: 'Amanda R.', text: 'Best salon experience I\'ve ever had! The atmosphere is so relaxing and the staff is incredibly friendly and professional.' },
              { name: 'Michelle K.', text: 'I\'ve been coming here for years and wouldn\'t trust anyone else with my hair. They always exceed my expectations!' },
              { name: 'Taylor S.', text: 'Finally found my go-to spot! The attention to detail and quality of service is unmatched. Highly recommend!' }
            ].map((review, idx) => (
              <div key={idx} className="tb-review-card">
                <div className="tb-review-rating">
                  <span className="tb-review-number">5</span>
                  <span className="tb-review-stars">★★★★★</span>
                </div>
                <p className="tb-review-text">{review.text}</p>
                <div className="tb-review-author">
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
          <div className="tb-review-cta">
            <h3>Review Us On Google</h3>
            <div className="tb-review-cta-stars">★★★★★</div>
            <a href="#" className="tb-btn tb-btn-primary">Leave Us A Review</a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="tb-faq">
        <div className="tb-faq-container">
          <div className="tb-faq-content">
            <h2 className="tb-faq-title">Frequently Asked Questions</h2>
            <div className="tb-faq-list">
              <div className="tb-faq-item">
                <div className="tb-faq-question">
                  <span className="tb-faq-icon">▼</span>
                  How do I book an appointment?
                </div>
                <div className="tb-faq-answer">
                  You can book an appointment by calling us, using our online booking form, or through our social media pages. We recommend booking in advance, especially for weekend appointments.
                </div>
              </div>
              <div className="tb-faq-item">
                <div className="tb-faq-question">
                  <span className="tb-faq-icon">▼</span>
                  What is your cancellation policy?
                </div>
                <div className="tb-faq-answer">
                  We kindly ask for at least 24 hours notice for cancellations or rescheduling. This allows us to offer the appointment slot to other clients who may be waiting.
                </div>
              </div>
              <div className="tb-faq-item">
                <div className="tb-faq-question">
                  <span className="tb-faq-icon">▼</span>
                  Do you offer consultations?
                </div>
                <div className="tb-faq-answer">
                  Yes! We offer complimentary consultations for new clients and for any major services. This helps us understand your goals and recommend the best options for you.
                </div>
              </div>
            </div>
          </div>
          <div className="tb-faq-image">
            {imgs.about ? (
              <img src={imgs.about} alt="FAQ" />
            ) : (
              <img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600" alt="FAQ" />
            )}
          </div>
        </div>
      </section>

      {/* Service Areas Section */}
      {serviceAreas.length > 0 && (
        <section className="tb-service-areas">
          <div className="tb-areas-container">
            <div className="tb-map-container">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.30596073366!2d-74.25986548248684!3d40.69714941932609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1234567890" 
                allowFullScreen="" 
                loading="lazy"
                title="Location Map"
              ></iframe>
            </div>
            <div className="tb-areas-content">
              <h2 className="tb-areas-title">Proudly Serving These Areas</h2>
              <div className="tb-areas-list">
                {serviceAreas.map((area, idx) => (
                  <div key={idx} className="tb-area-item">{area}</div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section 
        className="tb-cta"
        style={{
          background: imgs.hero 
            ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${imgs.hero}) center/cover`
            : `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920) center/cover`
        }}
      >
        <div className="tb-wave-top">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="tb-shape-fill"></path>
          </svg>
        </div>
        <div className="tb-wave-bottom">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="tb-shape-fill"></path>
          </svg>
        </div>
        <div className="tb-cta-container">
          <h2>Ready To Look Your Best?</h2>
          <h3>Book Your Appointment Today!</h3>
          <a href="#" className="tb-btn tb-btn-primary">Book Now</a>
        </div>
      </section>

      {/* Footer */}
      <footer className="tb-footer">
        <div className="tb-footer-container">
          <div className="tb-footer-top">
            <div className="tb-footer-brand-section">
              <div className="tb-footer-brand">
                {imgs.logo ? (
                  <img src={imgs.logo} alt="Logo" />
                ) : (
                  <span>{data.companyName || 'Salon Name'}</span>
                )}
              </div>
              <div className="tb-footer-contact">
                <a href={`mailto:${data.email || 'hello@salon.com'}`}>{data.email || 'hello@salon.com'}</a>
                <a href={`tel:${data.phone || '(555) 123-4567'}`}>{data.phone || '(555) 123-4567'}</a>
                {data.address && <span className="tb-footer-address">{data.address}</span>}
              </div>
              <div className="tb-footer-buttons">
                <a href="#" className="tb-btn tb-btn-outline">Contact</a>
                <a href="#" className="tb-btn tb-btn-primary">Book Now</a>
              </div>
            </div>
            <div className="tb-footer-column">
              <h4>Quick Links</h4>
              <div className="tb-footer-links">
                <a href="#">Home</a>
                <a href="#">Gallery</a>
                <a href="#">About Us</a>
                <a href="#">Contact</a>
                <a href="#">Review Us</a>
              </div>
            </div>
            <div className="tb-footer-column">
              <h4>Our Services</h4>
              <div className="tb-footer-links">
                {services.slice(0, 8).map((service, idx) => (
                  <a key={idx} href="#">{service}</a>
                ))}
              </div>
            </div>
            <div className="tb-footer-column">
              <h4>Service Areas</h4>
              <div className="tb-footer-links">
                {serviceAreas.slice(0, 8).map((area, idx) => (
                  <a key={idx} href="#">{area}</a>
                ))}
              </div>
            </div>
            <div className="tb-footer-column">
              <h4>Hours</h4>
              <div className="tb-footer-hours">
                <p>Mon: Closed</p>
                <p>Tue: 9:00AM - 7:00PM</p>
                <p>Wed: 9:00AM - 7:00PM</p>
                <p>Thu: 9:00AM - 8:00PM</p>
                <p>Fri: 9:00AM - 8:00PM</p>
                <p>Sat: 9:00AM - 6:00PM</p>
                <p>Sun: 10:00AM - 5:00PM</p>
              </div>
            </div>
          </div>
          <div className="tb-footer-bottom">
            <div className="tb-footer-legal">
              <a href="#">Terms & Conditions</a>
              <a href="#">Privacy Policy</a>
            </div>
            <a href="#" className="tb-btn tb-btn-primary">Book Now</a>
          </div>
        </div>
      </footer>

      {/* Chat Button */}
      <div className="tb-chat-btn">
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
const templateBeautyStyles = (accentColor, primaryColor, textColor, accentTextColor) => `
  .template-beauty {
    background: ${primaryColor};
    color: ${textColor};
    font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    line-height: 1.6;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0,0,0,0.12);
    min-height: calc(100vh - 48px);
  }
  .template-beauty a { text-decoration: none; color: inherit; }
  .tb-header { position: sticky; top: 0; left: 0; right: 0; z-index: 1000; background: ${primaryColor}f2; backdrop-filter: blur(10px); padding: 10px 0; }
  .tb-header-container { max-width: 1400px; margin: 0 auto; padding: 0 40px; display: flex; justify-content: space-between; align-items: center; }
  .tb-logo { display: flex; align-items: center; gap: 10px; }
  .tb-logo-img { height: 50px; object-fit: contain; }
  .tb-logo-text { font-size: 20px; font-weight: 700; color: ${textColor}; }
  .tb-nav { display: flex; align-items: center; gap: 25px; }
  .tb-nav-link { font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; color: ${textColor}; cursor: pointer; transition: color 0.3s; background: none; border: none; }
  .tb-nav-link:hover { color: ${accentColor}; }
  .tb-nav-dropdown { position: relative; }
  .tb-dropdown-menu { position: absolute; top: 100%; left: 0; background: ${primaryColor}; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; min-width: 200px; padding: 10px 0; opacity: 0; visibility: hidden; transform: translateY(10px); transition: all 0.3s; }
  .tb-nav-dropdown:hover .tb-dropdown-menu { opacity: 1; visibility: visible; transform: translateY(5px); }
  .tb-dropdown-menu a { display: block; padding: 8px 20px; font-size: 13px; text-transform: none; color: ${accentTextColor}; }
  .tb-dropdown-menu a:hover { color: ${accentColor}; background: ${accentColor}15; }
  .tb-header-buttons { display: flex; align-items: center; gap: 15px; }
  .tb-btn { padding: 10px 20px; border-radius: 4px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; cursor: pointer; transition: all 0.3s; border: 2px solid transparent; display: inline-block; }
  .tb-btn-primary { background: ${accentColor}; color: ${textColor}; border-color: ${accentColor}; }
  .tb-btn-primary:hover { background: ${accentColor}dd; border-color: ${accentColor}dd; }
  .tb-btn-outline { background: transparent; color: ${accentColor}; border-color: ${accentColor}; }
  .tb-btn-outline:hover { background: ${accentColor}; color: ${textColor}; }
  .tb-phone-btn { font-size: 12px; padding: 8px 15px; }
  .tb-hero { min-height: 100vh; display: flex; align-items: center; padding: 100px 40px 60px; position: relative; }
  .tb-hero-overlay { position: absolute; top: 0; right: 0; bottom: 0; width: 60%; background: linear-gradient(135deg, transparent 0%, ${accentColor}30 50%, ${accentColor}50 100%); clip-path: polygon(30% 0, 100% 0, 100% 100%, 0% 100%); }
  .tb-hero-container { max-width: 1400px; margin: 0 auto; width: 100%; display: grid; grid-template-columns: 1fr 400px; gap: 80px; align-items: center; position: relative; z-index: 1; }
  .tb-hero-title { font-family: 'Oswald', sans-serif; font-size: 52px; font-weight: 700; line-height: 1.1; text-transform: uppercase; margin-bottom: 20px; color: ${textColor}; }
  .tb-hero-text { font-size: 15px; color: ${accentTextColor}; max-width: 400px; line-height: 1.7; }
  .tb-quote-form { background: #ffffff; border-radius: 8px; padding: 30px; color: #333; }
  .tb-form-header { text-align: center; margin-bottom: 25px; }
  .tb-form-logo { width: 60px; height: 60px; margin: 0 auto 15px; }
  .tb-form-logo img { width: 100%; height: 100%; object-fit: contain; }
  .tb-form-header h3 { font-family: 'Oswald', sans-serif; font-size: 22px; font-weight: 700; color: #1a1a1a; text-transform: uppercase; }
  .tb-form-group { margin-bottom: 15px; }
  .tb-form-group label { display: block; font-size: 12px; font-weight: 600; margin-bottom: 6px; color: #333; }
  .tb-form-group input, .tb-form-group textarea { width: 100%; padding: 12px 15px; background: #f5f5f5; border: 1px solid #e0e0e0; border-radius: 4px; font-size: 14px; font-family: inherit; color: #333; box-sizing: border-box; }
  .tb-form-group input::placeholder, .tb-form-group textarea::placeholder { color: #999; }
  .tb-form-group textarea { min-height: 80px; resize: vertical; }
  .tb-phone-field { display: flex; align-items: center; background: #f5f5f5; border: 1px solid #e0e0e0; border-radius: 4px; overflow: hidden; }
  .tb-flag { padding: 12px; display: flex; align-items: center; gap: 5px; font-size: 14px; border-right: 1px solid #e0e0e0; }
  .tb-phone-field input { border: none; background: transparent; }
  .tb-form-checkbox { display: flex; align-items: flex-start; gap: 10px; font-size: 11px; color: #666; margin-bottom: 20px; line-height: 1.5; }
  .tb-form-checkbox input { margin-top: 3px; }
  .tb-form-submit { width: 100%; padding: 14px; background: ${accentColor}; border: none; border-radius: 4px; color: ${textColor}; font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; cursor: pointer; transition: background 0.3s; }
  .tb-form-submit:hover { background: ${accentColor}dd; }
  .tb-trust-badges { background: ${primaryColor}; padding: 20px 40px; border-top: 1px solid rgba(255,255,255,0.1); border-bottom: 1px solid rgba(255,255,255,0.1); }
  .tb-badges-container { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; }
  .tb-badge { display: flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; color: ${accentTextColor}; }
  .tb-badge-icon { color: ${accentColor}; }
  .tb-about { padding: 80px 40px; background: ${primaryColor}; }
  .tb-about-container { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
  .tb-section-title { font-family: 'Oswald', sans-serif; font-size: 32px; font-weight: 700; text-transform: uppercase; margin-bottom: 20px; display: flex; align-items: center; gap: 15px; color: ${textColor}; }
  .tb-section-title::after { content: ''; flex: 1; height: 3px; background: ${accentColor}; max-width: 100px; }
  .tb-about-text { font-size: 14px; color: ${accentTextColor}; line-height: 1.8; }
  .tb-google-badge { margin-top: 30px; display: inline-block; }
  .tb-about-image img { width: 100%; max-width: 500px; border-radius: 8px; }
  .tb-services { padding: 80px 40px; background: ${primaryColor}; }
  .tb-services-container { max-width: 1200px; margin: 0 auto; }
  .tb-section-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; color: ${accentTextColor}; margin-bottom: 10px; }
  .tb-services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-top: 40px; }
  .tb-service-card { position: relative; aspect-ratio: 1.1; border-radius: 8px; overflow: hidden; cursor: pointer; }
  .tb-service-card img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
  .tb-service-card:hover img { transform: scale(1.1); }
  .tb-service-card::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 40%, transparent 70%); }
  .tb-service-card-label { position: absolute; bottom: 15px; left: 15px; z-index: 1; display: flex; align-items: center; gap: 8px; }
  .tb-service-card-label h3 { font-family: 'Oswald', sans-serif; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: ${textColor}; }
  .tb-service-arrow { width: 18px; height: 18px; background: ${accentColor}; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; color: ${textColor}; }
  .tb-process { padding: 80px 40px; background: ${primaryColor}; }
  .tb-process-container { max-width: 1200px; margin: 0 auto; }
  .tb-process-subtitle { font-size: 14px; color: ${accentTextColor}; margin-top: 10px; }
  .tb-process-steps { display: flex; justify-content: space-between; align-items: flex-start; margin-top: 60px; position: relative; }
  .tb-process-steps::before { content: ''; position: absolute; top: 40px; left: 80px; right: 80px; height: 2px; background: rgba(255,255,255,0.1); }
  .tb-process-step { display: flex; flex-direction: column; align-items: center; text-align: center; position: relative; z-index: 1; flex: 1; }
  .tb-step-icon { width: 80px; height: 80px; background: #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; box-shadow: 0 5px 20px rgba(0,0,0,0.3); }
  .tb-step-icon svg { width: 35px; height: 35px; fill: #333; }
  .tb-process-step h4 { font-size: 13px; font-weight: 500; color: ${accentTextColor}; max-width: 90px; line-height: 1.4; }
  .tb-work { padding: 80px 40px; background: ${primaryColor}; }
  .tb-work-container { max-width: 1200px; margin: 0 auto; }
  .tb-work-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
  .tb-work-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; }
  .tb-work-item { position: relative; aspect-ratio: 1; border-radius: 8px; overflow: hidden; }
  .tb-work-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
  .tb-work-item:hover img { transform: scale(1.1); }
  .tb-reviews { padding: 120px 40px; position: relative; }
  .tb-wave-top, .tb-wave-bottom { position: absolute; left: 0; width: 100%; overflow: hidden; line-height: 0; }
  .tb-wave-top { top: 0; }
  .tb-wave-bottom { bottom: 0; transform: rotate(180deg); }
  .tb-wave-top svg, .tb-wave-bottom svg { position: relative; display: block; width: calc(100% + 1.3px); height: 80px; }
  .tb-shape-fill { fill: ${primaryColor}; }
  .tb-reviews-container { max-width: 1200px; margin: 0 auto; position: relative; z-index: 1; }
  .tb-reviews-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
  .tb-section-label-dark { background: ${primaryColor}; display: inline-block; padding: 8px 15px; margin-bottom: 10px; color: ${accentTextColor}; }
  .tb-reviews-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px; }
  .tb-review-card { background: #ffffff; border-radius: 8px; padding: 20px; color: #333; }
  .tb-review-rating { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
  .tb-review-number { font-weight: 700; font-size: 14px; }
  .tb-review-stars { color: ${accentColor}; font-size: 14px; }
  .tb-review-text { font-size: 13px; color: #555; line-height: 1.6; margin-bottom: 15px; }
  .tb-review-author { display: flex; justify-content: space-between; align-items: center; }
  .tb-review-author span { font-size: 12px; color: #888; }
  .tb-review-cta { text-align: center; padding: 50px 60px; background: ${primaryColor}; border: 2px solid rgba(255,255,255,0.2); border-radius: 8px; max-width: 500px; margin: 40px auto 0; }
  .tb-review-cta h3 { font-family: 'Oswald', sans-serif; font-size: 26px; font-weight: 700; text-transform: uppercase; margin-bottom: 15px; color: ${textColor}; }
  .tb-review-cta-stars { color: ${accentColor}; font-size: 26px; margin-bottom: 25px; }
  .tb-faq { padding: 80px 40px; background: ${primaryColor}; }
  .tb-faq-container { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: start; }
  .tb-faq-title { font-family: 'Playfair Display', serif; font-size: 34px; font-style: italic; font-weight: 400; margin-bottom: 30px; color: ${textColor}; }
  .tb-faq-item { border-bottom: 1px solid rgba(255,255,255,0.1); padding: 18px 0; }
  .tb-faq-question { display: flex; align-items: center; gap: 12px; cursor: pointer; font-size: 14px; font-weight: 500; transition: color 0.3s; color: ${textColor}; }
  .tb-faq-question:hover { color: ${accentColor}; }
  .tb-faq-icon { color: ${accentTextColor}; font-size: 10px; transition: transform 0.3s; }
  .tb-faq-answer { padding: 15px 0 0 25px; font-size: 13px; color: ${accentTextColor}; line-height: 1.7; display: none; }
  .tb-faq-item.active .tb-faq-answer { display: block; }
  .tb-faq-image img { width: 100%; border-radius: 8px; }
  .tb-service-areas { padding: 80px 40px; background: ${primaryColor}; }
  .tb-areas-container { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1.5fr; gap: 60px; align-items: start; }
  .tb-map-container { border-radius: 8px; overflow: hidden; height: 300px; }
  .tb-map-container iframe { width: 100%; height: 100%; border: 0; }
  .tb-areas-title { font-family: 'Oswald', sans-serif; font-size: 32px; font-weight: 700; text-transform: uppercase; margin-bottom: 30px; display: flex; align-items: center; gap: 15px; color: ${textColor}; }
  .tb-areas-title::after { content: ''; flex: 1; height: 3px; background: ${accentColor}; max-width: 150px; }
  .tb-areas-list { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .tb-area-item { font-size: 14px; color: ${accentTextColor}; }
  .tb-cta { padding: 120px 40px; text-align: center; position: relative; }
  .tb-cta-container { max-width: 800px; margin: 0 auto; position: relative; z-index: 1; }
  .tb-cta h2, .tb-cta h3 { font-family: 'Oswald', sans-serif; font-size: 42px; font-weight: 700; text-transform: uppercase; font-style: italic; color: ${textColor}; }
  .tb-cta h2 { margin-bottom: 5px; }
  .tb-cta h3 { margin-bottom: 30px; }
  .tb-footer { background: ${primaryColor}; padding: 60px 40px 30px; }
  .tb-footer-container { max-width: 1200px; margin: 0 auto; }
  .tb-footer-top { display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr; gap: 40px; padding-bottom: 40px; border-bottom: 1px solid rgba(255,255,255,0.1); }
  .tb-footer-brand img { height: 50px; margin-bottom: 20px; }
  .tb-footer-brand span { font-family: 'Oswald', sans-serif; font-size: 24px; font-weight: 700; color: ${textColor}; }
  .tb-footer-contact { margin-bottom: 20px; }
  .tb-footer-contact a, .tb-footer-address { display: block; color: ${accentTextColor}; font-size: 14px; margin-bottom: 5px; transition: color 0.3s; }
  .tb-footer-contact a:hover { color: ${accentColor}; }
  .tb-footer-buttons { display: flex; gap: 10px; }
  .tb-footer-buttons .tb-btn { padding: 8px 15px; font-size: 10px; }
  .tb-footer-column h4 { font-family: 'Oswald', sans-serif; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; color: ${textColor}; }
  .tb-footer-links a { display: block; color: ${accentTextColor}; font-size: 13px; margin-bottom: 8px; transition: color 0.3s; }
  .tb-footer-links a:hover { color: ${accentColor}; }
  .tb-footer-hours p { color: ${accentTextColor}; font-size: 12px; margin-bottom: 5px; }
  .tb-footer-bottom { padding-top: 30px; display: flex; justify-content: space-between; align-items: center; }
  .tb-footer-legal a { color: ${accentTextColor}; font-size: 13px; margin-right: 30px; transition: color 0.3s; }
  .tb-footer-legal a:hover { color: ${accentColor}; }
  .tb-chat-btn { position: fixed; bottom: 30px; right: 30px; width: 50px; height: 50px; background: ${accentColor}; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 5px 20px ${accentColor}66; z-index: 999; transition: transform 0.3s; }
  .tb-chat-btn:hover { transform: scale(1.1); }
  .tb-chat-btn svg { width: 24px; height: 24px; fill: ${textColor}; }
  @media (max-width: 1200px) {
    .tb-hero-container { grid-template-columns: 1fr; gap: 40px; }
    .tb-quote-form { max-width: 450px; }
    .tb-about-container, .tb-faq-container, .tb-areas-container { grid-template-columns: 1fr; }
    .tb-services-grid { grid-template-columns: repeat(2, 1fr); }
    .tb-work-grid { grid-template-columns: repeat(3, 1fr); }
    .tb-reviews-grid { grid-template-columns: repeat(2, 1fr); }
    .tb-footer-top { grid-template-columns: repeat(3, 1fr); }
  }
  @media (max-width: 768px) {
    .tb-nav { display: none; }
    .tb-hero-title { font-size: 36px; }
    .tb-services-grid, .tb-work-grid { grid-template-columns: repeat(2, 1fr); }
    .tb-reviews-grid { grid-template-columns: 1fr; }
    .tb-process-steps { flex-direction: column; gap: 30px; align-items: center; }
    .tb-process-steps::before { display: none; }
    .tb-footer-top { grid-template-columns: 1fr; }
    .tb-badges-container { justify-content: center; }
  }
`;