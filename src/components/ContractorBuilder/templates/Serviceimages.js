// =============================================================================
// SERVICE IMAGE MAPS
// Maps keywords to image URLs for automatic service image matching
// =============================================================================

import {
  // General/Contractor
  ELECTRICAL_MAIN,
  ELECTRICAL_WIRING,
  ELECTRICAL_OUTLET,
  ELECTRICAL_LIGHTING,
  ELECTRICAL_EV_CHARGER,
  ELECTRICAL_GENERATOR,
  PLUMBING_MAIN,
  PLUMBING_DRAIN,
  PLUMBING_WATER_HEATER,
  HVAC_MAIN,
  HVAC_HEATING,
  HVAC_THERMOSTAT,
  ROOFING_MAIN,
  ROOFING_GUTTER,
  LANDSCAPING_MAIN,
  LANDSCAPING_GARDEN,
  LANDSCAPING_TREE,
  LANDSCAPING_PATIO,
  KITCHEN_MAIN,
  BATHROOM_MAIN,
  FLOORING_MAIN,
  PAINTING_MAIN,
  PAINTING_DRYWALL,
  WINDOWS_MAIN,
  DOORS_MAIN,
  CONCRETE_MAIN,
  FENCING_MAIN,
  DECK_MAIN,
  POOL_MAIN,
  SOLAR_MAIN,
  INSULATION_MAIN,
  CONSTRUCTION_MAIN,
  HOME_MAIN,
  COMMERCIAL_MAIN,
  REPAIR_MAIN,
  ARCHITECT_MAIN,
  TOOLS_MAIN,
  
  // Beauty
  HAIR_MAIN,
  HAIR_COLOR,
  HAIR_TREATMENT,
  HAIR_BARBER,
  HAIR_EXTENSIONS,
  NAILS_MAIN,
  LASHES_MAIN,
  MAKEUP_MAIN,
  FACIAL_MAIN,
  SPA_BEAUTY_MAIN,
  WAXING_MAIN,
  TANNING_MAIN,
  BODY_TREATMENT_MAIN,
  PERMANENT_MAKEUP_MAIN,
  KIDS_BEAUTY_MAIN,
  
  // Health
  DENTAL_MAIN,
  CHIROPRACTIC_MAIN,
  PHYSICAL_THERAPY_MAIN,
  MEDSPA_MAIN,
  DERMATOLOGY_MAIN,
  EYE_CARE_MAIN,
  MASSAGE_WELLNESS_MAIN,
  MENTAL_HEALTH_MAIN,
  PRIMARY_CARE_MAIN,
  PEDIATRICS_MAIN,
  WOMENS_HEALTH_MAIN,
  CARDIOLOGY_MAIN,
  ORTHOPEDICS_MAIN,
  URGENT_CARE_MAIN,
  NUTRITION_MAIN,
  ACUPUNCTURE_MAIN,
  LAB_MAIN,
  HEALTH_GENERAL_MAIN,
  
  // Professional
  ACCOUNTING_MAIN,
  FINANCIAL_MAIN,
  INSURANCE_MAIN,
  REAL_ESTATE_MAIN,
  CONSULTING_MAIN,
  MARKETING_MAIN,
  IT_TECH_MAIN,
  WEB_DESIGN_MAIN,
  PHOTOGRAPHY_MAIN,
  HR_MAIN,
  ARCHITECTURE_MAIN,
  TRAINING_MAIN,
  WRITING_MAIN,
  PROFESSIONAL_GENERAL_MAIN,
} from './serviceImageUrls.js';


// =============================================================================
// GENERAL/CONTRACTOR SERVICE IMAGE MAP
// =============================================================================
export const generalServiceImageMap = {
  // Electrical
  'electrical': ELECTRICAL_MAIN,
  'electric': ELECTRICAL_MAIN,
  'wiring': ELECTRICAL_WIRING,
  'panel': ELECTRICAL_WIRING,
  'outlet': ELECTRICAL_OUTLET,
  'lighting': ELECTRICAL_LIGHTING,
  'light': ELECTRICAL_LIGHTING,
  'led': ELECTRICAL_LIGHTING,
  'ev charger': ELECTRICAL_EV_CHARGER,
  'charger': ELECTRICAL_EV_CHARGER,
  'generator': ELECTRICAL_GENERATOR,
  'surge': ELECTRICAL_WIRING,
  'smoke detector': ELECTRICAL_OUTLET,
  'ceiling fan': ELECTRICAL_LIGHTING,
  
  // Plumbing
  'plumbing': PLUMBING_MAIN,
  'plumber': PLUMBING_MAIN,
  'pipe': PLUMBING_MAIN,
  'drain': PLUMBING_DRAIN,
  'water heater': PLUMBING_WATER_HEATER,
  'faucet': PLUMBING_DRAIN,
  'toilet': PLUMBING_DRAIN,
  'sewer': PLUMBING_MAIN,
  'leak': PLUMBING_MAIN,
  'water': PLUMBING_WATER_HEATER,
  'garbage disposal': PLUMBING_DRAIN,
  'sump pump': PLUMBING_MAIN,
  
  // HVAC
  'hvac': HVAC_MAIN,
  'air conditioning': HVAC_MAIN,
  'ac ': HVAC_MAIN,
  'heating': HVAC_HEATING,
  'furnace': HVAC_HEATING,
  'duct': HVAC_MAIN,
  'ventilation': HVAC_MAIN,
  'thermostat': HVAC_THERMOSTAT,
  'heat pump': HVAC_HEATING,
  'boiler': HVAC_HEATING,
  
  // Roofing
  'roof': ROOFING_MAIN,
  'roofing': ROOFING_MAIN,
  'shingle': ROOFING_MAIN,
  'gutter': ROOFING_GUTTER,
  'siding': ELECTRICAL_WIRING,
  'chimney': ROOFING_MAIN,
  'skylight': ROOFING_MAIN,
  
  // Landscaping
  'landscap': LANDSCAPING_MAIN,
  'lawn': LANDSCAPING_MAIN,
  'garden': LANDSCAPING_GARDEN,
  'tree': LANDSCAPING_TREE,
  'shrub': LANDSCAPING_GARDEN,
  'irrigation': LANDSCAPING_MAIN,
  'sprinkler': LANDSCAPING_MAIN,
  'sod': LANDSCAPING_MAIN,
  'mulch': LANDSCAPING_GARDEN,
  'paver': LANDSCAPING_PATIO,
  'retaining wall': LANDSCAPING_PATIO,
  'outdoor': LANDSCAPING_MAIN,
  
  // Kitchen
  'kitchen': KITCHEN_MAIN,
  'cabinet': KITCHEN_MAIN,
  'countertop': KITCHEN_MAIN,
  'granite': KITCHEN_MAIN,
  'quartz': KITCHEN_MAIN,
  'backsplash': KITCHEN_MAIN,
  'appliance': KITCHEN_MAIN,
  
  // Bathroom
  'bathroom': BATHROOM_MAIN,
  'bath': BATHROOM_MAIN,
  'shower': BATHROOM_MAIN,
  'tub': BATHROOM_MAIN,
  'vanity': BATHROOM_MAIN,
  'tile': BATHROOM_MAIN,
  
  // Flooring
  'floor': FLOORING_MAIN,
  'hardwood': FLOORING_MAIN,
  'carpet': FLOORING_MAIN,
  'laminate': FLOORING_MAIN,
  'vinyl': FLOORING_MAIN,
  
  // Painting
  'paint': PAINTING_MAIN,
  'painting': PAINTING_MAIN,
  'stain': PAINTING_MAIN,
  'wallpaper': PAINTING_MAIN,
  'drywall': PAINTING_DRYWALL,
  
  // Windows and Doors
  'window': WINDOWS_MAIN,
  'door': DOORS_MAIN,
  'glass': WINDOWS_MAIN,
  
  // Concrete and Masonry
  'concrete': CONCRETE_MAIN,
  'masonry': CONCRETE_MAIN,
  'brick': CONCRETE_MAIN,
  'stone': CONCRETE_MAIN,
  'foundation': CONCRETE_MAIN,
  'driveway': CONCRETE_MAIN,
  'sidewalk': CONCRETE_MAIN,
  'patio': LANDSCAPING_PATIO,
  
  // Fencing and Decks
  'fence': FENCING_MAIN,
  'fencing': FENCING_MAIN,
  'deck': DECK_MAIN,
  'pergola': DECK_MAIN,
  'gazebo': DECK_MAIN,
  
  // Pool and Spa
  'pool': POOL_MAIN,
  'spa': POOL_MAIN,
  'hot tub': POOL_MAIN,
  
  // Solar and Green
  'solar': SOLAR_MAIN,
  'energy': SOLAR_MAIN,
  'insulation': INSULATION_MAIN,
  
  // General Construction
  'remodel': CONSTRUCTION_MAIN,
  'renovation': CONSTRUCTION_MAIN,
  'addition': CONSTRUCTION_MAIN,
  'construction': CONSTRUCTION_MAIN,
  'build': CONSTRUCTION_MAIN,
  'framing': CONSTRUCTION_MAIN,
  'basement': CONSTRUCTION_MAIN,
  'attic': CONSTRUCTION_MAIN,
  'home': HOME_MAIN,
  'house': HOME_MAIN,
  'commercial': COMMERCIAL_MAIN,
  'office': COMMERCIAL_MAIN,
  
  // Specialty
  'pressure wash': ELECTRICAL_WIRING,
  'cleaning': ELECTRICAL_WIRING,
  'mold': ELECTRICAL_WIRING,
  'pest': ELECTRICAL_WIRING,
  'security': ELECTRICAL_OUTLET,
  'camera': ELECTRICAL_OUTLET,
  'alarm': ELECTRICAL_OUTLET,
  'smart home': ELECTRICAL_OUTLET,
  'automation': ELECTRICAL_OUTLET,
  
  // Misc
  'repair': REPAIR_MAIN,
  'maintenance': REPAIR_MAIN,
  'install': REPAIR_MAIN,
  'replace': REPAIR_MAIN,
  'upgrade': REPAIR_MAIN,
  'inspect': REPAIR_MAIN,
  'emergency': REPAIR_MAIN,
  '24/7': REPAIR_MAIN,
};

// Default fallback images for general services
export const generalDefaultServiceImages = [
  CONSTRUCTION_MAIN,
  REPAIR_MAIN,
  ARCHITECT_MAIN,
  ELECTRICAL_MAIN,
  ELECTRICAL_WIRING,
  ELECTRICAL_LIGHTING,
  ELECTRICAL_OUTLET,
  TOOLS_MAIN,
];


// =============================================================================
// BEAUTY SERVICE IMAGE MAP
// =============================================================================
export const beautyServiceImageMap = {
  // Hair - General
  'hair': HAIR_MAIN,
  'haircut': HAIR_MAIN,
  'cut': HAIR_MAIN,
  'trim': HAIR_MAIN,
  'style': HAIR_MAIN,
  'styling': HAIR_MAIN,
  'blowout': HAIR_MAIN,
  'blow dry': HAIR_MAIN,
  'updo': HAIR_MAIN,
  
  // Hair Color
  'color': HAIR_COLOR,
  'colour': HAIR_COLOR,
  'highlight': HAIR_COLOR,
  'balayage': HAIR_COLOR,
  'ombre': HAIR_COLOR,
  'dye': HAIR_COLOR,
  'tint': HAIR_COLOR,
  'root': HAIR_COLOR,
  'gloss': HAIR_COLOR,
  'blonde': HAIR_COLOR,
  'brunette': HAIR_COLOR,
  
  // Hair Treatments
  'keratin': HAIR_TREATMENT,
  'treatment': HAIR_TREATMENT,
  'deep condition': HAIR_TREATMENT,
  'repair': HAIR_TREATMENT,
  'straighten': HAIR_TREATMENT,
  'perm': HAIR_TREATMENT,
  'relaxer': HAIR_TREATMENT,
  
  // Barber
  'barber': HAIR_BARBER,
  'fade': HAIR_BARBER,
  'taper': HAIR_BARBER,
  'beard': HAIR_BARBER,
  'shave': HAIR_BARBER,
  'line up': HAIR_BARBER,
  'lineup': HAIR_BARBER,
  'edge': HAIR_BARBER,
  'men': HAIR_BARBER,
  
  // Nails
  'nail': NAILS_MAIN,
  'manicure': NAILS_MAIN,
  'pedicure': NAILS_MAIN,
  'gel': NAILS_MAIN,
  'acrylic': NAILS_MAIN,
  'dip powder': NAILS_MAIN,
  'shellac': NAILS_MAIN,
  'nail art': NAILS_MAIN,
  'polish': NAILS_MAIN,
  
  // Lashes & Brows
  'lash': LASHES_MAIN,
  'eyelash': LASHES_MAIN,
  'extension': LASHES_MAIN,
  'lash lift': LASHES_MAIN,
  'brow': LASHES_MAIN,
  'eyebrow': LASHES_MAIN,
  'microblad': LASHES_MAIN,
  'lamination': LASHES_MAIN,
  'wax': LASHES_MAIN,
  'thread': LASHES_MAIN,
  
  // Makeup
  'makeup': MAKEUP_MAIN,
  'make up': MAKEUP_MAIN,
  'cosmetic': MAKEUP_MAIN,
  'bridal': MAKEUP_MAIN,
  'wedding': MAKEUP_MAIN,
  'special event': MAKEUP_MAIN,
  'glam': MAKEUP_MAIN,
  'contour': MAKEUP_MAIN,
  
  // Facial & Skincare
  'facial': FACIAL_MAIN,
  'skin': FACIAL_MAIN,
  'skincare': FACIAL_MAIN,
  'microderm': FACIAL_MAIN,
  'chemical peel': FACIAL_MAIN,
  'hydrafacial': FACIAL_MAIN,
  'dermaplaning': FACIAL_MAIN,
  'exfoliat': FACIAL_MAIN,
  'acne': FACIAL_MAIN,
  'anti-aging': FACIAL_MAIN,
  
  // Spa & Massage
  'spa': SPA_BEAUTY_MAIN,
  'massage': SPA_BEAUTY_MAIN,
  'relax': SPA_BEAUTY_MAIN,
  'aromatherapy': SPA_BEAUTY_MAIN,
  'hot stone': SPA_BEAUTY_MAIN,
  'deep tissue': SPA_BEAUTY_MAIN,
  'swedish': SPA_BEAUTY_MAIN,
  'body wrap': SPA_BEAUTY_MAIN,
  'scrub': SPA_BEAUTY_MAIN,
  
  // Waxing & Hair Removal
  'waxing': WAXING_MAIN,
  'hair removal': WAXING_MAIN,
  'laser': WAXING_MAIN,
  'sugaring': WAXING_MAIN,
  'brazilian': WAXING_MAIN,
  'bikini': WAXING_MAIN,
  
  // Tanning
  'tan': TANNING_MAIN,
  'tanning': TANNING_MAIN,
  'spray tan': TANNING_MAIN,
  'bronze': TANNING_MAIN,
  'sunless': TANNING_MAIN,
  
  // Body Treatments
  'body': BODY_TREATMENT_MAIN,
  'cellulite': BODY_TREATMENT_MAIN,
  'slimming': BODY_TREATMENT_MAIN,
  'detox': BODY_TREATMENT_MAIN,
  
  // Permanent Makeup
  'permanent': PERMANENT_MAKEUP_MAIN,
  'tattoo': PERMANENT_MAKEUP_MAIN,
  'lip blush': PERMANENT_MAKEUP_MAIN,
  'cosmetic tattoo': PERMANENT_MAKEUP_MAIN,
  
  // Extensions
  'hair extension': HAIR_EXTENSIONS,
  'weave': HAIR_EXTENSIONS,
  'wig': HAIR_EXTENSIONS,
  'install': HAIR_EXTENSIONS,
  'sew in': HAIR_EXTENSIONS,
  'tape in': HAIR_EXTENSIONS,
  'fusion': HAIR_EXTENSIONS,
  
  // Kids
  'kid': KIDS_BEAUTY_MAIN,
  'child': KIDS_BEAUTY_MAIN,
  'children': KIDS_BEAUTY_MAIN,
  
  // General/Misc
  'consult': HAIR_MAIN,
  'appointment': HAIR_MAIN,
  'service': HAIR_MAIN,
  'beauty': HAIR_MAIN,
  'salon': HAIR_MAIN,
  'studio': HAIR_MAIN,
};

// Default fallback images for beauty services
export const beautyDefaultServiceImages = [
  HAIR_MAIN,
  HAIR_COLOR,
  FACIAL_MAIN,
  NAILS_MAIN,
  LASHES_MAIN,
  SPA_BEAUTY_MAIN,
  MAKEUP_MAIN,
  HAIR_BARBER,
];


// =============================================================================
// HEALTH SERVICE IMAGE MAP
// =============================================================================
export const healthServiceImageMap = {
  // Dental
  'dental': DENTAL_MAIN,
  'dentist': DENTAL_MAIN,
  'teeth': DENTAL_MAIN,
  'tooth': DENTAL_MAIN,
  'cleaning': DENTAL_MAIN,
  'whitening': DENTAL_MAIN,
  'braces': DENTAL_MAIN,
  'orthodon': DENTAL_MAIN,
  'implant': DENTAL_MAIN,
  'crown': DENTAL_MAIN,
  'filling': DENTAL_MAIN,
  'root canal': DENTAL_MAIN,
  'veneer': DENTAL_MAIN,
  'oral': DENTAL_MAIN,
  
  // Chiropractic / Physical Therapy
  'chiropract': CHIROPRACTIC_MAIN,
  'spine': CHIROPRACTIC_MAIN,
  'spinal': CHIROPRACTIC_MAIN,
  'adjust': CHIROPRACTIC_MAIN,
  'back pain': CHIROPRACTIC_MAIN,
  'neck pain': CHIROPRACTIC_MAIN,
  'physical therapy': PHYSICAL_THERAPY_MAIN,
  'physiotherapy': PHYSICAL_THERAPY_MAIN,
  'rehab': PHYSICAL_THERAPY_MAIN,
  'mobility': PHYSICAL_THERAPY_MAIN,
  'sports medicine': PHYSICAL_THERAPY_MAIN,
  'injury': PHYSICAL_THERAPY_MAIN,
  
  // Med Spa / Aesthetics
  'med spa': MEDSPA_MAIN,
  'medspa': MEDSPA_MAIN,
  'botox': MEDSPA_MAIN,
  'filler': MEDSPA_MAIN,
  'injection': MEDSPA_MAIN,
  'laser': MEDSPA_MAIN,
  'facial': MEDSPA_MAIN,
  'skin': MEDSPA_MAIN,
  'anti-aging': MEDSPA_MAIN,
  'rejuven': MEDSPA_MAIN,
  'microneedling': MEDSPA_MAIN,
  'chemical peel': MEDSPA_MAIN,
  'hydrafacial': MEDSPA_MAIN,
  'coolsculpt': MEDSPA_MAIN,
  'body contour': MEDSPA_MAIN,
  
  // Dermatology
  'dermatolog': DERMATOLOGY_MAIN,
  'acne': DERMATOLOGY_MAIN,
  'eczema': DERMATOLOGY_MAIN,
  'psoriasis': DERMATOLOGY_MAIN,
  'mole': DERMATOLOGY_MAIN,
  'rash': DERMATOLOGY_MAIN,
  
  // Eye Care
  'eye': EYE_CARE_MAIN,
  'vision': EYE_CARE_MAIN,
  'optical': EYE_CARE_MAIN,
  'optometr': EYE_CARE_MAIN,
  'glasses': EYE_CARE_MAIN,
  'contact': EYE_CARE_MAIN,
  'lasik': EYE_CARE_MAIN,
  'cataract': EYE_CARE_MAIN,
  
  // Massage / Wellness
  'massage': MASSAGE_WELLNESS_MAIN,
  'wellness': MASSAGE_WELLNESS_MAIN,
  'relaxation': MASSAGE_WELLNESS_MAIN,
  'therapeutic': MASSAGE_WELLNESS_MAIN,
  'deep tissue': MASSAGE_WELLNESS_MAIN,
  'swedish': MASSAGE_WELLNESS_MAIN,
  'hot stone': MASSAGE_WELLNESS_MAIN,
  'aromatherapy': MASSAGE_WELLNESS_MAIN,
  
  // Mental Health
  'therapy': MENTAL_HEALTH_MAIN,
  'counseling': MENTAL_HEALTH_MAIN,
  'mental health': MENTAL_HEALTH_MAIN,
  'anxiety': MENTAL_HEALTH_MAIN,
  'depression': MENTAL_HEALTH_MAIN,
  'psychiatr': MENTAL_HEALTH_MAIN,
  'psycholog': MENTAL_HEALTH_MAIN,
  
  // Primary Care / General
  'primary care': PRIMARY_CARE_MAIN,
  'family medicine': PRIMARY_CARE_MAIN,
  'checkup': PRIMARY_CARE_MAIN,
  'check-up': PRIMARY_CARE_MAIN,
  'physical': PRIMARY_CARE_MAIN,
  'annual': PRIMARY_CARE_MAIN,
  'preventive': PRIMARY_CARE_MAIN,
  'vaccination': PRIMARY_CARE_MAIN,
  'vaccine': PRIMARY_CARE_MAIN,
  'immunization': PRIMARY_CARE_MAIN,
  
  // Pediatrics
  'pediatric': PEDIATRICS_MAIN,
  'child': PEDIATRICS_MAIN,
  'kids': PEDIATRICS_MAIN,
  'infant': PEDIATRICS_MAIN,
  'baby': PEDIATRICS_MAIN,
  
  // Women's Health
  'obgyn': WOMENS_HEALTH_MAIN,
  'ob-gyn': WOMENS_HEALTH_MAIN,
  'gynecolog': WOMENS_HEALTH_MAIN,
  'obstetric': WOMENS_HEALTH_MAIN,
  'pregnan': WOMENS_HEALTH_MAIN,
  'prenatal': WOMENS_HEALTH_MAIN,
  'women': WOMENS_HEALTH_MAIN,
  'fertility': WOMENS_HEALTH_MAIN,
  
  // Cardiology
  'cardio': CARDIOLOGY_MAIN,
  'heart': CARDIOLOGY_MAIN,
  'blood pressure': CARDIOLOGY_MAIN,
  'ekg': CARDIOLOGY_MAIN,
  'ecg': CARDIOLOGY_MAIN,
  
  // Orthopedics
  'orthopedic': ORTHOPEDICS_MAIN,
  'joint': ORTHOPEDICS_MAIN,
  'knee': ORTHOPEDICS_MAIN,
  'hip': ORTHOPEDICS_MAIN,
  'shoulder': ORTHOPEDICS_MAIN,
  'bone': ORTHOPEDICS_MAIN,
  'fracture': ORTHOPEDICS_MAIN,
  
  // Urgent Care
  'urgent care': URGENT_CARE_MAIN,
  'walk-in': URGENT_CARE_MAIN,
  'emergency': URGENT_CARE_MAIN,
  'x-ray': URGENT_CARE_MAIN,
  'xray': URGENT_CARE_MAIN,
  
  // Nutrition / Weight Loss
  'nutrition': NUTRITION_MAIN,
  'diet': NUTRITION_MAIN,
  'weight loss': NUTRITION_MAIN,
  'weight management': NUTRITION_MAIN,
  'dietitian': NUTRITION_MAIN,
  
  // Acupuncture / Alternative
  'acupuncture': ACUPUNCTURE_MAIN,
  'holistic': ACUPUNCTURE_MAIN,
  'alternative': ACUPUNCTURE_MAIN,
  'natural': ACUPUNCTURE_MAIN,
  'integrative': ACUPUNCTURE_MAIN,
  
  // Lab / Testing
  'lab': LAB_MAIN,
  'blood test': LAB_MAIN,
  'diagnostic': LAB_MAIN,
  'screening': LAB_MAIN,
  'test': LAB_MAIN,
  
  // Hair Restoration
  'hair': HAIR_COLOR,
  'hair loss': HAIR_COLOR,
  'hair restoration': HAIR_COLOR,
  'prp': HAIR_COLOR,
  
  // General/Misc
  'consultation': HEALTH_GENERAL_MAIN,
  'exam': HEALTH_GENERAL_MAIN,
  'treatment': HEALTH_GENERAL_MAIN,
  'procedure': HEALTH_GENERAL_MAIN,
  'care': HEALTH_GENERAL_MAIN,
  'health': HEALTH_GENERAL_MAIN,
  'medical': HEALTH_GENERAL_MAIN,
};

// Default fallback images for health services
export const healthDefaultServiceImages = [
  PRIMARY_CARE_MAIN,
  HEALTH_GENERAL_MAIN,
  PHYSICAL_THERAPY_MAIN,
  DERMATOLOGY_MAIN,
  MEDSPA_MAIN,
  EYE_CARE_MAIN,
  MASSAGE_WELLNESS_MAIN,
  LAB_MAIN,
];


// =============================================================================
// PROFESSIONAL SERVICE IMAGE MAP
// =============================================================================
export const professionalServiceImageMap = {
  // Accounting & Tax
  'account': ACCOUNTING_MAIN,
  'accounting': ACCOUNTING_MAIN,
  'bookkeep': ACCOUNTING_MAIN,
  'cpa': ACCOUNTING_MAIN,
  'tax': ACCOUNTING_MAIN,
  'audit': ACCOUNTING_MAIN,
  'payroll': ACCOUNTING_MAIN,
  'financial statement': ACCOUNTING_MAIN,
  'quickbooks': ACCOUNTING_MAIN,
  
  // Financial Planning & Advisory
  'financial': FINANCIAL_MAIN,
  'wealth': FINANCIAL_MAIN,
  'investment': FINANCIAL_MAIN,
  'retire': FINANCIAL_MAIN,
  'portfolio': FINANCIAL_MAIN,
  'estate plan': FINANCIAL_MAIN,
  'fiduciary': FINANCIAL_MAIN,
  'advisor': FINANCIAL_MAIN,
  '401k': FINANCIAL_MAIN,
  'ira': FINANCIAL_MAIN,
  
  // Insurance
  'insurance': INSURANCE_MAIN,
  'life insurance': INSURANCE_MAIN,
  'health insurance': INSURANCE_MAIN,
  'auto insurance': INSURANCE_MAIN,
  'home insurance': INSURANCE_MAIN,
  'coverage': INSURANCE_MAIN,
  'policy': INSURANCE_MAIN,
  'claim': INSURANCE_MAIN,
  
  // Real Estate
  'real estate': REAL_ESTATE_MAIN,
  'realtor': REAL_ESTATE_MAIN,
  'property': REAL_ESTATE_MAIN,
  'home': REAL_ESTATE_MAIN,
  'house': REAL_ESTATE_MAIN,
  'buying': REAL_ESTATE_MAIN,
  'selling': REAL_ESTATE_MAIN,
  'listing': REAL_ESTATE_MAIN,
  'mortgage': REAL_ESTATE_MAIN,
  'refinance': REAL_ESTATE_MAIN,
  'loan': REAL_ESTATE_MAIN,
  
  // Business Consulting
  'consult': CONSULTING_MAIN,
  'strategy': CONSULTING_MAIN,
  'business': CONSULTING_MAIN,
  'management': CONSULTING_MAIN,
  'operations': CONSULTING_MAIN,
  'growth': CONSULTING_MAIN,
  'planning': CONSULTING_MAIN,
  'coaching': CONSULTING_MAIN,
  'mentor': CONSULTING_MAIN,
  
  // Marketing & Advertising
  'marketing': MARKETING_MAIN,
  'advertising': MARKETING_MAIN,
  'digital': MARKETING_MAIN,
  'social media': MARKETING_MAIN,
  'seo': MARKETING_MAIN,
  'ppc': MARKETING_MAIN,
  'branding': MARKETING_MAIN,
  'content': MARKETING_MAIN,
  'campaign': MARKETING_MAIN,
  
  // IT & Technology
  'it ': IT_TECH_MAIN,
  'tech': IT_TECH_MAIN,
  'computer': IT_TECH_MAIN,
  'software': IT_TECH_MAIN,
  'network': IT_TECH_MAIN,
  'cyber': IT_TECH_MAIN,
  'security': IT_TECH_MAIN,
  'cloud': IT_TECH_MAIN,
  'data': IT_TECH_MAIN,
  'support': IT_TECH_MAIN,
  'helpdesk': IT_TECH_MAIN,
  'managed service': IT_TECH_MAIN,
  
  // Web & Design
  'web': WEB_DESIGN_MAIN,
  'website': WEB_DESIGN_MAIN,
  'design': WEB_DESIGN_MAIN,
  'graphic': WEB_DESIGN_MAIN,
  'logo': WEB_DESIGN_MAIN,
  'creative': WEB_DESIGN_MAIN,
  'ui': WEB_DESIGN_MAIN,
  'ux': WEB_DESIGN_MAIN,
  
  // Photography & Video
  'photo': PHOTOGRAPHY_MAIN,
  'portrait': PHOTOGRAPHY_MAIN,
  'headshot': PHOTOGRAPHY_MAIN,
  'event': PHOTOGRAPHY_MAIN,
  'wedding': PHOTOGRAPHY_MAIN,
  'video': PHOTOGRAPHY_MAIN,
  'production': PHOTOGRAPHY_MAIN,
  
  // HR & Recruiting
  'hr': HR_MAIN,
  'human resource': HR_MAIN,
  'recruit': HR_MAIN,
  'staffing': HR_MAIN,
  'hiring': HR_MAIN,
  'talent': HR_MAIN,
  'employee': HR_MAIN,
  'workforce': HR_MAIN,
  
  // Architecture & Engineering
  'architect': ARCHITECTURE_MAIN,
  'engineer': ARCHITECTURE_MAIN,
  'blueprint': ARCHITECTURE_MAIN,
  'draft': ARCHITECTURE_MAIN,
  'cad': ARCHITECTURE_MAIN,
  'structural': ARCHITECTURE_MAIN,
  
  // Training & Education
  'train': TRAINING_MAIN,
  'workshop': TRAINING_MAIN,
  'seminar': TRAINING_MAIN,
  'course': TRAINING_MAIN,
  'education': TRAINING_MAIN,
  'tutor': TRAINING_MAIN,
  'learning': TRAINING_MAIN,
  
  // Notary & Admin
  'notary': INSURANCE_MAIN,
  'document': INSURANCE_MAIN,
  'admin': INSURANCE_MAIN,
  'virtual assistant': INSURANCE_MAIN,
  'office': INSURANCE_MAIN,
  
  // Translation & Writing
  'translat': WRITING_MAIN,
  'interpret': WRITING_MAIN,
  'writing': WRITING_MAIN,
  'copywriting': WRITING_MAIN,
  'editor': WRITING_MAIN,
  'proofread': WRITING_MAIN,
  
  // Project Management
  'project': CONSULTING_MAIN,
  'agile': CONSULTING_MAIN,
  'scrum': CONSULTING_MAIN,
  
  // General/Misc
  'meeting': PROFESSIONAL_GENERAL_MAIN,
  'analysis': PROFESSIONAL_GENERAL_MAIN,
  'report': PROFESSIONAL_GENERAL_MAIN,
  'review': PROFESSIONAL_GENERAL_MAIN,
  'assessment': PROFESSIONAL_GENERAL_MAIN,
  'service': PROFESSIONAL_GENERAL_MAIN,
  'professional': PROFESSIONAL_GENERAL_MAIN,
};

// Default fallback images for professional services
export const professionalDefaultServiceImages = [
  PROFESSIONAL_GENERAL_MAIN,
  CONSULTING_MAIN,
  ACCOUNTING_MAIN,
  INSURANCE_MAIN,
  FINANCIAL_MAIN,
  MARKETING_MAIN,
  HR_MAIN,
  REAL_ESTATE_MAIN,
];


// =============================================================================
// HELPER FUNCTION
// =============================================================================

/**
 * Find the best matching image for a service name
 * @param {string} serviceName - The name of the service to match
 * @param {number} index - The index for fallback image selection
 * @param {Object} imageMap - The service image map to search
 * @param {Array} defaultImages - The default images array for fallback
 * @returns {string} The matching image URL
 */
export const getServiceImage = (serviceName, index, imageMap, defaultImages) => {
  const lowerName = serviceName.toLowerCase();
  
  // Check each keyword in the map
  for (const [keyword, imageUrl] of Object.entries(imageMap)) {
    if (lowerName.includes(keyword)) {
      return imageUrl;
    }
  }
  
  // Fallback to default images if no match
  return defaultImages[index % defaultImages.length];
};