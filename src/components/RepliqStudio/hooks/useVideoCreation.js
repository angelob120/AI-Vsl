// FILE: src/components/RepliqStudio/hooks/useVideoCreation.js
// UPDATED: Now composes actual video files with scrolling website + overlay
import { useState } from 'react';
import { delay, generateUniqueId } from '../utils/fileHelpers';
import { composeVideo, blobToDataURL } from '../utils/videoComposer';
import { 
  saveToIndexedDB, 
  LANDING_PAGE_PREFIX, 
  addToVideoList 
} from '../utils/storage';

export function useVideoCreation() {
  const [isCreating, setIsCreating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentLead, setCurrentLead] = useState(null);
  const [currentLeadProgress, setCurrentLeadProgress] = useState(0);
  const [createdVideos, setCreatedVideos] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const createVideos = async (leads, settings) => {
    if (leads.length === 0) {
      alert('Please upload a CSV with leads first!');
      return;
    }
    if (!settings.introVideoData) {
      alert('Please upload an intro video first!');
      return;
    }

    setIsCreating(true);
    setProgress(0);
    setCreatedVideos([]);
    setShowResults(false);

    const baseUrl = window.location.origin + window.location.pathname;
    const generatedVideos = [];

    for (let i = 0; i < leads.length; i++) {
      const lead = leads[i];
      setCurrentLead(lead);
      setCurrentLeadProgress(0);
      
      // Overall progress is based on lead index
      const baseProgress = Math.round((i / leads.length) * 100);
      setProgress(baseProgress);

      const videoId = generateUniqueId();

      try {
        // Compose the video with scrolling website + overlay
        const composedVideoBlob = await composeVideo({
          websiteUrl: lead.websiteUrl,
          introVideoData: settings.introVideoData,
          displayMode: settings.displayMode || 'small-bubble',
          videoPosition: settings.videoPosition || 'bottom-right',
          videoShape: settings.videoShape || 'circle',
          onProgress: (p) => {
            setCurrentLeadProgress(p);
            // Update overall progress based on lead + composition progress
            const leadProgress = (i + (p / 100)) / leads.length;
            setProgress(Math.round(leadProgress * 100));
          }
        });

        // Convert blob to data URL for storage
        const composedVideoData = await blobToDataURL(composedVideoBlob);

        // Storage data - now stores the COMPOSED video, not the original
        const storageData = {
          id: videoId,
          lead,
          settings: {
            ...settings,
            // Don't store the original intro video data in settings anymore
            introVideoData: null,
            secondVideoData: null
          },
          // Store the composed video
          composedVideoData: composedVideoData,
          videoType: 'composed', // Flag to indicate this is a composed video
          createdAt: new Date().toISOString()
        };

        // Save to IndexedDB
        let savedSuccessfully = false;
        
        try {
          await saveToIndexedDB('landingPages', storageData);
          savedSuccessfully = true;
        } catch (e) {
          console.warn('IndexedDB save failed:', e);
        }

        // Also save reference to localStorage (without video data - too large)
        try {
          const liteData = {
            id: videoId,
            lead,
            settings: {
              ...settings,
              introVideoData: '[[STORED_IN_INDEXEDDB]]',
              secondVideoData: null
            },
            videoType: 'composed',
            composedVideoData: '[[STORED_IN_INDEXEDDB]]',
            createdAt: new Date().toISOString()
          };
          localStorage.setItem(LANDING_PAGE_PREFIX + videoId, JSON.stringify(liteData));
          savedSuccessfully = true;
        } catch (e) {
          console.warn('localStorage save failed:', e);
        }

        // Create links
        const landingPageLink = `${baseUrl}#landing-${videoId}`;
        const videoOnlyLink = `${baseUrl}#video-${videoId}`;

        const videoInfo = {
          id: videoId,
          success: savedSuccessfully ? 'YES' : 'PARTIAL',
          originUrl: lead.websiteUrl,
          firstName: lead.firstName,
          companyName: lead.companyName,
          landingPageLink,
          videoOnlyLink
        };

        generatedVideos.push(videoInfo);
        
        // Add to video list
        addToVideoList({
          id: videoId,
          companyName: lead.companyName,
          firstName: lead.firstName,
          createdAt: new Date().toISOString()
        });

      } catch (err) {
        console.error('Failed to create video for lead:', lead, err);
        
        generatedVideos.push({
          id: videoId,
          success: 'FAILED',
          originUrl: lead.websiteUrl,
          firstName: lead.firstName,
          companyName: lead.companyName,
          landingPageLink: null,
          videoOnlyLink: null,
          error: err.message
        });
      }
    }

    setCreatedVideos(generatedVideos);
    setProgress(100);
    setCurrentLead(null);
    setCurrentLeadProgress(0);
    
    await delay(500);
    setIsCreating(false);
    setShowResults(true);

    return generatedVideos;
  };

  const closeResults = () => {
    setShowResults(false);
  };

  const reset = () => {
    setIsCreating(false);
    setProgress(0);
    setCurrentLead(null);
    setCurrentLeadProgress(0);
    setCreatedVideos([]);
    setShowResults(false);
  };

  return {
    isCreating,
    progress,
    currentLead,
    currentLeadProgress,
    createdVideos,
    showResults,
    createVideos,
    closeResults,
    reset
  };
}

export default useVideoCreation;