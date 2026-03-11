# 👻 Phantom AI

**Your AI Life Double** — handles emails, bills, scheduling, and internet busywork in your voice, while you sleep.

## Tech Stack

- **Zero dependencies** — pure HTML, CSS, JavaScript
- **No build step** — deploy as-is to any static host
- **~75KB total** — loads instantly
- **Fully responsive** — mobile, tablet, desktop
- **Dark mode** — premium, polished UI

## Pages

| Page | File | Description |
|------|------|-------------|
| Landing | `index.html` | Marketing page with features, pricing, waitlist |
| Sign Up | `signup.html` | Account creation with password strength meter |
| Log In | `login.html` | Auth with social login buttons |
| Dashboard | `dashboard.html` | Main app — stats, activity feed, approvals, chart |
| Settings | `settings.html` | Profile, modules, connected accounts, danger zone |
| 404 | `404.html` | Friendly error page |

## Deploy

### Vercel (recommended)
```bash
cd phantom
npx vercel --prod
```

### Netlify
```bash
cd phantom
npx netlify deploy --prod --dir=.
```

### Cloudflare Pages
```bash
cd phantom
npx wrangler pages deploy .
```

### Any Static Host
Just upload the entire `phantom/` directory. No build needed.

## File Structure

```
phantom/
├── index.html          # Landing page
├── login.html          # Login
├── signup.html         # Signup
├── dashboard.html      # App dashboard
├── settings.html       # User settings
├── 404.html            # 404 page
├── css/
│   └── global.css      # Shared design system
├── js/
│   └── app.js          # Core logic, auth, state
├── vercel.json         # Vercel config
├── netlify.toml        # Netlify config
├── _headers            # Cloudflare Pages headers
└── README.md
```

## Auth & State

Currently uses `localStorage` for demo purposes. To go production:

1. Replace `Phantom.login()` / `Phantom.signup()` with real API calls
2. Add JWT token management
3. Connect to your backend (Supabase, Firebase, custom API)
4. Replace `getDashboardData()` with real data fetching

## License

MIT
