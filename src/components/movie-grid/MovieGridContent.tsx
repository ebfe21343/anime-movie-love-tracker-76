
import React, { useEffect, useRef } from 'react';
import { Movie } from '@/types/movie';
import MovieCard from '@/components/MovieCard';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import MovieGridEmptyState from './MovieGridEmptyState';

interface MovieGridContentProps {
  movies: Movie[];
  filteredMovies: Movie[];
  currentMovies: Movie[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  hasMoreMovies: boolean;
  loadMoreMovies: () => void;
}

const MovieGridContent = ({
  movies,
  filteredMovies,
  currentMovies,
  searchQuery,
  setSearchQuery,
  hasMoreMovies,
  loadMoreMovies
}: MovieGridContentProps) => {
  const observerTarget = useRef<HTMLDivElement>(null);
  
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

  if (filteredMovies.length === 0) {
    return (
      <MovieGridEmptyState 
        searchQuery={searchQuery}
        onClearSearch={() => setSearchQuery('')}
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {currentMovies.map((movie) => (
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

export default MovieGridContent;
