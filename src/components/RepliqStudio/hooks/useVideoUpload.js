import { useState, useRef } from 'react';
import { fileToBase64 } from '../utils/fileHelpers';
import { saveToIndexedDB } from '../utils/storage';

export function useVideoUpload(videoId) {
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoData, setVideoData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('video/')) return;

    setIsLoading(true);
    
    try {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      
      const base64Data = await fileToBase64(file);
      setVideoData(base64Data);
      
      await saveToIndexedDB('videos', {
        id: videoId,
        data: base64Data,
        fileName: file.name,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Video upload error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerUpload = () => {
    inputRef.current?.click();
  };

  const reset = () => {
    setVideoUrl(null);
    setVideoData(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return {
    videoUrl,
    videoData,
    isLoading,
    inputRef,
    handleUpload,
    triggerUpload,
    reset
  };
}