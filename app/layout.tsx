import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import ThemeToggle from "./components/theme-toggle";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Tyler Nguyen",
  description:
    "CS + math at UVA. Builds full-stack and AI things. Seeking summer 2027 SWE internships.",
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#0a0a0a",
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
      data-theme="dark"
      className={`${inter.variable} ${grotesk.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-bg text-ink antialiased">
        <ThemeToggle />
        <main>{children}</main>
      </body>
    </html>
  );
}
