
import { useState, useMemo } from 'react';
import { Movie } from '@/types/movie';
import MovieCard from './MovieCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpDown, Search, Star, Calendar } from 'lucide-react';

interface MovieGridProps {
  movies: Movie[];
}

type SortOption = 
  | 'recently_added' 
  | 'rating_high' 
  | 'rating_low' 
  | 'year_new' 
  | 'year_old'
  | 'personal_high'
  | 'personal_low';

const MovieGrid = ({ movies }: MovieGridProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recently_added');
  
  const filteredAndSortedMovies = useMemo(() => {
    // Filter movies by search query
    const filtered = searchQuery 
      ? movies.filter(movie => 
          movie.primary_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          movie.genres.some(genre => genre.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      : movies;
    
    // Sort movies
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'rating_high':
          return b.rating.aggregate_rating - a.rating.aggregate_rating;
        case 'rating_low':
          return a.rating.aggregate_rating - b.rating.aggregate_rating;
        case 'year_new':
          return b.start_year - a.start_year;
        case 'year_old':
          return a.start_year - b.start_year;
        case 'personal_high':
          const avgA = (a.personal_ratings.lyan + a.personal_ratings.nastya) / 2;
          const avgB = (b.personal_ratings.lyan + b.personal_ratings.nastya) / 2;
          return avgB - avgA;
        case 'personal_low':
          const avgALow = (a.personal_ratings.lyan + a.personal_ratings.nastya) / 2;
          const avgBLow = (b.personal_ratings.lyan + b.personal_ratings.nastya) / 2;
          return avgALow - avgBLow;
        case 'recently_added':
        default:
          return new Date(b.added_at).getTime() - new Date(a.added_at).getTime();
      }
    });
  }, [movies, searchQuery, sortBy]);

  return (
    <div className="w-full animate-fade-in">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search movies by title or genre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/50 backdrop-blur-sm border-sakura-200 focus-visible:ring-sakura-400"
          />
        </div>
        
        {/* Sort select */}
        <div className="flex gap-2 items-center">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <Select 
            defaultValue="recently_added"
            onValueChange={(value) => setSortBy(value as SortOption)}
          >
            <SelectTrigger className="w-[200px] bg-white/50 backdrop-blur-sm border-sakura-200 focus:ring-sakura-400">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recently_added">Recently Added</SelectItem>
              <SelectItem value="rating_high">Highest IMDb Rating</SelectItem>
              <SelectItem value="rating_low">Lowest IMDb Rating</SelectItem>
              <SelectItem value="year_new">Newest First</SelectItem>
              <SelectItem value="year_old">Oldest First</SelectItem>
              <SelectItem value="personal_high">Highest Personal Rating</SelectItem>
              <SelectItem value="personal_low">Lowest Personal Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {filteredAndSortedMovies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 mb-4 rounded-full bg-muted/50 flex items-center justify-center">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium mb-2">No movies found</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery 
              ? `No movies match "${searchQuery}"`
              : "Your collection is empty. Add your first movie!"
            }
          </p>
          {searchQuery && (
            <Button 
              variant="outline" 
              onClick={() => setSearchQuery('')}
            >
              Clear Search
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredAndSortedMovies.map((movie) => (
            <div key={movie.id} className="animate-enter" style={{ animationDelay: '0ms' }}>
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieGrid;
