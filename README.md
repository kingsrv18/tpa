# TPA — LayerNote theme redesign

Tollygunge Professional Association's public website, rebuilt around the LayerNote visual and motion system. The complete TPA Next.js platform was carried over from the supplied `TPA/tollygunge` project; that original project was not modified.

## Run the complete application

```sh
npm install
npm run dev
```

Open http://127.0.0.1:5173. Public pages render without provider credentials. The real inquiry, account, member and staff operations require the database, authentication, storage and email settings described in `.env.example` and the preserved `docs/`. No production credentials or member records were copied. Keep credentials in an ignored `.env.local` or the existing hosting service's secret settings.

`npm run build` builds the full Next.js application and its existing background workers. `npm run typecheck` and `npm test` validate the preserved platform. `/preview/admin` remains the original synthetic staff preview.

## Isolated local login and database

Start Docker Desktop, then run `npm run local:setup` and `npm run dev`. Setup creates a dedicated PostgreSQL 17 container on loopback port 5432, a persistent named volume, all migrations, postal reference data, and synthetic administrator/member accounts. It generates ignored `.env.local` settings and saves passwords in ignored `.local/login-credentials.txt`. It never changes existing account passwords on reruns or connects to a production database.

Sign in at http://127.0.0.1:5173/login using `admin@tpa.local` or `member@tpa.local` and the corresponding password from that file. The administrator opens `/admin`; the member opens `/member`. Run `node scripts/verify-local-auth.mjs` to verify both real password sessions and portal separation. These are test website accounts; association membership approval remains separate.

`npm run local:db:stop` stops the database while preserving its data. `npm run local:db:start` starts it again. The local app contains its backend API routes in the same Next.js server; no second backend server is required. Storage, outbound email, Google sign-in, and public signup are disabled in this local setup. Existing test accounts use password authentication and can explore profile, application, event and staff screens without document uploads.

## Public design

The public navigation is reduced to Community, Membership, Events, Resources and Contact. Governance stays available through the footer. Patron, Annual and Life categories come from the supplied project; the redesign does not invent fees, member statistics, testimonials, events or official profiles.

Motion includes the highlighted hero, typed journey demonstration, moving backgrounds, scroll reveals, photographic parallax, stacked Join/Learn/Contribute panels, draggable carousels, resource marquees, floating file cards, an interactive comparison slider, purpose cross-fades, membership/application toggles, FAQs, hover effects and the mobile menu. Reduced-motion preferences are respected.

The homepage uses the original anonymous inquiry component with optional fields collapsed. Published homepage media, CMS content, event pages, applications, account permissions and protected APIs retain the original platform implementation. Account and membership approval remain separate.

## Editing

- `theme/reference.html`: immutable LayerNote layout reference.
- `scripts/adapt-theme.mjs`: TPA copy, navigation and illustration adaptation.
- `theme/interactions.js`, `theme/behaviors.css`, `theme/tpa.css`: motion and interaction styles.
- `scripts/scope-theme.mjs`: isolates the theme from the member/staff interfaces.
- `src/components/tpa-landing.tsx`: mounts the theme and the actual TPA components.
- `src/app/tpa-public.css`: restyles public information and account-entry pages.
- `src/app/tpa-system.css`: shared Inter typography, homepage palette, light/dark contrast, responsive staff/member shells, form controls and account-entry layouts across the application.
- `src/app`, `src/lib`, `src/domain`, `migrations`: preserved TPA platform.

The theme regenerates before development and production builds. All fonts and illustrations are stored locally. Professional portraits/settings in the theme are illustrative, not association member profiles.

## Private visual preview

With the dev server running, `npm run build:preview` packages the homepage and six public information pages into `dist/`. `npm run preview` serves that package at http://127.0.0.1:5174.

The Sites deployment is a private **public-design preview**, not a new deployment of PostgreSQL or the member/staff platform. Its account and inquiry actions continue to the existing TPA website. To activate the complete redesigned platform, deploy the Next.js build through the original Node/Railway workflow with its existing managed settings. The original live site is not changed by publishing this private preview.

The original TPA operational documentation remains in `docs/`; its dated rollout history describes the original platform. LayerNote branding/artwork and the supplied TPA content belong to their respective owners.
