
import { Movie, MovieResponse } from '@/types/movie';
import { supabase } from "@/integrations/supabase/client";
import { Json } from '@/integrations/supabase/types';

const IMDB_API_ENDPOINT = 'https://graph.imdbapi.dev/v1';

export async function fetchMovieById(id: string): Promise<Omit<Movie, 'personal_ratings' | 'comments' | 'watch_link' | 'added_at'>> {
  const query = `
    query titleById {
      title(id: "${id}") {
        id
        type
        is_adult
        primary_title
        original_title
        start_year
        end_year
        runtime_minutes
        plot
        rating {
          aggregate_rating
          votes_count
        }
        genres
        posters {
          url
          width
          height
        }
        certificates {
          country {
            code
            name
          }
          rating
        }
        spoken_languages {
          code
          name
        }
        origin_countries {
          code
          name
        }
        critic_review {
          score
          review_count
        }
        directors: credits(first: 5, categories: ["director"]) {
          name {
            id
            display_name
            avatars {
              url
              width
              height
            }
          }
        }
        writers: credits(first: 5, categories: ["writer"]) {
          name {
            id
            display_name
            avatars {
              url
              width
              height
            }
          }
        }
        casts: credits(first: 5, categories: ["actor", "actress"]) {
          name {
            id
            display_name
            avatars {
              url
              width
              height
            }
          }
          characters
        }
      }
    }
  `;

  try {
    const response = await fetch(IMDB_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const responseData: MovieResponse = await response.json();
    return responseData.data.title;
  } catch (error) {
    console.error('Error fetching movie:', error);
    throw error;
  }
}

// Helper function to safely parse JSON data from Supabase
function safeParseJson<T>(json: Json | null, defaultValue: T): T {
  if (json === null) return defaultValue;
  try {
    if (typeof json === 'object') return json as unknown as T;
    return JSON.parse(json as string) as T;
  } catch (e) {
    console.error('Error parsing JSON:', e);
    return defaultValue;
  }
}

// Helper function to convert complex types to JSON for Supabase
function convertToJson<T>(data: T): Json {
  return data as unknown as Json;
}

// Functions to interact with Supabase
export const getMovieCollection = async (): Promise<Movie[]> => {
  try {
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .order('added_at', { ascending: false });
    
    if (error) throw error;
    
    // Transform the data to match our Movie interface with proper type casting
    return data.map(movie => ({
      id: movie.id,
      type: movie.type || '',
      is_adult: movie.is_adult || false,
      primary_title: movie.primary_title,
      original_title: movie.original_title || null,
      start_year: movie.start_year || 0,
      end_year: movie.end_year || null,
      runtime_minutes: movie.runtime_minutes || 0,
      plot: movie.plot || '',
      rating: {
        aggregate_rating: movie.aggregate_rating || 0,
        votes_count: movie.votes_count || 0
      },
      genres: movie.genres || [],
      posters: movie.poster_url ? [{ 
        url: movie.poster_url, 
        width: movie.poster_width || 0, 
        height: movie.poster_height || 0 
      }] : [],
      certificates: safeParseJson<{ country: { code: string; name: string; }; rating: string; }[]>(
        movie.certificates, []
      ),
      spoken_languages: safeParseJson<{ code: string; name: string; }[]>(
        movie.spoken_languages, []
      ),
      origin_countries: safeParseJson<{ code: string; name: string; }[]>(
        movie.origin_countries, []
      ),
      critic_review: movie.critic_review ? 
        safeParseJson<{ score: number; review_count: number; }>(movie.critic_review, null) : 
        null,
      directors: safeParseJson<Movie['directors']>(movie.directors, []),
      writers: safeParseJson<Movie['writers']>(movie.writers, []),
      casts: safeParseJson<Movie['casts']>(movie.casts, []),
      personal_ratings: safeParseJson<{ lyan: number; nastya: number; }>(
        movie.personal_ratings, { lyan: 5, nastya: 5 }
      ),
      comments: safeParseJson<{ lyan: string; nastya: string; }>(
        movie.comments, { lyan: '', nastya: '' }
      ),
      watch_link: movie.watch_link || '',
      added_at: movie.added_at || new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error fetching movies from Supabase:', error);
    // Fallback to local storage if Supabase fails
    const data = localStorage.getItem('anime_movie_tracker_collection');
    return data ? JSON.parse(data) : [];
  }
};

export const addMovieToCollection = async (
  imdbId: string, 
  personalData: { 
    personal_ratings: { lyan: number; nastya: number; },
    comments: { lyan: string; nastya: string; },
    watch_link: string 
  }
): Promise<Movie> => {
  try {
    // Check if movie already exists
    const { data: existingMovie } = await supabase
      .from('movies')
      .select('id')
      .eq('id', imdbId)
      .single();
    
    if (existingMovie) {
      throw new Error('Movie already exists in your collection');
    }

    // Fetch movie data from IMDb API
    const movieData = await fetchMovieById(imdbId);
    
    // Prepare data for Supabase insert - ensuring all complex objects are properly converted to JSON
    const movieForDb = {
      id: movieData.id,
      type: movieData.type,
      is_adult: movieData.is_adult,
      primary_title: movieData.primary_title,
      original_title: movieData.original_title,
      start_year: movieData.start_year,
      end_year: movieData.end_year,
      runtime_minutes: movieData.runtime_minutes,
      plot: movieData.plot,
      aggregate_rating: movieData.rating.aggregate_rating,
      votes_count: movieData.rating.votes_count,
      genres: movieData.genres,
      poster_url: movieData.posters && movieData.posters[0] ? movieData.posters[0].url : null,
      poster_width: movieData.posters && movieData.posters[0] ? movieData.posters[0].width : null,
      poster_height: movieData.posters && movieData.posters[0] ? movieData.posters[0].height : null,
      certificates: convertToJson(movieData.certificates || []),
      spoken_languages: convertToJson(movieData.spoken_languages || []),
      origin_countries: convertToJson(movieData.origin_countries || []),
      critic_review: convertToJson(movieData.critic_review),
      directors: convertToJson(movieData.directors || []),
      writers: convertToJson(movieData.writers || []),
      casts: convertToJson(movieData.casts || []),
      personal_ratings: convertToJson(personalData.personal_ratings),
      comments: convertToJson(personalData.comments),
      watch_link: personalData.watch_link,
    };
    
    // Insert the movie into Supabase
    const { data, error } = await supabase
      .from('movies')
      .insert(movieForDb)
      .select()
      .single();
    
    if (error) throw error;
    
    // Transform back to our Movie interface
    return {
      id: data.id,
      type: data.type || '',
      is_adult: data.is_adult || false,
      primary_title: data.primary_title,
      original_title: data.original_title || null,
      start_year: data.start_year || 0,
      end_year: data.end_year || null,
      runtime_minutes: data.runtime_minutes || 0,
      plot: data.plot || '',
      rating: {
        aggregate_rating: data.aggregate_rating || 0,
        votes_count: data.votes_count || 0
      },
      genres: data.genres || [],
      posters: data.poster_url ? [{ 
        url: data.poster_url, 
        width: data.poster_width || 0, 
        height: data.poster_height || 0 
      }] : [],
      certificates: safeParseJson<{ country: { code: string; name: string; }; rating: string; }[]>(
        data.certificates, []
      ),
      spoken_languages: safeParseJson<{ code: string; name: string; }[]>(
        data.spoken_languages, []
      ),
      origin_countries: safeParseJson<{ code: string; name: string; }[]>(
        data.origin_countries, []
      ),
      critic_review: data.critic_review ? 
        safeParseJson<{ score: number; review_count: number; }>(data.critic_review, null) : 
        null,
      directors: safeParseJson<Movie['directors']>(data.directors, []),
      writers: safeParseJson<Movie['writers']>(data.writers, []),
      casts: safeParseJson<Movie['casts']>(data.casts, []),
      personal_ratings: safeParseJson<{ lyan: number; nastya: number; }>(
        data.personal_ratings, { lyan: 5, nastya: 5 }
      ),
      comments: safeParseJson<{ lyan: string; nastya: string; }>(
        data.comments, { lyan: '', nastya: '' }
      ),
      watch_link: data.watch_link || '',
      added_at: data.added_at || new Date().toISOString()
    };
  } catch (error) {
    console.error('Error adding movie to Supabase:', error);
    throw error;
  }
};

export const removeMovieFromCollection = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('movies')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error removing movie from Supabase:', error);
    
    // Fallback to local storage if Supabase fails
    const movies = JSON.parse(localStorage.getItem('anime_movie_tracker_collection') || '[]');
    const filteredMovies = movies.filter((movie: Movie) => movie.id !== id);
    localStorage.setItem('anime_movie_tracker_collection', JSON.stringify(filteredMovies));
  }
};

export const updateMovieInCollection = async (
  id: string,
  updates: Partial<{
    personal_ratings: { lyan: number; nastya: number; },
    comments: { lyan: string; nastya: string; },
    watch_link: string
  }>
): Promise<Movie | null> => {
  try {
    // Convert complex objects to JSON format for Supabase
    const updatesForDb: any = {};
    
    if (updates.personal_ratings) {
      updatesForDb.personal_ratings = convertToJson(updates.personal_ratings);
    }
    
    if (updates.comments) {
      updatesForDb.comments = convertToJson(updates.comments);
    }
    
    if (updates.watch_link !== undefined) {
      updatesForDb.watch_link = updates.watch_link;
    }
    
    // Update the movie in Supabase
    const { data, error } = await supabase
      .from('movies')
      .update(updatesForDb)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) return null;
    
    // Transform to our Movie interface
    return {
      id: data.id,
      type: data.type || '',
      is_adult: data.is_adult || false,
      primary_title: data.primary_title,
      original_title: data.original_title || null,
      start_year: data.start_year || 0,
      end_year: data.end_year || null,
      runtime_minutes: data.runtime_minutes || 0,
      plot: data.plot || '',
      rating: {
        aggregate_rating: data.aggregate_rating || 0,
        votes_count: data.votes_count || 0
      },
      genres: data.genres || [],
      posters: data.poster_url ? [{ 
        url: data.poster_url, 
        width: data.poster_width || 0, 
        height: data.poster_height || 0 
      }] : [],
      certificates: safeParseJson<{ country: { code: string; name: string; }; rating: string; }[]>(
        data.certificates, []
      ),
      spoken_languages: safeParseJson<{ code: string; name: string; }[]>(
        data.spoken_languages, []
      ),
      origin_countries: safeParseJson<{ code: string; name: string; }[]>(
        data.origin_countries, []
      ),
      critic_review: data.critic_review ? 
        safeParseJson<{ score: number; review_count: number; }>(data.critic_review, null) : 
        null,
      directors: safeParseJson<Movie['directors']>(data.directors, []),
      writers: safeParseJson<Movie['writers']>(data.writers, []),
      casts: safeParseJson<Movie['casts']>(data.casts, []),
      personal_ratings: safeParseJson<{ lyan: number; nastya: number; }>(
        data.personal_ratings, { lyan: 5, nastya: 5 }
      ),
      comments: safeParseJson<{ lyan: string; nastya: string; }>(
        data.comments, { lyan: '', nastya: '' }
      ),
      watch_link: data.watch_link || '',
      added_at: data.added_at || new Date().toISOString()
    };
  } catch (error) {
    console.error('Error updating movie in Supabase:', error);
    
    // Fallback to local storage if Supabase fails
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
