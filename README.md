# AwesomeTravelPlans.com

A complete static website for **AwesomeTravelPlans.com** — a travel deals newsletter and journal — with a working newsletter signup connected to the CRM at `https://my-crm-two-wheat.vercel.app/`.

Built for **GitHub Pages**. No build step, no dependencies, no framework. Open the HTML, edit, upload.

---

## What's in the box

```
awesometravelplans/
├── index.html                 Home: hero signup, latest posts, deal radar, newsletter, FAQ
├── deals.html                 Deal Radar with filters, method, booking-window table
├── journal.html               Blog index with category filters
├── newsletter.html            Dedicated newsletter landing page + sample issue + FAQ
├── about.html                 Story, principles, affiliate disclosure, photo credits
├── contact.html               Contact cards (mailto) + quick answers
├── privacy.html               Privacy policy
├── terms.html                 Terms of use
├── 404.html                   Custom not-found page
├── journal/
│   ├── mistake-fares.html
│   ├── cheapest-weeks-2027.html
│   ├── ireland-under-1800.html
│   ├── points-for-beginners.html
│   └── deals-worth-booking.html
├── assets/
│   ├── css/site.css           Full design system + responsive styles
│   ├── js/site.js             Nav, filters, reveal animations, CRM signup
│   └── img/                   Optimized photos, logo, favicons, OG image
├── CNAME                      awesometravelplans.com
├── .nojekyll                  Tells GitHub Pages not to run Jekyll
├── robots.txt
├── sitemap.xml
└── README.md
```

**The newsletter form appears in five places:** home hero, home newsletter band, journal page, every article, and the footer of every page. All of them post to the same CRM form.

---

## The CRM integration (already wired)

The signup forms POST directly from the browser to your CRM. No proxy or server is needed because the endpoint returns `Access-Control-Allow-Origin: *`.

```
POST https://my-crm-two-wheat.vercel.app/api/forms/K25TqC0JChcZC5JwecRu/submit
Content-Type: application/json

{ "values": { "name": "Jane", "email": "jane@example.com" } }
```

A successful response looks like:

```json
{ "ok": true, "contactId": "cm...", "dealId": null, "thankYouMessage": "Thanks — we'll be in touch shortly.", "redirectUrl": null }
```

The public form is: <https://my-crm-two-wheat.vercel.app/f/K25TqC0JChcZC5JwecRu>

### If you ever change the form

Open `assets/js/site.js` and edit the two config values at the top:

```js
var CRM_BASE = "https://my-crm-two-wheat.vercel.app";
var CRM_FORM_ID = "K25TqC0JChcZC5JwecRu";
```

Everything else is handled. The form has built-in validation, a honeypot spam trap, a loading state, a branded success message (it uses the CRM's `thankYouMessage` when present), and a fallback error message with a mailto link.

### Test submission already created

A test contact was submitted during the build:

- Name: **Website Test Lead (delete me)**
- Email: `test+website@awesometravelplans.com`
- Contact ID: `cmDIN4Xsr5y07gR9MKkc`

Delete that contact in the CRM before launch. After that, do one final real test with an address you can remove.

### Follow-up email

The form creates the contact. Whether a welcome email or sequence is sent depends on the automation you configure in the CRM. Set that up before you promote the site.

---

## Local preview

From inside the `awesometravelplans` folder:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000>. (Any static server works. Double-clicking `index.html` mostly works, but a local server is closer to production.)

Internet access is needed for Google Fonts. All photography is stored locally in `assets/img/`, so the site itself has no image-CDN dependency.

---

## Deploy to GitHub Pages

1. Create a new GitHub repository (for example `awesometravelplans-site`).
2. Upload **the contents of the `awesometravelplans` folder** to the repository root. Do not upload the folder itself as a nested directory.
3. In the repository: **Settings → Pages**.
   - Source: **Deploy from a branch**
   - Branch: **main** / **root**
   - Save.
4. GitHub will give you a temporary `https://<username>.github.io/<repo>/` URL. Check that the site loads there.
5. In **Settings → Pages → Custom domain**, enter `awesometravelplans.com` and save. The included `CNAME` file already contains the domain, so this should populate automatically.
6. At your domain registrar, point DNS to GitHub:

   **Apex / root domain** — four A records:

   | Type | Host | Value |
   |---|---|---|
   | A | @ | 185.199.108.153 |
   | A | @ | 185.199.109.153 |
   | A | @ | 185.199.110.153 |
   | A | @ | 185.199.111.153 |

   **www subdomain** — one CNAME record:

   | Type | Host | Value |
   |---|---|---|
   | CNAME | www | `<your-github-username>.github.io` |

   Optional IPv6 AAAA records (GitHub's current values):

   ```
   2606:50c0:8000::153
   2606:50c0:8001::153
   2606:50c0:8002::153
   2606:50c0:8003::153
   ```

7. Wait for DNS to propagate (usually minutes, sometimes a few hours). Then enable **Enforce HTTPS** in Settings → Pages.
8. In your registrar, set `www` to redirect to the apex, or the apex to `www` — pick one canonical host. The site's canonical tags and sitemap use the apex (`https://awesometravelplans.com/`).

`CNAME` and `.nojekyll` are easy to lose when copying files. Confirm both are in the repository root after uploading.

---

## Before you launch: the short checklist

- [ ] Delete the test contact in the CRM (`cmDIN4Xsr5y07gR9MKkc`).
- [ ] Set up `hello@awesometravelplans.com` forwarding. Every contact link and privacy/terms reference uses it. If you can't, replace it everywhere with an address you do monitor.
- [ ] Connect the domain and confirm HTTPS.
- [ ] Submit a real test signup from the live site and confirm the contact appears in the CRM.
- [ ] Configure the CRM's welcome email / follow-up sequence.
- [ ] Review the deal ranges on `deals.html` and the home page. They are **illustrative monthly ranges**, not live quotes. Update them or replace them with real current deals before promoting the site.
- [ ] Review the claims: "vetted weekly," "every deal is checked," and the sample issue. Keep them only if they match how you actually operate.
- [ ] Have a lawyer review `privacy.html` and `terms.html`. They are written as a solid starting point, but the governing-law section is generic and should match your business entity and location.
- [ ] Add the site to Google Search Console and submit `sitemap.xml`.
- [ ] Set up an email sending/verification record (SPF/DKIM) with your email provider so the newsletter doesn't land in spam.

---

## Adding a new blog post (no build step)

1. Copy an existing post, e.g.:

   ```
   journal/mistake-fares.html  →  journal/your-new-slug.html
   ```

2. Change the following in the new file:
   - `<title>` and `<meta name="description">`
   - `<link rel="canonical">` and all `og:` / `twitter:` URLs
   - The `BlogPosting` JSON-LD block (headline, description, image, dates, section)
   - The `BreadcrumbList` JSON-LD block
   - The `<h1>`, lede, byline, `<time>`, and article body
   - The hero image path (put the new image in `assets/img/`)
   - The related-post cards at the bottom
3. Add a card for the post to `journal.html`. Give it `data-category="strategy"` (or `itineraries`, `points`, `money`) so the filter works.
4. Add the URL to `sitemap.xml` with a `<lastmod>` date.
5. Optionally, add it to the home page's "Latest from the Journal" cards.
6. If the post uses a new category, add a filter button in `journal.html` with the matching `data-filter` value.

Every page is standalone HTML. There is no templating engine and nothing to compile.

---

## Design notes

- **Type:** Fraunces (display) + Inter (body) via Google Fonts.
- **Palette:** deep green ink `#11231f`, warm paper `#fbf7ee`, coral `#d9553f`, gold `#c49544`, teal `#0d5c56`.
- **Responsive:** breakpoints at 1020px, 820px, 640px, and 380px.
- **Accessibility:** skip links, visible focus states, labelled inputs, `aria-live` form status, `aria-expanded` mobile nav, `prefers-reduced-motion` support, AA-oriented contrast.
- **No tracking:** no analytics or ad pixels are installed. If you add them, update `privacy.html`.
- **Images:** Unsplash (free license) and one Wikimedia Commons photo (Cliffs of Moher by Suicasmo, CC BY-SA 4.0 — credited on the about page and in the Ireland article). Keep those credits.

---

## Editing the look

All styling lives in `assets/css/site.css`. The design tokens are at the top:

```css
:root{
  --ink:#11231f;
  --paper:#fbf7ee;
  --coral:#d9553f;
  --serif:"Fraunces", Georgia, serif;
  --sans:"Inter", system-ui, sans-serif;
  --wrap:1180px;
}
```

Change those and the whole site follows. Component styles are grouped with comments (`Hero`, `Journal cards`, `Newsletter band`, etc.).

---

## Analytics (optional)

If you want traffic numbers, the easiest privacy-friendly option is Plausible or Fathom. Add their script before `</head>` on each page, then update the privacy policy to mention it. Do not add Google Analytics without updating the cookie/tracking section.

---

## Support

Everything is plain HTML, CSS, and JavaScript. If you can edit a text file, you can run this site.

For the CRM side — forms, contacts, pipelines, and automations — use the CRM at <https://my-crm-two-wheat.vercel.app/>.
