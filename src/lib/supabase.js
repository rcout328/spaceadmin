import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://gqclqykwwbzocounillq.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxY2xxeWt3d2J6b2NvdW5pbGxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgxNTMyMjEsImV4cCI6MjA0MzcyOTIyMX0.Fho27vaoxDu27EKD9sW3rQAJVrfTKh2GNcZHB7xnH6g"

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)