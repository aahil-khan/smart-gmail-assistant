# Smart Gmail Assistant

A Next.js (App Router) application that lets users log in with their Google account, fetch their Gmail messages, and view them with basic AI-powered categorization.

## What it does

- **Google OAuth login** via NextAuth
- **Gmail integration** — fetches your last 10 emails using the Gmail API
- **Email categorization** — labels each email as *Important*, *Promotions*, or *General* based on keyword matching
- **Optional AI summaries** — if an OpenAI API key is provided, each snippet can be summarized
- Clean, minimal Tailwind CSS UI

## Prerequisites

- Node.js 18+
- A Google Cloud project with the Gmail API enabled

## Setting up Google OAuth credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (or select an existing one).
3. Navigate to **APIs & Services → Library** and enable **Gmail API**.
4. Navigate to **APIs & Services → OAuth consent screen** and configure it (External or Internal, add yourself as a test user).
5. Navigate to **APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID**.
   - Application type: **Web application**
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
6. Copy the **Client ID** and **Client Secret**.

## Environment variables

Create a `.env.local` file in the project root:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_SECRET=a_random_secret_string
NEXTAUTH_URL=http://localhost:3000

# Optional – enables AI summaries via OpenAI
OPENAI_API_KEY=your_openai_api_key
```

Generate a strong `NEXTAUTH_SECRET` with:

```bash
openssl rand -base64 32
```

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

1. Click **Sign in with Google** and authorize the app.
2. Click **Fetch Emails** to load your last 10 Gmail messages.
3. Each email is displayed with its subject, snippet, and category badge.

## Tech stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Auth | NextAuth v4 + Google OAuth |
| Gmail | googleapis |
| Styling | Tailwind CSS v4 |
| AI (optional) | OpenAI GPT-3.5 |

