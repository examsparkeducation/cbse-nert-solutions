# QSpark AI

QSpark AI is a production-ready AI-powered question generator for students and educators. It lets users pick a class, subject, and chapter, then generate structured MCQs, short-answer questions, and long-answer questions using OpenAI or Gemini through secure serverless functions.

## 1. Folder Structure

```text
qspark-ai/
├── api/
│   └── generate-questions.js
├── ads.js
├── server/
│   └── question-generator.js
├── .env.example
├── app.js
├── index.html
├── package.json
├── README.md
├── seo-routes.md
├── styles.css
└── vercel.json
```

## 2. Architecture

### Frontend

- `index.html`: Single-page application with a hero section, generator panel, and output sections
- `ads.js`: Central ad-slot manager for banners, inline ads, and the sidebar slot
- `styles.css`: Extra polish on top of Tailwind utility classes
- `app.js`: Form handling, monetization limits, ad integration, rendering results, local saves, copy, and PDF download

### Backend / API

- `server/question-generator.js`: Shared AI prompt and provider logic
- `api/generate-questions.js`: Vercel serverless adapter

### Data Flow

1. User selects class, subject, and chapter
2. Frontend sends a `POST` request to `/api/generate-questions`
3. Vercel serverless function calls OpenAI or Gemini using environment variables
4. AI returns structured JSON
5. Frontend renders MCQs, short questions, and long questions
6. User can copy, download as PDF, or save locally in the browser

## 3. Features Included

- Modern startup-style homepage
- Responsive generator layout
- 10 MCQs with answers
- 5 short-answer questions
- 3 long-answer questions
- Copy full result or individual sections
- Download PDF
- Save generated sets in localStorage
- Dark mode toggle
- Daily free plan limit of 3 generations
- Dedicated ad system with reusable placeholder slots
- Inline error state for failed or blocked requests
- Vercel deployment support

## 4. AI Prompt Used

```text
Generate exam questions for:
Class: {class}
Subject: {subject}
Chapter: {chapter}

Include:
- 10 MCQs with answers
- 5 short questions
- 3 long questions

Format clean, structured, and exam-ready.
```

The app wraps this in a stricter JSON-return instruction so the frontend can render the response reliably.

## 5. Local Setup

### Vercel Dev

1. Install Vercel CLI:

```bash
npm install -g vercel
```

2. Copy `.env.example` to `.env` and add your API keys.
3. Start the project:

```bash
vercel dev
```

## 6. Deployment Guide

### Deploy to Vercel

1. Push the project to GitHub.
2. Log in to [Vercel](https://vercel.com/).
3. Import the repository.
4. Choose framework preset `Other`.
5. Leave build command empty.
6. Leave output directory empty.
7. Add the environment variables from `.env.example`.
8. Deploy.

## 7. Beginner Notes for API Providers

### Use OpenAI

Set:

```env
AI_PROVIDER=openai
OPENAI_API_KEY=your_key
OPENAI_MODEL=gpt-4o-mini
```

### Use Gemini

Set:

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_key
GEMINI_MODEL=gemini-1.5-flash
```

## 8. SEO Strategy

- Target keywords like `AI question generator`, `MCQ generator`, `exam question maker`, and `study question generator`
- Create landing pages for each class and subject combination
- Add structured FAQ content about exam prep
- Publish blog articles around revision strategies and question bank creation
- Optimize page speed and mobile performance

Route planning is documented in `seo-routes.md`.

## 9. Monetization Strategy

- Freemium model with daily generation limits for free users
- Premium plan for unlimited generations, PDF branding removal, and saved history sync
- Teacher plan for class-wise bulk generation and export bundles
- Affiliate partnerships for edtech tools, tutoring, or study material platforms

## 10. Future Roadmap

- Firebase Auth for login and synced saved history
- Multi-language question generation
- Difficulty levels like easy, medium, and hard
- Worksheet templates and printable exam papers
- Chapter-wise analytics and recommended follow-up questions
- Collaborative teacher dashboard

## 11. Production Readiness Checklist

- Keep API keys only in server-side environment variables
- Validate AI responses before rendering
- Add rate limiting if you launch publicly
- Add analytics, error logging, and monitoring
- Enable a custom domain and HTTPS on Vercel
