import React from 'react';

export default function VideoUpload({
  introVideo,
  secondVideo,
  useSecondVideo,
  onUseSecondVideoChange,
  onIntroUpload,
  onSecondUpload,
  introInputRef,
  secondInputRef
}) {
  return (
    <section className="control-section">
      <h3>📹 Video Upload</h3>
      
      <div className="upload-group">
        <label>Intro Video *</label>
        <input
          type="file"
          ref={introInputRef}
          accept="video/*"
          onChange={onIntroUpload}
          style={{ display: 'none' }}
        />
        <button 
          onClick={() => introInputRef.current?.click()}
          className={`upload-button ${introVideo ? 'has-file' : ''}`}
        >
          {introVideo ? '✓ Video Uploaded' : 'Upload Intro Video'}
        </button>
      </div>

      <div className="upload-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={useSecondVideo}
            onChange={(e) => onUseSecondVideoChange(e.target.checked)}
          />
          Use second video after transition
        </label>
        
        {useSecondVideo && (
          <>
            <input
              type="file"
              ref={secondInputRef}
              accept="video/*"
              onChange={onSecondUpload}
              style={{ display: 'none' }}
            />
            <button 
              onClick={() => secondInputRef.current?.click()}
              className={`upload-button ${secondVideo ? 'has-file' : ''}`}
            >
              {secondVideo ? '✓ Second Video Uploaded' : 'Upload Second Video'}
            </button>
          </>
        )}
      </div>
    </section>
  );
}