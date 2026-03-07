// ===== Supabase Configuration =====
// Replace these with your own Supabase project credentials
const SUPABASE_URL = 'https://wwzqorxlooqqzlczwyjq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_NZlVtTS8BHq_R6kDmvpkmg_3_vBo06K';

let supabaseClient = null;

function initSupabase() {
  try {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return supabaseClient;
  } catch (e) {
    console.error('Failed to initialize Supabase:', e);
    return null;
  }
}

// Global session state
var activeCampaign = null; 
var MONTH_NAMES = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
var DAYS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

initSupabase();

