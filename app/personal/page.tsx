import type { Metadata } from "next";
import Link from "next/link";
import Deadlift from "../components/deadlift";
import { Reveal } from "../components/reveal";
import { HeroName, SectionTitle } from "../components/type";

export const metadata: Metadata = {
  title: "Personal · Tyler Nguyen",
  description: "Music, travel, and everything that doesn't fit on a résumé.",
};

const offTheClock = [
  {
    title: "Concerts",
    blurb:
      "I've been to Laufey, 21 Savage, Swae Lee, Quavo, and Blood Orange.",
  },
  {
    title: "Powerlifting",
    blurb: "Chasing numbers that go up slower than my commit count.",
  },
  {
    title: "Pickleball",
    blurb: "I take this sport way too competitively.",
  },
  {
    title: "Videogames",
    blurb: "Ran Minecraft servers at age 12.",
  },
];

const songs = [
  {
    title: "Disillusioned (with serpentwithfeet)",
    artist: "Daniel Caesar, serpentwithfeet",
    art: "/disillusioned.jpg",
  },
  {
    title: "X's",
    artist: "Cigarettes After Sex",
    art: "/cigarettesaftersex.jpg",
  },
  {
    title: "Danielle (smile on my face)",
    artist: "Fred again..",
    art: "/danielle.jpg",
  },
  {
    title: "7 Summers",
    artist: "Morgan Wallen",
    art: "/7summers.png",
  },
  {
    title: "DON'T BELIEVE IT",
    artist: "John Summit, Absolutely",
    art: "/dontbelieveit.jpg",
  },
  {
    title: "Ivy",
    artist: "Frank Ocean",
    art: "/ivy.jpg",
  },
  {
    title: "Pool House",
    artist: "The Backseat Lovers",
    art: "/poolhouse.jpg",
  },
  {
    title: "Bad Girls",
    artist: "Blood Orange",
    art: "/badgirls.jpg",
  },
];

const photos = [
  { src: "/pic1.jpg", alt: "Photography 1" },
  { src: "/pic2.jpg", alt: "Photography 2" },
  { src: "/pic3.jpg", alt: "Photography 3" },
  { src: "/pic4.jpg", alt: "Photography 4" },
  { src: "/pic5.jpg", alt: "Photography 5" },
  { src: "/pic6.jpg", alt: "Photography 6" },
];

export default function Personal() {
  return (
    <>
      <section className="mx-auto max-w-5xl px-4 sm:px-8 pt-32 sm:pt-40 pb-10 sm:pb-14">
        <HeroName text="Personal" />
        {/* invisible copy of the home-page subtitle so the Home button
            lands exactly where the Personal button was */}
        <p aria-hidden className="invisible mt-6 text-base sm:text-lg leading-relaxed">
          Computer Science @ the University of Virginia
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-5">
          <Link
            href="/"
            className="inline-flex min-w-[6.5rem] justify-center rounded-full bg-ink px-4 py-2 text-sm font-medium text-bg hover:opacity-80 transition-opacity"
          >
            Home
          </Link>
        </div>
      </section>

      <Deadlift />

      <section className="mx-auto max-w-5xl px-4 sm:px-8 py-20 sm:py-24">
        <SectionTitle title="Off the clock" />
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
        <SectionTitle title="On repeat" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {songs.map((song, i) => (
            <Reveal key={song.title} delay={i * 0.08}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={song.art}
                alt={`${song.title} cover art`}
                className="aspect-square w-full object-cover border border-line"
              />
              <h3 className="mt-3 text-sm sm:text-base font-medium text-ink">
                {song.title}
              </h3>
              <p className="mt-0.5 text-sm text-muted">{song.artist}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 sm:px-8 py-20 sm:py-24 pb-28 sm:pb-36">
        <SectionTitle title="Photography" />
        {photos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {photos.map(({ src, alt }, i) => (
              // base 0.4s so the first row's fade is actually visible,
              // not swallowed by the scroll-into-view moment
              <Reveal key={src} delay={0.4 + Math.floor(i / 3) * 0.4}>
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
