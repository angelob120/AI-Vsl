/**
 * API client for contractor builder backend
 */

// Use same origin - API is served from the same server as the frontend
// This works because server.js serves both the React app AND the API
const API_BASE_URL = '';

/**
 * Save a website to the database
 */
export const saveWebsite = async (websiteData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/websites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(websiteData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error saving website:', error);
    throw error;
  }
};

/**
 * Get all websites from the database
 */
export const getAllWebsites = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/websites`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.websites || [];
  } catch (error) {
    console.error('Error fetching websites:', error);
    return [];
  }
};

/**
 * Get a single website by ID
 */
export const getWebsiteById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/websites/${id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.website;
  } catch (error) {
    console.error('Error fetching website:', error);
    return null;
  }
};

/**
 * Delete a website from the database
 */
export const deleteWebsite = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/websites/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error deleting website:', error);
    throw error;
  }
};


export const deleteAllWebsites = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/websites`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error deleting all websites:', error);
    throw error;
  }
};



// Delete ALL websites
app.delete('/api/websites', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM contractor_websites RETURNING id');
    
    res.json({ 
      success: true, 
      message: `Successfully deleted ${result.rowCount} websites` 
    });
  } catch (error) {
    console.error('Delete all websites error:', error);
    res.status(500).json({ error: 'Failed to delete all websites', details: error.message });
  }
});