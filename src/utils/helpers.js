/**
 * General Utility Functions
 */

/**
 * Generate a unique video ID (RepliQ format)
 */
export const generateVideoId = () => {
  const chars = 'ABCDEFabcdef0123456789';
  let id = 'Ef';
  for (let i = 0; i < 7; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id + 'E2';
};

/**
 * Delay execution
 */
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Truncate text with ellipsis
 */
export const truncate = (str, length) => {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
};

/**
 * Format date for display
 */
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    console.error('Failed to copy:', e);
    return false;
  }
};

/**
 * Read file as data URL
 */
export const readFileAsDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Read file as text
 */
export const readFileAsText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

/**
 * Color presets for contractor websites
 */
export const colorPresets = [
  { name: 'Navy & Gold', primary: '#1a3a5c', accent: '#c9a227' },
  { name: 'Forest & Copper', primary: '#2d4a3e', accent: '#b87333' },
  { name: 'Slate & Orange', primary: '#3d4f5f', accent: '#e85d04' },
  { name: 'Charcoal & Teal', primary: '#2b2d42', accent: '#2ec4b6' },
  { name: 'Burgundy & Cream', primary: '#722f37', accent: '#f4e4c1' },
  { name: 'Deep Blue & Lime', primary: '#0d1b2a', accent: '#7cb518' },
];

/**
 * Default form data for contractor builder
 */
export const defaultContractorFormData = {
  ownerName: '',
  companyName: '',
  phone: '',
  email: '',
  tagline: '',
  primaryColor: '#1a3a5c',
  accentColor: '#c9a227',
  services: [],
  yearsExperience: '',
  address: ''
};

/**
 * Default images state for contractor builder
 */
export const defaultContractorImages = {
  logo: null,
  hero: null,
  about: null,
  gallery: []
};
