import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "";
const supabasekey = "";
const supabase = createClient(supabaseUrl, supabasekey);

export default supabase;
