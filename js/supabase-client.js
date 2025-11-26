
// Supabase Client Initialization
// TODO: Replace with actual keys from user
const SUPABASE_URL = 'https://tprjmnxyhcfonrtujdgf.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwcmptbnh5aGNmb25ydHVqZGdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3NjI5MjgsImV4cCI6MjA3OTMzODkyOH0.7euP4JipRn07U8rxJ-SmfeXREfvCFWR5Z8qcKdoAi9s';

// Check if Supabase is loaded
if (typeof supabase !== 'undefined') {
    window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
} else {
    console.warn('Supabase SDK not loaded');
}
