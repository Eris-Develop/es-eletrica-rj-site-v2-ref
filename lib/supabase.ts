import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabaseReady = Boolean(url && anon && !url.includes('SEU-PROJETO'));
export const supabase = supabaseReady ? createClient(url, anon) : null;
