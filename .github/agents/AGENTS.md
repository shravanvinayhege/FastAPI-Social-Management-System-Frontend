---
name: voteflow-x-reddit-redesign
description: >
  Guides frontend-only redesign work on the VoteFlow repo
  (github.com/shravanvinayhege/FastAPI-Social-Management-System-Frontend) into a polished,
  standard social-media UI that blends X (Twitter) and Reddit conventions: single-column
  chronological feed, a Reddit-style vote rail, profile pages, search, and sort tabs. Use this
  skill whenever the user is working in this repo (or a clone of it) and asks to redesign,
  restyle, "make it look like a real social app," add a feed/profile/search/vote-rail, or
  otherwise improve VoteFlow's UI/UX. The hard rule behind every change here: no new npm
  packages beyond what's already in package.json (Next.js, React, TypeScript, Tailwind v4 — no
  UI kits, icon packages, state managers, or data-fetching libraries), and no frontend feature
  that implies a backend capability the FastAPI-Management-System API doesn't actually have
  (no comments, follows, DMs, media upload, or true up/down voting — the real API is auth,
  posts CRUD with pagination/search, a single binary vote toggle, and user lookup, nothing more).
  Always verify against the live repos before assuming either has changed.
---

# VoteFlow → X + Reddit Style Redesign

## The job in one sentence

Turn VoteFlow's current "admin dashboard" layout (a stacked header, a create-post form, then
two grids of cards) into a feed-based social app that reads like a blend of X's clean
chronological timeline and Reddit's vote-driven community feel — using nothing that isn't
already installed, and wiring only to endpoints the backend actually exposes.

This is frontend-only work. Never open a pull request, add a router, or otherwise change
`shravanvinayhege/FastAPI-Management-System` (the backend repo). If a feature genuinely needs a
new endpoint, say so explicitly and leave it out of the build rather than faking it.

Before starting real work, `git pull` (or re-clone) both repos and skim `package.json` and the
`routers/` files yourself — this document was written from a snapshot of both repos and either
one may have moved on since.

---

## Two boundaries that override everything else below

### 1. No new dependencies

`package.json` today:

```json
"dependencies": { "next": "^16.2.3", "react": "^19.2.5", "react-dom": "^19.2.5" },
"devDependencies": {
  "@tailwindcss/postcss": "^4.2.2", "@types/node": "...", "@types/react": "...",
  "@types/react-dom": "...", "postcss": "^8.5.9", "tailwindcss": "^4.2.2", "typescript": "^6.0.2"
}
```

That's it — Next.js App Router, React 19, TypeScript, and Tailwind CSS v4 (pulled in via
`@tailwindcss/postcss` and `@import "tailwindcss";` in `app/globals.css`, alongside a large
hand-written design-token system of CSS custom properties). There is no component library, no
icon package, no state manager, no data-fetching library, no animation library, no form
library, no image/avatar service.

Treat every icon, dropdown, toast, skeleton loader, and animation as something to hand-build
with Tailwind utilities, a few lines of React state, and the CSS custom properties already
defined in `globals.css` (`--ease-spring`, `--ease-smooth`, `--ease-out-expo`, the `--glow-*`
and `--panel*` tokens, etc.) — not an `npm install` away. Practically:

- **Icons** → inline SVG (a handful of paths is enough for arrows, search, close, sun/moon).
- **State** → `useState`/`useEffect`, same pattern `app/page.tsx` and `PostCard.tsx` already use.
- **Data fetching** → extend `lib/api.ts`'s existing typed `fetch` wrapper; don't reach for SWR
  or React Query.
- **Motion** → CSS transitions/animations using the timing tokens already defined, not Framer
  Motion.
- **Avatars** → derive a deterministic initial + background color from the user's email/id (pure
  CSS/SVG), not a Gravatar-style external image service.

Before calling anything done, diff `package.json` and `package-lock.json` against the base
branch — they should be untouched.

### 2. No invented backend surface

The frontend must only call endpoints that actually exist on the backend, with the actual
request/response shapes below (verified against `routers/*.py` and `app/schemas.py` in
`FastAPI-Management-System`, not just its README, which is slightly ahead of the code):

| Method | Path | Auth | Body | Returns | Notes |
|---|---|---|---|---|---|
| POST | `/login` | — | **form-urlencoded** `username`, `password` (OAuth2 password flow — `username` is the email) | `{access_token, token_type}` | Not JSON. `lib/api.ts`'s `login()` already gets this right. |
| POST | `/users/` | — | JSON `{email, password}` | `UserOut {id, email, created_at}` | Register. |
| GET | `/users/` | Bearer | — | `UserOut[]` | **Exists but unused by the frontend today.** Lists every registered user. |
| GET | `/users/{id}` | Bearer | — | `UserOut` | 404 if missing. Also unused today — this is your profile-page data source. |
| GET | `/posts/` | — | query: `limit` (default 10), `skip` (default 0), `search` (matches post **title only**, default `""`) | `PostOut[]` where `PostOut = {Post: {id, title, content, published, created_at, owner_id, owner: UserOut}, votes: number}` | Real pagination and search exist server-side and are currently ignored — `getPosts()` calls it with no params at all. |
| POST | `/posts/` | Bearer | JSON `{title, content, published}` | `Post` (no `votes` field) | Owner is inferred from the token. |
| PUT | `/posts/{id}` | Bearer, owner only | JSON `{title, content, published}` | `Post` | 403 if you don't own it. |
| DELETE | `/posts/{id}` | Bearer, owner only | — | 204 | 403 if you don't own it. |
| POST | `/vote/` | Bearer | JSON `{post_id, dir}` where `dir` is **0 or 1** | `{message}` | This is a toggle, not a signed vote: `dir=1` adds a vote row (409 if one already exists), `dir=0` deletes it (404 if none exists). There is no "downvote" — only "voted" or "not voted." |

That's the entire API surface: auth, register, posts CRUD with pagination/search, one binary
vote toggle, and user lookup. There is **no** endpoint for comments/replies, follow/unfollow,
DMs, notifications, media/image upload, hashtags/topics/subreddits, bookmarks/saves, or
reposts — confirmed by reading the SQLAlchemy models (`Post`, `User`, `Vote` — three tables,
nothing else) and every Alembic migration in the repo.

An "X and Reddit style" UI element that implies one of those unsupported things — a comment
icon that does nothing, a follow button, a downvote arrow, a notification bell with no data
behind it — is worse than not having it, because it's a broken promise to whoever uses the app.
Where the X/Reddit feel calls for something the API can't back, either drop it, or build the
closest *honest* equivalent from real data (a few ideas are in "Design direction" below). If
you genuinely think a small backend addition (e.g. an `owner_id` filter on `GET /posts/`) would
be low-risk and high-value, name it explicitly to the user as an out-of-scope suggestion rather
than quietly building the frontend as if it already existed.

---

## Current codebase map

```
app/
  layout.tsx           Root layout — loads Inter + Space Grotesk via next/font/google,
                        wraps everything, sets metadata (title "VoteFlow").
  page.tsx              "/" — the whole app today: header, inline create-post form,
                        "My Posts" grid, "All Posts" grid. All client-side ("use client"),
                        auth-gated by checking a token in localStorage on mount.
  globals.css           ~650 lines. Design tokens as CSS custom properties (colors, glow
                        halos, panel/glass surfaces, easing curves, font vars), a
                        :root[data-theme="light"] override block, and hand-rolled utility
                        classes (vf-card, vf-btn-primary/secondary/success/danger,
                        vf-meta-chip, vf-theme-toggle) layered on top of Tailwind.
  components/
    PostCard.tsx         One card: title/content (or inline edit fields), vote count pill,
                        Upvote/Remove Vote buttons, owner-only Edit/Delete.
    ThemeToggle.tsx      Reads/writes data-theme on <html>, persists to localStorage
                        under "vf-theme", defaults to system preference.
  login/                 Login form → lib/api.ts login().
  register/               Register form → lib/api.ts registerUser().
lib/
  api.ts                Typed fetch wrapper: API_URL from NEXT_PUBLIC_API_URL, JWT stored in
                        localStorage (keys "token" and legacy "access_token"), decodes the
                        JWT payload client-side to get the current user id, and exports
                        login/registerUser/getPosts/createPost/updatePost/deletePost/vote.
                        getPosts() ignores limit/skip/search even though the backend accepts
                        them — extend it rather than replacing it.
```

Read these files yourself before editing — this map is a starting orientation, not a
substitute for looking.

---

## Design direction: what "X + Reddit combined" means here

Concretely, not just as a vibe:

- **Layout** — replace the stacked-sections dashboard with a single center feed column (X's
  core structure). Give each post row a Reddit-style **vote rail** on the left: the vote button
  and the vote count stacked vertically, count rendered large and bold, sitting outside the
  card's text content rather than as a pill below it.
- **Composer** — pull the create-post form out of its own bordered section and make it read like
  X's persistent compose box: sits at the top of the feed, collapsed/minimal until focused,
  expands to show the fields.
- **Sort, not just "all posts then my posts"** — add New / Top tabs. Both are legitimate:
  "New" is the natural `created_at` order the API already returns; "Top" is a client-side
  re-sort of the fetched page by `votes`. Don't add a "Hot" tab — Reddit's Hot algorithm needs
  vote velocity over time, which this API doesn't expose, and faking it would be exactly the
  kind of dishonest feature this skill warns against.
- **Search** — wire a real search bar to `GET /posts/?search=`. Label it accurately ("Search
  post titles"), since the backend only matches on `title`, not `content` or author.
- **Pagination / infinite scroll** — this is a case where the API is *more* capable than the
  current frontend: use `limit`/`skip` for a "Load more" button or scroll-triggered fetch,
  X/Reddit-style, instead of loading everything in one request.
- **Profile pages** — a `/u/[id]`-style route using `GET /users/{id}` for the header (email,
  joined date) and a client-side filter of a full posts fetch for "posts by this user," since
  there's no server-side `owner_id` filter. Call out the perf caveat in a code comment (fine for
  a small/learning dataset, would need a real filter param at scale).
- **People directory** — a page or panel built on `GET /users/`, in the spirit of X's "who to
  follow" — but read-only, no follow button, since there's no follow endpoint. Frame it as
  "community members," not a social graph.
- **Compact, feed-native details** — relative timestamps ("3h", "2d") instead of the current
  full `Intl.DateTimeFormat` string; abbreviated vote counts ("1.2k") once numbers get large;
  deterministic initials-avatar next to each post's byline instead of just an email string.
- **Keep the existing identity** — the dark/light theme system, the Inter + Space Grotesk
  pairing, and the `--ease-*` motion tokens are a real, deliberate design system already in
  place. Evolve the `vf-card` / `vf-btn-*` utility classes toward denser, feed-native spacing
  rather than discarding the whole token system and starting over.

## Known API gotchas to design around

- **No "have I voted" flag.** `PostOut` returns an aggregate `votes` count, not whether the
  current user has voted. If you want a filled-in vote button to persist across reloads, that
  has to come from client-side state (e.g. a locally-stored set of post IDs the user has voted
  on) — be explicit in code comments that this is a local UX nicety, not server truth, and can
  drift if the user votes from another device/browser.
- **No single-post fetch.** There is no `GET /posts/{id}`. A permalink-style post page has to
  either reuse an already-fetched list (e.g. via client state/router cache) or refetch
  `GET /posts/?search=...&limit=...` and find the post client-side — it cannot cheaply fetch
  just one post by ID from a cold URL.
- **Votes can't go negative.** `dir` is `0` or `1`, never `-1`. A Reddit-style "net score" that
  goes below zero literally cannot happen here — don't imply otherwise with a plus/minus pair
  of buttons.
- **Search matches titles only**, not post content or author email.

---

## Suggested (not mandatory) shape for new pieces

Use your judgment on naming, but this keeps things consistent with the existing structure:

- `app/components/VoteRail.tsx` — extracted vertical vote control + count.
- `app/components/Avatar.tsx` — initials avatar from email/id.
- `app/components/FeedTabs.tsx` — New / Top toggle.
- `app/components/SearchBar.tsx` — wraps `GET /posts/?search=`.
- `app/components/Composer.tsx` — the create-post box, pulled out of `page.tsx`.
- `app/u/[id]/page.tsx` — profile page via `GET /users/{id}`.
- `app/people/page.tsx` — community directory via `GET /users/`.
- `lib/api.ts` — add `listUsers()` and `getUser(id)`; change `getPosts()` to accept and pass
  through `{ limit, skip, search }`.

## Workflow

1. Re-read `app/page.tsx`, `PostCard.tsx`, `lib/api.ts`, and the token section of
   `globals.css` before writing anything — confirm the codebase map above still matches reality.
2. If the user's ask is broad ("make it look like a real social app"), don't attempt the whole
   redesign in one pass. Propose a first slice — usually feed layout + vote rail, since that's
   the most visible change — and confirm before building the rest.
3. Extend `lib/api.ts` first when a feature needs data the current wrapper doesn't fetch
   (paginated/searched posts, user lookups) — every screen depends on it.
4. Build/extend components, reusing the `vf-*` classes and CSS custom properties already in
   `globals.css` rather than inventing a parallel style system.
5. Run `npm run build` (and `tsc --noEmit` if you want a faster type-only pass) before finishing.
6. Diff `package.json`/`package-lock.json` against the base branch — they must be unchanged.

## Definition of done

- [ ] `package.json` / `package-lock.json` unchanged from before the session started.
- [ ] Every new or changed `fetch`/`lib/api.ts` call maps to a row in the endpoint table above —
      no fabricated routes, no fields the backend doesn't return.
- [ ] No dead-end control that implies a feature the API can't do (comments, follow,
      notifications, downvote).
- [ ] Light and dark theme both look intentional, not just "the dark one with colors inverted."
- [ ] Feed is usable down to a narrow mobile viewport.
- [ ] Interactive elements have a visible keyboard focus state.
- [ ] Loading / empty / error states are styled in the app's own voice, not left as bare text.