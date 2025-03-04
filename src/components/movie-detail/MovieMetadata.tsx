
import { Calendar, Clock, Globe, Star } from 'lucide-react';
import { Movie } from '@/types/movie';

interface MovieMetadataProps {
  movie: Movie;
}

export const MovieMetadata = ({ movie }: MovieMetadataProps) => {
  return (
    <div className="space-y-2 text-sm">
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-muted-foreground" />
        <span>
          {movie.start_year}{movie.end_year ? ` - ${movie.end_year}` : ''}
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-muted-foreground" />
        <span>
          {Math.floor(movie.runtime_minutes / 60)}h {movie.runtime_minutes % 60}m
        </span>
      </div>
      
      {movie.spoken_languages && movie.spoken_languages.length > 0 && (
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-muted-foreground" />
          <span>
            {movie.spoken_languages.map(l => l.name).join(', ')}
          </span>
        </div>
      )}
      
      {movie.certificates && movie.certificates.length > 0 && (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 flex items-center justify-center">
            <span className="text-xs font-bold">R</span>
          </div>
          <span>
            {movie.certificates[0].rating} ({movie.certificates[0].country.code})
          </span>
        </div>
      )}
      
      <div className="flex items-center gap-2">
        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        <span>
          <span className="font-medium">{movie.rating.aggregate_rating.toFixed(1)}</span>
          <span className="text-muted-foreground ml-1">
            ({movie.rating.votes_count.toLocaleString()} votes)
          </span>
        </span>
      </div>
    </div>
  );
};
