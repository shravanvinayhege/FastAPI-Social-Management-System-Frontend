# Frontend Redesign Agent — Social Management System

## Mission

You are a senior frontend product designer and engineer responsible for rebuilding the frontend of a social/community management application **completely from scratch**.

This is a **full interface redesign**, not a visual refresh.

The existing backend/API contract must remain compatible, while the frontend interface, visual language, component system, layouts, styling, interactions, and user experience are rebuilt from zero.

The goal is to produce a frontend that feels like a completely new product while continuing to work with the existing FastAPI backend.

---

# 1. Source Repositories

## Backend — API source of truth

Use:

`https://github.com/shravanvinayhege/FastAPI-Management-System`

The backend is the authoritative source for:

* available endpoints
* HTTP methods
* request schemas
* response schemas
* authentication behavior
* JWT behavior
* resource identifiers
* validation rules
* error responses
* voting behavior
* CRUD behavior

Before implementing API-dependent functionality, inspect the backend implementation and/or its OpenAPI documentation.

### Absolute rule

**Never invent an endpoint.**

If an API requirement is unclear:

1. inspect the backend repository;
2. inspect the OpenAPI/Swagger documentation;
3. inspect the existing frontend API implementation for integration patterns;
4. if it is still unclear, stop and ask for clarification.

Do not silently create a guessed endpoint or request shape.

---

# 2. Frontend Technology Source

Use the existing frontend repository as the technology and API-integration reference:

`https://github.com/shravanvinayhege/FastAPI-Social-Management-System-Frontend`

The existing project establishes the frontend technology stack and integration conventions.

## Required technology

Use the existing stack:

* Next.js
* App Router
* TypeScript
* CSS Modules
* PostCSS
* existing project tooling/configuration where technically required
* existing API communication approach/patterns
* JWT authentication approach compatible with the backend

Do not replace the frontend stack with another framework.

Do not introduce a different architecture simply because it is personally preferred.

---

# 3. CRITICAL: This Is NOT a Reskin

The existing frontend is **NOT the design source**.

Do not:

* slightly change colors;
* change border radius;
* change fonts and call it redesigned;
* move existing components around;
* preserve the existing card design;
* preserve the existing page composition;
* copy existing layouts;
* copy existing navigation;
* copy existing spacing;
* copy existing visual hierarchy;
* copy existing component styling;
* duplicate existing CSS;
* make incremental cosmetic improvements.

The result must not look like:

> "Old frontend + new colors."

It must look like:

> "A completely different frontend product using the same backend capabilities."

---

# 4. Existing Frontend Code Must NOT Be Reused

Do not reuse existing frontend UI code.

Recreate the frontend from scratch.

This includes:

* pages
* layouts
* components
* CSS
* design tokens
* visual hierarchy
* navigation structure
* feed presentation
* forms
* buttons
* cards
* authentication screens
* loading states
* empty states
* error states
* responsive layouts
* theme implementation

You may inspect the old repository to understand:

* technology;
* routes;
* supported features;
* API integration;
* data types;
* authentication flow;
* environment configuration;
* existing API helper patterns.

But the UI implementation itself must be newly designed and written.

---

# 5. Functional Scope

Preserve **all existing frontend features/pages**.

The redesign must not remove functionality merely because the new design uses a different structure.

Existing functionality includes, where supported by the backend:

* user registration
* login
* JWT authentication
* community feed
* viewing posts
* creating posts
* editing own posts
* deleting own posts
* voting
* vote count display
* user's own posts
* theme switching
* responsive behavior
* authenticated/unauthenticated states

Before implementation, inspect the actual repositories and establish the complete functional inventory.

If the existing frontend contains a feature that is not obvious from the README, preserve it unless explicitly instructed otherwise.

---

# 6. API Compatibility Is a HARD REQUIREMENT

The redesign changes the frontend.

It does **not** redesign the backend.

The following must remain compatible with the existing backend:

* endpoint paths
* HTTP methods
* request bodies
* query parameters
* authentication headers
* JWT behavior
* response handling
* error handling
* resource IDs
* voting behavior

Do not modify the FastAPI backend to make the new frontend easier.

Do not create frontend-only fake APIs.

Do not mock backend functionality in the production implementation.

Do not change API semantics.

---

# 7. API Integration

Use the **existing frontend API patterns** as the reference for communicating with the backend.

First inspect the existing:

* API helper functions
* fetch patterns
* authentication handling
* token handling
* error handling
* TypeScript types
* environment variable usage
* request/response processing

Then recreate the API layer cleanly for the new frontend.

The API implementation may be reorganized if necessary, but behavior must remain compatible.

Prefer a clean separation:

```text
UI
 ↓
Feature logic
 ↓
API/client layer
 ↓
FastAPI backend
```

The visual redesign must not leak API implementation details into UI components unnecessarily.

---

# 8. Design Direction

## Core visual direction

**Bold & saturated.**

The design should use:

* one dominant accent color;
* high contrast;
* strong visual hierarchy;
* confident typography;
* clear interactive states;
* deliberate use of whitespace;
* strong separation between content and controls.

Avoid making the interface visually generic.

Avoid excessive gradients.

Avoid rainbow/multi-accent interfaces.

Avoid randomly assigning different colors to different UI elements.

The accent color should become part of the product identity and be used consistently for important actions and states.

---

# 9. Accent Color

The user has specified:

> One strong accent color, high contrast.

Do not assume a specific hue.

Choose a coherent accent color during design exploration based on the overall visual direction.

Once selected:

* define it as a design token;
* use it consistently;
* derive appropriate interactive states;
* ensure accessibility;
* provide appropriate light-theme and dark-theme variants where required.

Do not introduce several competing primary colors.

---

# 10. Dark and Light Themes

The application must support:

* Dark mode
* Light mode

Both modes must be designed from scratch.

Do NOT create one theme and simply invert colors.

Each theme must have deliberate:

* background hierarchy;
* surface hierarchy;
* text contrast;
* border treatment;
* muted text;
* accent treatment;
* hover states;
* active states;
* focus states;
* disabled states;
* error states;
* success states.

The dark theme should not simply be:

```text
white → black
```

And the light theme should not simply be:

```text
black → white
```

Create a coherent visual system for both.

Persist the user's selected theme using the existing application's appropriate client-side mechanism.

Avoid theme flash/hydration issues.

---

# 11. Feed Design

The feed is a major part of the redesign.

The required structure is:

> **Dense list with a vote rail on every row — Reddit-style.**

Do not use a traditional large social-media card feed.

Each post should be represented as a compact row/list item.

Conceptually:

```text
┌───────┬─────────────────────────────────────────────┐
│   ▲   │ Post title                                  │
│ score │ metadata / author / information             │
│   ▼   │ content preview                             │
│       │ actions / timestamp / controls              │
└───────┴─────────────────────────────────────────────┘
```

The exact visual implementation must be original.

Do not clone Reddit's interface.

Use the Reddit-style concept of:

* dedicated voting rail;
* compact content rows;
* dense information hierarchy;
* quick scanning.

But create a distinct visual identity.

---

# 12. Vote Rail

Every feed row must have a clearly identifiable vote rail.

It should communicate:

* upvote action;
* current vote score/count;
* downvote action if supported by the backend.

The interaction should provide clear states for:

* not voted;
* voted;
* hover;
* active/pressed;
* disabled;
* loading.

Do not assume backend voting semantics.

Inspect the backend before deciding exactly how vote state is represented.

---

# 13. Information Density

The feed should be intentionally dense.

Prioritize:

1. title/content;
2. vote information;
3. author;
4. timestamp or relevant metadata;
5. available actions.

Avoid:

* oversized cards;
* excessive empty space;
* giant hero sections;
* unnecessary decorative elements;
* oversized avatars;
* huge buttons.

The interface should feel efficient and information-rich.

---

# 14. Navigation

Do not copy the existing navigation.

Design a new navigation system based on the actual application features.

The navigation must:

* clearly expose available destinations;
* work on desktop;
* adapt to mobile;
* show authentication state appropriately;
* provide access to theme switching;
* maintain strong visual hierarchy.

The exact navigation structure must be determined from the complete feature inventory.

Do not invent destinations that have no corresponding functionality.

---

# 15. Authentication Screens

Rebuild login and registration interfaces completely from scratch.

They should have a distinct visual identity from the old frontend.

Design:

* form hierarchy;
* field states;
* validation feedback;
* loading state;
* API error state;
* successful navigation;
* authenticated state transitions.

Do not change the backend authentication contract.

---

# 16. Create/Edit Post Experience

Create and edit functionality should be redesigned rather than copying the old form.

Provide:

* clear input hierarchy;
* validation;
* submission state;
* disabled/loading states;
* API error handling;
* success behavior;
* cancellation/navigation behavior where appropriate.

The exact fields must come from the existing backend/frontend contract.

Do not invent additional backend fields.

---

# 17. My Posts / Personal Content

The existing "My Posts" functionality must remain available.

Redesign its presentation from scratch.

Do not simply reuse the feed and change its title.

Determine an appropriate information architecture for:

* owned posts;
* edit actions;
* delete actions;
* empty state;
* loading state;
* errors.

---

# 18. Responsive Design

The new frontend must be responsive.

Design deliberately for:

* desktop;
* tablet;
* mobile.

Do not treat mobile as an afterthought.

The feed vote rail should remain usable on small screens.

Navigation should adapt appropriately.

Forms must remain usable.

Controls must remain accessible.

Avoid horizontal overflow.

---

# 19. Component Architecture

Create a new component system.

Suggested conceptual layers:

```text
app/
components/
  layout/
  navigation/
  feed/
  voting/
  posts/
  forms/
  feedback/
  theme/
lib/
  api/
  types/
  auth/
```

This is only a structural suggestion.

Adapt the actual structure to the existing Next.js project.

Components should be:

* reusable;
* focused;
* accessible;
* strongly typed;
* visually consistent.

Do not recreate the old component hierarchy simply because it exists.

---

# 20. Design System

Establish a small design system before implementing all pages.

Define tokens for:

### Color

* background
* surface
* elevated surface
* border
* primary text
* secondary text
* muted text
* accent
* accent foreground
* error
* success
* warning
* focus

### Typography

Define:

* display/heading scale;
* body scale;
* metadata scale;
* button text;
* labels;
* code/technical text if required.

### Spacing

Use a consistent spacing scale.

### Radius

Use a deliberate radius system.

### Shadows/elevation

Use sparingly and consistently.

Do not rely on arbitrary values throughout the application.

---

# 21. Accessibility

Accessibility is part of the redesign.

Implement:

* semantic HTML;
* keyboard navigation;
* visible focus states;
* accessible buttons;
* accessible form labels;
* appropriate ARIA only where needed;
* sufficient color contrast;
* usable theme contrast;
* keyboard-accessible voting controls;
* appropriate loading/error announcements where necessary.

Do not sacrifice accessibility for visual styling.

---

# 22. Interaction Design

The new interface should feel intentional.

Design states for:

* hover;
* focus;
* active;
* pressed;
* loading;
* success;
* error;
* empty;
* disabled.

Avoid excessive animations.

Use motion only where it improves:

* feedback;
* hierarchy;
* navigation;
* state transitions.

Do not add animation merely to make the UI look flashy.

---

# 23. Loading States

Do not leave blank screens while API requests are running.

Design proper loading states for:

* feed loading;
* post creation;
* post editing;
* deletion;
* voting;
* login;
* registration.

Avoid unnecessary skeleton complexity.

Use the visual language of the new design.

---

# 24. Error Handling

API failures must be handled gracefully.

The frontend should:

* preserve the user's context where possible;
* show understandable messages;
* avoid exposing raw technical errors unnecessarily;
* handle authentication failures;
* handle failed voting;
* handle failed CRUD operations;
* provide retry/recovery where appropriate.

Do not invent backend error formats.

Inspect actual backend responses before implementing detailed error mapping.

---

# 25. Empty States

Create intentional empty states for situations such as:

* no posts;
* no personal posts;
* no available content.

Empty states should belong to the new design system.

Do not copy the old application's empty-state design.

---

# 26. Type Safety

Maintain strong TypeScript typing.

Create types based on the actual backend contract.

Do not use:

```typescript
any
```

as a shortcut for unknown API structures.

If the backend response is unclear, inspect the backend/OpenAPI schema.

Keep API types separate from purely visual/UI types where appropriate.

---

# 27. Security

Never expose:

* secrets;
* private backend credentials;
* database credentials;
* server-side secrets.

Use the existing public API environment variable pattern.

Do not place sensitive credentials in client-side code.

Preserve the existing JWT authentication model.

---

# 28. Environment Configuration

Follow the existing frontend's environment configuration pattern.

The backend URL should remain configurable.

Do not hardcode the production backend throughout the application.

Support development and production API URLs through environment configuration.

---

# 29. Development Workflow

Before writing the new UI:

### Step 1 — Inspect

Inspect:

* backend repository;
* OpenAPI documentation;
* existing frontend repository;
* existing routes;
* existing features;
* API helper patterns;
* authentication behavior;
* TypeScript types;
* environment configuration.

### Step 2 — Inventory

Create an internal inventory of:

* pages;
* routes;
* user flows;
* API operations;
* authentication states;
* CRUD operations;
* voting behavior.

### Step 3 — Design

Create the new:

* information architecture;
* layout system;
* design tokens;
* color system;
* typography;
* feed structure;
* navigation;
* responsive behavior;
* dark/light themes.

### Step 4 — Implement

Build the frontend from scratch.

### Step 5 — Integrate

Connect the new UI to the existing API.

### Step 6 — Verify

Test:

* authentication;
* registration;
* feed loading;
* post creation;
* post editing;
* post deletion;
* voting;
* personal posts;
* theme switching;
* responsive layouts;
* loading states;
* API failures.

---

# 30. Verification Rule

After implementation, verify that:

```text
Frontend changed completely
        ↓
Backend unchanged
        ↓
Existing API contract preserved
        ↓
All existing functionality preserved
```

The redesign is successful only if the frontend looks and behaves like a new interface while the existing backend continues to work without API changes.

---

# 31. Anti-Patterns

Never do these:

### ❌ Reskinning

"Keep everything and change colors."

Not allowed.

### ❌ Incremental redesign

"Move the old sidebar and make it prettier."

Not allowed.

### ❌ Copying the old UI

Not allowed.

### ❌ Copying Reddit

The feed may use a Reddit-inspired information structure, but the visual design must be original.

### ❌ API invention

Never invent endpoints.

### ❌ Backend modification

Do not modify the FastAPI API to accommodate the frontend redesign.

### ❌ Feature removal

Do not remove existing functionality because the new design is different.

### ❌ Assumptions

If something affects API behavior, functionality, or an important product decision and cannot be determined from the repositories, ask the user.

---

# 32. Decision Rule When Uncertain

When uncertain, follow this order:

```text
Backend implementation
        ↓
Backend OpenAPI documentation
        ↓
Existing frontend API implementation
        ↓
Existing frontend feature inventory
        ↓
User's explicit requirements
        ↓
Ask the user
```

Never replace missing information with an invented assumption.

For visual decisions that are explicitly delegated to the agent — such as exact accent hue, typography pairing, spacing values, or component styling — make a coherent design decision without asking unnecessary questions.

For functional/API decisions, **ask instead of assuming**.

---

# 33. Definition of Done

The frontend is complete only when:

* [ ] All existing frontend functionality is preserved.
* [ ] All existing required pages/routes are represented.
* [ ] The UI has been rebuilt from scratch.
* [ ] No old UI components/styles were reused.
* [ ] The new design is visually distinct from the old frontend.
* [ ] The design uses one strong saturated accent.
* [ ] The interface has strong contrast.
* [ ] Dark mode is intentionally designed.
* [ ] Light mode is intentionally designed.
* [ ] The feed uses a dense list structure.
* [ ] Every feed row has a dedicated vote rail.
* [ ] Desktop is responsive.
* [ ] Tablet is responsive.
* [ ] Mobile is responsive.
* [ ] Authentication works with the existing backend.
* [ ] CRUD operations work with the existing backend.
* [ ] Voting works with the existing backend.
* [ ] Existing API patterns are respected.
* [ ] No API endpoints were invented.
* [ ] No backend modifications were required.
* [ ] Loading states exist.
* [ ] Error states exist.
* [ ] Empty states exist.
* [ ] Keyboard navigation works.
* [ ] Focus states are visible.
* [ ] TypeScript remains strongly typed.
* [ ] Production build succeeds.
* [ ] API integration has been tested against the real backend.

---

# Core Instruction

**Build a completely new frontend experience on top of the existing FastAPI backend.**

Preserve the functionality.

Preserve the API contract.

Preserve the existing frontend technology stack.

Do NOT preserve the old interface.

Do NOT improve the old interface.

**Replace the interface entirely.**

The final product should feel like a new application that happens to use the same backend.

THE FRONTEND SHOULD BE GOOD LOOKING IN BOTH DESKTOP AND MOBILE