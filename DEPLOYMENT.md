# 🚀 Production Deployment Guide — Ayubowan Explorer

This guide walks through deploying **Ayubowan Explorer** (built with TanStack Start, Vite, Supabase, and Tailwind CSS) to modern hosting platforms.

---

## 1. Required Environment Variables

Set the following environment variables in your deployment settings (e.g., Vercel / Netlify / Cloudflare Dashboard):

```env
# Supabase Configuration (Required)
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# OpenWeatherMap Integration (Optional - Fallback built-in)
VITE_OPENWEATHER_API_KEY=your-openweather-api-key

# AI Generator (Optional - Gemini / OpenAI)
GEMINI_API_KEY=your-gemini-api-key
OPENAI_API_KEY=your-openai-api-key
```

---

## 2. Deploying to Vercel (Recommended)

1. Push your code to your GitHub / GitLab repository.
2. Log into [Vercel Dashboard](https://vercel.com) and click **Add New Project**.
3. Import your repository `Ayubowan Explorer`.
4. Configure Build Command & Output:
   - **Framework Preset**: Vite / Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `.output` (or default dist)
5. Add environment variables under **Project Settings → Environment Variables**.
6. Click **Deploy**.

---

## 3. Database Migration & Supabase Setup

Run the SQL seed scripts located in `supabase/migrations/`:
```bash
# Using Supabase CLI:
supabase db push

# Or paste SQL content from supabase/migrations/20260725110000_seed_ayubowan_data.sql 
# directly into your Supabase Dashboard SQL Editor.
```

---

## 4. Verification

After deployment:
- Verify public routes: `/`, `/destinations`, `/tours`, `/cuisine`.
- Test user login & dashboard at `/_authenticated/dashboard`.
- Test checkout flow & PDF receipt download.
