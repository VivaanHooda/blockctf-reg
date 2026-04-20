# 🚀 BlockCTF Registration - Quick Start

Get your registration form running in **5 minutes**.

## Step 1️⃣: Supabase Setup

1. Go to [supabase.com](https://supabase.com) → Create Account
2. Create New Project (any name, free tier is fine)
3. Wait for project to initialize (~1-2 min)
4. Go **SQL Editor** → **New Query**
5. Copy everything from `db/schema.sql` and paste into SQL Editor
6. Click **RUN**

## Step 2️⃣: Get Your Credentials

1. Go **Settings** → **API**
2. Copy:
   - `Project URL` (starts with `https://`)
   - `Anon Key` (long string)

## Step 3️⃣: Add to `.env.local`

Create file `.env.local` in project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Save file.

## Step 4️⃣: Run Locally

```bash
npm run dev
```

Visit http://localhost:3000

## Step 5️⃣: Test It

1. Fill the form with test data
2. Click "Register for BlockCTF"
3. See success message ✅

## Step 6️⃣: Check Data

1. Go to Supabase dashboard
2. Click **Table Editor** → **registrations**
3. Your data is there! 🎉

## 🚀 Deploy to Vercel

1. Push to GitHub
2. Go [vercel.com](https://vercel.com)
3. Import your repo
4. Add same env variables
5. Deploy!

---

**Easy peasy! 🔥**
