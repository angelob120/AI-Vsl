// FILE: src/components/RepliqStudio/utils/htmlGenerators.js
// HTML generators for landing pages

export const generateLandingPageHTML = (lead, settings) => {
  const {
    introVideoData,
    videoTitle,
    buttonText,
    buttonLink,
    darkMode
  } = settings;

  const greetingName = lead.companyName || lead.firstName || 'there';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hi ${greetingName} - ${videoTitle}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: ${darkMode ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'};
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    
    .landing-container {
      max-width: 800px;
      width: 100%;
      text-align: center;
      animation: fadeIn 0.8s ease-out;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .greeting {
      font-size: 3.5rem;
      font-weight: 800;
      color: ${darkMode ? '#fff' : '#1a1a2e'};
      margin-bottom: 12px;
      text-shadow: ${darkMode ? '0 2px 20px rgba(0,0,0,0.3)' : 'none'};
      line-height: 1.2;
    }
    
    .greeting .company-name {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .subtitle {
      font-size: 1.4rem;
      color: ${darkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)'};
      margin-bottom: 40px;
      font-weight: 400;
    }
    
    .video-wrapper {
      position: relative;
      width: 100%;
      max-width: 640px;
      margin: 0 auto 40px;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      background: #000;
    }
    
    .video-wrapper video {
      width: 100%;
      height: auto;
      display: block;
    }
    
    .play-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: opacity 0.3s;
    }
    
    .play-overlay.hidden {
      opacity: 0;
      pointer-events: none;
    }
    
    .play-button {
      width: 80px;
      height: 80px;
      background: rgba(255,255,255,0.95);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s;
    }
    
    .play-button:hover {
      transform: scale(1.1);
    }
    
    .play-icon {
      width: 0;
      height: 0;
      border-left: 24px solid #1a1a2e;
      border-top: 16px solid transparent;
      border-bottom: 16px solid transparent;
      margin-left: 6px;
    }
    
    .cta-button {
      display: inline-block;
      padding: 18px 48px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-decoration: none;
      border-radius: 50px;
      font-size: 1.2rem;
      font-weight: 600;
      transition: all 0.3s;
      box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
    }
    
    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 30px rgba(102, 126, 234, 0.6);
    }
    
    .powered-by {
      margin-top: 60px;
      font-size: 0.9rem;
      color: ${darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'};
    }
    
    .powered-by span {
      color: #667eea;
      font-weight: 600;
    }
    
    @media (max-width: 768px) {
      .greeting { font-size: 2.5rem; }
      .subtitle { font-size: 1.1rem; }
      .cta-button { padding: 14px 36px; font-size: 1rem; }
    }
  </style>
</head>
<body>
  <div class="landing-container">
    <h1 class="greeting">
      Hi <span class="company-name">${greetingName}</span> 👋
    </h1>
    <p class="subtitle">${videoTitle}</p>
    
    <div class="video-wrapper">
      <video id="mainVideo" playsinline preload="metadata">
        <source src="${introVideoData}" type="video/mp4">
        Your browser does not support the video tag.
      </video>
      <div class="play-overlay" id="playOverlay" onclick="playVideo()">
        <div class="play-button">
          <div class="play-icon"></div>
        </div>
      </div>
    </div>
    
    ${buttonLink ? `<a href="${buttonLink}" class="cta-button" target="_blank">${buttonText || 'Book a Call'}</a>` : ''}
    
    <p class="powered-by">Powered by <span>°RepliQ</span></p>
  </div>
  
  <script>
    const video = document.getElementById('mainVideo');
    const playOverlay = document.getElementById('playOverlay');
    
    function playVideo() {
      video.play();
      playOverlay.classList.add('hidden');
    }
    
    video.addEventListener('click', function() {
      if (video.paused) {
        video.play();
        playOverlay.classList.add('hidden');
      } else {
        video.pause();
        playOverlay.classList.remove('hidden');
      }
    });
    
    video.addEventListener('ended', function() {
      playOverlay.classList.remove('hidden');
    });
  </script>
</body>
</html>`;
};

export const generateVideoOnlyHTML = (lead, settings) => {
  const { introVideoData, darkMode } = settings;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Video for ${lead.companyName || lead.firstName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: ${darkMode ? '#1a1a2e' : '#f5f5f5'};
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    video {
      max-width: 100%;
      max-height: 100vh;
    }
  </style>
</head>
<body>
  <video controls autoplay playsinline>
    <source src="${introVideoData}" type="video/mp4">
  </video>
</body>
</html>`;
};

export const generateExportCSV = (videos) => {
  const headers = [
    'Id',
    'Success',
    'Website URL',
    'First Name',
    'Company Name',
    'Landing Page Link',
    'Video Only Link'
  ];

  const rows = videos.map(video => [
    video.id,
    video.success,
    video.originUrl,
    video.firstName,
    video.companyName,
    video.landingPageLink,
    video.videoOnlyLink
  ]);

  const escapeCSV = (cell) => {
    const str = String(cell || '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  return [
    headers.join(','),
    ...rows.map(row => row.map(escapeCSV).join(','))
  ].join('\n');
};