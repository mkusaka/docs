import type { Metadata } from "next";
import localFont from "next/font/local";
import { Navbar } from "@/components/layout/Navbar";
import { SearchDialog } from "@/components/blog/SearchDialog";
import "./globals.css";

const geist = localFont({
  src: "../public/fonts/Geist-Regular.ttf",
  variable: "--font-geist",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "docs",
    template: "%s — docs",
  },
  description: "mkusaka's blog",
  metadataBase: new URL("https://mkusaka.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="dark">
      <body
        className={`${geist.variable} font-[family-name:var(--font-geist),ui-sans-serif,system-ui,sans-serif] bg-background text-foreground antialiased min-h-screen`}
      >
        <Navbar />
        <SearchDialog />
        {children}
      </body>
    </html>
  );
}
