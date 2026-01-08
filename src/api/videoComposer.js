/**
 * FILE: src/api/videoComposer.js
 * Client-side API for server video composition
 * This calls the Railway server endpoint that uses FFmpeg for reliable video composition
 */

// Get the API URL - use same origin in production, or explicit URL in development
const getApiUrl = () => {
  // In production, API is served from same origin
  if (process.env.NODE_ENV === 'production') {
    return '';
  }
  // In development, you might need to point to your Railway URL
  return process.env.VITE_API_URL || '';
};

/**
 * Compose video on server using FFmpeg
 * 
 * Flow:
 * 1. Client uploads intro video (base64) + settings
 * 2. Server receives and saves video to temp file
 * 3. Server uses FFmpeg to compose video with scrolling background
 * 4. Server returns composed video as base64
 * 5. Client receives composed video for display/storage
 * 
 * @param {Object} options
 * @param {string} options.introVideoData - Base64 encoded intro video
 * @param {string} options.websiteUrl - URL to display in background
 * @param {string} options.displayMode - 'small-bubble', 'big-bubble', 'full-screen'
 * @param {string} options.videoPosition - 'bottom-right', 'bottom-left', 'top-right', 'top-left'
 * @param {string} options.videoShape - 'circle', 'rounded', 'square'
 * @param {function} options.onProgress - Progress callback (0-100)
 * @returns {Promise<string>} - Composed video as base64 data URL
 */
export const composeVideoOnServer = async ({ 
  introVideoData, 
  websiteUrl, 
  displayMode, 
  videoPosition, 
  videoShape,
  onProgress 
}) => {
  try {
    if (onProgress) onProgress(10);
    
    const apiUrl = getApiUrl();
    
    console.log('📤 Sending video to server for composition...');
    console.log('📍 API URL:', apiUrl || '(same origin)');
    
    const response = await fetch(`${apiUrl}/api/repliq/compose-video`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        introVideoData,
        websiteUrl,
        displayMode,
        videoPosition,
        videoShape
      })
    });

    if (onProgress) onProgress(70);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || error.error || 'Failed to compose video');
    }

    const data = await response.json();
    
    if (onProgress) onProgress(100);
    
    console.log('✅ Video composition complete');
    return data.composedVideoData;
  } catch (error) {
    console.error('❌ Server video composition error:', error);
    throw error;
  }
};

/**
 * Check if server-side video composition is available
 * @returns {Promise<boolean>}
 */
export const checkServerComposition = async () => {
  try {
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/api/health`);
    return response.ok;
  } catch {
    return false;
  }
};

export default composeVideoOnServer;