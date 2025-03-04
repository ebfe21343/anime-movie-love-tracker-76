
import { useEffect, useState } from 'react';
import { Film, Palette, Tv, X, ImageOff } from 'lucide-react';
import { Movie } from '@/types/movie';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getCachedImageUrl } from '@/lib/utils/image-cache';

interface MovieInfoProps {
  movie: Movie;
  poster: string;
  contentType: string;
  cancelled: boolean;
}

export const MovieInfo = ({ movie, poster, contentType, cancelled }: MovieInfoProps) => {
  const isSeries = contentType === 'series' || contentType === 'anime' || contentType === 'cartoon';
  const [cachedPosterUrl, setCachedPosterUrl] = useState(poster);
  const [imageLoadError, setImageLoadError] = useState(false);
  const hasValidPoster = poster && poster !== '/placeholder.svg' && !imageLoadError;
  
  useEffect(() => {
    // Reset error state when poster changes
    setImageLoadError(false);
    
    // Try to get cached version of the poster
    const loadCachedImage = async () => {
      if (poster && poster !== '/placeholder.svg') {
        try {
          const cachedUrl = await getCachedImageUrl(poster, movie.id, 'poster');
          if (cachedUrl) {
            setCachedPosterUrl(cachedUrl);
          }
        } catch (error) {
          console.error('Failed to load cached image:', error);
          // Fallback to original URL
          setCachedPosterUrl(poster);
        }
      }
    };
    
    loadCachedImage();
    
    // Clean up object URLs when component unmounts or poster changes
    return () => {
      if (cachedPosterUrl && cachedPosterUrl.startsWith('blob:')) {
        URL.revokeObjectURL(cachedPosterUrl);
      }
    };
  }, [poster, movie.id]);
  
  const handleImageError = () => {
    console.error('Image failed to load:', poster);
    setImageLoadError(true);
  };
  
  return (
    <div className="relative aspect-[2/3]">
      {hasValidPoster ? (
        <img 
          src={cachedPosterUrl} 
          alt={movie.primary_title}
          className="object-cover w-full h-full"
          onError={handleImageError}
        />
      ) : (
        /* Default styled placeholder when no poster is available */
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-lavender-100 to-lavender-200 text-lavender-800">
          <div className="mb-4 p-3 rounded-full bg-white/30">
            <ImageOff className="w-16 h-16 text-lavender-600" />
          </div>
          <div className="text-center px-4">
            <p className="text-md font-medium">No poster available</p>
            <h3 className="mt-2 text-xl font-bold">{movie.primary_title}</h3>
          </div>
        </div>
      )}
      
      {movie.is_adult && (
        <Badge variant="destructive" className="absolute top-3 right-3">
          18+
        </Badge>
      )}
      
      <div className="absolute top-3 left-3 flex flex-col gap-2">
        {isSeries && (
          <Badge 
            variant="secondary" 
            className="bg-lavender-500 text-white"
          >
            {contentType === 'cartoon' ? (
              <>
                <Palette className="h-3.5 w-3.5 mr-1" />
                Cartoon
              </>
            ) : contentType === 'anime' ? (
              <>
                <Tv className="h-3.5 w-3.5 mr-1" />
                Anime
              </>
            ) : (
              <>
                <Tv className="h-3.5 w-3.5 mr-1" />
                Series
              </>
            )}
          </Badge>
        )}
        
        {!isSeries && (
          <Badge 
            variant="secondary" 
            className="bg-lavender-500 text-white"
          >
            <Film className="h-3.5 w-3.5 mr-1" />
            Movie
          </Badge>
        )}
        
        {cancelled && (
          <Badge 
            className="bg-red-500 text-white border-red-400 flex items-center gap-1"
          >
            <X className="h-3.5 w-3.5" />
            Cancelled
          </Badge>
        )}
      </div>
    </div>
  );
};
