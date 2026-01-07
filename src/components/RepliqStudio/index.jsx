// FILE: src/components/RepliqStudio/index.jsx
// MAIN REPLIQSTUDIO COMPONENT - This is the entry point!
import React, { useState } from 'react';
import { useVideoUpload, useCSVData, useVideoCreation } from './hooks';
import {
  VideoUpload,
  CSVUpload,
  PageSettings,
  PreviewPanel,
  ResultsModal,
  CreateButton
} from './components';
import './styles.css';

export default function RepliqStudio({ onNavigateToBuilder, importedCSV }) {
  // Video uploads
  const introUpload = useVideoUpload('intro_video');
  const secondUpload = useVideoUpload('second_video');
  const [useSecondVideo, setUseSecondVideo] = useState(false);

  // CSV data
  const csvData = useCSVData(importedCSV);

  // Video creation
  const creation = useVideoCreation();

  // Page settings
  const [settings, setSettings] = useState({
    videoTitle: 'A video for you 👋',
    videoDescription: 'Intro',
    buttonText: 'Book a Call',
    buttonLink: '',
    transitionTime: 10,
    darkMode: true
  });

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Handle video creation
  const handleCreate = () => {
    const fullSettings = {
      ...settings,
      introVideoData: introUpload.videoData,
      secondVideoData: secondUpload.videoData,
      useSecondVideo
    };
    
    creation.createVideos(csvData.leads, fullSettings);
  };

  return (
    <div className="repliq-studio">
      <div className="studio-content">
        {/* Left Panel - Controls */}
        <div className="controls-panel">
          <VideoUpload
            introVideo={introUpload.videoUrl}
            secondVideo={secondUpload.videoUrl}
            useSecondVideo={useSecondVideo}
            onUseSecondVideoChange={setUseSecondVideo}
            onIntroUpload={introUpload.handleUpload}
            onSecondUpload={secondUpload.handleUpload}
            introInputRef={introUpload.inputRef}
            secondInputRef={secondUpload.inputRef}
          />

          <CSVUpload
            hasData={csvData.hasData}
            leadsCount={csvData.leads.length}
            csvHeaders={csvData.csvHeaders}
            columnMapping={csvData.columnMapping}
            onUpload={csvData.handleUpload}
            onMappingChange={csvData.updateMapping}
            inputRef={csvData.inputRef}
          />

          <PageSettings
            videoTitle={settings.videoTitle}
            buttonText={settings.buttonText}
            buttonLink={settings.buttonLink}
            darkMode={settings.darkMode}
            onVideoTitleChange={(v) => updateSetting('videoTitle', v)}
            onButtonTextChange={(v) => updateSetting('buttonText', v)}
            onButtonLinkChange={(v) => updateSetting('buttonLink', v)}
            onDarkModeChange={(v) => updateSetting('darkMode', v)}
          />

          <CreateButton
            onClick={handleCreate}
            isCreating={creation.isCreating}
            progress={creation.progress}
            leadsCount={csvData.leads.length}
            hasVideo={!!introUpload.videoData}
          />
        </div>

        {/* Right Panel - Preview */}
        <PreviewPanel
          introVideo={introUpload.videoUrl}
          secondVideo={secondUpload.videoUrl}
          useSecondVideo={useSecondVideo}
          transitionTime={settings.transitionTime}
          videoTitle={settings.videoTitle}
          buttonText={settings.buttonText}
          buttonLink={settings.buttonLink}
          darkMode={settings.darkMode}
          sampleCompanyName={csvData.leads[0]?.companyName}
        />
      </div>

      {/* Results Modal */}
      {creation.showResults && (
        <ResultsModal
          videos={creation.createdVideos}
          onClose={creation.closeResults}
        />
      )}
    </div>
  );
}