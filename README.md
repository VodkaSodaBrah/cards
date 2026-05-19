# cards-dashboard

Credit card spend tracker + benefits chart for `cards.childressdigital.com`.

## Stack
- Vite + React 18
- React Router v6
- localStorage for spend tracker persistence
- Static HTML for benefits chart (served via iframe from /public)

## Local dev

```bash
npm install
npm run dev
```

Runs at http://localhost:5173

## Deploy to Vercel + Cloudflare

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial deploy"
gh repo create cards-dashboard --private --push --source=.
```

### 2. Import to Vercel
- vercel.com → Add New Project → import your repo
- Framework: Vite (auto-detected)
- No env vars needed
- Deploy

### 3. Add custom domain in Vercel
Project → Settings → Domains → Add `cards.childressdigital.com`

### 4. Add DNS record in Cloudflare
| Type  | Name  | Target              | Proxy    |
|-------|-------|---------------------|----------|
| CNAME | cards | cname.vercel-dns.com | DNS only (grey cloud) |

⚠️ Proxy must be OFF (grey cloud). Vercel needs direct access to provision SSL.

## Routes
- `/` — Spend tracker
- `/benefits` — Benefits chart (iframe of /public/benefits.html)

## Notes
- Spend tracker data lives in localStorage under key `cards_dashboard_transactions`
- Earn rates last verified against chase.com and navyfederal.org, May 2026
- Benefits chart is a standalone HTML file — update it independently and redeploy
# cards
