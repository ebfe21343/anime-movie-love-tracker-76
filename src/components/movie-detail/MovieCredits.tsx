
import { useEffect, useState } from 'react';
import { Movie } from '@/types/movie';
import { getCachedImageUrl } from '@/lib/utils/image-cache';

interface MovieCreditsProps {
  movie: Movie;
}

export const MovieCredits = ({ movie }: MovieCreditsProps) => {
  const [directorImages, setDirectorImages] = useState<Record<string, string>>({});
  const [writerImages, setWriterImages] = useState<Record<string, string>>({});
  const [castImages, setCastImages] = useState<Record<string, string>>({});
  
  // Cache director images
  useEffect(() => {
    const cacheDirectorImages = async () => {
      if (movie.directors && movie.directors.length > 0) {
        const newDirectorImages: Record<string, string> = {};
        
        for (const director of movie.directors) {
          if (director.name.avatars && director.name.avatars[0]?.url) {
            try {
              const cachedUrl = await getCachedImageUrl(
                director.name.avatars[0].url,
                `${movie.id}_director_${director.name.id}`,
                'avatar'
              );
              newDirectorImages[director.name.id] = cachedUrl;
            } catch (error) {
              console.error('Failed to cache director image:', error);
              // Use original URL as fallback
              newDirectorImages[director.name.id] = director.name.avatars[0].url;
            }
          }
        }
        
        setDirectorImages(newDirectorImages);
      }
    };
    
    cacheDirectorImages();
  }, [movie.id, movie.directors]);
  
  // Cache writer images
  useEffect(() => {
    const cacheWriterImages = async () => {
      if (movie.writers && movie.writers.length > 0) {
        const newWriterImages: Record<string, string> = {};
        
        for (const writer of movie.writers) {
          if (writer.name.avatars && writer.name.avatars[0]?.url) {
            try {
              const cachedUrl = await getCachedImageUrl(
                writer.name.avatars[0].url, 
                `${movie.id}_writer_${writer.name.id}`,
                'avatar'
              );
              newWriterImages[writer.name.id] = cachedUrl;
            } catch (error) {
              console.error('Failed to cache writer image:', error);
              // Use original URL as fallback
              newWriterImages[writer.name.id] = writer.name.avatars[0].url;
            }
          }
        }
        
        setWriterImages(newWriterImages);
      }
    };
    
    cacheWriterImages();
  }, [movie.id, movie.writers]);
  
  // Cache cast images
  useEffect(() => {
    const cacheCastImages = async () => {
      if (movie.casts && movie.casts.length > 0) {
        const newCastImages: Record<string, string> = {};
        
        for (const cast of movie.casts) {
          if (cast.name.avatars && cast.name.avatars[0]?.url) {
            try {
              const cachedUrl = await getCachedImageUrl(
                cast.name.avatars[0].url,
                `${movie.id}_cast_${cast.name.id}`,
                'avatar'
              );
              newCastImages[cast.name.id] = cachedUrl;
            } catch (error) {
              console.error('Failed to cache cast image:', error);
              // Use original URL as fallback
              newCastImages[cast.name.id] = cast.name.avatars[0].url;
            }
          }
        }
        
        setCastImages(newCastImages);
      }
    };
    
    cacheCastImages();
  }, [movie.id, movie.casts]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
        {movie.directors && movie.directors.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Directed by</h4>
            <ul className="space-y-1">
              {movie.directors.map((director) => (
                <li key={director.name.id} className="flex items-center gap-2">
                  {director.name.avatars && director.name.avatars[0] ? (
                    <img 
                      src={directorImages[director.name.id] || director.name.avatars[0].url} 
                      alt={director.name.display_name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-xs">{director.name.display_name.charAt(0)}</span>
                    </div>
                  )}
                  <span>{director.name.display_name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {movie.writers && movie.writers.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Written by</h4>
            <ul className="space-y-1">
              {movie.writers.slice(0, 3).map((writer) => (
                <li key={writer.name.id} className="flex items-center gap-2">
                  {writer.name.avatars && writer.name.avatars[0] ? (
                    <img 
                      src={writerImages[writer.name.id] || writer.name.avatars[0].url} 
                      alt={writer.name.display_name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-xs">{writer.name.display_name.charAt(0)}</span>
                    </div>
                  )}
                  <span>{writer.name.display_name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {movie.casts && movie.casts.length > 0 && (
        <div className="mt-6">
          <h4 className="font-medium mb-3">Cast</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {movie.casts.map((cast) => (
              <div key={cast.name.id} className="text-center">
                <div className="relative aspect-square mb-2 overflow-hidden rounded-lg">
                  {cast.name.avatars && cast.name.avatars[0] ? (
                    <img 
                      src={castImages[cast.name.id] || cast.name.avatars[0].url} 
                      alt={cast.name.display_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <span className="text-2xl font-bold">{cast.name.display_name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <p className="font-medium text-sm line-clamp-1">{cast.name.display_name}</p>
                {cast.characters && cast.characters[0] && (
                  <p className="text-xs text-muted-foreground line-clamp-1">{cast.characters[0]}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
