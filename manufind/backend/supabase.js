import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
dotenv.config({ path: path.resolve(dirname, "./.env") });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export { supabase };