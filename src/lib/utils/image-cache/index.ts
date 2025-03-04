
/**
 * Image caching utilities for movie posters using IndexedDB
 */

import { supabase } from '@/integrations/supabase/client';
import { openDatabase, getCachedImageFromDB, storeImageInDB, clearOldImages, getCacheSize } from './db';
import { optimizeImage } from './optimizer';

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
    
    // Handle both absolute URLs and relative URLs
    const fetchUrl = imageUrl.startsWith('http') ? imageUrl : `${window.location.origin}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
    
    const response = await fetch(fetchUrl, {
      // Avoid caching at the network level to ensure we always get fresh content when needed
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    
    const originalBlob = await response.blob();
    
    // Always optimize the image before storing, especially for posters
    // For small avatars, we can use less aggressive optimization
    const optimizedBlob = await optimizeImage(originalBlob);
    
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

// Re-export utility functions for cache management
export { clearOldImages as clearOldCachedImages, getCacheSize };
