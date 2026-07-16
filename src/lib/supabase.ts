import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are set in your .env.local file.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Event = {
  id: string
  title: string
  starts_at: string
  location: string | null
  created_at: string
}

export type RegistrationStatus = 'Verified' | 'Pending' | 'Cancelled'

export type Registration = {
  id: string
  event_id: string
  first_name: string
  last_name: string
  distance_meters: number | null
  size: string | null
  registered_bib: string | null
  status: RegistrationStatus
  registration_date: string
  ticket_code: string
  ticket_code_hash: string
  ticket_expires_at: string | null
  created_at: string
}
