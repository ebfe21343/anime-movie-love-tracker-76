
import { useEffect } from 'react';
import { Movie } from '@/types/movie';
import MovieGridSearchBar from './movie-grid/MovieGridSearchBar';
import MovieGridContent from './movie-grid/MovieGridContent';
import { useMovieFilter } from './movie-grid/useMovieFilter';

interface MovieGridProps {
  movies: Movie[];
  showSearchBar?: boolean;
}

const MovieGrid = ({ movies, showSearchBar = true }: MovieGridProps) => {
  const {
    searchQuery,
    setSearchQuery,
    sortState,
    handleSortClick,
    getSortIcon,
    getSortLabel,
    filteredAndSortedMovies,
    currentMovies,
    hasMoreMovies,
    loadMoreMovies,
    resetVisibleMoviesCount,
    isQueueView,
    isWaitingView,
  } = useMovieFilter(movies);

  // Reset visible movies count when search query or sort state changes
  useEffect(() => {
    resetVisibleMoviesCount();
  }, [searchQuery, sortState]);

  return (
    <div className="w-full animate-fade-in">
      {showSearchBar && (
        <MovieGridSearchBar 
          movies={movies}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortState={sortState}
          handleSortClick={handleSortClick}
          getSortLabel={getSortLabel}
          getSortIcon={getSortIcon}
          isQueueView={isQueueView}
          isWaitingView={isWaitingView}
        />
      )}
      
      <MovieGridContent
        movies={movies}
        filteredMovies={filteredAndSortedMovies}
        currentMovies={currentMovies}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        hasMoreMovies={hasMoreMovies}
        loadMoreMovies={loadMoreMovies}
      />
    </div>
  );
};

// For backwards compatibility
MovieGrid.SearchAndFilterBar = MovieGridSearchBar;

export default MovieGrid;
