# QR Master

A simple, premium-designed web application to generate QR codes from URLs, secured with Supabase Authentication.

## Features

- **Supabase Auth**: Secure email/password login and signup.
- **QR Code Generation**: Instantly generate QR codes for any URL.
- **Premium Design**: Glassmorphism UI with dark mode and smooth animations.
- **Responsive**: Works perfectly on mobile and desktop.

## Setup Instructions

### 1. Supabase Setup

1. Go to [Supabase](https://supabase.com/) and create a new project.
2. Once created, go to **Project Settings** -> **API**.
3. Copy the `Project URL` and `anon public` key.
4. Go to **Authentication** -> **Providers** and ensure **Email** is enabled.
5. **GitHub OAuth Setup**:
   - Go to **Authentication** -> **Providers** -> **GitHub**.
   - Enable **GitHub**.
   - You will need a **Client ID** and **Client Secret**.
   - Go to [GitHub Developer Settings](https://github.com/settings/developers) -> **OAuth Apps** -> **New OAuth App**.
   - **Application Name**: QR Master (or your app name).
   - **Homepage URL**: Your Vercel deployment URL (e.g., `https://your-project.vercel.app`) or `http://localhost:3000` for local dev.
   - **Authorization callback URL**: `https://<your-supabase-project-ref>.supabase.co/auth/v1/callback`.
     - You can find this URL in the Supabase GitHub provider settings page (it's listed as "Callback URL").
   - Click **Register application**.
   - Copy the **Client ID** and generate a new **Client Secret**.
   - Paste them into the Supabase GitHub provider settings and click **Save**.

### 2. Local Development

1. Rename `.env.local.example` to `.env.local`.
2. Paste your Supabase URL and Anon Key into `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000).

### 3. Deploy to Vercel

1. Push this code to a GitHub repository.
2. Go to [Vercel](https://vercel.com/) and import the project.
3. In the **Environment Variables** section of the deployment, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Vanilla CSS (Modules/Global)
- **Auth/DB**: Supabase
- **QR Code**: react-qr-code
