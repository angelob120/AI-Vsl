// FILE: src/components/RepliqStudio/components/PageSettings.jsx
import React from 'react';

export default function PageSettings({
  videoTitle,
  buttonText,
  buttonLink,
  darkMode,
  onVideoTitleChange,
  onButtonTextChange,
  onButtonLinkChange,
  onDarkModeChange
}) {
  return (
    <section className="control-section">
      <h3>⚙️ Page Settings</h3>
      
      <div className="setting-row">
        <label>Title / Message</label>
        <input
          type="text"
          value={videoTitle}
          onChange={(e) => onVideoTitleChange(e.target.value)}
          placeholder="A video for you 👋"
        />
      </div>

      <div className="setting-row">
        <label>Button Text</label>
        <input
          type="text"
          value={buttonText}
          onChange={(e) => onButtonTextChange(e.target.value)}
          placeholder="Book a Call"
        />
      </div>

      <div className="setting-row">
        <label>Button Link</label>
        <input
          type="text"
          value={buttonLink}
          onChange={(e) => onButtonLinkChange(e.target.value)}
          placeholder="https://calendly.com/..."
        />
      </div>

      <div className="setting-row">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={(e) => onDarkModeChange(e.target.checked)}
          />
          Dark Mode
        </label>
      </div>
    </section>
  );
}