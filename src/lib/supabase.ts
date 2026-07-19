import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.warn(
    '[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY manquants. ' +
    'Renseigne-les dans .env.local (voir .env.example).'
  )
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
)

export type Profile = {
  id: string
  email: string | null
  credits: number
  subscription_status: 'inactive' | 'active' | 'cancelled'
  subscription_plan: 'starter' | 'flex' | 'pro' | null
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  subscription_credits_remaining: number
  pack_credits: number
  unlimited_credits: boolean
  created_at: string
}

export type Generation = {
  id: string
  user_id: string
  type: 'photo' | 'video'
  user_prompt: string
  reference_image_urls: string[] | null
  composite_image_url: string | null
  final_url: string | null
  fal_request_id: string | null
  status: 'pending' | 'generating' | 'complete' | 'failed'
  credits_used: number
  created_at: string
  expires_at: string
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) {
    console.error('getProfile error', error)
    return null
  }
  return data as Profile
}
