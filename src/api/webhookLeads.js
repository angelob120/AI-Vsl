/**
 * API client for webhook leads
 */

// Use same origin - API is served from the same server as the frontend
const API_BASE_URL = '';

/**
 * Get all webhook leads from the database
 */
export const getAllWebhookLeads = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/webhook/leads`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.leads || [];
  } catch (error) {
    console.error('Error fetching webhook leads:', error);
    return [];
  }
};

/**
 * Get a single webhook lead by ID
 */
export const getWebhookLeadById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/webhook/leads/${id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.lead;
  } catch (error) {
    console.error('Error fetching webhook lead:', error);
    return null;
  }
};

/**
 * Delete a single webhook lead from the database
 */
export const deleteWebhookLead = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/webhook/leads/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error deleting webhook lead:', error);
    throw error;
  }
};

/**
 * Delete ALL webhook leads from the database
 */
export const deleteAllWebhookLeads = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/webhook/leads`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting all webhook leads:', error);
    throw error;
  }
};

/**
 * Format phone number to +1 (XXX) - XXX - XXXX format
 */
const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Handle different lengths
  if (digits.length === 10) {
    // US number without country code: 1234567890
    return `+1 (${digits.slice(0, 3)}) - ${digits.slice(3, 6)} - ${digits.slice(6)}`;
  } else if (digits.length === 11 && digits.startsWith('1')) {
    // US number with country code: 11234567890
    return `+1 (${digits.slice(1, 4)}) - ${digits.slice(4, 7)} - ${digits.slice(7)}`;
  } else if (digits.length > 10) {
    // International number with country code
    const countryCode = digits.slice(0, digits.length - 10);
    const rest = digits.slice(-10);
    return `+${countryCode} (${rest.slice(0, 3)}) - ${rest.slice(3, 6)} - ${rest.slice(6)}`;
  }
  
  // Return original if we can't format it
  return phone;
};

/**
 * Map a webhook lead to form data format for the builder
 * NOTE: GHL stores company names in firstName + lastName fields
 */
export const mapLeadToFormData = (lead) => {
  // Company name: Use companyName if available, otherwise combine firstName + lastName
  // (GHL often stores business names in the name fields)
  const companyName = lead.companyName || 
    `${lead.firstName || ''} ${lead.lastName || ''}`.trim() || '';
  
  // Owner name: Only use if explicitly provided in ownerName field
  const ownerName = lead.ownerName || '';
  
  return {
    companyName: companyName,
    ownerName: ownerName,
    phone: formatPhoneNumber(lead.phone),
    email: lead.email || '',
    tagline: lead.tagline || '',
    address: lead.address ? 
      `${lead.address}${lead.city ? ', ' + lead.city : ''}${lead.state ? ', ' + lead.state : ''}${lead.postalCode ? ' ' + lead.postalCode : ''}`.trim() 
      : '',
    yearsExperience: lead.yearsExperience || '',
    services: Array.isArray(lead.services) ? lead.services : [],
    // Keep default colors - they're not typically in webhook data
    primaryColor: '#1a3a5c',
    accentColor: '#c9a227'
  };
};