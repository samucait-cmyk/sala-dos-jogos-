import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://uyleqrzhqdfmtvqecacxx.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_zn3myE1YNHJnzFc8ttG-oA_NpkTd...'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)