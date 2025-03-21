export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      movies: {
        Row: {
          added_at: string | null
          aggregate_rating: number | null
          cancelled: boolean
          casts: Json | null
          certificates: Json | null
          comments: Json
          critic_review: Json | null
          directors: Json | null
          end_year: number | null
          genres: string[] | null
          id: string
          in_queue: boolean | null
          is_adult: boolean | null
          origin_countries: Json | null
          original_title: string | null
          personal_ratings: Json
          plot: string | null
          poster_height: number | null
          poster_url: string | null
          poster_width: number | null
          primary_title: string
          runtime_minutes: number | null
          seasons: Json | null
          spoken_languages: Json | null
          start_year: number | null
          type: string | null
          votes_count: number | null
          waiting: boolean | null
          watch_link: string | null
          watched_by: Json | null
          writers: Json | null
        }
        Insert: {
          added_at?: string | null
          aggregate_rating?: number | null
          cancelled?: boolean
          casts?: Json | null
          certificates?: Json | null
          comments?: Json
          critic_review?: Json | null
          directors?: Json | null
          end_year?: number | null
          genres?: string[] | null
          id: string
          in_queue?: boolean | null
          is_adult?: boolean | null
          origin_countries?: Json | null
          original_title?: string | null
          personal_ratings?: Json
          plot?: string | null
          poster_height?: number | null
          poster_url?: string | null
          poster_width?: number | null
          primary_title: string
          runtime_minutes?: number | null
          seasons?: Json | null
          spoken_languages?: Json | null
          start_year?: number | null
          type?: string | null
          votes_count?: number | null
          waiting?: boolean | null
          watch_link?: string | null
          watched_by?: Json | null
          writers?: Json | null
        }
        Update: {
          added_at?: string | null
          aggregate_rating?: number | null
          cancelled?: boolean
          casts?: Json | null
          certificates?: Json | null
          comments?: Json
          critic_review?: Json | null
          directors?: Json | null
          end_year?: number | null
          genres?: string[] | null
          id?: string
          in_queue?: boolean | null
          is_adult?: boolean | null
          origin_countries?: Json | null
          original_title?: string | null
          personal_ratings?: Json
          plot?: string | null
          poster_height?: number | null
          poster_url?: string | null
          poster_width?: number | null
          primary_title?: string
          runtime_minutes?: number | null
          seasons?: Json | null
          spoken_languages?: Json | null
          start_year?: number | null
          type?: string | null
          votes_count?: number | null
          waiting?: boolean | null
          watch_link?: string | null
          watched_by?: Json | null
          writers?: Json | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          name: string | null
          restaurant_name: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          name?: string | null
          restaurant_name?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string | null
          restaurant_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      gtrgm_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_options: {
        Args: {
          "": unknown
        }
        Returns: undefined
      }
      gtrgm_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      set_limit: {
        Args: {
          "": number
        }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: {
          "": string
        }
        Returns: string[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
