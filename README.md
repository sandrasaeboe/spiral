# Spiral

A calm, dark-mode mental health app for the moment a thought starts spiraling.

**Live:** https://spiral-app-ss.vercel.app · **Portfolio:** https://portfolio-sandrasaeboe.vercel.app

## What it does

- **New thought** — write down what's on your mind. An AI layer names the thinking trap (e.g. catastrophising, mind reading), explains it in plain language, offers a reframe and one concrete exercise.
- **Check-in** — a quick daily log of energy, sleep and mood, collected in a history view so patterns show up over time.
- **Breathe** — a guided breathing exercise for when things feel like too much.

Everything you log stays in your browser (`localStorage`); there is no account and no database.

## Design notes

- Every AI response follows the same fixed content pattern — *trap → explanation → reframe → exercise* — so the answer is predictable and easy to scan when the user is stressed.
- Copy is short, calm and non-judgemental. The interface keeps one primary action per screen.

## Tech

- React (Create React App)
- Groq API (`openai/gpt-oss-120b`, JSON mode), called from a Vercel serverless function in [`api/analyze.js`](api/analyze.js) so the API key never reaches the browser

## Run locally

```bash
npm install
npx vercel dev   # runs the React app and the /api function together
```

Set `GROQ_API_KEY` in your environment or in Vercel's project settings.

---

Designed and built by Sandra Sæbø.
