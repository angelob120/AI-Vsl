/**
 * Persistent Storage Utilities
 * Wraps window.storage API with error handling
 */

/**
 * Get a value from storage
 */
export const getStorageItem = async (key) => {
  try {
    const result = await window.storage.get(key);
    if (result && result.value) {
      return JSON.parse(result.value);
    }
    return null;
  } catch (e) {
    console.log(`Storage get failed for key: ${key}`, e);
    return null;
  }
};

/**
 * Set a value in storage
 */
export const setStorageItem = async (key, value) => {
  try {
    const result = await window.storage.set(key, JSON.stringify(value));
    return result !== null;
  } catch (e) {
    console.error(`Storage set failed for key: ${key}`, e);
    return false;
  }
};

/**
 * Delete a value from storage
 */
export const deleteStorageItem = async (key) => {
  try {
    const result = await window.storage.delete(key);
    return result !== null;
  } catch (e) {
    console.error(`Storage delete failed for key: ${key}`, e);
    return false;
  }
};

/**
 * List all keys with a prefix
 */
export const listStorageKeys = async (prefix) => {
  try {
    const result = await window.storage.list(prefix);
    return result?.keys || [];
  } catch (e) {
    console.log(`Storage list failed for prefix: ${prefix}`, e);
    return [];
  }
};

/**
 * Load all items with a given prefix
 */
export const loadAllItems = async (prefix) => {
  const keys = await listStorageKeys(prefix);
  const items = [];
  
  for (const key of keys) {
    const item = await getStorageItem(key);
    if (item) {
      items.push(item);
    }
  }
  
  return items;
};

/**
 * Generate a unique ID
 */
export const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};
