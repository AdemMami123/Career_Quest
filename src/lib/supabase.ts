import { createClient } from '@supabase/supabase-js';

// These environment variables will be available at runtime
const supabaseUrl = 'https://rmijatkczxhouuwhnowt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtaWphdGtjenhob3V1d2hub3d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4OTUzNzcsImV4cCI6MjA2MDQ3MTM3N30.KsYdYzRwR6vF9tjqbwH5nC9FkLYDu5luxZ4wYcgmq0c';

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);