import ContactButton from "./contact-button";
import { GitHubIcon, LinkedInIcon } from "./icons";

export const EMAIL = "wgq4tr@virginia.edu";

// Profiles as icons, the résumé as a plain link, and one filled button for
// the thing I actually want people to do. Used in the top-right corner of
// each page and again in the bar that drops in on scroll; in the bar the
// icons and résumé step aside on phones to leave room for the section links.
export default function SiteLinks({ inBar = false }: { inBar?: boolean }) {
  const secondary = inBar ? "hidden sm:flex" : "flex";
  return (
    <div className="flex shrink-0 items-center gap-4 sm:gap-5">
      <div className={`${secondary} items-center gap-4`}>
        <a
          href="https://github.com/tyl3rn"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="text-muted transition-colors hover:text-ink"
        >
          <GitHubIcon className="h-[18px] w-[18px]" />
        </a>
        <a
          href="https://linkedin.com/in/tyler-nguyen2028"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="text-muted transition-colors hover:text-ink"
        >
          <LinkedInIcon className="h-[17px] w-[17px]" />
        </a>
        <a
          href="/Nguyen__Tyler_Resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted transition-colors hover:text-ink"
        >
          Résumé
        </a>
      </div>
      <ContactButton email={EMAIL} />
    </div>
  );
}
