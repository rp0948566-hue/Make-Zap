import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://laubhpdscqcfvnwdwakh.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_SBuAIMKdajIh-fkHSWk0mg_Z6fRySrH';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
