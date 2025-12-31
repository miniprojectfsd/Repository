import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kgwhchzzasvgqsqfkovm.supabase.co';
const supabaseKey = 'YOUR_ANON_PUBLIC_KEY'; // copy from API Keys > Legacy anon

export const supabase = createClient(supabaseUrl, supabaseKey);