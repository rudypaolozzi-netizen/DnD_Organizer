// ===== Supabase Configuration =====
// Replace these with your own Supabase project credentials
const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';

let supabaseClient = null;

function initSupabase() {
  if (SUPABASE_URL.includes('YOUR_PROJECT')) {
    console.warn('⚠️ Supabase not configured. Running in demo mode.');
    return null;
  }
  try {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return supabaseClient;
  } catch (e) {
    console.error('Failed to initialize Supabase:', e);
    return null;
  }
}

// Demo mode flag
function isDemoMode() {
  return supabaseClient === null;
}

initSupabase();

