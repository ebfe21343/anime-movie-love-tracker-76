/**
 * Utility functions for caching movie poster images
 */

import { supabase } from '@/integrations/supabase/client';

// Cache object to keep track of already processed images
interface CachedImage {
  originalUrl: string;
  cachedUrl: string;
  timestamp: number;
}

// In-memory cache for the current session
const imageCache: Record<string, CachedImage> = {};

/**
 * Gets an image URL, either from cache or downloads it to Supabase Storage
 */
export async function getCachedImageUrl(
  imageUrl: string, 
  movieId: string,
  type: 'poster' | 'avatar' = 'poster'
): Promise<string> {
  // Return original URL if null/empty
  if (!imageUrl) return '';
  
  // Check if already in memory cache
  if (imageCache[imageUrl]) {
    return imageCache[imageUrl].cachedUrl;
  }
  
  try {
    // Check if image is already in Supabase Storage
    const bucketName = 'movie-images';
    const filePath = `${type}/${movieId}_${Date.now()}.jpg`;
    
    // First try to find an existing cached version
    const { data: files } = await supabase
      .storage
      .from(bucketName)
      .list(`${type}`, {
        search: movieId
      });
    
    // If we found an existing file for this movie, use it
    if (files && files.length > 0) {
      const existingFile = files[0];
      const { data } = supabase
        .storage
        .from(bucketName)
        .getPublicUrl(`${type}/${existingFile.name}`);
      
      if (data && data.publicUrl) {
        // Store in memory cache
        imageCache[imageUrl] = {
          originalUrl: imageUrl,
          cachedUrl: data.publicUrl,
          timestamp: Date.now()
        };
        
        return data.publicUrl;
      }
    }
    
    // If no cached image found, download and store it
    try {
      // Fetch the image
      const response = await fetch(imageUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      
      // Upload to Supabase Storage
      const { data, error } = await supabase
        .storage
        .from(bucketName)
        .upload(filePath, blob, {
          contentType: 'image/jpeg',
          upsert: true
        });
      
      if (error) {
        console.error('Error uploading to Supabase Storage:', error);
        return imageUrl; // Fall back to original URL
      }
      
      // Get the public URL
      const { data: urlData } = supabase
        .storage
        .from(bucketName)
        .getPublicUrl(filePath);
      
      if (urlData && urlData.publicUrl) {
        // Store in memory cache
        imageCache[imageUrl] = {
          originalUrl: imageUrl,
          cachedUrl: urlData.publicUrl,
          timestamp: Date.now()
        };
        
        return urlData.publicUrl;
      }
    } catch (error) {
      console.error('Error processing image:', error);
    }
  } catch (error) {
    console.error('Storage operation failed:', error);
  }
  
  // Return original URL as fallback
  return imageUrl;
}

/**
 * Clear old cached images (not implemented yet, could be added in future)
 */
export function clearOldCachedImages() {
  // Implementation to remove old cached images
  // Could be based on timestamp or other criteria
}
