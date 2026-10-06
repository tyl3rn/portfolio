# tylervannguyen.com

My personal site: projects, experience, resume, and a personal page with music, photography, and fun facts.

**Live:** [tylervannguyen.com](https://tylervannguyen.com)

## Stack

- [Next.js 16](https://nextjs.org) (App Router) + React 19
- TypeScript
- Tailwind CSS v4
- Framer Motion for animation, Lucide for icons

## A few details

- **Ridgeline backdrop:** rows of jagged mountain ridges drift behind every page, fading into fog toward the top. Heights come from a 3D simplex noise field folded into sharp creases; rows are drawn back to front so nearer ranges hide the ones behind. It renders in a Web Worker via `OffscreenCanvas` (with a main-thread fallback) and holds still under `prefers-reduced-motion`.
- **Colors from a photo:** the palette is sampled from my Mt. Fuji hiking photo in the hero: fog for the page, volcanic basalt for text, and the teal of my backpack strap as the one accent.
- **Shades:** click the photo and a pair of pixel sunglasses drops onto my face.
- **Penguins:** the pickleball penguins on the home page rally as you scroll and have something to say if you hover them; the personal page has one deadlifting.
- **Personal page:** a Monkeytype-style test that types itself at 150 wpm, album covers that open on Spotify, and photos that tell you where they were taken.
- **Navigation:** a bar drops in once you scroll past the top, with the page's sections and a contact card that copies my email.

## Structure

```
app/
  page.tsx          home: intro, about, experience, projects, skills
  personal/         off the clock, fun facts, music, photography
  components/       backdrop, nav bar, photo + shades, penguins, type helpers
  sitemap.ts        home and personal
public/             photos, album covers, project images, resume PDF
```

## Running locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).
