import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "./components/nav";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Tyler Nguyen",
  description: "CS student & aspiring software engineer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-white text-[#1a1a1a] antialiased">
        <div className="flex flex-col lg:flex-row min-h-screen">
          <aside className="w-full lg:w-56 lg:fixed lg:h-screen bg-neutral-50 px-8 pt-10 pb-8 shrink-0 border-b border-neutral-200 lg:border-b-0 lg:border-r lg:border-neutral-200 lg:flex lg:flex-col">
            <Nav />
          </aside>
          <main className="flex-1 lg:ml-56 px-8 py-10 lg:px-16 lg:py-14 max-w-2xl">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
