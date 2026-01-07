// FILE: src/components/RepliqStudio/hooks/useVideoCreation.js
import { useState } from 'react';
import { delay, generateUniqueId } from '../utils/fileHelpers';
import { 
  saveToIndexedDB, 
  LANDING_PAGE_PREFIX, 
  addToVideoList 
} from '../utils/storage';
import { 
  generateLandingPageHTML, 
  generateVideoOnlyHTML 
} from '../utils/htmlGenerators';

export function useVideoCreation() {
  const [isCreating, setIsCreating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentLead, setCurrentLead] = useState(null);
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
      setProgress(Math.round((i / leads.length) * 100));

      await delay(100);

      const videoId = generateUniqueId();
      
      // Generate HTML
      const landingPageHTML = generateLandingPageHTML(lead, settings);
      const videoOnlyHTML = generateVideoOnlyHTML(lead, settings);
      
      // Storage data
      const storageData = {
        id: videoId,
        lead,
        settings,
        landingPageHTML,
        videoOnlyHTML,
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

      // Also save reference to localStorage
      try {
        const liteData = {
          ...storageData,
          settings: {
            ...settings,
            introVideoData: '[[STORED_IN_INDEXEDDB]]',
            secondVideoData: settings.secondVideoData ? '[[STORED_IN_INDEXEDDB]]' : null
          }
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
        videoOnlyLink,
        landingPageHTML,
        videoOnlyHTML
      };

      generatedVideos.push(videoInfo);
      
      // Add to video list
      addToVideoList({
        id: videoId,
        companyName: lead.companyName,
        firstName: lead.firstName,
        createdAt: new Date().toISOString()
      });
    }

    setCreatedVideos(generatedVideos);
    setProgress(100);
    setCurrentLead(null);
    
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
    setCreatedVideos([]);
    setShowResults(false);
  };

  return {
    isCreating,
    progress,
    currentLead,
    createdVideos,
    showResults,
    createVideos,
    closeResults,
    reset
  };
}