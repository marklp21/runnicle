import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Load environment variables from .env.local
const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length === 2) {
    env[parts[0].trim()] = parts[1].trim();
  }
});

const supabaseUrl = env['VITE_SUPABASE_URL'];
const supabaseAnonKey = env['VITE_SUPABASE_PUBLISHABLE_KEY'];

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function query() {
  try {
    const { data: events } = await supabase.from('events').select('id, title, starts_at');
    console.log("--- EVENTS IN DATABASE ---");
    console.log(events);

    const { data: regs } = await supabase.from('registrations').select('id, event_id, first_name, last_name, status, registered_bib, payment_method, reference_number, created_at');
    console.log("\n--- REGISTRATIONS IN DATABASE ---");
    console.log(regs);
  } catch (e) {
    console.error(e);
  }
}

query();
