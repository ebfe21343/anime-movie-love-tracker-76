
import { Json } from '@/integrations/supabase/types';

/**
 * Safely parses JSON data with fallback to a default value
 */
export function safeParseJson<T>(json: Json | null, defaultValue: T): T {
  if (json === null) return defaultValue;
  try {
    if (typeof json === 'object') return json as unknown as T;
    return JSON.parse(json as string) as T;
  } catch (e) {
    console.error('Error parsing JSON:', e);
    return defaultValue;
  }
}

/**
 * Converts any data to a Supabase Json type
 */
export function convertToJson<T>(data: T): Json {
  return data as unknown as Json;
}
