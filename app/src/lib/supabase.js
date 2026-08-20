import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env — auth will not work. ' +
    'Create app/.env with both values (copy from app/.env.example).',
  );
}

if (import.meta.env.DEV) {
  console.info(
    '[supabase] connected project: ' + supabaseUrl,
    '| key type: ' + (supabaseAnonKey.startsWith('sb_publishable_') ? 'publishable' : 'legacy anon'),
  );
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
