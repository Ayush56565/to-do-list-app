import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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
