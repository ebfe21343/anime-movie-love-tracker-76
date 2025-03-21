
import { Movie, Season } from '@/types/movie';
import { supabase } from "@/integrations/supabase/client";
import { fetchMovieById } from './imdb-api';
import { mapDbMovieToMovie, mapMovieToDbMovie } from './movie-mapper';
import { convertToJson } from '../utils/json-utils';

/**
 * Fetches all movies from the database
 */
export const getMovieCollection = async (): Promise<Movie[]> => {
  try {
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .order('added_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(movie => mapDbMovieToMovie(movie));
  } catch (error) {
    console.error('Error fetching movies from Supabase:', error);
    const data = localStorage.getItem('anime_movie_tracker_collection');
    return data ? JSON.parse(data) : [];
  }
};

/**
 * Adds a new movie to the collection
 */
export const addMovieToCollection = async (
  imdbId: string, 
  personalData: { 
    personal_ratings: { lyan: number; nastya: number; },
    comments: { lyan: string; nastya: string; },
    watched_by: { lyan: boolean; nastya: boolean; },
    watch_link: string,
    content_type?: string,
    cancelled?: boolean,
    seasons?: Season[]
  }
): Promise<Movie> => {
  try {
    const { data: existingMovie } = await supabase
      .from('movies')
      .select('id')
      .eq('id', imdbId)
      .single();
    
    if (existingMovie) {
      throw new Error('Movie already exists in your collection');
    }

    const movieData = await fetchMovieById(imdbId);
    
    const movieForDb = mapMovieToDbMovie(movieData, personalData);
    
    // Convert necessary fields to Json for database storage
    const movieForDbWithJson = {
      ...movieForDb,
      certificates: convertToJson(movieForDb.certificates),
      spoken_languages: convertToJson(movieForDb.spoken_languages),
      origin_countries: convertToJson(movieForDb.origin_countries),
      critic_review: convertToJson(movieForDb.critic_review),
      directors: convertToJson(movieForDb.directors),
      writers: convertToJson(movieForDb.writers),
      casts: convertToJson(movieForDb.casts),
      personal_ratings: convertToJson(movieForDb.personal_ratings),
      comments: convertToJson(movieForDb.comments),
      watched_by: convertToJson(movieForDb.watched_by),
      seasons: movieForDb.seasons ? convertToJson(movieForDb.seasons) : null
    };
    
    const { data, error } = await supabase
      .from('movies')
      .insert(movieForDbWithJson)
      .select()
      .single();
    
    if (error) throw error;
    
    return mapDbMovieToMovie(data);
  } catch (error) {
    console.error('Error adding movie to Supabase:', error);
    throw error;
  }
};

/**
 * Removes a movie from the collection
 */
export const removeMovieFromCollection = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('movies')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error removing movie from Supabase:', error);
    
    const movies = JSON.parse(localStorage.getItem('anime_movie_tracker_collection') || '[]');
    const filteredMovies = movies.filter((movie: Movie) => movie.id !== id);
    localStorage.setItem('anime_movie_tracker_collection', JSON.stringify(filteredMovies));
  }
};

/**
 * Updates an existing movie in the collection
 */
export const updateMovieInCollection = async (
  id: string,
  updates: Partial<{
    personal_ratings: { lyan: number; nastya: number; },
    comments: { lyan: string; nastya: string; },
    watched_by: { lyan: boolean; nastya: boolean; },
    watch_link: string,
    cancelled: boolean,
    content_type: string,
    seasons: Season[]
  }>
): Promise<Movie | null> => {
  try {
    const updatesForDb: any = {};
    
    if (updates.personal_ratings) {
      updatesForDb.personal_ratings = convertToJson(updates.personal_ratings);
    }
    
    if (updates.comments) {
      updatesForDb.comments = convertToJson(updates.comments);
    }
    
    if (updates.watched_by !== undefined) {
      updatesForDb.watched_by = convertToJson(updates.watched_by);
    }
    
    if (updates.watch_link !== undefined) {
      updatesForDb.watch_link = updates.watch_link;
    }
    
    if (updates.cancelled !== undefined) {
      updatesForDb.cancelled = updates.cancelled;
    }
    
    if (updates.content_type !== undefined) {
      updatesForDb.type = updates.content_type;
    }
    
    if (updates.seasons !== undefined) {
      updatesForDb.seasons = convertToJson(updates.seasons);
    }
    
    const { data, error } = await supabase
      .from('movies')
      .update(updatesForDb)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) return null;
    
    return mapDbMovieToMovie(data);
  } catch (error) {
    console.error('Error updating movie in Supabase:', error);
    
    const movies = JSON.parse(localStorage.getItem('anime_movie_tracker_collection') || '[]');
    const movieIndex = movies.findIndex((movie: Movie) => movie.id === id);
    
    if (movieIndex === -1) return null;
    
    const updatedMovie = {
      ...movies[movieIndex],
      ...updates,
    };
    
    movies[movieIndex] = updatedMovie;
    localStorage.setItem('anime_movie_tracker_collection', JSON.stringify(movies));
    
    return updatedMovie;
  }
};
