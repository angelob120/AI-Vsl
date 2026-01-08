// FILE: videoComposer.js
// Server-side video composition using FFmpeg
// Place this in the root directory next to server.js

const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * Check if FFmpeg is installed
 */
const checkFFmpeg = () => {
  try {
    execSync('ffmpeg -version', { stdio: 'ignore' });
    execSync('ffprobe -version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Create a scrolling background image for the video
 * Returns path to the generated image
 */
const createBackgroundImage = async (websiteUrl, width = 1280, height = 2000) => {
  const tempDir = os.tmpdir();
  const imagePath = path.join(tempDir, `bg_${Date.now()}.png`);
  
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

  // Escape special characters for FFmpeg
  const safeDomain = domain.replace(/[':]/g, '\\$&');

  // Create a simple gradient background image using FFmpeg
  return new Promise((resolve, reject) => {
    const args = [
      '-f', 'lavfi',
      '-i', `color=c=#1a1a2e:s=${width}x${height}:d=1`,
      '-vf', `drawtext=text='${safeDomain}':fontcolor=white:fontsize=48:x=(w-text_w)/2:y=100`,
      '-frames:v', '1',
      '-y',
      imagePath
    ];

    const ffmpeg = spawn('ffmpeg', args);
    
    let stderr = '';
    ffmpeg.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    ffmpeg.on('error', (err) => {
      console.error('FFmpeg spawn error:', err.message);
      // Create a fallback simple background
      createSimpleBackground(imagePath, width, height)
        .then(() => resolve(imagePath))
        .catch(reject);
    });

    ffmpeg.on('close', (code) => {
      if (code === 0) {
        resolve(imagePath);
      } else {
        // Try simple background as fallback
        createSimpleBackground(imagePath, width, height)
          .then(() => resolve(imagePath))
          .catch(() => reject(new Error(`FFmpeg failed: ${stderr}`)));
      }
    });
  });
};

/**
 * Create a simple solid color background as fallback
 */
const createSimpleBackground = (imagePath, width, height) => {
  return new Promise((resolve, reject) => {
    const args = [
      '-f', 'lavfi',
      '-i', `color=c=#1a1a2e:s=${width}x${height}:d=1`,
      '-frames:v', '1',
      '-y',
      imagePath
    ];
    
    const ffmpeg = spawn('ffmpeg', args);
    ffmpeg.on('error', reject);
    ffmpeg.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error('Simple background creation failed'));
    });
  });
};

/**
 * Get video duration using FFprobe
 * Returns default duration if FFprobe fails
 */
const getVideoDuration = (videoPath) => {
  return new Promise((resolve) => {
    const args = [
      '-v', 'error',
      '-show_entries', 'format=duration',
      '-of', 'default=noprint_wrappers=1:nokey=1',
      videoPath
    ];

    const ffprobe = spawn('ffprobe', args);
    let stdout = '';
    let stderr = '';
    
    ffprobe.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    ffprobe.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    ffprobe.on('error', (err) => {
      console.log('FFprobe error, using default duration:', err.message);
      resolve(10); // Default 10 seconds
    });

    ffprobe.on('close', (code) => {
      if (code === 0 && stdout.trim()) {
        const duration = parseFloat(stdout.trim());
        resolve(isNaN(duration) ? 10 : duration);
      } else {
        console.log('FFprobe failed, using default duration. stderr:', stderr);
        resolve(10); // Default 10 seconds if we can't get duration
      }
    });
  });
};

/**
 * Compose video with scrolling background + overlay
 */
const composeVideo = async (options) => {
  const {
    introVideoPath,
    websiteUrl,
    displayMode = 'small-bubble',
    videoPosition = 'bottom-right',
    videoShape = 'circle',
    outputPath
  } = options;

  // Check FFmpeg availability first
  if (!checkFFmpeg()) {
    throw new Error('FFmpeg is not installed. Please ensure nixpacks.toml includes ffmpeg-full');
  }

  const tempDir = os.tmpdir();
  const outputFile = outputPath || path.join(tempDir, `composed_${Date.now()}.mp4`);

  // Get video duration
  const duration = await getVideoDuration(introVideoPath);
  console.log(`📏 Video duration: ${duration} seconds`);

  // Create background image
  const bgImagePath = await createBackgroundImage(websiteUrl);
  console.log(`🖼️ Created background image: ${bgImagePath}`);

  // Calculate overlay position and size
  const canvasWidth = 1280;
  const canvasHeight = 720;
  
  let overlayWidth, overlayHeight;
  if (displayMode === 'small-bubble') {
    overlayWidth = 150;
    overlayHeight = 150;
  } else if (displayMode === 'big-bubble') {
    overlayWidth = 280;
    overlayHeight = 280;
  } else { // full-screen
    overlayWidth = 512;
    overlayHeight = 512;
  }

  let overlayX, overlayY;
  const padding = 20;
  switch (videoPosition) {
    case 'bottom-left':
      overlayX = padding;
      overlayY = canvasHeight - overlayHeight - padding;
      break;
    case 'top-right':
      overlayX = canvasWidth - overlayWidth - padding;
      overlayY = padding;
      break;
    case 'top-left':
      overlayX = padding;
      overlayY = padding;
      break;
    case 'bottom-right':
    default:
      overlayX = canvasWidth - overlayWidth - padding;
      overlayY = canvasHeight - overlayHeight - padding;
      break;
  }

  // Build FFmpeg filter for scrolling background + overlay
  const scrollSpeed = 1280 / duration; // pixels per second
  
  let overlayFilter;
  if (videoShape === 'circle') {
    // Circular mask for the overlay video
    overlayFilter = `[1:v]scale=${overlayWidth}:${overlayHeight},format=rgba,geq=lum='lum(X,Y)':a='if(gt(abs(X-${overlayWidth}/2)^2+abs(Y-${overlayHeight}/2)^2,(${overlayWidth}/2)^2),0,255)'[ov];[bg][ov]overlay=${overlayX}:${overlayY}`;
  } else {
    // Square/rounded - no mask needed
    overlayFilter = `[1:v]scale=${overlayWidth}:${overlayHeight}[ov];[bg][ov]overlay=${overlayX}:${overlayY}`;
  }

  // Build full filter complex
  const filterComplex = `[0:v]scale=${canvasWidth}:720,crop=${canvasWidth}:${canvasHeight}:0:'min(t*${scrollSpeed},ih-${canvasHeight})'[bg];${overlayFilter}`;

  return new Promise((resolve, reject) => {
    const args = [
      '-loop', '1',
      '-i', bgImagePath,
      '-i', introVideoPath,
      '-filter_complex', filterComplex,
      '-t', duration.toString(),
      '-c:v', 'libx264',
      '-preset', 'fast',
      '-crf', '23',
      '-c:a', 'aac',
      '-b:a', '128k',
      '-shortest',
      '-y',
      outputFile
    ];

    console.log('🎬 Running FFmpeg composition...');

    const ffmpeg = spawn('ffmpeg', args);
    
    let stderr = '';
    ffmpeg.stderr.on('data', (data) => {
      stderr += data.toString();
      // Log progress
      const match = stderr.match(/time=(\d+:\d+:\d+\.\d+)/);
      if (match) {
        console.log('⏱️ FFmpeg progress:', match[1]);
      }
    });

    ffmpeg.on('error', (err) => {
      // Clean up temp background image
      try { fs.unlinkSync(bgImagePath); } catch (e) {}
      reject(new Error(`FFmpeg error: ${err.message}`));
    });

    ffmpeg.on('close', (code) => {
      // Clean up temp background image
      try { fs.unlinkSync(bgImagePath); } catch (e) {}

      if (code === 0) {
        console.log('✅ FFmpeg composition complete');
        resolve(outputFile);
      } else {
        console.error('❌ FFmpeg failed with code:', code);
        console.error('FFmpeg stderr:', stderr.slice(-500)); // Last 500 chars
        reject(new Error(`FFmpeg failed with code ${code}`));
      }
    });
  });
};

/**
 * Save base64 video to temp file
 */
const saveBase64ToFile = (base64Data, extension = 'mp4') => {
  const tempDir = os.tmpdir();
  const filePath = path.join(tempDir, `temp_${Date.now()}.${extension}`);
  
  // Remove data URL prefix if present
  const base64 = base64Data.replace(/^data:video\/\w+;base64,/, '');
  
  fs.writeFileSync(filePath, Buffer.from(base64, 'base64'));
  console.log(`💾 Saved base64 to file: ${filePath} (${fs.statSync(filePath).size} bytes)`);
  return filePath;
};

/**
 * Read file as base64 data URL
 */
const fileToBase64DataUrl = (filePath) => {
  const buffer = fs.readFileSync(filePath);
  const base64 = buffer.toString('base64');
  console.log(`📤 Converted file to base64: ${buffer.length} bytes`);
  return `data:video/mp4;base64,${base64}`;
};

// Log FFmpeg availability on module load
console.log('🎬 FFmpeg available:', checkFFmpeg());

module.exports = {
  composeVideo,
  createBackgroundImage,
  getVideoDuration,
  saveBase64ToFile,
  fileToBase64DataUrl,
  checkFFmpeg
};