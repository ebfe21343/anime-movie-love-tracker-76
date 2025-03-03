
import { Link } from 'react-router-dom';
import { Star, Clock, Calendar, Globe } from 'lucide-react';
import { Movie } from '@/types/movie';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const poster = movie.posters[0]?.url || '/placeholder.svg';
  const releaseYear = movie.start_year;
  const endYear = movie.end_year ? ` - ${movie.end_year}` : '';
  
  // Calculate runtime in hours and minutes
  const hours = Math.floor(movie.runtime_minutes / 60);
  const minutes = movie.runtime_minutes % 60;
  const runtime = hours > 0 
    ? `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`
    : `${minutes}m`;
  
  // Calculate average personal rating
  const avgPersonalRating = (movie.personal_ratings.lyan + movie.personal_ratings.nastya) / 2;

  return (
    <Link to={`/movie/${movie.id}`}>
      <Card className="overflow-hidden card-hover h-full border-none glass rounded-2xl">
        <div className="relative aspect-[2/3] overflow-hidden rounded-t-2xl">
          {/* Poster image with optimization */}
          <img 
            src={poster} 
            alt={movie.primary_title}
            className="object-cover w-full h-full transform scale-[1.01]" 
            loading="lazy"
            style={{
              imageRendering: 'auto',
              objectPosition: 'center'
            }}
          />
          
          {/* Adult badge */}
          {movie.is_adult && (
            <Badge variant="destructive" className="absolute top-2 right-2">
              18+
            </Badge>
          )}
          
          {/* Genres */}
          <div className="absolute bottom-0 left-0 right-0 p-3 flex flex-wrap gap-1 bg-gradient-to-t from-black/70 to-transparent">
            {movie.genres.slice(0, 3).map(genre => (
              <Badge 
                key={genre} 
                variant="secondary"
                className="bg-lavender-500/80 text-white text-xs"
              >
                {genre}
              </Badge>
            ))}
          </div>
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-bold text-lg mb-1 line-clamp-1">{movie.primary_title}</h3>
          
          <div className="flex items-center gap-5 text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{releaseYear}{endYear}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{runtime}</span>
            </div>
            
            {movie.origin_countries[0] && (
              <div className="flex items-center gap-1">
                <Globe className="w-3 h-3" />
                <span>{movie.origin_countries[0].code}</span>
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center">
            {/* IMDb rating */}
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{movie.rating.aggregate_rating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">IMDb</span>
            </div>
            
            {/* Personal ratings */}
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                getScoreColor(movie.personal_ratings.lyan)
              )}>
                L
              </div>
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                getScoreColor(movie.personal_ratings.nastya)
              )}>
                N
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

function getScoreColor(score: number) {
  if (score >= 8) return "bg-mint-500 text-white";
  if (score >= 6) return "bg-lavender-500 text-white";
  if (score >= 4) return "bg-amber-500 text-white";
  return "bg-sakura-500 text-white";
}

export default MovieCard;
