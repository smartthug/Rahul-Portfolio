# Portfolio Audit — rahul-portfolio-liard.vercel.app

_Audit date: 26 Oct 2026 · Audited commit: `7b130ad` · Design reference requested: creativeed.dev_

## How this audit was done

- Read every file in the repo (Next.js 14 App Router, React 18, TypeScript, Tailwind 3, GSAP, Lenis, Framer Motion, React Three Fiber / three.js, Resend via a `/api/contact` route).
- Ran `npm ci`, `npx tsc --noEmit` and `npm run build` on the original code (all passed; `/` = **207 kB first-load JS**).
- Loaded the live site in a browser at desktop and 375 px mobile width and inspected the DOM (headings, metadata, links, tap targets, overflow).
- Cross-checked every project on the site against its public GitHub repository README and live Vercel deployment (github.com/smartthug).
- Reviewed creativeed.dev for the visual direction requested.

## What is working

- Clean, typed Next.js codebase that builds without errors; fonts self-hosted via `next/font`.
- A real contact pipeline: `/api/contact` with validation, honeypot, per-IP rate limiting, HTML escaping, Resend sender fallback and a `mailto:` fallback when email isn't configured. This is better than most portfolios.
- Real project screenshots for six projects and a real DocRAG demo video.
- Real GitHub and LinkedIn links; working email address.
- No horizontal overflow at 375 px; `next/image` used for screenshots; `prefers-reduced-motion` respected for grain.

## Scores (before)

| # | Category | Score | One-line verdict |
|---|---|---|---|
| 1 | Visual design & professionalism | **6/10** | Polished "awwwards" look, but feels like a motion showreel, not a service business. |
| 2 | UI/UX & navigation | **4/10** | ~4 s loader gates everything; custom cursor hides the system cursor; 10 sections with inconsistent numbering. |
| 3 | Mobile responsiveness | **5/10** | No overflow, but 40 % of tap targets < 32 px tall and huge `vw`-based type. |
| 4 | Project presentation & credibility | **3/10** | No demo or source links on any project; stacks don't match the repos; "20+ projects" claim. |
| 5 | Conversion potential | **3/10** | Never says what a client gets; CTA is "Hire me" text link; form hidden in a modal at the bottom. |
| 6 | Accessibility | **4/10** | No `<h1>`; `cursor: none`; tiny mono text at 45 % opacity; heavy motion. |
| 7 | SEO & discoverability | **2/10** | `metadataBase` is `example.com`, no canonical, no OG image, no sitemap/robots, no H1, page is 100 % client-rendered. |
| 8 | Performance | **4/10** | 207 kB JS + three.js scene + Lenis + GSAP; LCP blocked by a 2.6 s + 1.1 s loader; 5.3 MB video preloads metadata. |
| 9 | Code quality & maintainability | **6/10** | Readable and typed, but `npm run lint` is not configured, dead `#` links, unused asset, duplicated helpers. |

## Findings by category

### P0 — Broken or seriously harmful

| Issue | Impact | Fix |
|---|---|---|
| **Loader blocks the page for ~4 s** (`Loader.tsx`: 2 600 ms count + 240 ms + 1 100 ms exit, body scroll locked). Verified on mobile: after 6 s the visitor still sees "100%". | Slow first impression; most visitors from a shared link bounce before seeing a single project. LCP is delayed by design. | Remove the loader; render content immediately. |
| **`metadataBase` = `https://example.com`** | All absolute URLs in metadata (OG, canonical) point to the wrong domain. Link previews break. | Use the real Vercel domain (overridable by `NEXT_PUBLIC_SITE_URL`). |
| **No `<h1>` on the page** | Search engines and screen readers have no main heading. | Hero headline becomes the single `<h1>`. |
| **Dead links**: "Download Resume" in Experience and "Resume" tile in Footer both point to `#`. | Looks unfinished to a client clicking it. | Remove until a real résumé PDF exists (manual action). |
| **Inaccurate project data**: site lists MoneyBuddy as "React · Node · Express", HabitCrack as "React · Node · Mongo · Three.js", DietAI as "React · Node · OpenAI", Job Trainer as "OpenAI · MongoDB". The repos' READMEs say Next.js + Gemini, Next.js + MongoDB + JWT, Next.js + Groq, Next.js + NextAuth + Supabase respectively. | A technical client checking GitHub sees mismatches → trust drops. | Rewrite every project from its README. |
| **"20+ Projects" hero stat** — the owner states 4+ completed projects; GitHub shows ~10 real builds. | Inflated claim. | Remove numeric stats. |
| **`cursor: none` on body/links/buttons** (desktop) | If JS is slow or the custom cursor lags, users lose the pointer. Accessibility fail. | Remove custom cursor; keep native cursor. |
| **`npm run lint` has no ESLint config** — it opens an interactive prompt. | No lint safety net; CI would hang. | Add `.eslintrc.json` (`next/core-web-vitals`) and the two dev deps. |

### P1 — Directly affects client acquisition and trust

| Issue | Impact | Fix |
|---|---|---|
| **No services section a business owner understands.** "What I do" lists Frontend / Backend / Database / AI / Freelance — developer categories, not outcomes. | A café owner can't tell if you build websites for them. | Services in client language: business websites, landing pages, redesigns, responsive UI, React front-ends, AI features — each with "what you get". |
| **Hero is about the developer, not the client.** "hi, i'm rahul a full stack developer." | No value proposition, no outcome. | Outcome headline + one-line positioning + "View My Work" / "Discuss a Project" + visible email. |
| **No live demo / source links on any project.** | Clients can't verify anything works. | Link verified Vercel demos and GitHub repos. |
| **Business-style work is missing.** The interior-designer portfolio site (live) and the Razorpay checkout integration (live) aren't shown; the page shows only AI apps. | Small-business clients don't see anything like their own project. | Feature the interior-design portfolio first; add the Razorpay payments build. |
| **Projects are cards, not case studies** — no problem, contribution or feature list. | Reads as screenshots, not evidence of skill. | Case-study layout: problem → what I built → key features → stack → links. |
| **Contact form hidden in a modal**, only asks name/email/message, no guidance. | Extra click + blank-page anxiety. | Inline enquiry form with project type, budget (optional), timeline (optional) and a "what to include" checklist; keep success/error states and mailto fallback. |
| **No "how working with me goes".** | Unknown process = perceived risk for first-time clients. | Short 4-step process section. |
| **Location vague** ("India"). | Local clients search "web developer Chennai". | State Chennai, India · IST, and remote-friendly. |

### P2 — Visual polish and secondary

| Issue | Fix |
|---|---|
| Three.js sphere, planet PNG (678 kB), grain overlay, scramble text, tilt cards, magnetic buttons, scroll-SVG, two marquees, section tracker, scroll progress — motion everywhere. | Keep a small, purposeful motion set (reveal-on-scroll, hover lift), all disabled under reduced motion. |
| Section numbering inconsistent ("/ 02 · What we do", "/ 04 · Selected Projects", "/ 06 · Featured", "/ 08 · Connect"), "we" vs "I". | Consistent labels, first-person voice. |
| Mono labels at 10–11 px with 35–55 % opacity. | Minimum 12 px labels, ≥ 4.5:1 contrast. |
| `liquid-texture.png` unused. | Delete. |
| Visual direction requested: creativeed.dev. | Adopt its neobrutalist language (thick ink borders, hard offset shadows, flat yellow/purple/coral blocks, grid paper, bracketed mono labels, window-chrome panels) — **without** copying its content, mascot, characters or the Windows-95 world, and keeping readability first. |

## Plan

1. P0 fixes (loader, metadata, H1, dead links, accurate data, cursor, lint).
2. Rebuild page sections in a neobrutalist design system: Hero → Services → Work (case studies) → Process → About & skills → Contact.
3. SEO: canonical, OG image, robots, sitemap, JSON-LD `Person`.
4. Performance: server-render content, drop three.js / GSAP / Lenis, lazy-load the DocRAG video.
5. Verify at 375 / 768 / 1280 / 1536 px; run lint, type-check, build.

---

# After — implementation results

_Verified 26 Oct 2026 against a local production build (`npm run build && npm run start`)._

## Checks that were actually run

| Check | Result |
|---|---|
| `npm run lint` | ✔ No ESLint warnings or errors (lint was not runnable before) |
| `npx tsc --noEmit` | ✔ Pass |
| `npm run build` | ✔ Pass — `/` first-load JS **98.3 kB** (was 207 kB) |
| Automated tests | None exist in the repo; none were added (see Remaining issues) |
| Horizontal overflow at 320 / 375 / 768 / 1280 / 1536 px | ✔ None (`scrollWidth === clientWidth` at every width) |
| Mobile menu (375 px) | ✔ Opens, locks scroll, closes on link tap and Escape, lands section below the fixed nav |
| Keyboard | ✔ Skip link is first Tab stop and slides into view; 3 px focus ring on all controls; form moves focus to first invalid field |
| Enquiry form — empty submit | ✔ Inline errors, `aria-invalid`, focus moved |
| Enquiry form — server error (no Resend key locally) | ✔ 503 → readable error + clickable `mailto:` |
| Enquiry form — success state | ✔ Rendered (tested via the honeypot path, which returns success without sending email) |
| DocRAG video | ✔ 0 bytes downloaded until "Play demo"; then plays with native controls |
| `prefers-reduced-motion: reduce` | ✔ Marquee stops, reveal content fully visible, smooth-scroll off |
| robots.txt / sitemap.xml / OG image | ✔ All served; OG image renders 1200×630 |
| 404 page | ✔ Returns 404 with styled page |

### Performance (same throttling for both: 375 px, 150 ms RTT, 1.6 Mbps, 4× CPU)

| Metric | Before (live site) | After (local prod build) |
|---|---|---|
| Largest Contentful Paint | 6 236 ms | 868 ms |
| Cumulative Layout Shift | 0.523 | 0.001 |
| JavaScript transferred | 441 KB | 110 KB |
| Total transferred | 753 KB | 353 KB |

_Caveat: "after" was served from localhost, not Vercel's CDN, so treat the absolute numbers as indicative; the JS/CLS/loader differences are structural and will carry over. Re-check with PageSpeed Insights after deploying._

## Final scores

| # | Category | Before | After | Why it isn't 10 |
|---|---|---|---|---|
| 1 | Visual design & professionalism | 6 | **8** | Needs a real photo or brand mark; OG card uses a system font. |
| 2 | UI/UX & navigation | 4 | **8** | Single page only — no dedicated case-study pages yet. |
| 3 | Mobile responsiveness | 5 | **9** | Verified 320–1536 px; not tested on physical devices. |
| 4 | Project presentation & credibility | 3 | **8** | No testimonials yet; DocRAG has no public link; no paid-client work to show yet. |
| 5 | Conversion potential | 3 | **8** | Form depends on `RESEND_API_KEY` in Vercel (unverified); no testimonials. |
| 6 | Accessibility | 4 | **8** | Automated + keyboard checks only; not tested with a screen reader. |
| 7 | SEO & discoverability | 2 | **8** | Single URL on a `vercel.app` subdomain; no Google Search Console / Business Profile yet. |
| 8 | Performance | 4 | **9** | Screenshots are PNG/JPEG (Next/Image converts on Vercel; `sharp` not installed for self-hosting). |
| 9 | Code quality & maintainability | 6 | **8** | No automated tests. |

## Completed work (mapped to findings)

**P0**
- Removed the 3.9 s loader; content is server-rendered and visible on first paint.
- `metadataBase`, canonical, Open Graph, Twitter card now use the real domain (`NEXT_PUBLIC_SITE_URL` override).
- One `<h1>` (hero headline); every section has a labelled `<h2>`.
- Removed both dead "Resume" links.
- Rewrote every project from its own GitHub README / live site; removed "20+ projects".
- Removed custom cursor and `cursor: none`.
- Added `.eslintrc.json` + `eslint` / `eslint-config-next`; `npm run lint` works and runs during build.
- Found and fixed during verification: OG image route crashed (unsupported CSS gradient in Satori) — would have broken link previews in production.

**P1**
- Outcome-led hero with "View my work" / "Discuss a project" and a copyable email.
- Six client-language services, each with what's included.
- Case studies (problem → what I did → key features → stack → live demo / source) for the interior-designer portfolio site, DocRAG and FitAI Trainer; compact cards with links for Razorpay checkout, Habit Cracker, Job Trainer AI, AI Diet Planner, MoneyBuddy AI.
- Fresh screenshots captured from the live deployments of the interior-design site, Razorpay checkout, FitAI and Habit Cracker.
- 4-step process section.
- About section with Chennai location, current role, skills grouped by area, GitHub / LinkedIn.
- Inline enquiry form: project type, optional budget / timeline, "helpful to include" checklist, success / error states, mailto fallback. API route extended to include the new fields in the email.

**P2**
- Neobrutalist design system inspired by creativeed.dev: paper + ink, flat sun / violet / coral / mint / rose / sky accents always behind ink text, 2–3 px borders, hard offset shadows, bracketed mono labels, retro window panels, one marquee. Content, characters and assets from the reference site were **not** copied.
- Removed three.js, React Three Fiber, GSAP, Lenis and Framer Motion (≈ 340 KB of JS); 44 px minimum touch targets; consistent section numbering and first-person voice.
- Deleted unused assets (`planet-1-1.png` 678 KB, `liquid-texture.png`, mislabelled `habit-crack-ai.png`); renamed four JPEGs that had `.png` extensions.

## Remaining issues

1. **Contact form delivery unverified in production.** Confirm `RESEND_API_KEY` is set in Vercel and send yourself a test enquiry.
2. **No testimonials.** Add one only when a real person agrees to be quoted (the interior-designer project is the obvious first ask).
3. **DocRAG** has no public demo or repo link.
4. **No résumé PDF** — links were removed rather than left broken.
5. **No automated tests.** A Playwright smoke test (page loads, nav anchors, form validation) would protect future edits.
6. **Custom domain** would help trust and SEO; update `NEXT_PUBLIC_SITE_URL` if you add one.
7. Install `sharp` only if you ever self-host outside Vercel.

---

# Round 2 — creativeed.dev UI rebuild

_26 Oct 2026. Requested change: "I want the same UI as https://www.creativeed.dev/"._

The reference was captured section by section at 1440 px and 390 px and its fonts were identified (Inter, Lexend Mega, Staatliches, Caveat, Architects Daughter, VT323, Playfair Display). The page was then rebuilt to the same layout and interactions **with original code and Rahul's own content**. Nothing was copied from the reference's source, illustrations, mascots, portrait, music player or copy.

| Reference section | Rebuilt as |
|---|---|
| Fractured 6-panel hero (minimalism / neobrutalism / constructivist / Swiss / sketch / dark) with a doodle character | Same panel geometry and styles: "rahul" / "DEV" / "BUILD" / "SHIP" / "your next website »"; original stick-figure doodle using Rahul's cat avatar; slanted stacked bands on mobile |
| Red/black "about" with stacked label words and a framed portrait | "DEVELOPER BY TRADE. BUILDER BY NATURE.", bio, **services list**, CTA, framed avatar |
| Corridor transition | "sys_corridor_01 // loading selected work" band |
| Purple grid, "Selected Projects", cards hanging on a rope that swing when dragged, counter widget, hazard floor | Same; all 8 real projects with screenshots, live / source links; +/− buttons move between cards; DocRAG demo plays in a retro media-player dialog |
| Retro OS desktop (icons, windows, terminal, taskbar) | "RahulOS 95": links.zip (GitHub, LinkedIn, email), **services.txt**, skills.exe (typed terminal), rahul.bmp, **process.txt**; draggable, minimise/restore, IST clock, "Hire me" start button |
| Sketch-paper "say hello!" with drawing canvas, palette, "fold me" corner, drawing-attachment checkbox | Same, wired to the real enquiry API: project type / budget / timeline fields, fold side with direct email + checklist, doodle sent as a JPEG attachment |
| Right-edge section dots | Same (tablet and up; hidden on phones where they covered content) |

## Checks run (round 2)

| Check | Result |
|---|---|
| `npm run lint` | ✔ No warnings or errors |
| `npx tsc --noEmit` | ✔ Pass |
| `npm run build` | ✔ Pass — `/` first-load JS 109 kB |
| Horizontal overflow at 320 / 375 / 768 / 1024 / 1280 / 1536 px | ✔ 0 px at every width |
| Card swing (headless Edge, real frame rate) | ✔ Kicks on scroll, settles back to 0° |
| Counter widget | ✔ + + → 03/08, − → 02/08, ⟲ → 01/08 |
| Demo video dialog | ✔ Opens with video, closes via × / Esc |
| Desktop windows | ✔ Minimise removes window, icon / taskbar restores it |
| Fold-me flip | ✔ Hidden side is `inert` and `aria-hidden` |
| Drawing canvas | ✔ Mouse strokes render; touch drawing only after the ✏️ toggle so phones can still scroll |
| Form with "attach drawing" | ✔ Payload carries a 54 KB JPEG that passes the server's validation; request was intercepted, **no email sent** |
| Terminal at 390 px | ✔ All 9 lines fit on one line |
| `prefers-reduced-motion: reduce` | ✔ Smooth-scroll off, reveals visible, panel entrance / sway / blink disabled, swing physics skipped |

### Performance (same throttling as before: 375 px, 150 ms RTT, 1.6 Mbps, 4× CPU)

| Metric | Original live site | Round 1 | Round 2 (this build) |
|---|---|---|---|
| LCP | 6 236 ms | 868 ms | 1 336 ms |
| CLS | 0.523 | 0.001 | 0.011 |
| JS transferred | 441 KB | 110 KB | 120 KB |
| Total transferred | 753 KB | 353 KB | 456 KB |

Round 2 is heavier than round 1 mainly because of the eight font families the style requires; it is still far faster than the original.

## Updated scores

| # | Category | Before | Round 2 | Note |
|---|---|---|---|---|
| 1 | Visual design & professionalism | 6 | **9** | Distinctive, matches the requested reference |
| 2 | UI/UX & navigation | 4 | **7** | Playful UI asks a little more of visitors; no top nav on phones (hero + taskbar links cover it) |
| 3 | Mobile responsiveness | 5 | **9** | Verified 320–1536 px |
| 4 | Project presentation & credibility | 3 | **8** | All real projects with links; no testimonials yet |
| 5 | Conversion potential | 3 | **8** | Services, process and enquiry form all present; form delivery still unverified in production |
| 6 | Accessibility | 4 | **8** | Keyboard reachable, labelled, reduced-motion aware; not screen-reader tested |
| 7 | SEO & discoverability | 2 | **8** | Unchanged from round 1 |
| 8 | Performance | 4 | **8** | Fonts are the main cost |
| 9 | Code quality & maintainability | 6 | **8** | No automated tests |

## Remaining issues (round 2)

Same as round 1 (Resend key, testimonials, DocRAG link, résumé, tests, custom domain), plus:
- The decorative words in the hero ("rahul", "DEV", "BUILD", "SHIP") are hidden from screen readers; a full-sentence `<h1>` carries the meaning instead.
- If performance matters more than the style, Playfair Display or Architects Daughter could be swapped for system fonts.

---

# Round 3 — scroll animations + pet playground

_26 Oct 2026. Requested: "add the scroll animation and add the pet … clone the site and check everything is okay"._

The reference was re-recorded every 300 px of scroll and its `CatPlayground` was inspected live (controls, ball physics, cat behaviour, dog). Everything below was then rebuilt with original code and artwork.

## Scroll animations (`components/ScrollFX.tsx` + CSS variables)

| Section | Effect (matches reference) |
|---|---|
| Hero | Dark right panel collapses and the sketch panel widens as you scroll; each panel's content drifts at its own speed |
| About | Red L-frame draws itself (with diagonal tail); red block slides in; title lines fly in one after another; light band drifts; portrait settles from a tilt |
| Corridor | The two stripes swing across each other |
| Projects | Title box straightens; rope draws across; cards drop onto the rope in sequence |
| RahulOS desktop | Each window pops in as it enters; emblem ring rotates |
| Contact | "say hello!" scales in; paper card slides up and straightens |
| Side dots | Active marker changes per section (teal diamond, magenta dot, yellow square, wood square, black dot) |

How it stays safe: one scroll listener writes `--p` / `--e` per frame; CSS maps them to `--pe` / `--pp`, which are fixed at their resting values under `prefers-reduced-motion` or before JavaScript runs.

## Pet playground (`components/CatPlayground.tsx`)

- Original black cat with red collar (matches your avatar) and an original dog — not the reference's artwork.
- Cats chase the ball, jump at it, swipe it ("*SWIP!* 🐾"), sometimes sit; click a cat → "Meow~ ❤️".
- Ball: drag and throw; gravity, bounce, wall rebounds, rolling friction.
- Widget: count (click = wizard hats), + add cat (max 8), − remove cat ("poof!"), dog → cats flee off-screen, count goes to 0, controls disabled until the dog leaves.
- Runs only while visible; no React re-render per frame. Reduced motion: cats sit still, the dog just sends them home.
- The old project counter widget became ◀ / ▶ buttons beside the "drag" hint, so card navigation stays accessible.

## Checks run (round 3)

| Check | Result |
|---|---|
| `npm run lint` / `npx tsc --noEmit` / `npm run build` | ✔ all pass — `/` first-load JS 113 kB |
| Horizontal overflow at 320 / 375 / 768 / 1024 / 1280 / 1536 px | ✔ 0 px |
| Scroll frames every 300 px at 1440 px | ✔ every effect above observed in captured frames |
| Pet (1440 and 375 px) | ✔ start 1 cat → + + = 3 → − = 2; hats on; ball moved by swipes; drag follows pointer exactly and throw flies; dog visible, controls disabled, all cats leave, count 0, controls re-enabled; bubbles seen: *SWIP!*, poof!, Meow~, WOOF!, !! |
| Card swing / ◀ ▶ | ✔ swing peaks at 12° and settles to 0; 01 → 03 → 02 → 01 |
| Drawing + form with doodle | ✔ 54 KB JPEG in payload, passes server validation (request intercepted, no email sent) |
| Reduced motion | ✔ hero morph 0, entry 1, no transforms on titles or cards |
| Performance (throttled mobile) | LCP 1 396 ms · CLS 0.01 · JS 124 KB (original: 6 236 ms · 0.52 · 441 KB) |

Bug found and fixed during testing: `setPointerCapture` ran before the drag state was set, so a capture failure would block ball dragging (and similar code in the card track and canvas). All three now set state first and guard the capture call.

---

# Round 4 — live links, demo clips, no source code

_27 Oct 2026. Requested: add six live links and the new clips in `public/projects`, and don't show source code._

- Added JG Antony, BabyBite, Stamina Booster, Prompt Kit and TradeAnalysis; `rag-pdf-llm.vercel.app` is DocRAG, so it became that card's live link.
- Removed every project source-code link (GitHub repo links, the "Source on GitHub" button and the "View code" fallback). Only the profile links in the links window and contact card remain.
- Clips: JG Antony, BabyBite, Stamina Booster, Prompt Kit (1080p, 22–25 s, 4–9 MB each) play in the media-player window. They load only on press, at normal speed; DocRAG's keeps its 1.5×. TradeAnalysis has no clip, so its card shows a screenshot.
- Poster frames were taken from the clips; screenshots of the other sites were re-captured because the earlier image files had been removed from `public/projects`.
- Checks run: lint, type-check and build pass; 13 cards, every live URL correct; 5 clips open and play with no errors; 13/13 images load (HTTP 200); no horizontal overflow at 320 / 375 / 768 / 1280 / 1536 px.
- Not verified: the six live sites were loaded (HTTP 200) and screenshotted, but I did not click through them. TradeAnalysis opens a sign-in screen.

---

# Round 5 — fewer projects, looping videos, project pages

_27 Oct 2026._ Removed Interior Portfolio, Razorpay Checkout, Habit Cracker, Job Trainer AI, AI Diet Planner and MoneyBuddy AI (7 remain). "Play demo" and its dialog are gone: the clips now loop silently on the cards, playing only while visible. New `/projects/<slug>` pages (static, own title / description / canonical, in the sitemap, 404 for unknown slugs) show the video with controls, summary, highlights, stack and live link. Checked: lint, type-check, build; 4 card clips playing and looping, paused off-screen; 7 detail pages with no overflow at 320 / 375 / 1280 px; home with no overflow at 320–1536 px.
