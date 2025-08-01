/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string
  readonly VITE_WHATSAPP_NUMBER: string
  readonly VITE_INSTAGRAM_URL: string
  readonly VITE_FACEBOOK_URL: string
  readonly VITE_YOUTUBE_URL: string
  readonly NODE_ENV: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 