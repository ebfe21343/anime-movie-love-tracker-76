
/**
 * Database utilities for image caching using IndexedDB
 */

// Cache object to keep track of already processed images
export interface CachedImage {
  originalUrl: string;
  cachedBlob: Blob;
  timestamp: number;
}

// Define the database name and store
const DB_NAME = 'movie-cache-db';
const STORE_NAME = 'images';
const DB_VERSION = 1;

/**
 * Open the IndexedDB database
 */
export const openDatabase = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = (event) => {
      console.error('IndexedDB error:', request.error);
      reject(request.error);
    };
    
    request.onsuccess = (event) => {
      resolve(request.result);
    };
    
    request.onupgradeneeded = (event) => {
      const db = request.result;
      // Create object store for images if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'originalUrl' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
};

/**
 * Get a cached image from IndexedDB
 */
export const getCachedImageFromDB = (db: IDBDatabase, imageUrl: string): Promise<CachedImage | null> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(imageUrl);
    
    request.onerror = () => {
      reject(request.error);
    };
    
    request.onsuccess = () => {
      resolve(request.result || null);
    };
  });
};

/**
 * Store an image in IndexedDB
 */
export const storeImageInDB = (db: IDBDatabase, cachedImage: CachedImage): Promise<void> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(cachedImage);
    
    request.onerror = () => {
      reject(request.error);
    };
    
    request.onsuccess = () => {
      resolve();
    };
  });
};

/**
 * Clear old cached images older than maxAge (in milliseconds)
 */
export function clearOldImages(maxAge: number = 7 * 24 * 60 * 60 * 1000): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await openDatabase();
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('timestamp');
      
      // Find entries older than maxAge
      const cutoffTime = Date.now() - maxAge;
      const request = index.openCursor(IDBKeyRange.upperBound(cutoffTime));
      
      request.onsuccess = (event) => {
        const cursor = request.result;
        if (cursor) {
          // Delete this entry
          cursor.delete();
          // Move to next entry
          cursor.continue();
        }
      };
      
      transaction.oncomplete = () => {
        console.log('Cleared old cached images');
        resolve();
      };
      
      transaction.onerror = () => {
        reject(transaction.error);
      };
    } catch (error) {
      console.error('Error clearing cache:', error);
      reject(error);
    }
  });
}

/**
 * Clear all cached images from the database
 */
export function clearAllImages(): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await openDatabase();
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      // Clear all entries in the store
      const request = store.clear();
      
      request.onsuccess = () => {
        console.log('Image cache cleared successfully');
        resolve();
      };
      
      request.onerror = () => {
        console.error('Failed to clear image cache:', request.error);
        reject(request.error);
      };
    } catch (error) {
      console.error('Error clearing image cache:', error);
      reject(error);
    }
  });
}

/**
 * Get the total size of the image cache
 */
export function getCacheSize(): Promise<number> {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await openDatabase();
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();
      
      request.onsuccess = () => {
        const cachedImages = request.result as CachedImage[];
        let totalSize = 0;
        
        cachedImages.forEach(image => {
          totalSize += image.cachedBlob.size;
        });
        
        resolve(totalSize);
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    } catch (error) {
      console.error('Error getting cache size:', error);
      reject(error);
    }
  });
}
