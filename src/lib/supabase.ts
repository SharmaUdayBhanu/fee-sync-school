
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with fallback values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a fallback client or null if credentials are not available
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Log a clear message about Supabase connection status
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials are missing. The app will use mock data. To connect to Supabase, click the Supabase button in the top right corner and follow the instructions.');
}

// Helper function to check if we're connected to Supabase
export const isSupabaseConnected = async (): Promise<boolean> => {
  if (!supabase) return false;
  
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
