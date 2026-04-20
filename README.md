# BlockCTF - Coding Club Registration

Simple and sleek event registration form for **BlockCTF** - Coding Club's blockchain capture-the-flag competition.

## 🚀 Features

- **🎯 Simple & Fast**: One-page registration form
- **🎨 Modern Design**: Clean blockchain-themed dark UI with emerald & cyan accents
- **📱 Responsive**: Works perfectly on desktop, tablet, and mobile
- **✅ Form Validation**: Client-side validation with instant feedback
- **💾 Supabase Integration**: Secure data storage with PostgreSQL
- **🔔 Toast Notifications**: Real-time user feedback
- **⚡ Type Safe**: Full TypeScript support

## 🛠️ Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS v4
- **Form Management**: React Hook Form
- **Validation**: Zod
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ and npm/pnpm
- Supabase account (free tier works fine)
- Vercel account (for deployment)

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Create account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to **SQL Editor** and run the SQL from `db/schema.sql`:
   ```bash
   cat db/schema.sql
   ```
4. Paste entire content into Supabase SQL Editor and click **RUN**
5. Go to **Settings → API** and copy:
   - Project URL
   - Anon Key

### 3. Configure Environment

Create `.env.local` in project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Or copy from template:
```bash
cp .env.example .env.local
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) and test the registration form!

## 📦 Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── register/route.ts          # Registration API
│   ├── layout.tsx                      # Root layout
│   ├── page.tsx                        # Home page
│   └── globals.css                     # Global styles & theme
├── components/
│   └── RegistrationForm.tsx            # Registration form
└── lib/
    ├── supabase.ts                     # Supabase client
    └── validation.ts                   # Form validation
```

## 📝 Form Fields

- **Name**: Full name
- **Email**: College/personal email
- **Phone**: 10-digit phone number
- **College**: Your college name
- **Year**: Academic year (1st, 2nd, 3rd, 4th, Other)

## 🎨 Customization

### Change Colors

Edit CSS variables in `src/app/globals.css`:

```css
:root {
  --background: #0a0e27;      /* Dark blue background */
  --primary: #10b981;         /* Emerald green buttons */
  --accent: #06b6d4;          /* Cyan accents */
  --card-bg: #1a2640;         /* Card background */
}
```

### Change Form Fields

Edit `src/lib/validation.ts`:
- Modify `registrationSchema` to add/remove fields
- Update `YEAR_OPTIONS`
- Add new option arrays

### Change Form UI

Edit `src/components/RegistrationForm.tsx`:
- Modify form inputs
- Adjust styling
- Change success message

## 🚀 Deploy to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy!

```bash
vercel deploy
```

## 📊 Database Schema

### registrations Table

| Column | Type | Description |
|--------|------|-------------|
| id | BIGSERIAL | Primary key |
| name | VARCHAR | Full name |
| email | VARCHAR | Unique email |
| phone | VARCHAR | 10-digit phone |
| college | VARCHAR | College name |
| year | VARCHAR | Academic year |
| status | VARCHAR | Registration status |
| created_at | TIMESTAMP | Registration time |
| updated_at | TIMESTAMP | Last update |

## 🔐 Security

- ✅ Client-side validation with Zod
- ✅ Server-side validation on API
- ✅ Unique email constraints
- ✅ Supabase Row Level Security enabled
- ✅ SQL injection protection via Supabase client

## 🐛 Troubleshooting

### "Missing Supabase environment variables"
- Check `.env.local` exists and has correct values
- Reload dev server: `npm run dev`
- Verify no extra spaces in `.env.local`

### Form doesn't submit
- Check browser console (F12 → Console)
- Verify `registrations` table exists in Supabase
- Check Supabase API credentials

### Database connection error
- Verify Supabase URL format: `https://...supabase.co`
- Check internet connection
- Visit [status.supabase.com](https://status.supabase.com)

## 📧 View Registrations

1. Go to Supabase dashboard
2. Click **Table Editor**
3. Click **registrations** table
4. See all submitted registrations
5. Export as CSV if needed

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [React Hook Form](https://react-hook-form.com)
- [Zod](https://zod.dev)

## 📄 License

MIT - Free to use for educational purposes

---

**Built for Coding Club's BlockCTF Competition**
