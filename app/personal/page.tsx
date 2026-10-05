import type { Metadata } from "next";
import Link from "next/link";
import Deadlift from "../components/deadlift";
import OffTheClock from "../components/off-the-clock";
import Photo from "../components/photo";
import { Reveal } from "../components/reveal";
import { HeroName, SectionTitle } from "../components/type";

export const metadata: Metadata = {
  title: "Personal · Tyler Nguyen",
  description: "Music, travel, and everything that doesn't fit on a résumé.",
};

const songs = [
  {
    title: "Disillusioned (with serpentwithfeet)",
    artist: "Daniel Caesar, serpentwithfeet",
    art: "/disillusioned.jpg",
    spotify: "https://open.spotify.com/track/4Jj48NypRej8Rld9U69Nvm",
  },
  {
    title: "X's",
    artist: "Cigarettes After Sex",
    art: "/cigarettesaftersex.jpg",
    spotify: "https://open.spotify.com/track/5HCGI3Hq9VQC56semRgJmz",
  },
  {
    title: "Danielle (smile on my face)",
    artist: "Fred again..",
    art: "/danielle.jpg",
    spotify: "https://open.spotify.com/track/2sLVs5iX0osogh4jcsAJkv",
  },
  {
    title: "7 Summers",
    artist: "Morgan Wallen",
    art: "/7summers.png",
    spotify: "https://open.spotify.com/track/6HS3f7P583DyCWODyGWIXM",
  },
  {
    title: "DON'T BELIEVE IT",
    artist: "John Summit, Absolutely",
    art: "/dontbelieveit.jpg",
    spotify: "https://open.spotify.com/track/5TbTOkgK8UAjtjIuIVPAjE",
  },
  {
    title: "Ivy",
    artist: "Frank Ocean",
    art: "/ivy.jpg",
    spotify: "https://open.spotify.com/track/2ZWlPOoWh0626oTaHrnl2a",
  },
  {
    title: "Pool House",
    artist: "The Backseat Lovers",
    art: "/poolhouse.jpg",
    spotify: "https://open.spotify.com/track/6Kpf6FndBITOaLHVuVbWmj",
  },
  {
    title: "Bad Girls",
    artist: "Blood Orange",
    art: "/badgirls.jpg",
    spotify: "https://open.spotify.com/track/37WUQa7Mcm3aGQOp2rwEZi",
  },
];

// location shows in the hover bubble and doubles as the alt text
const photos = [
  { src: "/pic1.jpg", location: "Kyoto, Japan" },
  { src: "/pic2.jpg", location: "Osaka, Japan" },
  { src: "/pic3.jpg", location: "Mt. Fuji, Japan" },
  { src: "/pic4.jpg", location: "Chelsea, NYC" },
  { src: "/pic5.jpg", location: "Project Glow, DC" },
  { src: "/pic6.jpg", location: "Tokyo Skytree, Japan" },
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
        <OffTheClock />
      </section>

      <section className="mx-auto max-w-5xl px-4 sm:px-8 py-20 sm:py-24">
        <SectionTitle title="On repeat" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-6 sm:gap-10">
          {songs.map((song, i) => (
            <Reveal key={song.title} delay={i * 0.08}>
              <a
                href={song.spotify}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${song.title} by ${song.artist} on Spotify`}
                className="group block"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={song.art}
                  alt={`${song.title} cover art`}
                  className="aspect-square w-full object-cover border border-line transition-transform duration-300 ease-out group-hover:scale-[1.04] group-focus-visible:scale-[1.04]"
                />
                <h3 className="mt-3 text-sm sm:text-base font-medium text-ink">
                  {song.title}
                </h3>
                <p className="mt-0.5 text-sm text-muted">{song.artist}</p>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 sm:px-8 py-20 sm:py-24 pb-28 sm:pb-36">
        <SectionTitle title="Photography" />
        {photos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {photos.map(({ src, location }, i) => (
              // base 0.4s so the first row's fade is actually visible,
              // not swallowed by the scroll-into-view moment
              <Reveal key={src} delay={0.4 + Math.floor(i / 3) * 0.4}>
                <Photo src={src} alt={location} location={location} />
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
