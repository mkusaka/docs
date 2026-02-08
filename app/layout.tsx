import type { Metadata } from "next";
import localFont from "next/font/local";
import { SearchIcon } from "lucide-react";
import { ThemeProvider } from "@/components/ThemeProvider";
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
    <html lang="ja" suppressHydrationWarning>
      <body
        className={`${geist.variable} font-[family-name:var(--font-geist),ui-sans-serif,system-ui,sans-serif] bg-background text-foreground antialiased min-h-screen`}
      >
        <ThemeProvider>
          <Navbar />
          <SearchDialog />
          {children}
          {/* Mobile search FAB */}
          <button
            data-search-trigger
            className="lg:hidden fixed bottom-6 right-6 z-50 size-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center active:scale-95 transition-transform"
            aria-label="Search"
          >
            <SearchIcon className="size-5" />
          </button>
        </ThemeProvider>
      </body>
    </html>
  );
}
