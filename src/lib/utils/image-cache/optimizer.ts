
/**
 * Utilities for image optimization and processing
 */

// Image optimization settings
const MAX_IMAGE_WIDTH = 600; // Maximum width for cached images
const IMAGE_QUALITY = 0.7; // JPEG compression quality (0-1)
const MAX_IMAGE_SIZE_MB = 5; // Maximum size in MB to process

/**
 * Resize and compress an image to reduce file size
 */
export const optimizeImage = async (imageBlob: Blob): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    // If the image is too large, it might crash the browser
    const imageSizeMB = imageBlob.size / (1024 * 1024);
    if (imageSizeMB > MAX_IMAGE_SIZE_MB) {
      console.warn(`Large image detected (${imageSizeMB.toFixed(2)}MB). Applying aggressive optimization.`);
    }
    
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
            // Log the size reduction
            const originalSizeKB = Math.round(imageBlob.size / 1024);
            const newSizeKB = Math.round(blob.size / 1024);
            const reductionPercent = Math.round((1 - (blob.size / imageBlob.size)) * 100);
            
            console.log(
              `Image optimized: ${originalSizeKB}KB → ${newSizeKB}KB (${reductionPercent}% reduction), ` + 
              `Dimensions: ${img.width}x${img.height} → ${width}x${height}`
            );
            
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
      console.error('Failed to load image for optimization');
      // If optimization fails, return the original blob as fallback
      resolve(imageBlob);
    };
    
    // Load the image blob
    img.src = URL.createObjectURL(imageBlob);
  });
};
