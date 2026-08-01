import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// We prefer the service role key for administrative DB tasks to bypass RLS.
// Fallback to the publishable key if service role is not defined.
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    'WARNING: SUPABASE_SERVICE_ROLE_KEY is not defined. Admin operations might fail due to RLS policies.'
  );
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
