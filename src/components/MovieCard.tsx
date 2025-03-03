
import { Link } from 'react-router-dom';
import { Star, Calendar } from 'lucide-react';
import { Movie } from '@/types/movie';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const poster = movie.posters[0]?.url || '/placeholder.svg';
  const releaseYear = movie.start_year;
  const endYear = movie.end_year ? ` - ${movie.end_year}` : '';
  
  // Calculate average personal rating
  const avgPersonalRating = ((movie.personal_ratings.lyan + movie.personal_ratings.nastya) / 2).toFixed(1);

  return (
    <Link to={`/movie/${movie.id}`}>
      <Card className="overflow-hidden card-hover h-full border-none glass rounded-2xl">
        <div className="relative aspect-[2/3] overflow-hidden rounded-t-2xl">
          {/* Poster image with optimization */}
          <img 
            src={poster} 
            alt={movie.primary_title}
            className="object-cover w-full h-full" 
            loading="lazy"
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
          <div className="flex justify-between items-center mb-1">
            <h3 className="font-bold text-lg line-clamp-1 flex-1">{movie.primary_title}</h3>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{releaseYear}{endYear}</span>
            </div>
          </div>
          
          <div className="flex items-center">
            {/* Average personal rating */}
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-lavender-500 text-lavender-500" />
              <span className="font-medium">{avgPersonalRating}</span>
              <span className="text-xs text-muted-foreground">Rating</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default MovieCard;
