import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://rpljpzncpwzxmqmhsyai.supabase.co";
const supabaseAnonKey = "sb_publishable_v-4roAls6B9TVFqg2CXLKQ_YzPP6HkN";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);