
/**
 * Utility functions for locally caching movie poster images using IndexedDB
 */

import { supabase } from '@/integrations/supabase/client';

// Cache object to keep track of already processed images
interface CachedImage {
  originalUrl: string;
  cachedBlob: Blob;
  timestamp: number;
}

// Define the database name and store
const DB_NAME = 'movie-cache-db';
const STORE_NAME = 'images';
const DB_VERSION = 1;

// Image optimization settings
const MAX_IMAGE_WIDTH = 600; // Maximum width for cached images
const IMAGE_QUALITY = 0.7; // JPEG compression quality (0-1)

/**
 * Open the IndexedDB database
 */
const openDatabase = (): Promise<IDBDatabase> => {
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
 * Resize and compress an image to reduce file size
 */
const optimizeImage = async (imageBlob: Blob): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    // Create an image element to load the blob
    const img = new Image();
    img.onload = () => {
      // Create a canvas to draw and resize the image
      const canvas = document.createElement('canvas');
      
      // Calculate new dimensions while maintaining aspect ratio
      let width = img.width;
      let height = img.height;
      
      if (width > MAX_IMAGE_WIDTH) {
        const scaleFactor = MAX_IMAGE_WIDTH / width;
        width = MAX_IMAGE_WIDTH;
        height = Math.floor(height * scaleFactor);
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw the resized image on the canvas
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to compressed JPEG
      canvas.toBlob(
        (blob) => {
          if (blob) {
            console.log(`Image optimized: ${Math.round(imageBlob.size / 1024)}KB → ${Math.round(blob.size / 1024)}KB`);
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob from canvas'));
          }
        },
        'image/jpeg',
        IMAGE_QUALITY
      );
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image for optimization'));
    };
    
    // Load the image blob
    img.src = URL.createObjectURL(imageBlob);
  });
};

/**
 * Gets an image URL, either from cache or downloads it and stores in IndexedDB
 */
export async function getCachedImageUrl(
  imageUrl: string, 
  movieId: string,
  type: 'poster' | 'avatar' = 'poster'
): Promise<string> {
  // Return original URL if null/empty
  if (!imageUrl) return '';
  
  try {
    // Try to get the image from IndexedDB first
    const db = await openDatabase();
    const cachedImage = await getCachedImageFromDB(db, imageUrl);
    
    if (cachedImage) {
      console.log('Found cached image:', imageUrl);
      // Create a URL from the cached blob
      return URL.createObjectURL(cachedImage.cachedBlob);
    }
    
    // If not in cache, download and store it
    console.log('Downloading image:', imageUrl);
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    
    const originalBlob = await response.blob();
    
    // Optimize the image before storing (only for posters, not for small avatars)
    const optimizedBlob = type === 'poster' 
      ? await optimizeImage(originalBlob)
      : originalBlob;
    
    // Store in IndexedDB
    await storeImageInDB(db, {
      originalUrl: imageUrl,
      cachedBlob: optimizedBlob,
      timestamp: Date.now()
    });
    
    // Return as object URL
    return URL.createObjectURL(optimizedBlob);
  } catch (error) {
    console.error('Error caching image:', error);
    // Return original URL as fallback
    return imageUrl;
  }
}

/**
 * Get a cached image from IndexedDB
 */
const getCachedImageFromDB = (db: IDBDatabase, imageUrl: string): Promise<CachedImage | null> => {
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
const storeImageInDB = (db: IDBDatabase, cachedImage: CachedImage): Promise<void> => {
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
export function clearOldCachedImages(maxAge: number = 7 * 24 * 60 * 60 * 1000): Promise<void> {
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
