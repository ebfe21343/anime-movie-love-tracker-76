
import { Badge } from '@/components/ui/badge';
import { Star, Clock } from 'lucide-react';
import { Movie } from '@/types/movie';

interface MovieInfoProps {
  movie: Movie;
  poster: string;
  contentType: string;
  cancelled: boolean;
  inQueue?: boolean;
}

export function MovieInfo({ movie, poster, contentType, cancelled, inQueue = false }: MovieInfoProps) {
  const formattedDate = movie.start_year + (movie.end_year ? ` - ${movie.end_year}` : '');
  const avgRating = ((movie.personal_ratings.lyan + movie.personal_ratings.nastya) / 2).toFixed(1);
  
  return (
    <div>
      <div className="relative aspect-[2/3] overflow-hidden">
        {poster ? (
          <img 
            src={poster} 
            alt={movie.primary_title} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            No poster available
          </div>
        )}
        
        {/* Cancelled status */}
        {cancelled && (
          <div className="absolute top-0 right-0 left-0 bg-red-500/90 text-white text-center py-1 px-2 text-sm font-medium">
            Cancelled
          </div>
        )}
        
        {/* In Queue status */}
        {inQueue && (
          <div className="absolute bottom-0 right-0 left-0 bg-amber-500/90 text-white text-center py-1 px-2 text-sm font-medium flex items-center justify-center gap-1">
            <Clock className="h-4 w-4" />
            In Queue
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-gray-200 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs px-2 py-0 font-medium border-lavender-400 text-lavender-700">
            {contentType.charAt(0).toUpperCase() + contentType.slice(1)}
          </Badge>
          <span className="text-sm text-gray-600">{formattedDate}</span>
        </div>
        
        {!inQueue && (
          <div className="flex justify-between items-center mt-1">
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-600">Our rating:</span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" /> 
                <span className="font-semibold">{avgRating}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <span className="text-xs bg-yellow-400 text-black px-1 rounded font-medium">IMDb</span>
              <span className="font-semibold">{movie.rating.aggregate_rating.toFixed(1)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
