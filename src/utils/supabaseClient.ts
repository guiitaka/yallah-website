import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uzdybyxqwaahdjaaybet.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6ZHlieXhxd2FhaGRqYWF5YmV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMzE4NzQsImV4cCI6MjA2MjkwNzg3NH0.NpjlrfC2-izZKFjyUWC4RlTJYgUL9reqyzearSIsPYs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 