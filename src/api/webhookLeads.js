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
 * Map a webhook lead to form data format for the builder
 */
export const mapLeadToFormData = (lead) => {
  return {
    companyName: lead.companyName || '',
    ownerName: lead.ownerName || `${lead.firstName || ''} ${lead.lastName || ''}`.trim() || '',
    phone: lead.phone || '',
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