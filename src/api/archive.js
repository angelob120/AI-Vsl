/**
 * API client for Archive & Export History
 */

const API_BASE_URL = '';

/**
 * Archive websites and create CSV export record
 * Called when downloading CSV - archives all, creates export record, clears active list
 */
export const archiveAndExport = async (websites) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/archive/export`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ websites })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error archiving websites:', error);
    throw error;
  }
};

/**
 * Get all archived websites with optional search
 */
export const getArchivedWebsites = async (search = '', batchId = '') => {
  try {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (batchId) params.append('batchId', batchId);
    
    const url = `${API_BASE_URL}/api/archive/websites${params.toString() ? '?' + params.toString() : ''}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.websites || [];
  } catch (error) {
    console.error('Error fetching archived websites:', error);
    return [];
  }
};

/**
 * Get all CSV export history
 */
export const getExportHistory = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/archive/exports`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.exports || [];
  } catch (error) {
    console.error('Error fetching export history:', error);
    return [];
  }
};

/**
 * Get single export by ID (includes full website data for re-download)
 */
export const getExportById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/archive/exports/${id}`);

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.export;
  } catch (error) {
    console.error('Error fetching export:', error);
    return null;
  }
};

/**
 * Get archive statistics
 */
export const getArchiveStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/archive/stats`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.stats;
  } catch (error) {
    console.error('Error fetching archive stats:', error);
    return {
      totalArchivedWebsites: 0,
      totalExports: 0,
      totalWebsitesExported: 0
    };
  }
};
