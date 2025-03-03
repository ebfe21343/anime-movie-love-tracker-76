
import { Movie, MovieResponse } from '@/types/movie';

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

// Local storage functions for our movie collection
const STORAGE_KEY = 'anime_movie_tracker_collection';

export const saveMovieCollection = (movies: Movie[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
};

export const getMovieCollection = (): Movie[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
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
    const movieData = await fetchMovieById(imdbId);
    const existingMovies = getMovieCollection();
    
    // Check if movie already exists
    if (existingMovies.some(movie => movie.id === imdbId)) {
      throw new Error('Movie already exists in your collection');
    }
    
    const newMovie: Movie = {
      ...movieData,
      personal_ratings: personalData.personal_ratings,
      comments: personalData.comments,
      watch_link: personalData.watch_link,
      added_at: new Date().toISOString(),
    };
    
    const updatedCollection = [...existingMovies, newMovie];
    saveMovieCollection(updatedCollection);
    
    return newMovie;
  } catch (error) {
    console.error('Error adding movie:', error);
    throw error;
  }
};

export const removeMovieFromCollection = (id: string): void => {
  const movies = getMovieCollection();
  const filteredMovies = movies.filter(movie => movie.id !== id);
  saveMovieCollection(filteredMovies);
};

export const updateMovieInCollection = (
  id: string,
  updates: Partial<{
    personal_ratings: { lyan: number; nastya: number; },
    comments: { lyan: string; nastya: string; },
    watch_link: string
  }>
): Movie | null => {
  const movies = getMovieCollection();
  const movieIndex = movies.findIndex(movie => movie.id === id);
  
  if (movieIndex === -1) return null;
  
  const updatedMovie = {
    ...movies[movieIndex],
    ...updates,
  };
  
  movies[movieIndex] = updatedMovie;
  saveMovieCollection(movies);
  
  return updatedMovie;
};
