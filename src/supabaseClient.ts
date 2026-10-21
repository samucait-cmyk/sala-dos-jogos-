import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://uyleqrzhqdfmtvqecacxx.supabase.co';

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5bGVxcnpocWRmbXR2cWVhY3h4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI1ODMxNjQsImV4cCI6MjEwODE1OTE2NH0.qjEDMvpKAQmMWZuX3iYt0Dsy1PGQJ-buUzo9X6_1TaE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);