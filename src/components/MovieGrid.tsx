
import { useEffect } from 'react';
import { Movie } from '@/types/movie';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import MovieGridSearchBar from './movie-grid/MovieGridSearchBar';
import EmptyMovieState from './movie-grid/EmptyMovieState';
import MovieList from './movie-grid/MovieList';
import { useMovieFilter } from './movie-grid/useMovieFilter';

interface MovieGridProps {
  movies: Movie[];
}

const MovieGrid = ({ movies }: MovieGridProps) => {
  const {
    searchQuery,
    setSearchQuery,
    sortState,
    setSortState,
    activeTab,
    setActiveTab,
    currentMovies,
    hasMoreMovies,
    loadMoreMovies,
    resetVisibleMoviesCount,
    filteredAndSortedMovies,
    collectionCount,
    queueCount
  } = useMovieFilter(movies);

  // Reset visible movies count when filters change
  useEffect(() => {
    resetVisibleMoviesCount();
  }, [searchQuery, sortState, activeTab]);

  return (
    <div className="w-full animate-fade-in">
      <Tabs defaultValue="collection">
        <MovieGridSearchBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortState={sortState}
          setSortState={setSortState}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          collectionCount={collectionCount}
          queueCount={queueCount}
        />
        
        <TabsContent value="collection" className="mt-0">
          {filteredAndSortedMovies.length === 0 ? (
            <EmptyMovieState 
              searchQuery={searchQuery} 
              activeTab={activeTab}
              onClearSearch={() => setSearchQuery('')}
            />
          ) : (
            <MovieList 
              movies={currentMovies}
              visibleMoviesCount={currentMovies.length}
              hasMoreMovies={hasMoreMovies}
              loadMoreMovies={loadMoreMovies}
            />
          )}
        </TabsContent>
        
        <TabsContent value="queue" className="mt-0">
          {filteredAndSortedMovies.length === 0 ? (
            <EmptyMovieState 
              searchQuery={searchQuery} 
              activeTab={activeTab}
              onClearSearch={() => setSearchQuery('')}
            />
          ) : (
            <MovieList 
              movies={currentMovies}
              visibleMoviesCount={currentMovies.length}
              hasMoreMovies={hasMoreMovies}
              loadMoreMovies={loadMoreMovies}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MovieGrid;
