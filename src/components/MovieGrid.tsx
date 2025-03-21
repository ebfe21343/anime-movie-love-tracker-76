
import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { Movie } from '@/types/movie';
import MovieCard from './MovieCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, ChevronDown, ArrowUp, ArrowDown, CalendarDays, Star, ListFilter } from 'lucide-react';

interface MovieGridProps {
  movies: Movie[];
}

type SortCategory = 'recently_added' | 'rating' | 'year' | 'personal' | 'type';

type SortDirection = 'asc' | 'desc';

interface SortState {
  category: SortCategory;
  direction: SortDirection;
}

type ViewMode = 'completed' | 'queue';

const MOVIES_PER_PAGE = 10;

const MovieGrid = ({ movies }: MovieGridProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortState, setSortState] = useState<SortState>({
    category: 'recently_added',
    direction: 'desc'
  });
  const [visibleMoviesCount, setVisibleMoviesCount] = useState(MOVIES_PER_PAGE);
  const [viewMode, setViewMode] = useState<ViewMode>('completed');
  const observerTarget = useRef<HTMLDivElement>(null);
  
  const effectiveSortOption = useMemo(() => {
    switch (sortState.category) {
      case 'rating':
        return sortState.direction === 'desc' ? 'rating_high' : 'rating_low';
      case 'year':
        return sortState.direction === 'desc' ? 'year_new' : 'year_old';
      case 'personal':
        return sortState.direction === 'desc' ? 'personal_high' : 'personal_low';
      case 'type':
        return sortState.direction === 'desc' ? 'type_asc' : 'type_desc';
      case 'recently_added':
      default:
        return sortState.direction === 'desc' ? 'recently_added' : 'recently_added_asc';
    }
  }, [sortState]);

  const filteredAndSortedMovies = useMemo(() => {
    // First filter by queue/completed status
    const queueFiltered = movies.filter(movie => 
      viewMode === 'queue' ? movie.in_queue : !movie.in_queue
    );
    
    // Then apply search filter
    const searchFiltered = searchQuery 
      ? queueFiltered.filter(movie => 
          movie.primary_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          movie.genres.some(genre => genre.toLowerCase().includes(searchQuery.toLowerCase())) ||
          movie.comments.lyan.toLowerCase().includes(searchQuery.toLowerCase()) ||
          movie.comments.nastya.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (movie.seasons && movie.seasons.some(season => 
            season.comments.lyan.toLowerCase().includes(searchQuery.toLowerCase()) ||
            season.comments.nastya.toLowerCase().includes(searchQuery.toLowerCase())
          ))
        )
      : queueFiltered;
    
    return [...searchFiltered].sort((a, b) => {
      switch (effectiveSortOption) {
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
        case 'type_asc':
          // Order by: Movie, Series, Cartoon, Anime
          const typeOrderA = getTypeOrder(a.content_type);
          const typeOrderB = getTypeOrder(b.content_type);
          return typeOrderA - typeOrderB;
        case 'type_desc':
          // Order by: Anime, Cartoon, Series, Movie
          const typeOrderADesc = getTypeOrder(a.content_type);
          const typeOrderBDesc = getTypeOrder(b.content_type);
          return typeOrderBDesc - typeOrderADesc;
        case 'recently_added':
          return new Date(b.added_at).getTime() - new Date(a.added_at).getTime();
        case 'recently_added_asc':
          return new Date(a.added_at).getTime() - new Date(b.added_at).getTime();
        default:
          return new Date(b.added_at).getTime() - new Date(a.added_at).getTime();
      }
    });
  }, [movies, searchQuery, effectiveSortOption, viewMode]);

  // Helper function to get numeric order for content types
  const getTypeOrder = (type: string | undefined): number => {
    switch (type) {
      case 'movie': return 1;
      case 'series': return 2;
      case 'cartoon': return 3;
      case 'anime': return 4;
      default: return 5; // Unknown types at the end
    }
  };

  const handleSortClick = (category: SortCategory) => {
    setSortState(prev => {
      if (prev.category === category) {
        return {
          category,
          direction: prev.direction === 'desc' ? 'asc' : 'desc'
        };
      }
      return {
        category,
        direction: 'desc'
      };
    });
  };

  const getSortIcon = () => {
    return sortState.direction === 'desc' ? 
      <ArrowDown className="h-4 w-4" /> : 
      <ArrowUp className="h-4 w-4" />;
  };

  const getSortLabel = () => {
    const directionText = sortState.direction === 'desc' ? 'Newest' : 'Oldest';
    const highLowText = sortState.direction === 'desc' ? 'Highest' : 'Lowest';
    const typeOrderText = sortState.direction === 'desc' ? 'A-Z' : 'Z-A';

    switch (sortState.category) {
      case 'recently_added': return `${directionText} Added`;
      case 'rating': return `${highLowText} IMDb Rating`;
      case 'year': return `${directionText} Released`;
      case 'personal': return `${highLowText} Personal Rating`;
      case 'type': return `Type ${typeOrderText}`;
      default: return 'Sort By';
    }
  };

  const handleViewModeChange = (value: string) => {
    setViewMode(value as ViewMode);
    // Reset pagination when switching views
    setVisibleMoviesCount(MOVIES_PER_PAGE);
  };

  useEffect(() => {
    setVisibleMoviesCount(MOVIES_PER_PAGE);
  }, [searchQuery, sortState]);

  const loadMoreMovies = useCallback(() => {
    if (visibleMoviesCount < filteredAndSortedMovies.length) {
      setVisibleMoviesCount(prev => prev + MOVIES_PER_PAGE);
    }
  }, [visibleMoviesCount, filteredAndSortedMovies.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreMovies();
        }
      },
      { threshold: 0.1 }
    );

    const currentObserver = observerTarget.current;
    if (currentObserver) {
      observer.observe(currentObserver);
    }

    return () => {
      if (currentObserver) {
        observer.unobserve(currentObserver);
      }
    };
  }, [loadMoreMovies]);

  const currentMovies = filteredAndSortedMovies.slice(0, visibleMoviesCount);
  const hasMoreMovies = visibleMoviesCount < filteredAndSortedMovies.length;

  return (
    <div className="w-full animate-fade-in">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex gap-4 items-center">
          <Tabs 
            defaultValue="completed" 
            value={viewMode} 
            onValueChange={handleViewModeChange}
            className="bg-white/50 backdrop-blur-sm rounded-lg p-1 border border-sakura-200"
          >
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="queue">In Queue</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, genre, or comments (including season comments)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/50 backdrop-blur-sm border-sakura-200 focus-visible:ring-sakura-400"
          />
        </div>
        
        <div className="flex gap-2 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-white/50 backdrop-blur-sm border-sakura-200"
              >
                {sortState.category === 'recently_added' && <CalendarDays className="h-4 w-4" />}
                {sortState.category === 'rating' && <Star className="h-4 w-4" />}
                {sortState.category === 'personal' && <Star className="h-4 w-4 fill-current" />}
                {sortState.category === 'year' && <CalendarDays className="h-4 w-4" />}
                {sortState.category === 'type' && <ListFilter className="h-4 w-4" />}
                {getSortLabel()}
                {getSortIcon()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white border-sakura-200">
              <DropdownMenuItem onClick={() => handleSortClick('recently_added')} className="cursor-pointer">
                <CalendarDays className="h-4 w-4 mr-2" />
                <span>Recently Added</span>
                {sortState.category === 'recently_added' && getSortIcon()}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortClick('personal')} className="cursor-pointer">
                <Star className="h-4 w-4 fill-current mr-2" />
                <span>Personal Rating</span>
                {sortState.category === 'personal' && getSortIcon()}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortClick('rating')} className="cursor-pointer">
                <Star className="h-4 w-4 mr-2" />
                <span>IMDb Rating</span>
                {sortState.category === 'rating' && getSortIcon()}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortClick('year')} className="cursor-pointer">
                <CalendarDays className="h-4 w-4 mr-2" />
                <span>Release Date</span>
                {sortState.category === 'year' && getSortIcon()}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortClick('type')} className="cursor-pointer">
                <ListFilter className="h-4 w-4 mr-2" />
                <span>Type</span>
                {sortState.category === 'type' && getSortIcon()}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
              : viewMode === 'queue'
                ? "Your queue is empty. Add movies to your queue to see them here."
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
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {currentMovies.map((movie) => (
              <div key={movie.id} className="animate-enter" style={{ animationDelay: '0ms' }}>
                <MovieCard movie={movie} queueMode={viewMode === 'queue'} />
              </div>
            ))}
          </div>
          
          {hasMoreMovies && (
            <div 
              ref={observerTarget} 
              className="flex justify-center items-center py-8 mt-4"
            >
              <div className="relative w-10 h-10">
                <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-sakura-200 opacity-25"></div>
                <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-sakura-500 border-t-transparent animate-spin"></div>
              </div>
            </div>
          )}

          {hasMoreMovies && (
            <div className="flex justify-center mt-4">
              <Button 
                variant="outline" 
                onClick={loadMoreMovies}
                className="flex items-center gap-2"
              >
                Load More <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MovieGrid;
