import type { Metadata } from "next";
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

// Swap these placeholders for real artists, albums, or playlists.
const onRotation = [
  "[Artist or album]",
  "[Artist or album]",
  "[Artist or album]",
  "[Artist or album]",
  "[Artist or album]",
];

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
          <p className="mt-4 text-base sm:text-lg text-muted leading-relaxed">
            The side that doesn&apos;t fit on a résumé: what I&apos;m listening
            to, where I&apos;ve been, and what I do off the clock.
          </p>
        </div>
      </section>

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          <Reveal className="text-sm sm:text-base text-muted leading-relaxed">
            <p>
              Lo-fi while I work, house when it&apos;s going well, and whatever
              a friend swears will change my life. This is a running list of
              what&apos;s on rotation.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <ul>
              {onRotation.map((item, i) => (
                <li
                  key={i}
                  className="border-t border-line py-3 first:border-t-0 first:pt-0 text-sm text-muted"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
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
