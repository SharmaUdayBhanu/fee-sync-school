
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials are missing. Make sure to add them through the Supabase integration.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to check if we're connected to Supabase
export const isSupabaseConnected = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.from('students').select('count').limit(1);
    if (error) {
      console.error('Supabase connection error:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.error('Failed to connect to Supabase:', e);
    return false;
  }
};
