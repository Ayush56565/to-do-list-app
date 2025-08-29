import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://cnfguokikwrdbpagqfjh.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNuZmd1b2tpa3dyZGJwYWdxZmpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NjAxODksImV4cCI6MjA3MjAzNjE4OX0.BeeRAbGSAuPETG9MJqmzHdYe7Qm6g1YA8j_Y-RTxG5Q"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Todo = {
  id: string
  user_id: string
  title: string
  completed: boolean
  created_at: string
  updated_at: string
}

export type Profile = {
  id: string
  email: string
  name?: string
  created_at: string
}