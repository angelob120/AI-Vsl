// FILE: videoComposer.js
// Server-side video composition using FFmpeg
// Place this in the root directory next to server.js

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

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

  // Create a simple gradient background image using FFmpeg
  // This creates a dark gradient that looks like a website placeholder
  return new Promise((resolve, reject) => {
    const args = [
      '-f', 'lavfi',
      '-i', `color=c=#1a1a2e:s=${width}x${height}:d=1`,
      '-vf', `drawtext=text='${domain}':fontcolor=white:fontsize=48:x=(w-text_w)/2:y=100,drawbox=x=100:y=200:w=${width-200}:h=150:color=#667eea@0.3:t=fill,drawbox=x=100:y=400:w=${width-200}:h=150:color=#ffffff@0.1:t=fill,drawbox=x=100:y=600:w=${width-200}:h=150:color=#667eea@0.2:t=fill,drawbox=x=100:y=800:w=${width-200}:h=150:color=#ffffff@0.1:t=fill,drawbox=x=100:y=1000:w=${width-200}:h=150:color=#667eea@0.1:t=fill,drawbox=x=100:y=1200:w=${width-200}:h=150:color=#ffffff@0.05:t=fill,drawbox=x=100:y=1400:w=${width-200}:h=150:color=#667eea@0.1:t=fill,drawbox=x=100:y=1600:w=${width-200}:h=150:color=#ffffff@0.1:t=fill`,
      '-frames:v', '1',
      '-y',
      imagePath
    ];

    const ffmpeg = spawn('ffmpeg', args);
    
    let stderr = '';
    ffmpeg.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    ffmpeg.on('close', (code) => {
      if (code === 0) {
        resolve(imagePath);
      } else {
        // If fancy background fails, create a simple one
        const simpleArgs = [
          '-f', 'lavfi',
          '-i', `color=c=#1a1a2e:s=${width}x${height}:d=1`,
          '-frames:v', '1',
          '-y',
          imagePath
        ];
        
        const simpleFfmpeg = spawn('ffmpeg', simpleArgs);
        simpleFfmpeg.on('close', (code2) => {
          if (code2 === 0) {
            resolve(imagePath);
          } else {
            reject(new Error(`FFmpeg failed: ${stderr}`));
          }
        });
      }
    });
  });
};

/**
 * Get video duration using FFprobe
 */
const getVideoDuration = (videoPath) => {
  return new Promise((resolve, reject) => {
    const args = [
      '-v', 'error',
      '-show_entries', 'format=duration',
      '-of', 'default=noprint_wrappers=1:nokey=1',
      videoPath
    ];

    const ffprobe = spawn('ffprobe', args);
    let stdout = '';
    
    ffprobe.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    ffprobe.on('close', (code) => {
      if (code === 0) {
        resolve(parseFloat(stdout.trim()));
      } else {
        resolve(10); // Default 10 seconds if we can't get duration
      }
    });
  });
};

/**
 * Compose video with scrolling background + overlay
 * @param {Object} options
 * @param {string} options.introVideoPath - Path to the intro video file
 * @param {string} options.websiteUrl - URL for branding
 * @param {string} options.displayMode - 'small-bubble', 'big-bubble', 'full-screen'
 * @param {string} options.videoPosition - 'bottom-right', 'bottom-left', 'top-right', 'top-left'
 * @param {string} options.videoShape - 'circle', 'rounded', 'square'
 * @param {string} options.outputPath - Where to save the output video
 * @returns {Promise<string>} - Path to the composed video
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

  const tempDir = os.tmpdir();
  const outputFile = outputPath || path.join(tempDir, `composed_${Date.now()}.mp4`);

  // Get video duration
  const duration = await getVideoDuration(introVideoPath);

  // Create background image
  const bgImagePath = await createBackgroundImage(websiteUrl);

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
  // The background scrolls from top to bottom over the video duration
  const scrollSpeed = 1280 / duration; // pixels per second
  
  let overlayFilter;
  if (videoShape === 'circle') {
    // Circular mask for the overlay video
    overlayFilter = `[1:v]scale=${overlayWidth}:${overlayHeight},format=rgba,geq=lum='lum(X,Y)':a='if(gt(abs(X-${overlayWidth}/2)^2+abs(Y-${overlayHeight}/2)^2,(${overlayWidth}/2)^2),0,255)'[ov];[bg][ov]overlay=${overlayX}:${overlayY}`;
  } else if (videoShape === 'rounded') {
    // Rounded rectangle - approximate with slight transparency at edges
    overlayFilter = `[1:v]scale=${overlayWidth}:${overlayHeight}[ov];[bg][ov]overlay=${overlayX}:${overlayY}`;
  } else {
    // Square - no mask needed
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

    console.log('FFmpeg args:', args.join(' '));

    const ffmpeg = spawn('ffmpeg', args);
    
    let stderr = '';
    ffmpeg.stderr.on('data', (data) => {
      stderr += data.toString();
      // Log progress
      const match = stderr.match(/time=(\d+:\d+:\d+\.\d+)/);
      if (match) {
        console.log('FFmpeg progress:', match[1]);
      }
    });

    ffmpeg.on('close', (code) => {
      // Clean up temp background image
      try {
        fs.unlinkSync(bgImagePath);
      } catch (e) {}

      if (code === 0) {
        resolve(outputFile);
      } else {
        reject(new Error(`FFmpeg failed with code ${code}: ${stderr}`));
      }
    });

    ffmpeg.on('error', (err) => {
      reject(err);
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
  return filePath;
};

/**
 * Read file as base64 data URL
 */
const fileToBase64DataUrl = (filePath) => {
  const buffer = fs.readFileSync(filePath);
  const base64 = buffer.toString('base64');
  return `data:video/mp4;base64,${base64}`;
};

module.exports = {
  composeVideo,
  createBackgroundImage,
  getVideoDuration,
  saveBase64ToFile,
  fileToBase64DataUrl
};