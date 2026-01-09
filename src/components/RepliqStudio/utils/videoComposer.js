// FILE: src/components/RepliqStudio/utils/videoComposer.js
// Composes a video with scrolling website background + overlay video

/**
 * Get position styles based on Video Display settings
 */
const getOverlayPosition = (position, displayMode, canvasWidth, canvasHeight, videoWidth, videoHeight) => {
  const padding = 20;
  
  // Size based on display mode
  let width, height;
  if (displayMode === 'small-bubble') {
    width = Math.min(150, canvasWidth * 0.2);
    height = width; // Keep aspect ratio for bubble
  } else if (displayMode === 'big-bubble') {
    width = Math.min(280, canvasWidth * 0.35);
    height = width;
  } else { // full-screen
    width = canvasWidth * 0.4;
    height = (width / videoWidth) * videoHeight;
  }

  // Position
  let x, y;
  switch (position) {
    case 'bottom-left':
      x = padding;
      y = canvasHeight - height - padding;
      break;
    case 'top-right':
      x = canvasWidth - width - padding;
      y = padding;
      break;
    case 'top-left':
      x = padding;
      y = padding;
      break;
    case 'bottom-right':
    default:
      x = canvasWidth - width - padding;
      y = canvasHeight - height - padding;
      break;
  }

  return { x, y, width, height };
};

/**
 * Draw rounded rectangle or circle clip path
 */
const setClipPath = (ctx, x, y, width, height, shape) => {
  ctx.beginPath();
  
  if (shape === 'circle') {
    const radius = Math.min(width, height) / 2;
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  } else if (shape === 'rounded') {
    const radius = 16;
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
  } else { // square
    ctx.rect(x, y, width, height);
  }
  
  ctx.closePath();
};

/**
 * Create a styled placeholder background for the website
 * Since capturing live websites has CORS/timeout issues, we create a nice placeholder
 */
export const createWebsiteBackground = (websiteUrl) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 2000; // Tall for scrolling effect
    const ctx = canvas.getContext('2d');
    
    // Extract domain for display
    let domain = 'Website';
    try {
      if (websiteUrl) {
        const url = new URL(websiteUrl);
        domain = url.hostname.replace('www.', '');
      }
    } catch (e) {
      domain = websiteUrl || 'Website';
    }
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(0.3, '#16213e');
    gradient.addColorStop(0.6, '#0f3460');
    gradient.addColorStop(1, '#1a1a2e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add subtle grid pattern
    ctx.strokeStyle = 'rgba(102, 126, 234, 0.1)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    
    // Header area
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fillRect(0, 0, canvas.width, 80);
    
    // Logo placeholder
    ctx.fillStyle = '#667eea';
    ctx.beginPath();
    ctx.arc(60, 40, 20, 0, Math.PI * 2);
    ctx.fill();
    
    // Domain text in header
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = 'bold 18px Arial, sans-serif';
    ctx.fillText(domain, 100, 46);
    
    // Navigation placeholders
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for (let i = 0; i < 4; i++) {
      ctx.fillRect(canvas.width - 400 + i * 90, 32, 60, 16);
    }
    
    // Hero section
    ctx.fillStyle = 'rgba(102, 126, 234, 0.15)';
    ctx.fillRect(100, 120, canvas.width - 200, 300);
    
    // Hero text placeholders
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillRect(150, 180, 400, 40);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(150, 240, 300, 20);
    ctx.fillRect(150, 270, 350, 20);
    
    // CTA button
    ctx.fillStyle = '#667eea';
    ctx.beginPath();
    ctx.roundRect(150, 320, 160, 50, 25);
    ctx.fill();
    
    // Content sections
    const sectionColors = [
      'rgba(255, 255, 255, 0.03)',
      'rgba(102, 126, 234, 0.05)',
      'rgba(255, 255, 255, 0.03)',
      'rgba(118, 75, 162, 0.05)',
      'rgba(255, 255, 255, 0.03)'
    ];
    
    let yPos = 480;
    for (let section = 0; section < 5; section++) {
      // Section background
      ctx.fillStyle = sectionColors[section];
      ctx.fillRect(0, yPos, canvas.width, 280);
      
      // Section title
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fillRect(100, yPos + 40, 250, 28);
      
      // Content cards
      const cardWidth = (canvas.width - 280) / 3;
      for (let card = 0; card < 3; card++) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.beginPath();
        ctx.roundRect(100 + card * (cardWidth + 40), yPos + 90, cardWidth, 150, 12);
        ctx.fill();
        
        // Card content lines
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(120 + card * (cardWidth + 40), yPos + 160, cardWidth - 40, 12);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(120 + card * (cardWidth + 40), yPos + 180, cardWidth - 80, 10);
      }
      
      yPos += 280;
    }
    
    // Footer
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, canvas.height - 100, canvas.width, 100);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.font = '14px Arial, sans-serif';
    ctx.fillText(`© ${new Date().getFullYear()} ${domain}`, 100, canvas.height - 50);
    
    // Create image from canvas
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = canvas.toDataURL('image/png');
  });
};

/**
 * Load video element from data URL with timeout
 */
const loadVideoElement = (videoDataUrl) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = 'anonymous';
    
    // Timeout after 30 seconds
    const timeout = setTimeout(() => {
      reject(new Error('Video loading timed out'));
    }, 30000);
    
    video.onloadedmetadata = () => {
      clearTimeout(timeout);
      video.oncanplaythrough = () => resolve(video);
      video.load();
    };
    video.onerror = (e) => {
      clearTimeout(timeout);
      reject(e);
    };
    video.src = videoDataUrl;
  });
};

/**
 * Main function to compose video with scrolling background + overlay
 * @param {Object} options
 * @param {string} options.websiteUrl - URL of website (used for display/branding)
 * @param {string} options.introVideoData - Base64 data URL of intro video
 * @param {string} options.displayMode - 'small-bubble', 'big-bubble', 'full-screen'
 * @param {string} options.videoPosition - 'bottom-right', 'bottom-left', 'top-right', 'top-left'
 * @param {string} options.videoShape - 'circle', 'rounded', 'square'
 * @param {function} options.onProgress - Progress callback (0-100)
 * @returns {Promise<Blob>} - The composed video as a Blob
 */
export const composeVideo = async (options) => {
  const {
    websiteUrl,
    websiteScreenshot, // Can pass pre-captured screenshot
    introVideoData,
    displayMode = 'small-bubble',
    videoPosition = 'bottom-right',
    videoShape = 'circle',
    onProgress = () => {}
  } = options;

  onProgress(5);

  // Canvas setup
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 1280;
  canvas.height = 720;

  // Load the overlay video
  onProgress(10);
  const overlayVideo = await loadVideoElement(introVideoData);
  const videoDuration = overlayVideo.duration;
  
  onProgress(20);

  // Get or create website background
  let screenshotImg;
  if (websiteScreenshot) {
    screenshotImg = new Image();
    screenshotImg.src = websiteScreenshot;
    await new Promise(resolve => {
      screenshotImg.onload = resolve;
    });
  } else {
    // Create styled placeholder background (fast and reliable)
    screenshotImg = await createWebsiteBackground(websiteUrl);
  }

  onProgress(40);

  // Calculate scroll parameters
  const screenshotHeight = screenshotImg.height;
  const visibleHeight = canvas.height;
  const scrollableDistance = Math.max(0, screenshotHeight - visibleHeight);
  
  // Get overlay position/size
  const overlayPos = getOverlayPosition(
    videoPosition,
    displayMode,
    canvas.width,
    canvas.height,
    overlayVideo.videoWidth,
    overlayVideo.videoHeight
  );

  // Set up MediaRecorder
  const stream = canvas.captureStream(30); // 30 FPS
  
  // Add audio from overlay video if it has audio
  try {
    const audioCtx = new AudioContext();
    const source = audioCtx.createMediaElementSource(overlayVideo);
    const dest = audioCtx.createMediaStreamDestination();
    source.connect(dest);
    source.connect(audioCtx.destination);
    dest.stream.getAudioTracks().forEach(track => stream.addTrack(track));
  } catch (e) {
    console.log('No audio track or audio context not supported');
  }

  const mediaRecorder = new MediaRecorder(stream, {
    mimeType: 'video/webm;codecs=vp9',
    videoBitsPerSecond: 5000000
  });

  const chunks = [];
  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  // Start recording
  mediaRecorder.start();
  
  // Play overlay video
  overlayVideo.currentTime = 0;
  await overlayVideo.play();

  onProgress(50);

  // Animation loop
  const startTime = Date.now();
  const fps = 30;
  const frameInterval = 1000 / fps;

  return new Promise((resolve) => {
    const renderFrame = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const progress = Math.min(elapsed / videoDuration, 1);
      
      onProgress(50 + Math.round(progress * 45));

      // Calculate scroll position (ease in-out for smooth scroll)
      const easeProgress = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      const scrollY = easeProgress * scrollableDistance;

      // Clear canvas
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw scrolling background
      ctx.drawImage(
        screenshotImg,
        0, scrollY, screenshotImg.width, visibleHeight,
        0, 0, canvas.width, canvas.height
      );

      // Draw semi-transparent overlay for better video visibility
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw overlay video with shape clipping
      ctx.save();
      setClipPath(ctx, overlayPos.x, overlayPos.y, overlayPos.width, overlayPos.height, videoShape);
      ctx.clip();
      
      // Draw video maintaining aspect ratio
      const videoAspect = overlayVideo.videoWidth / overlayVideo.videoHeight;
      const boxAspect = overlayPos.width / overlayPos.height;
      
      let drawWidth, drawHeight, drawX, drawY;
      
      if (videoShape === 'circle') {
        // For circle, use cover approach
        if (videoAspect > boxAspect) {
          drawHeight = overlayPos.height;
          drawWidth = drawHeight * videoAspect;
          drawX = overlayPos.x - (drawWidth - overlayPos.width) / 2;
          drawY = overlayPos.y;
        } else {
          drawWidth = overlayPos.width;
          drawHeight = drawWidth / videoAspect;
          drawX = overlayPos.x;
          drawY = overlayPos.y - (drawHeight - overlayPos.height) / 2;
        }
      } else {
        // For rounded/square, fit within bounds
        if (videoAspect > boxAspect) {
          drawWidth = overlayPos.width;
          drawHeight = drawWidth / videoAspect;
          drawX = overlayPos.x;
          drawY = overlayPos.y + (overlayPos.height - drawHeight) / 2;
        } else {
          drawHeight = overlayPos.height;
          drawWidth = drawHeight * videoAspect;
          drawX = overlayPos.x + (overlayPos.width - drawWidth) / 2;
          drawY = overlayPos.y;
        }
      }
      
      ctx.drawImage(overlayVideo, drawX, drawY, drawWidth, drawHeight);
      ctx.restore();

      // Draw border around video overlay
      ctx.save();
      setClipPath(ctx, overlayPos.x, overlayPos.y, overlayPos.width, overlayPos.height, videoShape);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();

      // Check if video ended
      if (elapsed >= videoDuration || overlayVideo.ended) {
        // Stop recording
        mediaRecorder.stop();
        overlayVideo.pause();
        
        mediaRecorder.onstop = () => {
          onProgress(100);
          const blob = new Blob(chunks, { type: 'video/webm' });
          resolve(blob);
        };
      } else {
        setTimeout(renderFrame, frameInterval);
      }
    };

    renderFrame();
  });
};

/**
 * Convert Blob to base64 data URL
 */
export const blobToDataURL = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Convert WebM to MP4 using browser (if supported) or return WebM
 * Note: True conversion requires FFmpeg, this is a best-effort approach
 */
export const convertToMP4 = async (webmBlob) => {
  // For now, return WebM - browsers can play it
  // For true MP4 conversion, would need FFmpeg.wasm
  return webmBlob;
};

export default composeVideo;