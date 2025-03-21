
import { Movie, Season } from '@/types/movie';
import { safeParseJson } from '../utils/json-utils';

/**
 * Maps a database movie record to the application Movie type
 */
export function mapDbMovieToMovie(data: any): Movie {
  // Ensure watched_by has default values if undefined or null
  const watched_by = safeParseJson<{ lyan: boolean; nastya: boolean; }>(
    data.watched_by, { lyan: true, nastya: true }
  );

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
    watched_by: watched_by,
    watch_link: data.watch_link || '',
    added_at: data.added_at || new Date().toISOString(),
    cancelled: data.cancelled || false,
    content_type: data.type || 'movie',
    seasons: data.seasons ? safeParseJson<Season[]>(data.seasons, []) : []
  };
}

/**
 * Maps movie data to database format for insertion or update
 */
export function mapMovieToDbMovie(
  movieData: Omit<Movie, 'personal_ratings' | 'comments' | 'watch_link' | 'added_at' | 'cancelled' | 'seasons' | 'content_type' | 'watched_by'>, 
  personalData: {
    personal_ratings: { lyan: number; nastya: number; };
    comments: { lyan: string; nastya: string; };
    watched_by?: { lyan: boolean; nastya: boolean; };
    watch_link: string;
    content_type?: string;
    cancelled?: boolean;
    seasons?: Season[];
  }
) {
  return {
    id: movieData.id,
    type: personalData.content_type || movieData.type,
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
    certificates: movieData.certificates || [],
    spoken_languages: movieData.spoken_languages || [],
    origin_countries: movieData.origin_countries || [],
    critic_review: movieData.critic_review,
    directors: movieData.directors || [],
    writers: movieData.writers || [],
    casts: movieData.casts || [],
    personal_ratings: personalData.personal_ratings,
    comments: personalData.comments,
    watched_by: personalData.watched_by || { lyan: true, nastya: true },
    watch_link: personalData.watch_link,
    cancelled: personalData.cancelled || false,
    seasons: personalData.seasons || null
  };
}
