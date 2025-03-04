
import { Film, Palette, Tv, X } from 'lucide-react';
import { Movie } from '@/types/movie';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface MovieInfoProps {
  movie: Movie;
  poster: string;
  contentType: string;
  cancelled: boolean;
}

export const MovieInfo = ({ movie, poster, contentType, cancelled }: MovieInfoProps) => {
  const isSeries = contentType === 'series' || contentType === 'anime' || contentType === 'cartoon';
  
  return (
    <div className="relative aspect-[2/3]">
      <img 
        src={poster} 
        alt={movie.primary_title}
        className="object-cover w-full h-full"
      />
      
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
