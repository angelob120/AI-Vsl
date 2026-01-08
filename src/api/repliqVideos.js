/**
 * FILE: src/api/repliqVideos.js
 * API client for RepliQ video landing pages - database operations
 */

// Use same origin - API is served from the same server as the frontend
const API_BASE_URL = '';

/**
 * Save a generated video landing page to the database
 * This is called AFTER video composition to persist the composed video
 */
export const saveRepliqVideo = async (videoData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/repliq/videos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(videoData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Video saved to database:', data.video?.id);
    return data;
  } catch (error) {
    console.error('❌ Error saving repliq video:', error);
    throw error;
  }
};

/**
 * Get all repliq videos from the database (list view - no video data)
 */
export const getAllRepliqVideos = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/repliq/videos`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.videos || [];
  } catch (error) {
    console.error('❌ Error fetching repliq videos:', error);
    return [];
  }
};

/**
 * Get a single repliq video by ID (includes full video data for playback)
 */
export const getRepliqVideoById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/repliq/videos/${id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.video;
  } catch (error) {
    console.error('❌ Error fetching repliq video:', error);
    return null;
  }
};

/**
 * Delete a single repliq video from the database
 */
export const deleteRepliqVideo = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/repliq/videos/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Video deleted:', id);
    return data.success;
  } catch (error) {
    console.error('❌ Error deleting repliq video:', error);
    throw error;
  }
};

/**
 * Delete ALL repliq videos from the database
 */
export const deleteAllRepliqVideos = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/repliq/videos`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ All videos deleted:', data.deletedCount);
    return data;
  } catch (error) {
    console.error('❌ Error deleting all repliq videos:', error);
    throw error;
  }
};