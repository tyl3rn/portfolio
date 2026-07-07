import { existsSync } from "fs";
import { join } from "path";
import type { Metadata } from "next";
import Link from "next/link";
import Deadlift from "../components/deadlift";
import { Reveal, SectionHead } from "../components/reveal";

export const metadata: Metadata = {
  title: "Personal · Tyler Nguyen",
  description: "Music, travel, and everything that doesn't fit on a résumé.",
};

const offTheClock = [
  {
    title: "Music",
    blurb: "Always on, from lo-fi to house depending on the hour.",
  },
  {
    title: "Powerlifting",
    blurb: "Chasing numbers that go up slower than my commit count.",
  },
  {
    title: "Pickleball",
    blurb: "Unreasonably competitive for a casual sport.",
  },
  {
    title: "Friends",
    blurb: "Most of these projects started as 2am ideas with them.",
  },
];

// Drop cover art into public/albums with these file names (jpg, png,
// or webp) and it appears automatically.
const albums = [
  { title: "Disillusioned", artist: "Daniel Caesar", file: "disillusioned" },
  { title: "Actual Life 3", artist: "Fred again..", file: "actual-life-3" },
];

function findArt(base: string): string | null {
  for (const ext of ["jpg", "png", "webp"]) {
    if (existsSync(join(process.cwd(), "public", "albums", `${base}.${ext}`))) {
      return `/albums/${base}.${ext}`;
    }
  }
  return null;
}

// Add photos to public/photos and list them here, e.g.
// { src: "/photos/tokyo.jpg", alt: "Shibuya crossing at night" }
const photos: { src: string; alt: string }[] = [];

export default function Personal() {
  return (
    <>
      <section className="mx-auto max-w-5xl px-4 sm:px-8 pt-36 sm:pt-44 pb-10 sm:pb-14">
        <div className="max-w-2xl">
          <h1 className="font-display text-4xl sm:text-6xl font-semibold tracking-tight">
            Personal
          </h1>
          {/* invisible copy of the home-page blurb: it reserves the same
              height so the Home button sits exactly where the Personal
              button was, and you can toggle pages without moving the
              cursor */}
          <p
            aria-hidden
            className="invisible select-none mt-4 text-base sm:text-lg leading-relaxed"
          >
            CS + math at the University of Virginia. I build full-stack and AI
            things, and I&apos;m looking for a summer 2027 SWE internship.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-5">
            <Link
              href="/"
              className="inline-flex min-w-[6.5rem] justify-center rounded-full bg-ink px-4 py-2 text-sm font-medium text-bg hover:bg-white transition-colors"
            >
              Home
            </Link>
          </div>
        </div>
      </section>

      <Deadlift />

      <section className="mx-auto max-w-5xl px-4 sm:px-8 py-20 sm:py-24">
        <SectionHead no="01" title="Off the clock" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
          {offTheClock.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.06}>
              <div className="border-t border-line pt-4">
                <h3 className="text-sm font-medium text-ink">{item.title}</h3>
                <p className="mt-1.5 text-sm text-muted leading-relaxed">
                  {item.blurb}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 sm:px-8 py-20 sm:py-24">
        <SectionHead no="02" title="Music" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10 max-w-3xl">
          {albums.map((album, i) => {
            const art = findArt(album.file);
            return (
              <Reveal key={album.title} delay={i * 0.08}>
                {art ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={art}
                    alt={`${album.title} album cover`}
                    className="aspect-square w-full object-cover border border-line"
                  />
                ) : (
                  <div className="aspect-square w-full border border-line bg-panel grid place-items-center p-6 text-center">
                    <span className="text-xs text-muted">
                      add public/albums/{album.file}.jpg
                    </span>
                  </div>
                )}
                <h3 className="mt-3 text-sm sm:text-base font-medium text-ink">
                  {album.title}
                </h3>
                <p className="mt-0.5 text-sm text-muted">{album.artist}</p>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 sm:px-8 py-20 sm:py-24 pb-28 sm:pb-36">
        <SectionHead no="03" title="Travel" />
        {photos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {photos.map(({ src, alt }) => (
              <Reveal key={src}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={alt}
                  className="aspect-square w-full object-cover border border-line"
                />
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square w-full border border-line bg-panel grid place-items-center"
                >
                  <span className="text-xs text-muted">photo</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted">
              Photos coming soon. (Add them to public/photos and list them in
              app/personal/page.tsx.)
            </p>
          </Reveal>
        )}
      </section>
    </>
  );
}
