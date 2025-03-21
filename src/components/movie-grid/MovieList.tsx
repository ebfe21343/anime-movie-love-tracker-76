
import { useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MovieCard from '@/components/MovieCard';
import { Movie } from '@/types/movie';

interface MovieListProps {
  movies: Movie[];
  visibleMoviesCount: number;
  hasMoreMovies: boolean;
  loadMoreMovies: () => void;
}

const MovieList = ({ 
  movies, 
  visibleMoviesCount, 
  hasMoreMovies, 
  loadMoreMovies 
}: MovieListProps) => {
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Intersection observer setup for infinite loading
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

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <div key={movie.id} className="animate-enter" style={{ animationDelay: '0ms' }}>
            <MovieCard movie={movie} />
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
  );
};

export default MovieList;
