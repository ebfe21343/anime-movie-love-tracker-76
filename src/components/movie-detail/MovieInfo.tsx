
import { Movie } from '@/types/movie';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Star, ListTodo } from 'lucide-react';

interface MovieInfoProps {
  movie: Movie;
  poster: string;
  contentType: string;
  cancelled: boolean;
  inQueue?: boolean;
}

export const MovieInfo = ({ 
  movie, 
  poster, 
  contentType, 
  cancelled,
  inQueue = false
}: MovieInfoProps) => {
  let contentTypeLabel = "Movie";
  if (contentType === "series") contentTypeLabel = "TV Series";
  if (contentType === "anime") contentTypeLabel = "Anime";
  
  const year = movie.start_year || (movie.years && movie.years[0]);
  const endYear = movie.end_year || (movie.years && movie.years[1]);
  
  const imdbRating = movie.aggregate_rating || movie.rating;
  
  return (
    <div className="relative">
      <div className={cn(
        "relative aspect-[2/3] rounded-tl-2xl rounded-tr-2xl overflow-hidden",
        cancelled && "opacity-70"
      )}>
        <img
          src={poster}
          alt={movie.primary_title}
          className="object-cover h-full w-full"
        />
        
        <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-black/50 to-transparent" />
        
        <div className="absolute top-0 left-0 w-full p-2 flex flex-wrap gap-1">
          <Badge className="bg-lavender-500 text-white border-none font-normal">
            {contentTypeLabel}
          </Badge>
          
          {cancelled && (
            <Badge variant="destructive" className="border-none font-normal">
              Cancelled
            </Badge>
          )}
          
          {inQueue && (
            <Badge className="bg-sakura-500 text-white border-none font-normal flex items-center gap-1">
              <ListTodo className="w-3 h-3" />
              Watch Queue
            </Badge>
          )}
        </div>
        
        {/* Rating Badge over the image */}
        {imdbRating && !inQueue && (
          <div className="absolute bottom-0 right-0 p-2">
            <Badge className="bg-yellow-500/90 text-black border-none font-semibold flex items-center">
              <Star className="w-3 h-3 fill-current mr-1" />
              {imdbRating} IMDb
            </Badge>
          </div>
        )}
        
        {/* Year Range at bottom left */}
        {year && (
          <div className="absolute bottom-0 left-0 p-2">
            <Badge variant="outline" className="bg-black/50 border-none text-white font-normal">
              {year}{endYear && endYear !== year ? `-${endYear}` : ""}
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
};
