
export interface Movie {
  id: string;
  type: string;
  is_adult: boolean;
  primary_title: string;
  original_title: string | null;
  start_year: number;
  end_year: number | null;
  runtime_minutes: number;
  plot: string;
  rating: {
    aggregate_rating: number;
    votes_count: number;
  };
  genres: string[];
  posters: {
    url: string;
    width: number;
    height: number;
  }[];
  certificates: {
    country: {
      code: string;
      name: string;
    };
    rating: string;
  }[];
  spoken_languages: {
    code: string;
    name: string;
  }[];
  origin_countries: {
    code: string;
    name: string;
  }[];
  critic_review: {
    score: number;
    review_count: number;
  } | null;
  directors: Credit[];
  writers: Credit[];
  casts: CastCredit[];
  // Custom fields for our app
  personal_ratings: {
    lyan: number;
    nastya: number;
  };
  comments: {
    lyan: string;
    nastya: string;
  };
  watch_link: string;
  added_at: string;
  cancelled: boolean;
  seasons?: Season[];
  content_type: string; // Changed from optional to required
}

interface Credit {
  name: {
    id: string;
    display_name: string;
    avatars: {
      url: string;
      width: number;
      height: number;
    }[];
  };
}

interface CastCredit extends Credit {
  characters: string[];
}

export interface Season {
  id: string;
  season_number: number;
  title: string;
  year: number;
  personal_ratings: {
    lyan: number;
    nastya: number;
  };
  comments: {
    lyan: string;
    nastya: string;
  };
  cancelled: boolean;
}

export interface MovieResponse {
  data: {
    title: Omit<Movie, 'personal_ratings' | 'comments' | 'watch_link' | 'added_at' | 'cancelled' | 'seasons' | 'content_type'>;
  };
}

export interface MovieFormData {
  id: string;
  personal_ratings: {
    lyan: number;
    nastya: number;
  };
  comments: {
    lyan: string;
    nastya: string;
  };
  watch_link: string;
  content_type: string; // Changed from optional to required
  cancelled?: boolean;
  seasons?: Season[];
}
