// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://btfflzdcvowmgarvckoj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0ZmZsemRjdm93bWdhcnZja29qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwMjE2MTMsImV4cCI6MjA1NjU5NzYxM30.DBfmM2uHUKRif2dWVFKxv4ix-WHxpOLjI5e2__3EYSI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);