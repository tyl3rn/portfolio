import type { Metadata, Viewport } from "next";
import { Recursive } from "next/font/google";
import "./globals.css";
import Backdrop from "./components/backdrop";

// One variable family for everything: MONO, CASL, slnt, and wght axes
// cover the monospace labels, casual display type, and body copy.
const recursive = Recursive({
  variable: "--font-recursive",
  subsets: ["latin"],
  axes: ["CASL", "MONO", "slnt"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tylervannguyen.com"),
  title: "Tyler Nguyen",
  description:
    "CS + math at UVA. Builds backend systems and AI agents. Seeking summer 2027 SWE internships.",
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#e6edf3",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={recursive.variable}
    >
      <body className="bg-bg text-ink antialiased">
        <Backdrop />
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
