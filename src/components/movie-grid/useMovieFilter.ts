import { useMemo, useState } from 'react';
import { Movie } from '@/types/movie';
import { SortCategory, SortDirection, SortState } from './MovieGridSearchBar';
import { ArrowUp, ArrowDown } from 'lucide-react';

export const MOVIES_PER_PAGE = 10;

export function useMovieFilter(movies: Movie[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortState, setSortState] = useState<SortState>({
    category: 'recently_added',
    direction: 'desc'
  });
  const [visibleMoviesCount, setVisibleMoviesCount] = useState(MOVIES_PER_PAGE);

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
    const filtered = searchQuery 
      ? movies.filter(movie => 
          movie.primary_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          movie.genres.some(genre => genre.toLowerCase().includes(searchQuery.toLowerCase())) ||
          movie.comments.lyan.toLowerCase().includes(searchQuery.toLowerCase()) ||
          movie.comments.nastya.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (movie.seasons && movie.seasons.some(season => 
            season.comments.lyan.toLowerCase().includes(searchQuery.toLowerCase()) ||
            season.comments.nastya.toLowerCase().includes(searchQuery.toLowerCase())
          )) ||
          (movie.in_queue === (searchQuery.toLowerCase() === 'queue')) ||
          (movie.waiting === (searchQuery.toLowerCase() === 'waiting'))
        )
      : movies;
    
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
          const avgA = (a.personal_ratings.lyan + a.personal_ratings.nastya) / 2;
          const avgB = (b.personal_ratings.lyan + b.personal_ratings.nastya) / 2;
          return avgB - avgA;
        case 'personal_low':
          const avgALow = (a.personal_ratings.lyan + a.personal_ratings.nastya) / 2;
          const avgBLow = (b.personal_ratings.lyan + b.personal_ratings.nastya) / 2;
          return avgALow - avgBLow;
        case 'recently_added':
          return new Date(b.added_at || 0).getTime() - new Date(a.added_at || 0).getTime();
        case 'recently_added_asc':
          return new Date(a.added_at || 0).getTime() - new Date(b.added_at || 0).getTime();
        default:
          return new Date(b.added_at || 0).getTime() - new Date(a.added_at || 0).getTime();
      }
    });
  }, [movies, searchQuery, effectiveSortOption]);

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
      ArrowDown : 
      ArrowUp;
  };

  const getSortLabel = () => {
    const directionText = sortState.direction === 'desc' ? 'Newest' : 'Oldest';
    const highLowText = sortState.direction === 'desc' ? 'Highest' : 'Lowest';

    switch (sortState.category) {
      case 'recently_added': return `${directionText} Added`;
      case 'rating': return `${highLowText} IMDb Rating`;
      case 'year': return `${directionText} Released`;
      case 'personal': return `${highLowText} Personal Rating`;
      default: return 'Sort By';
    }
  };

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
  const isQueueView = movies.some(movie => movie.in_queue);
  const isWaitingView = movies.some(movie => movie.waiting);

  return {
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
    visibleMoviesCount,
  };
}
