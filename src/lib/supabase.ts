import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() || 'placeholder-key';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY) {
  console.warn("Missing Supabase environment variables (VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY). Using fallback client.");
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
