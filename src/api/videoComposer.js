/**
 * Compose video on server using FFmpeg
 * This calls the server-side endpoint that uses FFmpeg for reliable video composition
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
    
    const response = await fetch('/api/repliq/compose-video', {
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

    if (onProgress) onProgress(90);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || error.error || 'Failed to compose video');
    }

    const data = await response.json();
    
    if (onProgress) onProgress(100);
    
    return data.composedVideoData;
  } catch (error) {
    console.error('Server video composition error:', error);
    throw error;
  }
};