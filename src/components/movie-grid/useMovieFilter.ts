
import { useMemo, useState } from 'react';
import { Movie } from '@/types/movie';
import { SortCategory, SortDirection, SortState } from './types';

const MOVIES_PER_PAGE = 10;

export const useMovieFilter = (movies: Movie[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortState, setSortState] = useState<SortState>({
    category: 'recently_added',
    direction: 'desc'
  });
  const [visibleMoviesCount, setVisibleMoviesCount] = useState(MOVIES_PER_PAGE);
  const [activeTab, setActiveTab] = useState<'collection' | 'queue'>('collection');
  
  const effectiveSortOption = useMemo(() => {
    switch (sortState.category) {
      case 'rating':
        return sortState.direction === 'desc' ? 'rating_high' : 'rating_low';
      case 'year':
        return sortState.direction === 'desc' ? 'year_new' : 'year_old';
      case 'personal':
        return sortState.direction === 'desc' ? 'personal_high' : 'personal_low';
      case 'recently_added':
      default:
        return sortState.direction === 'desc' ? 'recently_added' : 'recently_added_asc';
    }
  }, [sortState]);

  const filteredAndSortedMovies = useMemo(() => {
    // First, filter by collection/queue
    const collectionFiltered = activeTab === 'collection' 
      ? movies.filter(movie => !movie.in_queue)
      : movies.filter(movie => movie.in_queue);
    
    // Then filter by search query
    const filtered = searchQuery 
      ? collectionFiltered.filter(movie => 
          movie.primary_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          movie.genres.some(genre => genre.toLowerCase().includes(searchQuery.toLowerCase())) ||
          movie.comments.lyan?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          movie.comments.nastya?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (movie.seasons && movie.seasons.some(season => 
            season.comments.lyan?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            season.comments.nastya?.toLowerCase().includes(searchQuery.toLowerCase())
          )) ||
          (movie.in_queue === (searchQuery.toLowerCase() === 'queue'))
        )
      : collectionFiltered;
    
    return [...filtered].sort((a, b) => {
      switch (effectiveSortOption) {
        case 'rating_high':
          return (b.rating?.aggregate_rating || 0) - (a.rating?.aggregate_rating || 0);
        case 'rating_low':
          return (a.rating?.aggregate_rating || 0) - (b.rating?.aggregate_rating || 0);
        case 'year_new':
          return (b.start_year || 0) - (a.start_year || 0);
        case 'year_old':
          return (a.start_year || 0) - (b.start_year || 0);
        case 'personal_high':
          const avgA = ((a.personal_ratings?.lyan || 0) + (a.personal_ratings?.nastya || 0)) / 2;
          const avgB = ((b.personal_ratings?.lyan || 0) + (b.personal_ratings?.nastya || 0)) / 2;
          return avgB - avgA;
        case 'personal_low':
          const avgALow = ((a.personal_ratings?.lyan || 0) + (a.personal_ratings?.nastya || 0)) / 2;
          const avgBLow = ((b.personal_ratings?.lyan || 0) + (b.personal_ratings?.nastya || 0)) / 2;
          return avgALow - avgBLow;
        case 'recently_added':
          return new Date(b.added_at || 0).getTime() - new Date(a.added_at || 0).getTime();
        case 'recently_added_asc':
          return new Date(a.added_at || 0).getTime() - new Date(b.added_at || 0).getTime();
        default:
          return new Date(b.added_at || 0).getTime() - new Date(a.added_at || 0).getTime();
      }
    });
  }, [movies, searchQuery, effectiveSortOption, activeTab]);

  const resetVisibleMoviesCount = () => {
    setVisibleMoviesCount(MOVIES_PER_PAGE);
  };

  const loadMoreMovies = () => {
    if (visibleMoviesCount < filteredAndSortedMovies.length) {
      setVisibleMoviesCount(prev => prev + MOVIES_PER_PAGE);
    }
  };

  const currentMovies = filteredAndSortedMovies.slice(0, visibleMoviesCount);
  const hasMoreMovies = visibleMoviesCount < filteredAndSortedMovies.length;

  // Count for each category
  const collectionCount = movies.filter(movie => !movie.in_queue).length;
  const queueCount = movies.filter(movie => movie.in_queue).length;

  return {
    searchQuery,
    setSearchQuery,
    sortState,
    setSortState,
    activeTab,
    setActiveTab,
    visibleMoviesCount,
    currentMovies,
    hasMoreMovies,
    loadMoreMovies,
    resetVisibleMoviesCount,
    filteredAndSortedMovies,
    collectionCount,
    queueCount
  };
};
