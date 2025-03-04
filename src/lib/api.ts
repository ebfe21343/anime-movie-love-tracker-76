
// Re-export all API functions and utilities from their respective modules
export { fetchMovieById } from './api/imdb-api';
export { 
  getMovieCollection,
  addMovieToCollection,
  removeMovieFromCollection,
  updateMovieInCollection
} from './api/movie-api';
export { safeParseJson, convertToJson } from './utils/json-utils';
