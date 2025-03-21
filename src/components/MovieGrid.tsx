
import { useEffect } from 'react';
import { Movie } from '@/types/movie';
import MovieGridSearchBar from './movie-grid/MovieGridSearchBar';
import MovieGridContent from './movie-grid/MovieGridContent';
import { useMovieFilter } from './movie-grid/useMovieFilter';

interface MovieGridProps {
  movies: Movie[];
  showSearchBar?: boolean;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  sortState?: any;
  handleSortClick?: (category: any) => void;
  getSortIcon?: () => any;
  getSortLabel?: () => string;
}

const MovieGrid = ({ 
  movies, 
  showSearchBar = true,
  searchQuery,
  setSearchQuery,
  sortState,
  handleSortClick,
  getSortIcon,
  getSortLabel
}: MovieGridProps) => {
  const {
    searchQuery: localSearchQuery,
    setSearchQuery: localSetSearchQuery,
    sortState: localSortState,
    handleSortClick: localHandleSortClick,
    getSortIcon: localGetSortIcon,
    getSortLabel: localGetSortLabel,
    filteredAndSortedMovies,
    currentMovies,
    hasMoreMovies,
    loadMoreMovies,
    resetVisibleMoviesCount,
    isQueueView,
    isWaitingView,
  } = useMovieFilter(movies);

  // Use props if provided, otherwise use local state
  const effectiveSearchQuery = searchQuery !== undefined ? searchQuery : localSearchQuery;
  const effectiveSetSearchQuery = setSearchQuery || localSetSearchQuery;
  const effectiveSortState = sortState || localSortState;
  const effectiveHandleSortClick = handleSortClick || localHandleSortClick;
  const effectiveGetSortIcon = getSortIcon || localGetSortIcon;
  const effectiveGetSortLabel = getSortLabel || localGetSortLabel;

  // Reset visible movies count when search query or sort state changes
  useEffect(() => {
    resetVisibleMoviesCount();
  }, [effectiveSearchQuery, effectiveSortState, resetVisibleMoviesCount]);

  return (
    <div className="w-full animate-fade-in">
      {showSearchBar && (
        <MovieGridSearchBar 
          movies={movies}
          searchQuery={effectiveSearchQuery}
          setSearchQuery={effectiveSetSearchQuery}
          sortState={effectiveSortState}
          handleSortClick={effectiveHandleSortClick}
          getSortLabel={effectiveGetSortLabel}
          getSortIcon={effectiveGetSortIcon}
          isQueueView={isQueueView}
          isWaitingView={isWaitingView}
        />
      )}
      
      <MovieGridContent
        movies={movies}
        filteredMovies={filteredAndSortedMovies}
        currentMovies={currentMovies}
        searchQuery={effectiveSearchQuery}
        setSearchQuery={effectiveSetSearchQuery}
        hasMoreMovies={hasMoreMovies}
        loadMoreMovies={loadMoreMovies}
      />
    </div>
  );
};

// For backwards compatibility
MovieGrid.SearchAndFilterBar = MovieGridSearchBar;

export default MovieGrid;
