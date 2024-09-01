import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://dfwyhimkfppmoecosghr.supabase.co/";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmd3loaW1rZnBwbW9lY29zZ2hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUxNDUxOTEsImV4cCI6MjA0MDcyMTE5MX0.pgB0NPrkG7EVoIXMMgcxhJbGa0vZnMSV4OAenbT0hzQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});