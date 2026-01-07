// FILE: src/components/RepliqStudio/utils/storage.js
// Storage utilities for IndexedDB and localStorage

export const LANDING_PAGE_PREFIX = 'repliq_landing_';
export const VIDEO_STORAGE_PREFIX = 'repliq_video_';
export const VIDEO_LIST_KEY = 'repliq_video_list';

// ============================================
// IndexedDB Helpers
// ============================================

export const openVideoDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('RepliqVideoDB', 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('videos')) {
        db.createObjectStore('videos', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('landingPages')) {
        db.createObjectStore('landingPages', { keyPath: 'id' });
      }
    };
  });
};

export const saveToIndexedDB = async (storeName, data) => {
  try {
    const db = await openVideoDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.error('IndexedDB save error:', e);
    return false;
  }
};

export const getFromIndexedDB = async (storeName, id) => {
  try {
    const db = await openVideoDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.error('IndexedDB get error:', e);
    return null;
  }
};

export const deleteFromIndexedDB = async (storeName, id) => {
  try {
    const db = await openVideoDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.error('IndexedDB delete error:', e);
    return false;
  }
};

// ============================================
// localStorage Helpers
// ============================================

export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (e) {
    console.warn('localStorage save failed:', e);
    return false;
  }
};

export const getFromLocalStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.warn('localStorage get failed:', e);
    return null;
  }
};

export const getVideoList = () => {
  return getFromLocalStorage(VIDEO_LIST_KEY) || [];
};

export const addToVideoList = (videoInfo) => {
  const list = getVideoList();
  list.push(videoInfo);
  saveToLocalStorage(VIDEO_LIST_KEY, list);
};