import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mtfhjdxsvlunaudrriro.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10ZmhqZHhzdmx1bmF1ZHJyaXJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1MjM0MzEsImV4cCI6MjA3MDA5OTQzMX0.PlmbyJ0jRsPVC4-vBZZ28-j2SegW0FXrQ4aHQ4hEBDU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)