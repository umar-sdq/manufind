import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "./.env") });

let supabaseClient;

if (globalThis.__supabaseMock) {
  supabaseClient = globalThis.__supabaseMock;
} else if (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
  supabaseClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
} else {
  const builder = () => {
    const b = {
      select: () => b,
      eq: () => b,
      order: () => b,
      limit: () => b,
      update: () => b,
      delete: () => b,
      insert: async () => ({ data: null, error: null }),
      single: async () => ({ data: null, error: null }),
      then: (resolve) => Promise.resolve({ data: null, error: null }).then(resolve),
    };
    return b;
  };
  supabaseClient = { from: builder };
}

export const supabase = supabaseClient;