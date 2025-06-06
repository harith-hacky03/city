import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const supabaseUrl = 'https://pwquzgzibbvlrzcqdtxx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3cXV6Z3ppYmJ2bHJ6Y3FkdHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwMzIzNzIsImV4cCI6MjA2NDYwODM3Mn0.3po2JKhh4nz7vqHoR54xNqT11gaU8aCQpwT3svFl3R8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
}); 