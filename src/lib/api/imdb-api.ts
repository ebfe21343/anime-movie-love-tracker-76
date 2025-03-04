
import { Movie, MovieResponse } from '@/types/movie';

const IMDB_API_ENDPOINT = 'https://graph.imdbapi.dev/v1';

/**
 * Fetches movie data from IMDb API by ID
 */
export async function fetchMovieById(id: string): Promise<Omit<Movie, 'personal_ratings' | 'comments' | 'watch_link' | 'added_at' | 'seasons'>> {
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
    const movieData = responseData.data.title;
    
    return {
      ...movieData,
      cancelled: false, // Default value when fetching from IMDb
      content_type: movieData.type || 'movie' // Add content_type based on the movie type
    };
  } catch (error) {
    console.error('Error fetching movie:', error);
    throw error;
  }
}
