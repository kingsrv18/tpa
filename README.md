# Layernote replica

A responsive recreation of the [Layernote homepage](https://layernote.io/), with the reference's Inter font, illustrations, SVG artwork, product mockups, and all twelve marketing sections stored locally.

## Run

```sh
npm install
npm run dev
```

Open http://localhost:5173. `npm run build` prepares a static deployment in `dist/`; `npm run check` checks JavaScript syntax.

## Interactions

- Responsive navigation with a mobile menu and smooth section navigation.
- Animated hero review, comment creation, terminal handoff, and resolution sequence.
- Scroll reveals, background line motion, parallax photography, animated file cards, comparison wipe, and integration marquees.
- Three stacked workflow steps with scroll tracking, working project selectors, and manual/Claude resolution demos.
- Audience and capability carousels with arrows, dragging, touch scrolling, and keyboard navigation.
- Automatic and manual testimonial transitions.
- Monthly/annual pricing, animated FAQ accordions, and persistent cookie preferences.
- Reduced-motion support and keyboard focus indicators.

This is a frontend marketing replica. Trial, Google sign-up, sign-in, resource, legal, and comparison links open their original destinations. Project creation and agent resolution are browser-local demonstrations; they do not create accounts or invoke a coding agent. No analytics or marketing trackers are included.

## Source

`src/index.html` contains the full page markup; `src/interactions.js` owns the behavior and animation sequences; `src/behaviors.css` contains interaction styles. Original visual assets and compiled layout styles are in `src/assets/`. `scripts/server.mjs` serves the source locally and `scripts/build.mjs` packages it.

The reference was inspected on October 12, 2026. Brand, imagery, and original marketing copy belong to their respective owners.
