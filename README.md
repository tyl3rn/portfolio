# tylervannguyen.com

My personal site: projects, experience, resume, and a personal page with music and photography.

**Live:** [tylervannguyen.com](https://tylervannguyen.com)

## Stack

- [Next.js 16](https://nextjs.org) (App Router) + React 19
- TypeScript
- Tailwind CSS v4
- Framer Motion for animation, Lucide for icons

## A few details

- **Contour backdrop:** faint topographic lines drift behind every page. A 3D simplex noise field is traced with marching squares each frame and drawn in a Web Worker via `OffscreenCanvas`, with a main-thread fallback. It respects `prefers-reduced-motion`.
- **Penguins:** the pickleball penguins on the home page have something to say if you hover them, and the personal page has one deadlifting.

## Structure

```
app/
  page.tsx          home: intro, about, experience, projects, skills
  personal/         music, photography, and the rest
  components/       backdrop, type/motion helpers, penguins
  sitemap.ts        only the live pages are indexed
  about/ experience/ gallery/ music/ projects/
                    in-progress routes (noindex)
public/             images, album covers, resume PDF
```

## Running locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).
