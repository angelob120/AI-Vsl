// FILE: src/components/RepliqStudio/index-modular.jsx
// MODULAR VERSION - Uses separate component files
// This version uses the updated PreviewPanel with lead navigation
import React, { useState, useEffect, useCallback } from 'react';
import { useVideoUpload, useCSVData, useVideoCreation } from './hooks';
import {
  Header,
  VideoUpload,
  CSVUpload,
  PageSettings,
  PreviewPanel,
  ResultsModal,
  CreateButton
} from './components';
import './styles.css';

export default function RepliqStudio({ onNavigateToBuilder, importedCSV, isDarkMode = true }) {
  // Video uploads
  const introUpload = useVideoUpload('intro_video');
  const secondUpload = useVideoUpload('second_video');
  const [useSecondVideo, setUseSecondVideo] = useState(false);

  // CSV data
  const csvData = useCSVData(importedCSV);

  // Video creation
  const creation = useVideoCreation();

  // Preview lead navigation state - NEW
  const [previewLeadIndex, setPreviewLeadIndex] = useState(0);

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

  // Reset preview index when leads change
  useEffect(() => {
    if (previewLeadIndex >= csvData.leads.length && csvData.leads.length > 0) {
      setPreviewLeadIndex(0);
    }
  }, [csvData.leads, previewLeadIndex]);

  // Keyboard navigation for preview - NEW
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (csvData.leads.length <= 1) return;
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPreviousLead();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNextLead();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [csvData.leads.length, previewLeadIndex]);

  // Navigation functions - NEW
  const goToPreviousLead = useCallback(() => {
    if (csvData.leads.length === 0) return;
    setPreviewLeadIndex(prev => prev === 0 ? csvData.leads.length - 1 : prev - 1);
  }, [csvData.leads.length]);

  const goToNextLead = useCallback(() => {
    if (csvData.leads.length === 0) return;
    setPreviewLeadIndex(prev => prev === csvData.leads.length - 1 ? 0 : prev + 1);
  }, [csvData.leads.length]);

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
    <div className={`repliq-studio ${isDarkMode ? 'dark' : 'light'}`}>
      <Header onBack={onNavigateToBuilder} isDarkMode={isDarkMode} />

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
            isDarkMode={isDarkMode}
          />

          <CSVUpload
            hasData={csvData.hasData}
            leadsCount={csvData.leads.length}
            csvHeaders={csvData.csvHeaders}
            columnMapping={csvData.columnMapping}
            onUpload={csvData.handleUpload}
            onMappingChange={csvData.updateMapping}
            inputRef={csvData.inputRef}
            isDarkMode={isDarkMode}
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
            isDarkMode={isDarkMode}
          />

          <CreateButton
            onClick={handleCreate}
            isCreating={creation.isCreating}
            progress={creation.progress}
            leadsCount={csvData.leads.length}
            hasVideo={!!introUpload.videoData}
            isDarkMode={isDarkMode}
          />
        </div>

        {/* Right Panel - Preview with Navigation */}
        <PreviewPanel
          introVideo={introUpload.videoUrl}
          secondVideo={secondUpload.videoUrl}
          useSecondVideo={useSecondVideo}
          transitionTime={settings.transitionTime}
          videoTitle={settings.videoTitle}
          buttonText={settings.buttonText}
          buttonLink={settings.buttonLink}
          darkMode={settings.darkMode}
          // NEW: Pass full leads array and navigation props
          leads={csvData.leads}
          currentLeadIndex={previewLeadIndex}
          onLeadIndexChange={setPreviewLeadIndex}
        />
      </div>

      {/* Results Modal */}
      {creation.showResults && (
        <ResultsModal
          videos={creation.createdVideos}
          onClose={creation.closeResults}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
}