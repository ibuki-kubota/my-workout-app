import { createClient } from '@supabase/supabase-js'

// .env.localに設定したURLとKeyを読み込む
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Supabaseへの接続を開始して、アプリ全体で使えるようにエクスポートする
export const supabase = createClient(supabaseUrl, supabaseKey)